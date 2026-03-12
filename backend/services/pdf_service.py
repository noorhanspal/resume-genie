from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, ListFlowable, ListItem
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from io import BytesIO
from models.resume import ResumeData


ACCENT_COLOR = colors.HexColor("#2563EB")
DARK_COLOR = colors.HexColor("#1e293b")
GRAY_COLOR = colors.HexColor("#64748b")


def generate_pdf(resume_data: ResumeData, enhanced_data: dict) -> bytes:
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
    )

    styles = getSampleStyleSheet()

    name_style = ParagraphStyle(
        "Name", fontSize=22, fontName="Helvetica-Bold",
        textColor=DARK_COLOR, alignment=TA_CENTER, spaceAfter=4
    )
    contact_style = ParagraphStyle(
        "Contact", fontSize=9, fontName="Helvetica",
        textColor=GRAY_COLOR, alignment=TA_CENTER, spaceAfter=2
    )
    section_title_style = ParagraphStyle(
        "SectionTitle", fontSize=11, fontName="Helvetica-Bold",
        textColor=ACCENT_COLOR, spaceBefore=10, spaceAfter=4
    )
    job_title_style = ParagraphStyle(
        "JobTitle", fontSize=10, fontName="Helvetica-Bold",
        textColor=DARK_COLOR, spaceAfter=1
    )
    company_style = ParagraphStyle(
        "Company", fontSize=9, fontName="Helvetica",
        textColor=GRAY_COLOR, spaceAfter=3
    )
    body_style = ParagraphStyle(
        "Body", fontSize=9, fontName="Helvetica",
        textColor=DARK_COLOR, spaceAfter=2, leading=13
    )
    bullet_style = ParagraphStyle(
        "Bullet", fontSize=9, fontName="Helvetica",
        textColor=DARK_COLOR, leftIndent=12, spaceAfter=1, leading=13
    )

    story = []
    info = resume_data.personal_info

    story.append(Paragraph(info.full_name, name_style))

    contact_parts = [info.email, info.phone, info.location]
    if info.linkedin:
        contact_parts.append(info.linkedin)
    if info.website:
        contact_parts.append(info.website)
    story.append(Paragraph(" · ".join(contact_parts), contact_style))

    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=ACCENT_COLOR))

    # Summary
    summary = enhanced_data.get("professional_summary", "")
    if summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e2e8f0")))
        story.append(Spacer(1, 4))
        story.append(Paragraph(summary, body_style))

    # Work Experience
    enhanced_exp = enhanced_data.get("enhanced_experience", [])
    if enhanced_exp:
        story.append(Paragraph("WORK EXPERIENCE", section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e2e8f0")))
        story.append(Spacer(1, 4))

        for exp in enhanced_exp:
            story.append(Paragraph(exp.get("role", ""), job_title_style))
            story.append(Paragraph(
                f"{exp.get('company', '')}  |  {exp.get('start_date', '')} – {exp.get('end_date', '')}",
                company_style
            ))
            for bullet in exp.get("bullets", []):
                story.append(Paragraph(f"• {bullet}", bullet_style))
            story.append(Spacer(1, 6))

    # Education
    if resume_data.education:
        story.append(Paragraph("EDUCATION", section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e2e8f0")))
        story.append(Spacer(1, 4))

        for edu in resume_data.education:
            story.append(Paragraph(f"{edu.degree} in {edu.field}", job_title_style))
            gpa_text = f"  |  GPA: {edu.gpa}" if edu.gpa else ""
            story.append(Paragraph(
                f"{edu.institution}  |  {edu.graduation_year}{gpa_text}",
                company_style
            ))
            story.append(Spacer(1, 4))

    # Skills
    if resume_data.skills:
        story.append(Paragraph("SKILLS", section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e2e8f0")))
        story.append(Spacer(1, 4))
        story.append(Paragraph(", ".join(resume_data.skills), body_style))

    # Projects
    enhanced_projects = enhanced_data.get("enhanced_projects", [])
    if enhanced_projects:
        story.append(Paragraph("PROJECTS", section_title_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#e2e8f0")))
        story.append(Spacer(1, 4))

        for proj in enhanced_projects:
            story.append(Paragraph(proj.get("name", ""), job_title_style))
            story.append(Paragraph(
                f"Tech: {proj.get('technologies', '')}",
                company_style
            ))
            story.append(Paragraph(proj.get("description", ""), bullet_style))
            story.append(Spacer(1, 4))

    doc.build(story)
    return buffer.getvalue()
