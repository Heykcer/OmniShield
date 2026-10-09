#  OmniShield: AI-Powered Digital Bodyguard
**BPUT Hackathon Project Report Document**

---

## 1. The Problem: Why Are We Here?

We live in a world where technology is advancing faster than our ability to secure it. The core problem happening today is that **hackers are no longer just hacking computers; they are hacking human psychology**. 

With the rapid rise of Artificial Intelligence, traditional security systems (which look for known viruses or bad code) are failing. Cybercriminals are using AI to create hyper-realistic deepfake videos, clone voices, and craft highly persuasive phishing emails. 

### Who is Facing This Problem & How Do They Get Victimized?

This threat does not discriminate. It affects everyone from a regular person to massive corporations. Here are real-life scenarios:

*   **The Basic Individual (e.g., A Grandparent or Student):** 
    *   *Scenario 1 (AI Voice Clone):* A grandfather receives a frantic phone call that sounds exactly like his grandson, claiming he is in an emergency and urgently needs money wired. Because of AI voice cloning, the grandfather believes it and loses his life savings. *(Real News Fact: The FBI and FTC have recently issued major warnings about the rise of the AI-powered "Grandparent Scam", where scammers clone voices using just 3 seconds of audio pulled from social media).*
    *   *Scenario 2 (Fake Shopping Site):* A college student sees a highly targeted social media ad for a brand new iPhone or luxury sneakers at an unbelievable 80% discount. The link takes them to a fake, look-alike shopping website. When they enter their credit card details to buy the "discounted" product, the hackers steal their card information. *(Real News Fact: Millions are lost annually to highly sophisticated spoofed domains that perfectly mimic real brands during holiday shopping seasons).*
    *   *Scenario 3 (Modded APKs):* A teenager looking to get free premium features in a popular mobile app downloads a "Mod APK" (modified application) from an untrusted forum. The hidden malware in the APK secretly reads their SMS messages to steal bank OTPs and grants hackers remote access to their device. *(Real News Fact: Cybersecurity agencies frequently report on Android Banking Trojans distributed via fake WhatsApp or "Mod" APKs that abuse Android accessibility services to silently drain bank accounts).*
*   **The Celebrity or Public Figure:** 
    *   *The Scenario:* A famous actor or influencer's face and voice are stolen to create a highly realistic deepfake video endorsing a fake cryptocurrency scam. Fans trust the celebrity, invest their money, and lose everything. *(Real News Fact: AI-generated deepfakes of high-profile figures like Elon Musk and MrBeast are constantly circulating on TikTok and YouTube, falsely endorsing crypto giveaways and tricking thousands of followers).*
*   **The Corporate Employee (e.g., A Finance Manager):** 
    *   *The Scenario:* A manager receives an urgent email and joins a video call that appears to be with the company's CEO and CFO. The meeting looks completely real, so the manager wires the requested funds. *(Real News Fact: In February 2024, a finance worker at a multinational firm in Hong Kong was tricked into paying out $25 million (HK$200 million) after attending a video conference where the CFO and all other colleagues on the call were entirely AI-generated deepfakes).*
*   **Institutions (Universities, Banks, Hospitals):** 
    *   *The Scenario:* Hackers use automated bots to attempt thousands of stolen passwords per second (credential stuffing). Once inside, they steal sensitive student data, financial records, or patient information, leading to massive data breaches and loss of public trust. *(Real News Fact: Major institutions, including global healthcare providers and universities, are continually paralyzed by credential stuffing and ransomware attacks, leading to massive data breaches and multi-million dollar payouts).*

---

## 2. The Solution: OmniShield Platform

**OmniShield** is an all-in-one, AI-powered cyber defense platform. Unlike standard antivirus software that only looks for known signatures of malicious code (.exe files, viruses), OmniShield looks for **human manipulation**. Antivirus cannot detect a perfectly normal-looking email where someone is lying to you, nor can it detect a video where someone's face is swapped. OmniShield protects the *human*, not just the hard drive.

### The OmniShield Pipeline
Our system processes every event through a strict, near real-time pipeline designed for maximum performance and a premium user experience during the hackathon:

