import os
import json
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.database import Base, engine, SessionLocal
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

INITIAL_ASSETS_DATA = [
  {
    "id": "T-104",
    "name": "Step-Down Substation Transformer T-104",
    "type": "Transformer",
    "assetCategory": "Transformer",
    "substation": "Substation S-21",
    "location": "Zone 4 - North Industrial Corridor",
    "voltage": "Primary 345kV / Secondary 138kV",
    "capacity": "120 MVA",
    "age": 12,
    "commissionedYear": 2014,
    "healthScore": 34,
    "failureProbability": 0.87,
    "riskScore": 87,
    "riskLevel": "CRITICAL",
    "gridImpact": "Critical (345kV Bulk Power Transmission)",
    "topOilTemp": 104.0,
    "tempThreshold": 90.0,
    "vibration": 7.8,
    "vibrationThreshold": 4.5,
    "oilQuality": 62.0,
    "oilQualityThreshold": 80.0,
    "partialDischarge": "88 pC (High Risk)",
    "loadPct": 94.0,
    "currentAmps": 840.0,
    "voltageKv": 342.0,
    "weatherImpact": "Severe Storm & Heavy Wind (+18%)",
    "lastMaintenance": "2026-02-14",
    "nextMaintenanceDue": "Immediate (24 hours)",
    "prescribedAction": "Emergency cooling thermal inspection & pre-position Crew C-07 for immediate coil replacement.",
    "attributionReasons": [
      "Top-oil temperature exceeded upper thermal limit (104°C vs 90°C limit)",
      "Vibration harmonics elevated 23% over last 6 hours (7.8 mm/s)",
      "Dielectric oil breakdown voltage degraded to 62%"
    ]
  },
  {
    "id": "T-208",
    "name": "Bulk Transmission Autotransformer T-208",
    "type": "Transformer",
    "assetCategory": "Transformer",
    "substation": "Substation S-08",
    "location": "Zone 2 - East Metropolitan Substation",
    "voltage": "Primary 230kV / Secondary 115kV",
    "capacity": "100 MVA",
    "age": 15,
    "commissionedYear": 2011,
    "healthScore": 48,
    "failureProbability": 0.79,
    "riskScore": 79,
    "riskLevel": "CRITICAL",
    "gridImpact": "Critical (High Capacity Metro Grid)",
    "topOilTemp": 98.0,
    "tempThreshold": 90.0,
    "vibration": 6.9,
    "vibrationThreshold": 4.5,
    "oilQuality": 65.0,
    "oilQualityThreshold": 80.0,
    "partialDischarge": "72 pC (Elevated)",
    "loadPct": 89.0,
    "currentAmps": 760.0,
    "voltageKv": 228.0,
    "weatherImpact": "High Temperature & Wind (+12%)",
    "lastMaintenance": "2025-11-10",
    "nextMaintenanceDue": "Today",
    "prescribedAction": "Perform Dissolved Gas Analysis (DGA) & examine phase B bushing thermal camera readings.",
    "attributionReasons": [
      "Acetylene & ethylene gas concentrations elevated in oil DGA sample",
      "Top oil temperature thermal anomaly (98°C)"
    ]
  },
  {
    "id": "S-21",
    "name": "Regional Switching Substation S-21",
    "type": "Substation",
    "assetCategory": "Substation",
    "substation": "Substation S-21",
    "location": "Zone 4 - North Industrial Corridor",
    "voltage": "345kV / 138kV / 34.5kV",
    "capacity": "450 MVA Total",
    "age": 18,
    "commissionedYear": 2008,
    "healthScore": 52,
    "failureProbability": 0.74,
    "riskScore": 74,
    "riskLevel": "HIGH",
    "gridImpact": "Critical (Regional Interconnect)",
    "topOilTemp": 88.0,
    "tempThreshold": 90.0,
    "vibration": 5.4,
    "vibrationThreshold": 4.5,
    "oilQuality": 71.0,
    "oilQualityThreshold": 80.0,
    "partialDischarge": "45 pC",
    "loadPct": 91.0,
    "currentAmps": 1820.0,
    "voltageKv": 344.0,
    "weatherImpact": "Storm & Lightning Risk (+14%)",
    "lastMaintenance": "2026-01-05",
    "nextMaintenanceDue": "Within 48 hours",
    "prescribedAction": "Inspect busbar insulation & verify surge arrester integrity ahead of lightning storm.",
    "attributionReasons": [
      "Substation busbar mechanical vibration elevated",
      "High total throughput load near peak capacity"
    ]
  },
  {
    "id": "T-311",
    "name": "Step-Down Transformer T-311",
    "type": "Transformer",
    "assetCategory": "Transformer",
    "substation": "Substation S-14",
    "location": "Zone 1 - West Residential District",
    "voltage": "Primary 138kV / Secondary 34.5kV",
    "capacity": "75 MVA",
    "age": 9,
    "commissionedYear": 2017,
    "healthScore": 58,
    "failureProbability": 0.68,
    "riskScore": 68,
    "riskLevel": "HIGH",
    "gridImpact": "High (Commercial & Residential Belt)",
    "topOilTemp": 92.0,
    "tempThreshold": 90.0,
    "vibration": 5.9,
    "vibrationThreshold": 4.5,
    "oilQuality": 74.0,
    "oilQualityThreshold": 80.0,
    "partialDischarge": "54 pC",
    "loadPct": 84.0,
    "currentAmps": 540.0,
    "voltageKv": 136.0,
    "weatherImpact": "High Wind Loading (+10%)",
    "lastMaintenance": "2026-03-01",
    "nextMaintenanceDue": "Within 3 days",
    "prescribedAction": "Vibration diagnostic check & tighten terminal mounting hardware.",
    "attributionReasons": [
      "High wind loading causing mechanical stress on gantry connection"
    ]
  },
  {
    "id": "F-12",
    "name": "Feeder Trunk Distribution Line F-12",
    "type": "Feeder",
    "assetCategory": "Feeder",
    "substation": "Substation S-21",
    "location": "Zone 4 - Industrial Feed",
    "voltage": "34.5 kV",
    "capacity": "30 MVA",
    "age": 7,
    "commissionedYear": 2019,
    "healthScore": 61,
    "failureProbability": 0.65,
    "riskScore": 65,
    "riskLevel": "HIGH",
    "gridImpact": "High (Key Industrial Plants)",
    "topOilTemp": 78.0,
    "tempThreshold": 90.0,
    "vibration": 3.2,
    "vibrationThreshold": 4.5,
    "oilQuality": 82.0,
    "oilQualityThreshold": 80.0,
    "partialDischarge": "18 pC",
    "loadPct": 88.0,
    "currentAmps": 490.0,
    "voltageKv": 34.1,
    "weatherImpact": "High Wind & Tree Line Risk (+15%)",
    "lastMaintenance": "2026-02-20",
    "nextMaintenanceDue": "Within 4 days",
    "prescribedAction": "Inspect vegetation clearance along section 4B and clear fallen branches.",
    "attributionReasons": [
      "High wind speed (55 km/h) causing conductor galloping risk"
    ]
  }
]

