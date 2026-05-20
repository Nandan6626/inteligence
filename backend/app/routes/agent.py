from fastapi import APIRouter, BackgroundTasks, HTTPException
from app.models.schemas import AgentGenerateRequest, AgentGenerateResponse, AgentRunStatus
from app.service import workflow_service
from app.storage.run_store import run_store
from typing import List

router = APIRouter()

@router.post("/generate", response_model=AgentGenerateResponse)
async def generate_company_profile(
    request: AgentGenerateRequest, 
    background_tasks: BackgroundTasks
):
    """
    Triggers the multi-agent research workflow for a company.
    Returns a run_id for status tracking.
    """
    company_data = request.dict()
    run_id = workflow_service.start_run(company_data)
    
    # Schedule the background task
    background_tasks.add_task(
        workflow_service.run_agent_workflow, 
        run_id, 
        company_data
    )
    
    return AgentGenerateResponse(
        run_id=run_id,
        status="queued",
        message="Workflow started successfully"
    )

@router.get("/status", response_model=List[AgentRunStatus])
async def list_all_runs():
    """
    Returns the status of all current and past runs.
    """
    return run_store.list_runs()

@router.get("/status/{run_id}", response_model=AgentRunStatus)
async def get_run_status(run_id: str):
    """
    Returns the status of a specific run by ID.
    """
    run = run_store.get_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail="Run ID not found")
    return run