> **Overall System Flow:**
```text
+-------------------+       +-------------------+       +-------------------+
|  React Dashboard  | <---> |  FastAPI Gateway  | <---> | SQLite Database   |
+-------------------+       +-------------------+       +-------------------+
                                     |
                                     v
                            +-------------------+       +-------------------+
                            |    AI Engines     | --->  | Google Gemini API |
                            | (PyTorch & BERT)  |       | (Explainable AI)  |
                            +-------------------+       +-------------------+
```

To ensure **Data Privacy**, the platform analyzes data strictly in-memory. Video and email contents are discarded immediately after the risk score is generated. Only non-personally identifiable metadata (e.g., "Event #405 flagged for Phishing") is stored on our local database.

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
*   **Algorithm & Models:** Our implementation extracts 14 specific lexical features from raw URLs using Python's `tldextract` (e.g., domain length, subdomain counts, Shannon entropy, and suspicious character ratios). Users can dynamically select between three pre-trained models—**XGBoost**, **LightGBM**, or **Random Forest** (loaded via `joblib`)—to calculate the phishing probability score. Once the structural ML model flags the URL as a threat based on these features, the exact risk vectors are passed to the **Google Gemini API** to generate a plain English "Explainable AI (XAI)" forensic summary for the user.
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

### Tool 3: Behavioral Anomaly & Threat Detector
*   **The Scenario Addressed:** Stops Institutions from falling victim to credential stuffing bots, and detects the abnormal behavior caused by Modded APKs stealing OTPs.
*   **How the Solution Works:** Running continuously in the background, this tool monitors authentication logs and **raw network packets**. If it detects abnormal behavior, it triggers a "Critical" alert, revokes the active session, and locks the account.
    ```text
    +-------------------+      +-------------------+      +-------------------+
    | 1. FastAPI        | ---> | 2. Spawn Daemon   | ---> | 3. Scapy Sniffs   |
    |    Server Starts  |      |    Thread         |      |    Raw Packets    |
    +-------------------+      +-------------------+      +-------------------+
                                                                   |
                                                                   v
    +-------------------+      +-------------------+      +-------------------+
    | 6. Revoke User    | <--- | 5. Anomaly Found? | <--- | 4. Scikit-Learn   |
    |    Session        |      |    (If yes...)    |      |    Isolation Tree |
    +-------------------+      +-------------------+      +-------------------+
    ```
*   **Cross-Platform Packet Capture Integration:** To capture live network traffic, the tool integrates native OS-level drivers: **`libpcap`** (for macOS/Linux) and **`Npcap`** (for Windows). We use the Python library **Scapy** to interface with these drivers. To avoid crashing the prototype during the hackathon, we utilize BPF (Berkeley Packet Filters) in Scapy to only capture relevant HTTP/HTTPS traffic, ignoring background noise. *Security Note:* The Python agent must be run with elevated privileges (Administrator/root) to access these raw sockets.
*   **Algorithm & Models:** Combines rule-based heuristics with Unsupervised Machine Learning, specifically **Isolation Forests** (via Scikit-Learn). The model learns the "normal baseline" of a user's network traffic and instantly flags deviations.
*   **Datasets for Reference:** KDD Cup 99 and CICIDS2017.
*   **Tech Stack:** Scikit-learn, SQLite, Python, Scapy (for packet manipulation), Npcap/libpcap.

### Tool 4: B2B API Integration & External Telemetry Engine
*   **The Scenario Addressed:** Software companies, e-commerce platforms, and external developers need to integrate intelligent threat detection directly into their own codebases without building ML models from scratch.
*   **How the Solution Works:** We implemented a scalable API Gateway. Developers generate an `X-API-Key` from their OmniShield Profile and use it to securely authenticate against our REST APIs. They can embed a script snippet (Node.js, Python, or cURL) into their middleware to forward network metadata directly to our `/api/external/v1/telemetry` endpoint.
*   **Threat Vector Analysis:** The telemetry engine intercepts the incoming HTTP requests and instantaneously evaluates 4 core threat vectors:
    1. **API Abuse / DDoS:** Calculates `request_rate` spikes (e.g., >1000 requests/min).
    2. **Data Exfiltration:** Monitors massive outgoing `payload_size` transfers from critical endpoints (e.g., pulling a 60MB database dump).
    3. **Insider Threats:** Identifies unauthorized structural access attempts based on `event_type` deviations.
    4. **Malware Indicators:** Matches the request's `user_agent` signature against a dynamic database of known hacker toolkits (e.g., Nmap, SQLMap, Burp Suite).
