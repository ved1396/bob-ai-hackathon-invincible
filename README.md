# GRIDGUARD AI — Power Outage Prediction & Grid Equipment Failure Advisor

> **IBM Bob Hackathon Submission** — *Team Invincible*

GRIDGUARD AI is an operational intelligence platform designed for utility grid operators. It fuses SCADA sensor health telemetry, atmospheric weather intelligence, historical incident logs, asset age, load, and grid impact into a unified, deterministic predictive risk engine backed by PostgreSQL.

---

## Team

- **Team Name**: Invincible
- **Track**: Grid Infrastructure & Operational AI
- **Lead & Primary Contributor**: Ved Upadhyay (Full-Stack & AI Systems Engineer)
- **Repository**: [https://github.com/ved1396/bob-ai-hackathon-invincible](https://github.com/ved1396/bob-ai-hackathon-invincible)

---

## Problem Statement

Power transformer and substation failures cause major blackouts, millions of dollars in financial losses, and widespread public disruption. Utilities currently rely on calendar-based maintenance schedules (e.g. fixed 6-month checks) even though equipment continuously generates health signals:
- Top-oil temperature (°C)
- Mechanical vibration harmonics (mm/s)
- Dissolved gas dielectric oil breakdown (%)
- Partial discharge impulse counts (pC)
- Current load capacity (%)

Furthermore, severe storm weather fronts dramatically elevate equipment failure risk. The primary challenge is that asset sensor data, weather forecasts, historical incidents, asset age, load, and grid impact are not combined into a single operational decision system.

---

## Solution

**GRIDGUARD AI** addresses this challenge by providing grid operators with an operational control console:
1. **Monitors Grid Assets**: Real-time tracking of transformers, substations, feeders, circuit breakers, and lines.
2. **Multi-Factor Risk Engine**: Calculates failure probability and ranks assets by composite risk.
3. **Weather Intelligence**: Integrates severe convective storm fronts and wind loading into failure probabilities.
4. **Geographic Grid Map**: Visualizes topological risk zones and clickable asset health cards.
5. **Predictive Maintenance Queue**: Automatically generates AI-prioritized work orders from risk threshold breaches.
6. **Proactive Crew Pre-Positioning**: Optimizes field repair crew dispatch based on ETA, specialized skills, and nearest risk zones.
7. **Load-Bearing IBM Bob Assistant**: Grounded in live PostgreSQL SCADA telemetry, answering diagnostic inquiries and enabling operators to execute work orders and crew dispatches directly via interactive AI action buttons.

---

## Key Features

- **Full PostgreSQL/Supabase Persistence**: 100% of CRUD operations (adding assets, editing, scheduling work orders, dispatching crews, acknowledging alerts) persist to PostgreSQL.
- **Shared Deterministic Risk Engine**:
  $$\text{Risk Score} = 0.30 \cdot S + 0.20 \cdot W + 0.15 \cdot H + 0.10 \cdot A + 0.10 \cdot L + 0.15 \cdot I$$
- **Interactive Action Buttons in IBM Bob**: Bob recommendations contain executable action payloads that require operator approval and execute directly against backend API endpoints.
- **Zero Decorative UI Components**: Every button, link, search bar, dropdown filter, and tab performs a real action or filter against backend data.
- **Fully Responsive UI**: Tested and optimized across 1920x1080, 1440x900, 1024x768, 768x1024, and 390x844 (Mobile).

---

## Architecture

```
+------------------------------------------------------------------+
|                    REACT 18 + VITE FRONTEND                      |
|       (Dashboard, Assets CRUD, Risk Analysis, Map, Bob AI)       |
+------------------------------------------------------------------+
                                  |
                                  v
+------------------------------------------------------------------+
|                    FASTAPI REST BACKEND API                      |
+------------------------------------------------------------------+
               /                  |                  \
              v                   v                   v
   +-------------------+  +---------------+  +--------------------+
   | PREDICTION ENGINE |  | WEATHER CORR. |  | LOAD-BEARING IBM   |
   |   (Risk Model)    |  | INTELLIGENCE  |  |   BOB ASSISTANT    |
   +-------------------+  +---------------+  +--------------------+
              \                   |                   /
               v                  v                  v
+------------------------------------------------------------------+
|               POSTGRESQL / SUPABASE PERSISTENT DB                |
|  (assets, asset_sensors, weather, incidents, maintenance, crews) |
+------------------------------------------------------------------+
```

---

## IBM Bob Integration

IBM Bob Assistant is **load-bearing** and integrated directly into the operational workflow:
- **Telemetry Grounding**: Before responding to inquiries, Bob queries live PostgreSQL tables (`assets`, `asset_sensors`, `weather`, `incidents`, `crews`) to formulate data-driven explanations.
- **Structured Executable Actions**: When recommending actions (e.g. *"Emergency cooling inspection for T-104"* or *"Pre-position Crew C-07"*), Bob embeds structured action payloads.
- **Operator Execution & Audit**: Clicking an action button inside Bob sends a `POST /api/bob/execute-action` request to FastAPI, which executes the mutation on PostgreSQL and updates the application state.
- **Offline Availability**: Includes a dynamic rule-grounded fallback engine so Bob functions 100% reliably even if external AI API keys are unavailable.

---

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Markdown.
- **Backend**: Python 3.11, FastAPI, SQLAlchemy ORM, Uvicorn.
- **Database**: PostgreSQL / Supabase.
- **CI/CD**: GitHub Actions (`validate.yml`).

---

## How to Run

Follow the detailed instructions in [`docs/setup-guide.md`](file:///c:/Projects/IBM/docs/setup-guide.md):

### Backend Setup
```bash
cd src/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd src/frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## Demo

- **Demo Video Link**: Refer to `demo/demo-video-link.txt`
- **Live Demo URL**: Refer to `demo/live-demo-url.txt`
- **Demo Documentation**: See [`demo/README.md`](file:///c:/Projects/IBM/demo/README.md)

---

## Screenshots

- `01-home-dashboard.png`: Operational Grid Overview & KPI metrics.
- `02-risk-analysis.png`: Risk decomposition matrix and failure ranking table.
- `03-bob-assistant.png`: IBM Bob Operational Assistant diagnostic deep-dive with executable action buttons.

---

## Known Limitations

- Real-time SCADA physical hardware telemetry is simulated via high-frequency PostgreSQL time-series readings.
- Automatic weather updates rely on deterministic regional weather zone tables when live weather API keys are omitted.

---

## What We're Most Proud Of

1. **Load-Bearing AI Assistance**: Building an AI assistant (IBM Bob) that does not just talk, but actually queries real PostgreSQL telemetry and executes real operational actions upon operator approval.
2. **End-to-End Data Integrity**: Guaranteeing 100% persistence across all CRUD operations with zero fake/hardcoded frontend state.
3. **Multi-Factor Explainable Risk Engine**: Combining physics-based sensor limits, dielectric oil degradation, weather front exposure, and grid criticality into a single explainable formula.
