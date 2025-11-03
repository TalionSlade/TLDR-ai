# TLDR Backend & Frontend Setup Guide

## 🎯 Complete Setup Instructions

### Step 1: Install Prerequisites

**Required:**
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.10+ ([Download](https://www.python.org/))
- OpenAI API Key ([Get one](https://platform.openai.com/api-keys)) OR Anthropic API Key ([Get one](https://console.anthropic.com/))

### Step 2: Clone and Navigate

```powershell
cd c:\Users\Arpan\Documents\VibeCode-TLDR\Project-TLDR-V1.1\TLDR-V1.1
```

### Step 3: Setup Frontend

```powershell
# Install dependencies
npm install

# Create .env file (if not exists)
# Already created with VITE_API_BASE_URL=http://localhost:8000

# Start frontend dev server (already running)
npm run dev
```

✅ Frontend is now running at: **http://localhost:5173**

### Step 4: Setup Backend

#### Option A: Automatic Setup (Recommended)

```powershell
# Run setup script
.\setup-backend.ps1
```

#### Option B: Manual Setup

```powershell
# Navigate to backend
cd Backend

# Install dependencies
pip install -r requirements.txt

# Create .env from example
cp .env.example .env
```

### Step 5: Configure API Keys

Edit `Backend/.env` and add your API key:

```env
# For OpenAI (GPT-4)
OPENAI_API_KEY=sk-proj-...your-key-here...
LLM_PROVIDER=openai
MODEL_NAME=gpt-4-turbo-preview

# OR for Anthropic (Claude)
ANTHROPIC_API_KEY=sk-ant-...your-key-here...
LLM_PROVIDER=anthropic
MODEL_NAME=claude-3-sonnet-20240229
```

### Step 6: Start Backend Server

```powershell
cd Backend
python BackendServer.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

✅ Backend is now running at: **http://localhost:8000**

### Step 7: Test the Application

1. Open browser to **http://localhost:5173**
2. Upload a PDF (try the included `WFSIL_WFBNA_LB_Terms_of_Business.pdf`)
3. Wait for processing (you'll see progress in terminal)
4. Ask questions like:
   - "What is the refund policy?"
   - "How do I cancel my account?"
   - "What data do you collect?"

## 🔍 Verify Setup

### Check Backend Health

```powershell
# In a new terminal
curl http://localhost:8000/health
```

Should return:
```json
{
  "status": "healthy",
  "llm_provider": "openai",
  "model": "gpt-4-turbo-preview",
  "vector_store": "chromadb",
  "embedding_model": "all-MiniLM-L6-v2"
}
```

### Check Frontend Connection

Open browser console at http://localhost:5173 - no errors should appear.

## 🐛 Troubleshooting

### Backend won't start

**Error: `ModuleNotFoundError`**
```powershell
pip install -r Backend/requirements.txt
```

**Error: `API key not configured`**
- Edit `Backend/.env` and add your API key
- Make sure the file is named `.env` (not `.env.txt`)

**Error: `Port 8000 already in use`**
```powershell
# Find and kill process using port 8000
netstat -ano | findstr :8000
taskkill /PID <pid> /F
```

### PDF Upload Fails

**Check backend logs** in the terminal running `BackendServer.py`

**Common issues:**
- File too large (max 10MB)
- Invalid PDF format
- Backend not running

### LLM Responses Don't Work

**No API key:**
- Verify API key is in `Backend/.env`
- Check key is valid at provider dashboard

**Rate limits:**
- Wait a moment and try again
- Check your API usage/credits

**Connection errors:**
- Verify internet connection
- Check firewall settings

## 📊 Project Status

✅ Frontend running on port 5173
⏳ Backend needs to be started (port 8000)
⏳ API key needs to be configured in Backend/.env

## 🎉 Next Steps

1. **Configure Backend/.env** with your API key
2. **Start Backend** with `python Backend/BackendServer.py`
3. **Upload a PDF** and start chatting!

## 📚 Additional Resources

- [Backend API Documentation](http://localhost:8000/docs) (after starting backend)
- [Project README](./README.md)
- [Backend README](./Backend/README.md)
- [Copilot Instructions](./.github/copilot-instructions.md)
