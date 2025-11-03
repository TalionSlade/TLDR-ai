# 🚀 TLDR Quick Start Card

## Current Status
✅ **Frontend**: Running on http://localhost:5173
⏳ **Backend**: Needs to be started

## Start Backend (Choose one method)

### Method 1: Quick Start (3 commands)
```powershell
cd Backend
pip install -r requirements.txt
python BackendServer.py
```
⚠️ **Before running**: Edit `Backend/.env` and add your `OPENAI_API_KEY`

### Method 2: Automated Setup
```powershell
.\setup-backend.ps1
# Then edit Backend/.env with API key
cd Backend
python BackendServer.py
```

## Required: API Key Setup

Edit `Backend/.env`:
```env
OPENAI_API_KEY=sk-proj-YOUR-KEY-HERE
```

Get your key: https://platform.openai.com/api-keys

## Verify Everything Works

1. ✅ Frontend: http://localhost:5173 (should load)
2. ✅ Backend: http://localhost:8000/health (should return JSON)
3. ✅ Docs: http://localhost:8000/docs (Swagger UI)

## Test the App

1. Upload `WFSIL_WFBNA_LB_Terms_of_Business.pdf`
2. Wait for "Processing complete" message
3. Ask: "What is the refund policy?"
4. See AI answer with page references!

## Troubleshooting

**Backend won't start?**
```powershell
pip install --upgrade pip
pip install -r Backend/requirements.txt
```

**"API key not configured"?**
- Check `Backend/.env` exists (not `.env.txt`)
- Make sure key starts with `sk-proj-` or `sk-`

**Frontend can't connect?**
- Verify backend is running on port 8000
- Check `.env` has `VITE_API_BASE_URL=http://localhost:8000`

**PDF upload fails?**
- Check backend terminal for errors
- Verify file is valid PDF < 10MB
- Look for error message in browser console

## Key Files

| File | Purpose |
|------|---------|
| `Backend/BackendServer.py` | Main API server |
| `Backend/.env` | **API keys here!** |
| `Backend/requirements.txt` | Python dependencies |
| `src/services/ragService.ts` | Frontend API calls |
| `.env` | Frontend config |

## Common Commands

```powershell
# Start frontend (already running)
npm run dev

# Start backend
cd Backend
python BackendServer.py

# Install backend deps
pip install -r Backend/requirements.txt

# Check backend health
curl http://localhost:8000/health
```

## Architecture Overview

```
User Upload PDF
    ↓
Frontend (React) → Backend (FastAPI)
    ↓                      ↓
Store PDF          Extract text → Chunk
                        ↓
                   Create embeddings
                        ↓
                   Store in ChromaDB
                        
User asks question
    ↓
Frontend → Backend
              ↓
         Search vectors
              ↓
         Get relevant chunks
              ↓
         Send to LLM (OpenAI/Anthropic)
              ↓
         Get answer with sources
              ↓
         Return to user
```

## Need Help?

📚 **Full Guide**: See `SETUP.md`
📖 **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
🔧 **API Docs**: http://localhost:8000/docs (when backend running)
💡 **Backend Docs**: `Backend/README.md`

---

**Remember**: You MUST add your API key to `Backend/.env` before the app will work!
