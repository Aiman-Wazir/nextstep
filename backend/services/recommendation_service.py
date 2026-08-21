import json
import numpy as np
from typing import Dict, List, Any
import logging
from ml_integration.recommender import CareerRecommender
from ml_integration.feature_engineer import FeatureEngineer

logger = logging.getLogger(__name__)

class RecommendationService:
    def __init__(self):
        self.recommender = CareerRecommender()
        self.feature_engineer = FeatureEngineer()
        
        # Load career data
        with open('data/career_dataset.json', 'r') as f:
            self.career_data = json.load(f)
        self.careers = {c['id']: c for c in self.career_data['careers']}
        
    async def get_recommendations(
        self,
        skills: Dict[str, int],
        interests: List[str],
        education: str,
        experience_level: int,
        career_preferences: Dict = None
    ) -> List[Dict]:
        """
        Generate career recommendations
        """
        # Engineer features for ML model
        features = self.feature_engineer.create_feature_vector(
            skills=skills,
            interests=interests,
            education=education,
            experience_level=experience_level
        )
        
        # Get ML predictions
        predictions = self.recommender.predict(features.reshape(1, -1))
        
        # Get top-5 careers
        career_scores = []
        for i, career_id in enumerate(self.recommender.career_ids):
            score = float(predictions[0][i])
            career_scores.append({
                'career_id': career_id,
                'match_score': score * 100,
                'career': self.careers.get(career_id, {})
            })
        
        # Sort by match score
        career_scores.sort(key=lambda x: x['match_score'], reverse=True)
        
        # Filter and format top recommendations
        top_recommendations = []
        for item in career_scores[:5]:
            career = item['career']
            top_recommendations.append({
                'career_id': item['career_id'],
                'career_name': career.get('name', item['career_id']),
                'match_score': round(item['match_score'], 2),
                'description': career.get('description', ''),
                'category': career.get('category', ''),
                'required_skills': career.get('required_skills', {}),
                'recommended_skills': career.get('recommended_skills', {}),
                'job_roles': career.get('job_roles', [])
            })
        
        return top_recommendations