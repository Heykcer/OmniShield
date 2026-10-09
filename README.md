# OmniShield Unified Security Engine

**OmniShield** is an AI-powered cybersecurity platform designed to protect both the "human layer" (phishing/deepfakes) and the "technology layer" (network anomalies). 

This project uses a highly scalable **Microservice Architecture**, featuring a premium Next.js React frontend and a Dockerized cluster of FastAPI microservices powered by Machine Learning, Deep Neural Networks, and Explainable AI.

---

## Architecture

The project is structured into three main layers and multiple microservices:

### 1. Frontend (Next.js + Tailwind CSS)
A premium, modern web dashboard for users, developers, and IT administrators to analyze threats in real-time.
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Features**: Live Analytics Dashboard, Threat Scanners (Phishing/Deepfakes), and a B2B Developer Portal.
- **Directory**: `/frontend`

### 2. API Gateway & B2B Telemetry Service
A high-performance reverse proxy that handles incoming traffic, JWT/API-Key Authentication, and B2B external telemetry logging.
- **Framework**: FastAPI
- **Database**: MongoDB Atlas (managed via Motor)
- **Key Feature**: Handles `/api/external/v1/telemetry` for cross-platform network logging and anomaly detection.
- **Directory**: `/backend/services/api_gateway`

### 3. Phishing ML Forensics Service
A dedicated, CPU-intensive microservice strictly for handling feature extraction and mathematical inference for social engineering threats.
- **AI Models**: Ensemble Learning (XGBoost, LightGBM, Random Forest loaded via `joblib`).
- **Feature Engineering**: Extracts 14 lexical and structural features via `tldextract`.
- **Explainable AI (XAI)**: Google Gemini Generative AI generates plain-English forensic summaries.
- **Directory**: `/backend/services/phishing_service`

### 4. Deepfake AI Detector Service
A deep learning microservice built to analyze multimedia files for spatial manipulation artifacts.
- **AI Models**: Custom MesoNet-4 (Meso4) Convolutional Neural Network (PyTorch).
- **Processing**: Keyframe extraction via OpenCV (256x256 resizing) with spatial tensor analysis.
- **Explainable AI (XAI)**: Gemini API supplements CNN risk scores with detailed forensics.
- **Directory**: `/backend/services/deepfake_service`

---

## Directory Structure

```text
OmniShield/
│
├── backend/
│   ├── docker-compose.yml          # Master orchestration file
│   ├── .env                        # Database & API Secrets
│   └── services/
│       ├── api_gateway/            # Port 8000 (MongoDB, Routing, B2B Telemetry)
│       ├── phishing_service/       # Port 8001 (URL ML Inference Engine)
│       └── deepfake_service/       # Port 8002 (PyTorch CNN Media Engine)
│
└── frontend/
    ├── package.json
    └── src/
        ├── app/                    # Next.js App Router
        │   ├── dashboard/page.jsx  # Main Threat Scanning Interface
        │   ├── b2b-analytics/      # B2B Live Threat Logs & Analytics
        │   ├── developers/         # Developer API Key & Schema Docs
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
   - Create a `.env` file in the `backend/` root directory.
   - Fill in your **MongoDB Atlas URI** (`MONGO_URI`), **Google Gemini API Key** (`GENAI_API_KEY`), and standard secrets.
3. Boot up the entire cluster using Docker Compose:
   ```bash
   docker-compose up --build
   ```
   *The API Gateway binds to `:8000`, Phishing Service to `:8001`, and Deepfake Service to `:8002`.*

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