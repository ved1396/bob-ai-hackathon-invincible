import React from 'react';
import { useBobDrawer } from '../../context/BobDrawerContext';

export const Header = ({ mobileSidebarOpen, setMobileSidebarOpen }) => {
  const { toggleDrawer } = useBobDrawer();

  return (
    <header className="h-14 bg-[#0d1114] border-b border-[#1e262b] px-4 flex items-center justify-between z-30 shrink-0">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="lg:hidden p-2 rounded-lg bg-[#161d22] text-zinc-300 hover:text-white border border-[#25313a]"
          aria-label="Toggle Navigation Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Title / Console Banner */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-[#96be5d] tracking-wider uppercase hidden sm:inline-block">GRIDGUARD AI</span>
          <span className="text-zinc-600 hidden sm:inline-block">•</span>
          <span className="text-xs font-medium text-zinc-300 truncate">Power Grid Intelligence Console</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Realtime Status Indicator */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#13191d] border border-[#212c33] text-[11px] font-mono text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>TELEMETRY STREAM: <strong className="text-emerald-400 font-semibold">LIVE</strong></span>
        </div>

        {/* Bob AI Assistant Button */}
        <button
          onClick={() => toggleDrawer(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#18231c] text-[#a8d269] border border-[#2b3d2c] text-xs font-bold transition-all hover:bg-[#1f2d24] shadow-sm cursor-pointer"
        >
          <span className="text-[#96be5d]">✦</span>
          <span>Bob Assistant</span>
          <span className="w-2 h-2 rounded-full bg-[#96be5d] pulsing-dot hidden sm:inline-block"></span>
        </button>

        {/* Operational Mode Badge */}
        <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold tracking-wider uppercase">
          DEMO MODE
        </div>
      </div>
    </header>
  );
};
