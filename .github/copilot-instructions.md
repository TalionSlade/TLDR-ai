## Purpose

This file gives concise, repository-speci- To test UI messaging quickly, use `src/services/mockRagService.ts` (kept for reference) or mock backend responses in network tab.
- Backend logs show PDF processing, vector search, and LLM calls — check terminal running `BackendServer.py` for debugging.ic guidance for AI coding agents (Copilot-style) so they can be immediately productive working on this project.

## Quick commands (run in PowerShell)

- Start dev server: `npm run dev` (Vite dev server, default http://localhost:5173)
- Build production: `npm run build` (Vite build)
- Preview production build: `npm run preview`
- Lint: `npm run lint` (project uses ESLint)

Key files: `package.json`, `vite.config.ts`, `tsconfig.app.json`.

## High-level architecture

- Frontend: React + TypeScript single-page app powered by Vite. Entry: `src/main.tsx` -> `src/App.tsx` routes.
- State/Integration boundaries are implemented with React Contexts:
  - `src/context/PDFContext.tsx` — stores uploaded PDF file, upload progress, current/total pages and scale.
  - `src/context/ChatContext.tsx` — chat message lifecycle, `sendMessage` API, loading state.
- UI components are under `src/components` with app features in `src/components/app` (e.g., `ChatInterface.tsx`, `PDFUploader.tsx`, `PDFViewer.tsx`). Pages live in `src/pages`.
- Real RAG backend: `src/services/ragService.ts` provides API calls to FastAPI backend for PDF upload and chat.
- Backend implementation: `Backend/BackendServer.py` is a FastAPI server with PDF processing (`pdf_processor.py`), vector search (`vector_store.py` using ChromaDB), and LLM integration (`llm_service.py` supporting OpenAI/Anthropic).

## Primary data flows and examples

- Upload flow: user uploads a PDF via `PDFUploader` -> calls `uploadPDF()` from `ragService.ts` -> backend processes PDF, creates embeddings -> returns `session_id` -> `PDFContext` stores `sessionId`, `setPdfFile` and `fileInfo` are set -> `PDFViewer` (react-pdf) reads file and sets `totalPages` and `currentPage`.
- Chat flow: UI calls `useChatContext().sendMessage(text)` (see `src/components/app/ChatInterface.tsx`). `sendMessage` adds the user message, sets `isLoading`, calls backend `sendChatMessage()` with `sessionId` -> backend retrieves relevant chunks from vector store -> LLM generates answer with references -> UI displays response with `references` array.

Example: to programmatically send a question from a component:

```ts
import { useChatContext } from 'src/context/ChatContext';
const { sendMessage } = useChatContext();
sendMessage('What is the refund policy?');
```

## Project-specific conventions and gotchas

- TypeScript strict mode is enabled (`tsconfig.app.json`). Add new context fields to both the interface and the provider implementation to keep types consistent.
- Vite `optimizeDeps` excludes `lucide-react` in `vite.config.ts` — if you add icon packages, check dependency pre-bundling issues and update `optimizeDeps` accordingly.
- Styling: TailwindCSS + PostCSS. See `tailwind.config.js` and `postcss.config.js`. Use class-based Tailwind utilities; components expect certain design tokens (e.g., `bg-surface-200`, `text-surface-600`) — search for these tokens when editing UI.
- PDF handling: `react-pdf` + `pdfjs-dist` are used. Keep heavy PDF parsing client-side; if adding server-side processing, update the backend and the contexts accordingly.

## Backend integration and AI behavior

- Backend API calls are in `src/services/ragService.ts` (uploadPDF, sendChatMessage). API base URL is set via `VITE_API_BASE_URL` env var.
- Backend runs on port 8000 by default. Start with `python Backend/BackendServer.py`. Requires API keys in `Backend/.env`.
- To change LLM provider/model: edit `Backend/.env` (`LLM_PROVIDER`, `MODEL_NAME`). Supports OpenAI and Anthropic.
- To adjust chunking or embeddings: modify `Backend/config.py` settings (`CHUNK_SIZE`, `CHUNK_OVERLAP`, `EMBEDDING_MODEL`).
- Session management: `PDFContext` stores `sessionId` returned from upload. Backend maintains in-memory sessions dict (use Redis for production).

## Debugging tips

- Live reload via `npm run dev` (Vite). Browser console + React DevTools are primary tools. Use `network` tab when wiring a real backend.
- If TypeScript compile errors appear, run an editor typecheck or re-run the dev server — Vite shows diagnostic overlays.
- To test UI messaging quickly, open `src/services/mockRagService.ts` and edit `generateMockResponse` to return deterministic text for the scenario you’re debugging.

## Files to inspect for changes

- Runtime wiring: `src/main.tsx` (provider order: `PDFContextProvider` wraps `ChatContextProvider` then `App`)
- Routing: `src/App.tsx`
- Chat UI: `src/components/app/ChatInterface.tsx`
- PDF handling: `src/components/app/PDFUploader.tsx`, `src/components/app/PDFViewer.tsx`
- RAG service: `src/services/ragService.ts`
- Backend: `Backend/BackendServer.py`, `Backend/pdf_processor.py`, `Backend/vector_store.py`, `Backend/llm_service.py`

## Minimal checklist for common tasks

- Add a new context value: update interface in `PDFContext.tsx`/`ChatContext.tsx`, implement state & setter, export via provider, and ensure `main.tsx` mounts the provider.
- Add new backend endpoints: follow FastAPI patterns in `BackendServer.py`, add Pydantic models for request/response, update frontend `ragService.ts`.
- Modify RAG pipeline: adjust chunking in `pdf_processor.py`, tune vector search in `vector_store.py`, or customize prompts in `llm_service.py`.

---
If any section is unclear or you want me to include a short example (e.g., mapping real AI payloads to the internal `Message` type or wiring a simple Flask endpoint in `Backend/BackendServer.py`), tell me which part and I’ll iterate.
