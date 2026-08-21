import numpy as np
import json
import os
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class CareerRecommender:
    def __init__(self, model_path: str = None):
        self.model = None
        self.career_ids = []
        self.scaler = None
        self.label_encoder = None
        
        # Load career data
        try:
            with open('data/career_dataset.json', 'r') as f:
                career_data = json.load(f)
            self.career_ids = [c['id'] for c in career_data['careers']]
        except Exception as e:
            logger.error(f"Error loading career data: {e}")
            self.career_ids = []
    
    def predict(self, features: np.ndarray) -> np.ndarray:
        '''Make predictions on features'''
        try:
            # Simple rule-based scoring if no model is available
            if self.model is None:
                return self._rule_based_predict(features)
            
            # If model is loaded, use it
            return self.model.predict(features)
        except Exception as e:
            logger.error(f"Prediction error: {e}")
            return self._rule_based_predict(features)
    
    def _rule_based_predict(self, features: np.ndarray) -> np.ndarray:
        '''Fallback rule-based predictions'''
        # Create mock predictions based on skill levels
        predictions = []
        
        for feature in features:
            # Calculate average skill score
            skill_scores = feature[:len(self.career_ids)]
            avg_skill = np.mean(skill_scores) if len(skill_scores) > 0 else 2
            
            # Generate probabilities for each career
            probs = []
            for i, career_id in enumerate(self.career_ids):
                # Base probability
                base_prob = 0.3
                
                # Add randomness for variety
                import random
                noise = random.uniform(0.5, 1.5)
                
                # Calculate probability
                prob = min(0.95, base_prob * noise * (avg_skill / 3))
                probs.append(prob)
            
            # Normalize to sum to 1
            probs = np.array(probs)
            probs = probs / probs.sum()
            predictions.append(probs)
        
        return np.array(predictions)
    
    def load_model(self, model_path: str):
        '''Load a trained model'''
        try:
            import tensorflow as tf
            self.model = tf.keras.models.load_model(model_path)
            logger.info(f"Model loaded from {model_path}")
            return True
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            return False

    def get_top_careers(self, predictions: np.ndarray, n: int = 5) -> List[Dict]:
        '''Get top N career recommendations'''
        results = []
        
        for pred in predictions:
            # Get top indices
            top_indices = np.argsort(pred)[-n:][::-1]
            
            careers = []
            for idx in top_indices:
                if idx < len(self.career_ids):
                    careers.append({
                        'career_id': self.career_ids[idx],
                        'score': float(pred[idx])
                    })
            
            results.append(careers)
        
        return results
