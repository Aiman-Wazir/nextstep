from pydantic import BaseModel
from typing import List, Dict

class SkillGapRequest(BaseModel):
    career_id: str
    skills: Dict[str, int]

class SkillGapResponse(BaseModel):
    career: str
    strong_skills: List[str]
    skills_to_improve: List[Dict]
    missing_skills: List[Dict]
    match_percentage: float
