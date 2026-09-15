import React from 'react';

export const KpiCard = ({
  title,
  value,
  subtitle,
  dotColor = 'bg-[#96be5d]',
  pulse = false,
  trendText,
  trendColor = 'text-emerald-400'
}) => {
  return (
    <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-zinc-400 tracking-wider uppercase font-mono">{title}</span>
        <span className={`w-2 h-2 rounded-full ${dotColor} ${pulse ? 'animate-pulse' : ''}`}></span>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold font-mono text-white tracking-tight">{value}</div>
        {(trendText || subtitle) && (
          <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1 font-medium">
            {trendText && <span className={trendColor}>{trendText}</span>}
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
