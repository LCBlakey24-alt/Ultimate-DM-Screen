import React from 'react';
import { FileText, Send, Users, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { toast } from 'sonner';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function NotesTab({ theme, campaignId, quickNote, setQuickNote, processingNote, handleSubmitNote, sessionNotes, setSessionNotes }) {
  const syncNote = async () => {
    if (!quickNote.trim()) return;
    try {
      await axios.post(`${API}/campaigns/${campaignId}/sync-note`, {
        note_content: quickNote, note_type: 'gm_note', title: 'Session Update', create_timeline_event: true
      });
      toast.success('Note synced to all players!');
      setQuickNote('');
    } catch {
      toast.error('Failed to sync note');
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily: "'Cinzel', serif", fontSize: '22px', color: theme.text.primary, fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText size={24} style={{ color: theme.accent.secondary }} /> Session Notes
      </h2>
      
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Add Note */}
        <div>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '16px', color: theme.accent.gm, fontWeight: '600', marginBottom: '12px' }}>Quick Note</h3>
          <textarea value={quickNote} onChange={(e) => setQuickNote(e.target.value)}
            style={{ minHeight: '150px', marginBottom: '12px', fontSize: '15px', width: '100%', background: 'rgba(15, 10, 30, 0.6)', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '14px', color: theme.text.primary, resize: 'vertical' }}
            placeholder="Write a quick note about the session... NPCs met, events, plot points, etc." />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={handleSubmitNote} disabled={processingNote || !quickNote.trim()} className="press-scale"
              style={{ flex: 1, display: 'flex', gap: '8px', justifyContent: 'center', background: theme.gradient, color: theme.text.primary, border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px' }}>
              {processingNote ? <Loader size={16} className="animate-spin" /> : <Send size={16} />} Save Note
            </Button>
            <Button onClick={syncNote} disabled={!quickNote.trim()} className="press-scale tab-glow"
              style={{ display: 'flex', gap: '8px', justifyContent: 'center', background: 'rgba(212, 160, 23, 0.2)', color: theme.accent.secondary, border: `1px solid ${theme.accent.secondary}`, borderRadius: '10px', padding: '14px', fontSize: '14px', whiteSpace: 'nowrap' }}>
              <Users size={16} /> Sync to Players
            </Button>
          </div>
        </div>

        {/* Notes List */}
        <div>
          <h3 style={{ fontFamily: "'Cinzel', serif", fontSize: '16px', color: theme.accent.gm, fontWeight: '600', marginBottom: '12px' }}>Recent Notes ({sessionNotes.length})</h3>
          <div className="scroll-smooth" style={{ maxHeight: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessionNotes.length === 0 ? (
              <div className="card-hover" style={{ background: theme.bg.card, border: `2px dashed ${theme.border}`, padding: '30px', textAlign: 'center', borderRadius: '10px' }}>
                <FileText size={32} style={{ color: theme.text.muted, margin: '0 auto 12px' }} />
                <p style={{ color: theme.text.secondary, fontSize: '13px' }}>No notes yet</p>
              </div>
            ) : (
              sessionNotes.map(note => (
                <div key={note.id} className="card-hover" style={{ background: theme.bg.card, border: `1px solid ${theme.border}`, padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: theme.text.muted, marginBottom: '6px' }}>
                    {new Date(note.created_at).toLocaleString()}
                  </div>
                  <div style={{ color: theme.text.white, fontSize: '13px', lineHeight: '1.5' }}>{note.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
