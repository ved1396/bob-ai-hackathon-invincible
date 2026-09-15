import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BobDrawerProvider } from './context/BobDrawerContext';

import { OverviewPage } from './pages/OverviewPage';
import { AssetsPage } from './pages/AssetsPage';
import { AssetDetailsPage } from './pages/AssetDetailsPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { GridMapPage } from './pages/GridMapPage';
import { WeatherPage } from './pages/WeatherPage';
import { SensorHealthPage } from './pages/SensorHealthPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { MaintenancePage } from './pages/MaintenancePage';
import { CrewPlanningPage } from './pages/CrewPlanningPage';
import { AlertsPage } from './pages/AlertsPage';
import { SettingsPage } from './pages/SettingsPage';

export const App = () => {
  return (
    <BobDrawerProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<OverviewPage />} />
          <Route path="/assets" element={<AssetsPage />} />
          <Route path="/assets/:assetId" element={<AssetDetailsPage />} />
          <Route path="/risk-analysis" element={<RiskAnalysisPage />} />
          <Route path="/grid-map" element={<GridMapPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/sensor-health" element={<SensorHealthPage />} />
          <Route path="/incidents" element={<IncidentsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/crew-planning" element={<CrewPlanningPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </Router>
    </BobDrawerProvider>
  );
};

export default App;
