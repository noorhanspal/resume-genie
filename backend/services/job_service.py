import json
import os
import urllib.request
import urllib.parse
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_job_search_keyword(role: str, skills: list) -> str:
    prompt = f"""
    You are an expert tech recruiter. Based on the user's role and skills, give me the single best concise job search keyword (max 2-3 words) to use in a job board search API.
    
    User Role: {role}
    User Skills: {', '.join(skills)}
    
    Only return the keyword string, nothing else. For example: "React Developer" or "Frontend Engineer".
    """
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )
    return response.choices[0].message.content.strip()

def fetch_jobs_from_api() -> list:
    # Use Arbeitnow API as requested by user
    req = urllib.request.Request(
        'https://www.arbeitnow.com/api/job-board-api',
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode())
            # data['data'] contains the jobs. Returns 100 recent jobs.
            return data.get('data', [])
    except Exception as e:
        print(f"Error fetching from Arbeitnow: {e}")
        return []

def evaluate_job_match(role: str, skills: list, job: dict) -> dict:
    job_title = job.get('title', '')
    company = job.get('company_name', '')
    description = job.get('description', '')
    link = job.get('url', '')

    prompt = f"""
    You are an expert career counselor. Evaluate how well this job fits the user.
    
    User Role: {role}
    User Skills: {', '.join(skills)}
    
    Job Title: {job_title}
    Company: {company}
    Job Description (snippet): {description[:1000]}...
    
    Return a JSON object with:
    {{
      "match_percentage": <int 0-100>,
      "missing_skills": ["skill1", "skill2"],
      "why_it_fits": "2 line explanation of why this job fits the user based on their skills."
    }}
    Return ONLY valid JSON.
    """
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        result = json.loads(response.choices[0].message.content)
        result["job_title"] = job_title
        result["company"] = company
        result["apply_link"] = link
        result["location"] = job.get('location', 'Remote')
        return result
    except Exception as e:
        print(f"Error evaluating job {job_title}: {e}")
        return None

def find_and_evaluate_jobs(role: str, skills: list) -> list:
    keyword = get_job_search_keyword(role, skills)
    print(f"Generated Keyword: {keyword}")
    
    all_jobs = fetch_jobs_from_api()
    
    # Filter locally by keyword (very basic filter)
    keyword_lower = keyword.lower().split()
    role_lower = role.lower().split()
    
    filtered_jobs = []
    for job in all_jobs:
        title = str(job.get('title', '')).lower()
        # If any word from keyword or role is in the title, we consider it
        # Actually Arbeitnow has a lot of German/Europe jobs, so we might need a looser filter.
        if any(w in title for w in keyword_lower) or any(w in title for w in role_lower):
            filtered_jobs.append(job)
            
    # Limit to top 10 to evaluate to save LLM costs and time
    if len(filtered_jobs) == 0:
        return {
            "keyword": keyword,
            "jobs": []
        }
        
    filtered_jobs = filtered_jobs[:10]

    evaluated_jobs = []
    for job in filtered_jobs:
        res = evaluate_job_match(role, skills, job)
        if res:
            evaluated_jobs.append(res)
            
    # Sort by match percentage
    evaluated_jobs.sort(key=lambda x: x.get("match_percentage", 0), reverse=True)
    
    # Return top 5
    return {
        "keyword": keyword,
        "jobs": evaluated_jobs[:5]
    }
