import { useRef, useCallback } from 'react';

interface MobileControlsProps {
  onDirection: (x: number, y: number) => void;
}

export function MobileControls({ onDirection }: MobileControlsProps) {
  const stickRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(false);
  const centerRef = useRef({ x: 0, y: 0 });
  const knobRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number, clientY: number) => {
    if (!activeRef.current) return;
    const dx = clientX - centerRef.current.x;
    const dy = clientY - centerRef.current.y;
    const maxDist = 30;
    const dist = Math.min(Math.hypot(dx, dy), maxDist);
    const angle = Math.atan2(dy, dx);
    const nx = (dist / maxDist) * Math.cos(angle);
    const ny = (dist / maxDist) * Math.sin(angle);
    onDirection(nx, ny);
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${nx * maxDist}px, ${ny * maxDist}px)`;
    }
  }, [onDirection]);

  const handleStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    const rect = stickRef.current?.getBoundingClientRect();
    if (!rect) return;
    centerRef.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    activeRef.current = true;
    handleMove(touch.clientX, touch.clientY);
  }, [handleMove]);

  const handleEnd = useCallback(() => {
    activeRef.current = false;
    onDirection(0, 0);
    if (knobRef.current) {
      knobRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, [onDirection]);

  return (
    <div className="md:hidden flex justify-center mt-4">
      <div
        ref={stickRef}
        className="relative w-24 h-24 rounded-full border-2 flex items-center justify-center touch-none"
        style={{
          borderColor: 'hsl(var(--primary) / 0.4)',
          background: 'hsl(var(--card) / 0.6)',
        }}
        onTouchStart={handleStart}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          handleMove(touch.clientX, touch.clientY);
        }}
        onTouchEnd={handleEnd}
      >
        <div
          ref={knobRef}
          className="w-10 h-10 rounded-full transition-none"
          style={{
            background: 'radial-gradient(circle, hsl(var(--primary) / 0.8), hsl(var(--primary) / 0.3))',
            boxShadow: '0 0 12px hsl(var(--primary) / 0.5)',
          }}
        />
        <span className="absolute -bottom-6 text-xs text-muted-foreground font-body">MOVE</span>
      </div>
    </div>
  );
}
