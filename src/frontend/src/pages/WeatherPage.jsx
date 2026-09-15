import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { fetchWeather } from '../services/api';

export const WeatherPage = () => {
  const navigate = useNavigate();
  const [weatherList, setWeatherList] = useState([]);

  useEffect(() => {
    fetchWeather().then(setWeatherList);
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Weather Intelligence & Atmospheric Grid Risk</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Correlating storm fronts, lightning risk & extreme ambient heat to equipment outage probability
            </p>
          </div>
        </div>

        {/* Severe Alert Banner */}
        <div className="bg-rose-950/40 border border-rose-600/50 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shrink-0"></span>
            <div>
              <span className="text-rose-300 font-bold uppercase tracking-wider block">
                ZONE 4 SEVERE WEATHER WARNING ACTIVE
              </span>
              <span className="text-zinc-200">
                Heavy rainfall (45 mm/h) & 55 km/h wind gusts. Transformer T-104 and Feeder F-12 outage risk surcharged +18%.
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate('/assets/T-104')}
            className="px-3 py-1.5 rounded bg-rose-900 hover:bg-rose-800 text-white font-bold text-xs shrink-0 transition-colors"
          >
            Inspect T-104 →
          </button>
        </div>

        {/* 1. Regional Weather Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {weatherList.map(w => (
            <div key={w.id || w.region} className="bg-[#14181f] border border-[#232a35] rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase font-bold">{w.region}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    w.severity === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-700' : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {w.riskMultiplier || '+10%'} Risk
                  </span>
                </div>

                <div className="text-lg font-bold text-white mb-3 font-sans">{w.condition}</div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
                  <div className="p-2 bg-[#0e1216] rounded border border-[#232a35]">
                    <div className="text-[10px] text-zinc-500">Temp</div>
                    <div className="text-sm font-bold text-zinc-200">{w.temperature}</div>
                  </div>
                  <div className="p-2 bg-[#0e1216] rounded border border-[#232a35]">
                    <div className="text-[10px] text-zinc-500">Wind Gusts</div>
                    <div className="text-sm font-bold text-rose-400">{w.windSpeed}</div>
                  </div>
                  <div className="p-2 bg-[#0e1216] rounded border border-[#232a35]">
                    <div className="text-[10px] text-zinc-500">Rainfall</div>
                    <div className="text-sm font-bold text-amber-300">{w.rainfall}</div>
                  </div>
                  <div className="p-2 bg-[#0e1216] rounded border border-[#232a35]">
                    <div className="text-[10px] text-zinc-500">Lightning</div>
                    <div className="text-sm font-bold text-purple-300">{w.lightningRisk}</div>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{w.alertMessage}</p>
              </div>
            </div>
          ))}
        </section>

        {/* 2. 24-Hour Weather Forecast Grid */}
        <section className="bg-[#14181f] border border-[#232a35] rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white tracking-tight mb-3">Atmospheric Outlook (Next 24 Hours)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-[#0e1216] border border-[#232a35] rounded-lg">
              <div className="text-amber-400 font-bold text-xs uppercase mb-1">Next 6 Hours</div>
              <div className="text-sm font-bold text-white font-sans">Storm Peak Window</div>
              <p className="text-xs text-zinc-400 mt-2 font-sans">
                Peak wind speeds up to 58 km/h in Zone 4. Highest risk window for overhead feeder line trips.
              </p>
            </div>
            <div className="p-4 bg-[#0e1216] border border-[#232a35] rounded-lg">
              <div className="text-amber-400 font-bold text-xs uppercase mb-1">Next 12 Hours</div>
              <div className="text-sm font-bold text-white font-sans">Easing Rain / Sustained Heat</div>
              <p className="text-xs text-zinc-400 mt-2 font-sans">
                Rainfall decreases to 10 mm/h. Ambient temperature remains elevated at 33°C causing cooling stress.
              </p>
            </div>
            <div className="p-4 bg-[#0e1216] border border-[#232a35] rounded-lg">
              <div className="text-emerald-400 font-bold text-xs uppercase mb-1">Next 24 Hours</div>
              <div className="text-sm font-bold text-white font-sans">Clear Atmospheric Conditions</div>
              <p className="text-xs text-zinc-400 mt-2 font-sans">
                Wind speeds calm to 15 km/h across all grid sectors. System risk surcharges normalize.
              </p>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};
