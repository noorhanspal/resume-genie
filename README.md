# Resume Genie

An AI-powered resume builder that generates professional, ATS-friendly resumes in under 2 minutes.

## Tech Stack

- **Frontend** — Next.js 16, TypeScript, Tailwind CSS, shadcn/ui
- **Backend** — Python FastAPI
- **AI** — OpenAI GPT-4o-mini
- **PDF Generation** — ReportLab
- **Auth** — Clerk (email/password + email verification)

## Features

- **Authentication** — Sign up with email + password, email verification required, protected routes
- **5-step guided form** — Personal Info, Experience, Education, Skills, Projects
- **AI enhancement** — GPT-4o-mini rewrites raw input into professional bullet points and summary
- **3 resume templates** — Classic (blue accents), Modern (dark navy + emerald), Minimal (black & white serif)
- **Live template switcher** — Switch between templates instantly on the preview page
- **ATS Match Checker** — Paste any job description to get a match score, matched/missing keywords, and improvement suggestions
- **Resume Dashboard** — Save resumes to your account, open, download, or delete them
- **One-click PDF download** — Clean, properly formatted PDF with chosen template
- **Landing page** — Hero, features, how it works, templates showcase, CTA
- **Token cost logging** — Backend terminal shows token usage and cost in USD and INR after every AI call

## Project Structure

```
resume-genie/
├── frontend/                        # Next.js app
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── builder/                 # Multi-step resume form
│   │   ├── preview/                 # Resume preview + PDF + ATS checker
│   │   ├── dashboard/               # Saved resumes dashboard
│   │   ├── login/[[...rest]]/       # Clerk sign-in page
│   │   └── signup/[[...rest]]/      # Clerk sign-up page
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components
│   │   └── templates/
│   │       ├── ClassicTemplate.tsx
│   │       ├── ModernTemplate.tsx
│   │       └── MinimalTemplate.tsx
│   ├── lib/
│   │   └── types.ts                 # Shared TypeScript interfaces
│   └── middleware.ts                # Route protection via Clerk
│
└── backend/                         # FastAPI app
    ├── main.py                      # Entry point with CORS
    ├── models/
    │   └── resume.py                # Pydantic request models
    ├── routers/
    │   └── resume.py                # API endpoints
    └── services/
        ├── llm_service.py           # OpenAI integration + cost logging
        └── pdf_service.py           # ReportLab PDF generation (3 templates)
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI API key
- Clerk account (free at clerk.com)

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install fastapi uvicorn openai python-dotenv reportlab pydantic

# Start the server
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

### Environment Variables

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/enhance` | Enhance resume data with AI, returns JSON |
| POST | `/api/resume/generate-pdf` | Enhance + generate and return PDF file |
| POST | `/api/resume/ats-match` | Analyze resume against a job description |

## Auth Flow

1. Click **"Build My Resume"** on landing page — redirected to `/login`
2. New user? Click **Sign Up** — enter username, email, password
3. Verify email (Clerk sends verification email automatically)
4. After verification — redirected to `/dashboard`
5. Build resumes, save them, download PDFs from dashboard

## Cost Logging

Every AI call prints a usage summary in the backend terminal:

```
==================================================
  OpenAI Usage — Resume Enhancement
==================================================
  Model         : gpt-4o-mini
  Input tokens  : 512
  Output tokens : 847
  Total tokens  : 1,359
  Cost (USD)    : $0.000584
  Cost (INR)    : ₹0.0491
==================================================
```

Pricing is based on GPT-4o-mini rates ($0.15 / $0.60 per 1M tokens). Update `USD_TO_INR` in `backend/services/llm_service.py` if the exchange rate changes.
