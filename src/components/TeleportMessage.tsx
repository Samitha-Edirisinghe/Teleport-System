import { useState, useEffect } from 'react';

interface TeleportMessageProps {
  message: string | null;
  cooldownSeconds: number;
}

export function TeleportMessage({ message, cooldownSeconds }: TeleportMessageProps) {
  const [visible, setVisible] = useState(false);
  const [displayMsg, setDisplayMsg] = useState('');
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (message) {
      setDisplayMsg(message);
      setVisible(true);
      setRemaining(cooldownSeconds);
    }
  }, [message, cooldownSeconds]);

  useEffect(() => {
    if (remaining <= 0) {
      if (visible && remaining === 0 && displayMsg) {
        setTimeout(() => setVisible(false), 500);
      }
      return;
    }
    const timer = setInterval(() => {
      setRemaining(prev => {
        const next = +(prev - 0.1).toFixed(1);
        return next > 0 ? next : 0;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [remaining, visible, displayMsg]);

  if (!visible) return null;

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
      style={{
        animation: remaining <= 0 ? 'fade-out 0.5s ease-out forwards' : 'fade-in 0.3s ease-out',
      }}
    >
      <div
        className="px-5 py-3 rounded-lg border font-body text-sm flex items-center gap-3"
        style={{
          background: 'hsl(var(--card) / 0.9)',
          borderColor: remaining > 0 ? 'hsl(var(--pad-cooldown) / 0.6)' : 'hsl(var(--primary) / 0.6)',
          backdropFilter: 'blur(8px)',
          boxShadow: remaining > 0
            ? '0 0 20px hsl(0 70% 50% / 0.2)'
            : '0 0 20px hsl(180 100% 50% / 0.2)',
        }}
      >
        <span className="text-primary neon-text font-display text-xs">⚡</span>
        <span className="text-foreground">{displayMsg}</span>
        {remaining > 0 && (
          <span
            className="font-display text-xs tabular-nums ml-1"
            style={{ color: 'hsl(0 70% 60%)' }}
          >
            {remaining.toFixed(1)}s
          </span>
        )}
        {remaining <= 0 && displayMsg && (
          <span className="text-primary font-display text-xs">READY</span>
        )}
      </div>
    </div>
  );
}
