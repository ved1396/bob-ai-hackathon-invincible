import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { StatusBadge } from '../components/ui/StatusBadge';
import { fetchAssets, createAsset } from '../services/api';

export const AssetsPage = () => {
  const navigate = useNavigate();
  const [assets, setAssets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');

  // Modal & Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form Fields
  const [assetId, setAssetId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('Transformer');
  const [substation, setSubstation] = useState('Substation S-21');
  const [age, setAge] = useState('5');
  const [manufacturer, setManufacturer] = useState('GE Grid Solutions');
  const [model, setModel] = useState('GX-300');
  const [capacity, setCapacity] = useState('75 MVA');
  const [voltage, setVoltage] = useState('138 kV');
  const [loadPct, setLoadPct] = useState('75');
  const [healthScore, setHealthScore] = useState('85');

  const loadAssetsData = () => {
    fetchAssets().then(setAssets);
  };

  useEffect(() => {
    loadAssetsData();
  }, []);

  const handleOpenModal = () => {
    setFormError('');
    setSuccessMsg('');
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    if (!isSubmitting) setShowAddModal(false);
  };

  const handleAddAssetSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    // Validation
    if (!assetId.trim()) {
      setFormError('Asset ID is required.');
      return;
    }
    if (!assetName.trim()) {
      setFormError('Asset Name is required.');
      return;
    }

    // Duplicate Check
    if (assets.some(a => a.id.toUpperCase() === assetId.trim().toUpperCase())) {
      setFormError(`Asset ID '${assetId.trim().toUpperCase()}' already exists. Please use a unique ID.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        id: assetId.trim().toUpperCase(),
        name: assetName.trim(),
        type: assetType,
        substation: substation,
        age: parseInt(age) || 5,
        manufacturer: manufacturer.trim(),
        model: model.trim(),
        capacity: capacity.trim(),
        voltage: voltage.trim(),
        loadPct: parseFloat(loadPct) || 75.0,
        healthScore: parseInt(healthScore) || 80
      };

      await createAsset(payload);
      setSuccessMsg(`Asset ${payload.id} successfully registered in database.`);
      loadAssetsData();

      setTimeout(() => {
        setShowAddModal(false);
        setAssetId('');
        setAssetName('');
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Database/API error creating asset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const filteredAssets = assets.filter(asset => {
    const matchesSearch =
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.substation.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = riskFilter === 'ALL' || asset.riskLevel === riskFilter;
    const matchesType = typeFilter === 'ALL' || asset.type.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesLocation = locationFilter === 'ALL' || asset.substation.includes(locationFilter);

    return matchesSearch && matchesRisk && matchesType && matchesLocation;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e262b] pb-4">
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Grid Asset Management</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                {filteredAssets.length} Assets Listed
              </span>
            </h1>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Monitor transformers, substations, distribution feeders, circuit breakers & transmission lines
            </p>
          </div>

          <button
            onClick={handleOpenModal}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-colors shadow-lg cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>+ Add Asset</span>
          </button>
        </div>

        {/* Success Alert Banner if present */}
        {successMsg && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 rounded-xl text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span>✓ {successMsg}</span>
            <button onClick={() => setSuccessMsg('')} className="text-emerald-400 font-bold">✕</button>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name, or substation..."
              className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#96be5d]"
            />
            <svg className="w-4 h-4 text-zinc-500 absolute left-3 top-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex flex-wrap gap-2 w-full md:w-auto items-center">
            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-[#0e1216] border border-[#232a35] rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#96be5d] font-mono"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low / Normal</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-[#0e1216] border border-[#232a35] rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#96be5d] font-mono"
            >
              <option value="ALL">All Asset Types</option>
              <option value="transformer">Transformer</option>
              <option value="substation">Substation</option>
              <option value="feeder">Feeder Line</option>
              <option value="breaker">Circuit Breaker</option>
              <option value="transmission">Transmission Line</option>
            </select>

            {/* Location Filter */}
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="bg-[#0e1216] border border-[#232a35] rounded-lg px-3 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-[#96be5d] font-mono"
            >
              <option value="ALL">All Substations</option>
              <option value="Substation S-21">Substation S-21</option>
              <option value="Substation S-08">Substation S-08</option>
              <option value="Substation S-14">Substation S-14</option>
              <option value="Substation S-03">Substation S-03</option>
            </select>

            {/* Add Asset Button in Toolbar */}
            <button
              onClick={handleOpenModal}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition-colors shadow cursor-pointer flex items-center gap-1 shrink-0"
            >
              <span>+ Add Asset</span>
            </button>
          </div>
        </div>

        {/* Asset Table */}
        <div className="bg-[#14181f] border border-[#232a35] rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0e1216] text-zinc-400 border-b border-[#232a35] uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-3">Asset ID</th>
                  <th className="py-3 px-3">Asset Name</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Location / Substation</th>
                  <th className="py-3 px-3">Age</th>
                  <th className="py-3 px-3">Health</th>
                  <th className="py-3 px-3">Failure Prob</th>
                  <th className="py-3 px-3">Risk Level</th>
                  <th className="py-3 px-3">Grid Impact</th>
                  <th className="py-3 px-3">Next Action</th>
                  <th className="py-3 px-3 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2630]">
                {filteredAssets.map(asset => (
                  <tr
                    key={asset.id}
                    onClick={() => navigate(`/assets/${asset.id}`)}
                    className="hover:bg-[#19212b] transition-colors cursor-pointer group"
                  >
                    <td className="py-3 px-3 font-bold text-white group-hover:text-[#96be5d]">{asset.id}</td>
                    <td className="py-3 px-3 font-sans font-semibold text-zinc-200">{asset.name}</td>
                    <td className="py-3 px-3 text-zinc-400">{asset.type}</td>
                    <td className="py-3 px-3 text-zinc-300">{asset.substation}</td>
                    <td className="py-3 px-3 text-zinc-400">{asset.age} yrs</td>
                    <td className="py-3 px-3">
                      <span className={asset.healthScore < 50 ? 'text-rose-400 font-bold' : asset.healthScore < 75 ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                        {asset.healthScore}%
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-rose-400">
                      {(asset.failureProbability * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge level={asset.riskLevel} score={asset.riskScore} pulse={asset.riskLevel === 'CRITICAL'} />
                    </td>
                    <td className="py-3 px-3 text-zinc-300 truncate max-w-[140px]">{asset.gridImpact}</td>
                    <td className="py-3 px-3 text-zinc-400 font-sans truncate max-w-[200px]">{asset.prescribedAction}</td>
                    <td className="py-3 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/assets/${asset.id}`)}
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
        </div>

        {/* Add Asset Modal Overlay */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-[#14181f] border border-[#232a35] rounded-xl p-6 w-full max-w-lg space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-[#232a35] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <h3 className="text-sm font-bold text-white font-mono uppercase">Register New Grid Asset</h3>
                </div>
                <button
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="text-zinc-400 hover:text-white text-base p-1"
                >
                  ✕
                </button>
              </div>

              {/* Form Validation Errors */}
              {formError && (
                <div className="p-3 bg-rose-950/80 border border-rose-600/60 rounded-lg text-xs font-mono text-rose-300">
                  ⚠️ {formError}
                </div>
              )}

              {/* Success Notification inside modal */}
              {successMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-lg text-xs font-mono text-emerald-300">
                  ✓ {successMsg}
                </div>
              )}

              {/* Add Asset Form */}
              <form onSubmit={handleAddAssetSubmit} className="space-y-3 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Asset ID *</label>
                    <input
                      type="text"
                      value={assetId}
                      onChange={(e) => setAssetId(e.target.value)}
                      placeholder="e.g. T-405"
                      disabled={isSubmitting}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d] uppercase font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Asset Type *</label>
                    <select
                      value={assetType}
                      onChange={(e) => setAssetType(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                    >
                      <option value="Transformer">Transformer</option>
                      <option value="Substation">Substation</option>
                      <option value="Feeder">Feeder Line</option>
                      <option value="Circuit Breaker">Circuit Breaker</option>
                      <option value="Transmission Line">Transmission Line</option>
                      <option value="Distribution Transformer">Distribution Transformer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Asset Name *</label>
                  <input
                    type="text"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder="e.g. Main Step-Down Transformer T-405"
                    disabled={isSubmitting}
                    className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d] font-sans"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Location / Substation *</label>
                    <select
                      value={substation}
                      onChange={(e) => setSubstation(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                    >
                      <option value="Substation S-21">Substation S-21</option>
                      <option value="Substation S-08">Substation S-08</option>
                      <option value="Substation S-14">Substation S-14</option>
                      <option value="Substation S-03">Substation S-03</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Manufacturer</label>
                    <input
                      type="text"
                      value={manufacturer}
                      onChange={(e) => setManufacturer(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Capacity (MVA)</label>
                    <input
                      type="text"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1">Voltage (kV)</label>
                    <input
                      type="text"
                      value={voltage}
                      onChange={(e) => setVoltage(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Load (%)</label>
                    <input
                      type="number"
                      value={loadPct}
                      onChange={(e) => setLoadPct(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1">Health Score (%)</label>
                    <input
                      type="number"
                      value={healthScore}
                      onChange={(e) => setHealthScore(e.target.value)}
                      disabled={isSubmitting}
                      className="w-full bg-[#0e1216] border border-[#232a35] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#96be5d]"
                    />
                  </div>
                </div>

                {/* Form Buttons */}
                <div className="pt-4 flex items-center justify-end gap-2 border-t border-[#232a35]">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded bg-zinc-800 text-zinc-300 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Saving to Database...</span>
                      </>
                    ) : (
                      <span>Save Asset to Database</span>
                    )}
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
