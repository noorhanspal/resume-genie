from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from models.resume import ResumeData
from services.llm_service import enhance_resume_with_llm
from services.pdf_service import generate_pdf

router = APIRouter(prefix="/api/resume", tags=["resume"])


@router.post("/enhance")
async def enhance_resume(data: ResumeData):
    try:
        enhanced = enhance_resume_with_llm(data)
        return {"success": True, "data": enhanced}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-pdf")
async def generate_resume_pdf(data: ResumeData):
    try:
        enhanced = enhance_resume_with_llm(data)
        pdf_bytes = generate_pdf(data, enhanced)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{data.personal_info.full_name.replace(" ", "_")}_Resume.pdf"'
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
