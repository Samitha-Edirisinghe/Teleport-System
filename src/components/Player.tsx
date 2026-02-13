import type { Position } from '@/hooks/useGameLoop';

interface PlayerProps {
  position: Position;
  size: number;
  isTeleporting: boolean;
}

export function Player({ position, size, isTeleporting }: PlayerProps) {
  return (
    <div
      className="absolute transition-opacity duration-200"
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        opacity: isTeleporting ? 0.3 : 1,
      }}
    >
      {/* Glow */}
      <div
        className="absolute inset-[-6px] rounded-full"
        style={{
          background: 'radial-gradient(circle, hsl(180 100% 50% / 0.3) 0%, transparent 70%)',
          animation: 'float 2s ease-in-out infinite',
        }}
      />
      {/* Body */}
      <div
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: 'hsl(var(--primary))',
          background: 'radial-gradient(circle at 40% 35%, hsl(180 100% 70% / 0.9), hsl(180 100% 40% / 0.6))',
          boxShadow: '0 0 12px hsl(180 100% 50% / 0.6), inset 0 0 8px hsl(180 100% 80% / 0.3)',
        }}
      />
      {/* Eyes */}
      <div className="absolute flex gap-[5px]" style={{ top: '35%', left: '50%', transform: 'translateX(-50%)' }}>
        <div className="w-[4px] h-[5px] rounded-full" style={{ background: 'hsl(var(--primary-foreground))' }} />
        <div className="w-[4px] h-[5px] rounded-full" style={{ background: 'hsl(var(--primary-foreground))' }} />
      </div>
    </div>
  );
}
