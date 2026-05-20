import asyncio
from dotenv import load_dotenv
load_dotenv()

from langsmith import Client
client = Client()

from app.graph import workflow_app

async def test():
    company_name = "Blinkit"
    print(f"Starting test workflow for {company_name}...")
    
    initial_state = {
        "company_name": company_name,
        "industry": "Quick Commerce",
        "website": "https://blinkit.com",
        "additional_context": "Instant grocery delivery platform in India",
        "run_id": "test_run_1",
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
    
    # Run the graph
    result = await workflow_app.ainvoke(initial_state)
    print("Workflow finished.")
    print("Consolidated Data Count:", len(result.get("consolidated_data", [])))
    print("Current Stage:", result.get("current_stage"))

if __name__ == "__main__":
    asyncio.run(test())
