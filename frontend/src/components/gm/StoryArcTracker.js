import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Plus, ChevronDown, ChevronRight, Edit2, Save, X, 
  Trash2, Flag, Target, Users, Clock, CheckCircle, Circle,
  AlertTriangle, Star, Sparkles, Link2
} from 'lucide-react';

// Arc status options
const ARC_STATUS = {
  planning: { label: 'Planning', color: '#6B7280', icon: Circle },
  active: { label: 'Active', color: '#10B981', icon: Target },
  paused: { label: 'Paused', color: '#F59E0B', icon: Clock },
  completed: { label: 'Completed', color: '#D4A017', icon: CheckCircle },
  abandoned: { label: 'Abandoned', color: '#EF4444', icon: X }
};

// Priority levels
const PRIORITIES = {
  main: { label: 'Main Quest', color: '#F59E0B', icon: Star },
  side: { label: 'Side Quest', color: '#D4A017', icon: BookOpen },
  character: { label: 'Character Arc', color: '#10B981', icon: Users },
  background: { label: 'Background', color: '#6B7280', icon: Circle }
};

export default function StoryArcTracker({ theme, campaignId }) {
  const [arcs, setArcs] = useState([]);
  const [expandedArcs, setExpandedArcs] = useState({});
  const [isAddingArc, setIsAddingArc] = useState(false);
  const [editingArc, setEditingArc] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  
  const [newArc, setNewArc] = useState({
    title: '',
    description: '',
    status: 'planning',
    priority: 'side',
    characters: [],
    plotPoints: [],
    notes: ''
  });

  // Load arcs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`story-arcs-${campaignId}`);
    if (saved) {
      setArcs(JSON.parse(saved));
    }
  }, [campaignId]);

  // Save arcs
  const saveArcs = (updatedArcs) => {
    setArcs(updatedArcs);
    localStorage.setItem(`story-arcs-${campaignId}`, JSON.stringify(updatedArcs));
  };

  const createArc = () => {
    if (!newArc.title.trim()) return;
    
    const arc = {
      id: `arc-${Date.now()}`,
      ...newArc,
      plotPoints: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    saveArcs([arc, ...arcs]);
    setNewArc({
      title: '',
      description: '',
      status: 'planning',
      priority: 'side',
      characters: [],
      plotPoints: [],
      notes: ''
    });
    setIsAddingArc(false);
    setExpandedArcs({ ...expandedArcs, [arc.id]: true });
  };

  const updateArc = (arcId, updates) => {
    const updated = arcs.map(a => 
      a.id === arcId ? { ...a, ...updates, updatedAt: Date.now() } : a
    );
    saveArcs(updated);
  };

  const deleteArc = (arcId) => {
    if (window.confirm('Delete this story arc? This cannot be undone.')) {
      saveArcs(arcs.filter(a => a.id !== arcId));
    }
  };

  const addPlotPoint = (arcId) => {
    const arc = arcs.find(a => a.id === arcId);
    if (!arc) return;
    
    const newPoint = {
      id: `point-${Date.now()}`,
      title: 'New Plot Point',
      description: '',
      completed: false,
      createdAt: Date.now()
    };
    
    updateArc(arcId, { plotPoints: [...(arc.plotPoints || []), newPoint] });
  };

  const updatePlotPoint = (arcId, pointId, updates) => {
    const arc = arcs.find(a => a.id === arcId);
    if (!arc) return;
    
    const updatedPoints = arc.plotPoints.map(p => 
      p.id === pointId ? { ...p, ...updates } : p
    );
    updateArc(arcId, { plotPoints: updatedPoints });
  };

  const deletePlotPoint = (arcId, pointId) => {
    const arc = arcs.find(a => a.id === arcId);
    if (!arc) return;
    
    updateArc(arcId, { plotPoints: arc.plotPoints.filter(p => p.id !== pointId) });
  };

  // Filter arcs
  const filteredArcs = arcs.filter(arc => {
    if (filterStatus !== 'all' && arc.status !== filterStatus) return false;
    if (filterPriority !== 'all' && arc.priority !== filterPriority) return false;
    return true;
  });

  // Group by status for kanban-style view
  const arcsByStatus = {
    active: filteredArcs.filter(a => a.status === 'active'),
    planning: filteredArcs.filter(a => a.status === 'planning'),
    paused: filteredArcs.filter(a => a.status === 'paused'),
    completed: filteredArcs.filter(a => a.status === 'completed')
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOpen size={24} style={{ color: theme.accent.primary }} />
          <h3 style={{ fontFamily: "'Outfit', sans-serif", color: theme.text.primary, margin: 0 }}>
            Story Arcs & Quest Tracker
          </h3>
        </div>
        
        <button
          onClick={() => setIsAddingArc(true)}
          style={{
            padding: '10px 20px',
            background: theme.gradient,
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> New Arc
        </button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: theme.text.muted }}>Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{
              padding: '6px 12px',
              background: theme.bg.elevated,
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              color: theme.text.primary,
              fontSize: '13px'
            }}
          >
            <option value="all">All</option>
            {Object.entries(ARC_STATUS).map(([key, status]) => (
              <option key={key} value={key}>{status.label}</option>
            ))}
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: theme.text.muted }}>Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{
              padding: '6px 12px',
              background: theme.bg.elevated,
              border: `1px solid ${theme.border}`,
              borderRadius: '6px',
              color: theme.text.primary,
              fontSize: '13px'
            }}
          >
            <option value="all">All</option>
            {Object.entries(PRIORITIES).map(([key, priority]) => (
              <option key={key} value={key}>{priority.label}</option>
            ))}
          </select>
        </div>
        
        <div style={{ marginLeft: 'auto', fontSize: '13px', color: theme.text.muted }}>
          {filteredArcs.length} arc{filteredArcs.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Add Arc Form */}
      {isAddingArc && (
        <div style={{
          padding: '20px',
          background: theme.bg.card,
          borderRadius: '12px',
          border: `1px solid ${theme.accent.primary}`,
          marginBottom: '20px'
        }}>
          <h4 style={{ color: theme.text.primary, marginBottom: '16px', fontFamily: "'Outfit', sans-serif" }}>
            Create New Story Arc
          </h4>
          
          <div style={{ display: 'grid', gap: '12px' }}>
            <input
              type="text"
              value={newArc.title}
              onChange={(e) => setNewArc({ ...newArc, title: e.target.value })}
              placeholder="Arc Title (e.g., 'The Dragon's Awakening')"
              style={{
                padding: '12px',
                background: theme.bg.elevated,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text.primary,
                fontSize: '14px'
              }}
            />
            
            <textarea
              value={newArc.description}
              onChange={(e) => setNewArc({ ...newArc, description: e.target.value })}
              placeholder="Brief description of this story arc..."
              style={{
                padding: '12px',
                background: theme.bg.elevated,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text.primary,
                fontSize: '14px',
                resize: 'none',
                height: '80px'
              }}
            />
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <select
                value={newArc.priority}
                onChange={(e) => setNewArc({ ...newArc, priority: e.target.value })}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: theme.bg.elevated,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text.primary,
                  fontSize: '14px'
                }}
              >
                {Object.entries(PRIORITIES).map(([key, priority]) => (
                  <option key={key} value={key}>{priority.label}</option>
                ))}
              </select>
              
              <select
                value={newArc.status}
                onChange={(e) => setNewArc({ ...newArc, status: e.target.value })}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: theme.bg.elevated,
                  border: `1px solid ${theme.border}`,
                  borderRadius: '8px',
                  color: theme.text.primary,
                  fontSize: '14px'
                }}
              >
                {Object.entries(ARC_STATUS).map(([key, status]) => (
                  <option key={key} value={key}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
            <button
              onClick={() => setIsAddingArc(false)}
              style={{
                padding: '10px 20px',
                background: theme.bg.elevated,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                color: theme.text.secondary,
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              Cancel
            </button>
            <button
              onClick={createArc}
              disabled={!newArc.title.trim()}
              style={{
                padding: '10px 20px',
                background: theme.gradient,
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                opacity: newArc.title.trim() ? 1 : 0.5
              }}
            >
              Create Arc
            </button>
          </div>
        </div>
      )}

      {/* Arcs List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredArcs.length === 0 && !isAddingArc && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: theme.text.muted
          }}>
            <BookOpen size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No story arcs yet</p>
            <button
              onClick={() => setIsAddingArc(true)}
              style={{
                marginTop: '16px',
                padding: '12px 24px',
                background: theme.gradient,
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Create Your First Arc
            </button>
          </div>
        )}
        
        {filteredArcs.map(arc => {
          const status = ARC_STATUS[arc.status];
          const priority = PRIORITIES[arc.priority];
          const StatusIcon = status.icon;
          const PriorityIcon = priority.icon;
          const isExpanded = expandedArcs[arc.id];
          const completedPoints = arc.plotPoints?.filter(p => p.completed).length || 0;
          const totalPoints = arc.plotPoints?.length || 0;
          
          return (
            <div
              key={arc.id}
              style={{
                background: theme.bg.card,
                borderRadius: '12px',
                border: `1px solid ${arc.status === 'active' ? theme.accent.primary : theme.border}`,
                overflow: 'hidden'
              }}
            >
              {/* Arc Header */}
              <div
                onClick={() => setExpandedArcs({ ...expandedArcs, [arc.id]: !isExpanded })}
                style={{
                  padding: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                
                {/* Priority Badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 8px',
                  background: `${priority.color}20`,
                  borderRadius: '4px'
                }}>
                  <PriorityIcon size={12} style={{ color: priority.color }} />
                  <span style={{ fontSize: '10px', fontWeight: '600', color: priority.color }}>
                    {priority.label}
                  </span>
                </div>
                
                {/* Title */}
                <span style={{ 
                  flex: 1, 
                  fontWeight: '600', 
                  color: theme.text.primary, 
                  fontSize: '15px',
                  fontFamily: "'Outfit', sans-serif"
                }}>
                  {arc.title}
                </span>
                
                {/* Progress */}
                {totalPoints > 0 && (
                  <span style={{ fontSize: '12px', color: theme.text.muted }}>
                    {completedPoints}/{totalPoints} points
                  </span>
                )}
                
                {/* Status */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 10px',
                  background: `${status.color}20`,
                  borderRadius: '20px'
                }}>
                  <StatusIcon size={12} style={{ color: status.color }} />
                  <span style={{ fontSize: '11px', fontWeight: '500', color: status.color }}>
                    {status.label}
                  </span>
                </div>
              </div>
              
              {/* Expanded Content */}
              {isExpanded && (
                <div style={{ padding: '0 16px 16px 16px' }}>
                  {/* Description */}
                  {arc.description && (
                    <p style={{ 
                      color: theme.text.secondary, 
                      fontSize: '14px', 
                      marginBottom: '16px',
                      padding: '12px',
                      background: theme.bg.elevated,
                      borderRadius: '8px'
                    }}>
                      {arc.description}
                    </p>
                  )}
                  
                  {/* Status Selector */}
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {Object.entries(ARC_STATUS).map(([key, s]) => (
                      <button
                        key={key}
                        onClick={() => updateArc(arc.id, { status: key })}
                        style={{
                          padding: '6px 12px',
                          background: arc.status === key ? `${s.color}30` : theme.bg.elevated,
                          border: `1px solid ${arc.status === key ? s.color : theme.border}`,
                          borderRadius: '6px',
                          color: arc.status === key ? s.color : theme.text.muted,
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  
                  {/* Plot Points */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '8px'
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: theme.text.muted, textTransform: 'uppercase' }}>
                        Plot Points
                      </span>
                      <button
                        onClick={() => addPlotPoint(arc.id)}
                        style={{
                          padding: '4px 10px',
                          background: theme.accent.subtle,
                          border: `1px solid ${theme.border}`,
                          borderRadius: '4px',
                          color: theme.accent.primary,
                          cursor: 'pointer',
                          fontSize: '11px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Plus size={12} /> Add
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {arc.plotPoints?.map(point => (
                        <div
                          key={point.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            background: point.completed ? theme.accent.subtle : theme.bg.elevated,
                            borderRadius: '8px',
                            border: `1px solid ${point.completed ? theme.accent.primary : theme.border}`
                          }}
                        >
                          <button
                            onClick={() => updatePlotPoint(arc.id, point.id, { completed: !point.completed })}
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              background: point.completed ? theme.accent.primary : 'transparent',
                              border: `2px solid ${point.completed ? theme.accent.primary : theme.border}`,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {point.completed && <CheckCircle size={14} color="#fff" />}
                          </button>
                          
                          <input
                            type="text"
                            value={point.title}
                            onChange={(e) => updatePlotPoint(arc.id, point.id, { title: e.target.value })}
                            style={{
                              flex: 1,
                              background: 'transparent',
                              border: 'none',
                              color: point.completed ? theme.text.muted : theme.text.primary,
                              fontSize: '14px',
                              textDecoration: point.completed ? 'line-through' : 'none'
                            }}
                          />
                          
                          <button
                            onClick={() => deletePlotPoint(arc.id, point.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              color: theme.text.muted,
                              padding: '4px'
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                      
                      {(!arc.plotPoints || arc.plotPoints.length === 0) && (
                        <div style={{ 
                          padding: '20px', 
                          textAlign: 'center', 
                          color: theme.text.muted,
                          fontSize: '13px'
                        }}>
                          No plot points yet. Add milestones to track progress.
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => deleteArc(arc.id)}
                      style={{
                        padding: '8px 16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '6px',
                        color: '#ef4444',
                        cursor: 'pointer',
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={14} /> Delete Arc
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
