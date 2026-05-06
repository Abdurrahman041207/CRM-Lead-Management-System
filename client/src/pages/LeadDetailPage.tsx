import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { leadsApi } from '../services/leadsApi';
import type { Lead, Note } from '../services/leadsApi';
import StatusBadge from '../components/StatusBadge';

export default function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [noteLoading, setNoteLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const leadId = Number(id);
    Promise.all([leadsApi.getOne(leadId), leadsApi.getNotes(leadId)])
      .then(([leadRes, notesRes]) => {
        setLead(leadRes.data);
        setNotes(notesRes.data);
      })
      .catch(() => setError('Lead not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNoteLoading(true);
    try {
      const res = await leadsApi.addNote(Number(id), newNote);
      setNotes([res.data, ...notes]);
      setNewNote('');
    } catch { setError('Failed to add note'); }
    finally { setNoteLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this lead?')) return;
    await leadsApi.delete(Number(id));
    navigate('/leads');
  };

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error || !lead) return <div className="text-red-400">{error || 'Lead not found'}</div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/leads" className="text-gray-400 hover:text-white text-sm">← Back to Leads</Link>
          <h1 className="text-2xl font-bold mt-1">{lead.name}</h1>
        </div>
        <div className="flex gap-3">
          <Link to={`/leads/${id}/edit`} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg">Edit</Link>
          <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg">Delete</button>
        </div>
      </div>

      {/* Lead Info */}
      <div className="bg-gray-800 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div><span className="text-gray-500 text-sm">Email</span><p>{lead.email}</p></div>
          <div><span className="text-gray-500 text-sm">Phone</span><p>{lead.phone || '—'}</p></div>
          <div><span className="text-gray-500 text-sm">Company</span><p>{lead.company || '—'}</p></div>
          <div><span className="text-gray-500 text-sm">Status</span><p className="mt-1"><StatusBadge status={lead.status} /></p></div>
          <div><span className="text-gray-500 text-sm">Source</span><p>{lead.source}</p></div>
          <div><span className="text-gray-500 text-sm">Deal Value</span><p>{lead.dealValue ? `$${lead.dealValue.toLocaleString()}` : '—'}</p></div>
          <div><span className="text-gray-500 text-sm">Created</span><p>{new Date(lead.createdAt).toLocaleDateString()}</p></div>
          <div><span className="text-gray-500 text-sm">Assigned To</span><p>{lead.assignedTo?.name}</p></div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Notes ({notes.length})</h2>

        <form onSubmit={handleAddNote} className="flex gap-3 mb-6">
          <input value={newNote} onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..." required
            className="flex-1 p-3 bg-gray-700 rounded-lg border border-gray-600 text-white focus:border-blue-500 focus:outline-none" />
          <button type="submit" disabled={noteLoading}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold disabled:opacity-50">
            {noteLoading ? 'Adding...' : 'Add'}
          </button>
        </form>

        {notes.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No notes yet. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {notes.map((note) => (
              <div key={note.id} className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-200">{note.content}</p>
                <p className="text-gray-500 text-sm mt-2">{new Date(note.createdAt).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