INITIAL_WEATHER_DATA = [
  {
    "id": "WX-ZONE4",
    "region": "Zone 4 - North Industrial Corridor (Substation S-21)",
    "condition": "Heavy Thunderstorm & Wind",
    "temperature": "32°C",
    "humidity": "88%",
    "windSpeed": "55 km/h",
    "rainfall": "45 mm/h",
    "stormProbability": "85%",
    "lightningRisk": "High",
    "riskMultiplier": "+18%",
    "severity": "Critical",
    "alertMessage": "Convective storm front with 55 km/h wind gusts active in Zone 4. High failure risk on T-104 and feeder F-12."
  },
  {
    "id": "WX-ZONE2",
    "region": "Zone 2 - East Metropolitan (Substation S-08)",
    "condition": "High Wind & Extreme Heat",
    "temperature": "34°C",
    "humidity": "75%",
    "windSpeed": "42 km/h",
    "rainfall": "12 mm/h",
    "stormProbability": "60%",
    "lightningRisk": "Moderate",
    "riskMultiplier": "+12%",
    "severity": "High",
    "alertMessage": "Elevated ambient temperature causing high cooling stress on autotransformer T-208."
  },
  {
    "id": "WX-ZONE1",
    "region": "Zone 1 - West Residential District (Substation S-14)",
    "condition": "Moderate Wind",
    "temperature": "28°C",
    "humidity": "65%",
    "windSpeed": "25 km/h",
    "rainfall": "5 mm/h",
    "stormProbability": "30%",
    "lightningRisk": "Low",
    "riskMultiplier": "+5%",
    "severity": "Moderate",
    "alertMessage": "Normal seasonal winds with light precipitation."
  }
]

