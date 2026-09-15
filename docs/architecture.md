# Technical Architecture: GRIDGUARD AI Platform

## High-Level Architecture Diagram

```mermaid
graph TD
    subgraph Client Layer
        UI["React + Vite Single Page Application"]
        MAP["Interactive Grid Topology Map"]
        BOB_UI["IBM Bob Operational Assistant Drawer"]
    end

    subgraph REST API Layer
        API["FastAPI Backend (main.py)"]
        ASSET_EP["/api/assets (CRUD)"]
        RISK_EP["/api/risk-analysis"]
        MAP_EP["/api/grid-map"]
        CREW_EP["/api/crews/dispatch"]
        BOB_EP["/api/chat & /api/bob/execute-action"]
    end

    subgraph Operational Intelligence Engine
        ENGINE["Prediction Engine (calculate_asset_risk)"]
        BOB_ENGINE["IBM Bob Telemetry Grounding & Action Engine"]
    end

    subgraph Data Persistence Layer
        POSTGRES[("PostgreSQL / Supabase Database")]
        T_ASSETS[("assets")]
        T_SENSORS[("asset_sensors & sensor_readings")]
        T_WEATHER[("weather")]
        T_INCIDENTS[("incidents")]
        T_MAINT[("maintenance")]
        T_CREWS[("crews")]
        T_ALERTS[("alerts")]
    end

    UI --> API
    MAP --> API
    BOB_UI --> API

    API --> ASSET_EP
    API --> RISK_EP
    API --> MAP_EP
    API --> CREW_EP
    API --> BOB_EP

    ASSET_EP --> ENGINE
    RISK_EP --> ENGINE
    BOB_EP --> BOB_ENGINE

    ENGINE --> POSTGRES
    BOB_ENGINE --> POSTGRES
    ASSET_EP --> POSTGRES
    CREW_EP --> POSTGRES

    POSTGRES --- T_ASSETS
    POSTGRES --- T_SENSORS
    POSTGRES --- T_WEATHER
    POSTGRES --- T_INCIDENTS
    POSTGRES --- T_MAINT
    POSTGRES --- T_CREWS
    POSTGRES --- T_ALERTS
```

## IBM Bob Assistant Action Execution Sequence

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Grid Operator
    participant UI as GridGuard React UI
    participant Bob as IBM Bob Assistant
    participant API as FastAPI Backend
    participant DB as PostgreSQL Database

    Operator->>UI: Ask: "Why is T-104 critical?"
    UI->>API: POST /api/chat { prompt: "Why is T-104 critical?" }
    API->>DB: Query live assets, sensors, weather, incidents
    DB-->>API: Return T-104 telemetry (104°C, 7.8mm/s vib, 62% oil)
    API->>API: Formulate diagnostic explanation & executable actions
    API-->>UI: Return response text & structured actions payload
    UI-->>Operator: Display diagnostic breakdown & action buttons

    Operator->>Bob: Click "Pre-Position Crew C-07 at S-21"
    Bob->>API: POST /api/bob/execute-action { actionType: "DISPATCH_CREW", payload: {...} }
    API->>DB: UPDATE crews SET status='Dispatched', currentLocation='Substation S-21'
    DB-->>API: Confirm database update
    API-->>Bob: Return success confirmation message
    Bob-->>UI: Render action execution badge & update app state
```

## Database Schema Model Design

- `assets`: Primary key `id` (e.g. `T-104`), name, type, category, substation, age, health score, failure probability, risk score, risk level, grid impact, thermal/vibration readings, prescribed action.
- `asset_sensors`: Foreign key to `assets.id`. Sensor type, value, threshold, status.
- `sensor_readings`: Historical time-series telemetry readings for sensors.
- `weather`: Meteorological conditions by zone/region, wind speed, lightning risk, risk multiplier.
- `incidents`: Outage/hazard incidents, severity, detected time, cause, assigned crew.
- `maintenance`: Work orders, priority, asset reference, recommended task, due date, status.
- `crews`: Available field repair crews, lead, skills, location, recommended position, ETA, status.
- `alerts`: Active system alarms, severity, message, action required.
- `outages`: Outage tracking records, affected customers, restoration ETA.
