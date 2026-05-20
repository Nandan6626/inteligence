from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class AgentGenerateRequest(BaseModel):
    company_name: str
    industry: Optional[str] = None
    website: Optional[str] = None
    additional_context: Optional[str] = None

class AgentRunStatus(BaseModel):
    run_id: str
    status: str # queued, running, completed, failed
    stage: str
    progress: int
    started_at: datetime
    completed_at: Optional[datetime] = None
    error: Optional[str] = None
    result_preview: Optional[Dict[str, Any]] = None

class AgentGenerateResponse(BaseModel):
    run_id: str
    status: str
    message: str

class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime
