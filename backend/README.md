# Company Intelligence Platform - FastAPI Backend

This is a production-grade FastAPI backend that wraps a LangGraph multi-agent research pipeline.

## Features
- **Asynchronous Execution**: Triggers long-running agent workflows in the background.
- **Progress Tracking**: Real-time stage and percentage tracking for every run.
- **Scalable Architecture**: Clean separation between API, Service, and Graph layers.
- **Multi-Agent Orchestration**: Parallel execution of OpenAI, Gemini, and Cerebras agents.
- **Self-Correction**: Integrated 3-retry validation loop with field-level regeneration.
- **Persistence**: Integration with Supabase and local JSON storage.

## Architecture
- **API Layer (`app/routes/`)**: FastAPI endpoints for triggering and monitoring runs.
- **Service Layer (`app/service.py`)**: Manages the lifecycle of a workflow run.
- **Graph Layer (`app/graph.py`)**: Pure LangGraph orchestration (framework independent).
- **Storage Layer (`app/storage/`)**: Tracks run statuses (In-memory/Redis).

## API Usage

### 1. Trigger Research
`POST /api/v1/agent/generate`
```json
{
  "company_name": "Apple Inc",
  "industry": "Technology",
  "website": "apple.com"
}
```
**Response:**
```json
{
  "run_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "message": "Workflow started successfully"
}
```

### 2. Check Status
`GET /api/v1/agent/status/{run_id}`
**Response:**
```json
{
  "run_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "running",
  "stage": "researching",
  "progress": 30,
  "started_at": "2024-05-16T10:00:00Z"
}
```

## Setup & Run

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**:
   Create a `.env` file in the `backend` directory:
   ```env
   OPENAI_API_KEY=your_key
   GOOGLE_API_KEY=your_key
   CEREBRAS_API_KEY=your_key
   GROQ_API_KEY=your_key
   SUPABASE_URL=your_url
   SUPABASE_KEY=your_key
   ```

3. **Run the Server**:
   ```bash
   python -m app.main
   ```
   Or using uvicorn:
   ```bash
   uvicorn app.main:app --reload
   ```

## Deployment
This application is ready for containerization. A `Dockerfile` is provided in the root.
For high-scale production:
1. Swap `RunStore` in `app/storage/run_store.py` with a Redis implementation.
2. Use Celery or Dramatiq for background tasks instead of FastAPI `BackgroundTasks` if runtimes exceed 10 minutes.
