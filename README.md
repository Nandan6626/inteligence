# Enterprise AI Company Intelligence Platform

A production-grade, multi-agent AI pipeline for deep company intelligence analysis. Powered by LangGraph, FastAPI, Supabase, React, and multiple LLMs (OpenAI, Gemini, Cerebras).

## Features
- **Multi-Agent Architecture**: Uses parallel execution of OpenAI, Gemini, and Cerebras agents to process and infer company data.
- **Master Consolidation Agent**: Resolves conflicts and creates a unified company profile with AI confidence scoring.
- **Automated Validation Suite**: Checks data formats, score limits, and AI hallucinations.
- **Regeneration Loop**: Self-healing LangGraph workflow that regenerates failed sections.
- **Vibrant React Dashboard**: Real-time analytics, company search, score visualizations with Recharts, and premium glassmorphic UI.

## Tech Stack
- **Backend**: Python 3.11, FastAPI, LangGraph, Langchain, Pydantic
- **Frontend**: React, Vite, Recharts, Lucide-React
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Docker, Docker Compose

## Setup Instructions

### 1. Supabase Setup
- Create a project on [Supabase](https://supabase.com/).
- Run the SQL script located at `backend/database/schema.sql` in the Supabase SQL Editor to create tables.
- Get your Supabase URL and Anon Key.

### 2. Environment Variables
Update the `backend/.env` file with your keys:
```
OPENAI_API_KEY=your_key
GEMINI_API_KEY=your_key
CEREBRAS_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_anon_key
```

### 3. Run with Docker (Recommended)
```bash
docker-compose up --build
```
This will start:
- FastAPI Backend on `http://localhost:8000`
- React Frontend on `http://localhost:80` (or `http://localhost:5173` if running `npm run dev`)
- Redis & Celery Workers for background tasks

### 4. Run Locally (Development)
**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## How It Works (LangGraph Workflow)
1. **Upload CSV**: User uploads bulk data.
2. **Execute Agents**: LangGraph spawns OpenAI, Gemini, and Cerebras in parallel.
3. **Consolidate**: A master node aggregates outputs and calculates confidence.
4. **Validate**: Metadata validator checks for schema and value constraints.
5. **Regeneration**: If validation fails, it triggers the regeneration loop (up to 3 times).
6. **Store**: Validated output is saved to Supabase PostgreSQL.
