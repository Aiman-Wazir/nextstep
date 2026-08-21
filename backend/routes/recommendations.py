from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

# Define request model here to avoid import issues
class RecommendRequest(BaseModel):
    skills: Dict[str, int]
    interests: List[str]
    education: str
    experience_level: int

@router.post("/")
async def get_recommendations(request: RecommendRequest):
    """Get career recommendations based on user profile"""
    try:
        logger.info(f"Received request with skills: {list(request.skills.keys())}")
        
        # Import here to avoid circular imports
        from services.recommendation_service import get_recommendations_sync
        
        # Call the synchronous function
        recommendations = get_recommendations_sync(
            skills=request.skills,
            interests=request.interests,
            education=request.education,
            experience_level=request.experience_level
        )
        
        logger.info(f"Returning {len(recommendations)} recommendations")
        return {"recommendations": recommendations}
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))