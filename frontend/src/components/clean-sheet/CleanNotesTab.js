import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { API_BASE } from '@/lib/api';

const API = API_BASE;

function FieldBlock({ label, value }) {
  if (!value) return null;
  return (
    <div className="clean-sheet-note-field">
      <span>{label}</span>
      <p>{value}</p>
    </div>
  );
}

export default function CleanNotesTab({ character, onCharacterUpdate }) {
  const [notes, setNotes] = useState(character?.notes || '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNotes(character?.notes || '');
  }, [character?.id, character?.notes]);

  const saveNotes = async () => {
    if (!character?.id || saving) return;
    setSaving(true);
    try {
      await axios.patch(`${API}/characters/${character.id}`, { notes });
      onCharacterUpdate?.({ notes });
      toast.success('Notes saved');
    } catch (error) {
      toast.error('Could not save notes');
    } finally {
      setSaving(false);
    }
  };

  const hasPersonality = Boolean(
    character?.personality_trait || character?.personality_traits ||
    character?.ideal || character?.ideals ||
    character?.bond || character?.bonds ||
    character?.flaw || character?.flaws
  );

  return (
    <div className="clean-sheet-grid">
      <section className="clean-sheet-panel clean-sheet-wide">
        <h2>Character Notes</h2>
        <textarea
          className="clean-sheet-notes-textarea"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Write character notes here..."
        />
        <div className="clean-sheet-notes-actions">
          <button type="button" onClick={saveNotes} disabled={saving}>
            {saving ? 'Saving...' : 'Save Notes'}
          </button>
        </div>
      </section>

      <section className="clean-sheet-panel">
        <h2>Personality</h2>
        <FieldBlock label="Trait" value={character?.personality_trait || character?.personality_traits} />
        <FieldBlock label="Ideal" value={character?.ideal || character?.ideals} />
        <FieldBlock label="Bond" value={character?.bond || character?.bonds} />
        <FieldBlock label="Flaw" value={character?.flaw || character?.flaws} />
        {!hasPersonality && <p className="clean-sheet-muted">No personality details found yet.</p>}
      </section>

      <section className="clean-sheet-panel">
        <h2>Backstory</h2>
        {character?.backstory ? (
          <p className="clean-sheet-backstory-text">{character.backstory}</p>
        ) : (
          <p className="clean-sheet-muted">No backstory found yet.</p>
        )}
      </section>
    </div>
  );
}
