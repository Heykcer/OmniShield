# OmniShield - Product Requirements Document (PRD)

## 1. Product Overview
**OmniShield** is an AI-powered cybersecurity platform designed to protect both the "human layer" (phishing/deepfakes) and the "technology layer" (network anomalies). 
This PRD defines the Minimum Viable Product (MVP) to be built for the hackathon. The architecture is explicitly designed to be a premium, modern, decoupled web application using Microservices to provide the highest possible "WOW" factor to the judges.

## 2. The Tech Stack (Explained Simply for the Team)
To ensure everyone is on the same page, here is exactly what technologies we are using and *why* we are using them in simple terms:

### A. The User Interface (Frontend)
*   **Next.js:** This is the tool we use to build the dashboard that the user actually sees. It provides a powerful, fast, modern app architecture with built-in routing.
*   **Tailwind CSS:** This is our styling tool. It lets us easily add beautiful dark modes, sleek borders, and premium colors just by adding simple keywords to our React code.

### B. The Server & Database (Backend)
*   **FastAPI (Python):** This acts as our API Gateway and microservice framework. We chose it because it is incredibly fast and pairs perfectly with Python AI libraries.
*   **MongoDB:** This is our NoSQL database. It is highly scalable and perfectly suited for storing JSON data like telemetry logs, threat intel, and user API keys.

### C. The Brains (Machine Learning & AI)
*   **XGBoost & LightGBM:** We use these Machine Learning algorithms for **Phishing Detection**. The model mathematically analyzes extracted URL features (like entropy, domain length, and suspicious patterns) to predict threats with high accuracy and speed.
*   **PyTorch & OpenCV:** We use these for **Deepfake Detection**. OpenCV is used to "slice" a video into individual picture frames. PyTorch uses a custom **MesoNet-4 (Meso4) Convolutional Neural Network** to spot tiny spatial glitches that prove it's a deepfake.
*   **Google Gemini API:** We use this as our "Explainable AI". After our ML models flag a threat, we send the metrics to Gemini, and it types out a plain-English paragraph explaining *why* it's a threat so the user can easily understand it.
*   **B2B Telemetry Engine:** We use this for **Threat Intelligence**. Instead of raw network sniffing, we allow external apps to securely push JSON telemetry to our `/api/external/v1/telemetry` endpoint. Our logic detects API Abuse (DDoS), Data Exfiltration, and Malware Signatures instantly.

---

## 3. Directory Structure
Developers should adhere to this decoupled `frontend` and `backend` monorepo structure:
```text
OmniShield/
│
├── backend/
│   ├── docker-compose.yml      # Master Docker orchestration
│   ├── .env                    # GEMINI_API_KEY, MONGO_URI, and secrets
│   └── services/               # Microservices architecture
│       ├── api_gateway/        # Auth, Routing, and B2B Telemetry
│       ├── phishing_service/   # XGBoost/LightGBM ML Service
│       └── deepfake_service/   # PyTorch MesoNet Media Service
│
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── app/                # Next.js App Router
        │   ├── dashboard/page.jsx    # Unified UI for Scanners
        │   ├── b2b-analytics/page.jsx# Live B2B Telemetry Logs
        │   ├── developers/page.jsx   # API Docs and Integration Scripts
        │   └── login/page.jsx        # User Authentication
        └── components/         # Reusable UI components
```

---

## 4. Database Schema (MongoDB via Motor)
Use MongoDB for rapid JSON logging. We only need two core collections for the MVP:

1.  **`users` Collection:**
    *   `_id` (ObjectId)
    *   `username` (String, Unique)
    *   `password` (String)
    *   `api_key` (String, Unique) -> For B2B Telemetry access
2.  **`telemetry_logs` Collection:**
    *   `_id` (ObjectId)
    *   `timestamp` (DateTime)
    *   `event_type` (String)
    *   `user_agent` (String)
    *   `payload_size` (Integer)
    *   `threat_score` (Float)
    *   `details` (String) -> High-level explanation of the anomaly detected

---

## 5. Functional Requirements (Features to Build)

### Feature 1: The Core Infrastructure (API Gateway)
*   Set up `services/api_gateway/main.py` with FastAPI. Create JWT authentication routes (`/login`, `/register`).
*   Protect internal microservice routing using an API Gateway paradigm.
*   Ensure MongoDB collections initialize securely.

### Feature 2: Tool 1 - Phishing Engine (Phishing Service)
*   Create an isolated microservice for Phishing.
*   **Action:** 
    1.  Extract 14+ numerical features from the URL (e.g., entropy, path length, special characters) using `tldextract`.
    2.  Pass these features through an **XGBoost/LightGBM** model to get a probability score.
    3.  Send the risk vectors to the Google Gemini API with a strict system prompt to get a plain-English XAI explanation.
    ```text
    +-------------------+      +-------------------+      +-------------------+
    | 1. Input URL      | ---> | 2. Feature Ext.   | ---> | 3. XGBoost Model  |
    |                   |      |    (tldextract)   |      |    Probability    |
    +-------------------+      +-------------------+      +-------------------+
                                                                   |
                                                                   v
                               +-------------------+      +-------------------+
                               | 5. Return JSON    | <--- | 4. Gemini API     |
                               |    to Frontend    |      |    Explanation    |
                               +-------------------+      +-------------------+
    ```

### Feature 3: Tool 2 - Deepfake Detector (Deepfake Service)
*   Create an isolated microservice for Deepfakes.
*   **Action:** Extract frames using OpenCV, resize them to 256x256, and load them into a `Meso4` PyTorch Convolutional Neural Network.
*   Evaluate the spatial characteristics of the tensor to return an authenticity score, supplemented by Gemini XAI.
    ```text
    +-------------------+      +-------------------+      +-------------------+
    | 1. Upload .mp4    | ---> | 2. OpenCV Extract | ---> | 3. Tensor         |
    |                   |      |    Frames         |      |    Transformation |
    +-------------------+      +-------------------+      +-------------------+
                                                                   |
                                                                   v
    +-------------------+      +-------------------+      +-------------------+
    | 6. Return JSON    | <--- | 5. Gemini API     | <--- | 4. PyTorch Meso4  |
    |    to Frontend    |      |    Explanation    |      |    CNN Model      |
    +-------------------+      +-------------------+      +-------------------+
    ```

### Feature 4: Tool 3 - B2B Telemetry Engine (API Gateway)
*   Implement a `/api/external/v1/telemetry` endpoint on the Gateway.
*   **Action:** External developers can hit this endpoint with an `X-API-Key` to log network requests.
*   **Integration:** Detect high `request_rate` for DDoS, massive `payload_size` for Data Exfiltration, and malicious `user_agent` strings. Save the result to MongoDB.

### Feature 5: The Command Dashboard (Frontend)
*   Build `dashboard/page.jsx`. It should have interactive sections for Phishing Checks and Video Deepfake checks.
*   **Design Requirement:** Must look premium. Use Tailwind CSS for a sleek design. It must look like an expensive enterprise tool.

### Feature 6: Developer Portal & B2B Analytics (Frontend)
*   Build `developers/page.jsx` to render API documentation and dynamically generate integration scripts (Node.js, Python, cURL) utilizing the user's active API Key.
*   Build `b2b-analytics/page.jsx` to query MongoDB and display a live-updating table of Telemetry threat logs.

---



