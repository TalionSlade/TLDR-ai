"""
LLM service for generating responses using various LLM providers.
"""
from typing import List, Dict, Any, Optional
from openai import OpenAI
from anthropic import Anthropic


class LLMService:
    """Handles LLM API calls for question answering with RAG."""
    
    def __init__(
        self,
        provider: str = "openai",
        model_name: str = "gpt-4-turbo-preview",
        api_key: Optional[str] = None
    ):
        """
        Initialize LLM service.
        
        Args:
            provider: 'openai' or 'anthropic'
            model_name: Model identifier
            api_key: API key for the provider
        """
        self.provider = provider
        self.model_name = model_name
        
        if provider == "openai":
            # Initialize OpenAI client with explicit settings to avoid proxy issues
            import os
            # Remove proxy environment variables that might interfere
            proxy_vars = ['HTTP_PROXY', 'HTTPS_PROXY', 'http_proxy', 'https_proxy']
            for var in proxy_vars:
                os.environ.pop(var, None)
            
            self.client = OpenAI(
                api_key=api_key,
                timeout=60.0,
                max_retries=2
            )
        elif provider == "anthropic":
            self.client = Anthropic(api_key=api_key)
        else:
            raise ValueError(f"Unsupported provider: {provider}")
    
    def create_rag_prompt(
        self,
        question: str,
        context_chunks: List[Dict[str, Any]]
    ) -> str:
        """
        Create a RAG prompt with context from retrieved documents.
        
        Args:
            question: User's question
            context_chunks: Retrieved document chunks from vector store
        
        Returns:
            Formatted prompt with context
        """
        context_text = "\n\n".join([
            f"[Page {chunk['page']}]\n{chunk['text']}"
            for chunk in context_chunks
        ])

        prompt = f"""You are a helpful AI assistant that answers questions about Terms & Conditions documents.
You will be provided with relevant excerpts from a document and a question.
Your task is to answer the question based on the provided context.

Important instructions:
- Lead with a direct answer in a crisp, professional tone.
- Keep responses tight: use short paragraphs or bullet lists (maximum four bullets).
- Use Markdown formatting (e.g., bullet lists, bold key phrases) when it improves readability.
- Reference specific sections with inline page markers like (Page X).
- If the context doesn't contain enough information, state that briefly and suggest what is missing.
- Translate legal language into plain English without repeating the excerpts verbatim.

Context from document:
{context_text}

Question: {question}

Answer:"""

        return prompt
    
    def generate_response_openai(
        self,
        question: str,
        context_chunks: List[Dict[str, Any]],
    temperature: float = 0.4
    ) -> Dict[str, Any]:
        """
        Generate response using OpenAI API.
        
        Args:
            question: User's question
            context_chunks: Retrieved document chunks
            temperature: Sampling temperature
        
        Returns:
            Response dict with content and references
        """
        prompt = self.create_rag_prompt(question, context_chunks)
        
        response = self.client.chat.completions.create(
            model=self.model_name,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a concise, professional assistant for Terms & Conditions. "
                        "Respond in Markdown using short paragraphs or compact bullet points, "
                        "and reference page numbers inline like (Page X)."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            max_tokens=1000
        )
        
        content = response.choices[0].message.content
        
        # Format references from context chunks
        references = []
        seen_pages = set()
        
        for chunk in context_chunks[:3]:  # Top 3 most relevant
            page = chunk["page"]
            if page not in seen_pages:
                references.append({
                    "page": page,
                    "section": f"Section from Page {page}",
                    "text": chunk["text"][:200] + "..." if len(chunk["text"]) > 200 else chunk["text"]
                })
                seen_pages.add(page)
        
        return {
            "content": content,
            "references": references,
            "model": self.model_name,
            "provider": self.provider
        }
    
    def generate_response_anthropic(
        self,
    question: str,
    context_chunks: List[Dict[str, Any]],
    temperature: float = 0.4
    ) -> Dict[str, Any]:
        """
        Generate response using Anthropic Claude API.
        
        Args:
            question: User's question
            context_chunks: Retrieved document chunks
            temperature: Sampling temperature
        
        Returns:
            Response dict with content and references
        """
        prompt = self.create_rag_prompt(question, context_chunks)
        
        response = self.client.messages.create(
            model=self.model_name,
            max_tokens=1000,
            temperature=temperature,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )
        
        content = response.content[0].text
        
        # Format references
        references = []
        seen_pages = set()
        
        for chunk in context_chunks[:3]:
            page = chunk["page"]
            if page not in seen_pages:
                references.append({
                    "page": page,
                    "section": f"Section from Page {page}",
                    "text": chunk["text"][:200] + "..." if len(chunk["text"]) > 200 else chunk["text"]
                })
                seen_pages.add(page)
        
        return {
            "content": content,
            "references": references,
            "model": self.model_name,
            "provider": self.provider
        }
    
    def generate_response(
        self,
    question: str,
    context_chunks: List[Dict[str, Any]],
    temperature: float = 0.4
    ) -> Dict[str, Any]:
        """
        Generate response using configured provider.
        
        Args:
            question: User's question
            context_chunks: Retrieved document chunks
            temperature: Sampling temperature
        
        Returns:
            Response dict with content and references
        """
        if self.provider == "openai":
            return self.generate_response_openai(question, context_chunks, temperature)
        elif self.provider == "anthropic":
            return self.generate_response_anthropic(question, context_chunks, temperature)
        else:
            raise ValueError(f"Unsupported provider: {self.provider}")
