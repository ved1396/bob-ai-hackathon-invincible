import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { fetchSensors } from '../services/api';

export const SensorHealthPage = () => {
  const navigate = useNavigate();
  const [sensors, setSensors] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchSensors().then(setSensors);
  }, []);

  const totalSensors = sensors.length;
  const criticalSensors = sensors.filter(s => s.status === 'Critical').length;
  const warningSensors = sensors.filter(s => s.status === 'Warning').length;
  const healthySensors = sensors.filter(s => s.status === 'Healthy').length;

  const filteredSensors = sensors.filter(s => statusFilter === 'ALL' || s.status === statusFilter);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Telemetry Sensor Health Monitoring</span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Real-time telemetry feeds: Temperature, Vibration, Oil Quality, Partial Discharge, Voltage & Current
            </p>
          </div>
        </div>

        {/* Sensor KPI Summary Row */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-4">
            <div className="text-[10px] font-mono text-zinc-400 uppercase">Total Sensor Nodes</div>
            <div className="text-2xl font-bold font-mono text-white mt-1">{totalSensors}</div>
            <div className="text-[10px] text-zinc-500 mt-1 font-mono">Telemetry feeds live</div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-4">
            <div className="text-[10px] font-mono text-rose-400 uppercase">Critical Thresholds</div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{criticalSensors}</div>
            <div className="text-[10px] text-rose-300 mt-1 font-mono">Immediate attention</div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-4">
            <div className="text-[10px] font-mono text-amber-400 uppercase">Warning State</div>
            <div className="text-2xl font-bold font-mono text-amber-300 mt-1">{warningSensors}</div>
            <div className="text-[10px] text-amber-400 mt-1 font-mono">Elevated readings</div>
          </div>
          <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-4">
            <div className="text-[10px] font-mono text-emerald-400 uppercase">Healthy Nodes</div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{healthySensors}</div>
            <div className="text-[10px] text-emerald-500 mt-1 font-mono">Nominal telemetry</div>
          </div>
        </section>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {['ALL', 'Critical', 'Warning', 'Healthy'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded transition-colors ${
                statusFilter === st ? 'bg-[#96be5d] text-black font-bold' : 'bg-[#14181f] text-zinc-400 border border-[#232a35] hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Sensor Feeds Table */}
        <section className="bg-[#14181f] border border-[#232a35] rounded-xl p-5">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0e1216] text-zinc-400 border-b border-[#232a35] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Sensor ID</th>
                  <th className="py-3 px-3">Asset ID</th>
                  <th className="py-3 px-3">Sensor Type</th>
                  <th className="py-3 px-3">Live Reading</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Operating Limit</th>
                  <th className="py-3 px-3">Last Updated</th>
                  <th className="py-3 px-3 text-right">Inspect Asset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2630]">
                {filteredSensors.map(sen => (
                  <tr key={sen.id} className="hover:bg-[#19212b] transition-colors">
                    <td className="py-3 px-3 font-bold text-white">{sen.id}</td>
                    <td className="py-3 px-3 font-bold text-[#96be5d] cursor-pointer hover:underline" onClick={() => navigate(`/assets/${sen.assetId}`)}>
                      {sen.assetId}
                    </td>
                    <td className="py-3 px-3 text-zinc-300 font-sans font-semibold">{sen.type}</td>
                    <td className="py-3 px-3 font-bold text-sm">
                      <span className={sen.status === 'Critical' ? 'text-rose-400' : sen.status === 'Warning' ? 'text-amber-300' : 'text-emerald-400'}>
                        {sen.value}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        sen.status === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-700' : sen.status === 'Warning' ? 'bg-amber-950 text-amber-300 border border-amber-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                      }`}>
                        {sen.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-zinc-400">{sen.threshold}</td>
                    <td className="py-3 px-3 text-zinc-500">{sen.lastUpdated}</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/assets/${sen.assetId}`)}
                        className="px-2.5 py-1 rounded bg-[#18241c] hover:bg-[#213327] text-[#96be5d] border border-[#2b3d2c] text-[10px] font-bold transition-colors"
                      >
                        Inspect →
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
