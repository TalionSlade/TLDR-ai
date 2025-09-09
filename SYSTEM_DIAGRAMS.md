# TLDR AI - System Architecture Diagrams

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Frontend]
        Mobile[Mobile App]
    end
    
    subgraph "API Gateway"
        Gateway[Load Balancer<br/>NGINX]
        Auth[Auth Service]
        Rate[Rate Limiter]
    end
    
    subgraph "Application Services"
        API[Express.js API]
        Chat[Chat Service]
        Upload[Upload Service]
        Process[Document Processor]
    end
    
    subgraph "AI/ML Services"
        LLM[LLM Service<br/>GPT-4/Claude]
        Embed[Embedding Service<br/>OpenAI/HuggingFace]
        RAG[RAG Engine]
    end
    
    subgraph "Data Layer"
        Mongo[(MongoDB<br/>Sessions/Users)]
        Vector[(Vector DB<br/>Pinecone/Weaviate)]
        Redis[(Redis<br/>Cache/Queue)]
        S3[(File Storage<br/>AWS S3/MinIO)]
    end
    
    UI --> Gateway
    Mobile --> Gateway
    Gateway --> Auth
    Gateway --> Rate
    Auth --> API
    Rate --> API
    
    API --> Chat
    API --> Upload
    API --> Process
    
    Chat --> RAG
    Process --> Embed
    RAG --> LLM
    RAG --> Vector
    
    API --> Mongo
    API --> Redis
    Upload --> S3
    Process --> S3
    Embed --> Vector
    
    classDef client fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef service fill:#e8f5e8
    classDef ai fill:#fff3e0
    classDef data fill:#fce4ec
    
    class UI,Mobile client
    class Gateway,Auth,Rate gateway
    class API,Chat,Upload,Process service
    class LLM,Embed,RAG ai
    class Mongo,Vector,Redis,S3 data
```

## Document Processing Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant P as Processor
    participant E as Embeddings
    participant V as Vector DB
    participant M as MongoDB
    participant S as Storage

    U->>F: Upload PDF
    F->>A: POST /documents/upload
    A->>S: Store file
    A->>M: Create document record
    A->>P: Queue processing
    A->>F: Return document ID
    
    P->>S: Retrieve file
    P->>P: Extract text & metadata
    P->>P: Create chunks
    P->>E: Generate embeddings
    E->>P: Return vectors
    P->>V: Store vectors
    P->>M: Update status to 'ready'
    P->>F: Notify completion (WebSocket)
    
    F->>U: Show "Document Ready"
```

## Chat Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API
    participant R as RAG Engine
    participant V as Vector DB
    participant L as LLM
    participant M as MongoDB

    U->>F: Ask question
    F->>A: POST /chat/message
    A->>M: Store user message
    
    A->>R: Process query
    R->>V: Search similar chunks
    V->>R: Return relevant chunks
    R->>L: Generate response with context
    L->>R: Return AI response
    R->>A: Response + references
    
    A->>M: Store AI message
    A->>F: Stream response (WebSocket)
    F->>U: Display answer
```

## Data Flow Architecture

```mermaid
flowchart TD
    subgraph "Input Layer"
        PDF[PDF Upload]
        Query[User Query]
    end
    
    subgraph "Processing Pipeline"
        Extract[Text Extraction]
        Clean[Text Cleaning]
        Chunk[Document Chunking]
        Embed[Generate Embeddings]
        Store[Store Vectors]
    end
    
    subgraph "Retrieval Pipeline"
        QEmbed[Query Embedding]
        Search[Vector Search]
        Rerank[Reranking]
        Context[Context Building]
        Generate[LLM Generation]
    end
    
    subgraph "Storage Systems"
        FileStore[(File Storage)]
        VectorStore[(Vector Database)]
        DocStore[(MongoDB)]
        Cache[(Redis Cache)]
    end
    
    PDF --> Extract
    Extract --> Clean
    Clean --> Chunk
    Chunk --> Embed
    Embed --> Store
    Store --> VectorStore
    
    Query --> QEmbed
    QEmbed --> Search
    Search --> VectorStore
    VectorStore --> Rerank
    Rerank --> Context
    Context --> Generate
    
    PDF --> FileStore
    Generate --> DocStore
    Search --> Cache
    
    classDef input fill:#e3f2fd
    classDef process fill:#e8f5e8
    classDef storage fill:#fce4ec
    
    class PDF,Query input
    class Extract,Clean,Chunk,Embed,Store,QEmbed,Search,Rerank,Context,Generate process
    class FileStore,VectorStore,DocStore,Cache storage
```

## Microservices Architecture

```mermaid
graph TB
    subgraph "Frontend"
        React[React App]
        PWA[PWA Mobile]
    end
    
    subgraph "API Gateway"
        Kong[Kong Gateway]
        Auth[Auth0/JWT]
    end
    
    subgraph "Core Services"
        User[User Service]
        Doc[Document Service]
        Chat[Chat Service]
        Analytics[Analytics Service]
    end
    
    subgraph "Processing Services"
        Upload[Upload Service]
        PDF[PDF Processor]
        Text[Text Extractor]
        Vector[Vector Service]
    end
    
    subgraph "AI Services"
        LLM[LLM Gateway]
        Embeddings[Embedding Service]
        RAG[RAG Service]
    end
    
    subgraph "Infrastructure"
        Queue[Message Queue<br/>Bull/Redis]
        Monitor[Monitoring<br/>Prometheus]
        Logging[Logging<br/>ELK Stack]
    end
    
    React --> Kong
    PWA --> Kong
    Kong --> Auth
    Kong --> User
    Kong --> Doc
    Kong --> Chat
    Kong --> Analytics
    
    Doc --> Upload
    Upload --> PDF
    PDF --> Text
    Text --> Vector
    Vector --> Embeddings
    
    Chat --> RAG
    RAG --> LLM
    RAG --> Vector
    
    Upload --> Queue
    PDF --> Queue
    Text --> Queue
    
    User --> Monitor
    Doc --> Monitor
    Chat --> Monitor
    
    User --> Logging
    Doc --> Logging
    Chat --> Logging
    
    classDef frontend fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef core fill:#e8f5e8
    classDef processing fill:#fff8e1
    classDef ai fill:#fff3e0
    classDef infra fill:#f1f8e9
    
    class React,PWA frontend
    class Kong,Auth gateway
    class User,Doc,Chat,Analytics core
    class Upload,PDF,Text,Vector processing
    class LLM,Embeddings,RAG ai
    class Queue,Monitor,Logging infra
