# OmniShield - Product Requirements Document (PRD)

## 1. Product Overview
**OmniShield** is an AI-powered cybersecurity platform designed to protect both the "human layer" (phishing/deepfakes) and the "technology layer" (network anomalies). 
This PRD defines the Minimum Viable Product (MVP) to be built for the hackathon. The architecture is explicitly designed to be a premium, modern, decoupled web application to provide the highest possible "WOW" factor to the judges.

## 2. The Tech Stack (Explained Simply for the Team)
To ensure everyone is on the same page, here is exactly what technologies we are using and *why* we are using them in simple terms:

### A. The User Interface (Frontend)
*   **Next.js:** This is the tool we use to build the dashboard that the user actually sees. It is built on React and provides a powerful, fast, modern app architecture (like Netflix or Spotify) with built-in routing and performance optimizations.
*   **Tailwind CSS:** This is our styling tool. Instead of writing hundreds of lines of custom design code, Tailwind lets us easily add beautiful dark modes, sleek borders, and premium colors just by adding simple keywords to our React code.

### B. The Server & Database (Backend)
*   **FastAPI (Python):** This is the invisible "waiter" that takes requests from our React dashboard and hands them to our AI models. We chose it because it is incredibly fast and pairs perfectly with Python AI libraries.
*   **MongoDB:** This is our NoSQL database. It is highly scalable, flexible, and perfectly suited for storing semi-structured JSON data like threat logs and user accounts.

### C. The Brains (Machine Learning & AI)
*   **XGBoost & LightGBM:** We use these Machine Learning algorithms for **Phishing Detection**. Instead of a bulky pre-trained NLP model, we build a model from scratch that mathematically analyzes extracted URL features (like entropy, domain length, and suspicious patterns) to predict threats with high accuracy and speed.
*   **PyTorch & OpenCV:** We use these for **Deepfake Detection**. OpenCV is used to "slice" a video into individual picture frames (1 frame per second). PyTorch is the machine learning engine that looks at those frames to spot tiny glitches (like fake skin textures) that prove it's a deepfake.
*   **Google Gemini API:** We use this as our "Explainable AI". After our ML models flag a threat (based on URL features or Deepfakes), we send the metrics to Gemini, and it types out a plain-English paragraph explaining *why* it's a threat so the user can easily understand it.
*   **Scikit-Learn (Isolation Forests) & Scapy:** We use this for **Network Anomaly Detection**. Scapy acts like a wiretap, silently grabbing internet data packets. Scikit-Learn uses a math trick called "Isolation Forests" to figure out what a "normal" internet connection looks like, instantly sounding an alarm if a hacker tries to do something abnormal.

---

## 3. Directory Structure
Developers should adhere to this decoupled `frontend` and `backend` monorepo structure:
```text
OmniShield/
│
├── backend/
│   ├── main.py                 # FastAPI application and routes
│   ├── requirements.txt        # Python dependencies
│   ├── .env                    # GEMINI_API_KEY and secrets
│   ├── database/
│   │   └── mongo.py            # MongoDB connection and schemas
│   ├── ml_models/              # Physical Machine Learning Weights
│   │   └── deepfake_model.pt   # Downloaded PyTorch weights go here
│   └── utils/                  # The "Brain" (AI Code Logic)
│       ├── ai_media.py         # OpenCV + PyTorch deepfake logic
│       ├── ai_phishing.py      # Feature extraction + XGBoost/LightGBM logic
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
        │   ├── analytics/page.tsx # Global Command Center with Recharts
        │   └── report/page.tsx    # Gemini-generated summary view
        └── components/         # Reusable UI components
```

---

## 4. Database Schema (`mongo.py`)
Use MongoDB via PyMongo/Motor. We only need two core collections for the MVP:

1.  **`User` Table:**
    *   `id` (Integer, Primary Key)
    *   `username` (String, Unique)
    *   `password_hash` (String)
2.  **`ThreatLog` Table:**
    *   `id` (Integer, Primary Key)
    *   `user_id` (Integer, Foreign Key to User)
    *   `timestamp` (DateTime)
    *   `tool_used` (String) -> e.g., "Phishing", "Deepfake", "Network"
    *   `risk_score` (Float) -> 0.0 (Safe) to 1.0 (Critical)
    *   `details` (Text) -> The Gemini XAI explanation or Scapy packet info

---

## 5. Functional Requirements (Features to Build)

### Feature 1: The Core Infrastructure (Backend Team)
*   Set up `main.py` with FastAPI. Create JWT authentication routes (`/token`, `/register`).
*   Protect the API routes so only authenticated requests (with Bearer tokens) can access them.
*   Ensure MongoDB collections initialize and the connection works on first run.

