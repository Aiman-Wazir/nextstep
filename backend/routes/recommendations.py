from fastapi import APIRouter, HTTPException
from models.recommendation import RecommendationRequest
from services.recommendation_service import RecommendationService
import logging

router = APIRouter()
service = RecommendationService()
logger = logging.getLogger(__name__)

@router.post("/")
async def get_recommendations(request: RecommendationRequest):
    '''Get career recommendations based on user profile'''
    try:
        recommendations = await service.get_recommendations(
            skills=request.skills,
            interests=request.interests,
            education=request.education,
            experience_level=request.experience_level
        )
        return {"recommendations": recommendations}
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
