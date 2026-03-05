import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { RQKLogoInline } from '@/components/ui/RQKLogo';
import { ArrowLeft, Monitor, Users, UserCircle, Book, Church, MapPin, FileText, Swords, Calendar, Sparkles, Wand2, ScrollText, Globe, Menu, X, Map } from 'lucide-react';
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
import MapsTab from '@/components/tabs/MapsTab';
import QuickTips, { TIPS } from '@/components/QuickTips';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// GM Theme Colors
const gmTheme = {
  primary: '#A4243B',
  hover: '#B82E47',
  subtle: 'rgba(164, 36, 59, 0.15)',
  border: 'rgba(164, 36, 59, 0.4)',
  bg: '#18181B',
  card: '#242428',
  text: '#FAFAFA',
  textSecondary: '#A1A1AA'
};

function CampaignDashboard({ username, onLogout }) {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('setting');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false); // Close mobile menu after selection
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
    { id: 'setting', icon: Book, label: 'Setting', color: gmTheme.primary },
    { id: 'world', icon: Globe, label: 'World', color: gmTheme.primary },
    { id: 'gods', icon: Church, label: 'Gods', color: gmTheme.primary },
    { id: 'npcs', icon: UserCircle, label: 'NPCs', color: gmTheme.primary },
    { id: 'locations', icon: MapPin, label: 'Locations', color: gmTheme.primary },
    { id: 'players', icon: Users, label: 'Players', color: gmTheme.primary },
    { id: 'combat-creator', icon: Swords, label: 'Combat', color: gmTheme.primary },
    { id: 'maps', icon: Map, label: 'Maps', color: gmTheme.primary },
    { id: 'encounter-gen', icon: Sparkles, label: 'Encounter Gen', color: gmTheme.primary },
    { id: 'items', icon: Wand2, label: 'Items', color: gmTheme.primary },
    { id: 'reference', icon: ScrollText, label: 'Reference', color: gmTheme.primary },
    { id: 'calendar', icon: Calendar, label: 'Calendar', color: gmTheme.primary },
    { id: 'ingame-notes', icon: FileText, label: 'Notes', color: gmTheme.textSecondary },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: gmTheme.bg,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(30, 30, 34, 0.95)',
        borderBottom: `1px solid ${gmTheme.border}`,
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          maxWidth: '100%', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '12px' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile: Hamburger Menu */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: gmTheme.primary,
                display: 'none',
                padding: '8px'
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Button 
              data-testid="back-to-campaigns-btn"
              onClick={() => navigate('/home')} 
              style={{ 
                minWidth: '44px', 
                minHeight: '44px',
                background: gmTheme.card,
                border: `1px solid ${gmTheme.border}`,
                borderRadius: '2px'
              }}
            >
              <ArrowLeft size={20} color={gmTheme.textSecondary} />
            </Button>
            
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <h1 style={{ 
                fontSize: 'clamp(18px, 4vw, 24px)', 
                color: '#ffffff', 
                marginBottom: '4px',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: '800',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '200px'
              }}>
                {campaign.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span className="system-badge" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {campaign.system || '5e 2024'}
                </span>
                <span style={{ fontSize: '11px', color: '#9CA3AF', display: 'none' }} className="desktop-only">
                  Campaign Command Center
                </span>
              </div>
            </div>
          </div>
          
          {/* Logos - Hidden on small mobile */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '12px'
          }}
          className="desktop-logos">
            <RQKLogoInline size="small" />
          </div>
          
          <Button 
            data-testid="open-dm-screen-btn"
            onClick={handleOpenGMScreen}
            className="btn-primary"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              boxShadow: '0 0 25px rgba(124, 58, 237, 0.4)',
              fontSize: 'clamp(12px, 2vw, 14px)',
              padding: '10px 16px',
              minHeight: '44px'
            }}
          >
            <Monitor size={18} />
            <span className="desktop-only">Open </span>GM Screen
          </Button>
        </div>
      </div>

      {/* Main Layout with Left Sidebar */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* LEFT SIDEBAR - Always Visible Desktop, Overlay Mobile */}
        <div 
          className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
          style={{
            width: '240px',
            minWidth: '240px',
            background: 'rgba(17, 24, 39, 0.98)',
            borderRight: '1px solid #1F2937',
            padding: '20px 12px',
            overflowY: 'auto',
            boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.3s ease'
          }}
        >
          <h3 style={{
            color: '#9CA3AF',
            fontSize: '11px',
            fontWeight: '600',
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
                onClick={() => handleTabClick(tab.id)}
                data-testid={`${tab.id}-tab`}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: activeTab === tab.id ? `1px solid ${tab.color}` : '1px solid transparent',
                  background: activeTab === tab.id ? `${tab.color}15` : 'transparent',
                  color: activeTab === tab.id ? tab.color : '#9CA3AF',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s',
                  textAlign: 'left',
                  width: '100%',
                  minHeight: '44px'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = 'rgba(124, 58, 237, 0.1)';
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

        {/* Mobile Overlay Background */}
        {mobileMenuOpen && (
          <div 
            className="mobile-overlay"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: 39,
              display: 'none'
            }}
          />
        )}

        {/* MAIN CONTENT AREA */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: 'clamp(12px, 3vw, 24px)'
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
            {activeTab === 'maps' && <MapsTab campaignId={campaignId} />}
            {activeTab === 'encounter-gen' && <EncounterGeneratorTab campaignId={campaignId} />}
            {activeTab === 'items' && <ItemCreatorTab campaignId={campaignId} />}
            {activeTab === 'reference' && <QuickReferenceTab campaignId={campaignId} />}
            {activeTab === 'calendar' && <CalendarTab campaignId={campaignId} />}
            {activeTab === 'ingame-notes' && <InGameNotesTab campaignId={campaignId} />}
          </div>
        </div>
      </div>

      {/* Mobile & Responsive Styles */}
      <style>{`
        /* Desktop logos hidden on mobile */
        @media (max-width: 640px) {
          .desktop-logos {
            display: none !important;
          }
          .desktop-only {
            display: none !important;
          }
        }

        /* Mobile menu toggle visible only on mobile */
        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: block !important;
          }

          /* Sidebar becomes overlay on mobile */
          .sidebar {
            position: fixed !important;
            top: 0;
            left: 0;
            bottom: 0;
            z-index: 40;
            transform: translateX(-100%);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .mobile-overlay {
            display: block !important;
          }
        }

        /* Touch-friendly buttons */
        @media (hover: none) and (pointer: coarse) {
          button, .clickable-box {
            min-height: 44px !important;
            min-width: 44px !important;
          }
        }

        /* Responsive padding */
        @media (max-width: 768px) {
          .glow-panel {
            padding: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CampaignDashboard;