### Feature 2: Tool 1 - Phishing Engine (AI Team)
*   Create an async route `/api/phishing` that takes a URL.
*   **Action:** 
    1.  Extract 16+ numerical features from the URL (e.g., entropy, path length, special characters, suspicious keywords).
    2.  Pass these features through an **XGBoost/LightGBM** model trained from scratch to get a probability score.
    3.  Send the top 3 highest-risk features to the Google Gemini API with a strict system prompt: *"You are an expert cybersecurity analyst. Explain to a user why a URL with these characteristics was flagged as phishing."*
*   Save the combined result to `ThreatLog`.
    ```text
    +-------------------+      +-------------------+      +-------------------+
    | 1. Input URL      | ---> | 2. Feature Ext.   | ---> | 3. XGBoost Model  |
    |                   |      |    & Entropy Math |      |    Probability    |
    +-------------------+      +-------------------+      +-------------------+
                                                                   |
                                                                   v
                               +-------------------+      +-------------------+
                               | 5. Save to        | <--- | 4. Gemini API     |
                               |    ThreatLog DB   |      |    Explanation    |
                               +-------------------+      +-------------------+
    ```

### Feature 3: Tool 2 - Deepfake Detector (AI Team)
*   Create an async route `/api/deepfake` that accepts `UploadFile`.
*   **Action:** If it's a video, use OpenCV to extract 1 frame per second. Pass the frame through a pre-trained PyTorch model (e.g., Facenet-PyTorch or a simple CNN) to get an authenticity score. Return the average score.
*   Save the result to `ThreatLog`.
    ```text
    +-------------------+      +-------------------+      +-------------------+
    | 1. Upload .mp4    | ---> | 2. RAM Storage    | ---> | 3. OpenCV Extract |
    |                   |      |                   |      |    Frames         |
    +-------------------+      +-------------------+      +-------------------+
                                                                   |
                                                                   v
    +-------------------+      +-------------------+      +-------------------+
    | 6. Save to        | <--- | 5. Aggregate      | <--- | 4. PyTorch CNN    |
    |    ThreatLog DB   |      |    Score          |      |    Model          |
    +-------------------+      +-------------------+      +-------------------+
    ```

### Feature 4: Tool 3 - Background Network Agent (Backend Team)
*   Create `network_agent.py`.
*   **Action:** Write a Python function using `scapy.sniff(filter="tcp", count=10)` to capture 10 packets.
*   **Integration:** In `main.py`, use FastAPI's `@app.on_event("startup")` to start this agent as a background thread: `threading.Thread(target=start_sniffing, daemon=True).start()`.
*   If abnormal IP velocity is detected, push an alert to the database via WebSocket or REST.
    ```text
    +-------------------+      +-------------------+      +-------------------+
    | 1. app.on_event   | ---> | 2. Daemon Thread  | ---> | 3. scapy.sniff    |
    |    ("startup")    |      |                   |      |                   |
    +-------------------+      +-------------------+      +-------------------+
                                                                   |
                                                                   v
                               +-------------------+      +-------------------+
                               | 5. Save to        | <--- | 4. Isolation      |
                               |    ThreatLog DB   |      |    Forest Anomaly |
                               +-------------------+      +-------------------+
    ```

### Feature 5: The Command Dashboard (Frontend Team)
*   Build `Dashboard.jsx`. It should have three main interactive sections (tabs or cards):
    1.  A form with a textarea for Phishing Checks.
    2.  A file upload dropzone for Video/Audio Deepfake checks.
    3.  A live-updating table showing recent entries from the `ThreatLog` database.
*   **Design Requirement:** Must look premium. Use Tailwind CSS for a sleek dark mode. Use Framer Motion for smooth tab transitions and loading spinners during AI inference. It must look like an expensive enterprise tool.

### Feature 6: Report Generation (Backend/AI Team)
*   Create an endpoint `/api/generate-report`.
*   **Action:** Query `ThreatLog` for the last 10 events. Send them to Gemini API: *"Summarize these 10 security events into an executive IT report."*
*   Send the JSON back to the frontend to render beautifully in `Report.jsx`.

### Feature 7: Global Analytics Dashboard (Frontend/Backend Team)
*   Create an endpoint `/api/analytics` that runs SQL `GROUP BY` queries on the `ThreatLog` table (e.g., count of deepfakes vs phishing attempts this week).
*   **Action:** Build an `Analytics.jsx` React component. Use a free charting library like **Recharts** or **Chart.js** to display beautiful, colorful graphs (Pie charts for threat types, Line charts for threat frequency over time). This acts as the "Command Center" view for IT Admins.

---



