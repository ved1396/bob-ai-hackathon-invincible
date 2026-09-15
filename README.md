# ⚡ GRIDGUARD AI — Power Grid Intelligence & Predictive Risk Management

An AI-powered power-grid intelligence and predictive risk management platform that combines asset telemetry, weather exposure, historical incidents, asset criticality, and grid impact to identify outage-prone equipment and recommend prioritized maintenance and crew response.

> **IBM x CHARUSAT BOB AI Innovation Hackathon 2026**  
> **Track**: AI  
> **Team**: Invincible  
> **🌐 Live Demo**: [https://gridgaurdai.vercel.app/](https://gridgaurdai.vercel.app/)  
> **📦 GitHub Repository**: [https://github.com/ved1396/bob-ai-hackathon-invincible](https://github.com/ved1396/bob-ai-hackathon-invincible)
>**📹 Demo Video**: https://www.youtube.com/watch?v=brdlT3_8OyI

---

## 👥 Team

| Field | Value |
|---|---|
| **Team Name** | Invincible |
| **Track** | AI |
| **Team Lead** | Ved Vekariya — 24DCS149 |
| **Team Members** | 1. Ved Vekariya — 24DCS149<br>2. Shlok Piprodia — 24DCS101<br>3. Mayur Patel — 24DCS077<br>4. Dhrumi Kansagara — 24DCE055 |

---
## 🖼️ Screenshots

| Photo | Description |
|---|---|
| <img src="demo/screenshots/1.png" width="400"> | **Utility Command Center** — Real-time overview of grid health, critical assets, incidents, and crew readiness. |
| <img src="demo/screenshots/2.png" width="400"> | **Bob AI Assistant** — AI-powered analysis of asset risks with operational recommendations. |
| <img src="demo/screenshots/3.png" width="400"> | **Operational Grid Risk Map** — Visualizes grid assets and their current risk levels. |
| <img src="demo/screenshots/4.png" width="400"> | **Operations Alert Console** — Centralized monitoring of critical equipment and operational alerts. |
| <img src="demo/screenshots/5.png" width="400"> | **Predictive Maintenance Queue** — Prioritized maintenance actions based on asset risk and operational impact. |

## 🎯 Problem Statement

Power transformers, substations, distribution feeders, circuit breakers, and transmission lines can develop critical failure signatures weeks before catastrophic failure occurs. However, traditional utility maintenance approaches rely heavily on fixed calendar schedules (e.g. routine 6-month or 12-month checks).

This creates several operational problems:
- **Missed Early Warning Signals**: Aging equipment under thermal or mechanical stress fails long before scheduled calendar inspections.
- **Siloed SCADA Telemetry**: Temperature, vibration, dielectric oil quality, partial discharge, and load readings remain isolated in separate supervisory tools without automated cross-correlation.
- **Ignored Environmental Weather Hazards**: Convective storm fronts, extreme wind gusts, lightning strikes, and ambient heatwaves amplify failure risks but are rarely factored into real-time asset risk scores.
- **Omission of Historical Incident Context**: Past failure patterns and frequent SCADA alarms are not evaluated alongside current live telemetry.
- **Lack of Asset Criticality Prioritization**: Maintenance queues fail to distinguish between non-critical local feeders and bulk power transmission transformers.
- **Reactive Crew Dispatch**: Repair crews are dispatched reactively after an outage occurs, increasing restoration delays and travel bottlenecks.
- **Fragmented Control-Room Operations**: Operators must manually correlate data across multiple legacy systems under pressure.

### Who Experiences the Problem?
- Utility Grid Control-Room Operators
- Maintenance Planners & Reliability Engineers
- Substation Asset Managers
- Field Repair & Rapid-Response Crews

### Consequences
- Unplanned blackouts and power outages affecting large populations
- Severe equipment damage and multi-million dollar replacement costs
- Emergency repair premiums and poor crew utilization
- Widespread commercial disruption and customer dissatisfaction

---

## 💡 Solution

**GRIDGUARD AI** is an operational command center for predictive power-grid risk management. It unifies:

$$\text{SCADA Telemetry} + \text{Weather Exposure} + \text{Historical Incidents} + \text{Asset Condition} + \text{Asset Age} + \text{Current Load} + \text{Grid Criticality} + \text{Grid Impact}$$

into one unified operational decision-support platform.

### Operational Workflow (DETECT → EXPLAIN → PRIORITIZE → ACT)

1. **Collect Asset Telemetry**: Aggregate live readings for top-oil temperature, vibration, dielectric oil breakdown, partial discharge, and load %.
2. **Combine Context**: Fuse telemetry with regional weather corridor exposure, historical incidents, asset age, and substation grid impact.
3. **Calculate Composite Risk**: Evaluate assets using a shared, deterministic risk calculation engine (0–100 score).
4. **Classify Risk Levels**: Categorize equipment as `LOW`, `MEDIUM`, `HIGH`, or `CRITICAL`.
5. **Explain Contributing Factors**: Generate transparent attribution breakdowns for thermal limit breaches, vibration harmonics, and weather surcharges.
6. **Prioritize Operational Importance**: Rank assets across the grid to identify high-risk outage zones.
7. **Recommend Preventive Maintenance**: Automatically generate risk-derived maintenance work orders.
8. **Recommend Crew Pre-Positioning**: Optimize field crew allocations based on arrival ETA, specialized skills, and nearest risk zones.
9. **Operator Approval & Execution**: Allow grid operators to review, approve, and execute maintenance and crew dispatch recommendations.
10. **Persist State to PostgreSQL**: Save all operational actions and state changes directly to PostgreSQL/Supabase.

### Implementation Risk Engine Formula

$$\text{Risk Score} = 0.30 \times S + 0.20 \times W + 0.15 \times H + 0.10 \times A + 0.10 \times L + 0.15 \times I$$

Where:
- $S$ = Sensor / SCADA risk ratio (Top-Oil Temp, Vibration, Dielectric Oil Quality)
- $W$ = Weather corridor risk surcharge (Storm front, wind speed, lightning)
- $H$ = Historical incident & SCADA anomaly risk
- $A$ = Asset age & degradation score
- $L$ = Load capacity utilization %
- $I$ = Grid consequence impact (Bulk transmission vs local distribution)

| Risk Level | Score Range | Operational Protocol |
|---|---|---|
| 🚨 **CRITICAL** | $\ge 80$ | Immediate emergency inspection, cooling check & crew pre-positioning within 24h |
| ⚠️ **HIGH** | $60 - 79$ | Priority maintenance & Dissolved Gas Analysis (DGA) within 48h |
| 🟡 **MEDIUM** | $40 - 59$ | Scheduled inspection & terminal mounting hardware tightening |
| 🟢 **LOW** | $< 40$ | Routine telemetry monitoring & baseline SCADA calibration |

---

## ✨ Key Features

### 🔴 Predictive Asset Risk Intelligence
Combines sensor telemetry, weather, historical incidents, asset condition, age, load, and grid impact into an explainable 0–100 risk score with risk level categorization.

### 🌡️ SCADA Sensor Health Monitoring
Real-time tracking of critical grid telemetry:
- **Top-Oil Temperature** (°C vs 90°C thermal safety threshold)
- **Vibration Harmonics** (mm/s vs 4.5 mm/s baseline threshold)
- **Dielectric Oil Quality** (% breakdown voltage, threshold > 80%)
- **Partial Discharge Impulse Counts** (pC)
- **Current Load Capacity** (Amps & % capacity)

### 🌩️ Weather-Aware Risk Intelligence
Dynamically incorporates atmospheric storm fronts, lightning risk, extreme heatwaves, and wind speed surcharges into asset risk calculations.

### 📊 Explainable Multi-Factor Risk Engine
Provides transparent attribution showing why an asset is at risk (e.g. *"Top-oil temperature exceeded upper thermal limit (104°C vs 90°C limit)"*).

### 🗺️ Grid Risk Visualization
Interactive geographic topology map rendering substations, transformers, distribution feeders, and storm corridor overlays with clickable diagnostic cards.

### 🛠️ Predictive Maintenance Planning
AI-prioritized work order queue allowing operators to schedule maintenance tasks, assign crews, set priorities, and track execution status.

### 👷 Crew Planning & Dispatch
Optimizes field repair crew pre-positioning based on ETA, specialized skills (HV Transformers, Oil Diagnostics, Switchgear), and nearest high-risk zone.

### 🚨 Incident & Alert Management
Logs grid anomaly alerts and outage incidents, allowing operators to acknowledge alarms and initiate response protocols.

### 🤖 IBM Bob Operational Assistant
A load-bearing operational assistant integrated into the control room workflow:
- **Queries Live Operational Data**: Accesses PostgreSQL ground-truth telemetry before answering questions.
- **Explains Risk**: Answers inquiries like *"Why is T-104 critical?"* with structured diagnostic metrics.
- **Recommends Actions**: Generates structured action recommendations (e.g. *"Emergency cooling inspection for T-104"*, *"Dispatch Crew C-07"*).
- **Operator-Approved Execution**: Renders interactive action buttons that execute DB updates upon operator click.

---

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend UI** | React 18, Vite, Tailwind CSS, Lucide React Icons, React Markdown, React Router DOM |
| **Backend REST API** | Python 3.11, FastAPI, Uvicorn, Pydantic |
| **Database & ORM** | PostgreSQL / Supabase, SQLAlchemy ORM |
| **Data Processing** | NumPy |
| **AI & Assistant** | IBM Bob Operational Assistant Layer + PostgreSQL Ground-Truth Rule Engine / Gemini REST API |
| **CI / CD Validation** | GitHub Actions (`validate.yml`) |
| **Deployment** | Vercel (Frontend Hosting) |

---

## 📁 Repository Structure

```
.
├── src/
│   ├── frontend/                 # React 18 + Vite + Tailwind CSS User Interface
│   │   ├── src/
│   │   │   ├── components/       # UI Components, Grid Topology Map, IBM Bob Chatbot Modal
│   │   │   ├── pages/            # Overview, Assets, Risk Analysis, Grid Map, Weather, etc.
│   │   │   ├── services/         # Centralized API Service Layer (api.js)
│   │   │   └── App.jsx           # React Router Application Entry Point
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── index.html
│   │
│   └── backend/                  # Python FastAPI REST API & Prediction Engine
│       ├── app/
│       │   ├── db/               # SQLAlchemy Models, PostgreSQL Connection & Seed Logic
│       │   └── services/         # Risk Engine & IBM Bob Assistant Service Layer
│       ├── main.py               # FastAPI Route Declarations & Action Handlers
│       ├── requirements.txt      # Python Package Dependencies
│       ├── seed.py               # Database Seeding Script
│       ├── schema_and_seed.sql   # Raw SQL Schema & Initial Seed Data
│       └── .env.example          # Environment Variables Template
│
├── docs/                         # Technical Documentation Suite
│   ├── problem-statement.md      # Detailed Problem Statement & Operational Impact
│   ├── solution-overview.md      # Platform Architecture & Module Breakdown
│   ├── architecture.md           # Mermaid Component & Sequence Diagrams
│   └── setup-guide.md            # Step-by-Step Judge Execution Guide
│
├── demo/                         # Demonstration Artifacts
│   ├── screenshots/              # UI Screenshot Documentation
│   ├── demo-video-link.txt       # Link to Demonstration Video
│   ├── live-demo-url.txt         # Live Hosted Application URL
│   └── README.md                 # Demo Guide
│
├── presentation/                 # Hackathon Pitch Materials
│   └── presentation.md           # 12-Slide Pitch Deck Structure
│
├── submission.yaml               # Official IBM Bob Hackathon Submission Specification
├── README.md                     # Master Repository Documentation
├── CONTRIBUTING.md               # Contribution & Code Guidelines
├── .gitignore                    # Git Exclusion Rules
└── .github/
    └── workflows/
        └── validate.yml          # GitHub Actions Automated CI Validation Workflow
```

---

## ⚡ How to Run

### 1. Backend Setup (FastAPI)

```bash
# Navigate to backend directory
cd src/backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# macOS / Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create environment configuration file
copy .env.example .env

# Configure your PostgreSQL connection string in .env:
# DATABASE_URL=postgresql://user:password@host:5432/dbname

# Start FastAPI backend server on port 8000
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 2. Frontend Setup (React + Vite)

```bash
# Open a new terminal and navigate to frontend directory
cd src/frontend

# Install Node dependencies
npm install

# Start Vite dev server on port 5173
npm run dev
```

### Access Local Endpoints
- **Frontend App**: [http://localhost:5173](http://localhost:5173) *(or http://localhost:3000)*
- **Backend API**: [http://localhost:8000](http://localhost:8000)
- **Interactive API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🌐 Deployment

- 🌐 **Live Demo Frontend**: [https://gridgaurdai.vercel.app/](https://gridgaurdai.vercel.app/)
- 📦 **GitHub Repository**: [https://github.com/ved1396/bob-ai-hackathon-invincible](https://github.com/ved1396/bob-ai-hackathon-invincible)

*(Note: The frontend is deployed to Vercel. Full backend interactive execution and database persistence run via local FastAPI backend or connected PostgreSQL instance.)*

---

## 🖥️ Demo

| Resource | Location | Description |
|---|---|---|
| 📹 **Demo Video** | `demo/demo-video-link.txt` | 3-Minute Video Demonstration |
| 🌐 **Live Demo** | `https://gridgaurdai.vercel.app/` | Deployed Frontend Application |
| 🖼️ **Screenshots** | `demo/screenshots/` | UI Screenshot Gallery |
| 📊 **Presentation** | `presentation/presentation.md` | 12-Slide Pitch Deck |

---

## ⚠️ Known Limitations

1. **SCADA Telemetry Simulation**: The current prototype reads SCADA sensor data from a PostgreSQL time-series table rather than a direct physical utility DNP3/IEC-61850 protocol gateway.
2. **Weather Corridor Dataset**: Atmospheric storm fronts are represented through regional weather corridor integration tables.
3. **Enterprise Authentication**: Production utility deployment would require SAML/OAuth SSO, role-based access controls (RBAC), and audit logging.
4. **Human-in-the-Loop Safeguards**: Operational maintenance creation and crew dispatch actions intentionally require explicit operator approval before database execution.

---

## 🏅 What We're Most Proud Of

**GRIDGUARD AI does not stop at predicting risk. It connects prediction to action.**

1. **End-to-End Operational Workflow (DETECT → EXPLAIN → PRIORITIZE → ACT)**: We built a system that bridges the gap between raw ML predictions and actionable control-room decision-making.
2. **Explainable Risk Science**: Rather than presenting a black-box probability number, GridGuard provides transparent attribution explaining exact thermal, mechanical, dielectric, and weather causes.
3. **Load-Bearing IBM Bob Integration**: IBM Bob is not a decorative chatbot. It accesses PostgreSQL ground-truth telemetry, generates structured diagnostic metrics, and provides interactive action buttons that allow operators to execute work orders and crew dispatches directly into PostgreSQL.
4. **Single Source of Truth**: All CRUD operations, risk scores, maintenance tasks, crew statuses, and alerts persist to PostgreSQL/Supabase.
