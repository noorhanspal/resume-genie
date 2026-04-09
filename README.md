# Resume Genie 🧞‍♂️

An AI-powered resume builder that generates professional, ATS-friendly resumes in under 2 minutes. Now featuring a **Premium Glassmorphic UI** and **Deep-Learning Smart Analysis**.

## 💎 New in Version 2.0
- **Glassmorphism Design System** — A high-end frosted glass aesthetic with backdrop blurs, vibrant mesh gradients, and fluid entrance animations.
- **Tailwind CSS v4 Integration** — Leveraging the latest in CSS modern tech for lighting-fast builds and advanced styling.
- **Smart AI Analysis Dashboard** — A dedicated platform that extracts skills, detects weak points, and suggests improvements instantly.
- **Accessibility Fixes** — Overhauled contrast ratios for seamless light and dark mode navigation.

## 🚀 Tech Stack

- **Frontend** — Next.js 16 (App Router), TypeScript, **Tailwind CSS v4**, shadcn/ui
- **Backend** — Python FastAPI
- **AI** — OpenAI GPT-4o-mini
- **PDF Generation** — ReportLab
- **Auth** — Clerk (Enterprise-grade auth with email verification)

## ✨ Features

- **Authentication** — Secure login/signup with Clerk, including auto email verification and protected routes.
- **Guided 5-Step Builder** — Elegant multi-step form for Personal Info, Experience, Education, Skills, and Projects with pop-in animations.
- **AI Content Enhancement** — GPT-4o-mini transforms raw notes into high-impact, professional statements.
- **4 Premium Templates**:
  - **Classic**: Traditional centered layout with soft blue accents.
  - **Modern**: Bold navy header with emerald highlights and sidebars.
  - **Minimal**: Clean Times New Roman design for the ultimate professional look.
  - **Professional**: Balanced, centered design optimized for high-level roles.
- **Live Template Switcher** — Preview and swap templates in real-time before downloading.
- **Smart Analysis Dashboard** 🧠 — Deep-learning feedback on your existing resume. Detects gaps and suggests fixes.
- **ATS Match Checker** 🎯 — Get an instant match score and missing keyword list against any job description.
- **AI Job Finder** ✨ — Automatic job matching based on your role and skills with AI-fit explanations.
- **One-Click PDF Download** — High-fidelity PDF generation that perfectly matches the web preview.

## 📁 Project Structure

```
resume-genie/
├── frontend/                        # Next.js app (Tailwind v4)
│   ├── app/
│   │   ├── page.tsx                 # Modern Glassy Landing page
│   │   ├── builder/                 # Animated Multi-step builder
│   │   ├── preview/                 # Glassy preview + Template Selector
│   │   ├── smart-analysis/          # AI Analysis Dashboard
│   │   ├── jobs/                    # AI Job Matcher
│   │   └── ...
│   ├── components/
│   │   ├── ThemeToggle.tsx          # Glassy Light/Dark toggle
│   │   └── templates/               # (Classic, Modern, Minimal, Professional)
│   └── globals.css                  # Advanced Glassmorphic Design System
│
└── backend/                         # FastAPI app
    ├── services/
    │   ├── pdf_service.py           # Polished ReportLab templates
    │   ├── llm_service.py           # OpenAI with cost/token logging
    │   └── job_service.py           # Live job matching logic
    └── ...
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- OpenAI API key
- Clerk account

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn openai python-dotenv reportlab pydantic
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 📊 AI Cost Visibility
Every AI call is logged in the backend terminal with a precision cost summary:
```
==================================================
  Model         : gpt-4o-mini                             
  Input tokens  : 369                  
  Output tokens : 266                     
  Total tokens  : 635                  
  Cost (USD)    : $0.000215   
  Cost (INR)    : ₹0.0181                         
==================================================
```

## 📄 License
This project is for demonstration and personal professional development. Ensure you have your own API keys.
