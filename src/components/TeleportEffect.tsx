import type { Position } from '@/hooks/useGameLoop';

interface TeleportEffectProps {
  position: Position;
}

export function TeleportEffect({ position }: TeleportEffectProps) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: position.x + 25,
        top: position.y + 25,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Central flash */}
      <div
        className="absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2"
        style={{
          background: 'hsl(var(--teleport-flash))',
          animation: 'teleport-flash 0.5s ease-out forwards',
          boxShadow: '0 0 30px hsl(180 100% 50% / 0.8)',
        }}
      />
      {/* Ring burst */}
      <div
        className="absolute w-6 h-6 rounded-full -translate-x-1/2 -translate-y-1/2 border-2"
        style={{
          borderColor: 'hsl(var(--primary))',
          animation: 'teleport-flash 0.6s ease-out forwards',
        }}
      />
      {/* Particles */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        const dx = Math.cos(angle) * 30;
        const dy = Math.sin(angle) * 30;
        return (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{
              background: 'hsl(var(--primary))',
              boxShadow: '0 0 6px hsl(180 100% 50% / 0.8)',
              animation: `particle-${i} 0.5s ease-out forwards`,
            }}
          >
            <style>{`
              @keyframes particle-${i} {
                0% { transform: translate(0, 0); opacity: 1; }
                100% { transform: translate(${dx}px, ${dy}px); opacity: 0; }
              }
            `}</style>
          </div>
        );
      })}
    </div>
  );
}
