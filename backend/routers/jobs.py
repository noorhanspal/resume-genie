from fastapi import APIRouter, HTTPException
from models.jobs import JobSearchRequest
from services.job_service import find_and_evaluate_jobs

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.post("/match")
async def match_jobs(request: JobSearchRequest):
    try:
        result = find_and_evaluate_jobs(request.role, request.skills)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
