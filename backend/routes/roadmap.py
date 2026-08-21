from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List
from services.groq_service import GroqService
import json
from config import Config

router = APIRouter()
groq_service = GroqService()

class RoadmapRequest(BaseModel):
    career_id: str
    skills: Dict[str, int]
    interests: List[str]
    education: str
    experience_level: int

@router.post("/")
async def generate_roadmap(request: RoadmapRequest):
    '''Generate learning roadmap for a career'''
    try:
        # Load career data
        with open(Config.CAREER_DATA_PATH, 'r') as f:
            career_data = json.load(f)
        
        # Find career
        career = None
        for c in career_data['careers']:
            if c['id'] == request.career_id:
                career = c
                break
        
        if not career:
            raise HTTPException(status_code=404, detail="Career not found")
        
        # Analyze skill gaps
        required_skills = career.get('required_skills', {})
        missing_skills = []
        skills_to_improve = []
        
        for skill, req in required_skills.items():
            user_level = request.skills.get(skill, 0)
            required_level = req.get('level', 3) if isinstance(req, dict) else req
            if user_level == 0:
                missing_skills.append(skill)
            elif user_level < required_level:
                skills_to_improve.append(skill)
        
        skill_gaps = {
            'missing_skills': missing_skills[:10],
            'skills_to_improve': skills_to_improve[:10]
        }
        
        # Generate roadmap using Groq
        user_profile = {
            'skills': request.skills,
            'interests': request.interests,
            'education': request.education,
            'experience_level': request.experience_level
        }
        
        roadmap = groq_service.generate_learning_roadmap(user_profile, career, skill_gaps)
        
        return {
            'career': career['name'],
            'skill_gaps': skill_gaps,
            'roadmap': roadmap
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
