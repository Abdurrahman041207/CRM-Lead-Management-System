import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadsApi } from '../services/leadsApi';
import type { Lead } from '../services/leadsApi';
import StatusBadge from '../components/StatusBadge';

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');

  const fetchLeads = async () => {
    try {
      const res = await leadsApi.getAll();
      setLeads(res.data);
    } catch { setError('Failed to load leads'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLeads(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await leadsApi.delete(id);
      setLeads(leads.filter((l) => l.id !== id));
    } catch { setError('Failed to delete lead'); }
  };

  const filtered = leads.filter((l) => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (sourceFilter !== 'ALL' && l.source !== sourceFilter) return false;
    return true;
  });

  if (loading) return <div className="text-gray-400">Loading leads...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Leads</h1>
        <Link to="/leads/new" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold">
          + New Lead
        </Link>
      </div>

      {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">{error}</div>}

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
          <option value="ALL">All Statuses</option>
          {['NEW','CONTACTED','QUALIFIED','PROPOSAL_SENT','LOST','WON'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
          className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
          <option value="ALL">All Sources</option>
          {['WEBSITE','REFERRAL','LINKEDIN','COLD_CALL','EMAIL','OTHER'].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">No leads found</p>
          <p className="text-sm mt-1">Create your first lead to get started</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Company</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Source</th>
                <th className="text-right p-4">Deal Value</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead) => (
                <tr key={lead.id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="p-4">
                    <Link to={`/leads/${lead.id}`} className="text-blue-400 hover:underline">{lead.name}</Link>
                    <div className="text-gray-500 text-sm">{lead.email}</div>
                  </td>
                  <td className="p-4 text-gray-300">{lead.company || '—'}</td>
                  <td className="p-4"><StatusBadge status={lead.status} /></td>
                  <td className="p-4 text-gray-400 text-sm">{lead.source}</td>
                  <td className="p-4 text-right text-gray-300">
                    {lead.dealValue ? `$${lead.dealValue.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4 text-right">
                    <Link to={`/leads/${lead.id}/edit`} className="text-yellow-400 hover:text-yellow-300 mr-3">Edit</Link>
                    <button onClick={() => handleDelete(lead.id)} className="text-red-400 hover:text-red-300">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
