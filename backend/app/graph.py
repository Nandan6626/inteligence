from langgraph.graph import StateGraph, END
from app.models.state import AnalysisState
from app.agents.groq_agent import run_groq_agent
from app.agents.gemini_agent import run_gemini_agent
from app.agents.cerebras_agent import run_cerebras_agent
from app.agents.consolidation_agent import run_consolidation_agent
from app.validators.metadata_validator import validate_final_profile, parse_markdown_table, validate_individual_output
from app.database.supabase_client import get_supabase_client
from pydantic import BaseModel, Field
import asyncio
import os
import json
import uuid

# --- Helper for individual validation ---
def check_individual_validation(parsed_data):
    # This logic matches validate_final_profile but for individual agent outputs
    # However, since agents might not find everything, we just check if it's "mostly" valid
    # or if we should retry. For this flow, we'll check for missing fields.
    errors, missing = validate_final_profile(parsed_data)
    return len(errors) == 0, missing

# --- Nodes ---

async def entry(state: AnalysisState):
    run_id = state.get("run_id") or f"studio_{str(uuid.uuid4())[:8]}"
    print(f"[{run_id}] Starting entry node...")
    
    company_name = state.get("company_name")
    industry = state.get("industry")
    website = state.get("website")
    additional_context = state.get("additional_context")
    
    # If any of these are missing, let's automatically research them!
    if not industry or not website or not additional_context:
        print(f"[{run_id}] Auto-generating missing company info (industry, website, context) for {company_name}...")
        try:
            from langchain_community.tools import DuckDuckGoSearchRun
            from langchain_google_genai import ChatGoogleGenerativeAI
            from app.config.settings import settings
            
            search = DuckDuckGoSearchRun()
            search_query = f"{company_name} company official website industry summary"
            search_res = search.invoke(search_query)
            
            api_key = settings.GOOGLE_API_KEY or settings.GEMINI_API_KEY
            llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1, google_api_key=api_key)
            
            prompt = f"""
            You are a helpful assistant. Based on this search context:
            ---
            {search_res}
            ---
            Provide the official website URL, primary industry, and a 2-sentence summary/context for the company: "{company_name}".
            
            Respond ONLY in valid JSON format with these exact keys:
            "industry": (string),
            "website": (string),
            "additional_context": (string)
            """
            
            res = llm.invoke(prompt)
            content = res.content.strip()
            # Clean JSON markdown fences if present
            if content.startswith("```json"):
                content = content[7:]
            if content.endswith("```"):
                content = content[:-3]
            content = content.strip()
            
            info = json.loads(content)
            
            if not industry:
                industry = info.get("industry", "Technology")
            if not website:
                website = info.get("website", "")
            if not additional_context:
                additional_context = info.get("additional_context", "")
                
            print(f"[{run_id}] Auto-discovered: Industry={industry}, Website={website}")
        except Exception as e:
            print(f"[{run_id}] Error in auto-discovery: {e}")
            # Fallbacks
            if not industry: industry = "Technology"
            if not website: website = f"https://www.google.com/search?q={company_name}"
            if not additional_context: additional_context = f"Company research for {company_name}"
            
    return {
        "run_id": run_id,
        "industry": industry,
        "website": website,
        "additional_context": additional_context,
        "current_stage": "research",
        "progress_percentage": 10,
        "groq_retries": 0,
        "gemini_retries": 0,
        "cerebras_retries": 0,
        "groq_missing": [],
        "gemini_missing": [],
        "cerebras_missing": []
    }

# --- Groq Path ---
async def groq_generate(state: AnalysisState):
    print(f"[{state['run_id']}] Node: groq_generate")
    company_data = {
        "company_name": state["company_name"],
        "industry": state.get("industry", ""),
        "website": state.get("website", ""),
        "additional_context": state.get("additional_context", "")
    }
    output = await asyncio.to_thread(run_groq_agent, company_data, state.get("groq_missing", []))
    return {"groq_output": output}

def groq_validate(state: AnalysisState):
    print(f"[{state['run_id']}] Node: groq_validate")
    parsed = parse_markdown_table(state["groq_output"])
    new_valid_data = validate_individual_output(parsed)
    
    # Merge existing data with new retry data to avoid data loss
    existing_data = state.get("valid_groq_data") or []
    merged_dict = {str(item["ID"]): item for item in existing_data}
    for item in new_valid_data:
        merged_dict[str(item["ID"])] = item
    merged_data = list(merged_dict.values())
    
    is_valid, missing = check_individual_validation(merged_data)
    
    new_retries = state.get("groq_retries", 0)
    if not is_valid:
        new_retries += 1
        
    return {
        "valid_groq_data": merged_data,
        "groq_missing": missing,
        "groq_retries": new_retries,
        "is_valid_groq": is_valid
    }

def should_retry_groq(state: AnalysisState):
    if state.get("is_valid_groq") or state.get("groq_retries", 0) >= 2:
        return "consolidate"
    return "groq_generate"

