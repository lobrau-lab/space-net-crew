import React, { useMemo } from 'react';
import { CheckCircle2, Sparkles, Zap } from 'lucide-react';

interface SuccessSparkProps {
  roomId: string;
  receiptRef?: string | null;
  onAnimationEnd?: () => void;
}

export const SuccessSpark: React.FC<SuccessSparkProps> = ({
  roomId,
  receiptRef,
}) => {
  // Pre-generate 12 deterministic pixel spark particles scattering in radial directions
  const particles = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => {
      const angle = (i * (360 / 14)) * (Math.PI / 180);
      const distance = 35 + (i % 3) * 18; // 35px to 71px
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance;
      const size = (i % 2 === 0 ? 6 : 4);
      const colors = ['#34d399', '#22d3ee', '#fbbf24', '#a7f3d0', '#67e8f9'];
      const color = colors[i % colors.length];
      const delay = (i % 4) * 0.04;
      const duration = 0.75 + (i % 3) * 0.15;
      const isStar = i % 2 === 0;

      return {
        id: i,
        x,
        y,
        size,
        color,
        delay,
        duration,
        isStar,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-visible flex items-center justify-center">
      {/* 1. Instant Emerald/Cyan Ambient Flash Sweep */}
      <div className="absolute inset-0 rounded-lg animate-success-flash" />

      {/* 2. Expanding Pixel-Art Shockwave Ring */}
      <div className="absolute inset-0 rounded-lg border-2 border-emerald-400 animate-success-shockwave" />
      <div
        className="absolute inset-0 rounded-lg border border-cyan-300 animate-success-shockwave"
        style={{ animationDelay: '0.12s' }}
      />

      {/* 3. Corner Arc Flashes (High-tech tactical corner accents) */}
      <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-emerald-300 animate-pulse-glow" />
      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 border-cyan-300 animate-pulse-glow" />
      <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 border-emerald-300 animate-pulse-glow" />
      <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-cyan-300 animate-pulse-glow" />

      {/* 4. Radial Pixel Sparks Particles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-none pixelated"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}, 0 0 14px ${p.color}`,
              transform: `translate(${p.x}px, ${p.y}px)`,
              animation: `particleBurst ${p.duration}s ease-out forwards`,
              animationDelay: `${p.delay}s`,
            }}
          >
            {p.isStar && (
              <div
                className="absolute inset-0 bg-white opacity-80"
                style={{
                  transform: 'scale(0.6) rotate(45deg)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* 5. Floating Success Badge Toast above the room tile */}
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap animate-success-float z-40">
        <div className="px-2 py-0.5 rounded bg-emerald-950/95 border border-emerald-400 text-emerald-200 text-[10px] font-mono font-bold flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.7)] backdrop-blur-md">
          <Sparkles className="w-3 h-3 text-emerald-300 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="tracking-wider">TASK COMPLETE</span>
          <span className="text-[9px] bg-emerald-800/80 text-emerald-100 px-1 rounded border border-emerald-500">
            SEALED
          </span>
        </div>
      </div>
    </div>
  );
};
