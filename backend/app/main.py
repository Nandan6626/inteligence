from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import agent, health
from app.api.routers import company_router, analytics_router, upload_router
from app.config.settings import settings
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title=settings.APP_NAME,
    description="Scalable Multi-agent AI pipeline for company analysis",
    version=settings.VERSION,
    debug=settings.DEBUG
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include New Agent Workflow Routers
app.include_router(agent.router, prefix="/api/v1/agent", tags=["Agent Workflow"])
app.include_router(health.router, prefix="/health", tags=["System"])

# Include Legacy Routers (Updated paths)
app.include_router(upload_router.router, prefix="/api/v1/upload", tags=["Upload"])
app.include_router(company_router.router, prefix="/api/v1/companies", tags=["Companies"])
app.include_router(analytics_router.router, prefix="/api/v1/analytics", tags=["Analytics"])

@app.get("/")
def read_root():
    return {
        "message": f"Welcome to the {settings.APP_NAME}",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
