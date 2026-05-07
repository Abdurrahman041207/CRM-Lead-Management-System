import { useState, useEffect } from 'react';
import { leadsApi } from '../services/leadsApi';
import type { Lead } from '../services/leadsApi';

export default function DashboardPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leadsApi.getAll()
      .then((res) => setLeads(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading dashboard...</div>;

  const total = leads.length;
  const byStatus = (s: string) => leads.filter((l) => l.status === s).length;
  const totalDealValue = leads.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const wonDealValue = leads.filter((l) => l.status === 'WON').reduce((sum, l) => sum + (l.dealValue || 0), 0);

  const cards = [
    { label: 'Total Leads', value: total, color: 'bg-blue-600' },
    { label: 'New', value: byStatus('NEW'), color: 'bg-blue-500' },
    { label: 'Contacted', value: byStatus('CONTACTED'), color: 'bg-yellow-500' },
    { label: 'Qualified', value: byStatus('QUALIFIED'), color: 'bg-purple-500' },
    { label: 'Proposal Sent', value: byStatus('PROPOSAL_SENT'), color: 'bg-orange-500' },
    { label: 'Won', value: byStatus('WON'), color: 'bg-green-500' },
    { label: 'Lost', value: byStatus('LOST'), color: 'bg-red-500' },
    { label: 'Total Pipeline', value: `$${totalDealValue.toLocaleString()}`, color: 'bg-indigo-600' },
    { label: 'Won Revenue', value: `$${wonDealValue.toLocaleString()}`, color: 'bg-emerald-600' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {total === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">No leads yet</p>
          <p className="text-sm mt-1">Create your first lead to see stats here</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((card) => (
            <div key={card.label} className="bg-gray-800 rounded-xl p-6">
              <p className="text-gray-400 text-sm">{card.label}</p>
              <p className="text-3xl font-bold mt-2">{card.value}</p>
              <div className={`h-1 ${card.color} rounded mt-3`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
