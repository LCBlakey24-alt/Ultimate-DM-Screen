import { useEffect, useCallback } from 'react';

/**
 * Global keyboard shortcuts for ROOK
 * 
 * Shortcuts:
 * - R: Toggle dice roller
 * - N: Quick note (when in campaign)
 * - /: Focus search
 * - Esc: Close modals
 * - ?: Show shortcuts help
 */
export function useKeyboardShortcuts({
  onToggleDice,
  onQuickNote,
  onFocusSearch,
  onShowHelp,
  onEscape,
  enabled = true
}) {
  const handleKeyDown = useCallback((event) => {
    // Don't trigger shortcuts when typing in inputs
    const target = event.target;
    const isTyping = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' || 
                     target.isContentEditable;
    
    // Allow Escape even when typing
    if (event.key === 'Escape') {
      onEscape?.();
      return;
    }
    
    // Don't trigger other shortcuts when typing
    if (isTyping) return;
    
    // Don't trigger if modifier keys are pressed (except for ?)
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    
    switch (event.key.toLowerCase()) {
      case 'r':
        event.preventDefault();
        onToggleDice?.();
        break;
      case 'n':
        event.preventDefault();
        onQuickNote?.();
        break;
      case '/':
        event.preventDefault();
        onFocusSearch?.();
        break;
      case '?':
        event.preventDefault();
        onShowHelp?.();
        break;
      default:
        break;
    }
  }, [onToggleDice, onQuickNote, onFocusSearch, onShowHelp, onEscape]);

  useEffect(() => {
    if (!enabled) return;
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}

export default useKeyboardShortcuts;
