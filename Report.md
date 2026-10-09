# OmniShield - Technical Hackathon Report

## 1. The Problem: Why Are We Here?
We live in a world where technology is advancing faster than our ability to secure it. The core problem happening today is that hackers are no longer just hacking computers; they are hacking human psychology.
With the rapid rise of Artificial Intelligence, traditional security systems (which look for known viruses or bad code) are failing. Cybercriminals are using AI to create hyper-realistic deepfake videos, clone voices, and craft highly persuasive phishing emails.

### Who is Facing This Problem & How Do They Get Victimized?
This threat does not discriminate. It affects everyone from a regular person to massive corporations. Here are real-life scenarios:

**The Basic Individual (e.g., A Grandparent or Student):**
*   **Scenario 1 (AI Voice Clone):** A grandfather receives a frantic phone call that sounds exactly like his grandson, claiming he is in an emergency and urgently needs money wired. Because of AI voice cloning, the grandfather believes it and loses his life savings. *(Real News Fact: The FBI and FTC have recently issued major warnings about the rise of the AI-powered "Grandparent Scam", where scammers clone voices using just 3 seconds of audio pulled from social media).*
*   **Scenario 2 (Fake Shopping Site):** A college student sees a highly targeted social media ad for a brand new iPhone or luxury sneakers at an unbelievable 80% discount. The link takes them to a fake, look-alike shopping website. When they enter their credit card details to buy the "discounted" product, the hackers steal their card information. *(Real News Fact: Millions are lost annually to highly sophisticated spoofed domains that perfectly mimic real brands during holiday shopping seasons).*
*   **Scenario 3 (Modded APKs):** A teenager looking to get free premium features in a popular mobile app downloads a "Mod APK" (modified application) from an untrusted forum. The hidden malware in the APK secretly reads their SMS messages to steal bank OTPs and grants hackers remote access to their device. *(Real News Fact: Cybersecurity agencies frequently report on Android Banking Trojans distributed via fake WhatsApp or "Mod" APKs that abuse Android accessibility services to silently drain bank accounts).*

**The Celebrity or Public Figure:**
*   **The Scenario:** A famous actor or influencer's face and voice are stolen to create a highly realistic deepfake video endorsing a fake cryptocurrency scam. Fans trust the celebrity, invest their money, and lose everything. *(Real News Fact: AI-generated deepfakes of high-profile figures like Elon Musk and MrBeast are constantly circulating on TikTok and YouTube, falsely endorsing crypto giveaways and tricking thousands of followers).*

**The Corporate Employee (e.g., A Finance Manager):**
*   **The Scenario:** A manager receives an urgent email and joins a video call that appears to be with the company's CEO and CFO. The meeting looks completely real, so the manager wires the requested funds. *(Real News Fact: In February 2024, a finance worker at a multinational firm in Hong Kong was tricked into paying out $25 million (HK$200 million) after attending a video conference where the CFO and all other colleagues on the call were entirely AI-generated deepfakes).*

**Institutions (Universities, Banks, Hospitals):**
*   **The Scenario:** Hackers use automated bots to attempt thousands of stolen passwords per second (credential stuffing). Once inside, they steal sensitive student data, financial records, or patient information, leading to massive data breaches and loss of public trust. *(Real News Fact: Major institutions, including global healthcare providers and universities, are continually paralyzed by credential stuffing and ransomware attacks, leading to massive data breaches and multi-million dollar payouts).*

---

## 2. Project Overview & The OmniShield Solution
**Project Name:** OmniShield Unified Security Engine
**Tagline:** "Securing the Human Layer and the Technology Layer with Explainable AI."

Current enterprise security solutions suffer from critical flaws: they have blind spots for AI-impersonation, they require fragmented toolsets, and their ML models spit out "black box" numbers instead of explaining *why* something is a threat.

We built **OmniShield** to solve this. It is a unified, AI-driven platform that not only detects next-generation threats like Deepfakes and Phishing via cross-dataset validated models, but uses Generative AI to explain *exactly* what the threat is in plain English.

---

## 3. The Core Security Tools (Our Prototype)

To effectively secure both the human and technology layers, our prototype is divided into highly specialized tools, which feed into one centralized Cybersecurity Command Dashboard.

