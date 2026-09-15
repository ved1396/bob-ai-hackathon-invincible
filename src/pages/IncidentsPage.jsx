import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/ui/StatusBadge';
import { fetchIncidents, createIncident, updateIncident } from '../services/api';

export const IncidentsPage = () => {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newIncidentTitle, setNewIncidentTitle] = useState('');
  const [newIncidentAsset, setNewIncidentAsset] = useState('T-104');
  const [newIncidentSeverity, setNewIncidentSeverity] = useState('HIGH');

  const loadData = () => {
    fetchIncidents().then(setIncidents);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateIncident = async (e) => {
    e.preventDefault();
    if (!newIncidentTitle.trim()) return;

    const payload = {
      assetId: newIncidentAsset,
      title: newIncidentTitle,
      severity: newIncidentSeverity,
      cause: 'Manually logged by grid operator',
      assignedCrew: 'Unassigned',
      location: 'Substation S-21'
    };

    await createIncident(payload);
    setShowCreateModal(false);
    setNewIncidentTitle('');
    loadData();
  };

  const handleResolveIncident = async (id) => {
    await updateIncident(id, { status: 'Resolved' });
    loadData();
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Grid Incident Management</span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono">
                {incidents.filter(i => i.status !== 'Resolved').length} Active
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Track emergency grid alarms, equipment thermal spikes, and storm containment operations
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-colors cursor-pointer"
          >
            + Create New Incident
          </button>
        </div>

        {/* Incidents Table */}
        <section className="bg-[#14181f] border border-[#232a35] rounded-xl p-5 shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0e1216] text-zinc-400 border-b border-[#232a35] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Incident ID</th>
                  <th className="py-3 px-3">Asset ID</th>
                  <th className="py-3 px-3">Title / Description</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Detected</th>
                  <th className="py-3 px-3">Root Cause</th>
                  <th className="py-3 px-3">Assigned Crew</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2630]">
                {incidents.map(inc => (
                  <tr key={inc.id} className="hover:bg-[#19212b] transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{inc.id}</td>
                    <td className="py-3 px-3 font-bold text-[#96be5d] cursor-pointer hover:underline" onClick={() => navigate(`/assets/${inc.assetId}`)}>
                      {inc.assetId}
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-zinc-200">{inc.title}</td>
                    <td className="py-3 px-3">
                      <StatusBadge level={inc.severity} pulse={inc.severity === 'CRITICAL'} />
                    </td>
                    <td className="py-3 px-3 text-zinc-400">{inc.detectedTime}</td>
                    <td className="py-3 px-3 text-zinc-400 font-sans truncate max-w-[200px]">{inc.cause}</td>
                    <td className="py-3 px-3 text-amber-300 font-semibold">{inc.assignedCrew}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inc.status === 'Resolved' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                        inc.status === 'Crew Dispatched' ? 'bg-purple-950 text-purple-300 border border-purple-700' :
                        'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}>
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right flex justify-end gap-1.5">
                      {inc.status !== 'Resolved' && (
                        <button
                          onClick={() => handleResolveIncident(inc.id)}
                          className="px-2 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-[10px] font-bold"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => navigate('/crew-planning')}
                        className="px-2 py-1 rounded bg-[#18241c] hover:bg-[#213327] text-[#96be5d] border border-[#2b3d2c] text-[10px] font-bold"
                      >
                        Assign Crew
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Modal: Create Incident */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#232a35] pb-3">
                <h3 className="text-sm font-bold text-white font-mono uppercase">Log New Grid Incident</h3>
                <button onClick={() => setShowCreateModal(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleCreateIncident} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Target Asset ID</label>
                  <select
                    value={newIncidentAsset}
                    onChange={(e) => setNewIncidentAsset(e.target.value)}
                    className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2 text-white focus:outline-none focus:border-[#96be5d]"
                  >
                    <option value="T-104">T-104 (Substation S-21)</option>
                    <option value="T-208">T-208 (Substation S-08)</option>
                    <option value="S-21">S-21 (Switching Substation)</option>
                    <option value="F-12">F-12 (Feeder Trunk Line)</option>
                    <option value="CB-402">CB-402 (Circuit Breaker)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Incident Title / Alarm Description</label>
                  <input
                    type="text"
                    value={newIncidentTitle}
                    onChange={(e) => setNewIncidentTitle(e.target.value)}
                    placeholder="e.g. Phase B bushing thermal spike observed"
                    className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2 text-white focus:outline-none focus:border-[#96be5d]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Severity</label>
                  <select
                    value={newIncidentSeverity}
                    onChange={(e) => setNewIncidentSeverity(e.target.value)}
                    className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2 text-white focus:outline-none focus:border-[#96be5d]"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                  >
                    Create Incident
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};
