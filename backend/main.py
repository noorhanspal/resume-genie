from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, jobs

import os

app = FastAPI(title="Resume Genie API")

# Update CORS to allow both local development and Vercel deployments
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://*.vercel.app"  # Wildcard for Vercel preview and production deployments (if supported, otherwise we allow all via credentials=False or specify exactly)
]

# Note: FastAPI doesn't support wildcard like "https://*.vercel.app" out of the box with allow_credentials=True.
# A better approach is to allow the specific frontend URL using an environment variable.
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
if frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if os.environ.get("ENV") != "production" else [frontend_url, "http://localhost:3000"], 
    allow_origin_regex=r"https://.*\.vercel\.app" if os.environ.get("ENV") != "production" else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)
app.include_router(jobs.router)


@app.get("/")
def root():
    return {"message": "Resume Genie API is running"}

