import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Grid3x3, Paintbrush, Mountain, Droplets, TreePine, Castle, Flame, MousePointer, Eraser, Trash2, Plus, Minus, Download, MapPin, Users, ToggleLeft, ToggleRight, Upload, Undo2, Droplet, LayoutTemplate } from 'lucide-react';
import { toast } from 'sonner';

const GRID_SIZE = 40;

const TERRAIN_TYPES = [
  { id: 'grass', label: 'Grass', color: '#4a7c3f', icon: '~' },
  { id: 'forest', label: 'Forest', color: '#2d5a27', icon: TreePine },
  { id: 'water', label: 'Water', color: '#2563EB', icon: Droplets },
  { id: 'mountain', label: 'Mountain', color: '#6B7280', icon: Mountain },
  { id: 'stone', label: 'Stone/Road', color: '#9CA3AF', icon: '.' },
  { id: 'sand', label: 'Sand/Desert', color: '#D4A574', icon: ',' },
  { id: 'lava', label: 'Lava', color: '#DC2626', icon: Flame },
  { id: 'building', label: 'Building', color: '#78716C', icon: Castle },
  { id: 'wall', label: 'Wall', color: '#374151', icon: '|' },
  { id: 'door', label: 'Door', color: '#92400E', icon: 'D' },
  { id: 'snow', label: 'Snow', color: '#E5E7EB', icon: '*' },
  { id: 'swamp', label: 'Swamp', color: '#4D7C0F', icon: '~' },
];

const TOKEN_COLORS = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

const DEFAULT_COLS = 20;
const DEFAULT_ROWS = 15;

// Pre-built templates
const TEMPLATES = {
  tavern: {
    name: 'Tavern Interior', rows: 15, cols: 20,
    generate: (r, c) => {
      if (r === 0 || r === 14 || c === 0 || c === 19) return 'wall';
      if ((r === 7 && c === 0) || (r === 7 && c === 19)) return 'door';
      if (r === 14 && c === 10) return 'door';
      if (c >= 1 && c <= 4 && r >= 1 && r <= 3) return 'stone'; // bar
      if (r >= 5 && r <= 7 && c >= 8 && c <= 12) return 'stone'; // tables
      if (r >= 10 && r <= 12 && c >= 3 && c <= 6) return 'stone'; // tables
      if (r >= 10 && r <= 12 && c >= 13 && c <= 16) return 'stone'; // tables
      return 'building';
    }
  },
  dungeon: {
    name: 'Dungeon Corridor', rows: 15, cols: 20,
    generate: (r, c) => {
      if (r <= 2 || r >= 12) return 'stone';
      if (c <= 2 || c >= 17) return 'stone';
      if (r === 0 || r === 14 || c === 0 || c === 19) return 'wall';
      if ((r >= 5 && r <= 9) && (c >= 7 && c <= 12)) return 'stone'; // room
      if (r === 7 && c >= 3 && c <= 6) return 'stone'; // corridor
      if (r === 7 && c >= 13 && c <= 16) return 'stone'; // corridor
      return 'wall';
    }
  },
  forest: {
    name: 'Forest Clearing', rows: 15, cols: 20,
    generate: (r, c) => {
      const dist = Math.sqrt((r - 7) ** 2 + (c - 10) ** 2);
      if (dist <= 4) return 'grass';
      if (dist <= 5.5) return Math.random() > 0.4 ? 'forest' : 'grass';
      return 'forest';
    }
  },
  coastline: {
    name: 'Coastline', rows: 15, cols: 20,
    generate: (r, c) => {
      const shoreline = 10 + Math.sin(r * 0.8) * 2;
      if (c > shoreline + 1) return 'water';
      if (c > shoreline - 1) return 'sand';
      return 'grass';
    }
  },
};

