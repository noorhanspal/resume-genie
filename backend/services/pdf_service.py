from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from io import BytesIO
from models.resume import ResumeData
from html import escape


def safe(text) -> str:
    """Escape special XML/HTML characters so ReportLab Paragraph doesn't break."""
    if text is None:
        return ""
    return escape(str(text).strip())


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

    # Classic web preview: centered name (no job title), contact info, then blue 2px bottom border
    name_s    = ParagraphStyle("N",  fontSize=22, fontName="Helvetica-Bold", textColor=DARK, alignment=TA_CENTER, spaceAfter=6, leading=28)
    contact_s = ParagraphStyle("C",  fontSize=9,  fontName="Helvetica",      textColor=GRAY, alignment=TA_CENTER, spaceAfter=6)
    sec_s     = ParagraphStyle("S",  fontSize=10, fontName="Helvetica-Bold", textColor=ACCENT, spaceBefore=10, spaceAfter=3)
    role_s    = ParagraphStyle("R",  fontSize=10, fontName="Helvetica-Bold", textColor=DARK, spaceAfter=1)
    sub_s     = ParagraphStyle("U",  fontSize=9,  fontName="Helvetica",      textColor=GRAY, spaceAfter=3)
    body_s    = ParagraphStyle("B",  fontSize=9,  fontName="Helvetica",      textColor=DARK, spaceAfter=2, leading=13)
    bullet_s  = ParagraphStyle("BL", fontSize=9,  fontName="Helvetica",      textColor=DARK, leftIndent=12, spaceAfter=1, leading=13)

    story = []
    info = resume_data.personal_info

    # Header: Name → Contact → thick blue HR (matches web border-b-2 border-blue-600)
    story.append(Paragraph(safe(info.full_name), name_s))
    parts = [safe(info.email), safe(info.phone), safe(info.location)]
    if info.linkedin: parts.append(safe(info.linkedin))
    if info.website:  parts.append(safe(info.website))
    story.append(Paragraph(" · ".join(parts), contact_s))
    story.append(HRFlowable(width="100%", thickness=2, color=ACCENT, spaceAfter=4))

    summary = enhanced_data.get("professional_summary", "")
    if summary:
        story.append(Paragraph("PROFESSIONAL SUMMARY", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        story.append(Paragraph(safe(summary), body_s))

    exps = enhanced_data.get("enhanced_experience", [])
    if exps:
        story.append(Paragraph("WORK EXPERIENCE", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        for exp in exps:
            story.append(Paragraph(safe(exp.get("role", "")), role_s))
            story.append(Paragraph(
                f"{safe(exp.get('company', ''))}  |  {safe(exp.get('start_date', ''))} \u2013 {safe(exp.get('end_date', ''))}",
                sub_s
            ))
            for bullet in exp.get("bullets", []):
                story.append(Paragraph(f"\u2022 {safe(bullet)}", bullet_s))
            story.append(Spacer(1, 6))

    if resume_data.education:
        story.append(Paragraph("EDUCATION", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        for edu in resume_data.education:
            story.append(Paragraph(f"{safe(edu.degree)} in {safe(edu.field)}", role_s))
            gpa = f"  |  GPA: {safe(edu.gpa)}" if edu.gpa else ""
            story.append(Paragraph(f"{safe(edu.institution)}  |  {safe(edu.graduation_year)}{gpa}", sub_s))
            story.append(Spacer(1, 4))

    if resume_data.skills:
        story.append(Paragraph("SKILLS", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        story.append(Paragraph(", ".join(safe(s) for s in resume_data.skills), body_s))

    classic_projs = enhanced_data.get("enhanced_projects", [])
    if classic_projs:
        story.append(Paragraph("PROJECTS", sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT))
        story.append(Spacer(1, 4))
        for proj in classic_projs:
            story.append(Paragraph(safe(proj.get("name", "")), role_s))
            story.append(Paragraph(f"Tech: {safe(proj.get('technologies', ''))}", sub_s))
            story.append(Paragraph(safe(proj.get("description", "")), bullet_s))
            story.append(Spacer(1, 4))

    doc.build(story)
    return buffer.getvalue()


# ─────────────────────────────────────────────
# MODERN TEMPLATE  (dark header, emerald)
# ─────────────────────────────────────────────
def _generate_modern(resume_data: ResumeData, enhanced_data: dict) -> bytes:
    EMERALD      = colors.HexColor("#065f46")
    DARK         = colors.HexColor("#111827")
    GRAY         = colors.HexColor("#6b7280")
    HEADER_BG    = colors.HexColor("#111827")
    WHITE        = colors.white

    buffer = BytesIO()
    doc = _build_doc(buffer)

    # Header base style — single Paragraph with inline font tags avoids overlap in table cells
    header_base_s = ParagraphStyle(
        "HB", fontName="Helvetica", fontSize=9, textColor=WHITE, leading=14, spaceAfter=0
    )

    sec_s     = ParagraphStyle("S",  fontSize=10, fontName="Helvetica-Bold", textColor=EMERALD, spaceBefore=10, spaceAfter=2)
    role_s    = ParagraphStyle("R",  fontSize=10, fontName="Helvetica-Bold", textColor=DARK,   spaceAfter=1)
    company_s = ParagraphStyle("CO", fontSize=9,  fontName="Helvetica-Bold", textColor=EMERALD, spaceAfter=1)
    date_s    = ParagraphStyle("D",  fontSize=8,  fontName="Helvetica",      textColor=GRAY,   spaceAfter=3)
    body_s    = ParagraphStyle("B",  fontSize=9,  fontName="Helvetica",      textColor=DARK,   spaceAfter=2, leading=13)
    bullet_s  = ParagraphStyle("BL", fontSize=9,  fontName="Helvetica",      textColor=DARK,   leftIndent=10, spaceAfter=1, leading=13)

    story = []
    info = resume_data.personal_info

    # Build header as a single richtext Paragraph — avoids line overlap inside Table cell
    contact_parts = list(filter(None, [
        safe(info.email), safe(info.phone), safe(info.location),
        safe(info.linkedin), safe(info.website)
    ]))
    contact_line = "   ".join(contact_parts)

    name_html    = f'<font name="Helvetica-Bold" size="22" color="white">{safe(info.full_name)}</font>'
    contact_html = f'<font name="Helvetica" size="8" color="#d1d5db">{contact_line}</font>'

    if resume_data.job_title:
        title_html = f'<font name="Helvetica" size="10" color="#6ee7b7">{safe(resume_data.job_title).upper()}</font>'
        header_html = f"{name_html}<br/>{title_html}<br/><br/>{contact_html}"
    else:
        header_html = f"{name_html}<br/><br/>{contact_html}"

    header_table = Table(
        [[Paragraph(header_html, header_base_s)]],
        colWidths=[doc.width]
    )
    header_table.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, -1), HEADER_BG),
        ("TOPPADDING",    (0, 0), (-1, -1), 16),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 16),
        ("LEFTPADDING",   (0, 0), (-1, -1), 18),
        ("RIGHTPADDING",  (0, 0), (-1, -1), 18),
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
        story.append(Paragraph(safe(summary), body_s))

    exps = enhanced_data.get("enhanced_experience", [])
    if exps:
        section_header("WORK EXPERIENCE")
        # Web layout: [role (left) | date (right)], then company below, then bullets
        date_right_s = ParagraphStyle("DR", fontSize=8, fontName="Helvetica", textColor=GRAY,
                                      alignment=2, spaceAfter=0)
        for exp in exps:
            left_col = [
                Paragraph(safe(exp.get("role", "")), role_s),
                Paragraph(safe(exp.get("company", "")), company_s),
            ]
            right_col = [
                Paragraph(
                    f"{safe(exp.get('start_date', ''))} \u2013 {safe(exp.get('end_date', ''))}",
                    date_right_s
                )
            ]
            exp_table = Table([[left_col, right_col]], colWidths=[doc.width * 0.72, doc.width * 0.28])
            exp_table.setStyle(TableStyle([
                ('PADDING',  (0, 0), (-1, -1), 0),
                ('VALIGN',   (0, 0), (-1, -1), 'TOP'),
                ('ALIGN',    (1, 0), (1, -1),  'RIGHT'),
            ]))
            story.append(exp_table)
            for bullet in exp.get("bullets", []):
                story.append(Paragraph(f"\u203a {safe(bullet)}", bullet_s))
            story.append(Spacer(1, 6))

    if resume_data.education:
        section_header("EDUCATION")
        # Web: [degree in field (bold, left) | year (right)], institution+GPA below
        edu_right_s = ParagraphStyle("ER", fontSize=9, fontName="Helvetica", textColor=GRAY,
                                     alignment=2, spaceAfter=0)
        for edu in resume_data.education:
            gpa = f" \u00b7 GPA: {safe(edu.gpa)}" if edu.gpa else ""
            left_col = [
                Paragraph(f"{safe(edu.degree)} in {safe(edu.field)}", role_s),
                Paragraph(f"{safe(edu.institution)}{gpa}", company_s),
            ]
            right_col = [Paragraph(safe(edu.graduation_year), edu_right_s)]
            edu_table = Table([[left_col, right_col]], colWidths=[doc.width * 0.72, doc.width * 0.28])
            edu_table.setStyle(TableStyle([
                ('PADDING', (0, 0), (-1, -1), 0),
                ('VALIGN',  (0, 0), (-1, -1), 'TOP'),
                ('ALIGN',   (1, 0), (1, -1),  'RIGHT'),
            ]))
            story.append(edu_table)
            story.append(Spacer(1, 4))

    if resume_data.skills:
        section_header("SKILLS")
        story.append(Paragraph("  \u00b7  ".join(safe(s) for s in resume_data.skills), body_s))

    projs = enhanced_data.get("enhanced_projects", [])
    if projs:
        section_header("PROJECTS")
        for proj in projs:
            proj_name_s = ParagraphStyle("PN", fontSize=10, fontName="Helvetica-Bold",
                                         textColor=DARK, spaceAfter=0)
            tech_s = ParagraphStyle("PT", fontSize=8, fontName="Helvetica",
                                    textColor=EMERALD, spaceAfter=1)
            story.append(Paragraph(safe(proj.get("name", "")), proj_name_s))
            if proj.get("technologies"):
                story.append(Paragraph(safe(proj.get("technologies", "")), tech_s))
            story.append(Paragraph(safe(proj.get("description", "")), bullet_s))
            story.append(Spacer(1, 4))

    doc.build(story)
    return buffer.getvalue()


# ─────────────────────────────────────────────
# MINIMAL TEMPLATE  (black & white, serif)
# ─────────────────────────────────────────────
def _generate_minimal(resume_data: ResumeData, enhanced_data: dict) -> bytes:
    BLACK      = colors.black
    GRAY       = colors.HexColor("#555555")
    LIGHT_GRAY = colors.HexColor("#aaaaaa")

    buffer = BytesIO()
    doc = _build_doc(buffer)

    # Minimal web preview: large left-aligned name, optional job title, then thin gray border-t ABOVE contact
    name_s    = ParagraphStyle("N",  fontSize=26, fontName="Times-Bold",   textColor=BLACK, spaceAfter=4, leading=32)
    jobtitle_s= ParagraphStyle("JT", fontSize=10, fontName="Times-Roman",  textColor=GRAY,  spaceAfter=6)
    contact_s = ParagraphStyle("C",  fontSize=8,  fontName="Helvetica",    textColor=GRAY,  spaceAfter=4, spaceBefore=4)
    sec_s     = ParagraphStyle("S",  fontSize=9,  fontName="Helvetica-Bold", textColor=BLACK, spaceBefore=12, spaceAfter=3, letterSpacing=2)
    role_s    = ParagraphStyle("R",  fontSize=10, fontName="Times-Bold",   textColor=BLACK, spaceAfter=1)
    sub_s     = ParagraphStyle("U",  fontSize=8,  fontName="Helvetica",    textColor=GRAY,  spaceAfter=3)
    body_s    = ParagraphStyle("B",  fontSize=9,  fontName="Times-Roman",  textColor=BLACK, spaceAfter=2, leading=14)
    bullet_s  = ParagraphStyle("BL", fontSize=9,  fontName="Times-Roman",  textColor=BLACK, leftIndent=10, spaceAfter=1, leading=14)

    story = []
    info = resume_data.personal_info

    # Header: Name → [optional job title] → thin gray HR → Contact (matches web border-t above contact div)
    story.append(Paragraph(safe(info.full_name), name_s))
    if resume_data.job_title:
        story.append(Paragraph(safe(resume_data.job_title), jobtitle_s))
    story.append(HRFlowable(width="100%", thickness=0.5, color=LIGHT_GRAY, spaceAfter=4))
    parts = [p for p in [safe(info.email), safe(info.phone), safe(info.location),
                          safe(info.linkedin), safe(info.website)] if p]
    story.append(Paragraph("  |  ".join(parts), contact_s))

    def section_header(title):
        story.append(Paragraph(title.upper(), sec_s))
        story.append(HRFlowable(width="100%", thickness=0.5, color=BLACK))
        story.append(Spacer(1, 4))

    summary = enhanced_data.get("professional_summary", "")
    if summary:
        section_header("Summary")
        story.append(Paragraph(safe(summary), body_s))

    exps = enhanced_data.get("enhanced_experience", [])
    if exps:
        section_header("Experience")
        for exp in exps:
            story.append(Paragraph(safe(exp.get("role", "")), role_s))
            story.append(Paragraph(
                f"{safe(exp.get('company', ''))}  \u00b7  {safe(exp.get('start_date', ''))} \u2013 {safe(exp.get('end_date', ''))}",
                sub_s
            ))
            for bullet in exp.get("bullets", []):
                story.append(Paragraph(f"\u2014 {safe(bullet)}", bullet_s))
            story.append(Spacer(1, 6))

    if resume_data.education:
        section_header("Education")
        for edu in resume_data.education:
            gpa = f"  \u00b7  {safe(edu.gpa)}" if edu.gpa else ""
            story.append(Paragraph(f"{safe(edu.degree)} in {safe(edu.field)}", role_s))
            story.append(Paragraph(f"{safe(edu.institution)}  \u00b7  {safe(edu.graduation_year)}{gpa}", sub_s))
            story.append(Spacer(1, 4))

    if resume_data.skills:
        section_header("Skills")
        story.append(Paragraph("  \u00b7  ".join(safe(s) for s in resume_data.skills), body_s))

    projs = enhanced_data.get("enhanced_projects", [])
    if projs:
        section_header("Projects")
        for proj in projs:
            story.append(Paragraph(safe(proj.get("name", "")), role_s))
            story.append(Paragraph(f"({safe(proj.get('technologies', ''))})", sub_s))
            story.append(Paragraph(safe(proj.get("description", "")), bullet_s))
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

    # Professional web preview: Times New Roman, centered header, NO job title, NO summary
    # Section order: Education → Experience → Projects → Technical Skills
    name_s    = ParagraphStyle("N",  fontSize=20, fontName="Times-Bold",   textColor=BLACK, alignment=TA_CENTER, spaceAfter=2, leading=26)
    contact_s = ParagraphStyle("C",  fontSize=9,  fontName="Times-Roman",  textColor=colors.HexColor("#444444"), alignment=TA_CENTER, spaceAfter=4)
    sec_s     = ParagraphStyle("S",  fontSize=10, fontName="Times-Bold",   textColor=BLACK, spaceBefore=8, spaceAfter=1)
    body_s    = ParagraphStyle("B",  fontSize=10, fontName="Times-Roman",  textColor=BLACK, spaceAfter=2, leading=13)
    bold_s    = ParagraphStyle("BB", fontSize=10, fontName="Times-Bold",   textColor=BLACK, spaceAfter=1, leading=13)
    italic_s  = ParagraphStyle("BI", fontSize=10, fontName="Times-Italic", textColor=BLACK, spaceAfter=1, leading=13)
    bullet_s  = ParagraphStyle("BL", fontSize=9,  fontName="Times-Roman",  textColor=BLACK, leftIndent=14, spaceAfter=2, leading=13)

    story = []
    info = resume_data.personal_info

    # Header: NAME UPPERCASE centered, contact info centered (location | phone | email)
    story.append(Paragraph(safe(info.full_name).upper(), name_s))
    parts = [p for p in [
        safe(info.location), safe(info.phone), safe(info.email),
        "LinkedIn" if info.linkedin else "",
        "Portfolio" if info.website else ""
    ] if p]
    story.append(Paragraph("  |  ".join(parts), contact_s))

    def section_header(title):
        story.append(Paragraph(title.upper(), sec_s))
        story.append(HRFlowable(width="100%", thickness=1.5, color=BLACK, spaceAfter=3, spaceBefore=1))

    # NO professional summary (Professional web template doesn't have it)

    if resume_data.education:
        section_header("Education")
        for edu in resume_data.education:
            right_body   = ParagraphStyle("R1", parent=body_s,   alignment=2, spaceAfter=0)
            right_italic = ParagraphStyle("R2", parent=italic_s, alignment=2, spaceAfter=0)
            gpa_text = f"{safe(edu.gpa)} SGPA" if edu.gpa else ""
            t_data = [
                [Paragraph(safe(edu.institution), bold_s),
                 Paragraph(safe(edu.graduation_year), right_body)],
                [Paragraph(f"{safe(edu.degree)} in {safe(edu.field)}", italic_s),
                 Paragraph(gpa_text, right_italic)]
            ]
            t = Table(t_data, colWidths=[doc.width * 0.7, doc.width * 0.3])
            t.setStyle(TableStyle([
                ('PADDING',       (0, 0), (-1, -1), 0),
                ('BOTTOMPADDING', (0, 1), (-1, 1),  4)
            ]))
            story.append(t)

    exps = enhanced_data.get("enhanced_experience", [])
    if exps:
        section_header("Experience")
        for exp in exps:
            right_italic = ParagraphStyle("R4", parent=italic_s, alignment=2, spaceAfter=0)
            t_data = [
                [Paragraph(safe(exp.get("company", "")), bold_s),
                 Paragraph("", ParagraphStyle("R3", parent=body_s, alignment=2))],
                [Paragraph(safe(exp.get("role", "")), italic_s),
                 Paragraph(
                     f"{safe(exp.get('start_date', ''))} \u2013 {safe(exp.get('end_date', ''))}",
                     right_italic
                 )]
            ]
            t = Table(t_data, colWidths=[doc.width * 0.7, doc.width * 0.3])
            t.setStyle(TableStyle([('PADDING', (0, 0), (-1, -1), 0)]))
            story.append(t)
            for bullet in exp.get("bullets", []):
                story.append(Paragraph(f"\u2022 {safe(bullet)}", bullet_s))
            story.append(Spacer(1, 4))

    projs = enhanced_data.get("enhanced_projects", [])
    if projs:
        section_header("Projects")
        for proj in projs:
            right_blue = ParagraphStyle("R5", parent=body_s, alignment=2,
                                        textColor=colors.HexColor("#1e40af"), fontSize=9)
            proj_name_s = ParagraphStyle("PN", parent=bold_s, spaceAfter=1)
            t_data = [[
                Paragraph(safe(proj.get("name", "")).upper(), proj_name_s),
                Paragraph("GitHub", right_blue)
            ]]
            t = Table(t_data, colWidths=[doc.width * 0.85, doc.width * 0.15])
            t.setStyle(TableStyle([('PADDING', (0, 0), (-1, -1), 0)]))
            story.append(t)
            story.append(Paragraph(f"\u2022 {safe(proj.get('description', ''))}", bullet_s))
            if proj.get("technologies"):
                tech_s = ParagraphStyle("Tech", parent=body_s, leftIndent=14, fontSize=9,
                                        fontName="Times-Bold",
                                        textColor=colors.HexColor("#374151"))
                story.append(Paragraph(f"Technologies: {safe(proj.get('technologies', ''))}", tech_s))
            story.append(Spacer(1, 4))

    if resume_data.skills:
        section_header("Technical Skills and Interests")
        skills_text = ", ".join(safe(s) for s in resume_data.skills)
        story.append(Paragraph(f"<b>Skills:</b> {skills_text}", body_s))

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
