from pydantic import BaseModel
from typing import List, Optional


class PersonalInfo(BaseModel):
    full_name: str
    email: str
    phone: str
    location: str
    linkedin: Optional[str] = ""
    website: Optional[str] = ""
    summary: Optional[str] = ""


class WorkExperience(BaseModel):
    company: str
    role: str
    start_date: str
    end_date: str
    responsibilities: str


class Education(BaseModel):
    institution: str
    degree: str
    field: str
    graduation_year: str
    gpa: Optional[str] = ""


class Project(BaseModel):
    name: str
    description: str
    technologies: str
    link: Optional[str] = ""


class ResumeData(BaseModel):
    personal_info: PersonalInfo
    work_experience: List[WorkExperience]
    education: List[Education]
    skills: List[str]
    projects: List[Project]
    job_title: Optional[str] = ""
