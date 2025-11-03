"""
FastAPI Backend Server for TLDR Terms & Conditions RAG Chat App
"""
import os
import uuid
from typing import Optional
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from config import settings
from pdf_processor import PDFProcessor
from vector_store import VectorStore
from llm_service import LLMService


# Initialize FastAPI app
app = FastAPI(
    title="TLDR RAG API",
    description="Backend API for Terms & Conditions RAG Chat Application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
pdf_processor = PDFProcessor(
    chunk_size=settings.chunk_size,
    chunk_overlap=settings.chunk_overlap
)
vector_store = VectorStore(embedding_model=settings.embedding_model)
llm_service = None  # Initialized when API key is available

# Session storage (in production, use Redis or database)
sessions = {}


# Request/Response Models
class ChatRequest(BaseModel):
    question: str
    session_id: str
    temperature: Optional[float] = 0.7


class ChatResponse(BaseModel):
    content: str
    references: list[dict]
    model: str
    provider: str


class UploadResponse(BaseModel):
    session_id: str
    filename: str
    total_pages: int
    total_chunks: int
    message: str


# API Endpoints
@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "message": "TLDR RAG API is running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    """Detailed health check."""
    return {
        "status": "healthy",
        "llm_provider": settings.llm_provider,
        "model": settings.model_name,
        "vector_store": settings.vector_store,
        "embedding_model": settings.embedding_model
    }


@app.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Upload and process a PDF document.
    
    - Extracts text from PDF
    - Chunks the content
    - Creates embeddings and stores in vector database
    - Returns a session ID for subsequent chat queries
    """
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    # Read file content
    file_content = await file.read()
    
    # Check file size
    file_size_mb = len(file_content) / (1024 * 1024)
    if file_size_mb > settings.max_upload_size_mb:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Max size: {settings.max_upload_size_mb}MB"
        )
    
    try:
        # Process PDF
        result = pdf_processor.process_pdf(file_content)
        
        # Generate session ID
        session_id = str(uuid.uuid4())
        
        # Store chunks in vector database
        vector_store.add_documents(result["chunks"], session_id)
        
        # Store session metadata
        sessions[session_id] = {
            "filename": file.filename,
            "total_pages": result["total_pages"],
            "total_chunks": result["total_chunks"],
            "pages_data": result["pages_data"]
        }
        
        return UploadResponse(
            session_id=session_id,
            filename=file.filename,
            total_pages=result["total_pages"],
            total_chunks=result["total_chunks"],
            message="PDF processed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing PDF: {str(e)}")


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint for asking questions about uploaded document.
    
    - Retrieves relevant context from vector store
    - Generates response using LLM with RAG
    - Returns answer with references to source pages
    """
    # Validate session
    if request.session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found. Please upload a document first.")
    
    # Initialize LLM service if not already done
    global llm_service
    if llm_service is None:
        api_key = settings.openai_api_key if settings.llm_provider == "openai" else settings.anthropic_api_key
        if not api_key:
            raise HTTPException(
                status_code=500,
                detail=f"API key not configured for {settings.llm_provider}"
            )
        llm_service = LLMService(
            provider=settings.llm_provider,
            model_name=settings.model_name,
            api_key=api_key
        )
    
    try:
        # Search for relevant context
        context_chunks = vector_store.search(request.question, n_results=5)
        
        if not context_chunks:
            return ChatResponse(
                content="I couldn't find relevant information in the document to answer your question. Could you rephrase or ask something else?",
                references=[],
                model=settings.model_name,
                provider=settings.llm_provider
            )
        
        # Generate response using LLM
        response = llm_service.generate_response(
            question=request.question,
            context_chunks=context_chunks,
            temperature=request.temperature
        )
        
        return ChatResponse(**response)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")


@app.delete("/session/{session_id}")
async def delete_session(session_id: str):
    """Delete a session and its associated data."""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Remove from sessions
    del sessions[session_id]
    
    # In a production system, you'd also remove from vector store
    # For now, we'll just clear the collection if it's the last session
    if len(sessions) == 0:
        vector_store.clear_collection()
    
    return {"message": "Session deleted successfully"}


@app.get("/sessions")
async def list_sessions():
    """List all active sessions."""
    return {
        "sessions": [
            {
                "session_id": sid,
                "filename": data["filename"],
                "total_pages": data["total_pages"]
            }
            for sid, data in sessions.items()
        ]
    }


# Run server
if __name__ == "__main__":
    uvicorn.run(
        "BackendServer:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
