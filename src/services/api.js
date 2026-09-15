// GRIDGUARD AI - Centralized API Service Layer with PostgreSQL Backend & Demo Fallback
import {
  INITIAL_ASSETS,
  INITIAL_WEATHER,
  INITIAL_SENSORS,
  INITIAL_INCIDENTS,
  INITIAL_MAINTENANCE,
  INITIAL_CREWS,
  INITIAL_ALERTS,
  KPI_SUMMARY
} from '../data/demoData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const DEFAULT_TIMEOUT_MS = 10000; // 10s maximum timeout

async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error(`Database/API timeout (${timeoutMs / 1000}s). Server is taking too long to respond.`);
    }
    throw err;
  }
}

export async function fetchOverviewData() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/overview`);
    if (!res.ok) throw new Error('Failed to fetch overview data');
    return await res.json();
  } catch (err) {
    console.warn('Backend API unavailable, using fallback data:', err.message);
    return { kpis: KPI_SUMMARY, criticalAssets: INITIAL_ASSETS.filter(a => a.riskLevel === 'CRITICAL') };
  }
}

export async function fetchAssets() {
  const res = await fetchWithTimeout(`${BASE_URL}/assets`);
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to fetch assets list from database' }));
    throw new Error(errObj.detail || 'Failed to fetch assets list from database');
  }
  return await res.json();
}

export async function createAsset(assetData) {
  const res = await fetchWithTimeout(`${BASE_URL}/assets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assetData)
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to create asset' }));
    throw new Error(errObj.detail || 'Database/API Error creating asset');
  }
  return await res.json();
}

export async function fetchAssetById(id) {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/assets/${id}`);
    if (!res.ok) throw new Error('Failed to fetch asset details');
    return await res.json();
  } catch (err) {
    return INITIAL_ASSETS.find(a => a.id === id) || INITIAL_ASSETS[0];
  }
}

export async function fetchWeather() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/weather`);
    if (!res.ok) throw new Error('Failed to fetch weather telemetry');
    return await res.json();
  } catch (err) {
    return INITIAL_WEATHER;
  }
}

export async function fetchSensors() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/sensors`);
    if (!res.ok) throw new Error('Failed to fetch sensors');
    return await res.json();
  } catch (err) {
    return INITIAL_SENSORS;
  }
}

export async function fetchIncidents() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/incidents`);
    if (!res.ok) throw new Error('Failed to fetch incidents');
    return await res.json();
  } catch (err) {
    return INITIAL_INCIDENTS;
  }
}

export async function createIncident(incidentData) {
  const res = await fetchWithTimeout(`${BASE_URL}/incidents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(incidentData)
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to create incident' }));
    throw new Error(errObj.detail || 'Failed to create incident');
  }
  return await res.json();
}

export async function updateIncident(incidentId, updateData) {
  const res = await fetchWithTimeout(`${BASE_URL}/incidents/${incidentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to update incident' }));
    throw new Error(errObj.detail || 'Failed to update incident');
  }
  return await res.json();
}

export async function fetchMaintenance() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/maintenance`);
    if (!res.ok) throw new Error('Failed to fetch maintenance tasks');
    return await res.json();
  } catch (err) {
    return INITIAL_MAINTENANCE;
  }
}

export async function createMaintenance(taskData) {
  const res = await fetchWithTimeout(`${BASE_URL}/maintenance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to create work order' }));
    throw new Error(errObj.detail || 'Failed to create work order');
  }
  return await res.json();
}

export async function updateMaintenance(taskId, updateData) {
  const res = await fetchWithTimeout(`${BASE_URL}/maintenance/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to update work order' }));
    throw new Error(errObj.detail || 'Failed to update work order');
  }
  return await res.json();
}

export async function fetchCrews() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/crew-planning`);
    if (!res.ok) throw new Error('Failed to fetch crews');
    return await res.json();
  } catch (err) {
    return INITIAL_CREWS;
  }
}

export async function updateCrew(crewId, updateData) {
  const res = await fetchWithTimeout(`${BASE_URL}/crew-planning/${crewId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData)
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to update crew' }));
    throw new Error(errObj.detail || 'Failed to update crew');
  }
  return await res.json();
}

export async function fetchAlerts() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/alerts`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return await res.json();
  } catch (err) {
    return INITIAL_ALERTS;
  }
}