# --- Gemini Path ---
async def gemini_generate(state: AnalysisState):
    print(f"[{state['run_id']}] Node: gemini_generate")
    company_data = {
        "company_name": state["company_name"],
        "industry": state.get("industry", ""),
        "website": state.get("website", ""),
        "additional_context": state.get("additional_context", "")
    }
    output = await asyncio.to_thread(run_gemini_agent, company_data, state.get("gemini_missing", []))
    return {"gemini_output": output}

def gemini_validate(state: AnalysisState):
    print(f"[{state['run_id']}] Node: gemini_validate")
    parsed = parse_markdown_table(state["gemini_output"])
    new_valid_data = validate_individual_output(parsed)
    
    # Merge existing data with new retry data to avoid data loss
    existing_data = state.get("valid_gemini_data") or []
    merged_dict = {str(item["ID"]): item for item in existing_data}
    for item in new_valid_data:
        merged_dict[str(item["ID"])] = item
    merged_data = list(merged_dict.values())
    
    is_valid, missing = check_individual_validation(merged_data)
    
    new_retries = state.get("gemini_retries", 0)
    if not is_valid:
        new_retries += 1
        
    return {
        "valid_gemini_data": merged_data,
        "gemini_missing": missing,
        "gemini_retries": new_retries,
        "is_valid_gemini": is_valid
    }

def should_retry_gemini(state: AnalysisState):
    if state.get("is_valid_gemini") or state.get("gemini_retries", 0) >= 2:
        return "consolidate"
    return "gemini_generate"

# --- Cerebras Path ---
async def cerebras_generate(state: AnalysisState):
    print(f"[{state['run_id']}] Node: cerebras_generate")
    company_data = {
        "company_name": state["company_name"],
        "industry": state.get("industry", ""),
        "website": state.get("website", ""),
        "additional_context": state.get("additional_context", "")
    }
    output = await asyncio.to_thread(run_cerebras_agent, company_data, state.get("cerebras_missing", []))
    return {"cerebras_output": output}

def cerebras_validate(state: AnalysisState):
    print(f"[{state['run_id']}] Node: cerebras_validate")
    parsed = parse_markdown_table(state["cerebras_output"])
    new_valid_data = validate_individual_output(parsed)
    
    # Merge existing data with new retry data to avoid data loss
    existing_data = state.get("valid_cerebras_data") or []
    merged_dict = {str(item["ID"]): item for item in existing_data}
    for item in new_valid_data:
        merged_dict[str(item["ID"])] = item
    merged_data = list(merged_dict.values())
    
    is_valid, missing = check_individual_validation(merged_data)
    
    new_retries = state.get("cerebras_retries", 0)
    if not is_valid:
        new_retries += 1
        
    return {
        "valid_cerebras_data": merged_data,
        "cerebras_missing": missing,
        "cerebras_retries": new_retries,
        "is_valid_cerebras": is_valid
    }

def should_retry_cerebras(state: AnalysisState):
    if state.get("is_valid_cerebras") or state.get("cerebras_retries", 0) >= 2:
        return "consolidate"
    return "cerebras_generate"

# --- Merge and Finalize ---

def consolidate(state: AnalysisState):
    print(f"[{state['run_id']}] Node: consolidate")
    company_name = state["company_name"]
    
    def dict_to_md(d_list):
        if not d_list: return ""
        headers = list(d_list[0].keys())
        md = f"| {' | '.join(headers)} |\n|{'|'.join(['---']*len(headers))}|\n"
        for row in d_list:
            md += f"| {' | '.join(str(row.get(h, '')) for h in headers)} |\n"
        return md

    consolidated_md = run_consolidation_agent(
        company_name,
        dict_to_md(state.get("valid_groq_data", [])), 
        dict_to_md(state.get("valid_gemini_data", [])), 
        dict_to_md(state.get("valid_cerebras_data", []))
    )
    
    parsed_data = parse_markdown_table(consolidated_md)
    return {"consolidated_data": parsed_data, "current_stage": "consolidate", "progress_percentage": 80}

