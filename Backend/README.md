# TLDR Backend API

FastAPI-based backend for the Terms & Conditions RAG Chat Application.

## Features

- PDF upload and text extraction
- Document chunking and embedding generation
- Vector-based semantic search using ChromaDB
- LLM integration (OpenAI/Anthropic) for RAG-based Q&A
- Session management for multiple documents

## Setup

### 1. Install Python Dependencies

```powershell
cd Backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and add your API keys:

```powershell
cp .env.example .env
```

Edit `.env` and set:
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` (depending on your provider)
- `LLM_PROVIDER` (openai or anthropic)
- `MODEL_NAME` (e.g., gpt-4-turbo-preview or claude-3-sonnet-20240229)

### 3. Run the Server

```powershell
# Development mode with auto-reload
python BackendServer.py

# Or using uvicorn directly
uvicorn BackendServer:app --reload --port 8000
```

The API will be available at: http://localhost:8000

## API Endpoints

### Health Check
```
GET /
GET /health
```

### Upload PDF
```
POST /upload
Content-Type: multipart/form-data

Body:
- file: PDF file

Response:
{
  "session_id": "uuid",
  "filename": "document.pdf",
  "total_pages": 10,
  "total_chunks": 45,
  "message": "PDF processed successfully"
}
```

### Chat
```
POST /chat
Content-Type: application/json

Body:
{
  "question": "What is the refund policy?",
  "session_id": "uuid",
  "temperature": 0.7
}

Response:
{
  "content": "Answer from LLM...",
  "references": [
    {
      "page": 3,
      "section": "Section from Page 3",
      "text": "Relevant excerpt..."
    }
  ],
  "model": "gpt-4-turbo-preview",
  "provider": "openai"
}
```

### Session Management
```
GET /sessions
DELETE /session/{session_id}
```

## Architecture

- **FastAPI**: Modern async web framework
- **PDFProcessor**: Text extraction using PyPDF2/pdfplumber + LangChain chunking
- **VectorStore**: ChromaDB for embeddings + semantic search
- **LLMService**: OpenAI/Anthropic integration for RAG responses

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

The server runs in debug mode by default with auto-reload. Any changes to `.py` files will trigger a restart.

## Production Considerations

For production deployment:
1. Set `DEBUG=False` in `.env`
2. Use a proper session store (Redis/PostgreSQL)
3. Add authentication/authorization
4. Set up proper CORS origins
5. Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)
6. Implement rate limiting
7. Add request validation and sanitization
