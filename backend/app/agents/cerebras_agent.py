from langchain_cerebras import ChatCerebras
from langchain_core.prompts import PromptTemplate
from langchain_community.tools import DuckDuckGoSearchRun
from app.config.settings import settings
import os

def run_cerebras_agent(company_data: dict, missing_fields: list = None) -> str:
    llm = ChatCerebras(
        model="llama3.1-8b", 
        temperature=0.2,
        api_key=settings.CEREBRAS_API_KEY
    )
    
    company_name = company_data.get("company_name", "Unknown Company")
    industry = company_data.get("industry", "")
    website = company_data.get("website", "")
    additional_context = company_data.get("additional_context", "")
    
    # 1. Web Search & Crawling
    try:
        search = DuckDuckGoSearchRun()
        search_context = search.invoke(f"{company_name} corporate data, financials, and executives")
    except Exception as e:
        search_context = "Web search unavailable."
        
    # Read prompt and schema
    with open(os.path.join(os.path.dirname(__file__), '..', 'prompts', 'research_prompt.txt'), 'r') as f:
        prompt_template = f.read()
        
    with open(os.path.join(os.path.dirname(__file__), '..', 'prompts', 'schema_163.txt'), 'r') as f:
        schema = f.read()
        
    # 2. Retry Logic: Filter schema to ONLY include missing fields
    if missing_fields and len(missing_fields) > 0:
        filtered_schema_lines = []
        for line in schema.split('\n'):
            if line.startswith('ID') or line.startswith('---'):
                filtered_schema_lines.append(line)
            else:
                for mf in missing_fields:
                    if line.startswith(f"{mf} |") or line.startswith(f"{mf}|"):
                        filtered_schema_lines.append(line)
                        break
        schema = '\n'.join(filtered_schema_lines)
    
    # Inject industry, website and context if present
    extra_context = ""
    if industry:
        extra_context += f"\n- Industry: {industry}"
    if website:
        extra_context += f"\n- Official Website: {website}"
    if additional_context:
        extra_context += f"\n- Additional Context: {additional_context}"
        
    if extra_context:
        prompt_template = prompt_template.replace(
            "# TARGET COMPANY: {company_name}",
            f"# TARGET COMPANY: {{company_name}}\n{extra_context}"
        )
    
    # Inject Web Context into prompt
    prompt_template += "\n\n# WEB SEARCH CONTEXT\nUse the following recent web search information to help answer the fields accurately:\n{search_context}\n"
    
    prompt = PromptTemplate.from_template(prompt_template)
    
    formatted_prompt = prompt.format(
        company_name=company_name,
        schema=schema,
        search_context=search_context
    )
    
    try:
        response = llm.invoke(formatted_prompt)
        return response.content.strip()
    except Exception as e:
        print(f"Cerebras Agent failed with error: {e}. Attempting fallback to Gemini...")
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI
            api_key = settings.GOOGLE_API_KEY or settings.GEMINI_API_KEY
            fallback_llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.2, google_api_key=api_key)
            response = fallback_llm.invoke(formatted_prompt)
            print("Fallback to Gemini successful!")
            return response.content.strip()
        except Exception as fallback_err:
            print(f"Gemini fallback also failed: {fallback_err}")
            return "| ID | Category | A/C | Parameter | Research Output / Data |\n|---|---|---|---|---|\n"