def excel(state: AnalysisState):
    print(f"[{state['run_id']}] Node: excel (storage)")
    data = state["consolidated_data"]
    company_name = state["company_name"]
    
    # Save locally
    output_filename = f"golden_data_{company_name.replace(' ', '_').lower()}.json"
    output_path = os.path.join(os.getcwd(), 'storage', output_filename)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w') as f:
        json.dump(data, f, indent=4)
    
    # DB Store
    supabase = get_supabase_client()
    try:
        def get_param(id_str_or_name, default=""):
            for row in data:
                if str(row.get('ID')) == str(id_str_or_name) or row.get('Parameter') == id_str_or_name:
                    return row.get('Research Output / Data') or row.get('Research Output') or ""
            return default
            
        comp_name_data = next((item for item in data if item.get('ID') == '1' or item.get('Parameter') == 'Company Name'), {})
        actual_name = comp_name_data.get('Research Output / Data', company_name)
        
        industry_val = get_param(4, state.get("industry") or "Technology")
        summary_val = get_param(6, "AI-generated company profile.")
        positioning_val = get_param(20, "Core Value Proposition Pending.")
        
        tam_val = get_param(108, "N/A")
        sam_val = get_param(109, "N/A")
        som_val = get_param(110, "N/A")
        tam_sam_som_val = f"TAM: {tam_val} | SAM: {sam_val} | SOM: {som_val}"
        
        competitors_raw = get_param(28, "")
        competitors_list = [c.strip() for c in competitors_raw.split(";") if c.strip()]
        if not competitors_list:
            competitors_list = ["Competitor A", "Competitor B"]
            
        # Helper to parse safe numeric score
        def get_numeric_score(val_str, default=80):
            try:
                import re
                digits = re.findall(r'\d+', val_str)
                if digits:
                    val = int(digits[0])
                    # If it's a rating out of 5 (like Glassdoor)
                    if val <= 5 and ("rating" in val_str.lower() or "glassdoor" in val_str.lower()):
                        return int(val * 20)
                    return val
            except:
                pass
            return default
            
        innovation = get_numeric_score(get_param(83), 85)
        risk = get_numeric_score(get_param(122), 35)
        financial = get_numeric_score(get_param(65), 78)
        tech = get_numeric_score(get_param(107), 80)
        culture = get_numeric_score(get_param(37), 82)
        market = get_numeric_score(get_param(66), 75)
        leadership = get_numeric_score(get_param(48), 85)
        brand = get_numeric_score(get_param(56), 80)

        # Helper to parse safe integers
        def safe_int(val_str, default=None):
            try:
                import re
                digits = re.findall(r'\d+', str(val_str))
                if digits:
                    return int(digits[0])
            except:
                pass
            return default

        # Insert into companies table matching exactly the columns present in active database
        company_insert = {
            "name": actual_name,
            "industry": industry_val,
            "description": summary_val,
            "headquarters": get_param(10, "N/A"),
            "founded_year": safe_int(get_param(8), None),
            "employee_count": safe_int(get_param(32), None),
            "data": {
                "status": "success",
                "scores": {
                    "brand_score": brand,
                    "innovation_score": innovation,
                    "financial_stability_score": financial,
                    "risk_score": risk,
                    "technology_score": tech,
                    "culture_score": culture,
                    "esg_score": 80,
                    "market_strength_score": market,
                    "leadership_score": leadership,
                    "ai_maturity_score": innovation,
                    "confidence_score": 92
                },
                "consolidated_data": data
            }
        }
        
        comp_res = supabase.table("companies").insert(company_insert).execute()
        if comp_res.data:
            new_id = comp_res.data[0]["id"]
            print(f"[{state['run_id']}] Successfully inserted company: {actual_name} with ID: {new_id}")
            
            # Save the new company ID into the run_store result preview
            from app.storage.run_store import run_store
            run_store.update_run(state["run_id"], result_preview={"company_id": new_id, "company_name": actual_name})
            
    except Exception as e:
        print(f"DB Error (detailed): {e}")
        
    return {"current_stage": "completed", "progress_percentage": 100}

class AgentInput(BaseModel):
    company_name: str = Field(description="The name of the company to analyze")

# --- Graph Definition ---

workflow = StateGraph(AnalysisState, input=AgentInput)

workflow.add_node("entry", entry)
workflow.add_node("groq_generate", groq_generate)
workflow.add_node("groq_validate", groq_validate)
workflow.add_node("gemini_generate", gemini_generate)
workflow.add_node("gemini_validate", gemini_validate)
workflow.add_node("cerebras_generate", cerebras_generate)
workflow.add_node("cerebras_validate", cerebras_validate)
workflow.add_node("consolidate", consolidate)
workflow.add_node("excel", excel)

workflow.set_entry_point("entry")

# Parallel fan-out
workflow.add_edge("entry", "groq_generate")
workflow.add_edge("entry", "gemini_generate")
workflow.add_edge("entry", "cerebras_generate")

# Individual loops
workflow.add_edge("groq_generate", "groq_validate")
workflow.add_conditional_edges("groq_validate", should_retry_groq, {
    "groq_generate": "groq_generate",
    "consolidate": "consolidate"
})

workflow.add_edge("gemini_generate", "gemini_validate")
workflow.add_conditional_edges("gemini_validate", should_retry_gemini, {
    "gemini_generate": "gemini_generate",
    "consolidate": "consolidate"
})

workflow.add_edge("cerebras_generate", "cerebras_validate")
workflow.add_conditional_edges("cerebras_validate", should_retry_cerebras, {
    "cerebras_generate": "cerebras_generate",
    "consolidate": "consolidate"
})

# Fan-in automatically happens as all nodes pointing to "consolidate" must finish
workflow.add_edge("consolidate", "excel")
workflow.add_edge("excel", END)

workflow_app = workflow.compile()
