# GridGuard AI Source Code (`src/`)

This directory contains the complete source code for **GRIDGUARD AI — Power Outage Prediction & Grid Equipment Failure Advisor**, structured according to IBM Bob Hackathon monorepo guidelines.

## Directory Layout

```
src/
├── frontend/             # React + Vite + Tailwind CSS User Interface
│   ├── src/
│   │   ├── components/   # UI Layouts, Grid Components, IBM Bob Chatbot Modal
│   │   ├── pages/        # Dashboard, Assets, Risk Analysis, Grid Map, Weather, etc.
│   │   ├── services/     # Centralized API service layer (api.js)
│   │   └── App.jsx       # React Router application entry point
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # Python FastAPI REST API & Prediction Engine
│   ├── app/
│   │   ├── db/           # SQLAlchemy models, database connection, seed logic
│   │   └── services/     # Prediction engine & IBM Bob Assistant logic
│   ├── main.py           # FastAPI application & route declarations
│   ├── seed.py           # PostgreSQL database initialization & seeding
│   ├── schema_and_seed.sql # Pure SQL DDL & DML statements
│   └── requirements.txt  # Python package dependencies
│
└── .env.example          # Environment variable template
```

## Running Backend

```bash
cd src/backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Running Frontend

```bash
cd src/frontend
npm install
npm run dev
```
