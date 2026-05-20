from typing import Dict, Any, Optional, List
from datetime import datetime
from app.models.schemas import AgentRunStatus

class RunStore:
    """
    In-memory store for tracking agent runs.
    In production, this should be backed by Redis.
    """
    def __init__(self):
        self._runs: Dict[str, AgentRunStatus] = {}

    def create_run(self, run_id: str) -> AgentRunStatus:
        run = AgentRunStatus(
            run_id=run_id,
            status="queued",
            stage="initializing",
            progress=0,
            started_at=datetime.now()
        )
        self._runs[run_id] = run
        return run

    def update_run(self, run_id: str, **kwargs) -> Optional[AgentRunStatus]:
        if run_id not in self._runs:
            return None
        
        current_run = self._runs[run_id]
        updated_data = current_run.dict()
        updated_data.update(kwargs)
        
        if kwargs.get("status") == "completed" or kwargs.get("status") == "failed":
            updated_data["completed_at"] = datetime.now()
            
        new_run = AgentRunStatus(**updated_data)
        self._runs[run_id] = new_run
        return new_run

    def get_run(self, run_id: str) -> Optional[AgentRunStatus]:
        return self._runs.get(run_id)

    def list_runs(self) -> List[AgentRunStatus]:
        return list(self._runs.values())

# Global instance
run_store = RunStore()
