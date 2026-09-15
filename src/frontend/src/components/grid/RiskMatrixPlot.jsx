import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RiskMatrixPlot = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[220px] bg-[#0A0E15] border border-[#1E2B3A] rounded-md p-2 flex flex-col justify-between select-none">
      {/* Priority 1 Highlight Box */}
      <div className="absolute right-0 top-0 w-[50%] h-[50%] bg-purple-950/20 border-l border-b border-purple-900/40 pointer-events-none z-0">
        <div className="text-[9px] font-bold text-purple-400 p-1.5 tracking-wider uppercase font-mono">
          Priority 1: Critical Attention
        </div>
      </div>

      {/* Grid Lines Background */}
      <div className="absolute inset-x-8 inset-y-6 grid grid-cols-4 grid-rows-3 pointer-events-none opacity-20">
        <div className="border-r border-t border-slate-500"></div>
        <div className="border-r border-t border-slate-500"></div>
        <div className="border-r border-t border-slate-500"></div>
        <div className="border-t border-slate-500"></div>
        <div className="border-r border-t border-slate-500"></div>
        <div className="border-r border-t border-slate-500"></div>
        <div className="border-r border-t border-slate-500"></div>
        <div className="border-t border-slate-500"></div>
        <div className="border-r border-t border-slate-500"></div>
        <div className="border-r border-t border-slate-500"></div>
        <div className="border-r border-t border-slate-500"></div>
        <div className="border-t border-slate-500"></div>
      </div>

      {/* Plotted Asset Points */}
      {/* T-104 (87% Prob, Critical Impact) */}
      <div
        onClick={() => navigate('/assets/T-104')}
        className="absolute right-12 top-4 flex items-center gap-1.5 z-10 cursor-pointer group"
      >
        <div className="relative flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-purple-500/30 pulse-radar absolute"></div>
          <div className="w-3.5 h-3.5 rounded-full bg-purple-500 border-2 border-white shadow-lg"></div>
        </div>
        <span className="bg-purple-950/90 border border-purple-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded shadow font-mono">
          T-104 • 87% Critical
        </span>
      </div>

      {/* T-208 (79% Prob, High Impact) */}
      <div
        onClick={() => navigate('/assets/T-208')}
        className="absolute right-28 top-12 flex items-center gap-1 z-10 cursor-pointer"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black shadow"></div>
        <span className="bg-[#141B26] border border-rose-700/60 text-rose-300 font-semibold text-[9px] px-1 rounded font-mono">
          T-208 (79%)
        </span>
      </div>

      {/* S-21 (74% Prob, High Impact) */}
      <div
        onClick={() => navigate('/assets/S-21')}
        className="absolute right-40 top-16 flex items-center gap-1 z-10 cursor-pointer"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-black shadow"></div>
        <span className="bg-[#141B26] border border-rose-700/60 text-rose-300 font-semibold text-[9px] px-1 rounded font-mono">
          S-21 (74%)
        </span>
      </div>

      {/* T-311 (68% Prob, High Impact) */}
      <div
        onClick={() => navigate('/assets/T-311')}
        className="absolute right-52 top-20 flex items-center gap-1 z-10 cursor-pointer"
      >
        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black shadow"></div>
        <span className="bg-[#141B26] border border-amber-600/60 text-amber-300 font-semibold text-[9px] px-1 rounded font-mono">
          T-311 (68%)
        </span>
      </div>

      {/* T-109 (18% Prob, Low Impact) */}
      <div
        onClick={() => navigate('/assets/T-109')}
        className="absolute left-20 bottom-8 flex items-center gap-1 z-10 cursor-pointer"
      >
        <div className="w-2 h-2 rounded-full bg-emerald-400 border border-black shadow"></div>
        <span className="bg-[#141B26] border border-emerald-600/60 text-emerald-300 text-[9px] px-1 rounded font-mono">
          T-109 (18%)
        </span>
      </div>

      {/* Graph Y-Axis Labels */}
      <div className="absolute left-1.5 inset-y-4 flex flex-col justify-between text-[9px] text-slate-400 font-mono">
        <span>Critical</span>
        <span>High</span>
        <span>Medium</span>
        <span>Low</span>
      </div>

      {/* Graph X-Axis Labels */}
      <div className="absolute inset-x-8 bottom-0 flex justify-between text-[9px] text-slate-400 font-mono">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
};
