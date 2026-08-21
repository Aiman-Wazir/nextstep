import json
import os
import logging
from typing import Dict, List, Union

logger = logging.getLogger(__name__)

# Global cache for careers
_CAREERS = None

def load_careers():
    """Load careers from JSON file or use fallback"""
    global _CAREERS
    
    if _CAREERS is not None:
        return _CAREERS
    
    careers = {}
    
    # Try to load from file
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
                    logger.info(f"Loaded {len(careers)} careers from {path}")
                    _CAREERS = careers
                    return careers
        except Exception as e:
            logger.warning(f"Could not load from {path}: {e}")
    
    # Fallback careers - using simple integer levels
    logger.warning("Using fallback career data")
    careers = {
        "ai_engineer": {
            "id": "ai_engineer",
            "name": "AI Engineer",
            "category": "Artificial Intelligence",
            "description": "Designs and deploys AI systems and machine learning models",
            "required_skills": {"python": 4, "machine_learning": 4, "deep_learning": 3, "tensorflow": 3},
            "related_interests": ["Artificial Intelligence", "Machine Learning", "Data Science"],
            "education_requirements": ["Computer Science", "Data Science", "AI/ML"]
        },
        "data_scientist": {
            "id": "data_scientist",
            "name": "Data Scientist",
            "category": "Data Science",
            "description": "Extracts insights from complex data using statistical methods and ML",
            "required_skills": {"python": 4, "sql": 4, "statistics": 4, "machine_learning": 3},
            "related_interests": ["Data Science", "Machine Learning", "Data Analytics"],
            "education_requirements": ["Data Science", "Statistics", "Mathematics"]
        },
        "backend_developer": {
            "id": "backend_developer",
            "name": "Backend Developer",
            "category": "Software Engineering",
            "description": "Builds server-side applications and APIs",
            "required_skills": {"python": 4, "sql": 3, "rest_apis": 4, "git": 3},
            "related_interests": ["Software Engineering", "Web Development", "Cloud Computing"],
            "education_requirements": ["Computer Science", "Software Engineering"]
        },
        "frontend_developer": {
            "id": "frontend_developer",
            "name": "Frontend Developer",
            "category": "Software Engineering",
            "description": "Creates user interfaces and web applications",
            "required_skills": {"javascript": 4, "react": 4, "html_css": 4, "git": 3},
            "related_interests": ["Web Development", "UI/UX", "Software Engineering"],
            "education_requirements": ["Computer Science", "Software Engineering"]
        },
        "full_stack_developer": {
            "id": "full_stack_developer",
            "name": "Full Stack Developer",
            "category": "Software Engineering",
            "description": "Builds complete web applications covering both frontend and backend",
            "required_skills": {"javascript": 4, "react": 4, "python": 3, "sql": 3, "git": 3},
            "related_interests": ["Web Development", "Software Engineering", "UI/UX"],
            "education_requirements": ["Computer Science", "Software Engineering"]
        },
        "cloud_engineer": {
            "id": "cloud_engineer",
            "name": "Cloud Engineer",
            "category": "Cloud Computing",
            "description": "Designs and manages cloud infrastructure",
            "required_skills": {"aws": 4, "docker": 3, "linux": 3, "python": 3},
            "related_interests": ["Cloud Computing", "DevOps", "Software Engineering"],
            "education_requirements": ["Computer Science", "Information Technology"]
        },
        "devops_engineer": {
            "id": "devops_engineer",
            "name": "DevOps Engineer",
            "category": "DevOps",
            "description": "Bridges development and operations with CI/CD and infrastructure automation",
            "required_skills": {"docker": 4, "kubernetes": 3, "git": 4, "aws": 3, "linux": 3},
            "related_interests": ["DevOps", "Cloud Computing", "Software Engineering"],
            "education_requirements": ["Computer Science", "Information Technology"]
        },
        "data_engineer": {
            "id": "data_engineer",
            "name": "Data Engineer",
            "category": "Data Engineering",
            "description": "Builds and maintains data pipelines and infrastructure",
            "required_skills": {"python": 4, "sql": 4, "spark": 3, "aws": 3},
            "related_interests": ["Data Science", "Cloud Computing", "Software Engineering"],
            "education_requirements": ["Computer Science", "Data Engineering"]
        }
    }
    
    _CAREERS = careers
    return careers


def get_skill_level(skill_value: Union[int, dict]) -> int:
    """Extract skill level from either int or dict format"""
    if isinstance(skill_value, int):
        return skill_value
    elif isinstance(skill_value, dict):
        return skill_value.get('level', 3)
    return 3


def calculate_match_score(skills: Dict[str, int], interests: List[str], 
                          education: str, experience_level: int, career: Dict) -> float:
    """Calculate match score for a career"""
    if not career:
        return 0
    
    score = 0
    total_weight = 0
    
    # Check required skills
    required_skills = career.get('required_skills', {})
    if not required_skills:
        return 0
    
    for skill, skill_data in required_skills.items():
        total_weight += 2
        user_level = skills.get(skill, 0)
        required_level = get_skill_level(skill_data)
        
        if user_level >= required_level:
            score += 2
        elif user_level > 0:
            score += (user_level / required_level) * 1.5
    
    # Check interests
    career_interests = career.get('related_interests', [])
    for interest in interests:
        if interest in career_interests:
            total_weight += 0.5
            score += 0.5
    
    # Check education
    education_requirements = career.get('education_requirements', [])
    if education in education_requirements:
        total_weight += 1
        score += 1
    
    # Experience bonus
    if experience_level >= 1:
        total_weight += 0.5
        score += 0.3 * min(experience_level, 3)
    
    # Return normalized score
    if total_weight == 0:
        return 0
    return min(score / total_weight, 1.0)


def generate_explanation(career: Dict, match_score: float) -> str:
    """Generate a simple explanation"""
    career_name = career.get('name', 'This career')
    required_skills = list(career.get('required_skills', {}).keys())
    skills_str = ", ".join(required_skills[:3])
    
    return f"""Based on your profile, {career_name} is an excellent match with a {match_score:.1f}% score.

Your skills align well with this career path. Focus on developing expertise in: {skills_str}.

With continued learning and practical experience, you can build a successful career in this field."""


def get_recommendations_sync(skills: Dict[str, int], interests: List[str], 
                             education: str, experience_level: int) -> List[Dict]:
    """Get career recommendations (synchronous version)"""
    careers = load_careers()
    recommendations = []
    
    if not careers:
        return [{
            "career_id": "no_data",
            "career_name": "No Career Data Available",
            "match_score": 0,
            "description": "Please ensure career_dataset.json is in the data folder",
            "category": "Error",
            "explanation": "No career data available"
        }]
    
    for career_id, career in careers.items():
        score = calculate_match_score(skills, interests, education, experience_level, career)
        
        if score > 0:
            match_percentage = round(score * 100, 2)
            recommendations.append({
                "career_id": career_id,
                "career_name": career.get('name', career_id),
                "match_score": match_percentage,
                "description": career.get('description', ''),
                "category": career.get('category', ''),
                "explanation": generate_explanation(career, match_percentage)
            })
    
    # Sort by score descending
    recommendations.sort(key=lambda x: x['match_score'], reverse=True)
    
    return recommendations[:5]