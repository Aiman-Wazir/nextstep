import json
from typing import Dict, List
import logging
from services.groq_service import GroqService
from config import Config

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self):
        self.groq_service = GroqService()
        
        # Load career data
        try:
            with open(Config.CAREER_DATA_PATH, 'r') as f:
                self.career_data = json.load(f)
            self.careers = {c['id']: c for c in self.career_data['careers']}
        except Exception as e:
            logger.error(f"Error loading career data: {e}")
            self.careers = {}
    
    async def get_recommendations(self, skills: Dict[str, int], interests: List[str], 
                                  education: str, experience_level: int) -> List[Dict]:
        '''Generate career recommendations'''
        recommendations = []
        
        for career_id, career in self.careers.items():
            score = self._calculate_match_score(skills, interests, education, experience_level, career)
            
            if score > 0:
                recommendations.append({
                    "career_id": career_id,
                    "career_name": career.get('name', career_id),
                    "match_score": round(score * 100, 2),
                    "description": career.get('description', ''),
                    "category": career.get('category', '')
                })
        
        # Sort by score descending
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        top_recommendations = recommendations[:5]
        
        # Add explanations using Groq
        for rec in top_recommendations:
            career = self.careers.get(rec['career_id'], {})
            try:
                rec['explanation'] = self.groq_service.generate_career_explanation(
                    {"skills": skills, "interests": interests, "education": education, "experience_level": experience_level},
                    career,
                    rec['match_score']
                )
            except Exception as e:
                logger.error(f"Error generating explanation: {e}")
                rec['explanation'] = f"{rec['career_name']} is a great match based on your skills and interests."
        
        return top_recommendations
    
    def _calculate_match_score(self, skills: Dict[str, int], interests: List[str], 
                               education: str, experience_level: int, career: Dict) -> float:
        '''Calculate match score for a career'''
        if not career:
            return 0
            
        score = 0
        total_weight = 0
        
        # Check required skills
        required_skills = career.get('required_skills', {})
        for skill, req in required_skills.items():
            total_weight += 2
            user_level = skills.get(skill, 0)
            required_level = req.get('level', 3) if isinstance(req, dict) else req
            
            if user_level >= required_level:
                score += 2
            elif user_level > 0:
                score += (user_level / required_level) * 1.5
        
        # Check recommended skills
        recommended_skills = career.get('recommended_skills', {})
        for skill, req in recommended_skills.items():
            total_weight += 1
            user_level = skills.get(skill, 0)
            recommended_level = req.get('level', 2) if isinstance(req, dict) else req
            
            if user_level >= recommended_level:
                score += 1
            elif user_level > 0:
                score += (user_level / recommended_level) * 0.8
        
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
        
        # Check experience level
        exp_levels = career.get('experience_levels', [])
        if exp_levels:
            total_weight += 0.5
            if experience_level <= len(exp_levels) - 1:
                score += 0.5
        
        return score / total_weight if total_weight > 0 else 0
