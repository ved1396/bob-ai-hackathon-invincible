import os
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List, Any

from app.db.database import get_db, engine, Base
from app.db.models import (
    AssetModel,
    AssetSensorModel,
    SensorReadingModel,
    WeatherModel,
    PredictionModel,
    RiskScoreModel,
    IncidentModel,
    MaintenanceModel,
    CrewModel,
    AlertModel,
    OutageModel
)
from app.db.seed import init_db
from app.services.prediction_engine import calculate_asset_risk
from app.services.bob_assistant import generate_bob_reply

app = FastAPI(
    title="GRIDGUARD AI Backend API",
    description="Power Grid Intelligence & Predictive Maintenance Platform REST API",
    version="1.0.0"
)

cors_env = os.environ.get("CORS_ORIGINS", "")
if cors_env:
    allowed_origins = [o.strip() for o in cors_env.split(",") if o.strip()]
    if "https://gridgaurdai.vercel.app" not in allowed_origins:
        allowed_origins.append("https://gridgaurdai.vercel.app")
else:
    allowed_origins = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://gridgaurdai.vercel.app",
        "*"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    try:
        init_db()
    except Exception as e:
        print(f"[GRIDGUARD DB WARNING] Startup DB initialization deferred: {e}")

# --- Pydantic Schemas for Create & Update Operations ---

class AssetCreate(BaseModel):
    id: str
    name: str
    type: str
    substation: str
    age: Optional[int] = 5
    manufacturer: Optional[str] = "GE Grid Solutions"
    model: Optional[str] = "GX-300"
    capacity: Optional[str] = "75 MVA"
    voltage: Optional[str] = "138 kV"
    loadPct: Optional[float] = 75.0
    healthScore: Optional[int] = 80

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    substation: Optional[str] = None
    healthScore: Optional[int] = None
    loadPct: Optional[float] = None
    topOilTemp: Optional[float] = None
    vibration: Optional[float] = None
    oilQuality: Optional[float] = None

class IncidentCreate(BaseModel):
    title: str
    assetId: str
    severity: str
    cause: Optional[str] = "Logged by grid operator"
    assignedCrew: Optional[str] = "Unassigned"
    location: Optional[str] = "Substation S-21"

class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    assignedCrew: Optional[str] = None

class MaintenanceCreate(BaseModel):
    priority: str
    assetId: str
    assetName: str
    risk: str
    gridImpact: str
    recommendedMaintenance: str
    dueDate: str
    assignedCrew: Optional[str] = "Unassigned"

class MaintenanceUpdate(BaseModel):
    status: Optional[str] = None
    priority: Optional[str] = None
    assignedCrew: Optional[str] = None

class CrewUpdate(BaseModel):
    status: Optional[str] = None
    currentLocation: Optional[str] = None
    recommendedPosition: Optional[str] = None

class CrewDispatchPayload(BaseModel):
    crewId: str
    targetLocation: Optional[str] = None
    targetAsset: Optional[str] = None
    status: Optional[str] = "Dispatched"

class AlertUpdate(BaseModel):
    actionRequired: Optional[str] = None
    severity: Optional[str] = None

class ChatRequest(BaseModel):
    prompt: str
    contextTag: Optional[str] = "Overview"

class ActionExecutePayload(BaseModel):
    actionType: str
    payload: dict

# --- API Endpoints ---

@app.get("/")
@app.get("/health")
def health_check():
    return {"status": "ok", "app": "GRIDGUARD AI Platform", "database": "PostgreSQL"}

@app.get("/api/overview")
def get_overview(db: Session = Depends(get_db)):
    total_assets = db.query(AssetModel).count()
    critical_assets = db.query(AssetModel).filter(AssetModel.riskLevel == 'CRITICAL').all()
    at_risk_count = db.query(AssetModel).filter(AssetModel.riskScore >= 60).count()
    open_incidents = db.query(IncidentModel).filter(IncidentModel.status != 'Resolved').count()
    available_crews = db.query(CrewModel).filter(CrewModel.status != 'Offline').count()

    # Dynamic KPI calculations from PostgreSQL
    overall_health = db.query(func.avg(AssetModel.healthScore)).scalar() or 92.4
    grid_health_str = f"{round(overall_health, 1)}%"

    return {
        "kpis": {
            "gridHealth": grid_health_str,
            "totalAssets": total_assets,
            "atRiskAssets": at_risk_count,
            "criticalAssets": len(critical_assets),
            "predictedOutages": db.query(OutageModel).count(),
            "activeIncidents": open_incidents,
            "crewReadiness": f"{int((available_crews / max(1, db.query(CrewModel).count())) * 100)}%"
        },
        "criticalAssets": [{k: v for k, v in a.__dict__.items() if not k.startswith('_')} for a in critical_assets]
    }

