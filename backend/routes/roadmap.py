from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
import logging
import json
import os

router = APIRouter()
logger = logging.getLogger(__name__)

class RoadmapRequest(BaseModel):
    career_id: str
    skills: Dict[str, int]
    interests: List[str]
    education: str
    experience_level: int

def load_careers():
    """Load career data from JSON file"""
    paths = [
        'data/career_dataset.json',
        os.path.join(os.path.dirname(__file__), '..', 'data', 'career_dataset.json'),
        os.path.join(os.getcwd(), 'data', 'career_dataset.json'),
        os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'data', 'career_dataset.json')
    ]
    
    for path in paths:
        try:
            if os.path.exists(path):
                with open(path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    careers = {c['id']: c for c in data.get('careers', [])}
                    return careers
        except Exception as e:
            logger.warning(f"Could not load from {path}: {e}")
    
    return {}

def generate_learning_roadmap(career: Dict, skills: Dict[str, int]) -> Dict:
    """Generate a learning roadmap for a career"""
    career_name = career.get('name', 'Unknown Career')
    
    # Get required and recommended skills
    required_skills = career.get('required_skills', {})
    recommended_skills = career.get('recommended_skills', {})
    
    # Identify skill gaps
    skill_gaps = []
    for skill, req in required_skills.items():
        user_level = skills.get(skill, 0)
        required_level = req.get('level', 3) if isinstance(req, dict) else req
        if user_level < required_level:
            skill_gaps.append({
                'skill': skill,
                'current': user_level,
                'required': required_level,
                'gap': required_level - user_level
            })
    
    # Get learning resources
    learning_resources = career.get('learning_resources', {})
    roadmap = career.get('learning_roadmap', {})
    
    # Build structured roadmap
    months = []
    
    # Month 1-2: Fundamentals
    month1_content = "Build a strong foundation in core concepts and technologies.\n\n"
    month1_content += "Focus Areas:\n"
    month1_content += "• Understanding the career landscape and requirements\n"
    month1_content += "• Setting up development environment\n"
    month1_content += "• Learning fundamental tools and technologies\n\n"
    
    beginner_resources = learning_resources.get('beginner', [])
    if beginner_resources:
        month1_content += "Recommended Resources:\n"
        for resource in beginner_resources[:3]:
            month1_content += f"• {resource}\n"
    
    months.append({
        "month": "Month 1-2: Fundamentals & Foundation",
        "content": month1_content
    })
    
    # Month 3-4: Core Skills
    month2_content = "Develop expertise in core skills required for this career.\n\n"
    month2_content += "Focus Areas:\n"
    
    # Add skill gaps that need attention
    if skill_gaps:
        month2_content += "• Skills to develop:\n"
        for gap in skill_gaps[:3]:
            month2_content += f"  - {gap['skill']} (Current: {gap['current']}/5, Target: {gap['required']}/5)\n"
    
    month2_content += "\n"
    intermediate_resources = learning_resources.get('intermediate', [])
    if intermediate_resources:
        month2_content += "Recommended Resources:\n"
        for resource in intermediate_resources[:3]:
            month2_content += f"• {resource}\n"
    
    months.append({
        "month": "Month 3-4: Core Skills Development",
        "content": month2_content
    })
    
    # Month 5-6: Advanced Skills & Projects
    month3_content = "Master advanced concepts and build practical projects.\n\n"
    month3_content += "Focus Areas:\n"
    month3_content += "• Advanced topics and best practices\n"
    month3_content += "• Building portfolio projects\n"
    month3_content += "• Preparing for job interviews\n\n"
    
    advanced_resources = learning_resources.get('advanced', [])
    if advanced_resources:
        month3_content += "Recommended Resources:\n"
        for resource in advanced_resources[:3]:
            month3_content += f"• {resource}\n"
    
    # Add job roles
    job_roles = career.get('job_roles', [])
    if job_roles:
        month3_content += f"\nPotential Job Roles: {', '.join(job_roles[:3])}\n"
    
    months.append({
        "month": "Month 5-6: Advanced Skills & Projects",
        "content": month3_content
    })
    
    return {
        "roadmap": f"Learning Roadmap for {career_name}",
        "structured": {
            "months": months
        },
        "skill_gaps": skill_gaps,
        "career_name": career_name
    }

@router.post("/")
async def generate_roadmap(request: RoadmapRequest):
    """Generate a learning roadmap for a career"""
    try:
        logger.info(f"Generating roadmap for career: {request.career_id}")
        
        # Load careers
        careers = load_careers()
        
        if not careers:
            raise HTTPException(status_code=404, detail="No career data available")
        
        # Find the career
        career = careers.get(request.career_id)
        if not career:
            raise HTTPException(status_code=404, detail=f"Career '{request.career_id}' not found")
        
        # Generate roadmap
        roadmap_data = generate_learning_roadmap(career, request.skills)
        
        return {
            "career": career.get('name', request.career_id),
            "skill_gaps": roadmap_data.get('skill_gaps', []),
            "roadmap": {
                "roadmap": roadmap_data.get('roadmap', ''),
                "structured": roadmap_data.get('structured', {'months': []})
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating roadmap: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))