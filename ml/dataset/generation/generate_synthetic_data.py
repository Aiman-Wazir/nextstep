import pandas as pd
import numpy as np
import json
import random
from datetime import datetime
from typing import Dict, List, Tuple
import os

class SyntheticDataGenerator:
    def __init__(self, career_data_path: str):
        """Initialize with career dataset"""
        with open(career_data_path, 'r') as f:
            self.career_data = json.load(f)
        
        self.careers = self.career_data['careers']
        self.skill_names = self._extract_all_skills()
        self.interest_names = self._extract_all_interests()
        
    def _extract_all_skills(self) -> List[str]:
        """Extract all unique skills from career dataset"""
        skills = set()
        for career in self.careers:
            skills.update(career['required_skills'].keys())
            skills.update(career['recommended_skills'].keys())
        return list(skills)
    
    def _extract_all_interests(self) -> List[str]:
        """Extract all unique interests"""
        interests = set()
        for career in self.careers:
            interests.update(career['related_interests'])
        return list(interests)
    
    def _generate_user_profile(self, target_career: str = None) -> Dict:
        """Generate a random user profile"""
        # If target career specified, generate skills accordingly
        if target_career:
            career = next(c for c in self.careers if c['id'] == target_career)
            skills = self._generate_career_aligned_skills(career)
            interests = self._generate_career_aligned_interests(career)
        else:
            # Random profile
            skills = self._generate_random_skills()
            interests = self._generate_random_interests()
        
        return {
            'skills': skills,
            'interests': interests,
            'education': self._generate_education(),
            'experience_level': random.randint(0, 3),  # 0: Entry, 1: Junior, 2: Intermediate, 3: Senior
            'prefers_remote': random.choice([0, 1]),
            'career_labels': []  # Will be filled later
        }
    
    def _generate_career_aligned_skills(self, career: Dict) -> Dict:
        """Generate skills for a specific career with realistic variations"""
        skills = {}
        
        # Required skills - high proficiency
        for skill, req in career['required_skills'].items():
            required_level = req['level']
            # Add some variation (±1)
            level = min(5, max(1, required_level + random.randint(-1, 1)))
            skills[skill] = level
        
        # Recommended skills - medium to high proficiency
        for skill, req in career['recommended_skills'].items():
            if skill not in skills:
                recommended_level = req['level']
                level = min(5, max(1, recommended_level + random.randint(-1, 1)))
                skills[skill] = level
        
        # Add some random skills from other careers (noise)
        other_skills = [s for s in self.skill_names if s not in skills]
        num_extra = random.randint(0, 3)
        for skill in random.sample(other_skills, min(num_extra, len(other_skills))):
            skills[skill] = random.randint(1, 3)
        
        return skills
    
    def _generate_random_skills(self) -> Dict:
        """Generate completely random skills"""
        skills = {}
        num_skills = random.randint(5, 15)
        selected_skills = random.sample(self.skill_names, min(num_skills, len(self.skill_names)))
        
        for skill in selected_skills:
            skills[skill] = random.randint(1, 5)
        
        return skills
    
    def _generate_career_aligned_interests(self, career: Dict) -> List[str]:
        """Generate interests aligned with a career"""
        career_interests = career['related_interests']
        # Keep all career interests
        interests = career_interests.copy()
        
        # Add some random interests
        other_interests = [i for i in self.interest_names if i not in interests]
        if other_interests and random.random() < 0.3:
            interests.append(random.choice(other_interests))
        
        return interests
    
    def _generate_random_interests(self) -> List[str]:
        """Generate random interests"""
        num_interests = random.randint(2, 5)
        return random.sample(self.interest_names, min(num_interests, len(self.interest_names)))
    
    def _generate_education(self) -> str:
        """Generate random education level/field"""
        education_fields = [
            "Computer Science",
            "Data Science",
            "AI/ML",
            "Software Engineering",
            "Information Technology",
            "Mathematics",
            "Statistics",
            "Physics",
            "Economics",
            "Business",
            "Other"
        ]
        return random.choice(education_fields)
    
    def _assign_career_label(self, profile: Dict) -> str:
        """Assign the most suitable career based on profile"""
        career_scores = {}
        
        for career in self.careers:
            score = 0
            
            # Score based on required skills
            for skill, req in career['required_skills'].items():
                if skill in profile['skills']:
                    user_level = profile['skills'][skill]
                    required_level = req['level']
                    # Higher weight for required skills
                    score += user_level * 2 if user_level >= required_level else user_level / 2
                else:
                    score -= 1
            
            # Score based on interests
            for interest in career['related_interests']:
                if interest in profile['interests']:
                    score += 2
            
            # Score based on education
            if profile['education'] in career['education_requirements']:
                score += 3
            
            career_scores[career['id']] = score
        
        # Add some randomness (10% chance of second-best)
        sorted_careers = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)
        if random.random() < 0.1 and len(sorted_careers) > 1:
            return sorted_careers[1][0]
        
        return sorted_careers[0][0]
    
    def generate_dataset(self, num_samples: int = 5000) -> pd.DataFrame:
        """Generate complete synthetic dataset"""
        data = []
        
        for i in range(num_samples):
            # 80% aligned with a career, 20% completely random
            if random.random() < 0.8:
                career = random.choice(self.careers)
                profile = self._generate_user_profile(career['id'])
            else:
                profile = self._generate_user_profile()
            
            # Assign career label
            label = self._assign_career_label(profile)
            profile['career_labels'] = [label]
            
            # Create flat feature vector
            features = {
                'user_id': f'user_{i:04d}',
                'education': profile['education'],
                'experience_level': profile['experience_level'],
                'prefers_remote': profile['prefers_remote'],
                'target_career': label
            }
            
            # Add skills
            for skill in self.skill_names:
                features[f'skill_{skill}'] = profile['skills'].get(skill, 0)
            
            # Add interests
            for interest in self.interest_names:
                features[f'interest_{interest}'] = 1 if interest in profile['interests'] else 0
            
            data.append(features)
        
        df = pd.DataFrame(data)
        return df

def main():
    """Main execution function"""
    # Initialize generator
    generator = SyntheticDataGenerator('backend/data/career_dataset.json')
    
    # Generate dataset
    print("Generating synthetic dataset...")
    df = generator.generate_dataset(5000)
    
    # Save to CSV
    os.makedirs('ml/dataset/raw', exist_ok=True)
    os.makedirs('ml/dataset/processed', exist_ok=True)
    
    df.to_csv('ml/dataset/raw/synthetic_profiles.csv', index=False)
    print(f"Dataset saved to ml/dataset/raw/synthetic_profiles.csv")
    print(f"Shape: {df.shape}")
    print(f"Columns: {len(df.columns)}")
    print(f"\nCareer distribution:")
    print(df['target_career'].value_counts())

if __name__ == "__main__":
    main()