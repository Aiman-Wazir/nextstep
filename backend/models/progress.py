from pydantic import BaseModel
from typing import Optional

class ProgressUpdate(BaseModel):
    skill: Optional[str] = None
    progress: float
    status: str = "in_progress"
    notes: Optional[str] = None
