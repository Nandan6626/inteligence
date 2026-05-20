from fastapi import APIRouter, HTTPException
from app.database.supabase_client import get_supabase_client

router = APIRouter()
supabase = get_supabase_client()

@router.get("/dashboard")
def get_dashboard_metrics():
    try:
        # Simplified metrics for dashboard
        companies_res = supabase.table("companies").select("id", count="exact").execute()
        total_companies = companies_res.count
        
        # Get top companies by overall score (assuming we calculate this)
        top_companies = supabase.table("company_scores").select("company_id, overall_score, companies(company_name)").order("overall_score", desc=True).limit(5).execute()
        
        return {
            "total_companies_analyzed": total_companies,
            "top_companies": top_companies.data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