export default function MapMaker({ theme, mode = 'battle', campaignId }) {
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [rows, setRows] = useState(DEFAULT_ROWS);
  const [tiles, setTiles] = useState(() => Array(DEFAULT_ROWS).fill(null).map(() => Array(DEFAULT_COLS).fill('grass')));
  const [tokens, setTokens] = useState([]);
  const [selectedTool, setSelectedTool] = useState('paint');
  const [selectedTerrain, setSelectedTerrain] = useState('grass');
  const [isSimple, setIsSimple] = useState(true);
  const [mapName, setMapName] = useState(mode === 'world' ? 'World Map' : 'Battle Map');
  const [painting, setPainting] = useState(false);
  const [gridVisible, setGridVisible] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [newTokenName, setNewTokenName] = useState('');
  const [draggingToken, setDraggingToken] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);

  const containerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Save current state to undo stack
  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-19), tiles.map(r => [...r])]);
  }, [tiles]);

  const undo = useCallback(() => {
    setUndoStack(prev => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setTiles(last);
      return prev.slice(0, -1);
    });
  }, []);

  const addToken = useCallback(() => {
    if (!newTokenName.trim()) return;
    setTokens(prev => [...prev, {
      id: `tok-${Date.now()}`,
      name: newTokenName.trim(),
      x: 2, y: 2,
      color: TOKEN_COLORS[prev.length % TOKEN_COLORS.length],
      size: 1,
    }]);
    setNewTokenName('');
  }, [newTokenName]);

  const removeToken = (id) => setTokens(prev => prev.filter(t => t.id !== id));

  // Flood fill algorithm
  const floodFill = useCallback((startRow, startCol, fillTerrain) => {
    const targetTerrain = tiles[startRow]?.[startCol];
    if (!targetTerrain || targetTerrain === fillTerrain) return;
    pushUndo();
    const newTiles = tiles.map(r => [...r]);
    const stack = [[startRow, startCol]];
    const visited = new Set();
    while (stack.length > 0) {
      const [r, c] = stack.pop();
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
      if (newTiles[r][c] !== targetTerrain) continue;
      visited.add(key);
      newTiles[r][c] = fillTerrain;
      stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
    }
    setTiles(newTiles);
  }, [tiles, rows, cols, pushUndo]);

  const paintTile = useCallback((row, col) => {
    if (selectedTool === 'paint') {
      setTiles(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = selectedTerrain;
        return next;
      });
    } else if (selectedTool === 'erase') {
      setTiles(prev => {
        const next = prev.map(r => [...r]);
        next[row][col] = 'grass';
        return next;
      });
    } else if (selectedTool === 'fill') {
      floodFill(row, col, selectedTerrain);
    }
  }, [selectedTool, selectedTerrain, floodFill]);

  const handleMouseDown = (row, col) => {
    if (selectedTool === 'select') {
      const token = tokens.find(t => t.x === col && t.y === row);
      if (token) setDraggingToken(token.id);
      return;
    }
    if (selectedTool === 'fill') {
      paintTile(row, col);
      return;
    }
    pushUndo();
    setPainting(true);
    paintTile(row, col);
  };

  const handleMouseMove = (row, col) => {
    if (draggingToken) {
      setTokens(prev => prev.map(t => t.id === draggingToken ? { ...t, x: col, y: row } : t));
      return;
    }
    if (painting) paintTile(row, col);
  };

  const handleMouseUp = () => { setPainting(false); setDraggingToken(null); };

  const clearMap = () => {
    pushUndo();
    setTiles(Array(rows).fill(null).map(() => Array(cols).fill('grass')));
    setTokens([]);
  };

  const resizeMap = (newRows, newCols) => {
    const nr = Math.max(5, Math.min(50, newRows));
    const nc = Math.max(5, Math.min(50, newCols));
    pushUndo();
    setRows(nr);
    setCols(nc);
    setTiles(prev => {
      return Array(nr).fill(null).map((_, r) =>
        Array(nc).fill(null).map((_, c) => (prev[r] && prev[r][c]) ? prev[r][c] : 'grass')
      );
    });
  };

  const applyTemplate = (key) => {
    const tmpl = TEMPLATES[key];
    if (!tmpl) return;
    pushUndo();
    setRows(tmpl.rows);
    setCols(tmpl.cols);
    setTiles(Array(tmpl.rows).fill(null).map((_, r) =>
      Array(tmpl.cols).fill(null).map((_, c) => tmpl.generate(r, c))
    ));
    setMapName(tmpl.name);
    setShowTemplates(false);
    toast.success(`${tmpl.name} loaded!`);
  };

  const exportMap = () => {
    const data = JSON.stringify({ name: mapName, mode, rows, cols, tiles, tokens, gridVisible });
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${mapName.replace(/\s+/g, '_')}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Map exported!');
  };

  const importMap = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.tiles && data.rows && data.cols) {
          pushUndo();
          setRows(data.rows); setCols(data.cols);
          setTiles(data.tiles);
          setTokens(data.tokens || []);
          setMapName(data.name || 'Imported Map');
          if (data.gridVisible !== undefined) setGridVisible(data.gridVisible);
          toast.success('Map imported!');
        } else {
          toast.error('Invalid map file');
        }
      } catch { toast.error('Failed to parse map file'); }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const cellSize = Math.max(16, Math.min(GRID_SIZE, GRID_SIZE * zoom));

  const toolBtnStyle = (active) => ({
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
    padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600,
    cursor: 'pointer', border: `1px solid ${active ? theme.accent?.primary : theme.border}`,
    background: active ? `${theme.accent?.primary}20` : 'transparent',
    color: active ? theme.accent?.primary : theme.text.secondary,
  });

  return (
    <div data-testid="map-maker" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <input data-testid="map-name-input" value={mapName} onChange={e => setMapName(e.target.value)}
          style={{ background: 'transparent', border: 'none', color: theme.text.primary, fontFamily: "'Outfit', sans-serif", fontSize: '18px', fontWeight: 700, outline: 'none', flex: 1, minWidth: '120px' }} />
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setShowTemplates(!showTemplates)} style={toolBtnStyle(showTemplates)}>
            <LayoutTemplate size={13} /> Templates
          </button>
          <button onClick={undo} disabled={undoStack.length === 0} style={{ ...toolBtnStyle(false), opacity: undoStack.length === 0 ? 0.4 : 1 }} data-testid="undo-btn">
            <Undo2 size={13} /> Undo
          </button>
          <button data-testid="toggle-complexity" onClick={() => setIsSimple(!isSimple)} style={{ ...toolBtnStyle(false), gap: '4px' }}>
            {isSimple ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
            {isSimple ? 'Simple' : 'Advanced'}
          </button>
          <button data-testid="toggle-grid" onClick={() => setGridVisible(!gridVisible)} style={toolBtnStyle(gridVisible)}>
            <Grid3x3 size={14} />
          </button>
          <button onClick={() => setZoom(z => Math.max(0.5, z - 0.15))} style={toolBtnStyle(false)}><Minus size={12} /></button>
          <span style={{ fontSize: '11px', color: theme.text.muted, minWidth: '35px', textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(z => Math.min(2, z + 0.15))} style={toolBtnStyle(false)}><Plus size={12} /></button>
          <button data-testid="export-map" onClick={exportMap} style={toolBtnStyle(false)}><Download size={12} /> Export</button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={importMap} style={{ display: 'none' }} />
          <button data-testid="import-map" onClick={() => fileInputRef.current?.click()} style={toolBtnStyle(false)}><Upload size={12} /> Import</button>
        </div>
      </div>

      {/* Template Selector */}
      {showTemplates && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '10px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${theme.border}`, borderRadius: '10px' }}>
          {Object.entries(TEMPLATES).map(([key, tmpl]) => (
            <button key={key} data-testid={`template-${key}`} onClick={() => applyTemplate(key)}
              style={{ padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: 'rgba(138,43,226,0.08)', border: `1px solid rgba(138,43,226,0.2)`, color: theme.accent?.primary || '#D4A017', transition: 'all 0.15s' }}>
              {tmpl.name}
            </button>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        {/* Toolbar */}
        <div style={{ width: '180px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Tools */}
          <div style={{ background: theme.bg.card || 'rgba(255,255,255,0.03)', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '10px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted, letterSpacing: '0.5px', marginBottom: '6px' }}>TOOLS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
              <button data-testid="tool-select" onClick={() => setSelectedTool('select')} style={toolBtnStyle(selectedTool === 'select')}><MousePointer size={12} /> Select</button>
              <button data-testid="tool-paint" onClick={() => setSelectedTool('paint')} style={toolBtnStyle(selectedTool === 'paint')}><Paintbrush size={12} /> Paint</button>
              <button data-testid="tool-erase" onClick={() => setSelectedTool('erase')} style={toolBtnStyle(selectedTool === 'erase')}><Eraser size={12} /> Erase</button>
              <button data-testid="tool-fill" onClick={() => setSelectedTool('fill')} style={toolBtnStyle(selectedTool === 'fill')}><Droplet size={12} /> Fill</button>
              <button onClick={clearMap} style={{ ...toolBtnStyle(false), gridColumn: '1 / -1' }}><Trash2 size={12} /> Clear All</button>
            </div>
          </div>

          {/* Terrain Palette */}
          <div style={{ background: theme.bg.card || 'rgba(255,255,255,0.03)', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '10px' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted, letterSpacing: '0.5px', marginBottom: '6px' }}>TERRAIN</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
              {TERRAIN_TYPES.map(t => (
                <button key={t.id} data-testid={`terrain-${t.id}`} onClick={() => { setSelectedTerrain(t.id); if (selectedTool !== 'fill') setSelectedTool('paint'); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 6px',
                    borderRadius: '4px', fontSize: '10px', cursor: 'pointer',
                    background: selectedTerrain === t.id ? `${t.color}30` : 'transparent',
                    border: `1px solid ${selectedTerrain === t.id ? t.color : 'transparent'}`,
                    color: theme.text.secondary,
                  }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: t.color, flexShrink: 0 }} />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tokens (Advanced only) */}
          {!isSimple && (
            <div style={{ background: theme.bg.card || 'rgba(255,255,255,0.03)', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '10px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted, letterSpacing: '0.5px', marginBottom: '6px' }}>TOKENS</div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                <input data-testid="token-name-input" value={newTokenName} onChange={e => setNewTokenName(e.target.value)}
                  placeholder="Token name" style={{ flex: 1, background: theme.bg.elevated || 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, borderRadius: '4px', color: theme.text.primary, padding: '4px 6px', fontSize: '11px', outline: 'none' }}
                  onKeyDown={e => e.key === 'Enter' && addToken()} />
                <button data-testid="add-token-btn" onClick={addToken} style={{ ...toolBtnStyle(false), padding: '4px 8px' }}>
                  <Plus size={12} />
                </button>
              </div>
              {tokens.map(t => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '3px', padding: '3px 6px', borderRadius: '4px', background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: theme.text.secondary, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</span>
                  <span style={{ fontSize: '9px', color: theme.text.muted }}>({t.x},{t.y})</span>
                  <button onClick={() => removeToken(t.id)} style={{ background: 'none', border: 'none', color: theme.text.muted, cursor: 'pointer', padding: '1px' }}>
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Map Size (Advanced) */}
          {!isSimple && (
            <div style={{ background: theme.bg.card || 'rgba(255,255,255,0.03)', border: `1px solid ${theme.border}`, borderRadius: '10px', padding: '10px' }}>
              <div style={{ fontSize: '9px', fontWeight: 700, color: theme.text.muted, letterSpacing: '0.5px', marginBottom: '6px' }}>MAP SIZE</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '9px', color: theme.text.muted }}>Cols</label>
                  <input type="number" value={cols} onChange={e => resizeMap(rows, parseInt(e.target.value) || 10)}
                    style={{ width: '100%', background: theme.bg.elevated || 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, borderRadius: '4px', color: theme.text.primary, padding: '4px', fontSize: '12px', textAlign: 'center' }} />
                </div>
                <span style={{ color: theme.text.muted, fontSize: '12px' }}>x</span>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '9px', color: theme.text.muted }}>Rows</label>
                  <input type="number" value={rows} onChange={e => resizeMap(parseInt(e.target.value) || 10, cols)}
                    style={{ width: '100%', background: theme.bg.elevated || 'rgba(255,255,255,0.05)', border: `1px solid ${theme.border}`, borderRadius: '4px', color: theme.text.primary, padding: '4px', fontSize: '12px', textAlign: 'center' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div ref={containerRef} style={{ flex: 1, overflow: 'auto', border: `1px solid ${theme.border}`, borderRadius: '10px', background: '#1a1a2e' }}
          onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
          <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`, gap: 0, cursor: selectedTool === 'select' ? 'grab' : (selectedTool === 'fill' ? 'cell' : 'crosshair') }}>
            {tiles.map((row, ri) => row.map((cell, ci) => {
              const terrain = TERRAIN_TYPES.find(t => t.id === cell) || TERRAIN_TYPES[0];
              const token = tokens.find(t => t.x === ci && t.y === ri);
              return (
                <div key={`${ri}-${ci}`}
                  onMouseDown={() => handleMouseDown(ri, ci)}
                  onMouseMove={() => handleMouseMove(ri, ci)}
                  style={{
                    width: cellSize, height: cellSize, background: terrain.color,
                    border: gridVisible ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    position: 'relative', boxSizing: 'border-box', transition: 'background 0.1s',
                  }}>
                  {token && (
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                      width: cellSize * 0.7, height: cellSize * 0.7, borderRadius: '50%',
                      background: token.color, border: '2px solid rgba(255,255,255,0.6)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: Math.max(8, cellSize * 0.25), fontWeight: 700, color: '#fff',
                      cursor: 'grab', boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                    }} title={token.name}>
                      {token.name[0]}
                    </div>
                  )}
                </div>
              );
            }))}
          </div>
        </div>
      </div>
    </div>
  );
}
