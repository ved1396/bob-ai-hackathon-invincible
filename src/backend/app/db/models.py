from sqlalchemy import Column, String, Integer, Float, JSON, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.db.database import Base

class AssetModel(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    assetCategory = Column(String, nullable=False)
    substation = Column(String, nullable=False)
    location = Column(String, nullable=False)
    voltage = Column(String, nullable=False)
    capacity = Column(String, nullable=False)
    age = Column(Integer, default=10)
    commissionedYear = Column(Integer, default=2015)
    healthScore = Column(Integer, default=50)
    failureProbability = Column(Float, default=0.5)
    riskScore = Column(Integer, default=50)
    riskLevel = Column(String, default="MEDIUM")
    gridImpact = Column(String, nullable=False)
    topOilTemp = Column(Float, default=70.0)
    tempThreshold = Column(Float, default=90.0)
    vibration = Column(Float, default=2.0)
    vibrationThreshold = Column(Float, default=4.5)
    oilQuality = Column(Float, default=80.0)
    oilQualityThreshold = Column(Float, default=80.0)
    partialDischarge = Column(String, default="Nominal")
    loadPct = Column(Float, default=70.0)
    currentAmps = Column(Float, default=500.0)
    voltageKv = Column(Float, default=138.0)
    weatherImpact = Column(String, default="Nominal")
    lastMaintenance = Column(String, default="2026-01-01")
    nextMaintenanceDue = Column(String, default="Within 7 days")
    prescribedAction = Column(Text, nullable=True)
    attributionReasons = Column(JSON, default=list)
    created_at = Column(DateTime, server_default=func.now())

class AssetSensorModel(Base):
    __tablename__ = "asset_sensors"

    id = Column(String, primary_key=True, index=True)
    assetId = Column(String, ForeignKey("assets.id", ondelete="CASCADE"), index=True, nullable=False)
    type = Column(String, nullable=False)
    value = Column(String, nullable=False)
    unit = Column(String, nullable=False)
    status = Column(String, nullable=False)
    threshold = Column(String, nullable=False)
    lastUpdated = Column(String, default="Live")
    created_at = Column(DateTime, server_default=func.now())

class SensorReadingModel(Base):
    __tablename__ = "sensor_readings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    sensor_id = Column(String, ForeignKey("asset_sensors.id", ondelete="CASCADE"), index=True, nullable=False)
    asset_id = Column(String, ForeignKey("assets.id", ondelete="CASCADE"), index=True, nullable=False)
    reading_type = Column(String, nullable=False)
    reading_value = Column(Float, nullable=False)
    unit = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class WeatherModel(Base):
    __tablename__ = "weather"

    id = Column(String, primary_key=True, index=True)
    region = Column(String, nullable=False)
    condition = Column(String, nullable=False)
    temperature = Column(String, nullable=False)
    humidity = Column(String, nullable=False)
    windSpeed = Column(String, nullable=False)
    rainfall = Column(String, nullable=False)
    stormProbability = Column(String, nullable=False)
    lightningRisk = Column(String, nullable=False)
    riskMultiplier = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    alertMessage = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class PredictionModel(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, index=True)
    asset_id = Column(String, ForeignKey("assets.id", ondelete="CASCADE"), index=True, nullable=False)
    predicted_failure_risk = Column(Float, nullable=False)
    failure_mode = Column(String, nullable=False)
    estimated_rsl_days = Column(Integer, nullable=False)
    confidence_score = Column(Float, nullable=False)
    explanation = Column(Text, nullable=True)
    timestamp = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class RiskScoreModel(Base):
    __tablename__ = "risk_scores"

    id = Column(String, primary_key=True, index=True)
    asset_id = Column(String, ForeignKey("assets.id", ondelete="CASCADE"), index=True, nullable=False)
    probability_score = Column(Float, nullable=False)
    consequence_score = Column(Float, nullable=False)
    total_risk_score = Column(Integer, nullable=False)
    risk_matrix_category = Column(String, nullable=False)
    updated_at = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class IncidentModel(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    assetId = Column(String, ForeignKey("assets.id", ondelete="SET NULL"), index=True, nullable=True)
    title = Column(String, nullable=False)
    severity = Column(String, nullable=False)
    detectedTime = Column(String, nullable=False)
    cause = Column(String, nullable=False)
    status = Column(String, default="Open")
    assignedCrew = Column(String, default="Unassigned")
    location = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class MaintenanceModel(Base):
    __tablename__ = "maintenance"

    id = Column(String, primary_key=True, index=True)
    priority = Column(String, nullable=False)
    assetId = Column(String, ForeignKey("assets.id", ondelete="SET NULL"), index=True, nullable=True)
    assetName = Column(String, nullable=False)
    risk = Column(String, nullable=False)
    gridImpact = Column(String, nullable=False)
    recommendedMaintenance = Column(Text, nullable=False)
    dueDate = Column(String, nullable=False)
    assignedCrew = Column(String, default="Unassigned")
    status = Column(String, default="Pending")
    created_at = Column(DateTime, server_default=func.now())

class CrewModel(Base):
    __tablename__ = "crews"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    lead = Column(String, nullable=False)
    membersCount = Column(Integer, default=3)
    currentLocation = Column(String, nullable=False)
    availability = Column(String, nullable=False)
    skills = Column(JSON, default=list)
    nearestRiskZone = Column(String, nullable=False)
    recommendedPosition = Column(Text, nullable=False)
    eta = Column(String, nullable=False)
    status = Column(String, default="Available")
    created_at = Column(DateTime, server_default=func.now())

class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    severity = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    assetId = Column(String, ForeignKey("assets.id", ondelete="SET NULL"), index=True, nullable=True)
    timestamp = Column(String, nullable=False)
    actionRequired = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

class OutageModel(Base):
    __tablename__ = "outages"

    id = Column(String, primary_key=True, index=True)
    asset_id = Column(String, ForeignKey("assets.id", ondelete="SET NULL"), index=True, nullable=True)
    substation = Column(String, nullable=False)
    customers_affected = Column(Integer, default=0)
    estimated_restoration_time = Column(String, nullable=False)
    outage_type = Column(String, nullable=False)
    status = Column(String, default="Active")
    started_at = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

