from app.config.settings import settings
from supabase import create_client, Client

def get_supabase_client() -> Client:
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY
    if not url or not key:
        raise ValueError("Supabase credentials not found in environment variables.")
    return create_client(url, key)
