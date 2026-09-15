import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBobDrawer } from '../../context/BobDrawerContext';

export const GridTopologyMap = ({ heightClass = "h-[320px]" }) => {
  const navigate = useNavigate();
  const { openWithQuery } = useBobDrawer();
  const [zoomLevel, setZoomLevel] = useState(1);

  return (
    <div className={`relative w-full ${heightClass} bg-[#0c0f14] rounded-lg border border-[#232a35]/70 overflow-hidden select-none`}>
      {/* Grid Pattern */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-zinc-800/40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="topology-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.75" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#topology-grid-pattern)" />
      </svg>

      {/* Interactive Vector Map SVG */}
      <div className="w-full h-full transition-transform duration-300 origin-center" style={{ transform: `scale(${zoomLevel})` }}>
        <svg className="w-full h-full" viewBox="0 0 760 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Corridor Interconnections */}
          <path d="M 170 140 L 260 100 L 390 130 L 530 100 L 610 140" stroke="#334155" strokeDasharray="3 3" strokeWidth="1.5" />
          <path d="M 260 100 L 230 190 L 350 180 L 460 220 L 530 100" stroke="#475569" strokeWidth="1.5" />
          <path d="M 170 140 L 230 190 L 390 130 L 460 220" stroke="#334155" strokeWidth="1.5" />
          <path d="M 390 130 L 610 140" stroke="#ef4444" strokeWidth="1.5" strokeOpacity="0.6" />

          {/* Storm Loading Overlay Zone near Substation S-21 */}
          <circle cx="170" cy="140" r="55" fill="#ef4444" fillOpacity="0.08" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 3" />

          {/* Node 1: T-104 (CRITICAL) */}
          <g
            className="cursor-pointer group"
            onClick={() => navigate('/assets/T-104')}
          >
            <circle className="node-pulse-ring" cx="170" cy="140" r="18" fill="rgba(248, 113, 113, 0.25)"></circle>
            <circle cx="170" cy="140" fill="#1e1317" r="9" stroke="#f87171" strokeWidth="2.5"></circle>
            <circle cx="170" cy="140" fill="#f87171" r="3.5"></circle>
            <text x="184" y="144" fill="#fca5a5" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">
              T-104 (87%)
            </text>
          </g>

          {/* Node 2: Substation S-21 */}
          <g className="cursor-pointer" onClick={() => openWithQuery("Why is Substation S-21 high risk?")}>
            <circle cx="260" cy="100" fill="#fb923c" r="6" stroke="#111827" strokeWidth="2"></circle>
            <text x="272" y="104" fill="#fdba74" fontSize="11" fontWeight="500">S-21</text>
          </g>

          {/* Node 3: T-311 */}
          <g className="cursor-pointer" onClick={() => navigate('/assets/T-311')}>
            <circle cx="230" cy="190" fill="#fb923c" r="6" stroke="#111827" strokeWidth="2"></circle>
            <text x="242" y="194" fill="#d1d5db" fontFamily="JetBrains Mono" fontSize="10">T-311 (68%)</text>
          </g>

          {/* Node 4: T-208 */}
          <g className="cursor-pointer" onClick={() => navigate('/assets/T-208')}>
            <circle cx="390" cy="130" fill="#f43f5e" r="6" stroke="#111827" strokeWidth="2"></circle>
            <text x="402" y="134" fill="#fda4af" fontFamily="JetBrains Mono" fontSize="10">T-208 (79%)</text>
          </g>

          {/* Node 5: CB-402 */}
          <g className="cursor-pointer" onClick={() => navigate('/assets/CB-402')}>
            <circle cx="350" cy="180" fill="#facc15" r="6" stroke="#111827" strokeWidth="2"></circle>
            <text x="362" y="184" fill="#d1d5db" fontFamily="JetBrains Mono" fontSize="10">CB-402 (59%)</text>
          </g>

          {/* Node 6: T-109 */}
          <g className="cursor-pointer" onClick={() => navigate('/assets/T-109')}>
            <circle cx="530" cy="100" fill="#4ade80" r="6" stroke="#111827" strokeWidth="2"></circle>
            <text x="542" y="104" fill="#d1d5db" fontFamily="JetBrains Mono" fontSize="10">T-109 (18%)</text>
          </g>

          {/* Node 7: Substation S-08 */}
          <g className="cursor-pointer" onClick={() => openWithQuery("Show Substation S-08 status")}>
            <circle cx="610" cy="140" fill="#fb923c" r="6" stroke="#111827" strokeWidth="2"></circle>
            <text x="622" y="144" fill="#fdba74" fontSize="11" fontWeight="500">S-08</text>
          </g>
        </svg>
      </div>

      {/* Tooltip overlay for T-104 */}
      <div
        onClick={() => navigate('/assets/T-104')}
        className="absolute top-4 left-4 bg-[#14171d]/95 backdrop-blur-md border border-rose-900/60 p-2.5 rounded-lg shadow-xl cursor-pointer hover:border-rose-500 transition-colors"
      >
        <div className="text-[11px] font-bold text-white flex items-center gap-1.5 font-mono">
          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
          T-104 (Step-Down Tx)
        </div>
        <p className="text-[10px] text-zinc-400 mt-0.5 font-sans">Substation S-21 • 345kV Bulk</p>
        <div className="text-[10px] font-bold text-rose-400 mt-1 font-mono">87% CRITICAL</div>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute top-3 right-3 flex flex-col bg-[#14181f] border border-[#232a35] rounded-lg overflow-hidden shadow-lg z-10">
        <button
          onClick={() => setZoomLevel(z => Math.min(z + 0.25, 2))}
          className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#1a2029] transition-colors border-b border-[#232a35] font-mono text-sm leading-none cursor-pointer"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => setZoomLevel(z => Math.max(z - 0.25, 0.75))}
          className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-[#1a2029] transition-colors font-mono text-sm leading-none cursor-pointer"
          title="Zoom out"
        >
          −
        </button>
      </div>

      {/* Bottom Risk Legend */}
      <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-4 bg-[#111419]/90 backdrop-blur-sm border border-[#232a35] px-3 py-1.5 rounded-md text-[10px] font-mono z-10">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500"></span> <span className="text-zinc-300">Critical (≥80%)</span></span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span> <span className="text-zinc-300">High (60-79%)</span></span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> <span className="text-zinc-300">Medium (40-59%)</span></span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <span className="text-zinc-300">Normal (&lt;40%)</span></span>
      </div>
    </div>
  );
};
