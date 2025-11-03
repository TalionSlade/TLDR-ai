# TLDR - Terms & Conditions RAG Chat Application

An intelligent chat application that uses RAG (Retrieval-Augmented Generation) to help users understand Terms & Conditions documents. Upload a PDF, ask questions, and get clear answers backed by references to specific sections.

## 🌟 Features

- **PDF Upload & Processing**: Upload Terms & Conditions PDFs for analysis
- **Intelligent Q&A**: Ask questions in natural language and get clear, context-aware answers
- **Source References**: Every answer includes references to specific pages and sections
- **Semantic Search**: Uses vector embeddings for accurate document retrieval
- **Multiple LLM Support**: Works with OpenAI GPT-4 or Anthropic Claude
- **Modern UI**: Beautiful, responsive interface built with React and TailwindCSS

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Python FastAPI with async support
- **PDF Processing**: PyPDF2 & pdfplumber for text extraction
- **Vector Store**: ChromaDB for semantic search
- **Embeddings**: Sentence Transformers
- **LLM Integration**: OpenAI & Anthropic APIs

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.10+
- OpenAI or Anthropic API key

### 1. Clone the Repository

```powershell
git clone <repository-url>
cd TLDR-V1.1
```

### 2. Setup Frontend

```powershell
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

Frontend will be available at: http://localhost:5173

### 3. Setup Backend

```powershell
# Navigate to backend
cd Backend

# Install Python dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
```

Edit `Backend/.env` and add your API key:
```
OPENAI_API_KEY=your_key_here
# or
ANTHROPIC_API_KEY=your_key_here
```

```powershell
# Start backend server
python BackendServer.py
```

Backend API will be available at: http://localhost:8000

### 4. Access the Application

1. Open http://localhost:5173 in your browser
2. Upload a PDF Terms & Conditions document
3. Start asking questions!

## 📁 Project Structure

```
TLDR-V1.1/
├── src/                        # Frontend source
│   ├── components/
│   │   ├── app/               # App-specific components
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── PDFUploader.tsx
│   │   │   ├── PDFViewer.tsx
│   │   │   └── FAQDropdown.tsx
│   │   ├── common/            # Reusable UI components
│   │   └── landing/           # Landing page components
│   ├── context/               # React Context providers
│   │   ├── ChatContext.tsx
│   │   └── PDFContext.tsx
│   ├── services/              # API integration
│   │   └── ragService.ts
│   └── pages/                 # Route pages
├── Backend/                    # Python backend
│   ├── BackendServer.py       # FastAPI server
│   ├── config.py              # Configuration
│   ├── pdf_processor.py       # PDF extraction & chunking
│   ├── vector_store.py        # ChromaDB integration
│   ├── llm_service.py         # LLM API calls
│   └── requirements.txt       # Python dependencies
└── public/                     # Static assets
```

## 🛠️ Development

### Frontend Commands

```powershell
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Commands

```powershell
python BackendServer.py                    # Start with auto-reload
uvicorn BackendServer:app --reload         # Alternative start method
```

### API Documentation

Once the backend is running, access:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🔧 Configuration

### Frontend (.env)

```
VITE_API_BASE_URL=http://localhost:8000
```

### Backend (.env)

```
# LLM Configuration
OPENAI_API_KEY=your_key_here
LLM_PROVIDER=openai
MODEL_NAME=gpt-4-turbo-preview

# Server
PORT=8000
CORS_ORIGINS=http://localhost:5173

# Vector Store
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
EMBEDDING_MODEL=all-MiniLM-L6-v2
```

## 📝 How It Works

1. **Upload**: User uploads a PDF document
2. **Processing**: Backend extracts text and splits into chunks
3. **Embedding**: Chunks are converted to vector embeddings
4. **Storage**: Embeddings stored in ChromaDB for fast retrieval
5. **Query**: User asks a question
6. **Retrieval**: System finds most relevant chunks
7. **Generation**: LLM generates answer using retrieved context
8. **Response**: Answer returned with source references

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

[Add your license here]

## 🐛 Troubleshooting

### Frontend won't start
- Check Node.js version (18+)
- Delete `node_modules` and run `npm install` again
- Clear Vite cache: `rm -rf node_modules/.vite`

### Backend errors
- Verify Python version (3.10+)
- Check API key is set in `.env`
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is not in use

### PDF upload fails
- Ensure file is valid PDF
- Check file size (max 10MB)
- Verify backend is running

### LLM responses fail
- Verify API key is valid
- Check internet connection
- Ensure sufficient API credits
- Check backend logs for errors

## 📞 Support

For issues and questions, please open a GitHub issue.