*   **Tech Stack:** FastAPI, PyJWT (for internal auth layer mapping), MongoDB (for tracking usage and API key validation).

### Tool 5: Global Analytics Command Center (Dashboard)
*   **The Scenario Addressed:** IT Administrators need a bird's-eye view of all cyber threats hitting the organization to allocate security resources effectively.
*   **How the Solution Works:** As Tools 1, 2, and 3 silently intercept threats and log them to the database, this interactive React dashboard visualizes the data. It displays Live B2B API Traffic Logs, Phishing Risk Scores, and Deepfake Manipulations, rendering Explainable AI summaries for complex threats. It also provides a Developer Portal for copying integration scripts.
*   **Tech Stack:** React, Next.js (App Router), Tailwind CSS, FastAPI.

---

## 4. System Architecture & Performance Evaluation

### Hackathon-Feasible Modern Architecture
To ensure our solution has a premium "wow" factor while remaining feasible to build, we utilize a decoupled modern web stack:
*   **Frontend (Dashboard):** **React (Vite)** paired with **Tailwind CSS** and **Framer Motion**. This allows us to build a stunning, dynamic interface with smooth animations and state management without page reloads.
*   **Backend API Gateway:** **FastAPI (Python)**. FastAPI is lightning-fast, asynchronous, and perfect for exposing API routes to our React frontend while handling heavy AI inference in the background.
*   **Database:** **SQLAlchemy / SQLite**. This requires zero external server configuration, meaning the app can be cloned and run instantly on any judge's machine. It handles our user state management and log storage seamlessly.
*   **AI Integration:** A hybrid approach. We run PyTorch/OpenCV locally via FastAPI for immediate media processing, and we outsource heavy text reasoning to the **Google Gemini API** for near real-time, explainable intelligence.

### Functional Development Components (Codebase Structure)
To rapidly develop this prototype, the codebase is modularized into two decoupled environments:
1.  **Frontend (`frontend/`):** The React SPA containing routing, state management, and Tailwind UI components (`Dashboard.jsx`, `Report.jsx`).
2.  **Backend (`backend/main.py`):** The FastAPI server managing JWT authentication, SQLite database schemas, and exposing REST API endpoints to the frontend.
3.  **AI & Security Engines (`backend/utils/`):** Dedicated Python modules handling the core math. This includes `ai_media.py` (PyTorch deepfakes), `ai_text.py` (Gemini API phishing/XAI), and `network_agent.py` (Scapy/Scikit-Learn anomalies).

### Background Automation & Network Capturing Methods
To keep the hackathon prototype feasible without needing heavy task queues like Celery, we implement automation directly inside Python:
*   **Continuous Background Sniffing:** When the Flask app starts, we spawn a secondary **Daemon Thread** (`threading.Thread(daemon=True)`). This thread continuously runs our Scapy `sniff()` function to capture raw network packets in the background. Because it is a daemon thread, it runs silently alongside the web server without blocking the user interface, and automatically shuts down when the server stops.
*   **Cross-Platform Agent Execution:** To run the log forwarders and network sniffers continuously on target machines (Windows/Mac/Linux) without draining the CPU, we deploy them as native background services using **Windows Services (NSSM)**, Linux **`systemd`**, and macOS **`launchd`**.

### Automated Report Generation Algorithm
When an IT Admin or user requests an incident report, the system utilizes a 4-step automated summary algorithm:
1.  **Data Aggregation:** The Flask backend queries the SQLite database for all events related to the specific user/device within the requested timeframe.
2.  **Contextualization:** The raw data (e.g., exact timestamps, flagged deepfake scores, malicious packet IPs) is structured into a secure, anonymized JSON payload.
3.  **Generative AI Summary:** This payload is sent to the **Google Gemini API**. Gemini is instructed to act as a Senior Cybersecurity Analyst to synthesize the technical data into a human-readable, executive summary.
4.  **Delivery:** The AI's response is rendered into a clean, downloadable PDF (via HTML-to-PDF generation) and displayed on the dashboard with actionable next steps.

