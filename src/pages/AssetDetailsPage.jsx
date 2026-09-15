import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/ui/StatusBadge';
import { useBobDrawer } from '../context/BobDrawerContext';
import { fetchAssetById } from '../services/api';

export const AssetDetailsPage = () => {
  const { assetId } = useParams();
  const navigate = useNavigate();
  const { openWithQuery } = useBobDrawer();
  const [asset, setAsset] = useState(null);
  const [activeTab, setActiveTab] = useState('TELEMETRY');

  useEffect(() => {
    fetchAssetById(assetId || 'T-104').then(setAsset);
  }, [assetId]);

  if (!asset) {
    return (
      <AppLayout>
        <div className="p-8 text-center font-mono text-zinc-400">Loading asset telemetry...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Breadcrumb Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
              <button onClick={() => navigate('/assets')} className="hover:text-white transition-colors">Assets</button>
              <span>/</span>
              <span className="text-[#96be5d] font-bold">{asset.id}</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              <span>{asset.name}</span>
              <StatusBadge level={asset.riskLevel} score={asset.riskScore} pulse={asset.riskLevel === 'CRITICAL'} />
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => openWithQuery(`Why is ${asset.id} critical?`)}
              className="px-3 py-1.5 rounded-lg bg-[#18231c] text-[#a8d269] border border-[#2b3d2c] text-xs font-bold transition-all hover:bg-[#1f2d24] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>✦ Explain Failure Risk</span>
            </button>
            <button
              onClick={() => navigate('/maintenance')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Schedule Maintenance
            </button>
            <button
              onClick={() => navigate('/crew-planning')}
              className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Dispatch Crew
            </button>
          </div>
        </div>

        {/* 1. Asset Specifications & Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-3">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Asset ID</div>
            <div className="text-sm font-bold font-mono text-white mt-1">{asset.id}</div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-3">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Type</div>
            <div className="text-sm font-bold font-mono text-zinc-200 mt-1">{asset.type}</div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-3">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Location</div>
            <div className="text-xs font-bold text-zinc-200 mt-1 truncate">{asset.substation}</div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-3">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Capacity</div>
            <div className="text-sm font-bold font-mono text-zinc-200 mt-1">{asset.capacity}</div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-3">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Voltage</div>
            <div className="text-xs font-bold font-mono text-zinc-200 mt-1 truncate">{asset.voltage}</div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-3">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Age</div>
            <div className="text-sm font-bold font-mono text-zinc-200 mt-1">{asset.age} years</div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-3">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Health Score</div>
            <div className={`text-sm font-bold font-mono mt-1 ${asset.healthScore < 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {asset.healthScore}%
            </div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-3">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Failure Window</div>
            <div className="text-xs font-bold font-mono text-rose-400 mt-1">24 Hours</div>
          </div>
        </div>

        {/* 2. AI Explainable Failure Diagnostics Box */}
        <section className="bg-[#13191f] border border-purple-900/50 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3 border-b border-purple-900/40 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
              <h3 className="text-xs font-bold text-purple-300 font-mono tracking-wider uppercase">
                AI Diagnostic Explanation ({asset.id})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-700/50">
              Confidence Score: 94.2%
            </span>
          </div>

          <p className="text-xs text-zinc-200 leading-relaxed font-sans mb-4 font-medium">
            "{asset.id} failure risk score increased to <strong className="text-purple-300 font-mono">{asset.riskScore}% ({asset.riskLevel})</strong> because top-oil operating temperature reached <strong className="text-rose-400">{asset.topOilTemp}°C</strong> while vibration harmonics exceeded the baseline threshold by {((asset.vibration / asset.vibrationThreshold - 1) * 100).toFixed(0)}%."
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider mb-1">Attribution Factors:</div>
            {asset.attributionReasons?.map((reason, i) => (
              <div key={i} className="flex items-start gap-2 text-zinc-300 bg-[#0e1216] p-2 rounded border border-[#1e2630]">
                <span className="text-purple-400 font-bold">•</span>
                <span>{reason}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Sensor Health Readings & Historical Telemetry Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Live Sensor Metrics */}
          <div className="lg:col-span-6 bg-[#14181f] border border-[#232a35] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white tracking-tight mb-4">Real-Time Sensor Telemetry</h3>
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-[#0e1216] border border-[#232a35]">
                <div className="text-zinc-400 text-[10px]">Top Oil Temp</div>
                <div className="text-lg font-bold text-rose-400 mt-1">{asset.topOilTemp}°C</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Threshold: &lt;{asset.tempThreshold}°C</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1216] border border-[#232a35]">
                <div className="text-zinc-400 text-[10px]">Vibration</div>
                <div className="text-lg font-bold text-rose-400 mt-1">{asset.vibration} mm/s</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Threshold: &lt;{asset.vibrationThreshold} mm/s</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1216] border border-[#232a35]">
                <div className="text-zinc-400 text-[10px]">Dielectric Oil Quality</div>
                <div className="text-lg font-bold text-amber-300 mt-1">{asset.oilQuality}%</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Threshold: &gt;80%</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1216] border border-[#232a35]">
                <div className="text-zinc-400 text-[10px]">Partial Discharge</div>
                <div className="text-sm font-bold text-purple-300 mt-1 truncate">{asset.partialDischarge}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Limit: &lt;25 pC</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1216] border border-[#232a35]">
                <div className="text-zinc-400 text-[10px]">Current Load</div>
                <div className="text-lg font-bold text-zinc-200 mt-1">{asset.loadPct}% ({asset.currentAmps}A)</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Rated capacity load</div>
              </div>
              <div className="p-3 rounded-lg bg-[#0e1216] border border-[#232a35]">
                <div className="text-zinc-400 text-[10px]">Primary Voltage</div>
                <div className="text-lg font-bold text-zinc-200 mt-1">{asset.voltageKv} kV</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Nominal grid voltage</div>
              </div>
            </div>
          </div>

          {/* Historical Telemetry Trend Chart Visualization */}
          <div className="lg:col-span-6 bg-[#14181f] border border-[#232a35] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white tracking-tight">24-Hour Telemetry Trend</h3>
                <div className="flex gap-1 font-mono text-[10px]">
                  {['TEMP', 'VIB', 'LOAD'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-2 py-0.5 rounded transition-colors ${
                        activeTab === tab ? 'bg-[#96be5d] text-black font-bold' : 'bg-[#0e1216] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simulated Chart Bars */}
              <div className="h-44 bg-[#0a0d11] border border-[#1e2630] rounded-lg p-4 flex items-end justify-between gap-2 font-mono">
                {[65, 68, 72, 75, 80, 84, 88, 92, 98, 104].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t transition-all ${
                        val > 90 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : val > 80 ? 'bg-amber-400' : 'bg-emerald-500'
                      }`}
                      style={{ height: `${(val / 110) * 100}%` }}
                    ></div>
                    <span className="text-[8px] text-zinc-500">{idx * 2.4}h</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 font-mono mt-3">
              Trend showing thermal escalation during peak afternoon demand window.
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
