from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from config import Config

# Import routes - Firebase ones are commented out
from routes import health, careers, recommendations, roadmap, skill_gap
# from routes import progress, profile  # Commented out - requires Firebase

app = FastAPI(title="CareerPath AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers - Firebase ones are commented out
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(careers.router, prefix="/api/v1/careers", tags=["careers"])
app.include_router(recommendations.router, prefix="/api/v1/recommend", tags=["recommendations"])
app.include_router(roadmap.router, prefix="/api/v1/roadmap", tags=["roadmap"])
app.include_router(skill_gap.router, prefix="/api/v1/skill-gap", tags=["skill-gap"])
# app.include_router(progress.router, prefix="/api/v1/progress", tags=["progress"])  # Commented out
# app.include_router(profile.router, prefix="/api/v1/profile", tags=["profile"])  # Commented out

@app.get("/")
async def root():
    return {"message": "CareerPath AI API", "docs": "/docs"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=Config.PORT, reload=True)