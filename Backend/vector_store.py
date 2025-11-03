"""
Vector store management for document embeddings and semantic search using FAISS.
"""
from typing import List, Dict, Any, Optional
import numpy as np
import pickle
import os


class VectorStore:
    """Manages document embeddings and semantic search using FAISS and SentenceTransformers."""
    
    def __init__(self, embedding_model: str = "all-MiniLM-L6-v2"):
        """
        Initialize vector store.
        
        Args:
            embedding_model: Name of sentence-transformers model to use
        """
        self.embedding_model_name = embedding_model
        self.model = None
        self.index = None
        self.documents = []  # Store document metadata
        self.embeddings_dim = 384  # Dimension for all-MiniLM-L6-v2
        self._initialized = False
        self.storage_dir = "./faiss_store"
        
        # Create storage directory if it doesn't exist
        os.makedirs(self.storage_dir, exist_ok=True)
    
    def _lazy_init(self):
        """Lazy initialization to avoid import issues at module load time."""
        if self._initialized:
            return
            
        # Import here to avoid any potential issues at module load time
        from sentence_transformers import SentenceTransformer
        import faiss
        
        self.model = SentenceTransformer(self.embedding_model_name)
        
        # Initialize FAISS index with cosine similarity (using inner product on normalized vectors)
        self.index = faiss.IndexFlatIP(self.embeddings_dim)
        
        self._initialized = True
        print(f"✓ Vector store initialized with FAISS and {self.embedding_model_name}")
    
    def create_collection(self, collection_name: str = "pdf_documents"):
        """Create or load collection for storing document embeddings."""
        self._lazy_init()
        
        # Try to load existing index and documents
        index_path = os.path.join(self.storage_dir, f"{collection_name}.index")
        docs_path = os.path.join(self.storage_dir, f"{collection_name}.pkl")
        
        if os.path.exists(index_path) and os.path.exists(docs_path):
            try:
                import faiss
                self.index = faiss.read_index(index_path)
                with open(docs_path, 'rb') as f:
                    self.documents = pickle.load(f)
                print(f"✓ Loaded existing collection: {collection_name}")
            except Exception as e:
                print(f"Warning: Could not load existing collection: {e}")
                print("Creating new collection...")
    
    def save_collection(self, collection_name: str = "pdf_documents"):
        """Save the current index and documents to disk."""
        if not self._initialized or self.index is None:
            return
            
        try:
            import faiss
            index_path = os.path.join(self.storage_dir, f"{collection_name}.index")
            docs_path = os.path.join(self.storage_dir, f"{collection_name}.pkl")
            
            faiss.write_index(self.index, index_path)
            with open(docs_path, 'wb') as f:
                pickle.dump(self.documents, f)
            print(f"✓ Saved collection: {collection_name}")
        except Exception as e:
            print(f"Warning: Could not save collection: {e}")
    
    def delete_collection(self, collection_name: str = "pdf_documents"):
        """Delete a collection from disk."""
        index_path = os.path.join(self.storage_dir, f"{collection_name}.index")
        docs_path = os.path.join(self.storage_dir, f"{collection_name}.pkl")
        
        try:
            if os.path.exists(index_path):
                os.remove(index_path)
            if os.path.exists(docs_path):
                os.remove(docs_path)
            print(f"✓ Deleted collection: {collection_name}")
        except Exception as e:
            print(f"Error deleting collection: {e}")
    
    def add_documents(self, chunks: List[Dict[str, Any]], document_id: str):
        """
        Add document chunks to vector store with embeddings.
        
        Args:
            chunks: List of chunk dicts from PDFProcessor
            document_id: Unique identifier for this document
        """
        self._lazy_init()
        
        if not chunks:
            print("Warning: No chunks to add")
            return
        
        texts = [chunk["text"] for chunk in chunks]
        print(f"Generating embeddings for {len(texts)} chunks...")
        embeddings = self.model.encode(texts, show_progress_bar=True, normalize_embeddings=True)
        
        # Convert to numpy array if not already
        if not isinstance(embeddings, np.ndarray):
            embeddings = np.array(embeddings)
        
        # Add embeddings to FAISS index
        self.index.add(embeddings.astype('float32'))
        
        # Store document metadata
        for idx, chunk in enumerate(chunks):
            self.documents.append({
                "text": chunk["text"],
                "page": chunk["page"],
                "chunk_index": chunk["chunk_index"],
                "total_pages": chunk.get("total_pages", 0),
                "document_id": document_id
            })
        
        print(f"✓ Added {len(chunks)} chunks to vector store")
        
        # Save the collection
        self.save_collection()
    
    def search(self, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """
        Semantic search for relevant document chunks.
        
        Args:
            query: Search query
            n_results: Number of results to return
        
        Returns:
            List of relevant chunks with metadata
        """
        self._lazy_init()
        
        if self.index is None or len(self.documents) == 0:
            print("Warning: No documents in index")
            return []
        
        # Generate query embedding (normalized for cosine similarity)
        query_embedding = self.model.encode([query], normalize_embeddings=True)
        
        if not isinstance(query_embedding, np.ndarray):
            query_embedding = np.array(query_embedding)
        
        # Search in FAISS index
        n_results = min(n_results, len(self.documents))
        distances, indices = self.index.search(query_embedding.astype('float32'), n_results)
        
        # Format results
        formatted_results = []
        
        for idx, distance in zip(indices[0], distances[0]):
            if idx < len(self.documents):
                doc = self.documents[idx]
                formatted_results.append({
                    "text": doc["text"],
                    "page": doc["page"],
                    "chunk_index": doc["chunk_index"],
                    "similarity": float(distance)  # Cosine similarity (higher is better)
                })
        
        return formatted_results
    
    def clear_collection(self):
        """Clear all documents from current collection."""
        import faiss
        self.index = faiss.IndexFlatIP(self.embeddings_dim)
        self.documents = []
        print("✓ Cleared collection")
