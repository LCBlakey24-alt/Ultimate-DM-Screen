import React, { useState, useRef } from 'react';
import { 
  Upload, Image, FileText, Music, Map, Users, Folder, 
  ChevronRight, Check, AlertCircle, X, Loader, Download
} from 'lucide-react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const UPLOAD_TYPES = [
  {
    id: 'map',
    title: 'Campaign Maps',
    icon: Map,
    accept: 'image/*',
    description: 'Upload world maps, dungeon maps, city layouts',
    endpoint: '/campaigns/{id}/maps',
    color: '#4DD0E1'
  },
  {
    id: 'character',
    title: 'Character Portraits',
    icon: Users,
    accept: 'image/*',
    description: 'NPC portraits, player character art',
    endpoint: '/campaigns/{id}/portraits',
    color: '#10B981'
  },
  {
    id: 'document',
    title: 'Documents & PDFs',
    icon: FileText,
    accept: '.pdf,.doc,.docx,.txt,.md',
    description: 'Rulebooks, lore documents, handouts',
    endpoint: '/campaigns/{id}/documents',
    color: '#F59E0B'
  },
  {
    id: 'audio',
    title: 'Audio & Music',
    icon: Music,
    accept: 'audio/*',
    description: 'Background music, sound effects, ambient audio',
    endpoint: '/campaigns/{id}/audio',
    color: '#4DD0E1'
  },
  {
    id: 'misc',
    title: 'Other Files',
    icon: Folder,
    accept: '*',
    description: 'Any other campaign assets',
    endpoint: '/campaigns/{id}/files',
    color: '#D4A017'
  }
];

