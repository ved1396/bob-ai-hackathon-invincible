# Solution Overview: GRIDGUARD AI Platform

## Architecture & System Purpose

GRIDGUARD AI is an operational intelligence platform designed specifically for electrical grid control room operators. It bridges the gap between raw SCADA sensor data and real-time operational decision-making.

```
                      +----------------------------------+
                      |   GRIDGUARD AI REACT FRONTEND    |
                      | (Dashboard, Map, Risk, Bob Chat) |
                      +----------------------------------+
                                       |
                                       v
                      +----------------------------------+
                      |     FASTAPI REST BACKEND API     |
                      +----------------------------------+
                                /              \
                               v                v
                 +-------------------+   +--------------------+
                 | MULTI-FACTOR RISK |   |  LOAD-BEARING IBM  |
                 | PREDICTION ENGINE |   |   BOB ASSISTANT    |
                 +-------------------+   +--------------------+
                                \              /
                                 v            v
                      +----------------------------------+
                      |    POSTGRESQL / SUPABASE DB      |
                      +----------------------------------+
```

## Core Modules & Capabilities

### 1. SCADA Asset Health Telemetry & CRUD Management
- Real-time tracking of transformers, substations, distribution feeders, circuit breakers, and transmission lines.
- Complete CRUD operations persisting directly to PostgreSQL (Add Asset, Edit, Deactivate/Delete).
- Automatic generation of baseline sensor health telemetry (`temperature`, `vibration`, `oil quality`, `partial discharge`) and historical sensor readings upon asset creation.

### 2. Multi-Factor Risk Calculation Engine
The system employs a deterministic, explainable composite risk model:

$$\text{Composite Risk Score} = 0.30 \cdot S + 0.20 \cdot W + 0.15 \cdot H + 0.10 \cdot A + 0.10 \cdot L + 0.15 \cdot I$$

Where:
- $S$: Sensor Risk Ratio (Top-Oil Temp, Vibration, Dielectric Oil Quality)
- $W$: Regional Weather Corridor Surcharge (Wind Speed, Lightning Risk, Temp)
- $H$: Historical Incident & SCADA Anomaly Count
- $A$: Asset Operational Age Ratio
- $L$: Transformer Load Capacity Percentage
- $I$: Grid Consequence Impact (Bulk Power 345kV vs Local Distribution)

Risk levels are categorized into:
- **CRITICAL** ($\ge 80\%$) — Emergency dispatch & load shedding required
- **HIGH** ($60\% - 79\%$) — Priority maintenance within 24–48 hours
- **MEDIUM** ($40\% - 59\%$) — Scheduled inspection
- **LOW** ($< 40\%$) — Nominal telemetry monitoring

### 3. Atmospheric Weather Corridor Integration
- Dynamic region-based weather tracking (Zone 4 Storm Front, Zone 2 Wind/Heat, Zone 1 Nominal).
- Weather severity automatically applies failure probability surcharges to affected corridor assets.

### 4. Interactive Geographic Grid Risk Map
- Topology map illustrating substations, feeders, and transformers overlaying active weather storm corridors.
- Clickable nodes with instant risk score breakdown, health telemetry, grid impact, and recommended action cards.

### 5. Predictive Maintenance & Work Order Queue
- Ranked work order creation generated directly from risk engine breaches.
- Status management (Pending, Scheduled, In Progress, Completed) persisting to PostgreSQL.

### 6. Proactive Field Crew Pre-Positioning Optimization
- Recommends crew allocation based on arrival ETA, specialized skills (HV Transformers, Oil Diagnostics, Switchgear), and nearest high-risk zone.
- Direct crew dispatch action persisting to PostgreSQL database.

### 7. Load-Bearing IBM Bob Operational Assistant
- Grounded directly in live PostgreSQL SCADA telemetry data.
- Explains diagnostic root causes (e.g., explaining why `T-104` is critical).
- Provides **interactive action buttons** directly inside chat messages (e.g., "Create Emergency Work Order", "Pre-Position Crew C-07").
- Executes actions against PostgreSQL via `/api/bob/execute-action` endpoint.
- Includes a robust fallback rule-engine ensuring 100% demonstration availability offline.
