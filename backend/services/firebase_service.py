import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import logging

logger = logging.getLogger(__name__)

class FirebaseService:
    def __init__(self):
        self.db = None
        self._initialize_firebase()
    
    def _initialize_firebase(self):
        """Initialize Firebase Admin SDK"""
        try:
            # Check if already initialized
            if firebase_admin._apps:
                self.db = firestore.client()
                return
            
            # Get service account from environment
            service_account_path = os.getenv('FIREBASE_SERVICE_ACCOUNT_PATH')
            if service_account_path and os.path.exists(service_account_path):
                cred = credentials.Certificate(service_account_path)
            else:
                # Try from environment variable JSON
                service_account_json = os.getenv('FIREBASE_SERVICE_ACCOUNT_JSON')
                if service_account_json:
                    cred_dict = json.loads(service_account_json)
                    cred = credentials.Certificate(cred_dict)
                else:
                    raise ValueError("No Firebase credentials found")
            
            firebase_admin.initialize_app(cred)
            self.db = firestore.client()
            logger.info("Firebase initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Firebase: {str(e)}")
            raise
    
    # User Profile Operations
    async def get_user_profile(self, user_id: str) -> Optional[Dict]:
        """Get user profile by user ID"""
        try:
            doc_ref = self.db.collection('users').document(user_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Error getting user profile: {str(e)}")
            return None
    
    async def create_user_profile(self, user_id: str, profile_data: Dict) -> bool:
        """Create a new user profile"""
        try:
            profile_data['created_at'] = datetime.utcnow()
            profile_data['updated_at'] = datetime.utcnow()
            
            doc_ref = self.db.collection('users').document(user_id)
            doc_ref.set(profile_data)
            return True
        except Exception as e:
            logger.error(f"Error creating user profile: {str(e)}")
            return False
    
    async def update_user_profile(self, user_id: str, profile_data: Dict) -> bool:
        """Update an existing user profile"""
        try:
            profile_data['updated_at'] = datetime.utcnow()
            
            doc_ref = self.db.collection('users').document(user_id)
            doc_ref.update(profile_data)
            return True
        except Exception as e:
            logger.error(f"Error updating user profile: {str(e)}")
            return False
    
    # Recommendations Operations
    async def save_recommendations(self, user_id: str, recommendations: List[Dict]) -> bool:
        """Save career recommendations for a user"""
        try:
            data = {
                'user_id': user_id,
                'recommendations': recommendations,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            
            doc_ref = self.db.collection('recommendations').document(user_id)
            doc_ref.set(data)
            return True
        except Exception as e:
            logger.error(f"Error saving recommendations: {str(e)}")
            return False
    
    async def get_recommendations(self, user_id: str) -> Optional[List[Dict]]:
        """Get saved recommendations for a user"""
        try:
            doc_ref = self.db.collection('recommendations').document(user_id)
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                return data.get('recommendations', [])
            return None
        except Exception as e:
            logger.error(f"Error getting recommendations: {str(e)}")
            return None
    
    # Learning Progress Operations
    async def save_learning_progress(self, user_id: str, progress_data: Dict) -> bool:
        """Save learning progress for a user"""
        try:
            progress_data['user_id'] = user_id
            progress_data['updated_at'] = datetime.utcnow()
            
            doc_ref = self.db.collection('learning_progress').document(user_id)
            doc_ref.set(progress_data, merge=True)
            return True
        except Exception as e:
            logger.error(f"Error saving learning progress: {str(e)}")
            return False
    
    async def get_learning_progress(self, user_id: str) -> Optional[Dict]:
        """Get learning progress for a user"""
        try:
            doc_ref = self.db.collection('learning_progress').document(user_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Error getting learning progress: {str(e)}")
            return None
    
    async def update_skill_progress(
        self, 
        user_id: str, 
        skill_name: str, 
        progress: float,
        status: str = 'in_progress'
    ) -> bool:
        """Update progress for a specific skill"""
        try:
            doc_ref = self.db.collection('learning_progress').document(user_id)
            
            # Get current progress
            doc = doc_ref.get()
            if doc.exists:
                data = doc.to_dict()
                skill_progress = data.get('skill_progress', {})
            else:
                skill_progress = {}
            
            # Update skill progress
            skill_progress[skill_name] = {
                'progress': progress,
                'status': status,
                'updated_at': datetime.utcnow()
            }
            
            # Save updated progress
            doc_ref.set({
                'skill_progress': skill_progress,
                'updated_at': datetime.utcnow()
            }, merge=True)
            
            return True
        except Exception as e:
            logger.error(f"Error updating skill progress: {str(e)}")
            return False
    
    # Learning Path Operations
    async def save_learning_path(self, user_id: str, career_id: str, roadmap: Dict) -> bool:
        """Save a learning path for a user"""
        try:
            data = {
                'user_id': user_id,
                'career_id': career_id,
                'roadmap': roadmap,
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            
            doc_ref = self.db.collection('learning_paths').document(user_id)
            doc_ref.set(data, merge=True)
            return True
        except Exception as e:
            logger.error(f"Error saving learning path: {str(e)}")
            return False
    
    async def get_learning_path(self, user_id: str) -> Optional[Dict]:
        """Get the learning path for a user"""
        try:
            doc_ref = self.db.collection('learning_paths').document(user_id)
            doc = doc_ref.get()
            if doc.exists:
                return doc.to_dict()
            return None
        except Exception as e:
            logger.error(f"Error getting learning path: {str(e)}")
            return None
    
    # Progress Tracking
    async def update_progress_milestone(
        self, 
        user_id: str, 
        milestone_id: str, 
        status: str,
        notes: str = None
    ) -> bool:
        """Update a specific milestone's status"""
        try:
            doc_ref = self.db.collection('milestones').document(user_id)
            
            milestone_data = {
                'milestone_id': milestone_id,
                'status': status,
                'completed_at': datetime.utcnow() if status == 'completed' else None,
                'notes': notes,
                'updated_at': datetime.utcnow()
            }
            
            doc_ref.set({
                'milestones': {milestone_id: milestone_data},
                'updated_at': datetime.utcnow()
            }, merge=True)
            
            return True
        except Exception as e:
            logger.error(f"Error updating milestone: {str(e)}")
            return False
    
    async def get_progress_summary(self, user_id: str) -> Dict:
        """Get a summary of user's progress"""
        try:
            # Get learning progress
            progress = await self.get_learning_progress(user_id) or {}
            
            # Get learning path
            learning_path = await self.get_learning_path(user_id) or {}
            
            # Calculate progress statistics
            skill_progress = progress.get('skill_progress', {})
            completed_skills = sum(
                1 for skill in skill_progress.values() 
                if skill.get('status') == 'completed'
            )
            total_skills = len(skill_progress) or 1
            
            # Get milestones
            milestones_doc = self.db.collection('milestones').document(user_id).get()
            milestones = {}
            if milestones_doc.exists:
                milestones = milestones_doc.to_dict().get('milestones', {})
            
            completed_milestones = sum(
                1 for m in milestones.values() 
                if m.get('status') == 'completed'
            )
            total_milestones = len(milestones) or 1
            
            return {
                'user_id': user_id,
                'overall_progress': (completed_skills / total_skills) * 100,
                'completed_skills': completed_skills,
                'total_skills': total_skills,
                'completed_milestones': completed_milestones,
                'total_milestones': total_milestones,
                'current_learning_stage': progress.get('current_stage', 'not_started'),
                'last_updated': datetime.utcnow()
            }
        except Exception as e:
            logger.error(f"Error getting progress summary: {str(e)}")
            return {
                'user_id': user_id,
                'error': 'Unable to fetch progress summary'
            }