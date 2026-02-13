import { useEffect, useState } from 'react';
import type { TeleportPad } from '@/hooks/useGameLoop';

interface CooldownHUDProps {
  pads: TeleportPad[];
  getCooldownRemaining: (padId: string) => number;
}

const COLOR_MAP: Record<string, string> = {
  cyan: 'hsl(180 100% 50%)',
  purple: 'hsl(270 80% 60%)',
  pink: 'hsl(320 80% 55%)',
  gold: 'hsl(45 100% 50%)',
};

export function CooldownHUD({ pads, getCooldownRemaining }: CooldownHUDProps) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 100);
    return () => clearInterval(interval);
  }, []);

  const pairs: [TeleportPad, TeleportPad][] = [];
  const seen = new Set<string>();
  for (const pad of pads) {
    if (seen.has(pad.id)) continue;
    const target = pads.find(p => p.id === pad.targetId);
    if (target) {
      pairs.push([pad, target]);
      seen.add(pad.id);
      seen.add(target.id);
    }
  }

  return (
    <div className="flex gap-3 font-body flex-wrap justify-center">
      {pairs.map(([a, b]) => {
        const cooldown = Math.max(getCooldownRemaining(a.id), getCooldownRemaining(b.id));
        const isActive = cooldown > 0;
        const isLocked = a.locked;
        const color = COLOR_MAP[a.color] || COLOR_MAP.cyan;
        const secs = (cooldown / 1000).toFixed(1);

        return (
          <div
            key={a.id}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border"
            style={{
              borderColor: isLocked
                ? 'hsl(var(--border))'
                : isActive ? 'hsl(0 70% 40%)' : `${color}40`,
              background: isLocked
                ? 'hsl(var(--muted) / 0.2)'
                : isActive ? 'hsl(0 50% 15% / 0.3)' : `${color}10`,
              opacity: isLocked ? 0.5 : 1,
            }}
          >
            <span className="font-display text-xs" style={{ color: isLocked ? 'hsl(var(--muted-foreground))' : color }}>
              {a.label}
            </span>
            <span className="text-xs" style={{ color: isLocked ? 'hsl(var(--muted-foreground))' : isActive ? 'hsl(0 70% 60%)' : 'hsl(180 40% 60%)' }}>
              {a.id}↔{b.id}
            </span>
            {isLocked ? (
              <span className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>🔒</span>
            ) : isActive ? (
              <span className="font-display text-xs tabular-nums" style={{ color: 'hsl(0 70% 60%)' }}>
                {secs}s
              </span>
            ) : (
              <span className="text-xs" style={{ color }}>READY</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