INITIAL_CREWS_DATA = [
  {
    "id": "CREW-C07",
    "name": "Crew C-07 (HV Transformer Specialists)",
    "lead": "Dave Miller (Senior High-Voltage Engineer)",
    "membersCount": 4,
    "currentLocation": "Zone 4 Base Station (6 km from Substation S-21)",
    "availability": "Available / High Priority Dispatch",
    "skills": ["HV Transformers", "DGA Oil Testing", "Substation Protection"],
    "nearestRiskZone": "Zone 4 (Risk Level 87%)",
    "recommendedPosition": "Pre-position at Substation S-21 near Transformer T-104",
    "eta": "14 mins",
    "status": "Pre-Positioned"
  },
  {
    "id": "CREW-C02",
    "name": "Crew C-02 (Oil Diagnostic Specialists)",
    "lead": "Sarah Jenkins (Chemical & Dielectric Specialist)",
    "membersCount": 3,
    "currentLocation": "East Depot (8 km from Substation S-08)",
    "availability": "Available",
    "skills": ["Dielectric Fluid Sampling", "DGA Analysis"],
    "nearestRiskZone": "Zone 2 (Risk Level 79%)",
    "recommendedPosition": "Pre-position at Substation S-08 for Autotransformer T-208 DGA",
    "eta": "18 mins",
    "status": "Dispatched"
  },
  {
    "id": "CREW-C01",
    "name": "Crew C-01 (Line & Feeder Crew)",
    "lead": "Robert Garcia",
    "membersCount": 5,
    "currentLocation": "North Operations Hub",
    "availability": "Available",
    "skills": ["Overhead Feeders", "Tree Clearing"],
    "nearestRiskZone": "Zone 4",
    "recommendedPosition": "Standby at Zone 4 for Feeder F-12",
    "eta": "25 mins",
    "status": "Available"
  },
  {
    "id": "CREW-C03",
    "name": "Crew C-03 (Substation Rapid Response)",
    "lead": "Elena Rostova",
    "membersCount": 4,
    "currentLocation": "West Substation Hub",
    "availability": "Busy",
    "skills": ["Switchgear", "Busbar Maintenance"],
    "nearestRiskZone": "Zone 1",
    "recommendedPosition": "Positioned at Substation S-14",
    "eta": "10 mins",
    "status": "Dispatched"
  }
]

