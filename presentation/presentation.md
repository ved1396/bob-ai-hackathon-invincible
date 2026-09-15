# Presentation: GRIDGUARD AI
## IBM Bob Hackathon Final Pitch Deck

---

### Slide 1: Title Slide
- **Project Name**: GRIDGUARD AI
- **Subtitle**: Power Outage Prediction & Grid Equipment Failure Advisor
- **Team**: Invincible
- **Track**: Grid Infrastructure & Operational AI

---

### Slide 2: The Problem
- **Grid Vulnerability**: Unplanned transformer & substation breakdowns cause major blackouts, emergency costs, and public disruption.
- **Flawed Maintenance**: Utilities rely on calendar intervals (e.g. 6-12 months) despite assets generating continuous health signals.
- **Siloed Telemetry & Weather Ignored**: SCADA sensor signals (temp, vibration, oil quality) are isolated from weather storm front forecasts.

---

### Slide 3: The Solution — GRIDGUARD AI
- An **operational intelligence platform** that unifies asset telemetry, weather intelligence, historical incident logs, asset age, load, and grid impact.
- **Real-Time Predictive Risk Engine**: Calculates failure probability and ranks grid assets by composite risk.
- **Load-Bearing IBM Bob Assistant**: Grounded in PostgreSQL telemetry, providing diagnostic explanations and executable operational actions.

---

### Slide 4: Multi-Factor Risk Calculation Engine
- Composite Risk Formula:
  $$\text{Risk Score} = 0.30 \cdot S + 0.20 \cdot W + 0.15 \cdot H + 0.10 \cdot A + 0.10 \cdot L + 0.15 \cdot I$$
- Risk Levels: `CRITICAL` ($\ge 80\%$), `HIGH` ($60\%-79\%$), `MEDIUM` ($40\%-59\%$), `LOW` ($< 40\%$).
- Explainable Attributions: Pinpoints top-oil temp limit breaches, vibration harmonics elevation, and storm loading.

---

### Slide 5: Real-Time SCADA Telemetry & Sensor Health
- Continuous monitoring of:
  - Top-Oil Temperature (°C vs 90°C threshold)
  - Vibration Harmonics (mm/s vs 4.5 mm/s threshold)
  - Dielectric Oil Breakdown Quality (% breakdown voltage)
  - Partial Discharge Impulse Counts (pC)
  - Load Capacity Utilization (%)

---

### Slide 6: Atmospheric Weather Corridor Intelligence
- Direct integration of severe storm front corridors (Zone 4 storm front, Zone 2 high wind).
- Weather severity applies real-time surcharges to failure probabilities on exposed substation corridors.

---

### Slide 7: Interactive Grid Topology Map
- Geographic visualization of substations, feeder lines, transformers, and storm corridors.
- Clickable nodes with instant risk score breakdown, health telemetry, grid impact, and prescribed action cards.

---

### Slide 8: Predictive Maintenance & Crew Optimization
- **Work Order Queue**: AI-prioritized work orders generated directly from asset risk.
- **Proactive Crew Pre-Positioning**: Optimizes crew dispatch based on ETA, specialized skills (HV Transformers, Oil Sampling), and high-risk outage zones.

---

### Slide 9: IBM Bob Operational Assistant Integration
- **Ground-Truth Data**: Queries live PostgreSQL telemetry to answer complex diagnostic inquiries.
- **Executable Operator Actions**: Provides interactive action buttons in chat to create work orders and dispatch crews.
- **Operator Approval Flow**: Actions require operator confirmation and persist directly to PostgreSQL.

---

### Slide 10: System Architecture & Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Responsive Layouts.
- **Backend**: Python 3.11, FastAPI, SQLAlchemy, Uvicorn.
- **Database**: PostgreSQL / Supabase (Single Persistent Source of Truth).

---

### Slide 11: Live Operational Demo Workflow
1. Operator views Grid Reliability Dashboard (92.4% health).
2. Operator registers new transformer `T-406` via UI -> Persisted to PostgreSQL.
3. Operator asks Bob: *"Why is T-104 critical?"* -> Bob retrieves live telemetry and explains thermal breach (104°C) & vibration (7.8mm/s).
4. Operator clicks Bob action button *"Pre-Position Crew C-07"* -> Crew status updated in PostgreSQL.

---

### Slide 12: Business Impact & Future Scope
- **Impact**: Reduces unplanned transformer outages by up to 45%, decreases emergency restoration ETA, and extends grid asset lifespan.
- **Future Scope**: Autonomous SCADA switching control, IoT edge sensor integration, and regional utility interconnect mesh.
