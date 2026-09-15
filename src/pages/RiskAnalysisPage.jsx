import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { RiskMatrixPlot } from '../components/grid/RiskMatrixPlot';
import { StatusBadge } from '../components/ui/StatusBadge';
import { fetchAssets, calculateAssetRiskScore, fetchWeather } from '../services/api';

export const RiskAnalysisPage = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [weather, setWeather] = useState([]);
  const [filterLevel, setFilterLevel] = useState('ALL');

  useEffect(() => {
    Promise.all([fetchAssets(), fetchWeather()]).then(([a, w]) => {
      setAssets(a);
      setWeather(w);
    });
  }, []);

  const analyzedAssets = assets.map(asset => {
    const scores = calculateAssetRiskScore(asset, weather);
    return {
      ...asset,
      calculatedRisk: scores
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  const filteredAssets = analyzedAssets.filter(a => filterLevel === 'ALL' || a.riskLevel === filterLevel);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>AI Grid Risk Analysis & Failure Ranking</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Composite model combining sensor health, weather exposure, historical incidents, load, and grid criticality
            </p>
          </div>
        </div>

        {/* Formula Disclaimer Banner */}
        <div className="bg-[#131920] border border-amber-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-amber-400 font-bold uppercase tracking-wider block mb-1">
              Demo / Model-Derived Risk Score Formula:
            </span>
            <code className="text-zinc-300">
              Risk Score = 0.30×Sensor + 0.20×Weather + 0.15×History + 0.10×Age + 0.10×Load + 0.15×Impact
            </code>
          </div>
          <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50 text-[10px]">
            Model Confidence: 92.8%
          </span>
        </div>

        {/* 1. Risk Matrix Plot & Decomposition Overview */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-[#14181f] border border-[#232a35] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white tracking-tight mb-2">Grid Risk Matrix Plot</h3>
            <p className="text-xs text-zinc-400 mb-4">Failure Probability vs. Grid Impact Severity</p>
            <RiskMatrixPlot />
          </div>

          <div className="lg:col-span-4 bg-[#14181f] border border-[#232a35] rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight mb-2">Risk Breakdown Weights</h3>
              <p className="text-xs text-zinc-400 mb-4">Multi-factor weighting inputs</p>
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1"><span>Sensor Risk (30%)</span><span className="text-[#96be5d]">30%</span></div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded"><div className="bg-[#96be5d] h-full rounded" style={{ width: '30%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1"><span>Weather Exposure (20%)</span><span className="text-amber-400">20%</span></div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded"><div className="bg-amber-400 h-full rounded" style={{ width: '20%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1"><span>Historical Incidents (15%)</span><span className="text-purple-400">15%</span></div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded"><div className="bg-purple-400 h-full rounded" style={{ width: '15%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1"><span>Grid Impact (15%)</span><span className="text-rose-400">15%</span></div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded"><div className="bg-rose-400 h-full rounded" style={{ width: '15%' }}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-zinc-300 mb-1"><span>Asset Age & Load (20%)</span><span className="text-blue-400">20%</span></div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded"><div className="bg-blue-400 h-full rounded" style={{ width: '20%' }}></div></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Risk Ranking Table */}
        <section className="bg-[#14181f] border border-[#232a35] rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">Asset Failure Risk Ranking</h3>
              <p className="text-xs text-zinc-400">Sorted from highest risk score to lowest</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    filterLevel === lvl ? 'bg-[#96be5d] text-black font-bold' : 'bg-[#0e1216] text-zinc-400 hover:text-white border border-[#232a35]'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0e1216] text-zinc-400 border-b border-[#232a35] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">Asset ID</th>
                  <th className="py-3 px-3">Name</th>
                  <th className="py-3 px-3">Risk Level</th>
                  <th className="py-3 px-3">Risk Score</th>
                  <th className="py-3 px-3">Sensor Risk</th>
                  <th className="py-3 px-3">Weather Risk</th>
                  <th className="py-3 px-3">Grid Impact</th>
                  <th className="py-3 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2630]">
                {filteredAssets.map((asset, idx) => (
                  <tr
                    key={asset.id}
                    onClick={() => navigate(`/assets/${asset.id}`)}
                    className="hover:bg-[#19212b] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-bold text-zinc-400">#{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-white group-hover:text-[#96be5d]">{asset.id}</td>
                    <td className="py-3 px-3 font-sans font-semibold text-zinc-200">{asset.name}</td>
                    <td className="py-3 px-3">
                      <StatusBadge level={asset.riskLevel} score={asset.riskScore} pulse={asset.riskLevel === 'CRITICAL'} />
                    </td>
                    <td className="py-3 px-3 font-bold text-rose-400 text-sm">{asset.riskScore}%</td>
                    <td className="py-3 px-3 text-zinc-300">{asset.calculatedRisk?.sensorRisk}%</td>
                    <td className="py-3 px-3 text-amber-300">{asset.calculatedRisk?.weatherRisk}%</td>
                    <td className="py-3 px-3 text-zinc-300">{asset.gridImpact}</td>
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
