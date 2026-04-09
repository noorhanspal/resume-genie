from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from io import BytesIO
from models.resume import ResumeData


def _build_doc(buffer) -> SimpleDocTemplate:
    return SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=1.5 * cm, leftMargin=1.5 * cm,
        topMargin=1.5 * cm, bottomMargin=1.5 * cm,
    )


# ─────────────────────────────────────────────
# CLASSIC TEMPLATE  (blue accents)
# ─────────────────────────────────────────────
def _generate_classic(resume_data: ResumeData, enhanced_data: dict) -> bytes:
    ACCENT = colors.HexColor("#2563EB")
    DARK = colors.HexColor("#1e293b")
    GRAY = colors.HexColor("#64748b")
    LIGHT = colors.HexColor("#e2e8f0")

    buffer = BytesIO()
    doc = _build_doc(buffer)

    name_s = ParagraphStyle("N", fontSize=22, fontName="Helvetica-Bold", textColor=DARK, alignment=TA_CENTER, spaceAfter=4)
    contact_s = ParagraphStyle("C", fontSize=9, fontName="Helvetica", textColor=GRAY, alignment=TA_CENTER, spaceAfter=2)
    sec_s = ParagraphStyle("S", fontSize=10, fontName="Helvetica-Bold", textColor=ACCENT, spaceBefore=10, spaceAfter=3)
    role_s = ParagraphStyle("R", fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=1)
    sub_s = ParagraphStyle("U", fontSize=9, fontName="Helvetica", textColor=GRAY, spaceAfter=3)
    body_s = ParagraphStyle("B", fontSize=9, fontName="Helvetica", textColor=DARK, spaceAfter=2, leading=13)
    bullet_s = ParagraphStyle("BL", fontSize=9, fontName="Helvetica", textColor=DARK, leftIndent=12, spaceAfter=1, leading=13)

    story = []
    info = resume_data.personal_info

    story.append(Paragraph(info.full_name, name_s))
    parts = [info.email, info.phone, info.location]
    if info.linkedin: parts.append(info.linkedin)
    if info.website: parts.append(info.website)
    story.append(Paragraph(" · ".join(parts), contact_s))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT))

    summary = enhanced_data.get("professional_summary", "")
    if summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        story.append(Paragraph(summary, body_s))

    exps = enhanced_data.get("enhanced_experience", [])
    if exps:
        story.append(Paragraph("WORK EXPERIENCE", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        for exp in exps:
            story.append(Paragraph(exp.get("role", ""), role_s))
            story.append(Paragraph(f"{exp.get('company', '')}  |  {exp.get('start_date', '')} – {exp.get('end_date', '')}", sub_s))
            for bullet in exp.get("bullets", []):
                story.append(Paragraph(f"• {bullet}", bullet_s))
            story.append(Spacer(1, 6))

    if resume_data.education:
        story.append(Paragraph("EDUCATION", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        for edu in resume_data.education:
            story.append(Paragraph(f"{edu.degree} in {edu.field}", role_s))
            gpa = f"  |  GPA: {edu.gpa}" if edu.gpa else ""
            story.append(Paragraph(f"{edu.institution}  |  {edu.graduation_year}{gpa}", sub_s))
            story.append(Spacer(1, 4))

    if resume_data.skills:
        story.append(Paragraph("SKILLS", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        story.append(Paragraph(", ".join(resume_data.skills), body_s))

    classic_projs = enhanced_data.get("enhanced_projects", [])
    if classic_projs:
        story.append(Paragraph("PROJECTS", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        for proj in classic_projs:
            story.append(Paragraph(proj.get("name", ""), role_s))
            story.append(Paragraph(f"Tech: {proj.get('technologies', '')}", sub_s))
            story.append(Paragraph(proj.get("description", ""), bullet_s))
            story.append(Spacer(1, 4))

    doc.build(story)
    return buffer.getvalue()


# ─────────────────────────────────────────────
# MODERN TEMPLATE  (dark header, emerald)
# ─────────────────────────────────────────────
def _generate_modern(resume_data: ResumeData, enhanced_data: dict) -> bytes:
    EMERALD = colors.HexColor("#065f46")
    EMERALD_LIGHT = colors.HexColor("#d1fae5")
    DARK = colors.HexColor("#111827")
    GRAY = colors.HexColor("#6b7280")
    HEADER_BG = colors.HexColor("#111827")
    WHITE = colors.white

    buffer = BytesIO()
    doc = _build_doc(buffer)

    # Header styles (white text on dark bg)
    name_s = ParagraphStyle("N", fontSize=22, fontName="Helvetica-Bold", textColor=WHITE, spaceAfter=3)
    title_s = ParagraphStyle("T", fontSize=10, fontName="Helvetica", textColor=colors.HexColor("#6ee7b7"), spaceAfter=4)
    contact_s = ParagraphStyle("C", fontSize=8, fontName="Helvetica", textColor=colors.HexColor("#d1d5db"), spaceAfter=0)

    sec_s = ParagraphStyle("S", fontSize=10, fontName="Helvetica-Bold", textColor=EMERALD, spaceBefore=10, spaceAfter=2)
    role_s = ParagraphStyle("R", fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=1)
    company_s = ParagraphStyle("CO", fontSize=9, fontName="Helvetica-Bold", textColor=EMERALD, spaceAfter=1)
    date_s = ParagraphStyle("D", fontSize=8, fontName="Helvetica", textColor=GRAY, spaceAfter=3)
    body_s = ParagraphStyle("B", fontSize=9, fontName="Helvetica", textColor=DARK, spaceAfter=2, leading=13)
    bullet_s = ParagraphStyle("BL", fontSize=9, fontName="Helvetica", textColor=DARK, leftIndent=10, spaceAfter=1, leading=13)

    story = []
    info = resume_data.personal_info

    # Dark header block using a table
    contact_line = "  |  ".join(filter(None, [info.email, info.phone, info.location, info.linkedin, info.website]))
    header_content = [
        Paragraph(info.full_name, name_s),
    ]
    if resume_data.job_title:
        header_content.append(Paragraph(resume_data.job_title.upper(), title_s))
    header_content.append(Paragraph(contact_line, contact_s))

    header_table = Table([[header_content]], colWidths=[doc.width])
    header_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), HEADER_BG),
        ("TOPPADDING", (0, 0), (-1, -1), 16),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
        ("LEFTPADDING", (0, 0), (-1, -1), 18),
        ("RIGHTPADDING", (0, 0), (-1, -1), 18),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 12))

    def section_header(title):
        story.append(Paragraph(title, sec_s))
        story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#a7f3d0")))
        story.append(Spacer(1, 4))

    summary = enhanced_data.get("professional_summary", "")
    if summary:
        section_header("PROFESSIONAL SUMMARY")
        story.append(Paragraph(summary, body_s))

    exps = enhanced_data.get("enhanced_experience", [])
    if exps:
        section_header("WORK EXPERIENCE")
        for exp in exps:
            story.append(Paragraph(exp.get("role", ""), role_s))
            story.append(Paragraph(exp.get("company", ""), company_s))
            story.append(Paragraph(f"{exp.get('start_date', '')} – {exp.get('end_date', '')}", date_s))
            for bullet in exp.get("bullets", []):
                story.append(Paragraph(f"› {bullet}", bullet_s))
            story.append(Spacer(1, 6))

    if resume_data.education:
        section_header("EDUCATION")
        for edu in resume_data.education:
            story.append(Paragraph(f"{edu.degree} in {edu.field}", role_s))
            gpa = f" · GPA: {edu.gpa}" if edu.gpa else ""
            story.append(Paragraph(f"{edu.institution}{gpa}", company_s))
            story.append(Paragraph(edu.graduation_year, date_s))
            story.append(Spacer(1, 4))

    if resume_data.skills:
        section_header("SKILLS")
        story.append(Paragraph("  ·  ".join(resume_data.skills), body_s))

    projs = enhanced_data.get("enhanced_projects", [])
    if projs:
        section_header("PROJECTS")
        for proj in projs:
            story.append(Paragraph(proj.get("name", ""), role_s))
            story.append(Paragraph(proj.get("technologies", ""), company_s))
            story.append(Paragraph(proj.get("description", ""), bullet_s))
            story.append(Spacer(1, 4))

    doc.build(story)
    return buffer.getvalue()


# ─────────────────────────────────────────────
# MINIMAL TEMPLATE  (black & white, serif)
# ─────────────────────────────────────────────
def _generate_minimal(resume_data: ResumeData, enhanced_data: dict) -> bytes:
    BLACK = colors.black
    GRAY = colors.HexColor("#555555")
    LIGHT_GRAY = colors.HexColor("#aaaaaa")

    buffer = BytesIO()
    doc = _build_doc(buffer)

    name_s = ParagraphStyle("N", fontSize=26, fontName="Times-Bold", textColor=BLACK, spaceAfter=2)
    jobtitle_s = ParagraphStyle("JT", fontSize=10, fontName="Times-Roman", textColor=GRAY, spaceAfter=4)
    contact_s = ParagraphStyle("C", fontSize=8, fontName="Helvetica", textColor=GRAY, spaceAfter=0)
    sec_s = ParagraphStyle("S", fontSize=9, fontName="Helvetica-Bold", textColor=BLACK, spaceBefore=12, spaceAfter=3, letterSpacing=2)
    role_s = ParagraphStyle("R", fontSize=10, fontName="Times-Bold", textColor=BLACK, spaceAfter=1)
    sub_s = ParagraphStyle("U", fontSize=8, fontName="Helvetica", textColor=GRAY, spaceAfter=3)
    body_s = ParagraphStyle("B", fontSize=9, fontName="Times-Roman", textColor=BLACK, spaceAfter=2, leading=14)
    bullet_s = ParagraphStyle("BL", fontSize=9, fontName="Times-Roman", textColor=BLACK, leftIndent=10, spaceAfter=1, leading=14)

    story = []
    info = resume_data.personal_info

    story.append(Paragraph(info.full_name, name_s))
    if resume_data.job_title:
        story.append(Paragraph(resume_data.job_title, jobtitle_s))
    parts = filter(None, [info.email, info.phone, info.location, info.linkedin, info.website])
    story.append(Paragraph("  |  ".join(parts), contact_s))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_GRAY, spaceAfter=2))

    def section_header(title):
        story.append(Paragraph(title.upper(), sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=BLACK))
        story.append(Spacer(1, 4))

    summary = enhanced_data.get("professional_summary", "")
    if summary:
        section_header("Summary")
        story.append(Paragraph(summary, body_s))

    exps = enhanced_data.get("enhanced_experience", [])
    if exps:
        section_header("Experience")
        for exp in exps:
            story.append(Paragraph(exp.get("role", ""), role_s))
            story.append(Paragraph(f"{exp.get('company', '')}  ·  {exp.get('start_date', '')} – {exp.get('end_date', '')}", sub_s))
            for bullet in exp.get("bullets", []):
                story.append(Paragraph(f"— {bullet}", bullet_s))
            story.append(Spacer(1, 6))

    if resume_data.education:
        section_header("Education")
        for edu in resume_data.education:
            gpa = f"  ·  {edu.gpa}" if edu.gpa else ""
            story.append(Paragraph(f"{edu.degree} in {edu.field}", role_s))
            story.append(Paragraph(f"{edu.institution}  ·  {edu.graduation_year}{gpa}", sub_s))
            story.append(Spacer(1, 4))

    if resume_data.skills:
        section_header("Skills")
        story.append(Paragraph("  ·  ".join(resume_data.skills), body_s))

    projs = enhanced_data.get("enhanced_projects", [])
    if projs:
        section_header("Projects")
        for proj in projs:
            story.append(Paragraph(proj.get("name", ""), role_s))
            story.append(Paragraph(f"({proj.get('technologies', '')})", sub_s))
            story.append(Paragraph(proj.get("description", ""), bullet_s))
            story.append(Spacer(1, 4))

    doc.build(story)
    return buffer.getvalue()


# ─────────────────────────────────────────────
# PROFESSIONAL TEMPLATE
# ─────────────────────────────────────────────
def _generate_professional(resume_data: ResumeData, enhanced_data: dict) -> bytes:
    BLACK = colors.black

    buffer = BytesIO()
    doc = _build_doc(buffer)

    name_s = ParagraphStyle("N", fontSize=20, fontName="Times-Bold", textColor=BLACK, alignment=TA_CENTER, spaceAfter=2)
    contact_s = ParagraphStyle("C", fontSize=10, fontName="Times-Roman", textColor=BLACK, alignment=TA_CENTER, spaceAfter=8)
    sec_s = ParagraphStyle("S", fontSize=11, fontName="Times-Bold", textColor=BLACK, spaceBefore=10, spaceAfter=1)
    
    body_s = ParagraphStyle("B", fontSize=10, fontName="Times-Roman", textColor=BLACK, spaceAfter=2, leading=12)
    bold_s = ParagraphStyle("BB", fontSize=10, fontName="Times-Bold", textColor=BLACK, spaceAfter=2, leading=12)
    italic_s = ParagraphStyle("BI", fontSize=10, fontName="Times-Italic", textColor=BLACK, spaceAfter=2, leading=12)
    bullet_s = ParagraphStyle("BL", fontSize=10, fontName="Times-Roman", textColor=BLACK, leftIndent=12, spaceAfter=1, leading=12)

    story = []
    info = resume_data.personal_info

    story.append(Paragraph(info.full_name.upper(), name_s))
    parts = list(filter(None, [info.location, info.phone, info.email, 
                  "LinkedIn" if info.linkedin else "", 
                  "Portfolio" if info.website else ""]))
    story.append(Paragraph("  |  ".join(parts), contact_s))

    def section_header(title):
        story.append(Paragraph(title.upper(), sec_s))
        story.append(HRFlowable(width="100%", thickness=1, color=BLACK, spaceAfter=4, spaceBefore=1))

    if resume_data.education:
        section_header("EDUCATION")
        for edu in resume_data.education:
            t_data = [
                [Paragraph(edu.institution, bold_s), Paragraph(edu.graduation_year, ParagraphStyle("R1", parent=body_s, alignment=2))],
                [Paragraph(edu.degree + " in " + edu.field, italic_s), Paragraph(f"GPA: {edu.gpa}" if edu.gpa else "", ParagraphStyle("R2", parent=italic_s, alignment=2))]
            ]
            t = Table(t_data, colWidths=[doc.width * 0.7, doc.width * 0.3])
            t.setStyle(TableStyle([
                ('PADDING', (0,0), (-1,-1), 0),
                ('BOTTOMPADDING', (0,1), (-1,1), 4)
            ]))
            story.append(t)

    exps = enhanced_data.get("enhanced_experience", [])
    if exps:
        section_header("EXPERIENCE")
        for exp in exps:
            t_data = [
                [Paragraph(exp.get("company", ""), bold_s), Paragraph("", ParagraphStyle("R3", parent=body_s, alignment=2))],
                [Paragraph(exp.get("role", ""), italic_s), Paragraph(f"{exp.get('start_date', '')} – {exp.get('end_date', '')}", ParagraphStyle("R4", parent=italic_s, alignment=2))]
            ]
            t = Table(t_data, colWidths=[doc.width * 0.7, doc.width * 0.3])
            t.setStyle(TableStyle([('PADDING', (0,0), (-1,-1), 0)]))
            story.append(t)
            
            for bullet in exp.get("bullets", []):
                story.append(Paragraph(f"• {bullet}", bullet_s))
            story.append(Spacer(1, 4))

    projs = enhanced_data.get("enhanced_projects", [])
    if projs:
        section_header("PROJECTS")
        for proj in projs:
            t_data = [
                [Paragraph(proj.get("name", ""), bold_s), Paragraph("GitHub", ParagraphStyle("R5", parent=body_s, alignment=2, textColor=colors.HexColor("#1e40af")))]
            ]
            t = Table(t_data, colWidths=[doc.width * 0.85, doc.width * 0.15])
            t.setStyle(TableStyle([('PADDING', (0,0), (-1,-1), 0)]))
            story.append(t)
            
            story.append(Paragraph(f"• {proj.get('description', '')}", bullet_s))
            if proj.get("technologies"):
                story.append(Paragraph(f"Technologies: {proj.get('technologies', '')}", ParagraphStyle("C", parent=body_s, leftIndent=12, fontSize=9, textColor=colors.HexColor("#444444"))))
            story.append(Spacer(1, 4))

    if resume_data.skills:
        section_header("TECHNICAL SKILLS AND INTERESTS")
        story.append(Paragraph(f"<b>Skills:</b> {', '.join(resume_data.skills)}", body_s))

    doc.build(story)
    return buffer.getvalue()


# ─────────────────────────────────────────────
# PUBLIC ENTRY POINT
# ─────────────────────────────────────────────
def generate_pdf(resume_data: ResumeData, enhanced_data: dict) -> bytes:
    template = (resume_data.template or "classic").lower()
    if template == "modern":
        return _generate_modern(resume_data, enhanced_data)
    if template == "minimal":
        return _generate_minimal(resume_data, enhanced_data)
    if template == "professional":
        return _generate_professional(resume_data, enhanced_data)
    return _generate_classic(resume_data, enhanced_data)
