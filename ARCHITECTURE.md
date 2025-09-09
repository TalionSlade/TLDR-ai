# TLDR AI - System Architecture

## Overview
The TLDR AI system is a comprehensive document analysis platform that leverages Large Language Models (LLMs), vector databases, and modern web technologies to provide intelligent document summarization and question-answering capabilities for Terms & Conditions documents.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 FRONTEND LAYER                                 │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Landing Page  │    │   App Page      │    │   Components    │
│   - Hero        │    │   - PDF Viewer  │    │   - Button      │
│   - Features    │    │   - Chat UI     │    │   - Card        │
│   - How It Works│    │   - FAQ         │    │   - Spinner     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND CONTEXT                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐              ┌─────────────────┐
│   PDF Context  │              │   Chat Context  │
│   - File State │              │   - Messages    │
│   - Pagination │              │   - Loading     │
│   - Zoom Level │              │   - Session     │
└─────────────────┘              └─────────────────┘
         │                                │
         └────────────┬───────────────────┘
                      │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Service  │    │  Upload Service │    │   Chat Service  │
│   - JWT Token   │    │   - PDF Upload  │    │   - Message     │
│   - Session     │    │   - File Valid. │    │   - Response    │
│   - User Mgmt   │    │   - Metadata    │    │   - History     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             PROCESSING LAYER                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  PDF Processor  │    │  Text Extractor │    │   Chunker      │
│  - Parse PDF    │    │  - OCR Engine   │    │  - Semantic    │
│  - Extract Meta │    │  - Layout Det.  │    │  - Overlap     │
│  - Structure    │    │  - Clean Text   │    │  - Size Opt    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              AI/ML LAYER                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   LLM Service   │    │  Embedding Gen  │    │   RAG Engine    │
│   - GPT-4/Claude│    │  - Text-Ada-002 │    │   - Retrieval   │
│   - Llama 2/3   │    │  - E5-Large     │    │   - Reranking   │
│   - Mistral     │    │  - BGE-M3       │    │   - Context     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB       │    │  Vector DB      │    │   File Storage  │
│   - Sessions    │    │  - Pinecone     │    │   - AWS S3      │
│   - Conversations│  │  - Weaviate     │    │   - MinIO       │
│   - User Data   │    │  - ChromaDB     │    │   - Local FS    │
│   - Analytics   │    │  - FAISS        │    │   - CDN         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           INFRASTRUCTURE                                       │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Container     │    │   Monitoring    │
│   - NGINX       │    │   - Docker      │    │   - Prometheus  │
│   - Cloudflare  │    │   - Kubernetes  │    │   - Grafana     │
│   - Rate Limit  │    │   - Auto Scale  │    │   - Logs        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Component Details

### Frontend Layer
- **React + TypeScript**: Modern web application framework
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Framer Motion**: Animation library for smooth interactions
- **React Router**: Client-side routing
- **React PDF**: PDF viewing capabilities

### State Management
- **Context API**: 
  - `PDFContext`: Manages PDF file state, pagination, zoom
  - `ChatContext`: Handles conversation state, messages, loading

### API Services Layer

#### Authentication Service
- JWT token management
- Session handling
- User registration/login
- Role-based access control

#### Upload Service
- PDF file upload handling
- File validation (type, size, security)
- Metadata extraction
- Storage orchestration

#### Chat Service
- Message handling
- Real-time communication (WebSocket/SSE)
- Conversation history
- Response streaming

### Processing Layer

#### PDF Processor
- PDF parsing and structure extraction
- Metadata extraction (title, author, creation date)
- Page counting and layout analysis
- Security validation

#### Text Extractor
- OCR for scanned PDFs (Tesseract/AWS Textract)
- Layout detection and preservation
- Text cleaning and normalization
- Table and form extraction

#### Document Chunker
- Semantic chunking based on document structure
- Overlap management for context preservation
- Chunk size optimization for embeddings
- Hierarchical chunking for complex documents

### AI/ML Layer

#### LLM Integration
- **Primary LLMs**: GPT-4, Claude-3, Llama 3
- **Fallback Options**: Mistral, Cohere
- Prompt engineering and optimization
- Response validation and safety filters

