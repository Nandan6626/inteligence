from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # API Settings
    APP_NAME: str = "Company Intelligence API"
    DEBUG: bool = False
    VERSION: str = "1.0.0"
    
    # LLM Provider Keys
    OPENAI_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    CEREBRAS_API_KEY: Optional[str] = None
    GROQ_API_KEY: Optional[str] = None
    
    # Supabase
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    
    # Persistence
    REDIS_URL: str = "redis://localhost:6379/0"
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