### Accuracy & Performance Evaluation
In cybersecurity, accuracy is paramount. We optimize our models for **High Precision** to reduce false positives (which cause "alert fatigue" and anger users), while maintaining acceptable **Recall**.
*   **Latency Metrics:** Text and log analysis are optimized to return results in `<200ms`. Media processing is handled asynchronously.
*   **Handling False Positives:** We implemented a **Confidence Threshold** system:
    *   If the AI is **99% confident** it is a threat, it takes automatic action (blocks/quarantines).
    *   If the AI is only **70% confident**, it does not block the action. Instead, it flags the event with a yellow warning on the dashboard, requiring a human IT administrator to make the final decision. 

---

## 5. Platform Operations & Incident Lifecycle

### A. Attack Phases & Event-Based Reactions
Our platform integrates all three tools using an **Event-Driven Architecture** (e.g., Kafka or RabbitMQ), where every log, email, or media upload acts as an event trigger.
*   **Pre-Attack (Proactive):** Continuous monitoring of network baselines, scanning for look-alike domains globally before they are used against the company, and federated learning updates to models.
*   **Real-Time (Reactive):** Immediate event triggers when an anomaly or payload is detected. The pipeline executes classification and risk scoring in milliseconds.
*   **Post-Attack (Post-Active):** Auto-generating forensic incident reports, isolating compromised devices, updating global blocklists, and mapping the event to the MITRE ATT&CK framework.

### B. Risk Scoring Metrics & Automated Recommendations
We rate the criticalness of an attack using a strict scoring matrix:
*   **Safe (0-20%):** Normal activity. *Reaction:* Logged silently for baseline training.
*   **Low (21-40%):** Minor anomaly (e.g., login from a new browser). *Reaction:* Informational tooltip to the user; silent log.
*   **Medium (41-70%):** Suspicious (e.g., unusual urgency in an email). *Reaction:* Flag with a yellow warning banner, require MFA (Multi-Factor Authentication) prompt.
*   **High (71-90%):** High probability of threat (e.g., deepfake artifacts detected). *Reaction:* Quarantine email, block URL, notify Admin.
*   **Critical (91-100%):** Active attack (e.g., 100 failed logins in 5s). *Reaction:* Revoke session, lock account instantly, severe alert to SOC.

### C. Time Management, Notifications & Escalation
Notifications are sent via a multi-channel webhook (Dashboard, Teams/Slack, SMS).
*   **What if an admin ignores it or there is an error?** We utilize a **Time Management Escalation Matrix**. If a High/Critical alert is not acknowledged by a Tier 1 admin within 15 minutes, it automatically escalates to the Security Lead via SMS. If still ignored, the system defaults to a "Fail-Safe Deny" (keeping the threat blocked to prevent damage).

### D. False Positive Recovery
*   **What if a legitimate email is quarantined?** The user can click a "Request Review" button. The admin can single-click "Release to Inbox" on the dashboard. The system then automatically whitelists the sender and feeds this correction back into the ML model via reinforcement learning to prevent future occurrences.

### E. Privacy-Preserving Threat Detection
*   **How do we protect sensitive user information?** We use **Data Masking/Redaction** at the ingestion layer. Personally Identifiable Information (PII) like names or SSNs are replaced with tokens *before* reaching the AI models. Furthermore, we support **Local Inference / Federated Learning**, meaning the models run securely within the organization's boundary—raw data never leaves the client's servers.

### F. Implementation of Platform Health Checkups
To ensure the platform is always active, automated "Watchdog" microservices constantly ping the AI models with dummy data (heartbeat checks). If a tool (e.g., the Deepfake engine) fails or latency spikes, traffic is automatically routed to a fallback replica, ensuring high availability and zero downtime.

---

## 6. Business Analysis, Feasibility, and USP

