import os
import json
from typing import Dict, List, Any, Optional
import logging
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

logger = logging.getLogger(__name__)

class GroqService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if not self.api_key:
            raise ValueError("GROQ_API_KEY not set in environment variables")
        
        self.client = Groq(api_key=self.api_key)
        self.model = "mixtral-8x7b-32768"  # or "llama3-70b-8192", "gemma2-9b-it"
        self.temperature = 0.7
        self.max_tokens = 800
        
    async def generate_career_explanation(
        self,
        user_profile: Dict,
        career: Dict,
        match_score: float,
        skill_gaps: Dict = None
    ) -> str:
        """Generate a personalized career explanation using Groq"""
        prompt = self._build_career_explanation_prompt(
            user_profile, career, match_score, skill_gaps
        )
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": """You are a career advisor expert with deep knowledge of technology careers. 
                        Provide clear, encouraging, and personalized career explanations 
                        based on the user's profile and career match.
                        
                        Guidelines:
                        - Be specific about why the career fits
                        - Highlight the user's strengths that align with the career
                        - Address any skill gaps constructively
                        - Be encouraging but realistic
                        - Keep it between 200-300 words"""
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            return self._get_fallback_explanation(career)
    
    async def generate_learning_roadmap(
        self,
        user_profile: Dict,
        career: Dict,
        skill_gaps: Dict
    ) -> Dict[str, Any]:
        """Generate a personalized learning roadmap using Groq"""
        prompt = self._build_roadmap_prompt(user_profile, career, skill_gaps)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": """You are a learning path expert and technical mentor.
                        Create detailed, structured monthly learning plans that build 
                        from the user's current level to career readiness.
                        
                        Format your response as:
                        Month 1: [Title]
                        - Focus areas
                        - Specific topics
                        - Recommended resources
                        - Practical projects
                        
                        Month 2: [Title]
                        ... (continue for 6 months)
                        
                        Make each month build on the previous month."""
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.6,
                max_tokens=1200
            )
            
            # Parse response into structured format
            roadmap = self._parse_roadmap_response(response.choices[0].message.content)
            return roadmap
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            return self._get_fallback_roadmap(career)
    
    async def generate_skill_gap_analysis(
        self,
        user_skills: Dict[str, int],
        career_requirements: Dict,
        career_name: str
    ) -> str:
        """Generate an explanation of skill gaps using Groq"""
        prompt = self._build_skill_gap_prompt(user_skills, career_requirements, career_name)
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system", 
                        "content": """You are a skills development expert.
                        Provide a clear, actionable analysis of skill gaps.
                        Explain what skills need development and how to acquire them.
                        Be specific and practical."""
                    },
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=400
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Groq API error: {str(e)}")
            return "Please refer to the skill gap analysis above for areas to focus on."
    
    def _build_career_explanation_prompt(
        self,
        user_profile: Dict,
        career: Dict,
        match_score: float,
        skill_gaps: Dict = None
    ) -> str:
        """Build prompt for career explanation"""
        skills_str = ", ".join([
            f"{k} (Level {v})" for k, v in user_profile.get('skills', {}).items()
            if v >= 2
        ][:15])
        
        interests_str = ", ".join(user_profile.get('interests', [])[:5])
        
        strong_skills = ", ".join([
            k for k, v in user_profile.get('skills', {}).items()
            if v >= 4
        ][:5]) or "None listed"
        
        missing_skills = ", ".join(skill_gaps.get('missing_skills', [])[:5]) if skill_gaps else "None identified"
        improve_skills = ", ".join(skill_gaps.get('skills_to_improve', [])[:5]) if skill_gaps else "None identified"
        
        return f"""
        User Profile:
        - Skills: {skills_str}
        - Interests: {interests_str}
        - Education: {user_profile.get('education', 'Not specified')}
        - Experience Level: {user_profile.get('experience_level', 'Entry')}
        - Strong Skills: {strong_skills}
        
        Career Match:
        - Career: {career.get('name', '')}
        - Match Score: {match_score}%
        - Description: {career.get('description', '')}
        - Required Skills: {', '.join(career.get('required_skills', {}).keys())[:10]}
        
        Skill Analysis:
        - Skills to Improve: {improve_skills}
        - Missing Skills: {missing_skills}
        
        Provide a personalized explanation of why this career is a good match.
        Explain how their current skills and interests align with this career path.
        Address their skill gaps constructively and provide encouragement.
        """
    
    def _build_roadmap_prompt(
        self,
        user_profile: Dict,
        career: Dict,
        skill_gaps: Dict
    ) -> str:
        """Build prompt for learning roadmap"""
        current_skills = ", ".join([
            f"{k} (Level {v})" for k, v in user_profile.get('skills', {}).items()
            if v >= 3
        ][:10])
        
        missing_skills = ", ".join(skill_gaps.get('missing_skills', [])[:10])
        improve_skills = ", ".join(skill_gaps.get('skills_to_improve', [])[:10])
        
        return f"""
        User Profile:
        - Current Strong Skills: {current_skills}
        - Missing Skills: {missing_skills}
        - Skills to Improve: {improve_skills}
        - Experience Level: {user_profile.get('experience_level', 'Entry')}
        - Education: {user_profile.get('education', 'Not specified')}
        
        Target Career: {career.get('name', '')}
        Career Description: {career.get('description', '')}
        Required Skills: {', '.join(career.get('required_skills', {}).keys())[:10]}
        
        Learning Resources Available:
        Beginner: {', '.join(career.get('learning_resources', {}).get('beginner', [])[:3])}
        Intermediate: {', '.join(career.get('learning_resources', {}).get('intermediate', [])[:3])}
        
        Create a 6-month learning roadmap that:
        1. Starts from their current skill level
        2. Addresses identified skill gaps
        3. Builds toward the career requirements
        4. Includes specific resources and projects
        5. Is realistic and achievable
        
        Make it practical with specific course names, project ideas, and milestones.
        """
    
    def _build_skill_gap_prompt(
        self,
        user_skills: Dict[str, int],
        career_requirements: Dict,
        career_name: str
    ) -> str:
        """Build prompt for skill gap analysis"""
        user_skills_str = ", ".join([
            f"{k} ({v}/5)" for k, v in user_skills.items() if v >= 2
        ][:10])
        
        required_skills_str = ", ".join([
            f"{k} ({v['level']}/5)" for k, v in career_requirements.items()
        ][:10])
        
        return f"""
        Career: {career_name}
        
        User's Current Skills:
        {user_skills_str}
        
        Career Requirements:
        {required_skills_str}
        
        Provide a detailed analysis of the skill gaps. Include:
        1. What skills are missing
        2. What skills need improvement
        3. The priority of each gap
        4. Practical recommendations for bridging the gaps
        """
    
    def _parse_roadmap_response(self, response: str) -> Dict[str, Any]:
        """Parse Groq response into structured roadmap"""
        months = []
        current_month = None
        current_content = []
        
        lines = response.split('\n')
        for line in lines:
            line = line.strip()
            if 'Month' in line and ':' in line:
                if current_month:
                    months.append({
                        'month': current_month,
                        'content': '\n'.join(current_content).strip()
                    })
                current_month = line
                current_content = []
            elif current_month and line:
                current_content.append(line)
        
        if current_month:
            months.append({
                'month': current_month,
                'content': '\n'.join(current_content).strip()
            })
        
        # If no months found, create a default structure
        if not months:
            months = self._create_default_roadmap_structure(response)
        
        return {
            'roadmap': response,
            'structured': {
                'months': months
            }
        }
    
    def _create_default_roadmap_structure(self, response: str) -> List[Dict]:
        """Create a default structure if parsing fails"""
        return [
            {'month': 'Month 1: Foundation Building', 
             'content': 'Build core skills and understanding'},
            {'month': 'Month 2: Skill Development',
             'content': 'Develop key technical skills'},
            {'month': 'Month 3-4: Advanced Topics',
             'content': 'Master advanced concepts and tools'},
            {'month': 'Month 5-6: Application & Projects',
             'content': 'Apply skills to real projects'}
        ]
    
    def _get_fallback_explanation(self, career: Dict) -> str:
        """Provide fallback explanation if Groq fails"""
        return f"""
        {career.get('name', 'This career')} is a promising path for your skills and interests.
        
        Your current skills provide a solid foundation for this career. Focus on building 
        the recommended skills and gaining practical experience through projects.
        
        With dedication and continued learning, you can build a successful career in this field.
        Start by identifying the skill gaps shown above and create a learning plan to address them.
        """
    
    def _get_fallback_roadmap(self, career: Dict) -> Dict:
        """Provide fallback roadmap if Groq fails"""
        return {
            'roadmap': "Learning roadmap temporarily unavailable. Please check back later.",
            'structured': {
                'months': [
                    {
                        'month': 'Month 1-2: Fundamentals',
                        'content': 'Build foundation in required skills. Focus on core concepts and basic tools.'
                    },
                    {
                        'month': 'Month 3-4: Core Skills',
                        'content': 'Develop expertise in key areas. Build practical projects.'
                    },
                    {
                        'month': 'Month 5-6: Advanced Skills',
                        'content': 'Master advanced topics and build portfolio-ready projects.'
                    }
                ]
            }
        }