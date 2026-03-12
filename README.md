# Resume Genie

An AI-powered resume builder that generates professional, ATS-friendly resumes in under 2 minutes.

## Tech Stack

- **Frontend** — Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend** — Python FastAPI
- **AI** — OpenAI GPT-4o-mini
- **PDF Generation** — ReportLab

## Features

- 5-step guided form (Personal Info, Experience, Education, Skills, Projects)
- AI enhances raw input into professional bullet points and summary
- Live resume preview in the browser
- One-click ATS-friendly PDF download
- Terminal logs token usage and cost in USD and INR after every generation

## Project Structure

```
resume-genie/
├── frontend/               # Next.js app
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   ├── builder/        # Multi-step form
│   │   └── preview/        # Resume preview + PDF download
│   ├── components/ui/      # shadcn/ui components
│   └── lib/
│       └── types.ts        # Shared TypeScript interfaces
│
└── backend/                # FastAPI app
    ├── main.py             # Entry point with CORS
    ├── models/
    │   └── resume.py       # Pydantic request models
    ├── routers/
    │   └── resume.py       # API endpoints
    └── services/
        ├── llm_service.py  # OpenAI integration + cost logging
        └── pdf_service.py  # ReportLab PDF generation
```

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- OpenAI API key

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install fastapi uvicorn openai python-dotenv reportlab pydantic

# Add your API key
cp .env.example .env
# Edit .env and set OPENAI_API_KEY=your_key_here

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

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resume/enhance` | Enhance resume data with AI, returns JSON |
| POST | `/api/resume/generate-pdf` | Enhance + generate and return PDF file |

## Environment Variables

Create `backend/.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Cost Logging

Every resume generation prints a usage summary in the backend terminal:

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
