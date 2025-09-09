# TLDR AI - Technical Implementation Guide

## Technology Stack

### Frontend (Current)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: TailwindCSS 3.x
- **State Management**: React Context API
- **Routing**: React Router DOM
- **PDF Handling**: react-pdf
- **Animation**: Framer Motion
- **HTTP Client**: Fetch API (to be replaced with Axios)

### Backend (To Be Implemented)
- **Runtime**: Node.js 20+ with Express.js
- **Language**: TypeScript
- **API Style**: RESTful with GraphQL consideration
- **Authentication**: JWT + Passport.js
- **File Handling**: Multer + Sharp
- **PDF Processing**: pdf-parse, pdf2pic
- **WebSocket**: Socket.io
- **Validation**: Joi/Zod
- **Testing**: Jest + Supertest

### Databases
```yaml
MongoDB:
  version: "7.0+"
  driver: "mongoose"
  use_cases:
    - User management
    - Session storage
    - Conversation history
    - Document metadata
    - Analytics

Vector Database Options:
  primary: "Pinecone" # Managed, scalable
  alternatives:
    - "Weaviate" # Self-hosted, flexible
    - "ChromaDB" # Lightweight, embedded
    - "FAISS + PostgreSQL" # Cost-effective hybrid

Redis:
  version: "7.0+"
  use_cases:
    - Session caching
    - Rate limiting
    - LLM response caching
    - Real-time features
```

### AI/ML Integration
```yaml
LLM Providers:
  primary: "OpenAI GPT-4"
  backup: "Anthropic Claude-3"
  local_option: "Llama 3 (70B)"
  
Embedding Models:
  openai: "text-embedding-3-large"
  huggingface: "sentence-transformers/all-MiniLM-L6-v2"
  local: "BAAI/bge-large-en-v1.5"

Processing:
  ocr: "AWS Textract" # or Tesseract for self-hosted
  chunking: "LangChain RecursiveCharacterTextSplitter"
  reranking: "Cohere Rerank API"
```

## API Design

### Authentication Endpoints
```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
}

// POST /api/auth/refresh
interface RefreshRequest {
  refreshToken: string;
}
```

### Document Management
```typescript
// POST /api/documents/upload
interface UploadResponse {
  documentId: string;
  status: 'processing' | 'ready' | 'error';
  metadata: {
    filename: string;
    size: number;
    pages: number;
    uploadedAt: string;
  };
}

// GET /api/documents/:id
interface DocumentResponse {
  id: string;
  filename: string;
  status: string;
  pages: number;
  processedAt: string;
  summary?: string;
}

// DELETE /api/documents/:id
interface DeleteResponse {
  success: boolean;
  message: string;
}
```

### Chat API
```typescript
// POST /api/chat/sessions
interface CreateSessionRequest {
  documentId: string;
}

// POST /api/chat/sessions/:id/messages
interface SendMessageRequest {
  content: string;
  sessionId: string;
}

// GET /api/chat/sessions/:id/messages
interface MessagesResponse {
  messages: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: string;
    references?: Array<{
      page: number;
      section: string;
      text: string;
      confidence: number;
    }>;
  }>;
}
```

## Database Schemas

### MongoDB Collections

```javascript
// users.js
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  name: { type: String, required: true },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  usage: {
    documentsProcessed: { type: Number, default: 0 },
    tokensUsed: { type: Number, default: 0 },
    lastResetDate: { type: Date, default: Date.now }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// documents.js
const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  size: { type: Number, required: true },
  mimeType: { type: String, required: true },
  pages: { type: Number },
  status: {
    type: String,
    enum: ['uploading', 'processing', 'ready', 'error'],
    default: 'uploading'
  },
  processingSteps: {
    uploaded: { type: Boolean, default: false },
    textExtracted: { type: Boolean, default: false },
    chunked: { type: Boolean, default: false },
    embedded: { type: Boolean, default: false },
    indexed: { type: Boolean, default: false }
  },
  metadata: {
    title: String,
    author: String,
    creationDate: Date,
    language: { type: String, default: 'en' }
  },
  summary: String,
  keyTopics: [String],
  storageUrl: String,
  vectorNamespace: String,
  uploadedAt: { type: Date, default: Date.now },
  processedAt: Date,
  errorMessage: String
});

// sessions.js
const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document', required: true },
  title: String,
  settings: {
    model: { type: String, default: 'gpt-4' },
    temperature: { type: Number, default: 0.7 },
    maxTokens: { type: Number, default: 1000 }
  },
  createdAt: { type: Date, default: Date.now },
  lastActivity: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

// conversations.js
const conversationSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  messages: [{
    id: { type: String, required: true },
    content: { type: String, required: true },
    role: { type: String, enum: ['user', 'assistant'], required: true },
    timestamp: { type: Date, default: Date.now },
    references: [{
      page: Number,
      section: String,
      text: String,
      confidence: Number,
      chunkId: String
    }],
    metadata: {
      model: String,
      tokens: Number,
      processingTime: Number
    }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
```

### Vector Database Schema (Pinecone)

```python
# Document chunks structure
vector_metadata = {
    "document_id": "doc_12345",
    "user_id": "user_67890",
    "chunk_id": "chunk_001",
    "page": 3,
    "section": "Privacy Policy",
    "text": "We collect personal information...",
    "chunk_type": "paragraph",  # paragraph, list_item, table_cell, header
    "word_count": 45,
    "character_count": 280,
    "language": "en"
}

# Index structure
index_config = {
    "dimension": 1536,  # for text-embedding-3-large
    "metric": "cosine",
    "pod_type": "p1.x1"
}
```

