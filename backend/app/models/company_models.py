from pydantic import BaseModel, Field
from typing import Optional, List

class CompanyData(BaseModel):
    company_name: str
    industry: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    # Add other raw fields here

class AgentOutput(BaseModel):
    summary: str
    inferred_industry: str
    strengths: List[str]
    weaknesses: List[str]
    positioning: str
    tam_sam_som: str
    hiring_culture: str
    innovation_level: str
    financial_risk: str
    esg_analysis: str
    tech_maturity: str
    competitors: List[str]
    strategic_recommendations: List[str]
    scores: dict = Field(default_factory=dict)

class ConsolidatedProfile(BaseModel):
    company_name: str
    unified_summary: str
    industry: str
    strengths: List[str]
    weaknesses: List[str]
    positioning: str
    tam_sam_som: str
    hiring_culture: str
    innovation_level: str
    financial_risk: str
    esg_analysis: str
    tech_maturity: str
    competitors: List[str]
    strategic_recommendations: List[str]
    confidence_score: float
    scores: dict
    validation_status: str = "pending"
