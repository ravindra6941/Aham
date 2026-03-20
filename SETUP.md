# AHAM Setup Guide

## Prerequisites
- Node.js 18+
- Ollama (for AI-powered Rishi conversations)

## Quick Start

### 1. Install Ollama (free, runs locally)
```bash
# macOS
brew install ollama

# or download from https://ollama.com
```

### 2. Pull a model
```bash
# Recommended: Llama 3 8B (4.7GB, runs on 8GB RAM)
ollama pull llama3:8b

# Alternative: Mistral 7B (lighter)
ollama pull mistral:7b

# For better quality (needs 16GB+ RAM):
ollama pull llama3:70b
```

### 3. Start Ollama
```bash
ollama serve
# Ollama will run on http://localhost:11434
```

### 4. Install & run AHAM
```bash
cd aham/frontend
npm install
npm run dev
# Open http://localhost:3000
```

## Configuration

Edit `.env.local` to change model or Ollama URL:
```
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b
```

## How It Works

- **No backend server needed** — Next.js API routes handle everything
- **No database needed** — all user data stored in localStorage
- **No API costs** — Ollama runs the LLM on your machine
- **Works offline** — once the model is downloaded

## Scaling Later

When ready to move to production with real users:

1. Swap Ollama for Claude API in `/api/chat/route.ts`
2. Add PostgreSQL + Prisma for user data
3. Deploy frontend to Vercel
4. Add authentication (NextAuth.js)

Total cost at scale depends on Claude API usage (~$0.003/conversation with Haiku).
