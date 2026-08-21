import logging
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

class FirebaseService:
    """Firebase Service - Currently disabled"""
    
    def __init__(self):
        self.enabled = False
        logger.warning("Firebase service is disabled. Using mock data.")
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict]:
        """Mock get user profile"""
        return {"user_id": user_id, "message": "Firebase disabled - using mock data"}
    
    async def create_user_profile(self, user_id: str, profile_data: Dict) -> bool:
        """Mock create user profile"""
        logger.info(f"Mock: Creating profile for user {user_id}")
        return True
    
    async def update_user_profile(self, user_id: str, profile_data: Dict) -> bool:
        """Mock update user profile"""
        logger.info(f"Mock: Updating profile for user {user_id}")
        return True
    
    async def save_recommendations(self, user_id: str, recommendations: List[Dict]) -> bool:
        """Mock save recommendations"""
        logger.info(f"Mock: Saving recommendations for user {user_id}")
        return True
    
    async def get_recommendations(self, user_id: str) -> Optional[List[Dict]]:
        """Mock get recommendations"""
        return None
    
    async def save_learning_progress(self, user_id: str, progress_data: Dict) -> bool:
        """Mock save learning progress"""
        logger.info(f"Mock: Saving progress for user {user_id}")
        return True
    
    async def get_learning_progress(self, user_id: str) -> Optional[Dict]:
        """Mock get learning progress"""
        return {"progress": 0, "message": "Firebase disabled"}
    
    async def update_skill_progress(self, user_id: str, skill_name: str, progress: float, status: str = 'in_progress') -> bool:
        """Mock update skill progress"""
        logger.info(f"Mock: Updating skill {skill_name} for user {user_id}")
        return True
    
    async def get_progress_summary(self, user_id: str) -> Dict:
        """Mock get progress summary"""
        return {
            'user_id': user_id,
            'overall_progress': 0,
            'completed_skills': 0,
            'total_skills': 0,
            'message': 'Firebase disabled - using mock data'
        }