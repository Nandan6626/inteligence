import asyncio
from app.service import workflow_service
import uuid

async def process_csv_upload(data: list[dict]):
    """
    Background task to process a list of company records from CSV.
    """
    tasks = []
    for record in data:
        run_id = str(uuid.uuid4())
        tasks.append(workflow_service.run_agent_workflow(run_id, record))
    
    # Run in parallel, wait for all to finish
    # Note: In a production scenario with large datasets, this should use a proper Celery task queue
    # with chunking and rate limiting.
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # Process results (store logs, retry failures, etc.)
    for idx, result in enumerate(results):
        if isinstance(result, Exception):
            print(f"Error processing record {idx}: {result}")
        else:
            print(f"Successfully processed record {idx}")
