from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List

router = APIRouter()

class SkillGapRequest(BaseModel):
    career_id: str
    skills: Dict[str, int]

@router.post("/")
async def analyze_skill_gap(request: SkillGapRequest):
    """Analyze skill gaps for a career"""
    try:
        import json
        from config import Config
        
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
        
        required_skills = career.get('required_skills', {})
        recommended_skills = career.get('recommended_skills', {})
        
        # Analyze gaps
        strong_skills = []
        missing_skills = []
        skills_to_improve = []
        
        # Check required skills
        for skill, req in required_skills.items():
            user_level = request.skills.get(skill, 0)
            required_level = req.get('level', 3)
            
            if user_level >= required_level:
                strong_skills.append(skill)
            elif user_level > 0:
                skills_to_improve.append({
                    'skill': skill,
                    'current': user_level,
                    'required': required_level,
                    'gap': required_level - user_level
                })
            else:
                missing_skills.append({
                    'skill': skill,
                    'required': required_level
                })
        
        # Check recommended skills
        for skill, req in recommended_skills.items():
            if skill not in request.skills:
                missing_skills.append({
                    'skill': skill,
                    'required': req.get('level', 2)
                })
        
        return {
            'career': career['name'],
            'strong_skills': strong_skills,
            'skills_to_improve': skills_to_improve,
            'missing_skills': missing_skills,
            'total_required': len(required_skills),
            'total_matched': len(strong_skills),
            'match_percentage': (len(strong_skills) / len(required_skills)) * 100 if required_skills else 0
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))