import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { GridTopologyMap } from '../components/grid/GridTopologyMap';
import { StatusBadge } from '../components/ui/StatusBadge';
import { KpiCard } from '../components/ui/KpiCard';
import { useBobDrawer } from '../context/BobDrawerContext';
import { fetchOverviewData, fetchAssets, fetchWeather, fetchIncidents, fetchMaintenance, fetchCrews } from '../services/api';

export const OverviewPage = () => {
  const navigate = useNavigate();
  const { openWithQuery } = useBobDrawer();

  const [assets, setAssets] = useState([]);
  const [weather, setWeather] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [crews, setCrews] = useState([]);

  useEffect(() => {
    fetchAssets().then(setAssets);
    fetchWeather().then(setWeather);
    fetchIncidents().then(setIncidents);
    fetchMaintenance().then(setMaintenance);
    fetchCrews().then(setCrews);
  }, []);

  const criticalAssets = assets.filter(a => a.riskLevel === 'CRITICAL' || a.riskLevel === 'HIGH');
  const zone4Weather = weather.find(w => w.region?.includes('Zone 4') || w.region?.includes('Substation S-21')) || weather[0] || {};

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Utility Command Center</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#17221b] text-[#96be5d] border border-[#2b3d2c] font-mono font-semibold">
                SYSTEM OPERATIONAL
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Real-time grid health monitoring, equipment risk analytics & AI crew dispatch advisor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => openWithQuery("Which assets are at highest risk?")}
              className="px-3 py-1.5 rounded-lg bg-[#18231c] text-[#a8d269] border border-[#2b3d2c] text-xs font-bold transition-all hover:bg-[#1f2d24] flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>✦ Ask Bob AI</span>
            </button>
            <button
              onClick={() => navigate('/crew-planning')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Dispatch Crews →
            </button>
          </div>
        </div>

        {/* 1. Top KPI Summary Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <KpiCard
            title="Grid Health"
            value="92.4%"
            subtitle="Healthy Grid State"
            dotColor="bg-emerald-400"
            trendText="↑ 1.2%"
            trendColor="text-emerald-400"
          />
          <KpiCard
            title="At-Risk Assets"
            value="27"
            subtitle="+8 from yesterday"
            dotColor="bg-amber-400"
            trendText="↑ 8"
            trendColor="text-amber-400"
          />
          <KpiCard
            title="Critical Assets"
            value="6"
            subtitle="Immediate Action"
            dotColor="bg-purple-500"
            pulse={true}
            trendText="Immediate"
            trendColor="text-purple-400"
          />
          <KpiCard
            title="Predicted Outages"
            value="12"
            subtitle="Next 24 Hours"
            dotColor="bg-rose-500"
            trendText="24h Window"
            trendColor="text-rose-400"
          />
          <KpiCard
            title="Active Incidents"
            value={incidents.length || 4}
            subtitle="2 Critical Unresolved"
            dotColor="bg-rose-400"
            trendText="2 Critical"
            trendColor="text-rose-400"
          />
          <KpiCard
            title="Crew Readiness"
            value="87%"
            subtitle="6 Positioned / Available"
            dotColor="bg-[#96be5d]"
            trendText="Positioned"
            trendColor="text-[#96be5d]"
          />
        </section>

        {/* 2. AI Operational Insight & Priority Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Insight Box */}
          <div className="lg:col-span-8 bg-[#13191f] border border-[#232e38] rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center gap-2 mb-2 text-[#96be5d] font-bold text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-[#96be5d] animate-pulse"></span>
              <span>✦ BOB AI OPERATIONAL ADVISORY SUMMARY</span>
            </div>
            <p className="text-xs md:text-sm text-zinc-200 leading-relaxed font-sans font-medium">
              "Transformer <strong className="text-purple-300">T-104</strong> (Substation S-21) has an <strong className="text-rose-400 font-mono">87% failure probability</strong> within the next 24 hours. Top-oil temperature reached <strong className="text-amber-300">104°C</strong> while vibration harmonics peaked at 7.8 mm/s. Inbound severe storm winds (55 km/h) in Zone 4 escalate severe outage probability. <strong className="text-emerald-400">Recommendation:</strong> Pre-position Crew C-07 at Substation S-21 for immediate thermal check and prepare backup generator GEN-01."
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => navigate('/assets/T-104')}
                className="px-3 py-1.5 rounded-md bg-purple-950/80 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-xs font-semibold font-mono transition-colors"
              >
                Inspect T-104 Deep-Dive →
              </button>
              <button
                onClick={() => openWithQuery("Where should crews be positioned?")}
                className="px-3 py-1.5 rounded-md bg-[#18231c] hover:bg-[#202e25] border border-[#2b3d2c] text-[#96be5d] text-xs font-semibold transition-colors"
              >
                Pre-Position Crew C-07 →
              </button>
            </div>
          </div>

          {/* Priority Actions Card */}
          <div className="lg:col-span-4 bg-[#14181f] border border-[#232a35] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-zinc-300 uppercase font-mono tracking-wider mb-3">Priority Actions</h3>
              <div className="space-y-2.5">
                {[
                  { text: 'Inspect Transformer T-104 (87% Risk)', action: () => navigate('/assets/T-104'), priority: 'Immediate' },
                  { text: 'Pre-Position Crew C-07 at Substation S-21', action: () => navigate('/crew-planning'), priority: 'Priority' },
                  { text: 'Execute DGA Sampling on Autotransformer T-208', action: () => navigate('/assets/T-208'), priority: 'High' },
                  { text: 'Clear Feeder F-12 Vegetation Hazard', action: () => navigate('/incidents'), priority: 'Active' }
                ].map((act, i) => (
                  <button
                    key={i}
                    onClick={act.action}
                    className="w-full text-left p-2.5 rounded-lg bg-[#101418] hover:bg-[#182026] border border-[#1e2730] hover:border-[#2f3d47] flex items-center justify-between text-xs text-zinc-200 transition-all group"
                  >
                    <span className="truncate pr-2 font-medium">{act.text}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 shrink-0">
                      {act.priority}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Grid Topology Map & Weather Risk Summary */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Grid Map Component (8 Cols) */}
          <div className="lg:col-span-8 bg-[#14181f] border border-[#232a35] rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight">Grid Operational Risk Map</h3>
                <p className="text-xs text-zinc-400">Interactive topology visualization & equipment failure hotspots</p>
              </div>
              <button
                onClick={() => navigate('/grid-map')}
                className="px-2.5 py-1 rounded bg-[#111419] border border-[#232a35] text-xs text-zinc-300 hover:text-white hover:border-[#96be5d] transition-colors"
              >
                Expand Full Map →
              </button>
            </div>
            <GridTopologyMap heightClass="h-[320px]" />
          </div>

          {/* Weather Intelligence Widget (4 Cols) */}
          <div className="lg:col-span-4 bg-[#14181f] border border-[#232a35] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-white tracking-tight">Weather Risk Alert</h3>
                <span className="text-[10px] text-rose-400 font-mono font-bold animate-pulse">CRITICAL STACK</span>
              </div>
              <p className="text-xs text-zinc-400 mb-4">{zone4Weather.region || 'Zone 4 Corridor'}</p>

              <div className="bg-[#101418] border border-[#1e2730] rounded-lg p-3 space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Condition:</span>
                  <span className="text-white font-semibold">{zone4Weather.condition}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Wind Gusts:</span>
                  <span className="text-rose-400 font-bold">{zone4Weather.windSpeed}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Rainfall:</span>
                  <span className="text-amber-300 font-semibold">{zone4Weather.rainfall}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Risk Surcharge:</span>
                  <span className="text-purple-300 font-bold">{zone4Weather.riskMultiplier}</span>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {zone4Weather.alertMessage || "Severe wind & thunderstorm front active. Transformer T-104 and Feeder F-12 exposed to severe mechanical galloping risk."}
              </p>
            </div>

            <div className="pt-3 mt-3 border-t border-[#232a35]">
              <button
                onClick={() => navigate('/weather')}
                className="text-xs text-[#96be5d] hover:underline font-semibold flex items-center justify-between w-full group transition-colors"
              >
                <span>View 24-hr weather forecast impact</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4. Critical Assets Table Section */}
        <section className="bg-[#14181f] border border-[#232a35] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Critical At-Risk Assets</h3>
              <p className="text-xs text-zinc-400">High failure probability equipment sorted by grid impact severity</p>
            </div>
            <button
              onClick={() => navigate('/assets')}
              className="text-xs text-[#96be5d] hover:underline font-semibold"
            >
              View All Assets ({assets.length}) →
            </button>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0e1216] text-zinc-400 border-b border-[#232a35] uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Asset ID</th>
                  <th className="py-2.5 px-3">Name / Type</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Failure Prob</th>
                  <th className="py-2.5 px-3">Risk Level</th>
                  <th className="py-2.5 px-3">Grid Impact</th>
                  <th className="py-2.5 px-3">Prescribed Action</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2630]">
                {criticalAssets.slice(0, 5).map(asset => (
                  <tr key={asset.id} className="hover:bg-[#19212b] transition-colors group cursor-pointer" onClick={() => navigate(`/assets/${asset.id}`)}>
                    <td className="py-3 px-3 font-bold text-white group-hover:text-[#96be5d]">{asset.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-sans font-semibold text-zinc-200">{asset.name}</div>
                      <div className="text-[10px] text-zinc-500">{asset.type} • {asset.capacity}</div>
                    </td>
                    <td className="py-3 px-3 text-zinc-300">{asset.substation}</td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-rose-400">{(asset.failureProbability * 100).toFixed(0)}%</span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge level={asset.riskLevel} score={asset.riskScore} pulse={asset.riskLevel === 'CRITICAL'} />
                    </td>
                    <td className="py-3 px-3 text-zinc-300 truncate max-w-[150px]">{asset.gridImpact}</td>
                    <td className="py-3 px-3 text-zinc-400 font-sans truncate max-w-[220px]">{asset.prescribedAction}</td>
                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/assets/${asset.id}`)}
                        className="px-2.5 py-1 rounded bg-[#18241c] hover:bg-[#213327] text-[#96be5d] border border-[#2b3d2c] text-[10px] font-bold transition-colors"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
