// Fantasy Sunset Theme - Shared across all components
export const sunsetTheme = {
  // Backgrounds
  bg: {
    void: '#05030A',
    primary: '#0F0A1E',
    surface: '#1A112E',
    elevated: '#2E1F45',
    hover: '#3D2A5C'
  },
  
  // Sunset Colors
  sunset: {
    purple: '#8B5CF6',
    purpleGlow: 'rgba(139, 92, 246, 0.4)',
    pink: '#EC4899',
    pinkGlow: 'rgba(236, 72, 153, 0.4)',
    gold: '#F59E0B',
    goldGlow: 'rgba(245, 158, 11, 0.4)',
    orange: '#F97316'
  },
  
  // Role Colors
  gm: {
    primary: '#F59E0B',
    secondary: '#D97706',
    glow: 'rgba(245, 158, 11, 0.4)',
    subtle: 'rgba(245, 158, 11, 0.1)'
  },
  player: {
    primary: '#8B5CF6',
    secondary: '#7C3AED',
    glow: 'rgba(139, 92, 246, 0.4)',
    subtle: 'rgba(139, 92, 246, 0.1)'
  },
  
  // Text
  text: {
    primary: '#F8FAFC',
    secondary: '#94A3B8',
    muted: '#64748B'
  },
  
  // Borders
  border: {
    subtle: 'rgba(139, 92, 246, 0.2)',
    default: 'rgba(139, 92, 246, 0.3)',
    strong: 'rgba(139, 92, 246, 0.5)'
  },
  
  // Status
  status: {
    success: '#10B981',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#8B5CF6'
  },
  
  // Gradients
  gradient: {
    sunset: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)',
    purple: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
    gold: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
    surface: 'linear-gradient(180deg, rgba(26, 17, 46, 0.9) 0%, rgba(15, 10, 30, 0.95) 100%)'
  }
};

// Glass panel styles
export const glassPanel = {
  background: 'rgba(15, 10, 30, 0.7)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 40px rgba(139, 92, 246, 0.15)'
};

export const glassPanelStrong = {
  ...glassPanel,
  background: 'rgba(15, 10, 30, 0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)'
};

// Card styles
export const card = {
  background: 'rgba(26, 17, 46, 0.6)',
  border: '1px solid rgba(139, 92, 246, 0.2)',
  borderRadius: '12px',
  transition: 'all 0.3s ease'
};

export const cardHover = {
  border: '1px solid rgba(236, 72, 153, 0.4)',
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
  transform: 'translateY(-2px)'
};

// Button styles
export const buttonPrimary = {
  background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  padding: '12px 24px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(236, 72, 153, 0.3)'
};

export const buttonSecondary = {
  background: 'rgba(139, 92, 246, 0.1)',
  color: '#F8FAFC',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '10px',
  padding: '12px 24px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

export const buttonGold = {
  background: 'linear-gradient(135deg, #F59E0B 0%, #F97316 100%)',
  color: '#0F0A1E',
  border: 'none',
  borderRadius: '10px',
  padding: '12px 24px',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)'
};

// Input styles
export const input = {
  background: 'rgba(15, 10, 30, 0.6)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '10px',
  padding: '12px 16px',
  color: '#F8FAFC',
  fontSize: '15px',
  outline: 'none',
  transition: 'all 0.3s ease'
};

export const inputFocus = {
  borderColor: 'rgba(236, 72, 153, 0.6)',
  boxShadow: '0 0 0 2px rgba(236, 72, 153, 0.2)'
};

// Tab styles
export const tab = {
  padding: '10px 20px',
  background: 'transparent',
  border: 'none',
  color: '#94A3B8',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  borderBottom: '2px solid transparent'
};

export const tabActive = {
  color: '#EC4899',
  borderBottomColor: '#EC4899'
};

export default sunsetTheme;
