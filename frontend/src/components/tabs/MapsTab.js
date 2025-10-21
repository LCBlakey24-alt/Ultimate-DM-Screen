import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Upload, Trash2, Eye } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function MapsTab({ campaignId }) {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name: '', image_data: '' });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchMaps();
  }, [campaignId]);

  const fetchMaps = async () => {
    try {
      const response = await axios.get(`${API}/campaigns/${campaignId}/maps`);
      setMaps(response.data);
    } catch (error) {
      toast.error('Failed to load maps');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        toast.error('Image too large. Max 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData({ ...formData, image_data: base64String });
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      toast.error('Map name is required');
      return;
    }
    try {
      await axios.post(`${API}/campaigns/${campaignId}/maps`, formData);
      toast.success('Map added!');
      fetchMaps();
      resetForm();
    } catch (error) {
      toast.error('Failed to save map');
    }
  };

  const handleDelete = async (mapId) => {
    if (!window.confirm('Delete this map?')) return;
    try {
      await axios.delete(`${API}/campaigns/${campaignId}/maps/${mapId}`);
      toast.success('Map deleted');
      fetchMaps();
    } catch (error) {
      toast.error('Failed to delete map');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', image_data: '' });
    setImagePreview(null);
    setShowDialog(false);
  };

  if (loading) return <div className="loading-spinner"></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 className="medieval-heading" style={{ fontSize: '28px', color: '#d4af37' }}>Maps</h2>
        <Dialog open={showDialog} onOpenChange={(open) => { if (!open) resetForm(); setShowDialog(open); }}>
          <DialogTrigger asChild>
            <Button data-testid="add-map-btn" className="btn-primary" style={{ display: 'flex', gap: '8px' }}>
              <Plus size={18} />
              Add Map
            </Button>
          </DialogTrigger>
          <DialogContent className="modal">
            <DialogHeader>
              <DialogTitle className="medieval-heading" style={{ fontSize: '24px', color: '#d4af37' }}>
                Add Map
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
              <div style={{ marginBottom: '16px' }}>
                <label className="gold-text" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Map Name</label>
                <Input
                  data-testid="map-name-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label className="gold-text" style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Upload Image</label>
                <input
                  data-testid="map-image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    padding: '10px',
                    background: 'rgba(20, 16, 12, 0.6)',
                    border: '1px solid #5a4a2f',
                    borderRadius: '6px',
                    color: '#e8dcc4',
                    width: '100%'
                  }}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ marginTop: '12px', maxWidth: '100%', borderRadius: '8px', border: '1px solid #5a4a2f' }}
                  />
                )}
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <Button type="button" className="btn-secondary" onClick={resetForm}>Cancel</Button>
                <Button data-testid="map-submit-btn" type="submit" className="btn-primary">Add Map</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {maps.length === 0 ? (
        <Card className="parchment-dark" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#8b7355' }}>No maps added yet. Upload your first map!</p>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {maps.map(map => (
            <Card key={map.id} data-testid={`map-card-${map.id}`} className="card">
              <CardContent style={{ padding: '16px' }}>
                {map.image_data && (
                  <img
                    src={map.image_data}
                    alt={map.name}
                    style={{
                      width: '100%',
                      height: '180px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '12px',
                      border: '1px solid #5a4a2f'
                    }}
                  />
                )}
                <h3 className="medieval-heading" style={{ fontSize: '18px', color: '#d4af37', marginBottom: '12px' }}>
                  {map.name}
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button data-testid={`delete-map-btn-${map.id}`} onClick={() => handleDelete(map.id)} className="btn-danger" style={{ flex: 1 }}>
                    <Trash2 size={14} style={{ marginRight: '4px' }} />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MapsTab;