INITIAL_INCIDENTS_DATA = [
  { "id": "INC-2041", "assetId": "T-104", "title": "Transformer T-104 failure risk spike to 87%", "severity": "CRITICAL", "detectedTime": "12 mins ago", "cause": "Thermal overload (104°C) combined with high vibration", "status": "Crew Dispatched", "assignedCrew": "Crew C-07", "location": "Substation S-21" },
  { "id": "INC-2042", "assetId": "T-208", "title": "Autotransformer T-208 top oil temp 98°C alert", "severity": "CRITICAL", "detectedTime": "25 mins ago", "cause": "Cooling fan failure under peak metro demand", "status": "Investigating", "assignedCrew": "Crew C-02", "location": "Substation S-08" },
  { "id": "INC-2043", "assetId": "S-21", "title": "Substation S-21 busbar vibration threshold breach", "severity": "HIGH", "detectedTime": "45 mins ago", "cause": "Harmonic resonance under high storm gusts", "status": "Open", "assignedCrew": "Crew C-03", "location": "Substation S-21" },
  { "id": "INC-2044", "assetId": "F-12", "title": "Feeder F-12 tree branch strike risk", "severity": "HIGH", "detectedTime": "1 hour ago", "cause": "Heavy wind speed (55 km/h) near tree line", "status": "Open", "assignedCrew": "Crew C-01", "location": "Substation S-21" },
  { "id": "INC-2045", "assetId": "T-311", "title": "Transformer T-311 thermal warning", "severity": "HIGH", "detectedTime": "2 hours ago", "cause": "Residential peak load spike", "status": "Open", "assignedCrew": "Unassigned", "location": "Substation S-14" }
]

INITIAL_MAINTENANCE_DATA = [
  { "id": "WO-8901", "priority": "P1 - CRITICAL", "assetId": "T-104", "assetName": "Step-Down Transformer T-104", "risk": "87%", "gridImpact": "Critical (345kV Bulk Power)", "recommendedMaintenance": "Emergency thermal cooling system inspection & oil sampling", "dueDate": "Today (Immediate)", "assignedCrew": "Crew C-07", "status": "Pending" },
  { "id": "WO-8902", "priority": "P1 - CRITICAL", "assetId": "T-208", "assetName": "Bulk Autotransformer T-208", "risk": "79%", "gridImpact": "Critical (Metro Grid)", "recommendedMaintenance": "Dissolved Gas Analysis (DGA) & bushing thermal sweep", "dueDate": "Today (Within 6h)", "assignedCrew": "Crew C-02", "status": "Scheduled" },
  { "id": "WO-8903", "priority": "P2 - HIGH", "assetId": "S-21", "assetName": "Regional Substation S-21", "risk": "74%", "gridImpact": "Critical (Regional Interconnect)", "recommendedMaintenance": "Busbar damper tightening and surge arrester check", "dueDate": "Tomorrow", "assignedCrew": "Crew C-03", "status": "Scheduled" },
  { "id": "WO-8904", "priority": "P2 - HIGH", "assetId": "T-311", "assetName": "Step-Down Transformer T-311", "risk": "68%", "gridImpact": "High (Commercial & Residential Belt)", "recommendedMaintenance": "Vibration damper check & terminal torque adjustment", "dueDate": "Within 3 days", "assignedCrew": "Unassigned", "status": "Pending" },
  { "id": "WO-8905", "priority": "P3 - MEDIUM", "assetId": "F-12", "assetName": "Feeder Line F-12", "risk": "65%", "gridImpact": "High (Industrial Corridor)", "recommendedMaintenance": "Vegetation clearing along span 14-22 and insulator inspection", "dueDate": "Within 4 days", "assignedCrew": "Crew C-01", "status": "Pending" }
]

