import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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

// Dark Minimalist Theme
const theme = {
  bg: {
    black: '#0D0D0D',
    dark: '#141414',
    panel: '#1A1A1A',
    card: '#1F1F1F',
    hover: '#2A2A2A',
    elevated: '#333333'
  },
  accent: {
    red: '#DC2626',
    redHover: '#EF4444',
    redSubtle: 'rgba(220, 38, 38, 0.15)'
  },
  text: {
    white: '#FFFFFF',
    secondary: '#B3B3B3',
    muted: '#808080'
  },
  border: 'rgba(255, 255, 255, 0.1)'
};

function CampaignDashboard({ username, onLogout }) {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('setting');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

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
    setMobileMenuOpen(false);
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
    { id: 'setting', icon: Book, label: 'Setting' },
    { id: 'world', icon: Globe, label: 'World' },
    { id: 'gods', icon: Church, label: 'Gods' },
    { id: 'npcs', icon: UserCircle, label: 'NPCs' },
    { id: 'locations', icon: MapPin, label: 'Locations' },
    { id: 'players', icon: Users, label: 'Players' },
    { id: 'combat-creator', icon: Swords, label: 'Combat' },
    { id: 'maps', icon: Map, label: 'Maps' },
    { id: 'encounter-gen', icon: Sparkles, label: 'Encounter Gen' },
    { id: 'items', icon: Wand2, label: 'Items' },
    { id: 'reference', icon: ScrollText, label: 'Reference' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'ingame-notes', icon: FileText, label: 'Notes' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg.black,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        background: theme.bg.dark,
        borderBottom: `1px solid ${theme.border}`,
        padding: '12px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50
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
            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-toggle"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: theme.accent.red,
                display: 'none',
                padding: '8px'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <Button 
              data-testid="back-to-campaigns-btn"
              onClick={() => navigate('/home')} 
              style={{ 
                minWidth: '44px', 
                minHeight: '44px',
                background: theme.bg.card,
                border: `1px solid ${theme.border}`
              }}
            >
              <ArrowLeft size={20} color={theme.text.secondary} />
            </Button>
            
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <h1 style={{ 
                fontSize: 'clamp(18px, 4vw, 24px)', 
                color: theme.text.white, 
                marginBottom: '4px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '200px'
              }}>
                {campaign.name}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '11px',
                  color: theme.accent.red,
                  background: theme.accent.redSubtle,
                  padding: '2px 8px',
                  fontWeight: '600'
                }}>
                  {campaign.system || '5e 2024'}
                </span>
              </div>
            </div>
          </div>
          
          <Button 
            data-testid="open-dm-screen-btn"
            onClick={handleOpenGMScreen}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              background: theme.accent.red,
              border: 'none',
              color: theme.text.white,
              fontSize: 'clamp(12px, 2vw, 14px)',
              padding: '10px 16px',
              minHeight: '44px',
              fontWeight: '600'
            }}
          >
            <Monitor size={18} />
            <span className="desktop-only">Open </span>GM Screen
          </Button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ 
        display: 'flex', 
        flex: 1,
        overflow: 'hidden',
        position: 'relative'
      }}>
        {/* LEFT SIDEBAR */}
        <div 
          className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
          style={{
            width: '220px',
            minWidth: '220px',
            background: theme.bg.dark,
            borderRight: `1px solid ${theme.border}`,
            padding: '16px 0',
            overflowY: 'auto',
            transition: 'transform 0.3s ease'
          }}
        >
          <h3 style={{
            color: theme.text.muted,
            fontSize: '11px',
            fontWeight: '600',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '12px',
            paddingLeft: '16px'
          }}>
            Campaign Tools
          </h3>
          
          {/* Sidebar Tabs with Red Bar Hover Effect */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const isHovered = hoveredTab === tab.id && !isActive;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                  data-testid={`${tab.id}-tab`}
                  style={{
                    position: 'relative',
                    padding: '12px 16px',
                    border: 'none',
                    background: isActive ? theme.accent.red : (isHovered ? theme.bg.hover : 'transparent'),
                    color: isActive ? theme.text.white : (isHovered ? theme.text.white : theme.text.secondary),
                    fontWeight: '500',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                    width: '100%',
                    minHeight: '44px'
                  }}
                >
                  <tab.icon size={18} />
                  <span style={{ flex: 1 }}>{tab.label}</span>
                  
                  {/* Red bar on right side when hovered (not active) */}
                  {isHovered && !isActive && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      background: theme.accent.red
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Overlay */}
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

        {/* MAIN CONTENT */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto',
          padding: 'clamp(12px, 3vw, 24px)',
          background: theme.bg.black
        }}>
          {/* Quick Tips */}
          <QuickTips 
            tips={TIPS.campaignDashboard} 
            pageId="campaignDashboard" 
            title="Campaign Tips"
          />

          {/* Tab Content */}
          <div style={{
            background: theme.bg.panel,
            border: `1px solid ${theme.border}`,
            padding: '24px',
            minHeight: '500px'
          }}>
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

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 640px) {
          .desktop-logos, .desktop-only {
            display: none !important;
          }
        }

        @media (max-width: 1024px) {
          .mobile-menu-toggle {
            display: block !important;
          }

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

        @media (hover: none) and (pointer: coarse) {
          button, .clickable-box {
            min-height: 44px !important;
            min-width: 44px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CampaignDashboard;
