import { useGameLoop } from '@/hooks/useGameLoop';
import { Player } from './Player';
import { TeleportPadComponent } from './TeleportPadComponent';
import { TeleportEffect } from './TeleportEffect';
import { CooldownHUD } from './CooldownHUD';
import { TeleportMessage } from './TeleportMessage';
import { MobileControls } from './MobileControls';
import { OnboardingOverlay } from './OnboardingOverlay';

export function TeleportArena() {
  const {
    playerPos,
    isTeleporting,
    teleportEffects,
    teleportMessage,
    teleportMessageKey,
    pads,
    getCooldownRemaining,
    setMobileDirection,
    arenaWidth,
    arenaHeight,
    playerSize,
    padSize,
    cooldownDuration,
  } = useGameLoop();

  return (
    <>
      <OnboardingOverlay />
      <div className="flex flex-col items-center gap-4 w-full max-w-[850px] px-2">
        {/* Title */}
        <div className="text-center">
          <h1 className="font-display text-2xl md:text-5xl font-bold neon-text tracking-wider text-primary">
            TELEPORT SYSTEM
          </h1>
          <p className="font-body text-sm md:text-lg text-muted-foreground mt-1 tracking-wide">
            Move with <span className="text-primary font-semibold">WASD</span> or <span className="text-primary font-semibold">Arrow Keys</span> · Step on a pad to teleport
          </p>
        </div>

        {/* Cooldown HUD */}
        <CooldownHUD pads={pads} getCooldownRemaining={getCooldownRemaining} />

        {/* Arena */}
        <div
          className="relative rounded-lg neon-border overflow-hidden w-full"
          style={{
            maxWidth: arenaWidth,
            aspectRatio: `${arenaWidth} / ${arenaHeight}`,
            background: `radial-gradient(circle at 50% 50%, hsl(var(--arena-grid)) 0%, hsl(var(--background)) 100%)`,
          }}
        >
          <div
            className="absolute inset-0 origin-top-left"
            style={{ width: arenaWidth, height: arenaHeight, transform: 'scale(var(--arena-scale, 1))' }}
            ref={(el) => {
              if (!el) return;
              const observer = new ResizeObserver(([entry]) => {
                const scale = entry.contentRect.width / arenaWidth;
                el.style.setProperty('--arena-scale', String(Math.min(scale, 1)));
              });
              observer.observe(el.parentElement!);
            }}
          >
            <svg className="absolute inset-0 w-full h-full opacity-15" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(180 100% 50%)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {pads.map(pad => (
              <TeleportPadComponent
                key={pad.id}
                pad={pad}
                size={padSize}
                cooldownRemaining={getCooldownRemaining(pad.id)}
              />
            ))}

            {teleportEffects.map(effect => (
              <TeleportEffect key={effect.id} position={effect.position} />
            ))}

            <Player position={playerPos} size={playerSize} isTeleporting={isTeleporting} />

            <TeleportMessage
              key={teleportMessageKey}
              message={teleportMessage}
              cooldownSeconds={cooldownDuration / 1000}
            />
          </div>
        </div>

        {/* Mobile joystick */}
        <MobileControls onDirection={setMobileDirection} />

        {/* Footer hint */}
        <p className="text-xs md:text-sm text-muted-foreground font-body text-center">
          Pads with matching symbols (α, β, γ) are linked · 5s cooldown after each teleport
        </p>
      </div>
    </>
  );
}