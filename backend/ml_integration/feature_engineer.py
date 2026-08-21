import numpy as np
import json
from typing import Dict, List

class FeatureEngineer:
    def __init__(self):
        # Load skill mappings
        with open('data/skill_mappings.json', 'r') as f:
            self.skill_mappings = json.load(f)
        
        self.all_skills = list(self.skill_mappings.get('skills', {}).keys())
        self.all_interests = [
            'Artificial Intelligence', 'Machine Learning', 'Data Science',
            'Web Development', 'Mobile Development', 'Cloud Computing',
            'Cybersecurity', 'Data Analytics', 'UI/UX', 'Software Engineering'
        ]
    
    def create_feature_vector(self, skills: Dict[str, int], interests: List[str], 
                             education: str, experience_level: int) -> np.ndarray:
        """Create feature vector for ML model"""
        features = []
        
        # Skill features (proficiency levels)
        for skill in self.all_skills:
            features.append(skills.get(skill, 0))
        
        # Interest features (binary)
        for interest in self.all_interests:
            features.append(1 if interest in interests else 0)
        
        # Education features (one-hot encoding)
        education_options = ['Computer Science', 'Data Science', 'AI/ML', 
                           'Software Engineering', 'Information Technology', 
                           'Mathematics', 'Statistics', 'Other']
        for edu in education_options:
            features.append(1 if education == edu else 0)
        
        # Experience level
        features.append(experience_level)
        
        return np.array(features)