## Processing Pipeline

### Document Processing Flow

```typescript
// Document Processing Service
class DocumentProcessor {
  async processDocument(documentId: string): Promise<void> {
    const document = await Document.findById(documentId);
    
    try {
      // Step 1: Extract text
      await this.updateStatus(documentId, 'processing');
      const textContent = await this.extractText(document.storageUrl);
      
      // Step 2: Create chunks
      const chunks = await this.chunkDocument(textContent);
      
      // Step 3: Generate embeddings
      const embeddings = await this.generateEmbeddings(chunks);
      
      // Step 4: Store in vector database
      await this.storeVectors(documentId, chunks, embeddings);
      
      // Step 5: Generate summary
      const summary = await this.generateSummary(textContent);
      
      // Step 6: Extract key topics
      const topics = await this.extractTopics(textContent);
      
      // Step 7: Update document
      await Document.findByIdAndUpdate(documentId, {
        status: 'ready',
        summary,
        keyTopics: topics,
        processedAt: new Date(),
        'processingSteps.textExtracted': true,
        'processingSteps.chunked': true,
        'processingSteps.embedded': true,
        'processingSteps.indexed': true
      });
      
    } catch (error) {
      await this.handleError(documentId, error);
    }
  }
}
```

### RAG Query Flow

```typescript
class RAGService {
  async queryDocument(
    documentId: string,
    question: string,
    options: {
      topK?: number;
      threshold?: number;
      rerank?: boolean;
    } = {}
  ): Promise<RAGResponse> {
    
    // Step 1: Generate query embedding
    const queryEmbedding = await this.embeddingService.embed(question);
    
    // Step 2: Search vector database
    const searchResults = await this.vectorDB.query({
      vector: queryEmbedding,
      topK: options.topK || 10,
      filter: { document_id: documentId },
      includeMetadata: true
    });
    
    // Step 3: Rerank results (optional)
    const rankedResults = options.rerank 
      ? await this.rerankService.rerank(question, searchResults)
      : searchResults;
    
    // Step 4: Create context
    const context = this.buildContext(rankedResults.slice(0, 5));
    
    // Step 5: Generate response
    const response = await this.llmService.generateResponse({
      question,
      context,
      systemPrompt: this.getSystemPrompt('legal_document')
    });
    
    // Step 6: Extract references
    const references = this.extractReferences(rankedResults, response);
    
    return {
      answer: response.text,
      references,
      confidence: response.confidence,
      tokensUsed: response.tokensUsed
    };
  }
}
```

## Infrastructure Configuration

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Frontend
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000/api
      - VITE_WS_URL=ws://localhost:8000
    depends_on:
      - backend

  # Backend API
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=development
      - MONGODB_URL=mongodb://mongo:27017/tldr_ai
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
      - AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
    depends_on:
      - mongo
      - redis
    volumes:
      - ./uploads:/app/uploads

  # MongoDB
  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}

  # Redis
  redis:
    image: redis:7.0-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Processing Workers
  worker:
    build: ./backend
    command: npm run worker
    environment:
      - NODE_ENV=development
      - MONGODB_URL=mongodb://mongo:27017/tldr_ai
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
    depends_on:
      - mongo
      - redis
    volumes:
      - ./uploads:/app/uploads

volumes:
  mongo_data:
  redis_data:
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tldr-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: tldr-backend
  template:
    metadata:
      labels:
        app: tldr-backend
    spec:
      containers:
      - name: backend
        image: tldr-ai/backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: NODE_ENV
          value: "production"
        - name: MONGODB_URL
          valueFrom:
            secretKeyRef:
              name: tldr-secrets
              key: mongodb-url
        - name: OPENAI_API_KEY
          valueFrom:
            secretKeyRef:
              name: tldr-secrets
              key: openai-key
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

## Development Roadmap

### Phase 1: Backend Foundation (4-6 weeks)
- [ ] Set up Express.js backend with TypeScript
- [ ] Implement authentication system
- [ ] Create MongoDB schemas and connections
- [ ] Build file upload and processing pipeline
- [ ] Set up Redis for caching and sessions

### Phase 2: AI Integration (3-4 weeks)
- [ ] Integrate OpenAI API for embeddings and chat
- [ ] Set up Pinecone vector database
- [ ] Implement RAG pipeline
- [ ] Add document chunking and processing
- [ ] Create LLM prompt engineering system

### Phase 3: Frontend Enhancement (2-3 weeks)
- [ ] Update frontend to use real API endpoints
- [ ] Implement real-time chat with WebSockets
- [ ] Add user authentication flows
- [ ] Create document management interface
- [ ] Add error handling and loading states

### Phase 4: Production Readiness (3-4 weeks)
- [ ] Add comprehensive testing suite
- [ ] Implement monitoring and logging
- [ ] Set up CI/CD pipeline
- [ ] Add rate limiting and security measures
- [ ] Performance optimization and caching

### Phase 5: Advanced Features (4-6 weeks)
- [ ] Multi-language support
- [ ] Advanced document types (Word, PowerPoint)
- [ ] Batch processing capabilities
- [ ] Analytics and insights dashboard
- [ ] Mobile responsive improvements

This technical implementation guide provides the detailed foundation needed to transform your current frontend prototype into a production-ready AI-powered document analysis platform.