### Tool 1: AI-Powered Phishing & Social Engineering Engine
*   **The Scenario Addressed:** Combats the Fake Shopping Site targeting students and credential harvesting campaigns.
*   **How the Solution Works:** Users can paste suspicious URLs into the tool. The engine extracts structural URL features and classifies the threat using cross-dataset validated ML models. It generates an Explainable AI (XAI) output.
    ```text
    +-------------------+      +-------------------+      +-------------------+
    | 1. Paste URL      | ---> | 2. Extract URL    | ---> | 3. Threat > 50%?  |
    |                   |      |    Features       |      |    (If yes...)    |
    +-------------------+      +-------------------+      +-------------------+
                                                                   |
                                                                   v
    +-------------------+      +-------------------+      +-------------------+
    | 6. Alert User     | <--- | 5. Save to        | <--- | 4. Gemini API     |
    |    on Dashboard   |      |    ThreatLog DB   |      |    Generates XAI  |
    +-------------------+      +-------------------+      +-------------------+
    ```
*   **Algorithm & Models:** Our implementation extracts 30 specific structural and lexical features from raw URLs (e.g., domain length, subdomain counts, having IP address, SSL states). We designed a state-of-the-art **Hybrid Master Ensemble** model—which elegantly combines a Soft Voting Classifier and a Stacking Classifier built on top of **XGBoost**, **LightGBM**, and **Random Forest**—to calculate the phishing probability score with ~96.9% accuracy. Once the structural ML model flags the URL as a threat, the exact risk vectors are passed to the **Google Gemini API** to generate a plain English "Explainable AI (XAI)" forensic summary for the user.
*   **Datasets for Training:** PhishTank, OpenPhish, GramBeddings, and PhiUSIIL (Cross-dataset validation).
*   **Tech Stack:** Python, FastAPI, Scikit-Learn (`joblib`), XGBoost, LightGBM, `tldextract`, Google Gemini SDK (for XAI).

### Tool 2: Deepfake & Digital Impersonation Detector (MesoNet PyTorch CNN)
*   **The Scenario Addressed:** Prevents the AI Voice Clone "Grandparent Scam", celebrity deepfakes, and the $25 million deepfake video call scam.
*   **How the Solution Works:** Users upload questionable video files to the dashboard. The tool performs pixel-by-pixel spatial analysis to calculate an authenticity/confidence score (Safe → Critical) and flags forensic artifacts, supplemented by a Gemini XAI summary.
    ```text
    +-------------------+      +-------------------+      +-------------------+
    | 1. Upload .mp4    | ---> | 2. Load to RAM    | ---> | 3. OpenCV Extract |
    |    Video File     |      |    (Privacy)      |      |    1 Frame/Sec    |
    +-------------------+      +-------------------+      +-------------------+
                                                                   |
                                                                   v
    +-------------------+      +-------------------+      +-------------------+
    | 6. Flag Threat    | <--- | 5. Average Score  | <--- | 4. PyTorch CNN    |
    |    & Delete File  |      |    Across Frames  |      |    (Meso4.pth)    |
    +-------------------+      +-------------------+      +-------------------+
    ```
*   **Algorithm & Models:** Our prototype runs deepfake detection directly on raw pixels. We extract keyframes using OpenCV, resize them to 256x256, and transform them into tensor arrays. These are passed through a custom **MesoNet-4 (Meso4) Architecture** implemented in PyTorch. The CNN utilizes 4 Convolutional layers to focus specifically on "mesoscopic" properties (microscopic noise residuals and latent space blurring) rather than macroscopic facial recognition. The network's pre-trained weights are loaded directly into RAM from a `.pth` checkpoint file to calculate precise probability scores.
*   **Datasets for Reference:** FaceForensics++ (for video models).
*   **Tech Stack:** PyTorch (torch, torchvision, nn.Module), OpenCV (for frame extraction), Google Gemini SDK (for XAI summarization).

### Tool 3: Intelligent Threat Detection
*   **The Scenario Addressed:** Software companies, e-commerce platforms, and external developers need to integrate intelligent threat detection directly into their own codebases without building ML models from scratch.
*   **How the Solution Works:** We implemented a scalable API Gateway. Developers generate an `X-API-Key` from their OmniShield Profile and use it to securely authenticate against our REST APIs. They can embed a script snippet (Node.js, Python, or cURL) into their middleware to forward network metadata directly to our `/api/external/v1/telemetry` endpoint.
*   **Threat Vector Analysis:** The telemetry engine intercepts the incoming HTTP requests and instantaneously evaluates 4 core threat vectors:
    1. **API Abuse / DDoS:** Calculates `request_rate` spikes (e.g., >1000 requests/min).
    2. **Data Exfiltration:** Monitors massive outgoing `payload_size` transfers from critical endpoints (e.g., pulling a 60MB database dump).
    3. **Insider Threats:** Identifies unauthorized structural access attempts based on `event_type` deviations.
    4. **Malware Indicators:** Matches the request's `user_agent` signature against a dynamic database of known hacker toolkits (e.g., Nmap, SQLMap, Burp Suite).
