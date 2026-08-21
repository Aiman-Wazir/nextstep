from fastapi import APIRouter, HTTPException
from models.recommendation import RecommendationRequest
from services.recommendation_service import RecommendationService
import logging
import asyncio

router = APIRouter()
logger = logging.getLogger(__name__)

# Create service instance
try:
    service = RecommendationService()
except Exception as e:
    logger.error(f"Error creating RecommendationService: {e}")
    service = None

@router.post("/")
async def get_recommendations(request: RecommendationRequest):
    """Get career recommendations based on user profile"""
    try:
        logger.info(f"Received recommendation request with {len(request.skills)} skills, {len(request.interests)} interests")
        
        if service is None:
            logger.error("RecommendationService not available")
            raise HTTPException(status_code=500, detail="Recommendation service not available")
        
        # Call the method and wait for it to complete
        recommendations = await service.get_recommendations(
            skills=request.skills,
            interests=request.interests,
            education=request.education,
            experience_level=request.experience_level
        )
        
        # Ensure we have a list
        if recommendations is None:
            recommendations = []
        
        logger.info(f"Returning {len(recommendations)} recommendations")
        
        # Return a proper JSON response
        return {
            "recommendations": recommendations
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting recommendations: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")