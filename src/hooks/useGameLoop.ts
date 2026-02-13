import { useState, useEffect, useCallback, useRef } from 'react';
import { playTeleportSound } from '@/lib/audio';

export interface Position {
  x: number;
  y: number;
}

export interface TeleportPad {
  id: string;
  position: Position;
  targetId: string;
  color: 'cyan' | 'purple' | 'pink' | 'gold';
  label: string;
  locked?: boolean;
  unlockCost?: number;
}

export interface TeleportStats {
  totalTeleports: number;
  padUsage: Record<string, number>;
  distanceTraveled: number;
  sessionStart: number;
  unlocks: string[];
}

const PLAYER_SPEED = 4;
const ARENA_WIDTH = 800;
const ARENA_HEIGHT = 500;
const PLAYER_SIZE = 28;
const PAD_SIZE = 50;
const COOLDOWN_DURATION = 5000;
const TELEPORT_PROXIMITY = 35;

const INITIAL_PADS: TeleportPad[] = [
  { id: 'A', position: { x: 80, y: 80 }, targetId: 'B', color: 'cyan', label: 'α' },
  { id: 'B', position: { x: 680, y: 380 }, targetId: 'A', color: 'cyan', label: 'α' },
  { id: 'C', position: { x: 680, y: 80 }, targetId: 'D', color: 'purple', label: 'β' },
  { id: 'D', position: { x: 80, y: 380 }, targetId: 'C', color: 'purple', label: 'β' },
  { id: 'E', position: { x: 380, y: 230 }, targetId: 'F', color: 'pink', label: 'γ' },
  { id: 'F', position: { x: 380, y: 420 }, targetId: 'E', color: 'pink', label: 'γ' },
];

