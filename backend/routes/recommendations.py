from fastapi import APIRouter, HTTPException, Depends
from typing import List
import logging

from models.recommendation import RecommendationRequest, RecommendationResponse
from services.recommendation_service import RecommendationService
from dependencies import get_recommendation_service

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    service: RecommendationService = Depends(get_recommendation_service)
):
    """
    Get career recommendations based on user profile
    
    - **skills**: Dictionary of skill names and proficiency levels (1-5)
    - **interests**: List of interests
    - **education**: Education field
    - **experience_level**: Experience level (0-3)
    - **career_preferences**: Optional career preferences
    """
    try:
        recommendations = await service.get_recommendations(
            skills=request.skills,
            interests=request.interests,
            education=request.education,
            experience_level=request.experience_level,
            career_preferences=request.career_preferences
        )
        return RecommendationResponse(recommendations=recommendations)
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))