```

## Database Schema Relationships

```mermaid
erDiagram
    USER {
        ObjectId _id PK
        string email UK
        string passwordHash
        string name
        string subscription
        object usage
        date createdAt
    }
    
    DOCUMENT {
        ObjectId _id PK
        ObjectId userId FK
        string filename
        string originalName
        number size
        string status
        object metadata
        string summary
        array keyTopics
        date uploadedAt
    }
    
    SESSION {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId documentId FK
        string title
        object settings
        date createdAt
        date lastActivity
    }
    
    CONVERSATION {
        ObjectId _id PK
        ObjectId sessionId FK
        array messages
        date createdAt
        date updatedAt
    }
    
    VECTOR_CHUNK {
        string id PK
        ObjectId documentId FK
        number page
        string section
        string text
        array embedding
        object metadata
    }
    
    USER ||--o{ DOCUMENT : owns
    USER ||--o{ SESSION : creates
    DOCUMENT ||--o{ SESSION : used_in
    SESSION ||--|| CONVERSATION : has
    DOCUMENT ||--o{ VECTOR_CHUNK : contains
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        subgraph "Load Balancers"
            ALB[Application Load Balancer]
            CF[CloudFront CDN]
        end
        
        subgraph "Kubernetes Cluster"
            subgraph "Frontend Pods"
                FE1[React App 1]
                FE2[React App 2]
                FE3[React App 3]
            end
            
            subgraph "Backend Pods"
                BE1[API Server 1]
                BE2[API Server 2]
                BE3[API Server 3]
            end
            
            subgraph "Worker Pods"
                W1[Document Processor 1]
                W2[Document Processor 2]
                W3[AI Service Worker]
            end
        end
        
        subgraph "Managed Services"
            RDS[(MongoDB Atlas)]
            ElastiCache[(Redis ElastiCache)]
            S3[(S3 Bucket)]
            Pinecone[(Pinecone DB)]
        end
        
        subgraph "External Services"
            OpenAI[OpenAI API]
            Claude[Anthropic API]
            Textract[AWS Textract]
        end
    end
    
    CF --> ALB
    ALB --> FE1
    ALB --> FE2
    ALB --> FE3
    
    FE1 --> BE1
    FE2 --> BE2
    FE3 --> BE3
    
    BE1 --> RDS
    BE2 --> ElastiCache
    BE3 --> S3
    
    W1 --> Pinecone
    W2 --> OpenAI
    W3 --> Claude
    
    W1 --> Textract
    W2 --> S3
    W3 --> RDS
    
    classDef lb fill:#e8eaf6
    classDef pod fill:#e8f5e8
    classDef managed fill:#fff3e0
    classDef external fill:#fce4ec
    
    class ALB,CF lb
    class FE1,FE2,FE3,BE1,BE2,BE3,W1,W2,W3 pod
    class RDS,ElastiCache,S3,Pinecone managed
    class OpenAI,Claude,Textract external
```

## Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        subgraph "Network Security"
            WAF[Web Application Firewall]
            DDoS[DDoS Protection]
            VPC[VPC with Subnets]
        end
        
        subgraph "Application Security"
            JWT[JWT Authentication]
            RBAC[Role-Based Access Control]
            Rate[Rate Limiting]
            Validation[Input Validation]
        end
        
        subgraph "Data Security"
            Encryption[Encryption at Rest]
            TLS[TLS in Transit]
            Secrets[Secret Management]
            Backup[Encrypted Backups]
        end
        
        subgraph "Infrastructure Security"
            IAM[IAM Roles & Policies]
            Scanning[Vulnerability Scanning]
            Monitoring[Security Monitoring]
            Audit[Audit Logging]
        end
    end
    
    subgraph "Threat Mitigation"
        Malware[Malware Scanning]
        OWASP[OWASP Compliance]
        PenTest[Penetration Testing]
        SOC[SOC 2 Compliance]
    end
    
    WAF --> JWT
    DDoS --> Rate
    JWT --> RBAC
    RBAC --> Validation
    
    Validation --> Encryption
    TLS --> Secrets
    
    IAM --> Scanning
    Scanning --> Monitoring
    Monitoring --> Audit
    
    Malware --> OWASP
    OWASP --> PenTest
    PenTest --> SOC
    
    classDef network fill:#e8eaf6
    classDef app fill:#e8f5e8
    classDef data fill:#fff3e0
    classDef infra fill:#fce4ec
    classDef threat fill:#ffebee
    
    class WAF,DDoS,VPC network
    class JWT,RBAC,Rate,Validation app
    class Encryption,TLS,Secrets,Backup data
    class IAM,Scanning,Monitoring,Audit infra
    class Malware,OWASP,PenTest,SOC threat
```

These diagrams provide comprehensive visual representations of your TLDR AI system architecture, covering all aspects from high-level system design to detailed security considerations. Each diagram can be rendered using Mermaid in your documentation platform or converted to images for presentations.
