import React, { useMemo, useState } from 'react';

function normaliseEntry(entry) {
  if (!entry) return { name: 'Unknown', description: '' };
  if (typeof entry === 'string') return { name: entry, description: '' };
  return {
    name: entry.name || entry.title || entry.label || 'Unknown',
    description: entry.description || entry.desc || entry.summary || entry.text || '',
    source: entry.source || entry.type || entry.level ? String(entry.source || entry.type || `Level ${entry.level}`) : '',
  };
}

function FeatureCard({ entry, fallbackSource }) {
  const [expanded, setExpanded] = useState(false);
  const item = normaliseEntry(entry);
  const hasDescription = Boolean(item.description);
  const source = item.source || fallbackSource;

  return (
    <button
      type="button"
      className={`clean-sheet-feature-card ${expanded ? 'expanded' : ''}`}
      onClick={() => hasDescription && setExpanded(prev => !prev)}
    >
      <div className="clean-sheet-feature-topline">
        {source && <span>{source}</span>}
        {hasDescription && <em>{expanded ? 'Collapse' : 'Expand'}</em>}
      </div>
      <strong>{item.name}</strong>
      {hasDescription && (
        <p>{expanded ? item.description : `${item.description.slice(0, 150)}${item.description.length > 150 ? '…' : ''}`}</p>
      )}
    </button>
  );
}

function FeatureSection({ title, entries, emptyText, fallbackSource }) {
  return (
    <section className="clean-sheet-panel clean-sheet-wide">
      <h2>{title}</h2>
      {entries.length > 0 ? (
        <div className="clean-sheet-feature-grid">
          {entries.map((entry, index) => (
            <FeatureCard key={`${normaliseEntry(entry).name}-${index}`} entry={entry} fallbackSource={fallbackSource} />
          ))}
        </div>
      ) : (
        <p className="clean-sheet-muted">{emptyText}</p>
      )}
    </section>
  );
}

function ChipList({ title, values, emptyText }) {
  return (
    <section className="clean-sheet-panel">
      <h2>{title}</h2>
      {values.length > 0 ? (
        <div className="clean-sheet-chip-list">
          {values.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}
        </div>
      ) : (
        <p className="clean-sheet-muted">{emptyText}</p>
      )}
    </section>
  );
}

export default function CleanFeaturesTab({ character }) {
  const racialTraits = character?.racial_traits || character?.traits || [];
  const classFeatures = character?.class_features || character?.features || [];
  const feats = character?.feats || [];

  const languages = useMemo(() => character?.languages || [], [character]);
  const tools = useMemo(() => character?.tool_proficiencies || [], [character]);
  const weapons = useMemo(() => character?.weapon_proficiencies || [], [character]);
  const armour = useMemo(() => character?.armor_proficiencies || character?.armour_proficiencies || [], [character]);

  return (
    <div className="clean-sheet-grid">
      <FeatureSection
        title="Racial Traits"
        entries={racialTraits}
        fallbackSource={character?.race || 'Trait'}
        emptyText="No racial traits found yet."
      />

      <FeatureSection
        title="Class Features"
        entries={classFeatures}
        fallbackSource={character?.character_class || 'Class'}
        emptyText="No class features found yet."
      />

      <FeatureSection
        title="Feats"
        entries={feats}
        fallbackSource="Feat"
        emptyText="No feats found yet."
      />

      <ChipList title="Languages" values={languages} emptyText="No languages found yet." />
      <ChipList title="Tool Proficiencies" values={tools} emptyText="No tool proficiencies found yet." />
      <ChipList title="Weapon Proficiencies" values={weapons} emptyText="No weapon proficiencies found yet." />
      <ChipList title="Armour Proficiencies" values={armour} emptyText="No armour proficiencies found yet." />
    </div>
  );
}
