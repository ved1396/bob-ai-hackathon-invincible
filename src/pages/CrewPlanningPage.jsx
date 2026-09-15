import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { fetchCrews, updateCrew } from '../services/api';

export const CrewPlanningPage = () => {
  const navigate = useNavigate();
  const [crews, setCrews] = useState([]);

  const loadData = () => {
    fetchCrews().then(setCrews);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDispatch = async (crewId) => {
    await updateCrew(crewId, { status: 'Pre-Positioned' });
    loadData();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Crew Pre-Positioning & Dispatch Optimization</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#17221b] text-[#96be5d] font-mono font-bold">
                PROACTIVE DISPATCH
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              AI recommendations for pre-positioning repair crews in high failure probability zones before outages occur
            </p>
          </div>
        </div>

        {/* Recommended Crew Allocation Highlight Box */}
        <section className="bg-[#13191f] border border-[#232e38] rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-2 text-[#96be5d] font-bold text-xs font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-[#96be5d] animate-pulse"></span>
            <span>✦ AI RECOMMENDED CREW ALLOCATION</span>
          </div>
          <p className="text-xs md:text-sm text-zinc-200 leading-relaxed font-sans mb-3">
            "Pre-position <strong className="text-white font-mono">Crew C-07 (Transformer Specialists)</strong> at Substation S-21 prior to 14:00 UTC storm peak. Estimated arrival ETA is <strong className="text-emerald-400 font-mono">14 minutes</strong>. Substation S-21 holds 87% outage risk on Transformer T-104."
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleDispatch('CREW-C07')}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-colors cursor-pointer"
            >
              Approve & Pre-Position Crew C-07 Now
            </button>
            <button
              onClick={() => navigate('/assets/T-104')}
              className="px-3 py-1.5 rounded-lg bg-[#18241c] hover:bg-[#213327] text-[#96be5d] border border-[#2b3d2c] text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              View T-104 Telemetry
            </button>
          </div>
        </section>

        {/* Crew Table */}
        <section className="bg-[#14181f] border border-[#232a35] rounded-xl p-5 shadow-xl">
          <h3 className="text-sm font-semibold text-white tracking-tight mb-4">Active Field Crews & Pre-Positioning Status</h3>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0e1216] text-zinc-400 border-b border-[#232a35] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Crew Name</th>
                  <th className="py-3 px-3">Crew Lead</th>
                  <th className="py-3 px-3">Specialization / Skills</th>
                  <th className="py-3 px-3">Current Location</th>
                  <th className="py-3 px-3">Nearest Risk Zone</th>
                  <th className="py-3 px-3">Recommended Position</th>
                  <th className="py-3 px-3">ETA</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Dispatch Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2630]">
                {crews.map(crew => (
                  <tr key={crew.id} className="hover:bg-[#19212b] transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{crew.name}</td>
                    <td className="py-3 px-3 text-zinc-300 font-sans">{crew.lead}</td>
                    <td className="py-3 px-3 text-zinc-400 font-sans truncate max-w-[180px]">
                      {Array.isArray(crew.skills) ? crew.skills.join(', ') : crew.specialization}
                    </td>
                    <td className="py-3 px-3 text-zinc-300">{crew.currentLocation}</td>
                    <td className="py-3 px-3 text-rose-400 font-bold">{crew.nearestRiskZone}</td>
                    <td className="py-3 px-3 text-zinc-200 font-sans truncate max-w-[200px]">{crew.recommendedPosition}</td>
                    <td className="py-3 px-3 font-bold text-amber-300">{crew.eta}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        crew.status === 'Pre-Positioned' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                        crew.status === 'Dispatched' || crew.status === 'On Site' ? 'bg-purple-950 text-purple-300 border border-purple-700' :
                        'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}>
                        {crew.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleDispatch(crew.id)}
                        className="px-2.5 py-1 rounded bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-700 text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Pre-Position →
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