#### Embedding Generation
- **Models**: text-embedding-ada-002, E5-large, BGE-M3
- Batch processing for efficiency
- Caching for repeated documents
- Multi-language support

#### RAG Engine
- Semantic similarity search
- Hybrid search (semantic + keyword)
- Reranking algorithms
- Context window optimization
- Citation and reference tracking

### Data Layer

#### MongoDB Collections
```javascript
// Users
{
  _id: ObjectId,
  email: String,
  name: String,
  subscription: String,
  createdAt: Date
}

// Sessions
{
  _id: ObjectId,
  userId: ObjectId,
  documentId: ObjectId,
  createdAt: Date,
  lastActivity: Date,
  settings: Object
}

// Conversations
{
  _id: ObjectId,
  sessionId: ObjectId,
  messages: [{
    id: String,
    content: String,
    role: String, // 'user' | 'assistant'
    timestamp: Date,
    references: Array
  }],
  createdAt: Date,
  updatedAt: Date
}

// Documents
{
  _id: ObjectId,
  userId: ObjectId,
  filename: String,
  size: Number,
  pages: Number,
  uploadedAt: Date,
  processedAt: Date,
  status: String, // 'processing' | 'ready' | 'error'
  metadata: Object
}

// Analytics
{
  _id: ObjectId,
  userId: ObjectId,
  sessionId: ObjectId,
  eventType: String,
  eventData: Object,
  timestamp: Date
}
```

#### Vector Database Schema
- **Pinecone/Weaviate/ChromaDB**
- Document chunks with embeddings
- Metadata filtering capabilities
- Namespace organization by user/document

#### File Storage
- **Primary**: AWS S3 or compatible (MinIO)
- **CDN**: CloudFront for global distribution
- **Backup**: Redundant storage across regions

## Data Flow

### Document Upload Flow
```
1. User uploads PDF → Frontend
2. File validation → Upload Service
3. Store original file → File Storage
4. Extract text → PDF Processor
5. Generate chunks → Chunker
6. Create embeddings → Embedding Service
7. Store vectors → Vector Database
8. Update document status → MongoDB
9. Notify frontend → WebSocket
```

### Chat Flow
```
1. User sends message → Frontend
2. Store message → MongoDB
3. Retrieve relevant chunks → Vector Database (RAG)
4. Generate response → LLM Service
5. Store response → MongoDB
6. Stream to frontend → WebSocket/SSE
```

## Security Considerations

- **Authentication**: JWT with refresh tokens
- **File Upload**: Virus scanning, type validation, size limits
- **API Rate Limiting**: Per-user and global limits
- **Data Encryption**: At rest and in transit
- **PDF Security**: Malware scanning, content filtering
- **LLM Safety**: Prompt injection prevention, content moderation

## Scalability Features

- **Horizontal Scaling**: Containerized microservices
- **Load Balancing**: NGINX with health checks
- **Caching**: Redis for sessions and frequent queries
- **CDN**: Static asset optimization
- **Database Sharding**: MongoDB sharding for large datasets
- **Queue System**: Bull/Celery for async processing

## Performance Optimizations

- **Frontend**: Code splitting, lazy loading, service worker
- **API**: Response caching, connection pooling
- **Processing**: Batch operations, parallel processing
- **Embeddings**: Cached embeddings, efficient similarity search
- **LLM**: Response caching, model optimization

## Monitoring & Observability

- **Metrics**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: Jaeger for distributed tracing
- **Alerting**: PagerDuty integration
- **Health Checks**: Comprehensive endpoint monitoring

## Deployment Architecture

- **Environment Segregation**: Dev, Staging, Production
- **Container Orchestration**: Kubernetes with Helm charts
- **CI/CD**: GitHub Actions with automated testing
- **Infrastructure as Code**: Terraform/Pulumi
- **Disaster Recovery**: Multi-region deployment with backups

This architecture provides a robust, scalable foundation for the TLDR AI system while maintaining flexibility for future enhancements and integrations.