@app.get("/api/assets")
def get_assets(db: Session = Depends(get_db)):
    assets = db.query(AssetModel).all()
    result = []
    for a in assets:
        d = {k: v for k, v in a.__dict__.items() if not k.startswith('_')}
        result.append(d)
    return result

@app.post("/api/assets")
def create_asset(asset: AssetCreate, db: Session = Depends(get_db)):
    clean_id = asset.id.upper().strip()
    existing = db.query(AssetModel).filter(AssetModel.id == clean_id).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Asset ID '{clean_id}' already exists in database.")

    category = "Transformer" if "transformer" in asset.type.lower() else "Substation" if "substation" in asset.type.lower() else "Feeder" if "feeder" in asset.type.lower() else "Switchgear"

    raw_dict = {
        "id": clean_id,
        "name": asset.name,
        "type": asset.type,
        "substation": asset.substation,
        "age": asset.age or 5,
        "topOilTemp": 78.0,
        "tempThreshold": 90.0,
        "vibration": 3.1,
        "vibrationThreshold": 4.5,
        "oilQuality": 85.0,
        "loadPct": asset.loadPct or 75.0,
        "gridImpact": "High (Substation Line)" if "138" in (asset.voltage or "") else "Medium (Local Belt)"
    }
    
    risk_info = calculate_asset_risk(raw_dict)

    new_asset = AssetModel(
        id=clean_id,
        name=asset.name,
        type=asset.type,
        assetCategory=category,
        substation=asset.substation,
        location=f"Zone - {asset.substation}",
        voltage=asset.voltage or "Primary 138kV / Secondary 34.5kV",
        capacity=asset.capacity or "75 MVA",
        age=asset.age or 5,
        commissionedYear=2026 - (asset.age or 5),
        healthScore=asset.healthScore or 80,
        failureProbability=risk_info["failure_probability"],
        riskScore=risk_info["composite_risk_score"],
        riskLevel=risk_info["risk_level"],
        gridImpact=raw_dict["gridImpact"],
        topOilTemp=78.0,
        tempThreshold=90.0,
        vibration=3.1,
        vibrationThreshold=4.5,
        oilQuality=85.0,
        oilQualityThreshold=80.0,
        partialDischarge="14 pC (Nominal)",
        loadPct=asset.loadPct or 75.0,
        currentAmps=450.0,
        voltageKv=138.0,
        weatherImpact="Nominal (0%)",
        lastMaintenance=datetime.now().strftime("%Y-%m-%d"),
        nextMaintenanceDue="In 3 Months",
        prescribedAction="Initial baseline telemetry calibration & scheduled monitoring.",
        attributionReasons=["Newly commissioned asset registered in SCADA telemetry system"]
    )
    db.add(new_asset)

    # 1. Create Sensors in asset_sensors
    default_sensors = [
        ("TEMP", "Temperature", "78°C", "°C", "Healthy", "< 90°C", 78.0),
        ("VIB", "Vibration", "3.1 mm/s", "mm/s", "Healthy", "< 4.5 mm/s", 3.1),
        ("OIL", "Oil Quality", "85%", "%", "Healthy", "> 80%", 85.0),
        ("LOAD", "Load", f"{asset.loadPct or 75}%", "%", "Healthy", "< 85%", float(asset.loadPct or 75))
    ]
    
    for s_suffix, s_type, s_val, s_unit, s_status, s_thresh, s_num in default_sensors:
        s_id = f"SEN-{clean_id}-{s_suffix}"
        db.add(AssetSensorModel(
            id=s_id,
            assetId=clean_id,
            type=s_type,
            value=s_val,
            unit=s_unit,
            status=s_status,
            threshold=s_thresh,
            lastUpdated="Live"
        ))
        
        # 2. Create Initial Reading in sensor_readings
        db.add(SensorReadingModel(
            sensor_id=s_id,
            asset_id=clean_id,
            reading_type=s_type,
            reading_value=s_num,
            unit=s_unit,
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        ))

    # 3. Create Prediction entry in predictions
    db.add(PredictionModel(
        id=f"PRED-{clean_id}",
        asset_id=clean_id,
        predicted_failure_risk=risk_info["failure_probability"],
        failure_mode="Initial Baseline Inspection",
        estimated_rsl_days=int((1.0 - risk_info["failure_probability"]) * 365),
        confidence_score=0.95,
        explanation=f"New asset registered with baseline risk score {risk_info['composite_risk_score']}%.",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    # 4. Create Risk Score entry in risk_scores
    db.add(RiskScoreModel(
        id=f"RISK-{clean_id}",
        asset_id=clean_id,
        probability_score=risk_info["failure_probability"],
        consequence_score=0.7,
        total_risk_score=risk_info["composite_risk_score"],
        risk_matrix_category=risk_info["risk_level"],
        updated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ))

    db.commit()
    db.refresh(new_asset)
    return {k: v for k, v in new_asset.__dict__.items() if not k.startswith('_')}

@app.get("/api/assets/{asset_id}")
def get_asset(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.id == asset_id).first()
    if not asset:
        asset = db.query(AssetModel).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    d = {k: v for k, v in asset.__dict__.items() if not k.startswith('_')}
    weather = db.query(WeatherModel).all()
    risk_calc = calculate_asset_risk(d, [w.__dict__ for w in weather])
    return {**d, "calculatedRisk": risk_calc}

@app.put("/api/assets/{asset_id}")
def update_asset(asset_id: str, update: AssetUpdate, db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    if update.name: asset.name = update.name
    if update.type: asset.type = update.type
    if update.substation: asset.substation = update.substation
    if update.healthScore is not None: asset.healthScore = update.healthScore
    if update.loadPct is not None: asset.loadPct = update.loadPct
    if update.topOilTemp is not None: asset.topOilTemp = update.topOilTemp
    if update.vibration is not None: asset.vibration = update.vibration
    if update.oilQuality is not None: asset.oilQuality = update.oilQuality

    # Recalculate Risk
    d = {k: v for k, v in asset.__dict__.items() if not k.startswith('_')}
    weather = db.query(WeatherModel).all()
    risk_calc = calculate_asset_risk(d, [w.__dict__ for w in weather])

    asset.riskScore = risk_calc["composite_risk_score"]
    asset.failureProbability = risk_calc["failure_probability"]
    asset.riskLevel = risk_calc["risk_level"]

    db.commit()
    db.refresh(asset)
    return {k: v for k, v in asset.__dict__.items() if not k.startswith('_')}

@app.delete("/api/assets/{asset_id}")
def delete_asset(asset_id: str, db: Session = Depends(get_db)):
    asset = db.query(AssetModel).filter(AssetModel.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    # Preserving historical context by flagging or deleting
    db.delete(asset)
    db.commit()
    return {"status": "success", "deletedId": asset_id}

@app.get("/api/risk-analysis")
def get_risk_analysis(db: Session = Depends(get_db)):
    assets = db.query(AssetModel).all()
    weather = db.query(WeatherModel).all()
    weather_dicts = [w.__dict__ for w in weather]
    
    analysis = []
    for a in assets:
        d = {k: v for k, v in a.__dict__.items() if not k.startswith('_')}
        risk_info = calculate_asset_risk(d, weather_dicts)
        analysis.append({
            **d,
            "calculatedRisk": risk_info
        })
    
    analysis.sort(key=lambda x: x["riskScore"], reverse=True)
    return analysis

@app.get("/api/weather")
def get_weather(db: Session = Depends(get_db)):
    weather = db.query(WeatherModel).all()
    return [{k: v for k, v in w.__dict__.items() if not k.startswith('_')} for w in weather]

@app.get("/api/sensors")
def get_sensors(db: Session = Depends(get_db)):
    sensors = db.query(AssetSensorModel).all()
    return [{k: v for k, v in s.__dict__.items() if not k.startswith('_')} for s in sensors]

@app.get("/api/sensor-readings")
def get_sensor_readings(db: Session = Depends(get_db)):
    readings = db.query(SensorReadingModel).order_by(SensorReadingModel.id.desc()).limit(200).all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith('_')} for r in readings]

@app.get("/api/predictions")
def get_predictions(db: Session = Depends(get_db)):
    preds = db.query(PredictionModel).all()
    return [{k: v for k, v in p.__dict__.items() if not k.startswith('_')} for p in preds]

@app.get("/api/risk-scores")
def get_risk_scores(db: Session = Depends(get_db)):
    rscores = db.query(RiskScoreModel).all()
    return [{k: v for k, v in r.__dict__.items() if not k.startswith('_')} for r in rscores]

@app.get("/api/outages")
def get_outages(db: Session = Depends(get_db)):
    outages = db.query(OutageModel).all()
    return [{k: v for k, v in o.__dict__.items() if not k.startswith('_')} for o in outages]

@app.get("/api/incidents")
def get_incidents(db: Session = Depends(get_db)):
    incidents = db.query(IncidentModel).order_by(IncidentModel.id.desc()).all()
    return [{k: v for k, v in i.__dict__.items() if not k.startswith('_')} for i in incidents]

@app.post("/api/incidents")
def create_incident(inc: IncidentCreate, db: Session = Depends(get_db)):
    new_id = f"INC-{db.query(IncidentModel).count() + 2045}"
    new_inc = IncidentModel(
        id=new_id,
        assetId=inc.assetId,
        title=inc.title,
        severity=inc.severity,
        detectedTime="Just now",
        cause=inc.cause or "Logged by grid operator",
        status="Open",
        assignedCrew=inc.assignedCrew or "Unassigned",
        location=inc.location or "Substation S-21"
    )
    db.add(new_inc)
    db.commit()
    db.refresh(new_inc)
    return {k: v for k, v in new_inc.__dict__.items() if not k.startswith('_')}

@app.put("/api/incidents/{incident_id}")
def update_incident(incident_id: str, inc: IncidentUpdate, db: Session = Depends(get_db)):
    db_inc = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not db_inc:
        raise HTTPException(status_code=404, detail="Incident not found")
    if inc.status:
        db_inc.status = inc.status
    if inc.assignedCrew:
        db_inc.assignedCrew = inc.assignedCrew
    db.commit()
    db.refresh(db_inc)
    return {k: v for k, v in db_inc.__dict__.items() if not k.startswith('_')}

@app.get("/api/maintenance")
def get_maintenance(db: Session = Depends(get_db)):
    tasks = db.query(MaintenanceModel).all()
    return [{k: v for k, v in t.__dict__.items() if not k.startswith('_')} for t in tasks]

@app.post("/api/maintenance")
def create_maintenance(task: MaintenanceCreate, db: Session = Depends(get_db)):
    new_id = f"WO-{db.query(MaintenanceModel).count() + 8908}"
    new_task = MaintenanceModel(
        id=new_id,
        priority=task.priority,
        assetId=task.assetId,
        assetName=task.assetName,
        risk=task.risk,
        gridImpact=task.gridImpact,
        recommendedMaintenance=task.recommendedMaintenance,
        dueDate=task.dueDate,
        assignedCrew=task.assignedCrew or "Unassigned",
        status="Pending"
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return {k: v for k, v in new_task.__dict__.items() if not k.startswith('_')}

@app.put("/api/maintenance/{task_id}")
def update_maintenance(task_id: str, task: MaintenanceUpdate, db: Session = Depends(get_db)):
    db_task = db.query(MaintenanceModel).filter(MaintenanceModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Maintenance task not found")
    if task.status:
        db_task.status = task.status
    if task.priority:
        db_task.priority = task.priority
    if task.assignedCrew:
        db_task.assignedCrew = task.assignedCrew
    db.commit()
    db.refresh(db_task)
    return {k: v for k, v in db_task.__dict__.items() if not k.startswith('_')}

@app.get("/api/crews")
@app.get("/api/crew-planning")
def get_crews(db: Session = Depends(get_db)):
    crews = db.query(CrewModel).all()
    return [{k: v for k, v in c.__dict__.items() if not k.startswith('_')} for c in crews]

@app.post("/api/crews/dispatch")
def dispatch_crew_endpoint(payload: CrewDispatchPayload, db: Session = Depends(get_db)):
    crew = db.query(CrewModel).filter(CrewModel.id == payload.crewId).first()
    if not crew:
        crew = db.query(CrewModel).first()
    if not crew:
        raise HTTPException(status_code=404, detail="Crew not found")
    
    crew.status = payload.status or "Dispatched"
    if payload.targetLocation:
        crew.currentLocation = payload.targetLocation
    if payload.targetAsset:
        crew.recommendedPosition = f"Positioned at asset {payload.targetAsset}"

    db.commit()
    db.refresh(crew)
    return {k: v for k, v in crew.__dict__.items() if not k.startswith('_')}

@app.put("/api/crew-planning/{crew_id}")
def update_crew(crew_id: str, crew: CrewUpdate, db: Session = Depends(get_db)):
    db_crew = db.query(CrewModel).filter(CrewModel.id == crew_id).first()
    if not db_crew:
        raise HTTPException(status_code=404, detail="Crew not found")
    if crew.status:
        db_crew.status = crew.status
    if crew.currentLocation:
        db_crew.currentLocation = crew.currentLocation
    if crew.recommendedPosition:
        db_crew.recommendedPosition = crew.recommendedPosition
    db.commit()
    db.refresh(db_crew)
    return {k: v for k, v in db_crew.__dict__.items() if not k.startswith('_')}

@app.get("/api/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(AlertModel).all()
    return [{k: v for k, v in a.__dict__.items() if not k.startswith('_')} for a in alerts]

@app.put("/api/alerts/{alert_id}")
def update_alert(alert_id: str, update: AlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    if update.actionRequired:
        alert.actionRequired = update.actionRequired
    if update.severity:
        alert.severity = update.severity
    db.commit()
    db.refresh(alert)
    return {k: v for k, v in alert.__dict__.items() if not k.startswith('_')}

@app.delete("/api/alerts/{alert_id}")
def delete_alert(alert_id: str, db: Session = Depends(get_db)):
    alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
    if alert:
        db.delete(alert)
        db.commit()
    return {"status": "acknowledged", "alertId": alert_id}

@app.get("/api/grid-map")
def get_grid_map(db: Session = Depends(get_db)):
    assets = db.query(AssetModel).all()
    weather = db.query(WeatherModel).all()
    
    substations = [
        {"id": "S-21", "name": "Substation S-21 (North Corridor)", "lat": 40.7128, "lng": -74.0060, "type": "Substation", "riskLevel": "CRITICAL", "failureProb": 0.87},
        {"id": "S-08", "name": "Substation S-08 (East Metro)", "lat": 40.7306, "lng": -73.9352, "type": "Substation", "riskLevel": "CRITICAL", "failureProb": 0.79},
        {"id": "S-14", "name": "Substation S-14 (West District)", "lat": 40.7589, "lng": -73.9851, "type": "Substation", "riskLevel": "HIGH", "failureProb": 0.68}
    ]

    nodes = []
    for a in assets:
        # Determine pseudo map coordinates per substation
        base_lat, base_lng = 40.7128, -74.0060
        if "S-08" in a.substation:
            base_lat, base_lng = 40.7306, -73.9352
        elif "S-14" in a.substation:
            base_lat, base_lng = 40.7589, -73.9851
            
        nodes.append({
            "id": a.id,
            "name": a.name,
            "type": a.type,
            "substation": a.substation,
            "riskLevel": a.riskLevel,
            "riskScore": a.riskScore,
            "failureProbability": a.failureProbability,
            "gridImpact": a.gridImpact,
            "prescribedAction": a.prescribedAction,
            "coordinates": [base_lat, base_lng]
        })

    return {
        "substations": substations,
        "assets": nodes,
        "activeWeatherZones": [{k: v for k, v in w.__dict__.items() if not k.startswith('_')} for w in weather]
    }

class ChatPayload(BaseModel):
    message: Optional[str] = None
    prompt: Optional[str] = None
    history: Optional[List[Any]] = []
    contextTag: Optional[str] = "Overview"

@app.post("/api/chat")
@app.post("/api/bob/chat")
def chat_endpoint(payload: ChatPayload, db: Session = Depends(get_db)):
    msg = payload.message or payload.prompt or "What is the current grid status?"
    return generate_bob_reply(msg, payload.history, db)

@app.post("/api/bob/execute-action")
def execute_bob_action(payload: ActionExecutePayload, db: Session = Depends(get_db)):
    action_type = payload.actionType
    p = payload.payload

    if action_type == "CREATE_MAINTENANCE":
        asset_id = p.get("assetId", "T-104")
        asset_name = p.get("assetName", "Step-Down Substation Transformer T-104")
        new_id = f"WO-{db.query(MaintenanceModel).count() + 8908}"
        new_task = MaintenanceModel(
            id=new_id,
            priority=p.get("priority", "P1 - CRITICAL"),
            assetId=asset_id,
            assetName=asset_name,
            risk=p.get("risk", "87%"),
            gridImpact=p.get("gridImpact", "Critical (345kV Bulk Power)"),
            recommendedMaintenance=p.get("recommendedMaintenance", "Emergency inspection recommended by IBM Bob Assistant"),
            dueDate=p.get("dueDate", "Today (Immediate)"),
            assignedCrew=p.get("assignedCrew", "Crew C-07"),
            status="Pending"
        )
        db.add(new_task)
        db.commit()
        db.refresh(new_task)
        return {
            "success": True,
            "message": f"Successfully created Work Order {new_id} for asset {asset_id} in PostgreSQL!",
            "data": {k: v for k, v in new_task.__dict__.items() if not k.startswith('_')}
        }

    elif action_type == "DISPATCH_CREW":
        crew_id = p.get("crewId", "CREW-C07")
        crew = db.query(CrewModel).filter(CrewModel.id == crew_id).first()
        if not crew:
            crew = db.query(CrewModel).first()
        if crew:
            crew.status = "Dispatched"
            crew.currentLocation = p.get("currentLocation", "Substation S-21")
            db.commit()
            db.refresh(crew)
            return {
                "success": True,
                "message": f"Successfully dispatched {crew.name} to {crew.currentLocation} in PostgreSQL!",
                "data": {k: v for k, v in crew.__dict__.items() if not k.startswith('_')}
            }
        raise HTTPException(status_code=404, detail="Crew not found")

    elif action_type == "CREATE_INCIDENT":
        new_id = f"INC-{db.query(IncidentModel).count() + 2045}"
        new_inc = IncidentModel(
            id=new_id,
            assetId=p.get("assetId", "T-104"),
            title=p.get("title", "High failure risk incident created via IBM Bob"),
            severity=p.get("severity", "CRITICAL"),
            detectedTime="Just now",
            cause=p.get("cause", "Created by operator through IBM Bob Assistant recommendation"),
            status="Open",
            assignedCrew=p.get("assignedCrew", "Crew C-07"),
            location=p.get("location", "Substation S-21")
        )
        db.add(new_inc)
        db.commit()
        db.refresh(new_inc)
        return {
            "success": True,
            "message": f"Successfully logged Incident {new_id} in PostgreSQL!",
            "data": {k: v for k, v in new_inc.__dict__.items() if not k.startswith('_')}
        }

    elif action_type == "ACKNOWLEDGE_ALERT":
        alert_id = p.get("alertId")
        if alert_id:
            alert = db.query(AlertModel).filter(AlertModel.id == alert_id).first()
            if alert:
                db.delete(alert)
                db.commit()
                return {"success": True, "message": f"Alert {alert_id} acknowledged and removed from PostgreSQL!"}
        return {"success": True, "message": "Alert state acknowledged in PostgreSQL."}

    else:
        raise HTTPException(status_code=400, detail=f"Unknown action type: {action_type}")


