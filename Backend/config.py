import os
from typing import Optional
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration using Pydantic settings."""
    
    # API Keys
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    
    # LLM Configuration
    llm_provider: str = "openai"
    model_name: str = "gpt-4-turbo-preview"
    
    # Server Configuration
    port: int = 8000
    host: str = "0.0.0.0"
    cors_origins: str = "http://localhost:5173,http://localhost:3000"
    
    # Vector Store Configuration
    vector_store: str = "faiss"
    embedding_model: str = "all-MiniLM-L6-v2"
    chunk_size: int = 1000
    chunk_overlap: int = 200
    
    # Application Settings
    max_upload_size_mb: int = 10
    debug: bool = True
    
    model_config = {
        "protected_namespaces": (),
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "ignore"  # Ignore extra fields from other .env files
    }
        
    @property
    def cors_origins_list(self) -> list[str]:
        """Convert comma-separated CORS origins to list."""
        return [origin.strip() for origin in self.cors_origins.split(",")]


settings = Settings()
