import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Monitor, Users, UserCircle, Book, Church, MapPin, FileText, Swords, Calendar, Sparkles, Wand2, ScrollText, Globe } from 'lucide-react';
import CampaignSettingTab from '@/components/tabs/CampaignSettingTab';
import GodsTab from '@/components/tabs/GodsTab';
import NPCsTab from '@/components/tabs/NPCsTab';
import LocationsTab from '@/components/tabs/LocationsTab';
import PlayersTab from '@/components/tabs/PlayersTab';
import InGameNotesTab from '@/components/tabs/InGameNotesTab';
import CombatCreatorTab from '@/components/tabs/CombatCreatorTab';
import CalendarTab from '@/components/tabs/CalendarTab';
import EncounterGeneratorTab from '@/components/tabs/EncounterGeneratorTab';
import ItemCreatorTab from '@/components/tabs/ItemCreatorTab';
import QuickReferenceTab from '@/components/tabs/QuickReferenceTab';
import WorldBuilderTab from '@/components/tabs/WorldBuilderTab';
import QuickTips, { TIPS } from '@/components/QuickTips';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function CampaignDashboard({ username, onLogout }) {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('setting');

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      const response = await axios.get(`${API}/campaigns/${campaignId}`);
      setCampaign(response.data);
    } catch (error) {
      toast.error('Failed to load campaign');
      navigate('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenGMScreen = () => {
    window.open(`/gm-screen/${campaignId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!campaign) return null;

  const tabs = [
    { id: 'setting', icon: Book, label: 'Setting', color: '#4a7dff' },
    { id: 'world', icon: Globe, label: 'World', color: '#22c55e' },
    { id: 'gods', icon: Church, label: 'Gods', color: '#a855f7' },
    { id: 'npcs', icon: UserCircle, label: 'NPCs', color: '#f97316' },
    { id: 'locations', icon: MapPin, label: 'Locations', color: '#67e8f9' },
    { id: 'players', icon: Users, label: 'Players', color: '#4a7dff' },
    { id: 'combat-creator', icon: Swords, label: 'Combat', color: '#ef4444' },
    { id: 'encounter-gen', icon: Sparkles, label: 'Encounter Gen', color: '#eab308' },
    { id: 'items', icon: Wand2, label: 'Items', color: '#67e8f9' },
    { id: 'reference', icon: ScrollText, label: 'Reference', color: '#f97316' },
    { id: 'calendar', icon: Calendar, label: 'Calendar', color: '#a855f7' },
    { id: 'ingame-notes', icon: FileText, label: 'Notes', color: '#94a3b8' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #030014 0%, #0a0a2e 50%, #030014 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(10, 10, 46, 0.95)',
        borderBottom: '2px solid #1e40af',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 0 30px rgba(74, 125, 255, 0.2)'
      }}>
        <div style={{ maxWidth: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Button 
              data-testid="back-to-campaigns-btn"
              onClick={() => navigate('/campaigns')} 
              className="btn-icon"
            >
              <ArrowLeft size={24} />
            </Button>
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                color: '#ffffff', 
                marginBottom: '6px',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '800'
              }}>
                {campaign.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="system-badge">
                  {campaign.system || '5e 2024'}
                </span>
                <span style={{ fontSize: '13px', color: '#94a3b8' }}>Campaign Command Center</span>
              </div>
            </div>
          </div>
          
          {/* Logos in Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '16px'
          }}>
            <img 
              src="/rookie-quest-logo.png" 
              alt="Rookie Quest" 
              style={{ 
                height: '40px',
                filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
              }} 
            />
            <div style={{ width: '1px', height: '30px', background: 'rgba(20, 184, 166, 0.3)' }} />
            <img 
              src="/rqk-mini-logo.png" 
              alt="RQK" 
              style={{ 
                height: '38px',
                filter: 'drop-shadow(0 0 15px rgba(20, 184, 166, 0.4))'
              }} 
            />
          </div>
          
          <Button 
            data-testid="open-dm-screen-btn"
            onClick={handleOpenGMScreen}
            className="btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              boxShadow: '0 0 25px rgba(20, 184, 166, 0.5)'
            }}
          >
            <Monitor size={20} />
            Open GM Screen
          </Button>
        </div>
      </div>

      {/* Main Layout with Left Sidebar */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden'
      }}>
        {/* LEFT SIDEBAR - Always Visible */}
        <div style={{
          width: '240px',
          minWidth: '240px',
          background: 'rgba(10, 10, 40, 0.8)',
          borderRight: '2px solid #1e40af',
          padding: '20px 12px',
          overflowY: 'auto',
          boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)'
        }}>
          <h3 style={{
            color: '#94a3b8',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '16px',
            paddingLeft: '12px'
          }}>
            Campaign Tools
          </h3>
          
          {/* Sidebar Navigation Tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`${tab.id}-tab`}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: activeTab === tab.id ? `2px solid ${tab.color}` : '2px solid transparent',
                  background: activeTab === tab.id ? `${tab.color}20` : 'transparent',
                  color: activeTab === tab.id ? tab.color : '#94a3b8',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(30, 64, 175, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <tab.icon size={18} />
                <span style={{ flex: 1 }}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: '24px'
        }}>
          {/* Quick Tips */}
          <QuickTips 
            tips={TIPS.campaignDashboard} 
            pageId="campaignDashboard" 
            title="Campaign Tips"
          />

          {/* Tab Content */}
          <div className="glow-panel" style={{ minHeight: '500px' }}>
            {activeTab === 'setting' && <CampaignSettingTab campaignId={campaignId} />}
            {activeTab === 'world' && <WorldBuilderTab campaignId={campaignId} />}
            {activeTab === 'gods' && <GodsTab campaignId={campaignId} />}
            {activeTab === 'npcs' && <NPCsTab campaignId={campaignId} />}
            {activeTab === 'locations' && <LocationsTab campaignId={campaignId} />}
            {activeTab === 'players' && <PlayersTab campaignId={campaignId} />}
            {activeTab === 'combat-creator' && <CombatCreatorTab campaignId={campaignId} />}
            {activeTab === 'encounter-gen' && <EncounterGeneratorTab campaignId={campaignId} />}
            {activeTab === 'items' && <ItemCreatorTab campaignId={campaignId} />}
            {activeTab === 'reference' && <QuickReferenceTab campaignId={campaignId} />}
            {activeTab === 'calendar' && <CalendarTab campaignId={campaignId} />}
            {activeTab === 'ingame-notes' && <InGameNotesTab campaignId={campaignId} />}
          </div>
        </div>
      </div>

      {/* Responsive Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          div[style*="width: 240px"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CampaignDashboard;