export function useGameLoop() {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 400, y: 250 });
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [isTeleporting, setIsTeleporting] = useState(false);
  const [teleportEffects, setTeleportEffects] = useState<{ id: number; position: Position }[]>([]);
  const [lastTeleportedTo, setLastTeleportedTo] = useState<string | null>(null);
  const [teleportMessage, setTeleportMessage] = useState<string | null>(null);
  const [teleportMessageKey, setTeleportMessageKey] = useState(0);
  const [pads, setPads] = useState<TeleportPad[]>(INITIAL_PADS);
  const [stats, setStats] = useState<TeleportStats>({
    totalTeleports: 0,
    padUsage: {},
    distanceTraveled: 0,
    sessionStart: Date.now(),
    unlocks: [],
  });
  const effectIdRef = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const animationFrameRef = useRef<number>(0);
  const lastPosRef = useRef<Position>({ x: 400, y: 250 });
  // Mobile direction
  const mobileDirRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const setMobileDirection = useCallback((x: number, y: number) => {
    mobileDirRef.current = { x, y };
  }, []);

  const getCooldownRemaining = useCallback((padId: string): number => {
    const expiry = cooldowns[padId];
    if (!expiry) return 0;
    const remaining = expiry - Date.now();
    return remaining > 0 ? remaining : 0;
  }, [cooldowns]);

  const unlockPad = useCallback((pairLabel: string) => {
    setPads(prev => prev.map(p => 
      p.label === pairLabel ? { ...p, locked: false } : p
    ));
    setStats(prev => ({
      ...prev,
      unlocks: [...prev.unlocks, pairLabel],
    }));
    setTeleportMessage(`Unlocked ${pairLabel} pads!`);
    setTeleportMessageKey(k => k + 1);
  }, []);

  const canUnlock = useCallback((unlockCost: number) => {
    return stats.totalTeleports >= unlockCost;
  }, [stats.totalTeleports]);

  const teleport = useCallback((fromPad: TeleportPad) => {
    const targetPad = pads.find(p => p.id === fromPad.targetId);
    if (!targetPad) return;

    setIsTeleporting(true);
    playTeleportSound();

    const originId = ++effectIdRef.current;
    setTeleportEffects(prev => [...prev, { id: originId, position: { ...fromPad.position } }]);
    setTimeout(() => setTeleportEffects(prev => prev.filter(e => e.id !== originId)), 600);

    setTeleportMessage(`Teleported ${fromPad.id} → ${targetPad.id} · Cooldown active`);
    setTeleportMessageKey(k => k + 1);

    // Update stats
    setStats(prev => ({
      ...prev,
      totalTeleports: prev.totalTeleports + 1,
      padUsage: {
        ...prev.padUsage,
        [fromPad.id]: (prev.padUsage[fromPad.id] || 0) + 1,
      },
    }));

    const now = Date.now();
    setCooldowns(prev => ({
      ...prev,
      [fromPad.id]: now + COOLDOWN_DURATION,
      [targetPad.id]: now + COOLDOWN_DURATION,
    }));

    setTimeout(() => {
      setPlayerPos({
        x: targetPad.position.x + PAD_SIZE / 2 - PLAYER_SIZE / 2,
        y: targetPad.position.y + PAD_SIZE / 2 - PLAYER_SIZE / 2,
      });
      setLastTeleportedTo(targetPad.id);

      const destId = ++effectIdRef.current;
      setTeleportEffects(prev => [...prev, { id: destId, position: { ...targetPad.position } }]);
      setTimeout(() => setTeleportEffects(prev => prev.filter(e => e.id !== destId)), 600);

      setTimeout(() => {
        setIsTeleporting(false);
        setTimeout(() => setLastTeleportedTo(null), 300);
      }, 300);
    }, 200);
  }, [pads]);

  // Keyboard input
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      const keys = keysPressed.current;
      const mobile = mobileDirRef.current;
      setPlayerPos(prev => {
        let { x, y } = prev;
        // Keyboard
        if (keys.has('w') || keys.has('arrowup')) y -= PLAYER_SPEED;
        if (keys.has('s') || keys.has('arrowdown')) y += PLAYER_SPEED;
        if (keys.has('a') || keys.has('arrowleft')) x -= PLAYER_SPEED;
        if (keys.has('d') || keys.has('arrowright')) x += PLAYER_SPEED;
        // Mobile joystick
        x += mobile.x * PLAYER_SPEED;
        y += mobile.y * PLAYER_SPEED;

        x = Math.max(0, Math.min(ARENA_WIDTH - PLAYER_SIZE, x));
        y = Math.max(0, Math.min(ARENA_HEIGHT - PLAYER_SIZE, y));

        // Track distance
        const dx = x - lastPosRef.current.x;
        const dy = y - lastPosRef.current.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.5) {
          setStats(s => ({ ...s, distanceTraveled: s.distanceTraveled + dist }));
          lastPosRef.current = { x, y };
        }

        return { x, y };
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };
    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, []);

  // Auto-teleport on proximity
  useEffect(() => {
    if (isTeleporting) return;
    const playerCenter = {
      x: playerPos.x + PLAYER_SIZE / 2,
      y: playerPos.y + PLAYER_SIZE / 2,
    };
    for (const pad of pads) {
      if (pad.locked) continue;
      if (pad.id === lastTeleportedTo) continue;
      const padCenter = {
        x: pad.position.x + PAD_SIZE / 2,
        y: pad.position.y + PAD_SIZE / 2,
      };
      const dist = Math.hypot(playerCenter.x - padCenter.x, playerCenter.y - padCenter.y);
      if (dist < TELEPORT_PROXIMITY && getCooldownRemaining(pad.id) === 0) {
        teleport(pad);
        break;
      }
    }
  }, [playerPos, isTeleporting, lastTeleportedTo, getCooldownRemaining, teleport, pads]);

  return {
    playerPos,
    cooldowns,
    isTeleporting,
    teleportEffects,
    teleportMessage,
    teleportMessageKey,
    pads,
    stats,
    getCooldownRemaining,
    unlockPad,
    canUnlock,
    setMobileDirection,
    arenaWidth: ARENA_WIDTH,
    arenaHeight: ARENA_HEIGHT,
    playerSize: PLAYER_SIZE,
    padSize: PAD_SIZE,
    cooldownDuration: COOLDOWN_DURATION,
  };
}
