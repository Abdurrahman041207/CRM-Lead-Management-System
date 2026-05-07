import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leadsApi } from '../services/leadsApi';
import type { Lead } from '../services/leadsApi';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    leadsApi
      .getAll()
      .then((res) => setLeads(res.data))
      .catch(() => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const total = leads.length;
  const byStatus = (s: Lead['status']) => leads.filter((l) => l.status === s).length;
  const totalDealValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const wonDealValue = leads
    .filter((l) => l.status === 'WON')
    .reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const leadCards = [
    { label: 'Total Leads', value: total, color: 'bg-blue-600' },
    { label: 'New', value: byStatus('NEW'), color: 'bg-blue-500' },
    { label: 'Contacted', value: byStatus('CONTACTED'), color: 'bg-yellow-500' },
    { label: 'Qualified', value: byStatus('QUALIFIED'), color: 'bg-purple-500' },
    { label: 'Proposal Sent', value: byStatus('PROPOSAL_SENT'), color: 'bg-orange-500' },
    { label: 'Won', value: byStatus('WON'), color: 'bg-green-500' },
    { label: 'Lost', value: byStatus('LOST'), color: 'bg-red-500' },
  ];

  const valueCards = [
    { label: 'Total Pipeline', value: `$${totalDealValue.toLocaleString()}`, color: 'bg-indigo-600' },
    { label: 'Won Revenue', value: `$${wonDealValue.toLocaleString()}`, color: 'bg-emerald-600' },
  ];

  const pipelineStatuses: Array<{ status: Lead['status']; name: string; bar: string }> = [
    { status: 'NEW', name: 'New', bar: 'bg-blue-500' },
    { status: 'CONTACTED', name: 'Contacted', bar: 'bg-yellow-500' },
    { status: 'QUALIFIED', name: 'Qualified', bar: 'bg-purple-500' },
    { status: 'PROPOSAL_SENT', name: 'Proposal Sent', bar: 'bg-orange-500' },
    { status: 'WON', name: 'Won', bar: 'bg-green-500' },
    { status: 'LOST', name: 'Lost', bar: 'bg-red-500' },
  ];

  if (loading) return <div className="text-gray-400">Loading dashboard...</div>;
  if (error) return <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Quick overview of your pipeline and lead performance.</p>
        </div>
        <Link
          to="/leads/new"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold inline-flex items-center"
        >
          + New Lead
        </Link>
      </div>

      {total === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">No leads yet</p>
          <p className="text-sm mt-1">Create your first lead to see stats here</p>
        </div>
      ) : (
        <>
          {/* Lead stats */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Lead Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {leadCards.map((card) => (
                <div key={card.label} className="bg-gray-800 rounded-xl p-6">
                  <p className="text-gray-400 text-sm">{card.label}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                  <div className={`h-1 ${card.color} rounded mt-3`} />
                </div>
              ))}
            </div>
          </div>

          {/* Value stats */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">Pipeline Values</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {valueCards.map((card) => (
                <div key={card.label} className="bg-gray-800 rounded-xl p-6">
                  <p className="text-gray-400 text-sm">{card.label}</p>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                  <div className={`h-1 ${card.color} rounded mt-3`} />
                </div>
              ))}
            </div>
          </div>

          {/* Secondary panels */}
          <div className="grid grid-cols-1 gap-6">
            {/* Pipeline breakdown */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Pipeline Breakdown</h2>
              <div className="space-y-4">
                {pipelineStatuses.map(({ status, name, bar }) => {
                  const count = byStatus(status);
                  const pct = total > 0 ? (count / total) * 100 : 0;

                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${bar}`} />
                          <span className="text-sm text-gray-300">{name}</span>
                        </div>
                        <div className="text-sm text-gray-400">
                          {count} ({pct.toFixed(0)}%)
                        </div>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 text-sm">
                <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2">
                  <span className="text-gray-400">Total Pipeline: </span>
                  <span className="font-semibold text-white">${totalDealValue.toLocaleString()}</span>
                </div>
                <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2">
                  <span className="text-gray-400">Won Revenue: </span>
                  <span className="font-semibold text-white">${wonDealValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
