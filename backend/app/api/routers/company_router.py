from fastapi import APIRouter, HTTPException
from app.database.supabase_client import get_supabase_client

router = APIRouter()
supabase = get_supabase_client()

@router.get("/")
def list_companies(limit: int = 50, offset: int = 0):
    try:
        response = supabase.table("companies").select("*").range(offset, offset + limit - 1).execute()
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{company_id}")
def get_company(company_id: str):
    try:
        # Get base company info
        company_res = supabase.table("companies").select("*").eq("id", company_id).execute()
        if not company_res.data:
            raise HTTPException(status_code=404, detail="Company not found")
            
        # Get scores
        scores_res = supabase.table("company_scores").select("*").eq("company_id", company_id).execute()
        
        # Get specific metrics
        financials = supabase.table("financial_metrics").select("*").eq("company_id", company_id).execute()
        culture = supabase.table("employee_culture").select("*").eq("company_id", company_id).execute()
        risk = supabase.table("risk_analysis").select("*").eq("company_id", company_id).execute()
        
        return {
            "company": company_res.data[0],
            "scores": scores_res.data[0] if scores_res.data else {},
            "financials": financials.data[0] if financials.data else {},
            "culture": culture.data[0] if culture.data else {},
            "risk": risk.data[0] if risk.data else {}
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
