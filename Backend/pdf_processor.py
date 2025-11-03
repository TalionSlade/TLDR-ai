"""
PDF processing utilities for extracting and chunking text from PDF files.
"""
import io
from typing import List, Dict, Any
import PyPDF2
import pdfplumber
from langchain.text_splitter import RecursiveCharacterTextSplitter


class PDFProcessor:
    """Handles PDF text extraction and chunking."""
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )
    
    def extract_text_pypdf2(self, pdf_file: bytes) -> List[Dict[str, Any]]:
        """
        Extract text from PDF using PyPDF2.
        Returns list of dicts with page number and text.
        """
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_file))
        pages_data = []
        
        for page_num, page in enumerate(pdf_reader.pages, start=1):
            text = page.extract_text()
            if text.strip():
                pages_data.append({
                    "page": page_num,
                    "text": text,
                    "total_pages": len(pdf_reader.pages)
                })
        
        return pages_data
    
    def extract_text_pdfplumber(self, pdf_file: bytes) -> List[Dict[str, Any]]:
        """
        Extract text from PDF using pdfplumber (more accurate for complex layouts).
        Returns list of dicts with page number and text.
        """
        pages_data = []
        
        with pdfplumber.open(io.BytesIO(pdf_file)) as pdf:
            for page_num, page in enumerate(pdf.pages, start=1):
                text = page.extract_text()
                if text and text.strip():
                    pages_data.append({
                        "page": page_num,
                        "text": text,
                        "total_pages": len(pdf.pages)
                    })
        
        return pages_data
    
    def extract_text(self, pdf_file: bytes, method: str = "pdfplumber") -> List[Dict[str, Any]]:
        """
        Extract text from PDF using specified method.
        
        Args:
            pdf_file: PDF file as bytes
            method: 'pypdf2' or 'pdfplumber'
        
        Returns:
            List of page data dicts
        """
        if method == "pypdf2":
            return self.extract_text_pypdf2(pdf_file)
        else:
            return self.extract_text_pdfplumber(pdf_file)
    
    def chunk_pages(self, pages_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Split pages into smaller chunks for better retrieval.
        
        Args:
            pages_data: List of page data from extract_text
        
        Returns:
            List of chunk dicts with metadata
        """
        chunks = []
        
        for page_data in pages_data:
            page_num = page_data["page"]
            text = page_data["text"]
            
            # Split text into chunks
            text_chunks = self.text_splitter.split_text(text)
            
            for chunk_idx, chunk_text in enumerate(text_chunks):
                chunks.append({
                    "text": chunk_text,
                    "page": page_num,
                    "chunk_index": chunk_idx,
                    "total_pages": page_data.get("total_pages", 0)
                })
        
        return chunks
    
    def process_pdf(self, pdf_file: bytes) -> Dict[str, Any]:
        """
        Complete PDF processing pipeline.
        
        Args:
            pdf_file: PDF file as bytes
        
        Returns:
            Dict with pages_data and chunks
        """
        pages_data = self.extract_text(pdf_file)
        chunks = self.chunk_pages(pages_data)
        
        return {
            "pages_data": pages_data,
            "chunks": chunks,
            "total_pages": len(pages_data),
            "total_chunks": len(chunks)
        }
