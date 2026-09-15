-- =====================================================================
-- GRIDGUARD AI - Complete PostgreSQL Database Schema & Seed Data Script
-- Platform: Supabase / PostgreSQL
-- Description: Creates all 11 core tables with PKs, FKs, indexes, constraints,
--              and populates initial realistic seed data.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Clean Existing Tables (Reverse Dependency Order)
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS outages CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS crews CASCADE;
DROP TABLE IF EXISTS maintenance CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS risk_scores CASCADE;
DROP TABLE IF EXISTS predictions CASCADE;
DROP TABLE IF EXISTS weather CASCADE;
DROP TABLE IF EXISTS sensor_readings CASCADE;
DROP TABLE IF EXISTS asset_sensors CASCADE;
DROP TABLE IF EXISTS assets CASCADE;

-- ---------------------------------------------------------------------
-- 1. Create Table: assets
-- ---------------------------------------------------------------------
CREATE TABLE assets (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    "assetCategory" VARCHAR(100) NOT NULL,
    substation VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    voltage VARCHAR(100) NOT NULL,
    capacity VARCHAR(100) NOT NULL,
    age INTEGER DEFAULT 10,
    "commissionedYear" INTEGER DEFAULT 2015,
    "healthScore" INTEGER DEFAULT 50,
    "failureProbability" DOUBLE PRECISION DEFAULT 0.5,
    "riskScore" INTEGER DEFAULT 50,
    "riskLevel" VARCHAR(50) DEFAULT 'MEDIUM',
    "gridImpact" VARCHAR(255) NOT NULL,
    "topOilTemp" DOUBLE PRECISION DEFAULT 70.0,
    "tempThreshold" DOUBLE PRECISION DEFAULT 90.0,
    vibration DOUBLE PRECISION DEFAULT 2.0,
    "vibrationThreshold" DOUBLE PRECISION DEFAULT 4.5,
    "oilQuality" DOUBLE PRECISION DEFAULT 80.0,
    "oilQualityThreshold" DOUBLE PRECISION DEFAULT 80.0,
    "partialDischarge" VARCHAR(100) DEFAULT 'Nominal',
    "loadPct" DOUBLE PRECISION DEFAULT 70.0,
    "currentAmps" DOUBLE PRECISION DEFAULT 500.0,
    "voltageKv" DOUBLE PRECISION DEFAULT 138.0,
    "weatherImpact" VARCHAR(255) DEFAULT 'Nominal',
    "lastMaintenance" VARCHAR(100) DEFAULT '2026-01-01',
    "nextMaintenanceDue" VARCHAR(100) DEFAULT 'Within 7 days',
    "prescribedAction" TEXT,
    "attributionReasons" JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_substation ON assets(substation);
CREATE INDEX idx_assets_risk_level ON assets("riskLevel");

-- ---------------------------------------------------------------------
-- 2. Create Table: asset_sensors
-- ---------------------------------------------------------------------
CREATE TABLE asset_sensors (
    id VARCHAR(100) PRIMARY KEY,
    "assetId" VARCHAR(50) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    value VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    threshold VARCHAR(100) NOT NULL,
    "lastUpdated" VARCHAR(100) DEFAULT 'Live',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_asset_sensors_assetId ON asset_sensors("assetId");

-- ---------------------------------------------------------------------
-- 3. Create Table: sensor_readings
-- ---------------------------------------------------------------------
CREATE TABLE sensor_readings (
    id SERIAL PRIMARY KEY,
    sensor_id VARCHAR(100) NOT NULL REFERENCES asset_sensors(id) ON DELETE CASCADE,
    asset_id VARCHAR(50) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    reading_type VARCHAR(100) NOT NULL,
    reading_value DOUBLE PRECISION NOT NULL,
    unit VARCHAR(50) NOT NULL,
    timestamp VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_asset_id ON sensor_readings(asset_id);

-- ---------------------------------------------------------------------
-- 4. Create Table: weather
-- ---------------------------------------------------------------------
CREATE TABLE weather (
    id VARCHAR(100) PRIMARY KEY,
    region VARCHAR(255) NOT NULL,
    condition VARCHAR(100) NOT NULL,
    temperature VARCHAR(50) NOT NULL,
    humidity VARCHAR(50) NOT NULL,
    "windSpeed" VARCHAR(50) NOT NULL,
    rainfall VARCHAR(50) NOT NULL,
    "stormProbability" VARCHAR(50) NOT NULL,
    "lightningRisk" VARCHAR(50) NOT NULL,
    "riskMultiplier" VARCHAR(50) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    "alertMessage" TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 5. Create Table: predictions
-- ---------------------------------------------------------------------
CREATE TABLE predictions (
    id VARCHAR(100) PRIMARY KEY,
    asset_id VARCHAR(50) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    predicted_failure_risk DOUBLE PRECISION NOT NULL,
    failure_mode VARCHAR(255) NOT NULL,
    estimated_rsl_days INTEGER NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL,
    explanation TEXT,
    timestamp VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_predictions_asset_id ON predictions(asset_id);

-- ---------------------------------------------------------------------
-- 6. Create Table: risk_scores
-- ---------------------------------------------------------------------
CREATE TABLE risk_scores (
    id VARCHAR(100) PRIMARY KEY,
    asset_id VARCHAR(50) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    probability_score DOUBLE PRECISION NOT NULL,
    consequence_score DOUBLE PRECISION NOT NULL,
    total_risk_score INTEGER NOT NULL,
    risk_matrix_category VARCHAR(50) NOT NULL,
    updated_at VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_risk_scores_asset_id ON risk_scores(asset_id);

-- ---------------------------------------------------------------------
-- 7. Create Table: incidents
-- ---------------------------------------------------------------------
CREATE TABLE incidents (
    id VARCHAR(100) PRIMARY KEY,
    "assetId" VARCHAR(50) REFERENCES assets(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    "detectedTime" VARCHAR(100) NOT NULL,
    cause VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Open',
    "assignedCrew" VARCHAR(100) DEFAULT 'Unassigned',
    location VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_incidents_assetId ON incidents("assetId");

-- ---------------------------------------------------------------------
-- 8. Create Table: maintenance
-- ---------------------------------------------------------------------
CREATE TABLE maintenance (
    id VARCHAR(100) PRIMARY KEY,
    priority VARCHAR(50) NOT NULL,
    "assetId" VARCHAR(50) REFERENCES assets(id) ON DELETE SET NULL,
    "assetName" VARCHAR(255) NOT NULL,
    risk VARCHAR(50) NOT NULL,
    "gridImpact" VARCHAR(255) NOT NULL,
    "recommendedMaintenance" TEXT NOT NULL,
    "dueDate" VARCHAR(100) NOT NULL,
    "assignedCrew" VARCHAR(100) DEFAULT 'Unassigned',
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_maintenance_assetId ON maintenance("assetId");

-- ---------------------------------------------------------------------
-- 9. Create Table: crews
-- ---------------------------------------------------------------------
CREATE TABLE crews (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lead VARCHAR(255) NOT NULL,
    "membersCount" INTEGER DEFAULT 3,
    "currentLocation" VARCHAR(255) NOT NULL,
    availability VARCHAR(100) NOT NULL,
    skills JSONB DEFAULT '[]'::jsonb,
    "nearestRiskZone" VARCHAR(255) NOT NULL,
    "recommendedPosition" TEXT NOT NULL,
    eta VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Available',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ---------------------------------------------------------------------
-- 10. Create Table: alerts
-- ---------------------------------------------------------------------
CREATE TABLE alerts (
    id VARCHAR(100) PRIMARY KEY,
    severity VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    "assetId" VARCHAR(50) REFERENCES assets(id) ON DELETE SET NULL,
    timestamp VARCHAR(100) NOT NULL,
    "actionRequired" TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alerts_assetId ON alerts("assetId");

-- ---------------------------------------------------------------------
-- 11. Create Table: outages
-- ---------------------------------------------------------------------
CREATE TABLE outages (
    id VARCHAR(100) PRIMARY KEY,
    asset_id VARCHAR(50) REFERENCES assets(id) ON DELETE SET NULL,
    substation VARCHAR(100) NOT NULL,
    customers_affected INTEGER DEFAULT 0,
    estimated_restoration_time VARCHAR(100) NOT NULL,
    outage_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    started_at VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_outages_asset_id ON outages(asset_id);


-- =====================================================================
-- SEED DATA INSERTION
-- =====================================================================

-- 1. Insert 5 Assets
INSERT INTO assets (
    id, name, type, "assetCategory", substation, location, voltage, capacity,
    age, "commissionedYear", "healthScore", "failureProbability", "riskScore", "riskLevel",
    "gridImpact", "topOilTemp", "tempThreshold", vibration, "vibrationThreshold",
    "oilQuality", "oilQualityThreshold", "partialDischarge", "loadPct", "currentAmps",
    "voltageKv", "weatherImpact", "lastMaintenance", "nextMaintenanceDue",
    "prescribedAction", "attributionReasons"
) VALUES
(
    'T-104',
    'Step-Down Substation Transformer T-104',
    'Transformer',
    'Transformer',
    'Substation S-21',
    'Zone 4 - North Industrial Corridor',
    'Primary 345kV / Secondary 138kV',
    '120 MVA',
    12, 2014, 34, 0.87, 87, 'CRITICAL',
    'Critical (345kV Bulk Power Transmission)',
    104.0, 90.0, 7.8, 4.5, 62.0, 80.0, '88 pC (High Risk)', 94.0, 840.0, 342.0,
    'Severe Storm & Heavy Wind (+18%)', '2026-02-14', 'Immediate (24 hours)',
    'Emergency cooling thermal inspection & pre-position Crew C-07 for immediate coil replacement.',
    '["Top-oil temperature exceeded upper thermal limit (104°C vs 90°C limit)", "Vibration harmonics elevated 23% over last 6 hours (7.8 mm/s)", "Dielectric oil breakdown voltage degraded to 62%"]'::jsonb
),
(
    'T-208',
    'Bulk Transmission Autotransformer T-208',
    'Transformer',
    'Transformer',
    'Substation S-08',
    'Zone 2 - East Metropolitan Substation',
    'Primary 230kV / Secondary 115kV',
    '100 MVA',
    15, 2011, 48, 0.79, 79, 'CRITICAL',
    'Critical (High Capacity Metro Grid)',
    98.0, 90.0, 6.9, 4.5, 65.0, 80.0, '72 pC (Elevated)', 89.0, 760.0, 228.0,
    'High Temperature & Wind (+12%)', '2025-11-10', 'Today',
    'Perform Dissolved Gas Analysis (DGA) & examine phase B bushing thermal camera readings.',
    '["Acetylene & ethylene gas concentrations elevated in oil DGA sample", "Top oil temperature thermal anomaly (98°C)"]'::jsonb
),
(
    'S-21',
    'Regional Switching Substation S-21',
    'Substation',
    'Substation',
    'Substation S-21',
    'Zone 4 - North Industrial Corridor',
    '345kV / 138kV / 34.5kV',
    '450 MVA Total',
    18, 2008, 52, 0.74, 74, 'HIGH',
    'Critical (Regional Interconnect)',
    88.0, 90.0, 5.4, 4.5, 71.0, 80.0, '45 pC', 91.0, 1820.0, 344.0,
    'Storm & Lightning Risk (+14%)', '2026-01-05', 'Within 48 hours',
    'Inspect busbar insulation & verify surge arrester integrity ahead of lightning storm.',
    '["Substation busbar mechanical vibration elevated", "High total throughput load near peak capacity"]'::jsonb
),
(
    'T-311',
    'Step-Down Transformer T-311',
    'Transformer',
    'Transformer',
    'Substation S-14',
    'Zone 1 - West Residential District',
    'Primary 138kV / Secondary 34.5kV',
    '75 MVA',
    9, 2017, 58, 0.68, 68, 'HIGH',
    'High (Commercial & Residential Belt)',
    92.0, 90.0, 5.9, 4.5, 74.0, 80.0, '54 pC', 84.0, 540.0, 136.0,
    'High Wind Loading (+10%)', '2026-03-01', 'Within 3 days',
    'Vibration diagnostic check & tighten terminal mounting hardware.',
    '["High wind loading causing mechanical stress on gantry connection"]'::jsonb
),
(
    'F-12',
    'Feeder Trunk Distribution Line F-12',
    'Feeder',
    'Feeder',
    'Substation S-21',
    'Zone 4 - Industrial Feed',
    '34.5 kV',
    '30 MVA',
    7, 2019, 61, 0.65, 65, 'HIGH',
    'High (Key Industrial Plants)',
    78.0, 90.0, 3.2, 4.5, 82.0, 80.0, '18 pC', 88.0, 490.0, 34.1,
    'High Wind & Tree Line Risk (+15%)', '2026-02-20', 'Within 4 days',
    'Inspect vegetation clearance along section 4B and clear fallen branches.',
    '["High wind speed (55 km/h) causing conductor galloping risk"]'::jsonb
);

-- 2. Insert Asset Sensors (for test assets)
INSERT INTO asset_sensors (id, "assetId", type, value, unit, status, threshold, "lastUpdated") VALUES
('SEN-T-104-TEMP', 'T-104', 'Temperature', '104.0 °C', '°C', 'Critical', '< 90°C', 'Live'),
('SEN-T-104-VIB', 'T-104', 'Vibration', '7.8 mm/s', 'mm/s', 'Critical', '< 4.5 mm/s', 'Live'),
('SEN-T-104-OIL', 'T-104', 'Oil Quality', '62.0 %', '%', 'Healthy', '> 80%', 'Live'),
('SEN-T-208-TEMP', 'T-208', 'Temperature', '98.0 °C', '°C', 'Critical', '< 90°C', 'Live'),
('SEN-S-21-VIB', 'S-21', 'Vibration', '5.4 mm/s', 'mm/s', 'Healthy', '< 4.5 mm/s', 'Live');

-- 3. Insert Sensor Readings
INSERT INTO sensor_readings (sensor_id, asset_id, reading_type, reading_value, unit, timestamp) VALUES
('SEN-T-104-TEMP', 'T-104', 'Temperature', 104.0, '°C', '2026-09-14 22:00:00'),
('SEN-T-104-VIB', 'T-104', 'Vibration', 7.8, 'mm/s', '2026-09-14 22:00:00'),
('SEN-T-104-OIL', 'T-104', 'Oil Quality', 62.0, '%', '2026-09-14 22:00:00'),
('SEN-T-208-TEMP', 'T-208', 'Temperature', 98.0, '°C', '2026-09-14 22:00:00'),
('SEN-S-21-VIB', 'S-21', 'Vibration', 5.4, 'mm/s', '2026-09-14 22:00:00');

-- 4. Insert Weather Data
INSERT INTO weather (
    id, region, condition, temperature, humidity, "windSpeed", rainfall,
    "stormProbability", "lightningRisk", "riskMultiplier", severity, "alertMessage"
) VALUES
(
    'WX-ZONE4',
    'Zone 4 - North Industrial Corridor (Substation S-21)',
    'Heavy Thunderstorm & Wind',
    '32°C', '88%', '55 km/h', '45 mm/h', '85%', 'High', '+18%', 'Critical',
    'Convective storm front with 55 km/h wind gusts active in Zone 4. High failure risk on T-104 and feeder F-12.'
),
(
    'WX-ZONE2',
    'Zone 2 - East Metropolitan (Substation S-08)',
    'High Wind & Extreme Heat',
    '34°C', '75%', '42 km/h', '12 mm/h', '60%', 'Moderate', '+12%', 'High',
    'Elevated ambient temperature causing high cooling stress on autotransformer T-208.'
),
(
    'WX-ZONE1',
    'Zone 1 - West Residential District (Substation S-14)',
    'Moderate Wind',
    '28°C', '65%', '25 km/h', '5 mm/h', '30%', 'Low', '+5%', 'Moderate',
    'Normal seasonal winds with light precipitation.'
),
(
    'WX-ZONE3',
    'Zone 3 - Central Business District',
    'Clear & Warm',
    '30°C', '55%', '15 km/h', '0 mm/h', '10%', 'Low', '+0%', 'Low',
    'Stable weather conditions in downtown power distribution belt.'
);

-- 5. Insert Predictions
INSERT INTO predictions (
    id, asset_id, predicted_failure_risk, failure_mode, estimated_rsl_days,
    confidence_score, explanation, timestamp
) VALUES
('PRED-T-104', 'T-104', 0.87, 'Thermal Overload & Insulation Breakdown', 47, 0.96, 'Calculated composite risk score of 87% based on telemetry signatures.', '2026-09-14 22:00:00'),
('PRED-T-208', 'T-208', 0.79, 'Thermal Overload & Bushing Stress', 76, 0.94, 'Calculated composite risk score of 79% based on telemetry signatures.', '2026-09-14 22:00:00'),
('PRED-S-21',  'S-21',  0.74, 'Harmonic Mechanical Resonance', 94, 0.91, 'Calculated composite risk score of 74% based on telemetry signatures.', '2026-09-14 22:00:00'),
('PRED-T-311', 'T-311', 0.68, 'Wind Stress Gantry Connection', 116, 0.89, 'Calculated composite risk score of 68% based on telemetry signatures.', '2026-09-14 22:00:00'),
('PRED-F-12',  'F-12',  0.65, 'Vegetation Contact Risk', 127, 0.87, 'Calculated composite risk score of 65% based on telemetry signatures.', '2026-09-14 22:00:00');

-- 6. Insert Risk Scores
INSERT INTO risk_scores (
    id, asset_id, probability_score, consequence_score, total_risk_score,
    risk_matrix_category, updated_at
) VALUES
('RISK-T-104', 'T-104', 0.87, 0.9, 87, 'CRITICAL', '2026-09-14 22:00:00'),
('RISK-T-208', 'T-208', 0.79, 0.9, 79, 'CRITICAL', '2026-09-14 22:00:00'),
('RISK-S-21',  'S-21',  0.74, 0.9, 74, 'HIGH',     '2026-09-14 22:00:00'),
('RISK-T-311', 'T-311', 0.68, 0.6, 68, 'HIGH',     '2026-09-14 22:00:00'),
('RISK-F-12',  'F-12',  0.65, 0.6, 65, 'HIGH',     '2026-09-14 22:00:00');

-- 7. Insert Incidents
INSERT INTO incidents (
    id, "assetId", title, severity, "detectedTime", cause, status, "assignedCrew", location
) VALUES
('INC-2041', 'T-104', 'Transformer T-104 failure risk spike to 87%', 'CRITICAL', '12 mins ago', 'Thermal overload (104°C) combined with high vibration', 'Crew Dispatched', 'Crew C-07', 'Substation S-21'),
('INC-2042', 'T-208', 'Autotransformer T-208 top oil temp 98°C alert', 'CRITICAL', '25 mins ago', 'Cooling fan failure under peak metro demand', 'Investigating', 'Crew C-02', 'Substation S-08'),
('INC-2043', 'S-21',  'Substation S-21 busbar vibration threshold breach', 'HIGH', '45 mins ago', 'Harmonic resonance under high storm gusts', 'Open', 'Crew C-03', 'Substation S-21'),
('INC-2044', 'F-12',  'Feeder F-12 tree branch strike risk', 'HIGH', '1 hour ago', 'Heavy wind speed (55 km/h) near tree line', 'Open', 'Crew C-01', 'Substation S-21'),
('INC-2045', 'T-311', 'Transformer T-311 thermal warning', 'HIGH', '2 hours ago', 'Residential peak load spike', 'Open', 'Unassigned', 'Substation S-14');

-- 8. Insert Maintenance Records
INSERT INTO maintenance (
    id, priority, "assetId", "assetName", risk, "gridImpact",
    "recommendedMaintenance", "dueDate", "assignedCrew", status
) VALUES
('WO-8901', 'P1 - CRITICAL', 'T-104', 'Step-Down Transformer T-104', '87%', 'Critical (345kV Bulk Power)', 'Emergency thermal cooling system inspection & oil sampling', 'Today (Immediate)', 'Crew C-07', 'Pending'),
('WO-8902', 'P1 - CRITICAL', 'T-208', 'Bulk Autotransformer T-208', '79%', 'Critical (Metro Grid)', 'Dissolved Gas Analysis (DGA) & bushing thermal sweep', 'Today (Within 6h)', 'Crew C-02', 'Scheduled'),
('WO-8903', 'P2 - HIGH',     'S-21',  'Regional Substation S-21', '74%', 'Critical (Regional Interconnect)', 'Busbar damper tightening and surge arrester check', 'Tomorrow', 'Crew C-03', 'Scheduled'),
('WO-8904', 'P2 - HIGH',     'T-311', 'Step-Down Transformer T-311', '68%', 'High (Commercial & Residential Belt)', 'Vibration damper check & terminal torque adjustment', 'Within 3 days', 'Unassigned', 'Pending'),
('WO-8905', 'P3 - MEDIUM',   'F-12',  'Feeder Line F-12', '65%', 'High (Industrial Corridor)', 'Vegetation clearing along span 14-22 and insulator inspection', 'Within 4 days', 'Crew C-01', 'Pending');

-- 9. Insert Crews
INSERT INTO crews (
    id, name, lead, "membersCount", "currentLocation", availability,
    skills, "nearestRiskZone", "recommendedPosition", eta, status
) VALUES
(
    'CREW-C07', 'Crew C-07 (HV Transformer Specialists)', 'Dave Miller (Senior High-Voltage Engineer)', 4,
    'Zone 4 Base Station (6 km from Substation S-21)', 'Available / High Priority Dispatch',
    '["HV Transformers", "DGA Oil Testing", "Substation Protection"]'::jsonb,
    'Zone 4 (Risk Level 87%)', 'Pre-position at Substation S-21 near Transformer T-104', '14 mins', 'Pre-Positioned'
),
(
    'CREW-C02', 'Crew C-02 (Oil Diagnostic Specialists)', 'Sarah Jenkins (Chemical & Dielectric Specialist)', 3,
    'East Depot (8 km from Substation S-08)', 'Available',
    '["Dielectric Fluid Sampling", "DGA Analysis"]'::jsonb,
    'Zone 2 (Risk Level 79%)', 'Pre-position at Substation S-08 for Autotransformer T-208 DGA', '18 mins', 'Dispatched'
),
(
    'CREW-C01', 'Crew C-01 (Line & Feeder Crew)', 'Robert Garcia', 5,
    'North Operations Hub', 'Available',
    '["Overhead Feeders", "Tree Clearing"]'::jsonb,
    'Zone 4', 'Standby at Zone 4 for Feeder F-12', '25 mins', 'Available'
),
(
    'CREW-C03', 'Crew C-03 (Substation Rapid Response)', 'Elena Rostova', 4,
    'West Substation Hub', 'Busy',
    '["Switchgear", "Busbar Maintenance"]'::jsonb,
    'Zone 1', 'Positioned at Substation S-14', '10 mins', 'Dispatched'
);

-- 10. Insert Alerts
INSERT INTO alerts (
    id, severity, title, message, "assetId", timestamp, "actionRequired"
) VALUES
('ALT-101', 'CRITICAL', 'Immediate Outage Risk: Transformer T-104', 'T-104 outage probability has escalated to 87%. Top-oil temp at 104°C with high vibration (7.8 mm/s).', 'T-104', '10 mins ago', 'Pre-position Crew C-07 and initiate load shedding.'),
('ALT-102', 'CRITICAL', 'Thermal Limit Breach: Autotransformer T-208', 'Autotransformer T-208 top oil temperature reached 98°C.', 'T-208', '22 mins ago', 'Dispatch Crew C-02 for urgent DGA sampling.'),
('ALT-103', 'HIGH', 'Substation Busbar Vibration Alarm: S-21', 'High vibration (5.4 mm/s) recorded across main busbar structure.', 'S-21', '50 mins ago', 'Inspect busbar insulator mounting brackets.'),
('ALT-104', 'HIGH', 'High Thermal Warning: Transformer T-311', 'Top oil temperature reached 92°C.', 'T-311', '1 hour ago', 'Monitor cooling fans.'),
('ALT-105', 'MEDIUM', 'Vegetation Risk: Feeder F-12', 'High wind speed causing tree limb proximity risk along span 18.', 'F-12', '2 hours ago', 'Trim tree branches.');

-- 11. Insert Outages
INSERT INTO outages (
    id, asset_id, substation, customers_affected, estimated_restoration_time,
    outage_type, status, started_at
) VALUES
('OUT-901', 'F-12',  'Substation S-21', 3400,  '1 hour 30 mins', 'Tree Branch Conductor Trip',     'Restoration In Progress', '45 mins ago'),
('OUT-902', 'T-104', 'Substation S-21', 12500, '2 hours',        'Thermal Protection Isolation',  'Investigating',           '15 mins ago'),
('OUT-903', 'T-208', 'Substation S-08', 8200,  '3 hours',        'Cooling System Trip',           'Crew On Site',            '30 mins ago'),
('OUT-904', 'S-21',  'Substation S-21', 0,     '1 hour',         'Busbar Inspection',             'Planned Outage',          '1 hour ago');

-- =====================================================================
-- END OF SCHEMA & SEED SCRIPT
-- =====================================================================