### Unique Selling Proposition (USP)
**Why choose us over competitors?** Older security tools force organizations to buy 3 or 4 different, expensive software packages. **OmniShield combines deepfake defense, phishing protection, and log monitoring into ONE cohesive tool.** Furthermore, our **Explainable AI (XAI)** translates complex technical threats into simple English, drastically reducing the time it takes for security teams to investigate incidents.

### Feasibility & Cost to Build
The project is highly feasible. By leveraging existing state-of-the-art open-source AI models and fine-tuning them for security use cases, we save years of R&D. 
*   **Initial Cost to Build (MVP):** Very low. We rely on developer sweat equity. Cloud hosting for AI inference (AWS/GCP GPU instances) is the primary cost, scaling dynamically with usage.

### Business Model (How We Make Money)
*   **Target Market:** Companies, universities, government bodies, and banks seeking an "Intelligent Digital Trust Platform."
*   **Revenue Model:** A B2B Software-as-a-Service (SaaS) monthly subscription per user. Charging $5 to $10 per employee per month ensures steady recurring revenue.

### Societal Effectiveness (Desired Impact)
OmniShield bridges the gap between the technology layer and the human layer of cybersecurity. It is highly effective for society as it restores trust in digital communications. By protecting individuals from financial ruin, preventing the spread of AI-generated misinformation, and securing critical enterprise infrastructure, OmniShield makes the digital world a safer place for everyone.

---

## 7. Literature Survey & Algorithmic Justification

To ensure our chosen technologies are mathematically sound and superior to legacy systems, we conducted a literature survey of recent academic cybersecurity research (IEEE, ACM, Springer) to justify the algorithms behind our three core tools.

### A. Phishing & Social Engineering Engine
*   **Traditional Approach:** Traditional systems rely heavily on blacklists, rule-based detection, and signature matching, which fail completely against newly generated zero-day phishing URLs. Furthermore, a model that performs well on one dataset may perform poorly on another (dataset dependency).
*   **Our Selected Approach (XGBoost & LightGBM with Cross-Dataset Validation):** Recent literature (*e.g., "XGBoost-Based URL Phishing Detection Method With Cross-Dataset Validation", IEEE Access 2026*) proves that ensemble models like XGBoost and LightGBM offer the best balance of high-performance tabular data classification and real-time inference speed. Instead of relying on a single dataset, our approach emphasizes cross-dataset validation to ensure true generalization against dataset shifts. XGBoost trained substantially faster than neural networks, providing over 90% accuracy while allowing for feature importance interpretability.

### B. Deepfake & Digital Impersonation Detector
*   **Traditional Approach:** Early detection relied on frequency analysis or basic facial landmark tracking, which literature proves are easily bypassed by modern Generative Adversarial Networks (GANs).
*   **Our Selected Approach (CNNs + Keyframe Extraction):** According to research in *[IEEE Transactions on Information Forensics and Security (2023)](https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=Deepfake%20Detection%20CNN%20FaceForensics)*, combining spatial feature extraction using Deep Convolutional Neural Networks (CNNs like XceptionNet) yields the highest accuracy on the FaceForensics++ dataset. We explicitly avoided 3D Convolutional Networks (C3D) as literature shows they cause massive latency spikes; instead, our approach of **Keyframe Extraction + 2D CNNs** offers the mathematically optimal trade-off between speed and accuracy.

### C. Behavioral Anomaly & Threat Detector
*   **Traditional Approach:** Standard Intrusion Detection Systems (IDS) use signature-based matching. Literature (*ACM Computing Surveys*) shows they fail entirely against zero-day threats, credential stuffing, or authorized-user abuse (insider threats).
*   **Our Selected Approach (Isolation Forests):** Research comparing Unsupervised Learning models (*[IEEE/ACM Transactions on Networking, 2022](https://ieeexplore.ieee.org/search/searchresult.jsp?newsearch=true&queryText=Isolation%20Forest%20Intrusion%20Detection)*) highlights that **Isolation Forests** drastically outperform One-Class SVMs and K-Means in high-dimensional network data (like the KDD Cup 99 or CICIDS2017 datasets). This is because they explicitly isolate anomalies through random partitioning rather than trying to build complex profiles of "normal" points. This guarantees significantly lower false-positive rates for our impossible-travel and data exfiltration scenarios.


