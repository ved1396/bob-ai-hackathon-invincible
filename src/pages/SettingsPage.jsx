import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';

export const SettingsPage = () => {
  const [demoMode, setDemoMode] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [weatherKey, setWeatherKey] = useState('');
  const [tempLimit, setTempLimit] = useState(90);
  const [vibLimit, setVibLimit] = useState(4.5);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>System & Risk Threshold Settings</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Configure DEMO_MODE execution, API keys, AI model integrations, and SCADA alarm thresholds
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-lg text-xs font-mono text-emerald-300">
            ✓ Settings saved successfully.
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 font-mono text-xs max-w-3xl">
          {/* Demo Mode & Operational State */}
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-tight font-sans">Execution Mode</h3>
            <div className="flex items-center justify-between p-3 bg-[#0e1216] border border-[#232a35] rounded-lg">
              <div>
                <div className="text-zinc-200 font-bold">DEMO_MODE (Offline Fallback)</div>
                <div className="text-[11px] text-zinc-400 font-sans mt-0.5">
                  When enabled, uses realistic mock telemetry and deterministic AI responses if API keys are absent.
                </div>
              </div>
              <input
                type="checkbox"
                checked={demoMode}
                onChange={(e) => setDemoMode(e.target.checked)}
                className="w-5 h-5 accent-[#96be5d] cursor-pointer"
              />
            </div>
          </div>

          {/* External API Integration */}
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-tight font-sans">External API Keys (Optional)</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 mb-1">Groq / OpenAI API Key (Bob Assistant LLM)</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="gsk_..."
                  className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#96be5d]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">OpenWeatherMap API Key (Live Weather Forecast)</label>
                <input
                  type="password"
                  value={weatherKey}
                  onChange={(e) => setWeatherKey(e.target.value)}
                  placeholder="owm_..."
                  className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#96be5d]"
                />
              </div>
            </div>
          </div>

          {/* Alarm Thresholds */}
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-tight font-sans">Alarm Threshold Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 mb-1">Top-Oil Temp Alarm Limit (°C)</label>
                <input
                  type="number"
                  value={tempLimit}
                  onChange={(e) => setTempLimit(Number(e.target.value))}
                  className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                />
              </div>
              <div>
                <label className="block text-zinc-400 mb-1">Vibration Alarm Limit (mm/s)</label>
                <input
                  type="number"
                  step="0.1"
                  value={vibLimit}
                  onChange={(e) => setVibLimit(Number(e.target.value))}
                  className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold font-mono transition-colors shadow-lg cursor-pointer"
          >
            Save System Configurations
          </button>
        </form>
      </div>
    </AppLayout>
  );
};
