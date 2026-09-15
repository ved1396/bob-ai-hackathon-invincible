import React from 'react';

export const StatusBadge = ({ level, score, pulse }) => {
  const normLevel = String(level).toUpperCase();

  let colorClass = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  if (normLevel === 'CRITICAL' || normLevel === 'P1 - CRITICAL') {
    colorClass = "bg-purple-900/40 text-purple-300 border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]";
  } else if (normLevel === 'HIGH' || normLevel === 'P2 - HIGH') {
    colorClass = "bg-rose-500/15 text-rose-400 border-rose-500/30";
  } else if (normLevel === 'MEDIUM' || normLevel === 'P3 - MEDIUM' || normLevel === 'WARNING') {
    colorClass = "bg-amber-500/15 text-amber-300 border-amber-500/30";
  } else if (normLevel === 'LOW' || normLevel === 'NORMAL' || normLevel === 'NOMINAL' || normLevel === 'HEALTHY') {
    colorClass = "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${colorClass}`}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>}
      {score !== undefined ? `${score}% ${normLevel}` : normLevel}
    </span>
  );
};
