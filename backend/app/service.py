import uuid
import asyncio
from datetime import datetime
from typing import Dict, Any, Optional
from app.graph import workflow_app
from app.storage.run_store import run_store
from app.models.state import AnalysisState

class WorkflowService:
    @staticmethod
    async def run_agent_workflow(run_id: str, company_data: Dict[str, Any]):
        """
        Background task to run the LangGraph workflow.
        Updates the run_store with progress and results.
        """
        run_store.update_run(run_id, status="running", stage="initializing", progress=10)
        
        initial_state: AnalysisState = {
            "company_name": company_data.get("company_name", ""),
            "industry": company_data.get("industry", ""),
            "website": company_data.get("website", ""),
            "additional_context": company_data.get("additional_context", ""),
            "run_id": run_id,
            "groq_output": "",
            "gemini_output": "",
            "cerebras_output": "",
            "valid_groq_data": [],
            "valid_gemini_data": [],
            "valid_cerebras_data": [],
            "groq_missing": [],
            "gemini_missing": [],
            "cerebras_missing": [],
            "groq_retries": 0,
            "gemini_retries": 0,
            "cerebras_retries": 0,
            "consolidated_data": [],
            "validation_errors": [],
            "is_valid": False,
            "current_stage": "starting",
            "progress_percentage": 5
        }
        
        try:
            final_state = dict(initial_state)
            # We can stream updates from the graph to update the run_store in real-time
            async for event in workflow_app.astream(initial_state):
                # The event dictionary contains the output of the node that just finished
                # We can extract progress info from the state if the node updated it
                for node_name, output in event.items():
                    final_state.update(output)
                    if "current_stage" in output:
                        run_store.update_run(
                            run_id, 
                            stage=output["current_stage"], 
                            progress=output["progress_percentage"]
                        )
            
            # Final state update
            run_store.update_run(
                run_id, 
                status="completed", 
                stage="completed", 
                progress=100,
                result_preview={"parameters_count": len(final_state.get("consolidated_data", []))}
            )
            
        except Exception as e:
            print(f"Workflow Error [{run_id}]: {e}")
            run_store.update_run(run_id, status="failed", error=str(e))

    @classmethod
    def start_run(cls, company_data: Dict[str, Any]) -> str:
        run_id = str(uuid.uuid4())
        run_store.create_run(run_id)
        return run_id

workflow_service = WorkflowService()
