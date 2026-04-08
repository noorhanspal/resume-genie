from pydantic import BaseModel
from typing import List

class JobSearchRequest(BaseModel):
    role: str
    skills: List[str]
