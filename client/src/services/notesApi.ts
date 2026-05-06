import api from './api';

export interface Note {
  id: number;
  content: string;
  createdAt: string;
  leadId: number;
}

export const notesApi = {
  /** Fetch all notes for a given lead */
  getAll: (leadId: number) =>
    api.get<Note[]>(`/leads/${leadId}/notes`),

  /** Add a new note to a lead */
  create: (leadId: number, content: string) =>
    api.post<Note>(`/leads/${leadId}/notes`, { content }),
};
