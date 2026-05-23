import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Link2, Loader, Check, Key } from 'lucide-react';
import apiClient from '@/lib/apiClient';

function JoinCampaignModal({ characterId, characterName, open, onOpenChange, onSuccess }) {
  const [joinCode, setJoinCode] = useState('');
  const [joining, setJoining] = useState(false);

  const handleJoin = async () => {
    if (!joinCode || joinCode.trim().length !== 6) {
      toast.error('Invalid join code', {
        description: 'Please enter a 6-character code'
      });
      return;
    }

    setJoining(true);
    try {
      const response = await apiClient.post('/campaigns/join', {
        join_code: joinCode.toUpperCase().trim(),
        character_id: characterId
      });

      toast.success('Successfully joined campaign!', {
        description: `${characterName} is now part of ${response.data.campaign.name}`,
        duration: 5000
      });

      if (onSuccess) onSuccess(response.data.campaign);
      setJoinCode('');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to join campaign', {
        description: error?.response?.data?.detail || 'Invalid code or campaign not found'
      });
    } finally {
      setJoining(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modal" style={modalStyle}>
        <DialogHeader>
          <DialogTitle className="medieval-heading" style={titleStyle}>
            <Link2 size={24} color="var(--rq-accent-primary, #C1121F)" />
            Join Campaign
          </DialogTitle>
        </DialogHeader>

        <div style={{ marginTop: '24px' }}>
          <p style={bodyTextStyle}>
            Enter the 6-character join code provided by your Game Master to link <strong style={strongStyle}>{characterName}</strong> to their campaign.
          </p>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>
              Campaign Join Code
            </label>
            <div style={{ position: 'relative' }}>
              <Input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="ABC123"
                className="input"
                style={codeInputStyle}
                maxLength={6}
                autoFocus
              />
              <Key size={20} color="var(--rq-text-muted, #A0A0A0)" style={keyIconStyle} />
            </div>
            <p style={helpTextStyle}>
              The code is case-insensitive and exactly 6 characters.
            </p>
          </div>

          <div style={tipBoxStyle}>
            <p style={tipTextStyle}>
              💡 <strong>Tip:</strong> Ask your GM for the campaign join code. They can find it in their campaign settings.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <Button onClick={() => onOpenChange(false)} className="btn-outline">
              Cancel
            </Button>
            <Button onClick={handleJoin} disabled={joining || joinCode.trim().length !== 6} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {joining ? (
                <>
                  <Loader className="spin" size={18} />
                  Joining...
                </>
              ) : (
                <>
                  <Check size={18} />
                  Join Campaign
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const modalStyle = {
  maxWidth: '500px',
  background: 'var(--rq-bg-panel, #242424)',
  border: '1px solid var(--rq-accent-border, rgba(193,18,31,0.35))',
  borderRadius: 'var(--rq-radius-md, 6px)',
  color: 'var(--rq-text-primary, #FFFFFF)'
};

const titleStyle = {
  fontSize: '24px',
  color: 'var(--rq-text-primary, #FFFFFF)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontWeight: 900
};

const bodyTextStyle = {
  color: 'var(--rq-text-secondary, #D6D6D6)',
  fontSize: '14px',
  marginBottom: '20px',
  lineHeight: '1.6'
};

const strongStyle = { color: 'var(--rq-text-primary, #FFFFFF)', fontWeight: 900 };

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: 'var(--rq-accent-hover, #D62839)',
  fontSize: '14px',
  fontWeight: 800
};

const codeInputStyle = {
  fontSize: '24px',
  fontWeight: 900,
  textAlign: 'center',
  letterSpacing: '4px',
  paddingLeft: '48px',
  borderRadius: 'var(--rq-radius-sm, 4px)'
};

const keyIconStyle = {
  position: 'absolute',
  left: '16px',
  top: '50%',
  transform: 'translateY(-50%)'
};

const helpTextStyle = {
  color: 'var(--rq-text-muted, #A0A0A0)',
  fontSize: '12px',
  marginTop: '8px'
};

const tipBoxStyle = {
  padding: '16px',
  background: 'var(--rq-accent-soft, rgba(193,18,31,0.12))',
  border: '1px solid var(--rq-accent-border, rgba(193,18,31,0.35))',
  borderRadius: 'var(--rq-radius-sm, 4px)',
  marginBottom: '24px'
};

const tipTextStyle = {
  color: 'var(--rq-text-secondary, #D6D6D6)',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: 0
};

export default JoinCampaignModal;