export async function acknowledgeAlert(alertId) {
  const res = await fetchWithTimeout(`${BASE_URL}/alerts/${alertId}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to acknowledge alert' }));
    throw new Error(errObj.detail || 'Failed to acknowledge alert');
  }
  return await res.json();
}

export async function executeBobAction(actionType, payload) {
  const res = await fetchWithTimeout(`${BASE_URL}/bob/execute-action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionType, payload })
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to execute Bob action' }));
    throw new Error(errObj.detail || 'Failed to execute Bob action on PostgreSQL');
  }
  return await res.json();
}

export async function fetchRiskAnalysis() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/risk-analysis`);
    if (!res.ok) throw new Error('Failed to fetch risk analysis');
    return await res.json();
  } catch (err) {
    console.warn('Backend risk-analysis endpoint failed, deriving from assets:', err.message);
    const assets = await fetchAssets();
    return assets;
  }
}

export async function fetchGridMap() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/grid-map`);
    if (!res.ok) throw new Error('Failed to fetch grid map data');
    return await res.json();
  } catch (err) {
    const assets = await fetchAssets();
    return {
      substations: [
        { id: "S-21", name: "Substation S-21 (North Corridor)", lat: 40.7128, lng: -74.0060, type: "Substation", riskLevel: "CRITICAL", failureProb: 0.87 },
        { id: "S-08", name: "Substation S-08 (East Metro)", lat: 40.7306, lng: -73.9352, type: "Substation", riskLevel: "CRITICAL", failureProb: 0.79 },
        { id: "S-14", name: "Substation S-14 (West District)", lat: 40.7589, lng: -73.9851, type: "Substation", riskLevel: "HIGH", failureProb: 0.68 }
      ],
      assets: assets,
      activeWeatherZones: []
    };
  }
}

export async function updateAsset(id, assetData) {
  const res = await fetchWithTimeout(`${BASE_URL}/assets/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(assetData)
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to update asset' }));
    throw new Error(errObj.detail || 'Failed to update asset in database');
  }
  return await res.json();
}

export async function deleteAsset(id) {
  const res = await fetchWithTimeout(`${BASE_URL}/assets/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to delete asset' }));
    throw new Error(errObj.detail || 'Failed to delete asset in database');
  }
  return await res.json();
}

export async function dispatchCrew(crewId, targetLocation, targetAsset) {
  const res = await fetchWithTimeout(`${BASE_URL}/crews/dispatch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ crewId, targetLocation, targetAsset, status: 'Dispatched' })
  });
  if (!res.ok) {
    const errObj = await res.json().catch(() => ({ detail: 'Failed to dispatch crew' }));
    throw new Error(errObj.detail || 'Failed to dispatch crew');
  }
  return await res.json();
}

export function calculateAssetRiskScore(asset, weatherData = []) {
  const tempRatio = Math.min(1.0, (asset.topOilTemp || 70) / (asset.tempThreshold || 90));
  const vibRatio = Math.min(1.0, (asset.vibration || 2.0) / (asset.vibrationThreshold || 4.5));
  const oilRisk = 1.0 - ((asset.oilQuality || 80) / 100);
  const sensorRisk = (tempRatio * 0.4 + vibRatio * 0.4 + oilRisk * 0.2) * 100;

  const weatherObj = weatherData.find(w => w.region?.includes(asset.substation)) || weatherData[0] || {};
  const weatherRiskMultiplier = parseFloat(weatherObj.riskMultiplier || '+10%') / 100 || 0.10;
  const weatherRisk = Math.min(100, (sensorRisk * 0.5) + (weatherRiskMultiplier * 100));

  const historicalRisk = asset.attributionReasons?.length > 3 ? 85 : 45;
  const ageRisk = Math.min(100, (asset.age / 25) * 100);
  const loadRisk = asset.loadPct || 70;
  const impactRisk = asset.gridImpact?.includes('Critical') ? 95 : asset.gridImpact?.includes('High') ? 75 : 40;

  const compositeScore = Math.round(
    0.30 * sensorRisk +
    0.20 * weatherRisk +
    0.15 * historicalRisk +
    0.10 * ageRisk +
    0.10 * loadRisk +
    0.15 * impactRisk
  );

  return {
    compositeScore: Math.min(99, Math.max(10, compositeScore)),
    sensorRisk: Math.round(sensorRisk),
    weatherRisk: Math.round(weatherRisk),
    historicalRisk,
    ageRisk: Math.round(ageRisk),
    loadRisk: Math.round(loadRisk),
    impactRisk: Math.round(impactRisk)
  };
}


