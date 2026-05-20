from typing import TypedDict, Annotated, List, Dict, Any, Optional
import operator

class AnalysisState(TypedDict):
    # Input
    company_name: str
    industry: Optional[str]
    website: Optional[str]
    additional_context: Optional[str]
    run_id: Optional[str]
    
    # Raw Agent outputs
    groq_output: str
    gemini_output: str
    cerebras_output: str
    
    # Validated parsed data from each agent
    valid_groq_data: List[Dict[str, Any]]
    valid_gemini_data: List[Dict[str, Any]]
    valid_cerebras_data: List[Dict[str, Any]]
    
    # Missing fields per agent for retries
    groq_missing: List[str]
    gemini_missing: List[str]
    cerebras_missing: List[str]
    
    # Retry counts per agent
    groq_retries: int
    gemini_retries: int
    cerebras_retries: int
    
    # Final results
    consolidated_data: List[Dict[str, Any]]
    validation_errors: List[str]
    is_valid: bool
    
    # Progress tracking
    current_stage: str
    progress_percentage: int
