import React from 'react';
import { UserCheck, X } from 'lucide-react';

/**
 * Global banner displayed when an admin is impersonating another user.
 */
const ImpersonationBanner = ({ theme, impersonatedUser, onStopImpersonating }) => {
  if (!impersonatedUser) return null;

  return (
    <div
      data-testid="impersonation-banner"
      style={{
        background: theme.accent?.primary || theme.accent, // Primary accent for visibility
        color: theme.text.primary,
        padding: '10px 20px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        zIndex: 2000, // Ensure it's above almost everything
        position: 'sticky',
        top: 0,
        width: '100%'
      }}
    >
      <UserCheck size={18} color={theme.text.primary} />
      <span>IMPERSONATING: {impersonatedUser.toUpperCase()}</span>
      <button
        onClick={onStopImpersonating}
        data-testid="stop-impersonating-btn"
        style={{ background: 'none', border: 'none', color: theme.text.primary, cursor: 'pointer', marginLeft: '15px', display: 'flex', alignItems: 'center' }}
      >
        <X size={16} /> Stop
      </button>
    </div>
  );
};

export default ImpersonationBanner;