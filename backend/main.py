from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from config import Config

app = FastAPI(title="CareerPath AI API", version="1.0.0")

# CORS middleware - Allow all for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routes
from routes import health, careers, recommendations, roadmap, skill_gap

app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(careers.router, prefix="/api/v1/careers", tags=["careers"])
app.include_router(recommendations.router, prefix="/api/v1/recommend", tags=["recommendations"])
app.include_router(roadmap.router, prefix="/api/v1/roadmap", tags=["roadmap"])
app.include_router(skill_gap.router, prefix="/api/v1/skill-gap", tags=["skill-gap"])

@app.get("/")
async def root():
    return {"message": "CareerPath AI API", "docs": "/docs"}

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=Config.PORT, reload=True)