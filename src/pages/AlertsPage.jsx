import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/ui/StatusBadge';
import { fetchAlerts, acknowledgeAlert } from '../services/api';

export const AlertsPage = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);

  const loadData = () => {
    fetchAlerts().then(setAlerts);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcknowledge = async (id) => {
    await acknowledgeAlert(id);
    loadData();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Operations Alert Console</span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono">
                {alerts.length} Active Alarms
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Critical grid notifications, telemetry anomaly flags & weather warning alerts
            </p>
          </div>
        </div>

        {/* Alerts Feed List */}
        <div className="space-y-3 font-mono">
          {alerts.map(alt => (
            <div
              key={alt.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                alt.severity === 'CRITICAL' ? 'bg-rose-950/20 border-rose-600/40 hover:border-rose-500' : 'bg-[#14181f] border-[#232a35] hover:border-zinc-700'
              }`}
            >
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <StatusBadge level={alt.severity} pulse={alt.severity === 'CRITICAL'} />
                  <span className="text-sm font-bold text-white font-sans">{alt.title}</span>
                  <span className="text-[10px] text-zinc-500">• {alt.timestamp}</span>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">{alt.message}</p>
                <div className="text-[11px] text-amber-300 font-mono">
                  💡 Required Action: {alt.actionRequired}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/assets/${alt.assetId}`)}
                  className="px-3 py-1.5 rounded bg-[#18241c] hover:bg-[#213327] text-[#96be5d] border border-[#2b3d2c] text-xs font-bold transition-colors cursor-pointer"
                >
                  View Asset →
                </button>
                <button
                  onClick={() => navigate('/crew-planning')}
                  className="px-3 py-1.5 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Dispatch Crew
                </button>
                <button
                  onClick={() => handleAcknowledge(alt.id)}
                  className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Acknowledge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};
