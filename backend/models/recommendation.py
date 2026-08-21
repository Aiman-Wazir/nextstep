from pydantic import BaseModel
from typing import Dict, List, Optional

class RecommendationRequest(BaseModel):
    skills: Dict[str, int]
    interests: List[str]
    education: str
    experience_level: int
    career_preferences: Optional[Dict] = None

class Recommendation(BaseModel):
    career_id: str
    career_name: str
    match_score: float
    description: str
    category: str
    explanation: Optional[str] = None

class RecommendationResponse(BaseModel):
    recommendations: List[Recommendation]