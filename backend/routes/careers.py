from fastapi import APIRouter, HTTPException
import json
from config import Config

router = APIRouter()

# Load career data
with open(Config.CAREER_DATA_PATH, 'r') as f:
    career_data = json.load(f)

@router.get("/")
async def get_careers():
    """Get all careers"""
    return {"careers": career_data['careers']}

@router.get("/{career_id}")
async def get_career(career_id: str):
    """Get career by ID"""
    for career in career_data['careers']:
        if career['id'] == career_id:
            return {"career": career}
    raise HTTPException(status_code=404, detail="Career not found")