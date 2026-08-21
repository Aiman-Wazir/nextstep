from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Optional
from datetime import datetime
from services.firebase_service import FirebaseService

router = APIRouter()
firebase_service = FirebaseService()

class ProgressUpdate(BaseModel):
    skill: Optional[str] = None
    progress: float
    status: str = "in_progress"
    notes: Optional[str] = None

@router.get("/{user_id}")
async def get_progress(user_id: str):
    """Get user's learning progress"""
    try:
        progress = await firebase_service.get_learning_progress(user_id)
        if not progress:
            return {"user_id": user_id, "progress": 0, "message": "No progress found"}
        return progress
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{user_id}")
async def update_progress(user_id: str, update: ProgressUpdate):
    """Update learning progress"""
    try:
        if update.skill:
            success = await firebase_service.update_skill_progress(
                user_id, update.skill, update.progress, update.status
            )
        else:
            success = await firebase_service.save_learning_progress(
                user_id, {"progress": update.progress, "status": update.status}
            )
        
        if success:
            return {"message": "Progress updated successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to update progress")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}/summary")
async def get_progress_summary(user_id: str):
    """Get progress summary"""
    try:
        summary = await firebase_service.get_progress_summary(user_id)
        return summary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))