# Setup Guide: Running GRIDGUARD AI

This setup guide provides step-by-step instructions for judges and developers to run **GRIDGUARD AI** from scratch.

## Prerequisites

- **Python**: Version `3.10` or higher
- **Node.js**: Version `18.0` or higher
- **Git**
- **Internet Connection**: For connecting to the PostgreSQL/Supabase database

---

## 1. Clone Repository & Navigate

```bash
git clone https://github.com/ved1396/bob-ai-hackathon-invincible.git
cd bob-ai-hackathon-invincible
```

---

## 2. Start FastAPI Backend

Navigate to the `src/backend` directory, install dependencies, and start the FastAPI server:

```bash
cd src/backend

# Create virtual environment (optional)
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI Server on port 8000
uvicorn main:app --reload --port 8000
```

The backend server will start at `http://localhost:8000`. You can verify API health by navigating to:
`http://localhost:8000/` or checking API docs at `http://localhost:8000/docs`.

---

## 3. Start React Frontend Application

Open a new terminal window, navigate to `src/frontend`, install Node packages, and launch Vite dev server:

```bash
cd src/frontend

# Install dependencies
npm install

# Start Vite Frontend Dev Server
npm run dev
```

The frontend application will start at `http://localhost:5173`.

---

## 4. Verification & Testing Instructions

1. Open `http://localhost:5173` in your browser.
2. Verify overall grid health KPI (e.g. `92.4%`) and critical assets list loaded from PostgreSQL.
3. Navigate to **Assets Page** and click **+ Add Asset**.
   - Asset ID: `T-406`
   - Asset Name: `Substation Step-Down T-406`
   - Asset Type: `Transformer`
   - Substation: `Substation S-21`
   - Health Score: `85`
   - Click **Submit**.
4. Verify `T-406` is inserted into PostgreSQL and immediately appears across **Assets**, **Risk Analysis**, and **Grid Map**.
5. Refresh the browser page (`F5`) and confirm `T-406` remains persisted.
6. Open **GridGuard AI Assistant (Bob)** (bottom right floating button):
   - Ask: *"Why is T-104 critical?"*
   - Verify structured diagnostic output explaining top-oil temp (104°C) and vibration (7.8 mm/s).
   - Click the action button *"Create Emergency Work Order for T-104"*.
   - Confirm action execution message and verify the new work order appears on the **Maintenance Page**.

---

## Troubleshooting

- **Database Connection Timeout**: Ensure your environment allows outbound connections on port `5432` to Supabase PostgreSQL poolers.
- **Port 8000 Already in Use**: Specify a different port when running uvicorn (`uvicorn main:app --port 8080`) and update `VITE_API_URL` in frontend.
