import json
from typing import Dict, List
import logging
import os

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self):
        self.groq_service = None
        try:
            # Try to import GroqService, but don't fail if not available
            from services.groq_service import GroqService
            self.groq_service = GroqService()
            logger.info("GroqService initialized successfully")
        except Exception as e:
            logger.warning(f"GroqService not available: {e}")
            self.groq_service = None
        
        # Load career data
        self.careers = {}
        self._load_career_data()
    
    def _load_career_data(self):
        """Load career data from JSON file or use fallback"""
        try:
            # Try multiple paths
            paths = [
                'data/career_dataset.json',
                os.path.join(os.path.dirname(__file__), '..', 'data', 'career_dataset.json'),
                os.path.join(os.path.dirname(__file__), '..', '..', 'backend', 'data', 'career_dataset.json'),
                os.path.join(os.getcwd(), 'data', 'career_dataset.json')
            ]
            
            # Also try using config if available
            try:
                from config import Config
                paths.insert(0, Config.CAREER_DATA_PATH)
            except:
                pass
            
            loaded = False
            for path in paths:
                try:
                    if os.path.exists(path):
                        with open(path, 'r', encoding='utf-8') as f:
                            self.career_data = json.load(f)
                            self.careers = {c['id']: c for c in self.career_data['careers']}
                            logger.info(f"Loaded {len(self.careers)} careers from {path}")
                            loaded = True
                            break
                except Exception as e:
                    logger.warning(f"Error loading from {path}: {e}")
                    continue
            
            if not loaded:
                logger.warning("No career data file found. Using fallback data.")
                self._create_fallback_careers()
                
        except Exception as e:
            logger.error(f"Error loading career data: {e}")
            self._create_fallback_careers()
    
    def _create_fallback_careers(self):
        """Create fallback career data if file not found"""
        self.careers = {
            "ai_engineer": {
                "id": "ai_engineer",
                "name": "AI Engineer",
                "category": "Artificial Intelligence",
                "description": "Designs and deploys AI systems and machine learning models",
                "required_skills": {
                    "python": {"level": 4},
                    "machine_learning": {"level": 4},
                    "deep_learning": {"level": 3},
                    "tensorflow": {"level": 3},
                    "pytorch": {"level": 3}
                },
                "related_interests": ["Artificial Intelligence", "Machine Learning", "Data Science"],
                "education_requirements": ["Computer Science", "Data Science", "AI/ML"]
            },
            "data_scientist": {
                "id": "data_scientist",
                "name": "Data Scientist",
                "category": "Data Science",
                "description": "Extracts insights from complex data using statistical methods and ML",
                "required_skills": {
                    "python": {"level": 4},
                    "sql": {"level": 4},
                    "statistics": {"level": 4},
                    "machine_learning": {"level": 3},
                    "data_visualization": {"level": 3}
                },
                "related_interests": ["Data Science", "Machine Learning", "Data Analytics"],
                "education_requirements": ["Data Science", "Statistics", "Mathematics"]
            },
            "backend_developer": {
                "id": "backend_developer",
                "name": "Backend Developer",
                "category": "Software Engineering",
                "description": "Builds server-side applications and APIs",
                "required_skills": {
                    "python": {"level": 4},
                    "sql": {"level": 3},
                    "rest_apis": {"level": 4},
                    "git": {"level": 3},
                    "docker": {"level": 2}
                },
                "related_interests": ["Software Engineering", "Web Development", "Cloud Computing"],
                "education_requirements": ["Computer Science", "Software Engineering"]
            },
            "frontend_developer": {
                "id": "frontend_developer",
                "name": "Frontend Developer",
                "category": "Software Engineering",
                "description": "Creates user interfaces and web applications",
                "required_skills": {
                    "javascript": {"level": 4},
                    "react": {"level": 4},
                    "html_css": {"level": 4},
                    "git": {"level": 3},
                    "typescript": {"level": 3}
                },
                "related_interests": ["Web Development", "UI/UX", "Software Engineering"],
                "education_requirements": ["Computer Science", "Software Engineering"]
            },
            "full_stack_developer": {
                "id": "full_stack_developer",
                "name": "Full Stack Developer",
                "category": "Software Engineering",
                "description": "Builds complete web applications covering both frontend and backend",
                "required_skills": {
                    "javascript": {"level": 4},
                    "react": {"level": 4},
                    "python": {"level": 3},
                    "sql": {"level": 3},
                    "git": {"level": 3}
                },
                "related_interests": ["Web Development", "Software Engineering", "UI/UX"],
                "education_requirements": ["Computer Science", "Software Engineering"]
            },
            "cloud_engineer": {
                "id": "cloud_engineer",
                "name": "Cloud Engineer",
                "category": "Cloud Computing",
                "description": "Designs and manages cloud infrastructure",
                "required_skills": {
                    "aws": {"level": 4},
                    "docker": {"level": 3},
                    "linux": {"level": 3},
                    "python": {"level": 3},
                    "kubernetes": {"level": 2}
                },
                "related_interests": ["Cloud Computing", "DevOps", "Software Engineering"],
                "education_requirements": ["Computer Science", "Information Technology"]
            },
            "devops_engineer": {
                "id": "devops_engineer",
                "name": "DevOps Engineer",
                "category": "DevOps",
                "description": "Bridges development and operations with CI/CD and infrastructure automation",
                "required_skills": {
                    "docker": {"level": 4},
                    "kubernetes": {"level": 3},
                    "git": {"level": 4},
                    "aws": {"level": 3},
                    "linux": {"level": 3}
                },
                "related_interests": ["DevOps", "Cloud Computing", "Software Engineering"],
                "education_requirements": ["Computer Science", "Information Technology"]
            },
            "data_engineer": {
                "id": "data_engineer",
                "name": "Data Engineer",
                "category": "Data Engineering",
                "description": "Builds and maintains data pipelines and infrastructure",
                "required_skills": {
                    "python": {"level": 4},
                    "sql": {"level": 4},
                    "spark": {"level": 3},
                    "aws": {"level": 3}
                },
                "related_interests": ["Data Science", "Cloud Computing", "Software Engineering"],
                "education_requirements": ["Computer Science", "Data Engineering"]
            }
        }
        logger.info(f"Created {len(self.careers)} fallback careers")
    
    async def get_recommendations(self, skills: Dict[str, int], interests: List[str], 
                                  education: str, experience_level: int) -> List[Dict]:
        """Generate career recommendations"""
        recommendations = []
        
        if not self.careers:
            logger.warning("No careers available for recommendations")
            return [{
                "career_id": "no_data",
                "career_name": "No Career Data Available",
                "match_score": 0,
                "description": "Please ensure career_dataset.json is in the data folder",
                "category": "Error"
            }]
        
        logger.info(f"Processing request with {len(skills)} skills, {len(interests)} interests")
        
        for career_id, career in self.careers.items():
            try:
                score = self._calculate_match_score(skills, interests, education, experience_level, career)
                
                if score > 0:
                    recommendations.append({
                        "career_id": career_id,
                        "career_name": career.get('name', career_id),
                        "match_score": round(score * 100, 2),
                        "description": career.get('description', ''),
                        "category": career.get('category', '')
                    })
            except Exception as e:
                logger.error(f"Error calculating score for {career_id}: {e}")
                continue
        
        # Sort by score descending
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        top_recommendations = recommendations[:5]
        
        # Add explanations (try Groq, fallback to template)
        for rec in top_recommendations:
            career = self.careers.get(rec['career_id'], {})
            try:
                if self.groq_service:
                    try:
                        rec['explanation'] = self.groq_service.generate_career_explanation(
                            {"skills": skills, "interests": interests, "education": education, "experience_level": experience_level},
                            career,
                            rec['match_score']
                        )
                    except Exception as e:
                        logger.error(f"Groq explanation error: {e}")
                        rec['explanation'] = self._generate_fallback_explanation(career, rec['match_score'])
                else:
                    rec['explanation'] = self._generate_fallback_explanation(career, rec['match_score'])
            except Exception as e:
                logger.error(f"Error generating explanation: {e}")
                rec['explanation'] = f"{rec['career_name']} is a great match based on your skills and interests."
        
        logger.info(f"Returning {len(top_recommendations)} recommendations")
        return top_recommendations
    
    def _generate_fallback_explanation(self, career: Dict, match_score: float) -> str:
        """Generate a fallback explanation without Groq"""
        career_name = career.get('name', 'This career')
        required_skills = list(career.get('required_skills', {}).keys())
        skills_str = ", ".join(required_skills[:3])
        
        return f"""Based on your profile, {career_name} is an excellent match with a {match_score}% score.

Your skills align well with this career path. Focus on developing expertise in: {skills_str}.

With continued learning and practical experience, you can build a successful career in this field."""
    
    def _calculate_match_score(self, skills: Dict[str, int], interests: List[str], 
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
            
        for skill, req in required_skills.items():
            total_weight += 2
            user_level = skills.get(skill, 0)
            required_level = req.get('level', 3) if isinstance(req, dict) else req
            
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
        
        # Check experience level (bonus for having experience)
        if experience_level >= 1:
            total_weight += 0.5
            score += 0.3 * min(experience_level, 3)  # Cap at 3
        
        # Return normalized score, ensure it's never > 1
        result = score / total_weight if total_weight > 0 else 0
        return min(result, 1.0)