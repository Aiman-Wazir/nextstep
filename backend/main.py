from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import routes
from routes import health, careers, recommendations, roadmap, skill_gap, progress, profile

app = FastAPI(
    title="CareerPath AI API",
    description="AI-powered career recommendation platform",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted host middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]  # Configure appropriately for production
)

# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(careers.router, prefix="/api/v1/careers", tags=["careers"])
app.include_router(recommendations.router, prefix="/api/v1/recommend", tags=["recommendations"])
app.include_router(roadmap.router, prefix="/api/v1/roadmap", tags=["roadmap"])
app.include_router(skill_gap.router, prefix="/api/v1/skill-gap", tags=["skill-gap"])
app.include_router(progress.router, prefix="/api/v1/progress", tags=["progress"])
app.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])

@app.get("/")
async def root():
    return {
        "message": "Welcome to CareerPath AI API",
        "docs": "/docs",
        "redoc": "/redoc"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENVIRONMENT") == "development"
    )