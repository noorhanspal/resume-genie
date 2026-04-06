import json
import os
from dotenv import load_dotenv
from openai import OpenAI
from models.resume import ResumeData

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# GPT-4o-mini pricing (USD per 1M tokens)
PRICE_INPUT_PER_1M = 0.150
PRICE_OUTPUT_PER_1M = 0.600
USD_TO_INR = 84.0


def _log_usage(usage, label: str = "Resume Enhancement"):
    input_tokens = usage.prompt_tokens
    output_tokens = usage.completion_tokens
    total_tokens = usage.total_tokens

    input_cost_usd = (input_tokens / 1_000_000) * PRICE_INPUT_PER_1M
    output_cost_usd = (output_tokens / 1_000_000) * PRICE_OUTPUT_PER_1M
    total_cost_usd = input_cost_usd + output_cost_usd
    total_cost_inr = total_cost_usd * USD_TO_INR

    print("\n" + "=" * 50)
    print(f"  OpenAI Usage — {label}")
    print("=" * 50)
    print(f"  Model         : gpt-4o-mini")
    print(f"  Input tokens  : {input_tokens:,}")
    print(f"  Output tokens : {output_tokens:,}")
    print(f"  Total tokens  : {total_tokens:,}")
    print(f"  Cost (USD)    : ${total_cost_usd:.6f}")
    print(f"  Cost (INR)    : ₹{total_cost_inr:.4f}")
    print("=" * 50 + "\n")


def enhance_resume_with_llm(data: ResumeData) -> dict:
    experience_text = ""
    for exp in data.work_experience:
        experience_text += f"""
        Company: {exp.company}
        Role: {exp.role}
        Duration: {exp.start_date} - {exp.end_date}
        Responsibilities: {exp.responsibilities}
        """

    projects_text = ""
    for proj in data.projects:
        projects_text += f"""
        Project: {proj.name}
        Description: {proj.description}
        Technologies: {proj.technologies}
        """

    prompt = f"""
You are a professional resume writer. Enhance the following resume data and return a JSON response.

Candidate: {data.personal_info.full_name}
Target Role: {data.job_title or 'Not specified'}

Work Experience:
{experience_text}

Projects:
{projects_text}

Skills: {', '.join(data.skills)}

User's Summary (if any): {data.personal_info.summary}

Return a JSON object with these exact keys:
{{
  "professional_summary": "2-3 sentence impactful professional summary",
  "enhanced_experience": [
    {{
      "company": "company name",
      "role": "job title",
      "start_date": "start",
      "end_date": "end",
      "bullets": ["bullet 1 with action verb + metric", "bullet 2", "bullet 3", "bullet 4"]
    }}
  ],
  "enhanced_projects": [
    {{
      "name": "project name",
      "description": "improved 1-2 line description",
      "technologies": "tech stack"
    }}
  ]
}}

Rules:
- Use strong action verbs (Developed, Implemented, Optimized, Led, Built, etc.)
- Add measurable impact where possible
- Keep bullets concise and ATS-friendly
- Return ONLY valid JSON, no markdown
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.7,
    )

    _log_usage(response.usage)
    return json.loads(response.choices[0].message.content)


def analyze_ats_match(resume_data: ResumeData, job_description: str) -> dict:
    skills_text = ", ".join(resume_data.skills)

    experience_text = ""
    for exp in resume_data.work_experience:
        experience_text += f"{exp.role} at {exp.company}: {exp.responsibilities}\n"

    projects_text = ""
    for proj in resume_data.projects:
        projects_text += f"{proj.name} ({proj.technologies}): {proj.description}\n"

    prompt = f"""
You are an expert ATS (Applicant Tracking System) analyst. Compare the resume below against the job description and return a JSON analysis.

--- RESUME ---
Name: {resume_data.personal_info.full_name}
Target Role: {resume_data.job_title or "Not specified"}
Skills: {skills_text}
Experience:
{experience_text}
Projects:
{projects_text}
Summary: {resume_data.personal_info.summary}

--- JOB DESCRIPTION ---
{job_description}

Return a JSON object with these exact keys:
{{
  "score": <integer 0-100 representing overall ATS match percentage>,
  "matched_keywords": ["keyword1", "keyword2", ...],
  "missing_keywords": ["keyword1", "keyword2", ...],
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2", ...],
  "summary": "2-3 sentence overall assessment of the match"
}}

Rules:
- score should reflect how well the resume matches the job description keywords, required skills, and experience
- matched_keywords: important keywords/skills from the job description that ARE present in the resume (max 15)
- missing_keywords: important keywords/skills from the job description that are NOT in the resume (max 15)
- suggestions: 3-5 specific, actionable improvements to better match this job (e.g. "Add Docker to your skills section")
- Return ONLY valid JSON, no markdown
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.3,
    )

    _log_usage(response.usage, label="ATS Match Analysis")
    return json.loads(response.choices[0].message.content)


def analyze_uploaded_resume(resume_text: str) -> dict:
    prompt = f"""
You are an expert career counselor and resume reviewer. Parse the provided resume text, understand the skills and work experience, detect weak points, and suggest the best job roles for the candidate. Finally, provide actionable improvement suggestions.

--- RESUME TEXT ---
{resume_text}

Return a JSON object with these exact keys:
{{
  "best_roles": ["Role 1", "Role 2", "Role 3"],
  "skills_extracted": ["Skill 1", "Skill 2", "Skill 3"],
  "weak_points": ["Weak point 1", "Weak point 2"],
  "improvement_suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"]
}}

Rules:
- best_roles: Provide 2-4 roles that are the best fit for this resume based on skills and experience.
- skills_extracted: Extract 10-15 key skills from the text.
- weak_points: Point out 2-3 missing elements (e.g. lack of measurable metrics, missing core skills for standard roles, gaps, unstructured formatting).
- improvement_suggestions: Provide 3-5 specific suggestions for making this resume better (e.g. "Add projects relating to React", "Improve keywords like <keyword>").
- Return ONLY valid JSON, no markdown.
"""

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        temperature=0.5,
    )

    _log_usage(response.usage, label="Smart Resume Analysis")
    return json.loads(response.choices[0].message.content)