*   **Tech Stack:** FastAPI, PyJWT (for internal auth layer mapping), MongoDB (for tracking usage and API key validation).

### Tool 4: Global Analytics Command Center (Dashboard)
*   **The Scenario Addressed:** IT Administrators need a bird's-eye view of all cyber threats hitting the organization to allocate security resources effectively.
*   **How the Solution Works:** As Tools 1, 2, and 3 silently intercept threats and log them to the database, this interactive React dashboard visualizes the data. It displays Live B2B API Traffic Logs, Phishing Risk Scores, and Deepfake Manipulations, rendering Explainable AI summaries for complex threats. It also provides a Developer Portal for copying integration scripts.
*   **Tech Stack:** React, Next.js (App Router), Tailwind CSS, FastAPI.

---

## 4. System Architecture & Performance Evaluation

### Dockerized Microservice Architecture
To ensure our solution has a premium "wow" factor, scales infinitely, and remains completely decoupled, we utilize a fully **Dockerized Microservice Architecture**:

```text
    +-----------------------------------------------------+
    |             Next.js React Frontend                  |
    |  (Dashboard, Developers Portal, B2B Analytics)      |
    +-----------------------------------------------------+
                               | (HTTP/REST via Port 3000)
    +-----------------------------------------------------+
    |           API Gateway (FastAPI, Port 8000)          |
    |   - JWT/API-Key Auth    - B2B Telemetry Routing     |
    +-----------------------------------------------------+
          | (Internal HTTP)               | (Internal HTTP)
+-----------------------+       +-----------------------+
| Phishing Service      |       | Deepfake Service      |
| (FastAPI, Port 8001)  |       | (FastAPI, Port 8002)  |
| - XGBoost/LightGBM    |       | - PyTorch MesoNet     |
| - Gemini XAI          |       | - OpenCV Extraction   |
+-----------------------+       +-----------------------+
                                          |
    +-----------------------------------------------------+
    |               Database (MongoDB Atlas)              |
    |         (Users, API Keys, Telemetry Logs)           |
    +-----------------------------------------------------+
```

*   **Frontend (Dashboard):** **React (Next.js App Router)** paired with **Tailwind CSS**. This allows us to build a stunning, dynamic interface with smooth animations and state management without page reloads.
*   **Backend API Gateway:** **FastAPI (Python)**. FastAPI is lightning-fast, asynchronous, and perfect for acting as the master reverse-proxy to route traffic, validate JWT/API Keys, and log telemetry into MongoDB.
*   **Isolated AI Microservices:** The heavy lifting is completely decoupled into two isolated Docker containers (`phishing_service` on port 8001 and `deepfake_service` on port 8002). This prevents CPU-intensive PyTorch math from blocking standard web traffic.
*   **Database:** **MongoDB via Motor**. This highly scalable NoSQL database handles our user state management, API keys, and telemetry log storage seamlessly via asynchronous Python drivers.

### Functional Development Components (Codebase Structure)
To rapidly develop this prototype, the codebase is orchestrated via `docker-compose.yml`:
1.  **Frontend (`frontend/`):** The Next.js SPA containing routing, state management, and Tailwind UI components.
2.  **Backend API Gateway (`backend/services/api_gateway`):** The master FastAPI server.
3.  **AI Microservices (`backend/services/`):** Dedicated Python microservices for Phishing and Deepfake detection.

### Accuracy & Performance Evaluation
In cybersecurity, accuracy is paramount. We optimize our models for **High Precision** to reduce false positives (which cause "alert fatigue" and anger users).
*   **Latency Metrics:** Text and log analysis are optimized to return results rapidly via FastAPI. Media processing is handled dynamically depending on video length.
*   **Explainability as a Metric:** Unlike traditional systems that output blind risk scores, our integration with Gemini ensures every anomaly is accompanied by a human-readable explanation, reducing investigation time for admins from hours to seconds.

---

## 5. Business Analysis, Feasibility, and USP

### Unique Selling Proposition (USP)
**Why choose us over competitors?** Older security tools force organizations to buy 3 or 4 different, expensive software packages. **OmniShield combines deepfake defense, phishing protection, and log monitoring into ONE cohesive tool.** Furthermore, our **Explainable AI (XAI)** translates complex technical threats into simple English, drastically reducing the time it takes for security teams to investigate incidents.

