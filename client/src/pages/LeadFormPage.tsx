import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { leadsApi } from '../services/leadsApi';

const statuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'LOST', 'WON'];
const sources = ['WEBSITE', 'REFERRAL', 'LINKEDIN', 'COLD_CALL', 'EMAIL', 'OTHER'];

export default function LeadFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '',
    status: 'NEW', source: 'OTHER', dealValue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pageLoading, setPageLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit && id) {
      leadsApi.getOne(Number(id))
        .then((res) => setForm({
          name: res.data.name,
          email: res.data.email,
          phone: res.data.phone || '',
          company: res.data.company || '',
          status: res.data.status,
          source: res.data.source,
          dealValue: res.data.dealValue || 0,
        }))
        .catch(() => setError('Lead not found'))
        .finally(() => setPageLoading(false));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    if (name === 'phone') {
      value = value.replace(/\D/g, '');
    }

    setForm((prev) => ({
      ...prev,
      [name]: name === 'dealValue' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await leadsApi.update(Number(id), form);
      } else {
        await leadsApi.create(form);
      }
      navigate('/leads');
    } catch (err: any) {
      setError(err.response?.data?.message?.join?.(', ') || err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <div className="text-gray-400">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Lead' : 'New Lead'}</h1>
      {error && <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-gray-800 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email *</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Phone</label>
            <input name="phone" type="tel" value={form.phone} onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Company</label>
            <input name="company" value={form.company} onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Status</label>
            <select name="status" value={form.status} onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Source</label>
            <select name="source" value={form.source} onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white">
              {sources.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm text-gray-400 mb-1">Deal Value ($)</label>
            <input name="dealValue" type="number" value={form.dealValue} onChange={handleChange}
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Update Lead' : 'Create Lead'}
          </button>
          <button type="button" onClick={() => navigate('/leads')}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-lg">Cancel</button>
        </div>
      </form>
    </div>
  );
}
