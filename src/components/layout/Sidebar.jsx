import React from 'react';
import { NavLink } from 'react-router-dom';
import { useBobDrawer } from '../../context/BobDrawerContext';

export const Sidebar = ({ mobileSidebarOpen, setMobileSidebarOpen }) => {
  const { toggleDrawer } = useBobDrawer();

  const navItemClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-100 text-[#0c0e12] font-semibold text-xs shadow-sm transition-all"
      : "flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-[#1a2029] text-xs font-medium transition-colors";

  const iconColorClass = (isActive) => (isActive ? "text-[#0c0e12]" : "text-zinc-400");

  const closeMobile = () => {
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-60 bg-[#0c1012] border-r border-[#1e262b] flex flex-col justify-between z-40 select-none transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto custom-scrollbar">
          {/* Brand Header */}
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#1e262b]/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#18201b] border border-[#2b3d2c] flex items-center justify-center text-[#96be5d] shadow-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="font-bold text-sm tracking-wider text-white flex items-center gap-1.5 font-mono">
                  GRIDGUARD
                </div>
                <div className="text-[10px] tracking-widest text-[#7c8b96] uppercase font-mono">Utility Intelligence</div>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden text-zinc-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="px-3 py-4 space-y-5">
            {/* Main Section */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider text-[#52606d] uppercase font-mono">Main</div>
              <nav className="space-y-0.5">
                <NavLink to="/overview" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect height="7" rx="1" strokeWidth="2" width="7" x="3" y="3"></rect>
                        <rect height="7" rx="1" strokeWidth="2" width="7" x="14" y="3"></rect>
                        <rect height="7" rx="1" strokeWidth="2" width="7" x="14" y="14"></rect>
                        <rect height="7" rx="1" strokeWidth="2" width="7" x="3" y="14"></rect>
                      </svg>
                      <span>Overview</span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/assets" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                      </svg>
                      <span className="flex-1">Assets</span>
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="Critical asset alert"></span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/risk-analysis" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                      </svg>
                      <span>Risk Analysis</span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/grid-map" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                      </svg>
                      <span>Grid Map</span>
                    </>
                  )}
                </NavLink>
              </nav>
            </div>

            {/* Monitoring Section */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider text-[#52606d] uppercase font-mono">Monitoring</div>
              <nav className="space-y-0.5">
                <NavLink to="/weather" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                      </svg>
                      <span>Weather</span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/sensor-health" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" strokeDasharray="2 3" strokeWidth="1.75"></circle>
                        <circle cx="12" cy="12" r="3" strokeWidth="1.75"></circle>
                      </svg>
                      <span>Sensor Health</span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/incidents" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                      </svg>
                      <span>Incidents</span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/alerts" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span className="flex-1">Alerts</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-900/60 text-rose-300 border border-rose-700/50">4</span>
                    </>
                  )}
                </NavLink>
              </nav>
            </div>

            {/* Operations Section */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider text-[#52606d] uppercase font-mono">Operations</div>
              <nav className="space-y-0.5">
                <NavLink to="/maintenance" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                      </svg>
                      <span className="flex-1">Maintenance</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#1b2327] text-[#8899a6] border border-[#29353d]">7</span>
                    </>
                  )}
                </NavLink>

                <NavLink to="/crew-planning" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                      </svg>
                      <span>Crew Planning</span>
                    </>
                  )}
                </NavLink>
              </nav>
            </div>

            {/* AI Assistant Section */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider text-[#52606d] uppercase font-mono">AI</div>
              <button
                onClick={() => { toggleDrawer(true); closeMobile(); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#17221b] text-[#a8d269] font-medium text-xs border border-[#2b3d2c] transition-all hover:bg-[#1e2d23] shadow-sm cursor-pointer"
              >
                <span className="flex items-center gap-3">
                  <span className="text-[#96be5d] font-bold text-sm">✦</span>
                  <span>Bob Assistant</span>
                </span>
                <span className="w-2 h-2 rounded-full bg-[#96be5d] pulsing-dot"></span>
              </button>
            </div>

            {/* System Section */}
            <div>
              <div className="px-3 pb-1.5 text-[10px] font-semibold tracking-wider text-[#52606d] uppercase font-mono">System</div>
              <nav>
                <NavLink to="/settings" onClick={closeMobile} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <svg className={`w-4 h-4 ${iconColorClass(isActive)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75"></path>
                        <circle cx="12" cy="12" r="3" strokeWidth="1.75"></circle>
                      </svg>
                      <span>Settings</span>
                    </>
                  )}
                </NavLink>
              </nav>
            </div>
          </div>
        </div>

        {/* Sidebar Footer / Operator Status */}
        <div className="p-3 border-t border-[#1e262b]/80 bg-[#090d0e] shrink-0">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-[#1a2029] transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-[#96be5d]">
              GO
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-200 truncate">Grid Operations</p>
              <p className="text-[10px] text-zinc-500 truncate font-mono">Operator console</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex items-center justify-between px-2 text-[10px] text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]"></span>
              Operational
            </span>
            <span className="text-zinc-600">v2.4.1</span>
          </div>
        </div>
      </aside>
    </>
  );
};
