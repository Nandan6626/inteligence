from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
import pandas as pd
from io import BytesIO
import json
from app.services.ingestion_service import process_csv_upload

router = APIRouter()

@router.post("/")
async def upload_company_data(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")
    
    try:
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))
        
        # Validate minimum columns
        if 'company_name' not in df.columns:
            raise HTTPException(status_code=400, detail="CSV must contain 'company_name' column")
            
        data = df.to_dict(orient='records')
        
        # Enqueue processing
        background_tasks.add_task(process_csv_upload, data)
        
        return {
            "status": "success", 
            "message": f"Successfully received {len(data)} records for processing.",
            "job_status": "queued"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
