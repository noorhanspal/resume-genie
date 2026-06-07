from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import resume, jobs

import os

app = FastAPI(title="Resume Genie API")

# CORS: allow localhost for dev + any *.vercel.app for production
frontend_url = os.environ.get("FRONTEND_URL", "")

allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

if frontend_url and frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router)
app.include_router(jobs.router)


@app.get("/")
def root():
    return {"message": "Resume Genie API is running"}

