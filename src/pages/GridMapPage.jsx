import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/ui/StatusBadge';
import { fetchAssets } from '../services/api';

export const GridMapPage = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filterType, setFilterType] = useState('ALL');

  useEffect(() => {
    fetchAssets().then(data => {
      setAssets(data);
      if (data && data.length > 0) setSelectedAsset(data[0]);
    });
  }, []);

  const filteredAssets = assets.filter(a => filterType === 'ALL' || a.assetCategory === filterType || a.riskLevel === filterType || a.type.includes(filterType));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Operational Grid Risk Map</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                {assets.length} Assets Mapped
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Geographic topology map displaying substations, transformers, distribution feeders & storm corridors
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['ALL', 'CRITICAL', 'Transformer', 'Substation', 'Feeder'].map(tag => (
              <button
                key={tag}
                onClick={() => setFilterType(tag)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                  filterType === tag ? 'bg-[#96be5d] text-black font-bold' : 'bg-[#14181f] text-zinc-400 border border-[#232a35] hover:text-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Map Viewer Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-[#0a0d11] border border-[#1e262b] rounded-xl p-4 relative min-h-[480px] flex flex-col justify-between overflow-hidden select-none">
            {/* SVG Grid Overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-zinc-800/30">
              <defs>
                <pattern id="full-map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#full-map-grid)" />
            </svg>

            {/* Interactive Map Content */}
            <div className="relative w-full h-full flex-1">
              <svg className="w-full h-full min-h-[420px]" viewBox="0 0 800 420" fill="none">
                {/* Feeder Connection Corridors */}
                <path d="M 160 140 L 320 110 L 480 180 L 640 120" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 320 110 L 280 260 L 520 280 L 640 120" stroke="#475569" strokeWidth="2" />
                <path d="M 160 140 L 280 260" stroke="#f43f5e" strokeWidth="2.5" strokeOpacity="0.8" />

                {/* Weather Corridor (Zone 4 Storm Overlay) */}
                <ellipse cx="180" cy="150" rx="90" ry="70" fill="rgba(239, 68, 68, 0.08)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="120" y="70" fill="#f87171" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
                  ⛈ ZONE 4 STORM CORRIDOR (+18% RISK)
                </text>

                {/* Map Nodes */}
                {filteredAssets.map((ast, i) => {
                  const basePositions = [
                    { x: 160, y: 140 }, // T-104
                    { x: 480, y: 180 }, // T-208
                    { x: 320, y: 110 }, // S-21
                    { x: 280, y: 260 }, // T-311
                    { x: 220, y: 200 }, // F-12
                    { x: 520, y: 280 }, // CB-402
                    { x: 640, y: 120 }, // T-501
                    { x: 350, y: 160 }, // GEN-01
                    { x: 590, y: 210 },
                    { x: 420, y: 320 }
                  ];
                  const pos = basePositions[i % basePositions.length];
                  const isSelected = selectedAsset?.id === ast.id;
                  const color = ast.riskLevel === 'CRITICAL' ? '#a855f7' : ast.riskLevel === 'HIGH' ? '#f43f5e' : ast.riskLevel === 'MEDIUM' ? '#fbbf24' : '#10b981';

                  return (
                    <g
                      key={ast.id}
                      className="cursor-pointer"
                      onClick={() => setSelectedAsset(ast)}
                    >
                      {ast.riskLevel === 'CRITICAL' && (
                        <circle className="node-pulse-ring" cx={pos.x} cy={pos.y} r="22" fill="rgba(168, 85, 247, 0.25)"></circle>
                      )}
                      <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={isSelected ? 10 : 7}
                        fill="#0c0e12"
                        stroke={color}
                        strokeWidth={isSelected ? 3.5 : 2}
                      ></circle>
                      <circle cx={pos.x} cy={pos.y} r="3" fill={color}></circle>
                      <text
                        x={pos.x + 12}
                        y={pos.y + 4}
                        fill={color}
                        fontFamily="JetBrains Mono"
                        fontSize="10"
                        fontWeight={isSelected ? "bold" : "normal"}
                      >
                        {ast.id} ({ast.riskScore}%)
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Map Controls & Legend Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1e262b] text-[10px] font-mono z-10">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Critical</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> High</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Medium</span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Low</span>
              </div>
              <span className="text-zinc-500">Geographic Coordinates: 40.7128° N, 74.0060° W</span>
            </div>
          </div>

          {/* Selected Asset Inspection Card (4 Cols) */}
          <div className="lg:col-span-4 bg-[#14181f] border border-[#232a35] rounded-xl p-5 flex flex-col justify-between">
            {selectedAsset ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#232a35] pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">Selected Asset</span>
                    <h3 className="text-base font-bold text-white font-mono flex items-center gap-2 mt-0.5">
                      <span>{selectedAsset.id}</span>
                      <StatusBadge level={selectedAsset.riskLevel} score={selectedAsset.riskScore} pulse={selectedAsset.riskLevel === 'CRITICAL'} />
                    </h3>
                  </div>
                </div>

                <div className="space-y-2.5 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Name:</span>
                    <span className="text-white font-sans font-semibold text-right">{selectedAsset.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Location:</span>
                    <span className="text-zinc-200">{selectedAsset.substation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Failure Prob:</span>
                    <span className="text-rose-400 font-bold">{(selectedAsset.failureProbability * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Grid Impact:</span>
                    <span className="text-zinc-200">{selectedAsset.gridImpact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Top-Oil Temp:</span>
                    <span className="text-rose-400 font-bold">{selectedAsset.topOilTemp}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Vibration:</span>
                    <span className="text-amber-300 font-bold">{selectedAsset.vibration} mm/s</span>
                  </div>
                </div>

                <div className="p-3 bg-[#0e1216] border border-[#232a35] rounded-lg">
                  <div className="text-[10px] text-zinc-400 uppercase font-mono mb-1">Prescribed Recommendation</div>
                  <p className="text-xs text-zinc-200 leading-relaxed font-sans">{selectedAsset.prescribedAction}</p>
                </div>

                <button
                  onClick={() => navigate(`/assets/${selectedAsset.id}`)}
                  className="w-full py-2 rounded-lg bg-[#18241c] hover:bg-[#213327] text-[#96be5d] border border-[#2b3d2c] text-xs font-bold font-mono transition-colors cursor-pointer"
                >
                  Inspect Asset Details Page →
                </button>
              </div>
            ) : (
              <div className="text-xs text-zinc-400 font-mono">Select an asset on the map to inspect telemetry.</div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