INITIAL_ALERTS_DATA = [
  { "id": "ALT-101", "severity": "CRITICAL", "title": "Immediate Outage Risk: Transformer T-104", "message": "T-104 outage probability has escalated to 87%. Top-oil temp at 104°C with high vibration (7.8 mm/s).", "assetId": "T-104", "timestamp": "10 mins ago", "actionRequired": "Pre-position Crew C-07 and initiate load shedding." },
  { "id": "ALT-102", "severity": "CRITICAL", "title": "Thermal Limit Breach: Autotransformer T-208", "message": "Autotransformer T-208 top oil temperature reached 98°C.", "assetId": "T-208", "timestamp": "22 mins ago", "actionRequired": "Dispatch Crew C-02 for urgent DGA sampling." },
  { "id": "ALT-103", "severity": "HIGH", "title": "Substation Busbar Vibration Alarm: S-21", "message": "High vibration (5.4 mm/s) recorded across main busbar structure.", "assetId": "S-21", "timestamp": "50 mins ago", "actionRequired": "Inspect busbar insulator mounting brackets." },
  { "id": "ALT-104", "severity": "HIGH", "title": "High Thermal Warning: Transformer T-311", "message": "Top oil temperature reached 92°C.", "assetId": "T-311", "timestamp": "1 hour ago", "actionRequired": "Monitor cooling fans." },
  { "id": "ALT-105", "severity": "MEDIUM", "title": "Vegetation Risk: Feeder F-12", "message": "High wind speed causing tree limb proximity risk along span 18.", "assetId": "F-12", "timestamp": "2 hours ago", "actionRequired": "Trim tree branches." }
]

INITIAL_OUTAGES_DATA = [
  { "id": "OUT-901", "asset_id": "F-12", "substation": "Substation S-21", "customers_affected": 3400, "estimated_restoration_time": "1 hour 30 mins", "outage_type": "Tree Branch Conductor Trip", "status": "Restoration In Progress", "started_at": "45 mins ago" },
  { "id": "OUT-902", "asset_id": "T-104", "substation": "Substation S-21", "customers_affected": 12500, "estimated_restoration_time": "2 hours", "outage_type": "Thermal Protection Isolation", "status": "Investigating", "started_at": "15 mins ago" },
  { "id": "OUT-903", "asset_id": "T-208", "substation": "Substation S-08", "customers_affected": 8200, "estimated_restoration_time": "3 hours", "outage_type": "Cooling System Trip", "status": "Crew On Site", "started_at": "30 mins ago" },
  { "id": "OUT-904", "asset_id": "S-21", "substation": "Substation S-21", "customers_affected": 0, "estimated_restoration_time": "1 hour", "outage_type": "Busbar Inspection", "status": "Planned Outage", "started_at": "1 hour ago" }
]

