from pydantic import BaseModel
from typing import Dict, List, Optional

class Career(BaseModel):
    id: str
    name: str
    category: str
    description: str
    required_skills: Dict[str, Dict]
    recommended_skills: Dict[str, Dict]
    related_interests: List[str]
    education_requirements: List[str]
    job_roles: List[str]
