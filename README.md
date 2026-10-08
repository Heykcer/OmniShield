# OmniShield

**OmniShield** is an AI-powered cybersecurity platform designed to protect both the "human layer" (phishing/deepfakes) and the "technology layer" (network anomalies). 

This project uses a decoupled monorepo structure, featuring a modern React frontend and a FastAPI backend powered by Machine Learning and Explainable AI.

## Architecture

The project is structured into two main components:

### 1. Frontend (Next.js + Tailwind CSS)
A premium, modern web dashboard for users and IT administrators to analyze threats in real-time.
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS for sleek, modern interfaces
- **Directory**: `/frontend`

### 2. Backend (FastAPI + AI Models + MongoDB)
A high-performance Python backend acting as the brain of the platform.
- **Framework**: FastAPI
- **Database**: MongoDB (managed via Motor)
- **AI Models**:
  - **Phishing Detection**: DistilBERT (via HuggingFace) + Google Gemini API for Explainable AI
  - **Deepfake Detection**: PyTorch + OpenCV (Image/Video forensics)
  - **Network Anomalies**: Scikit-Learn (Isolation Forests) + Scapy
- **Directory**: `/backend`

---

## Directory Structure

```text
OmniShield/
│
├── backend/
│   ├── main.py                 # FastAPI application and routes
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # GEMINI_API_KEY and secrets
│   ├── database/
│   │   └── mongo.py            # MongoDB connection and schemas
│   ├── ml_models/              # Local ML weights go here
│   └── utils/                  # AI Code Logic
│       ├── ai_media.py         # OpenCV + PyTorch deepfake logic
│       ├── ai_text.py          # HuggingFace (DistilBERT) + Gemini logic
│       └── network_agent.py    # Scapy + Scikit-Learn (Isolation Forest)
│
└── frontend/
    ├── package.json
    ├── tailwind.config.ts
    └── src/
        ├── app/                # Next.js App Router
        │   ├── layout.tsx
        │   ├── page.tsx        # Landing Page
        │   ├── login/page.tsx
        │   ├── dashboard/page.tsx # Unified UI with tabs for all 3 tools
        │   ├── analytics/page.tsx # Global Command Center
        │   └── report/page.tsx    # Gemini-generated summary view
        └── components/         # Reusable UI components
```

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
2. Create and activate a virtual environment:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
4. Configure environment variables (copy `.env.example` to `.env` and add your `GEMINI_API_KEY`).
5. Run the FastAPI server:
   ```powershell
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```

Open your browser to the local URL provided by Vite (usually `http://localhost:5173`) to view the frontend, and `http://localhost:8000/docs` to view the interactive backend API documentation.