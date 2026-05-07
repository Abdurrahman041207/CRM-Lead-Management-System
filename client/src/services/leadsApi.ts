import api from './api';

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'LOST' | 'WON';
  source: 'WEBSITE' | 'REFERRAL' | 'LINKEDIN' | 'COLD_CALL' | 'EMAIL' | 'OTHER';
  dealValue?: number;
  createdAt: string;
  updatedAt: string;
  assignedTo: { id: number; name: string; email: string };
  notes?: Note[];
}

export interface Note {
  id: number;
  content: string;
  createdAt: string;
  leadId: number;
}

export const leadsApi = {
  getAll: () => api.get<Lead[]>('/leads'),
  getOne: (id: number) => api.get<Lead>(`/leads/${id}`),
  create: (data: Partial<Lead>) => api.post<Lead>('/leads', data),
  update: (id: number, data: Partial<Lead>) => api.patch<Lead>(`/leads/${id}`, data),
  delete: (id: number) => api.delete(`/leads/${id}`),
  addNote: (leadId: number, content: string) => api.post<Note>(`/leads/${leadId}/notes`, { content }),
  getNotes: (leadId: number) => api.get<Note[]>(`/leads/${leadId}/notes`),
};