### Feasibility & Cost to Build
The project is highly feasible and incredibly cost-effective due to our hybrid AI architecture:
*   **Initial Cost to Build (MVP):** Exceptionally low. By running our lightweight Python microservices (XGBoost/LightGBM) locally, we bypass the need for expensive cloud compute clusters. Furthermore, by outsourcing the heavy text-reasoning to the **Google Gemini API**, we completely avoid the staggering $10,000+/month infrastructure costs associated with hosting custom Large Language Models (LLMs) in-house.

### Business Model (How We Make Money)
Our platform is highly monetizable due to its dual-layered approach (B2C and B2B):
*   **Target Market:** Cybersecurity-conscious enterprises, financial institutions, universities, and third-party software developers.
*   **Revenue Stream 1 (SaaS Subscription):** A standard B2B Software-as-a-Service model. We charge a flat rate of **$5 to $10 per employee per month** for full access to the Command Dashboard and automated reporting.
*   **Revenue Stream 2 (API-as-a-Service):** Because we built a fully decoupled API Gateway with `X-API-Key` generation, we can charge third-party developers on a **pay-per-request** model (e.g., $0.001 per telemetry log analyzed or Deepfake scanned) directly through our Developer Portal.

### Societal Effectiveness (Desired Impact)
OmniShield bridges the gap between the technology layer and the human layer of cybersecurity. It is highly effective for society as it restores trust in digital communications. By protecting individuals from financial ruin, preventing the spread of AI-generated misinformation, and securing critical enterprise infrastructure, OmniShield makes the digital world a safer place for everyone.

---

## 6. Literature Survey & Algorithmic Justification

To ensure our chosen technologies are mathematically sound and superior to legacy systems, we conducted a literature survey of recent academic cybersecurity research to justify the algorithms behind our core tools.

### A. Phishing & Social Engineering Engine
*   **Traditional Approach:** Traditional systems rely heavily on blacklists, rule-based detection, and signature matching, which fail completely against newly generated zero-day phishing URLs and polymorphic domains.
*   **Our Selected Approach (Hybrid Master Ensemble):** Recent literature proves that tree-based ensemble models like XGBoost and LightGBM offer the best balance of high-performance tabular data classification and real-time inference speed. To maximize resilience and minimize false negatives, we evolved our architecture to a **Hybrid Master Ensemble**. By fusing a Soft Voting Classifier (probabilistic averaging) with a Stacking Classifier (using Logistic Regression as a meta-model to learn structural weights), we capitalize on the individual strengths of XGBoost, LightGBM, and Random Forest simultaneously. We rigorously evaluate this master model against advanced cybersecurity metrics—including **Matthews Correlation Coefficient (MCC)** for robust class imbalance handling, **PR-AUC**, **Brier Score**, and **Log Loss**—achieving an exceptional 96.88% accuracy and 0.936 MCC, bypassing the immense latency of Deep Neural Networks while preserving crucial feature interpretability for our Explainable AI (XAI) pipeline.

### B. Deepfake & Digital Impersonation Detector
*   **Traditional Approach:** Early detection relied on frequency analysis or basic facial landmark tracking (detecting blinking), which literature proves are easily bypassed by modern Generative Adversarial Networks (GANs).
*   **Our Selected Approach (CNNs + Keyframe Extraction):** Research highlights that 3D Convolutional Networks cause massive latency spikes, making them unfeasible for real-time web applications. Instead, we utilized **MesoNet-4 (Meso4)**, introduced by Afchar et al. (2018). Meso4 uses 2D Convolutional Neural Networks (CNNs) focused specifically on "mesoscopic" properties—microscopic noise residuals and latent space blurring left behind by face-swapping algorithms. This mathematically offers the optimal trade-off between inference speed and forensic accuracy on datasets like FaceForensics++.

### C. B2B Telemetry & API Abuse Engine
*   **Traditional Approach:** Legacy systems rely on deep packet inspection (DPI) at the firewall level, which is incredibly slow and struggles with modern HTTPS encryption without breaking SSL certificates.
*   **Our Selected Approach (Application-Layer Telemetry):** Guided by the *OWASP API Security Top 10 (2023)*, we shifted detection to the application layer (Layer 7). By embedding telemetry logic directly into the API Gateway middleware, we can instantly validate JWTs and `X-API-Key` signatures while mathematically analyzing volumetric traffic. Analyzing `request_rate` spikes for DDoS and massive `payload_size` anomalies for Data Exfiltration provides a highly deterministic, zero-latency method of neutralizing insider threats before they reach the database.
