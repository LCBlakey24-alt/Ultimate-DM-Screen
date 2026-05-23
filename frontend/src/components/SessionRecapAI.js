import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Sparkles, FileText, Clock, Users, Swords, MapPin,
  RefreshCw, Copy, Download, ChevronDown, ChevronUp
} from 'lucide-react';
import apiClient from '@/lib/apiClient';

const theme = {
  primary: 'var(--rq-accent-primary, #C1121F)',
  hover: 'var(--rq-accent-hover, #D62839)',
  subtle: 'var(--rq-accent-soft, rgba(193,18,31,0.12))',
  glow: '0 0 20px rgba(193, 18, 31, 0.24)',
  bg: 'var(--rq-bg-main, #1A1A1A)',
  card: 'var(--rq-bg-panel, #242424)',
  panel: 'var(--rq-bg-panel, #242424)',
  text: 'var(--rq-text-primary, #FFFFFF)',
  textSecondary: 'var(--rq-text-secondary, #D6D6D6)',
  muted: 'var(--rq-text-muted, #A0A0A0)',
  border: 'var(--rq-accent-border, rgba(193,18,31,0.35))',
};

/**
 * Rook-powered text recap drafter.
 * Takes session notes and drafts a formatted session summary.
 */
function SessionRecapAI({ campaignId, sessionNotes = '', onSaveRecap }) {
  const [notes, setNotes] = useState(sessionNotes);
  const [recap, setRecap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [recapStyle, setRecapStyle] = useState('narrative');
  const [includeSections, setIncludeSections] = useState({
    summary: true,
    keyEvents: true,
    npcsEncountered: true,
    locationsVisited: true,
    combatHighlights: true,
    lootObtained: true,
    questProgress: true,
    nextSessionHooks: true,
  });

  const generateRecap = async () => {
    if (!notes.trim()) {
      toast.error('Please enter session notes first');
      return;
    }

    setLoading(true);
    try {
      const response = await apiClient.post('/ai/session-recap', {
        campaign_id: campaignId,
        notes,
        style: recapStyle,
        sections: Object.entries(includeSections)
          .filter(([_, enabled]) => enabled)
          .map(([key]) => key),
      });

      setRecap(response.data);
      toast.success('Rook drafted a session recap');
    } catch (error) {
      const fallbackRecap = generateLocalRecap(notes, recapStyle, includeSections);
      setRecap(fallbackRecap);
      toast.success('Session recap drafted offline');
    } finally {
      setLoading(false);
    }
  };

  const generateLocalRecap = (rawNotes, style, sections) => {
    const lines = rawNotes.split('\n').filter(l => l.trim());
    const now = new Date();

    const npcs = lines.filter(l => l.toLowerCase().includes('npc') || l.includes('met') || l.includes('spoke'));
    const locations = lines.filter(l => l.toLowerCase().includes('travel') || l.includes('arrived') || l.includes('location'));
    const combat = lines.filter(l => l.toLowerCase().includes('fight') || l.includes('attack') || l.includes('combat') || l.includes('battle'));
    const loot = lines.filter(l => l.toLowerCase().includes('loot') || l.includes('gold') || l.includes('item') || l.includes('found'));

    let content = '';

    if (style === 'narrative') {
      content = `# Session Recap\n\n`;
      content += `*Drafted on ${now.toLocaleDateString()}*\n\n`;
      content += `## Summary\n${lines.slice(0, 3).join(' ') || 'The party continued their adventure...'}\n\n`;

      if (sections.keyEvents && lines.length > 3) {
        content += `## Key Events\n`;
        lines.slice(0, 5).forEach(line => {
          content += `- ${line}\n`;
        });
        content += '\n';
      }

      if (sections.npcsEncountered && npcs.length > 0) {
        content += `## NPCs Encountered\n`;
        npcs.forEach(npc => content += `- ${npc}\n`);
        content += '\n';
      }

      if (sections.locationsVisited && locations.length > 0) {
        content += `## Locations Visited\n`;
        locations.forEach(location => content += `- ${location}\n`);
        content += '\n';
      }

      if (sections.combatHighlights && combat.length > 0) {
        content += `## Combat Highlights\n`;
        combat.forEach(c => content += `- ${c}\n`);
        content += '\n';
      }

      if (sections.lootObtained && loot.length > 0) {
        content += `## Loot Obtained\n`;
        loot.forEach(l => content += `- ${l}\n`);
        content += '\n';
      }

      if (sections.nextSessionHooks) {
        content += `## Next Session Hooks\n`;
        content += `- Continue from the current situation\n`;
        content += `- Follow up on unresolved threads\n`;
      }
    } else if (style === 'bullet') {
      content = `**Session Recap - ${now.toLocaleDateString()}**\n\n`;
      lines.forEach(line => {
        content += `• ${line}\n`;
      });
    } else {
      content = `# Detailed Session Log\n\n`;
      content += `**Date:** ${now.toLocaleDateString()}\n\n`;
      content += `---\n\n`;
      content += `## Full Notes\n\n`;
      content += rawNotes;
    }

    return {
      content,
      generated_at: now.toISOString(),
      style,
      word_count: content.split(' ').length,
    };
  };

  const copyToClipboard = () => {
    if (recap?.content) {
      navigator.clipboard.writeText(recap.content);
      toast.success('Recap copied to clipboard!');
    }
  };

  const saveRecap = () => {
    if (recap && onSaveRecap) {
      onSaveRecap(recap);
      toast.success('Recap saved!');
    }
  };

  return (
    <div style={{ background: theme.panel, border: `1px solid ${theme.border}`, borderRadius: 'var(--rq-radius-md, 6px)', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <div style={iconTileStyle}>
          <Sparkles size={20} color={theme.primary} />
        </div>
        <div>
          <h3 style={headingStyle}>ROOK SESSION RECAP</h3>
          <p style={{ color: theme.muted, fontSize: '13px', margin: 0 }}>
            Ask Rook to draft a text recap from your session notes
          </p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Session Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Paste or type your session notes here...\n\nExample:\n- Party arrived at the Rusty Anchor tavern\n- Met mysterious stranger named Vex\n- Fight broke out with local thugs\n- Found map to ancient ruins"
          style={textareaStyle}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>Recap Style</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'narrative', label: 'Narrative', icon: FileText },
            { id: 'bullet', label: 'Bullet Points', icon: FileText },
            { id: 'detailed', label: 'Detailed Log', icon: FileText },
          ].map(style => {
            const Icon = style.icon;
            const active = recapStyle === style.id;
            return (
              <button key={style.id} onClick={() => setRecapStyle(style.id)} style={styleButtonStyle(active)}>
                <Icon size={14} />
                {style.label}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={() => setShowAdvanced(!showAdvanced)} style={advancedButtonStyle}>
        {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        Advanced Options
      </button>

      {showAdvanced && (
        <div style={advancedPanelStyle}>
          <p style={{ color: theme.muted, fontSize: '12px', marginBottom: '12px' }}>Include sections:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: '8px' }}>
            {[
              { key: 'summary', label: 'Summary', icon: FileText },
              { key: 'keyEvents', label: 'Key Events', icon: Clock },
              { key: 'npcsEncountered', label: 'NPCs', icon: Users },
              { key: 'locationsVisited', label: 'Locations', icon: MapPin },
              { key: 'combatHighlights', label: 'Combat', icon: Swords },
              { key: 'lootObtained', label: 'Loot', icon: Sparkles },
              { key: 'questProgress', label: 'Quest Progress', icon: FileText },
              { key: 'nextSessionHooks', label: 'Next Hooks', icon: RefreshCw },
            ].map(section => {
              const SectionIcon = section.icon;
              const enabled = includeSections[section.key];
              return (
                <label key={section.key} style={sectionToggleStyle(enabled)}>
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => setIncludeSections({ ...includeSections, [section.key]: e.target.checked })}
                    style={{ display: 'none' }}
                  />
                  <SectionIcon size={12} />
                  {section.label}
                </label>
              );
            })}
          </div>
        </div>
      )}

      <Button onClick={generateRecap} disabled={loading || !notes.trim()} style={generateButtonStyle(loading || !notes.trim())}>
        {loading ? (
          <>
            <RefreshCw size={18} className="animate-spin" />
            Rook is drafting...
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Ask Rook to Draft Recap
          </>
        )}
      </Button>

      {recap && (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: 12, flexWrap: 'wrap' }}>
            <h4 style={{ color: theme.text, fontSize: '14px', fontWeight: 800, margin: 0 }}>Drafted Recap</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button onClick={copyToClipboard} style={utilityButtonStyle}>
                <Copy size={14} /> Copy
              </Button>
              {onSaveRecap && (
                <Button onClick={saveRecap} style={saveButtonStyle}>
                  <Download size={14} /> Save
                </Button>
              )}
            </div>
          </div>

          <div style={recapPanelStyle}>
            <pre style={recapPreStyle}>{recap.content}</pre>
          </div>

          <p style={{ color: theme.muted, fontSize: '11px', marginTop: '8px', textAlign: 'right' }}>
            {recap.word_count} words • Drafted {new Date(recap.generated_at).toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );
}

const iconTileStyle = { width: 40, height: 40, background: theme.subtle, border: `1px solid ${theme.primary}`, borderRadius: 'var(--rq-radius-sm, 4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const headingStyle = { color: theme.primary, fontSize: '18px', fontWeight: 900, margin: 0, fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' };
const labelStyle = { display: 'block', color: theme.textSecondary, fontSize: '12px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 };
const textareaStyle = { width: '100%', minHeight: '200px', padding: '16px', background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 'var(--rq-radius-sm, 4px)', color: theme.text, fontSize: '14px', lineHeight: 1.6, resize: 'vertical', fontFamily: 'inherit', outline: 'none' };
const styleButtonStyle = (active) => ({ flex: '1 1 140px', padding: '12px', background: active ? theme.subtle : theme.bg, border: `1px solid ${active ? theme.primary : theme.border}`, borderRadius: 'var(--rq-radius-sm, 4px)', color: active ? theme.primary : theme.textSecondary, fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' });
const advancedButtonStyle = { display: 'flex', alignItems: 'center', gap: '8px', background: 'transparent', border: 'none', color: theme.muted, fontSize: '13px', cursor: 'pointer', marginBottom: '16px', padding: 0, fontWeight: 800 };
const advancedPanelStyle = { background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 'var(--rq-radius-sm, 4px)', padding: '16px', marginBottom: '20px' };
const sectionToggleStyle = (enabled) => ({ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', background: enabled ? theme.subtle : 'transparent', border: `1px solid ${enabled ? theme.primary : theme.border}`, borderRadius: 'var(--rq-radius-sm, 4px)', cursor: 'pointer', fontSize: '12px', fontWeight: 800, color: enabled ? theme.primary : theme.textSecondary });
const generateButtonStyle = (disabled) => ({ width: '100%', padding: '14px', background: disabled ? 'var(--rq-bg-elevated, #323232)' : theme.primary, border: `1px solid ${disabled ? 'var(--rq-border-default, #3A3A3A)' : theme.primary}`, borderRadius: 'var(--rq-radius-sm, 4px)', color: theme.text, fontWeight: 900, fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: disabled ? 'none' : theme.glow });
const utilityButtonStyle = { padding: '8px 12px', background: 'transparent', border: `1px solid ${theme.border}`, borderRadius: 'var(--rq-radius-sm, 4px)', color: theme.textSecondary, fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' };
const saveButtonStyle = { ...utilityButtonStyle, background: theme.subtle, border: `1px solid ${theme.primary}`, color: theme.primary };
const recapPanelStyle = { background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 'var(--rq-radius-sm, 4px)', padding: '20px', maxHeight: '400px', overflow: 'auto' };
const recapPreStyle = { color: theme.text, fontSize: '13px', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 };

export default SessionRecapAI;