def init_db(force: bool = False):
    print("[GRIDGUARD DB] Initializing PostgreSQL schema & tables...")
    if force:
        print("[GRIDGUARD DB] Force option enabled. Dropping all existing PostgreSQL tables...")
        Base.metadata.drop_all(bind=engine)
    
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # Seed Assets (5 items)
        if db.query(AssetModel).count() == 0 or force:
            print("[GRIDGUARD DB] Seeding 5 test assets into PostgreSQL...")
            for item in INITIAL_ASSETS_DATA:
                db.add(AssetModel(**item))
            db.commit()

        # Seed Asset Sensors & Sensor Readings for 5 assets
        if db.query(AssetSensorModel).count() == 0 or force:
            print("[GRIDGUARD DB] Seeding asset_sensors & sensor_readings...")
            sensor_types = [
                ("Temperature", "°C", "< 90°C", 60.0, 105.0),
                ("Vibration", "mm/s", "< 4.5 mm/s", 1.2, 8.5),
                ("Oil Quality", "%", "> 80%", 55.0, 98.0),
                ("Partial Discharge", "pC", "< 25 pC", 5.0, 95.0),
                ("Current Load", "Amps", "< 1000A", 200.0, 950.0)
            ]
            
            assets = db.query(AssetModel).all()
            for asset in assets:
                for stype, unit, thresh, min_val, max_val in sensor_types:
                    sensor_id = f"SEN-{asset.id}-{stype[:4].upper()}"
                    curr_val = round(random.uniform(min_val, max_val), 1)
                    status = "Critical" if (curr_val > 90 and stype == "Temperature") or (curr_val > 6.0 and stype == "Vibration") else "Healthy"
                    
                    db.add(AssetSensorModel(
                        id=sensor_id,
                        assetId=asset.id,
                        type=stype,
                        value=f"{curr_val} {unit}",
                        unit=unit,
                        status=status,
                        threshold=thresh,
                        lastUpdated="Live"
                    ))
                    
                    for hour_offset in range(4):
                        ts = (datetime.now() - timedelta(hours=hour_offset * 3)).strftime("%Y-%m-%d %H:%M:%S")
                        rval = round(curr_val + random.uniform(-2.0, 2.0), 1)
                        db.add(SensorReadingModel(
                            sensor_id=sensor_id,
                            asset_id=asset.id,
                            reading_type=stype,
                            reading_value=rval,
                            unit=unit,
                            timestamp=ts
                        ))
            db.commit()

        # Seed Predictions & Risk Scores for 5 assets
        if db.query(PredictionModel).count() == 0 or force:
            print("[GRIDGUARD DB] Seeding predictions & risk_scores...")
            assets = db.query(AssetModel).all()
            for asset in assets:
                db.add(PredictionModel(
                    id=f"PRED-{asset.id}",
                    asset_id=asset.id,
                    predicted_failure_risk=asset.failureProbability,
                    failure_mode="Thermal Overload & Insulation Breakdown" if asset.failureProbability > 0.6 else "Normal Wear",
                    estimated_rsl_days=int((1.0 - asset.failureProbability) * 365),
                    confidence_score=round(random.uniform(0.85, 0.98), 2),
                    explanation=f"Calculated composite risk score of {asset.riskScore}% based on telemetry signatures.",
                    timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                ))
                
                db.add(RiskScoreModel(
                    id=f"RISK-{asset.id}",
                    asset_id=asset.id,
                    probability_score=asset.failureProbability,
                    consequence_score=0.9 if "Critical" in asset.gridImpact else 0.6,
                    total_risk_score=asset.riskScore,
                    risk_matrix_category=asset.riskLevel,
                    updated_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                ))
            db.commit()

        # Seed Weather
        if db.query(WeatherModel).count() == 0 or force:
            print("[GRIDGUARD DB] Seeding weather table...")
            for item in INITIAL_WEATHER_DATA:
                db.add(WeatherModel(**item))
            db.commit()

        # Seed Incidents
        if db.query(IncidentModel).count() == 0 or force:
            print("[GRIDGUARD DB] Seeding incidents table...")
            for item in INITIAL_INCIDENTS_DATA:
                db.add(IncidentModel(**item))
            db.commit()

        # Seed Maintenance
        if db.query(MaintenanceModel).count() == 0 or force:
            print("[GRIDGUARD DB] Seeding maintenance table...")
            for item in INITIAL_MAINTENANCE_DATA:
                db.add(MaintenanceModel(**item))
            db.commit()

        # Seed Crews
        if db.query(CrewModel).count() == 0 or force:
            print("[GRIDGUARD DB] Seeding crews table...")
            for item in INITIAL_CREWS_DATA:
                db.add(CrewModel(**item))
            db.commit()

        # Seed Alerts
        if db.query(AlertModel).count() == 0 or force:
            print("[GRIDGUARD DB] Seeding alerts table...")
            for item in INITIAL_ALERTS_DATA:
                db.add(AlertModel(**item))
            db.commit()

        # Seed Outages
        if db.query(OutageModel).count() == 0 or force:
            print("[GRIDGUARD DB] Seeding outages table...")
            for item in INITIAL_OUTAGES_DATA:
                db.add(OutageModel(**item))
            db.commit()

        print("[GRIDGUARD DB] PostgreSQL tables & 5 test asset datasets initialized successfully!")
    except Exception as e:
        db.rollback()
        print(f"[GRIDGUARD DB] Seeding error: {e}")
        raise e
    finally:
        db.close()



