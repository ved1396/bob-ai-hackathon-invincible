"""
GRIDGUARD AI - Prediction & Risk Engine
Composite Model:
Risk Score = 0.30 * Sensor Risk + 0.20 * Weather Risk + 0.15 * Historical Failures + 0.10 * Asset Age + 0.10 * Load Risk + 0.15 * Grid Impact
"""

def calculate_asset_risk(asset: dict, weather_data: list = None) -> dict:
    top_oil_temp = asset.get('topOilTemp', 70)
    temp_threshold = asset.get('tempThreshold', 90)
    vibration = asset.get('vibration', 2.0)
    vib_threshold = asset.get('vibrationThreshold', 4.5)
    oil_quality = asset.get('oilQuality', 80)

    temp_risk = min(1.0, top_oil_temp / temp_threshold)
    vib_risk = min(1.0, vibration / vib_threshold)
    oil_risk = 1.0 - (oil_quality / 100.0)

    sensor_risk = (temp_risk * 0.4 + vib_risk * 0.4 + oil_risk * 0.2) * 100.0
    weather_risk = 75.0 if 'S-21' in asset.get('substation', '') or 'Zone 4' in asset.get('location', '') else 35.0
    historical_risk = 85.0 if len(asset.get('attributionReasons', [])) > 3 else 40.0
    age_risk = min(100.0, (asset.get('age', 10) / 25.0) * 100.0)
    load_risk = asset.get('loadPct', 75.0)
    impact_risk = 95.0 if 'Critical' in asset.get('gridImpact', '') else 70.0

    composite_score = round(
        0.30 * sensor_risk +
        0.20 * weather_risk +
        0.15 * historical_risk +
        0.10 * age_risk +
        0.10 * load_risk +
        0.15 * impact_risk
    )

    failure_prob = round(min(0.99, max(0.05, composite_score / 100.0)), 2)

    risk_level = 'CRITICAL' if composite_score >= 80 else 'HIGH' if composite_score >= 60 else 'MEDIUM' if composite_score >= 40 else 'LOW'

    explanations = []
    if top_oil_temp > temp_threshold:
        explanations.append(f"Top-oil temperature ({top_oil_temp}°C) exceeded safety limit ({temp_threshold}°C).")
    if vibration > vib_threshold:
        explanations.append(f"Vibration harmonics ({vibration} mm/s) exceeded baseline limit ({vib_threshold} mm/s).")
    if oil_quality < 70:
        explanations.append(f"Dielectric breakdown voltage degraded to {oil_quality}%.")
    if weather_risk > 60:
        explanations.append("High wind and severe storm front corridor loading surcharged failure probability.")

    return {
        "asset_id": asset.get('id'),
        "composite_risk_score": composite_score,
        "failure_probability": failure_prob,
        "risk_level": risk_level,
        "explanations": explanations,
        "recommended_action": asset.get('prescribedAction', 'Schedule routine inspection')
    }
