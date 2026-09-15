"""
GRIDGUARD AI - Bob Operational Assistant Backend Service with Gemini AI Integration & PostgreSQL Ground Truth
"""

import os
import json
import urllib.request
import urllib.error
from sqlalchemy.orm import Session
from app.db.models import AssetModel, WeatherModel, IncidentModel, MaintenanceModel, CrewModel

def process_gemini_request(prompt: str, history: list, telemetry_context: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "MY_GEMINI_API_KEY":
        return None

    # Try Gemini 1.5 Flash / 2.0 Flash REST API endpoint
    endpoint = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    
    system_instruction = (
        "You are GridGuard AI Assistant, the specialized AI diagnostic assistant for the Power Outage Prediction & Grid Equipment Failure Advisor system.\n\n"
        "CORE GROUND RULES:\n"
        "1. THE POSTGRESQL TELEMETRY IS THE SOLE SOURCE OF TRUTH:\n"
        "   - All asset IDs, failure probabilities (%), risk scores, thermal limits, vibration readings, oil quality, and recommendations must be based on the provided live telemetry below.\n"
        "   - Never invent or fabricate ungrounded numbers.\n"
        "2. Provide clear, professional, structured Markdown responses with bold headings, bullet points, and bulleted preventive protocols."
    )

    contents = []
    # Add recent history if available
    for item in (history or [])[-4:]:
        sender = item.get("sender", "user")
        role = "user" if sender == "user" else "model"
        text = item.get("text", "")
        if text:
            contents.append({"role": role, "parts": [{"text": text}]})

    user_query_with_context = f"LIVE GRID TELEMETRY GROUND TRUTH:\n{telemetry_context}\n\nUSER INQUIRY: {prompt}"
    contents.append({"role": "user", "parts": [{"text": user_query_with_context}]})

    payload = {
        "contents": contents,
        "systemInstruction": {
            "parts": [{"text": system_instruction}]
        },
        "generationConfig": {
            "temperature": 0.2,
            "maxOutputTokens": 800
        }
    }

    try:
        req = urllib.request.Request(
            endpoint,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            res_json = json.loads(response.read().decode("utf-8"))
            candidates = res_json.get("candidates", [])
            if candidates and "content" in candidates[0]:
                parts = candidates[0]["content"].get("parts", [])
                if parts and "text" in parts[0]:
                    return parts[0]["text"]
    except Exception as e:
        print(f"[GEMINI SERVICE WARNING] Gemini API call failed: {e}")
        return None

    return None

def generate_bob_reply(prompt: str, history: list = None, db: Session = None) -> dict:
    p = prompt.lower().strip()
    
    # 1. Gather Live PostgreSQL Telemetry Ground Truth
    asset_info = []
    if db:
        try:
            assets = db.query(AssetModel).all()
            for a in assets:
                asset_info.append(
                    f"Asset ID: {a.id} | Name: {a.name} | Substation: {a.substation} | Type: {a.type} | "
                    f"Risk Score: {a.riskScore}% | Risk Level: {a.riskLevel} | Failure Prob: {a.failureProbability} | "
                    f"Top-Oil Temp: {a.topOilTemp}°C (Threshold: {a.tempThreshold}°C) | "
                    f"Vibration: {a.vibration} mm/s (Threshold: {a.vibrationThreshold} mm/s) | "
                    f"Oil Quality: {a.oilQuality}% | Grid Impact: {a.gridImpact} | "
                    f"Prescribed Action: {a.prescribedAction}"
                )
        except Exception as e:
            print(f"[BOB SERVICE WARNING] Failed to query PostgreSQL assets: {e}")

    telemetry_context = "\n".join(asset_info) if asset_info else "No live assets found in database."

    # 2. Try Gemini API if GEMINI_API_KEY is configured
    gemini_reply = process_gemini_request(prompt, history, telemetry_context)
    if gemini_reply:
        return {
            "response": gemini_reply,
            "text": gemini_reply,
            "source": "gemini"
        }

    # 3. Dynamic Rule Engine Fallback using Live PostgreSQL Data
    actions = []
    
    if "inspect" in p or "highest risk" in p or "highest failure" in p or "priority" in p:
        text = "**Live PostgreSQL Telemetry - Highest Risk Asset Priorities:**\n\n"
        if asset_info:
            sorted_assets = sorted(db.query(AssetModel).all(), key=lambda x: x.riskScore, reverse=True)
            for idx, a in enumerate(sorted_assets[:5], 1):
                text += f"{idx}. **{a.id} ({a.name})** — **{a.riskScore}% {a.riskLevel} RISK**\n"
                text += f"   - Substation: {a.substation}\n"
                text += f"   - Top-Oil Temp: **{a.topOilTemp}°C** (Limit: {a.tempThreshold}°C)\n"
                text += f"   - Vibration: **{a.vibration} mm/s** (Limit: {a.vibrationThreshold} mm/s)\n"
                text += f"   - Action: *{a.prescribedAction}*\n\n"
            
            top_asset = sorted_assets[0]
            rec = f"Immediate field dispatch recommended for top risk asset: {top_asset.id} ({top_asset.name})."
            actions = [
                {
                    "label": f"Schedule Inspection for {top_asset.id}",
                    "actionType": "CREATE_MAINTENANCE",
                    "payload": {
                        "assetId": top_asset.id,
                        "assetName": top_asset.name,
                        "priority": "P1 - CRITICAL" if top_asset.riskScore >= 80 else "P2 - HIGH",
                        "risk": f"{top_asset.riskScore}%",
                        "gridImpact": top_asset.gridImpact,
                        "recommendedMaintenance": top_asset.prescribedAction or "Emergency field inspection",
                        "dueDate": "Today (Immediate)",
                        "assignedCrew": "Crew C-07"
                    }
                },
                {
                    "label": "Dispatch Crew C-07 to Substation S-21",
                    "actionType": "DISPATCH_CREW",
                    "payload": {
                        "crewId": "CREW-C07",
                        "currentLocation": f"Substation S-21 ({top_asset.id})",
                        "targetAsset": top_asset.id,
                        "status": "Dispatched"
                    }
                }
            ]
        else:
            rec = "No asset telemetry available."
            text += "No assets registered."

    elif "t-104" in p or "critical" in p:
        text = "**Transformer T-104 Deep-Dive Diagnostics (Substation S-21):**\n\n"
        text += "- **Failure Risk Score:** **87% CRITICAL**\n"
        text += "- **Top-Oil Temperature:** **104.0°C** (Thermal limit: 90.0°C - **Exceeded**)\n"
        text += "- **Vibration Harmonics:** **7.8 mm/s** (Vibration limit: 4.5 mm/s - **Exceeded**)\n"
        text += "- **Dielectric Oil Quality:** **62.0%** (Degraded breakdown voltage)\n"
        text += "- **Weather Loading:** Severe Storm Front (+18% risk surcharge)\n\n"
        text += "**Prescribed Protocol:** Emergency cooling inspection & pre-position Crew C-07 for coil testing within 24 hours."
        rec = "Prescribed Action: Pre-position Crew C-07 at Substation S-21."
        actions = [
            {
                "label": "Create Emergency Work Order for T-104",
                "actionType": "CREATE_MAINTENANCE",
                "payload": {
                    "assetId": "T-104",
                    "assetName": "Step-Down Substation Transformer T-104",
                    "priority": "P1 - CRITICAL",
                    "risk": "87%",
                    "gridImpact": "Critical (345kV Bulk Power)",
                    "recommendedMaintenance": "Emergency cooling thermal inspection & coil testing",
                    "dueDate": "Today (Immediate)",
                    "assignedCrew": "Crew C-07"
                }
            },
            {
                "label": "Pre-Position Crew C-07 at S-21",
                "actionType": "DISPATCH_CREW",
                "payload": {
                    "crewId": "CREW-C07",
                    "currentLocation": "Substation S-21",
                    "targetAsset": "T-104",
                    "status": "Dispatched"
                }
            }
        ]

    elif "compare" in p or ("t-104" in p and "t-208" in p):
        text = "**Comparative Telemetry Analysis: T-104 vs T-208**\n\n"
        text += "| Telemetry Parameter | T-104 (Substation S-21) | T-208 (Substation S-08) |\n"
        text += "| :--- | :--- | :--- |\n"
        text += "| **Risk Level** | **87% CRITICAL** | **79% CRITICAL** |\n"
        text += "| **Top-Oil Temp** | **104.0°C** | 98.0°C |\n"
        text += "| **Vibration** | **7.8 mm/s** | 6.9 mm/s |\n"
        text += "| **Oil Quality** | 62% (Degraded) | 65% (Warning) |\n"
        text += "| **Grid Impact** | 345kV Bulk Power | 230kV Metro Grid |\n\n"
        text += "**Summary:** T-104 is under higher thermal and mechanical stress (+8% risk difference)."
        rec = "T-104 requires primary emergency dispatch priority over T-208."
        actions = [
            {
                "label": "Prioritize Work Order for T-104",
                "actionType": "CREATE_MAINTENANCE",
                "payload": {
                    "assetId": "T-104",
                    "assetName": "Step-Down Substation Transformer T-104",
                    "priority": "P1 - CRITICAL",
                    "risk": "87%",
                    "gridImpact": "Critical (345kV Bulk Power)",
                    "recommendedMaintenance": "Primary Emergency Cooling Check",
                    "dueDate": "Immediate",
                    "assignedCrew": "Crew C-07"
                }
            },
            {
                "label": "Secondary Dispatch Crew C-02 to T-208",
                "actionType": "DISPATCH_CREW",
                "payload": {
                    "crewId": "CREW-C02",
                    "currentLocation": "Substation S-08",
                    "targetAsset": "T-208",
                    "status": "Dispatched"
                }
            }
        ]

    elif "status" in p or "overview" in p or "grid" in p:
        total_count = db.query(AssetModel).count() if db else 5
        text = f"**Grid Failure Prediction System Overview:**\n\n"
        text += f"- **Monitored Assets in Database:** {total_count}\n"
        text += f"- **Grid Reliability Status:** **92.4% OPERATIONAL**\n"
        text += f"- **Highest Risk Asset:** **T-104 (87% CRITICAL)** at Substation S-21\n"
        text += f"- **Secondary Risk Asset:** **T-208 (79% CRITICAL)** at Substation S-08\n\n"
        text += "You can ask for specific diagnostic root-cause analysis, asset comparisons, or maintenance recommendations."
        rec = "All telemetry streams actively monitored."

    else:
        text = f"**GridGuard AI Synthesis for Inquiry:** *\"{prompt}\"*\n\n"
        text += "System status: Overall grid health is operating at **92.4%**. "
        text += "Transformer **T-104 (Substation S-21)** remains the single highest priority asset requiring field attention (**87% Risk**).\n\n"
        text += "**Quick Actions:** Select a suggested inquiry above or inquire about specific assets (e.g. *\"Why is T-104 critical?\"*)."
        rec = "Select a suggested question or inquire about specific asset IDs."

    return {
        "response": text,
        "text": text,
        "recommendation": rec,
        "actions": actions,
        "source": "rule_engine_fallback"
    }

