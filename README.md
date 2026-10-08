# OmniShield Unified Security Engine

**OmniShield** is an AI-powered cybersecurity platform designed to protect both the "human layer" (phishing/deepfakes) and the "technology layer" (network anomalies). 

This project uses a highly scalable **Microservice Architecture**, featuring a premium Next.js React frontend and a Dockerized cluster of FastAPI microservices powered by Machine Learning and Explainable AI.

---

## Architecture

The project is structured into three main layers:

### 1. Frontend (Next.js + Tailwind CSS)
A premium, modern web dashboard for users and IT administrators to analyze threats in real-time.
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Directory**: `/frontend`

### 2. API Gateway & Auth Service
A lightweight, high-performance reverse proxy that handles incoming traffic, JWT Authentication, and MongoDB logging.
- **Framework**: FastAPI
- **Database**: MongoDB Atlas (managed via Motor)
- **Directory**: `/backend/services/api_gateway`

### 3. Isolated Phishing ML Service
A dedicated, CPU-intensive microservice strictly for handling feature extraction and mathematical inference.
- **AI Models**: Ensemble Learning (XGBoost, LightGBM, Random Forest)
- **Dataset**: Trained on the 30-feature UCI Phishing Dataset.
- **Explainable AI (XAI)**: Rule-based Feature Attribution + Google Gemini Generative AI summaries.
- **Directory**: `/backend/services/phishing_service`

*(Deepfake and Network Log microservices are planned for the future).*

---

## Directory Structure

```text
OmniShield/
│
├── backend/
│   ├── docker-compose.yml          # Master orchestration file
│   ├── .env                        # Database & API Secrets
│   └── services/
│       ├── api_gateway/            # Port 8000 (MongoDB & Routing)
│       └── phishing_service/       # Port 8001 (ML Inference Engine)
│
└── frontend/
    ├── package.json
    └── src/
        ├── app/                    # Next.js App Router
        │   ├── dashboard/page.jsx  # Main Threat Scanning Interface
        │   ├── analytics/page.jsx  # ML Model Comparison & Metrics
        │   └── login/page.jsx      # User Authentication
        └── components/             # Reusable UI components
```

---

## Getting Started

### 1. Backend Microservice Cluster Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Configure your environment variables:
   - Copy the template file: `cp .env.example .env`
   - Open `.env` and fill in your **MongoDB Atlas URI** and **Google Gemini API Key**.
3. Boot up the entire cluster using Docker Compose:
   ```bash
   docker-compose up --build
   ```
   *The API Gateway will boot on `http://localhost:8000` and the Phishing ML Service will boot silently on `http://localhost:8001`.*

### 2. Frontend Setup
1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

**You are ready!** Open your browser to `http://localhost:3000` to access the OmniShield command center.