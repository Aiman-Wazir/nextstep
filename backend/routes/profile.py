from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from services.firebase_service import FirebaseService

router = APIRouter()
firebase_service = FirebaseService()

class ProfileUpdate(BaseModel):
    name: str
    education: str
    experience_level: int
    skills: Dict[str, int]
    interests: List[str]

@router.get("/{user_id}")
async def get_profile(user_id: str):
    """Get user profile"""
    try:
        profile = await firebase_service.get_user_profile(user_id)
        if not profile:
            return {"user_id": user_id, "message": "Profile not found"}
        return profile
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}")
async def create_profile(user_id: str, profile: ProfileUpdate):
    """Create user profile"""
    try:
        profile_data = profile.dict()
        profile_data['user_id'] = user_id
        success = await firebase_service.create_user_profile(user_id, profile_data)
        if success:
            return {"message": "Profile created successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to create profile")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{user_id}")
async def update_profile(user_id: str, profile: ProfileUpdate):
    """Update user profile"""
    try:
        profile_data = profile.dict()
        success = await firebase_service.update_user_profile(user_id, profile_data)
        if success:
            return {"message": "Profile updated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to update profile")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))