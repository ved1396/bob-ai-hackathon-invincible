import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/ui/StatusBadge';
import { fetchMaintenance, createMaintenance, updateMaintenance, fetchAssets } from '../services/api';

export const MaintenancePage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [assets, setAssets] = useState([]);
  const [filterPriority, setFilterPriority] = useState('ALL');

  // Schedule Maintenance Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('T-104');
  const [workPriority, setWorkPriority] = useState('P1 - CRITICAL');
  const [maintenanceDesc, setMaintenanceDesc] = useState('');
  const [assignedCrew, setAssignedCrew] = useState('Crew C-07');
  const [dueDate, setDueDate] = useState('Today');

  const loadData = () => {
    fetchMaintenance().then(setTasks);
    fetchAssets().then(setAssets);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    await updateMaintenance(id, { status: newStatus });
    loadData();
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!maintenanceDesc.trim()) return;

    const targetAsset = assets.find(a => a.id === selectedAssetId) || { name: selectedAssetId, riskScore: 85, gridImpact: 'Critical' };

    const payload = {
      priority: workPriority,
      assetId: selectedAssetId,
      assetName: targetAsset.name,
      risk: `${targetAsset.riskScore || 85}%`,
      gridImpact: targetAsset.gridImpact || 'Critical',
      recommendedMaintenance: maintenanceDesc.trim(),
      dueDate: dueDate,
      assignedCrew: assignedCrew
    };

    await createMaintenance(payload);
    setShowScheduleModal(false);
    setMaintenanceDesc('');
    loadData();
  };

  const filteredTasks = tasks.filter(t => filterPriority === 'ALL' || t.priority.includes(filterPriority));

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Predictive Maintenance Queue</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono font-bold">
                AI PRIORITIZED
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Actionable work orders ranked by failure probability, grid severity & equipment degradation
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              + Schedule Maintenance
            </button>
            <button
              onClick={() => navigate('/crew-planning')}
              className="px-3.5 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold font-mono transition-colors cursor-pointer"
            >
              Dispatch Crews →
            </button>
          </div>
        </div>

        {/* Priority Filter Bar */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {['ALL', 'P1', 'P2', 'P3'].map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded transition-colors ${
                filterPriority === p ? 'bg-[#96be5d] text-black font-bold' : 'bg-[#14181f] text-zinc-400 border border-[#232a35] hover:text-white'
              }`}
            >
              {p === 'ALL' ? 'All Priorities' : `${p} Tasks`}
            </button>
          ))}
        </div>

        {/* Maintenance Queue Table */}
        <section className="bg-[#14181f] border border-[#232a35] rounded-xl p-5 shadow-xl">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0e1216] text-zinc-400 border-b border-[#232a35] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">WO Priority</th>
                  <th className="py-3 px-3">Asset ID</th>
                  <th className="py-3 px-3">Asset Name</th>
                  <th className="py-3 px-3">Failure Risk</th>
                  <th className="py-3 px-3">Grid Impact</th>
                  <th className="py-3 px-3">Recommended Action</th>
                  <th className="py-3 px-3">Due Window</th>
                  <th className="py-3 px-3">Assigned Crew</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2630]">
                {filteredTasks.map(t => (
                  <tr key={t.id} className="hover:bg-[#19212b] transition-colors">
                    <td className="py-3 px-3 font-bold">
                      <StatusBadge level={t.priority} pulse={t.priority.includes('P1')} />
                    </td>
                    <td className="py-3 px-3 font-bold text-white group-hover:text-[#96be5d] cursor-pointer hover:underline" onClick={() => navigate(`/assets/${t.assetId}`)}>
                      {t.assetId}
                    </td>
                    <td className="py-3 px-3 font-sans font-semibold text-zinc-200">{t.assetName}</td>
                    <td className="py-3 px-3 font-bold text-rose-400 text-sm">{t.risk}</td>
                    <td className="py-3 px-3 text-zinc-300">{t.gridImpact}</td>
                    <td className="py-3 px-3 text-zinc-300 font-sans truncate max-w-[220px]">{t.recommendedMaintenance}</td>
                    <td className="py-3 px-3 text-amber-300 font-bold">{t.dueDate}</td>
                    <td className="py-3 px-3 text-emerald-400 font-semibold">{t.assignedCrew}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        t.status === 'Completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' :
                        t.status === 'Scheduled' ? 'bg-blue-950 text-blue-300 border border-blue-700' :
                        'bg-amber-950 text-amber-300 border border-amber-700'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right flex justify-end gap-1.5">
                      {t.status !== 'Completed' && (
                        <button
                          onClick={() => handleUpdateStatus(t.id, 'Completed')}
                          className="px-2 py-1 rounded bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 text-[10px] font-bold cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}
                      <button
                        onClick={() => navigate('/crew-planning')}
                        className="px-2 py-1 rounded bg-[#18241c] hover:bg-[#213327] text-[#96be5d] border border-[#2b3d2c] text-[10px] font-bold cursor-pointer"
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

        {/* Modal: Schedule Maintenance */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#232a35] pb-3">
                <h3 className="text-sm font-bold text-white font-mono uppercase">Schedule Maintenance Work Order</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1">Target Asset ID</label>
                  <select
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2 text-white focus:outline-none focus:border-[#96be5d]"
                  >
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>{a.id} — {a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Priority Level</label>
                  <select
                    value={workPriority}
                    onChange={(e) => setWorkPriority(e.target.value)}
                    className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2 text-white focus:outline-none focus:border-[#96be5d]"
                  >
                    <option value="P1 - CRITICAL">P1 - CRITICAL (Immediate)</option>
                    <option value="P2 - HIGH">P2 - HIGH (24 Hours)</option>
                    <option value="P3 - MEDIUM">P3 - MEDIUM (Within 7 Days)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Recommended Action / Scope</label>
                  <input
                    type="text"
                    value={maintenanceDesc}
                    onChange={(e) => setMaintenanceDesc(e.target.value)}
                    placeholder="e.g. Inspect coil thermal dissipation & oil breakdown"
                    className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2 text-white focus:outline-none focus:border-[#96be5d]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Assigned Crew</label>
                    <select
                      value={assignedCrew}
                      onChange={(e) => setAssignedCrew(e.target.value)}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2 text-white focus:outline-none focus:border-[#96be5d]"
                    >
                      <option value="Crew C-07">Crew C-07 (Transformer Specs)</option>
                      <option value="Crew C-02">Crew C-02 (Oil Diagnostics)</option>
                      <option value="Crew C-03">Crew C-03 (Substation Team)</option>
                      <option value="Crew C-05">Crew C-05 (Mechanical Techs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-zinc-400 mb-1">Due Window</label>
                    <select
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2 text-white focus:outline-none focus:border-[#96be5d]"
                    >
                      <option value="Today (Immediate)">Today (Immediate)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="Within 3 Days">Within 3 Days</option>
                      <option value="Next Week">Next Week</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                  >
                    Schedule Work Order
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
