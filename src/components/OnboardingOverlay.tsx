import { useState, useEffect } from 'react';

export function OnboardingOverlay() {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const seen = sessionStorage.getItem('teleport-onboarded');
    if (seen) setVisible(false);
  }, []);

  if (!visible) return null;

  const steps = [
    { title: 'WELCOME', text: 'Move your character using WASD or Arrow keys (or touch joystick on mobile).', icon: '🎮' },
    { title: 'TELEPORT', text: 'Step onto a glowing pad to teleport to its linked partner. Matching symbols (α, β, γ) are connected!', icon: '⚡' },
    { title: 'COOLDOWN', text: 'After teleporting, pads enter a 5-second cooldown. Watch the HUD for timing.', icon: '⏳' },
    { title: 'UNLOCK', text: 'Teleport enough times to unlock golden δ pads. Track progress in the analytics panel.', icon: '🔓' },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const dismiss = () => {
    sessionStorage.setItem('teleport-onboarded', '1');
    setVisible(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="max-w-sm w-full mx-4 rounded-lg border p-6 text-center font-body"
        style={{
          borderColor: 'hsl(var(--primary) / 0.4)',
          background: 'hsl(var(--card))',
          boxShadow: '0 0 40px hsl(var(--primary) / 0.15)',
          animation: 'fade-in 0.3s ease-out',
        }}
      >
        <div className="text-4xl mb-3">{current.icon}</div>
        <h3 className="font-display text-lg text-primary neon-text mb-2">{current.title}</h3>
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">{current.text}</p>

        <div className="flex justify-center gap-1.5 mb-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full transition-colors"
              style={{
                background: i === step ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
              }}
            />
          ))}
        </div>

        <div className="flex gap-2 justify-center">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="px-4 py-2 rounded-md text-sm font-display border"
              style={{
                borderColor: 'hsl(var(--border))',
                color: 'hsl(var(--muted-foreground))',
              }}
            >
              BACK
            </button>
          )}
          <button
            onClick={isLast ? dismiss : () => setStep(s => s + 1)}
            className="px-5 py-2 rounded-md text-sm font-display"
            style={{
              background: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))',
              boxShadow: '0 0 15px hsl(var(--primary) / 0.4)',
            }}
          >
            {isLast ? 'START PLAYING' : 'NEXT'}
          </button>
        </div>

        <button
          onClick={dismiss}
          className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip tutorial
        </button>
      </div>
    </div>
  );
}
