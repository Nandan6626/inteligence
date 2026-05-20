def parse_markdown_table(md_text: str) -> list[dict]:
    parsed_data = []
    if not isinstance(md_text, str):
        return []
        
    lines = md_text.strip().split('\n')
    headers = []
    for line in lines:
        line = line.strip()
        # A markdown table row must start and end with '|'
        if not line.startswith('|') or not line.endswith('|'):
            continue
        if line.startswith('|---') or line.startswith('|:---') or line.startswith('| ---'):
            continue
            
        cols = [c.strip() for c in line.split('|')][1:-1]
        
        if not headers:
            headers = cols
            continue
            
        if len(cols) == len(headers):
            row_dict = dict(zip(headers, cols))
            parsed_data.append(row_dict)
            
    return parsed_data

def validate_individual_output(parsed_data: list) -> list[dict]:
    """
    Validates individual LLM output. 
    Normalizes key names and keeps rows that have actual data.
    """
    valid_data = []
    for row in parsed_data:
        # Robust ID retrieval
        id_val = None
        for k, v in row.items():
            if k.strip().lower() == "id":
                id_val = str(v).strip()
                break
                
        # Robust Research Output / Data retrieval
        data_val = None
        for k, v in row.items():
            k_clean = k.strip().lower()
            if "research" in k_clean or "output" in k_clean or "data" in k_clean:
                data_val = str(v).strip()
                break
                
        if data_val is None:
            data_val = row.get("Research Output / Data", "")
            
        # Basic check to filter out empty rows
        if id_val and data_val and data_val.strip() != "" and data_val.strip().lower() not in ["none", "n/a", "not found"]:
            # Normalize row keys
            row_clean = {
                "ID": id_val,
                "Category": row.get("Category", row.get("category", "")).strip(),
                "A/C": row.get("A/C", row.get("a/c", row.get("Content Type to Generate", ""))).strip(),
                "Parameter": row.get("Parameter", row.get("parameter", "")).strip(),
                "Research Output / Data": data_val
            }
            valid_data.append(row_clean)
    return valid_data

def validate_final_profile(profile: list) -> tuple[list[str], list[str]]:
    """
    Validation Suite:
    - Checks that exactly 163 parameters exist.
    Returns (errors, missing_fields)
    """
    errors = []
    missing_fields = []
    
    found_ids = set()
    for row in profile:
        found_ids.add(str(row.get("ID", "")).strip())
        
    expected_ids = set(str(i) for i in range(1, 164))
    missing_set = expected_ids - found_ids
    
    if missing_set:
        missing_fields = sorted(list(missing_set), key=lambda x: int(x) if x.isdigit() else 999)
        errors.append(f"Missing {len(missing_fields)} parameters out of 163.")
        
    return errors, missing_fields
