from pydantic import BaseModel, Field
from typing import Dict, List, Optional
from enum import Enum

class ExperienceLevel(int, Enum):
    ENTRY = 0
    JUNIOR = 1
    INTERMEDIATE = 2
    SENIOR = 3

class RemotePreference(str, Enum):
    REMOTE = "remote"
    HYBRID = "hybrid"
    ONSITE = "onsite"

class JobType(str, Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"

class CareerPreferences(BaseModel):
    remote_preference: RemotePreference = RemotePreference.HYBRID
    job_type: JobType = JobType.FULL_TIME
    preferred_area: Optional[str] = None

class UserProfile(BaseModel):
    user_id: str
    name: str
    education: str
    experience_level: ExperienceLevel
    skills: Dict[str, int]  # skill_name -> proficiency (1-5)
    interests: List[str]
    career_preferences: Optional[CareerPreferences] = None