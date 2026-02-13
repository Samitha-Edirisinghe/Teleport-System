import { useEffect, useState } from 'react';
import type { TeleportPad } from '@/hooks/useGameLoop';

interface TeleportPadProps {
  pad: TeleportPad;
  size: number;
  cooldownRemaining: number;
}

const COLOR_MAP: Record<string, string> = {
  cyan: 'hsl(180 100% 50%)',
  purple: 'hsl(270 80% 60%)',
  pink: 'hsl(320 80% 55%)',
  gold: 'hsl(45 100% 50%)',
};

export function TeleportPadComponent({ pad, size, cooldownRemaining }: TeleportPadProps) {
  const [remaining, setRemaining] = useState(0);
  const isOnCooldown = remaining > 0;
  const isLocked = pad.locked;
  const color = COLOR_MAP[pad.color] || COLOR_MAP.cyan;

  useEffect(() => {
    setRemaining(cooldownRemaining);
    if (cooldownRemaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining(prev => {
        const next = prev - 100;
        return next > 0 ? next : 0;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [cooldownRemaining]);

  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: pad.position.x,
        top: pad.position.y,
        width: size,
        height: size,
        opacity: isLocked ? 0.35 : 1,
      }}
    >
      {/* Rotating ring */}
      <div
        className="absolute inset-0 rounded-full border-2 border-dashed"
        style={{
          borderColor: isLocked
            ? 'hsl(var(--muted-foreground) / 0.3)'
            : isOnCooldown ? 'hsl(0 70% 50% / 0.5)' : `${color}80`,
          animation: isLocked
            ? 'none'
            : isOnCooldown ? 'cooldown-pulse 1s ease-in-out infinite' : 'pad-rotate 4s linear infinite',
        }}
      />
      {/* Inner pad */}
      <div
        className="absolute inset-[6px] rounded-full flex items-center justify-center"
        style={{
          background: isLocked
            ? 'radial-gradient(circle, hsl(var(--muted) / 0.5), hsl(var(--muted) / 0.2))'
            : isOnCooldown
              ? 'radial-gradient(circle, hsl(0 70% 30% / 0.6), hsl(0 50% 15% / 0.4))'
              : `radial-gradient(circle, ${color}40, ${color}15)`,
          boxShadow: isLocked
            ? 'none'
            : isOnCooldown
              ? '0 0 10px hsl(0 70% 50% / 0.4)'
              : `0 0 15px ${color}50, 0 0 30px ${color}20`,
        }}
      >
        <span
          className="font-display text-sm font-bold select-none"
          style={{
            color: isLocked
              ? 'hsl(var(--muted-foreground))'
              : isOnCooldown ? 'hsl(0 50% 60%)' : color,
            textShadow: isLocked || isOnCooldown ? 'none' : `0 0 8px ${color}`,
          }}
        >
          {isLocked ? '🔒' : isOnCooldown ? (remaining / 1000).toFixed(1) : pad.label}
        </span>
      </div>
    </div>
  );
}