export default function UploadTab({ theme, campaignId }) {
  const [uploads, setUploads] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadErrors, setUploadErrors] = useState({});
  const [recentUploads, setRecentUploads] = useState([]);
  const fileInputRefs = useRef({});

  const handleFileSelect = async (type, files) => {
    if (!files || files.length === 0) return;

    const uploadType = UPLOAD_TYPES.find(t => t.id === type);
    if (!uploadType) return;

    for (const file of files) {
      const uploadId = `${type}-${Date.now()}-${file.name}`;
      
      // Set initial progress
      setUploadProgress(prev => ({ ...prev, [uploadId]: 0 }));
      setUploadErrors(prev => ({ ...prev, [uploadId]: null }));
      
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('name', file.name);

        // Simulated upload for now - replace with actual API call
        // In production, you'd use the actual endpoint
        await simulateUpload(uploadId, file);
        
        // Add to recent uploads
        setRecentUploads(prev => [{
          id: uploadId,
          name: file.name,
          type,
          size: formatFileSize(file.size),
          uploadedAt: new Date().toISOString(),
          status: 'success'
        }, ...prev.slice(0, 9)]);
        
        setUploadProgress(prev => ({ ...prev, [uploadId]: 100 }));
        
        // Clear progress after delay
        setTimeout(() => {
          setUploadProgress(prev => {
            const next = { ...prev };
            delete next[uploadId];
            return next;
          });
        }, 2000);
        
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadErrors(prev => ({ ...prev, [uploadId]: error.message || 'Upload failed' }));
        setUploadProgress(prev => {
          const next = { ...prev };
          delete next[uploadId];
          return next;
        });
      }
    }
  };

  const simulateUpload = (uploadId, file) => {
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setUploadProgress(prev => ({ ...prev, [uploadId]: Math.min(progress, 99) }));
      }, 200);
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearError = (uploadId) => {
    setUploadErrors(prev => {
      const next = { ...prev };
      delete next[uploadId];
      return next;
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '24px'
      }}>
        <Upload size={24} style={{ color: theme.accent.primary }} />
        <h3 style={{ fontFamily: "'Outfit', sans-serif", color: theme.text.primary, margin: 0 }}>
          Campaign Uploads
        </h3>
      </div>

      {/* Upload Types Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        {UPLOAD_TYPES.map(type => {
          const IconComponent = type.icon;
          const activeUploads = Object.entries(uploadProgress).filter(([key]) => key.startsWith(type.id));
          const hasErrors = Object.entries(uploadErrors).some(([key, err]) => key.startsWith(type.id) && err);
          
          return (
            <div
              key={type.id}
              style={{
                padding: '20px',
                background: theme.bg.card,
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: `${type.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <IconComponent size={24} style={{ color: type.color }} />
                </div>
                <div>
                  <h4 style={{ 
                    fontFamily: "'Outfit', sans-serif", 
                    color: theme.text.primary, 
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {type.title}
                  </h4>
                  <p style={{ 
                    color: theme.text.muted, 
                    fontSize: '13px', 
                    margin: '4px 0 0 0' 
                  }}>
                    {type.description}
                  </p>
                </div>
              </div>
              
              {/* Upload Progress */}
              {activeUploads.length > 0 && (
                <div style={{ marginBottom: '12px' }}>
                  {activeUploads.map(([uploadId, progress]) => (
                    <div key={uploadId} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '12px', color: theme.text.secondary }}>
                          Uploading...
                        </span>
                        <span style={{ fontSize: '12px', color: type.color }}>
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div style={{
                        height: '4px',
                        background: theme.bg.elevated,
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${progress}%`,
                          background: type.color,
                          borderRadius: '2px',
                          transition: 'width 0.3s'
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Button */}
              <input
                ref={el => fileInputRefs.current[type.id] = el}
                type="file"
                accept={type.accept}
                multiple
                onChange={(e) => handleFileSelect(type.id, e.target.files)}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRefs.current[type.id]?.click()}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: `${type.color}15`,
                  border: `2px dashed ${type.color}50`,
                  borderRadius: '8px',
                  color: type.color,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <Upload size={16} />
                Click to Upload
              </button>
            </div>
          );
        })}
      </div>

      {/* Upload Errors */}
      {Object.entries(uploadErrors).filter(([_, err]) => err).length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ 
            color: '#ef4444', 
            fontSize: '14px', 
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} /> Upload Errors
          </h4>
          {Object.entries(uploadErrors).filter(([_, err]) => err).map(([uploadId, error]) => (
            <div
              key={uploadId}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                marginBottom: '8px'
              }}
            >
              <span style={{ color: '#ef4444', fontSize: '13px' }}>{error}</span>
              <button
                onClick={() => clearError(uploadId)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ef4444',
                  padding: '4px'
                }}
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Recent Uploads */}
      <div>
        <h4 style={{ 
          fontFamily: "'Outfit', sans-serif",
          color: theme.text.primary, 
          fontSize: '16px', 
          marginBottom: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Check size={16} style={{ color: '#10B981' }} /> Recent Uploads
        </h4>
        
        {recentUploads.length === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
            color: theme.text.muted,
            background: theme.bg.card,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`
          }}>
            <Folder size={48} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p>No recent uploads</p>
          </div>
        ) : (
          <div style={{
            background: theme.bg.card,
            borderRadius: '12px',
            border: `1px solid ${theme.border}`,
            overflow: 'hidden'
          }}>
            {recentUploads.map((upload, index) => {
              const uploadType = UPLOAD_TYPES.find(t => t.id === upload.type);
              const IconComponent = uploadType?.icon || Folder;
              
              return (
                <div
                  key={upload.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderBottom: index < recentUploads.length - 1 ? `1px solid ${theme.border}` : 'none'
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: `${uploadType?.color || '#888'}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent size={18} style={{ color: uploadType?.color || '#888' }} />
                  </div>
                  
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      color: theme.text.primary, 
                      fontSize: '14px',
                      fontWeight: '500',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {upload.name}
                    </div>
                    <div style={{ fontSize: '12px', color: theme.text.muted }}>
                      {upload.size} • {new Date(upload.uploadedAt).toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <Check size={16} style={{ color: '#10B981' }} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
