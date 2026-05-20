from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from app.config.settings import settings
import time
import os

def run_consolidation_agent(company_name: str, groq_out: str, gemini_out: str, cerebras_out: str) -> str:
    # Use Gemini 2.5 Flash for fast and highly accurate consolidation of all rows at once
    from langchain_google_genai import ChatGoogleGenerativeAI
    api_key = settings.GOOGLE_API_KEY or settings.GEMINI_API_KEY
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", temperature=0.1, google_api_key=api_key)
    
    # Read prompt
    with open(os.path.join(os.path.dirname(__file__), '..', 'prompts', 'consolidation_prompt.txt'), 'r') as f:
        prompt_template = f.read()
    
    def extract_rows_and_add_source(md_table, source):
        lines = md_table.strip().split('\n')
        rows = []
        for line in lines:
            line = line.strip()
            if not line or line.startswith('| ID') or line.startswith('|---') or line.startswith('|:---'):
                continue
            if line.startswith('|'):
                # Split off the trailing pipe so we can insert the source nicely
                content = line.rsplit('|', 1)[0].strip()
                row = f"{content} | {source} |"
                rows.append(row)
        return rows
        
    all_rows = []
    all_rows.extend(extract_rows_and_add_source(groq_out, "Groq"))
    all_rows.extend(extract_rows_and_add_source(gemini_out, "Gemini"))
    all_rows.extend(extract_rows_and_add_source(cerebras_out, "Cerebras"))
    
    # Sort rows by ID numerically so we can present them clearly to the model
    try:
        all_rows.sort(key=lambda x: int(x.split('|')[1].strip()))
    except:
        pass
        
    print(f"Consolidating all {len(all_rows)} candidate rows from Groq, Gemini, and Cerebras...")
    
    combined_dataset = "| ID | Category | A/C | Parameter | Research Output / Data | Source |\n"
    combined_dataset += "|---|---|---|---|---|---|\n"
    combined_dataset += "\n".join(all_rows)
    
    prompt = PromptTemplate.from_template(prompt_template)
    formatted_prompt = prompt.format(input_dataset=combined_dataset)
    
    response = llm.invoke(formatted_prompt)
    return response.content.strip()
