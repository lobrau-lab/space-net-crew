import React from 'react';
import { AgentClass } from '../types/starnet';

interface PixelSpriteProps {
  agentClass: AgentClass;
  state?: 'idle' | 'walking' | 'working' | 'thinking';
  size?: number; // default 32
  facing?: 'left' | 'right';
  className?: string;
}

export const PixelSprite: React.FC<PixelSpriteProps> = ({
  agentClass,
  state = 'idle',
  size = 36,
  facing = 'right',
  className = '',
}) => {
  // Color themes per agent class
  const colors = {
    researcher: {
      primary: '#38bdf8', // Cyan
      secondary: '#0284c7',
      gear: '#e0f2fe',
      visor: '#06b6d4',
    },
    coder: {
      primary: '#a855f7', // Violet
      secondary: '#7e22ce',
      gear: '#f3e8ff',
      visor: '#d8b4fe',
    },
    analyst: {
      primary: '#f59e0b', // Amber/Gold
      secondary: '#b45309',
      gear: '#fef3c7',
      visor: '#fbbf24',
    },
    communicator: {
      primary: '#10b981', // Emerald
      secondary: '#047857',
      gear: '#d1fae5',
      visor: '#34d399',
    },
    specialist: {
      primary: '#f43f5e', // Rose/Crimson
      secondary: '#be123c',
      gear: '#ffe4e6',
      visor: '#fb7185',
    },
  }[agentClass];

  return (
    <div
      className={`relative inline-block select-none pixelated ${className}`}
      style={{
        width: size,
        height: size,
        transform: facing === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
      }}
    >
      <svg
        viewBox="0 0 16 16"
        width={size}
        height={size}
        className="overflow-visible"
        shapeRendering="crispEdges"
      >
        {/* Shadow */}
        <ellipse cx="8" cy="15" rx="5" ry="1.5" fill="rgba(0,0,0,0.4)" />

        {/* Head / Helmet */}
        <rect x="5" y="2" width="6" height="5" fill="#1e293b" />
        <rect x="6" y="1" width="4" height="1" fill={colors.secondary} />
        <rect x="5" y="3" width="1" height="3" fill={colors.secondary} />
        <rect x="10" y="3" width="1" height="3" fill={colors.secondary} />

        {/* Visor / Optical HUD */}
        <rect x="7" y="3" width="4" height="2" fill={colors.visor} />
        <rect x="9" y="3" width="1" height="1" fill="#ffffff" />

        {/* Neck / Collar */}
        <rect x="6" y="7" width="4" height="1" fill="#0f172a" />

        {/* Torso / Tactical Suit */}
        <rect x="5" y="8" width="6" height="4" fill={colors.primary} />
        <rect x="6" y="8" width="4" height="3" fill={colors.secondary} />
        <rect x="7" y="9" width="2" height="1" fill={colors.gear} />

        {/* Class Badge icon */}
        {agentClass === 'researcher' && (
          <rect x="8" y="9" width="1" height="1" fill="#ffffff" />
        )}
        {agentClass === 'coder' && (
          <rect x="6" y="10" width="2" height="1" fill="#c084fc" />
        )}
        {agentClass === 'analyst' && (
          <rect x="7" y="10" width="2" height="1" fill="#fde047" />
        )}
        {agentClass === 'communicator' && (
          <rect x="6" y="9" width="1" height="2" fill="#6ee7b7" />
        )}
        {agentClass === 'specialist' && (
          <rect x="7" y="9" width="2" height="2" fill="#fda4af" />
        )}

        {/* Arms */}
        {state === 'working' ? (
          <>
            <rect x="3" y="9" width="2" height="2" fill={colors.secondary} />
            <rect x="2" y="11" width="3" height="1" fill={colors.gear} />
            <rect x="11" y="9" width="2" height="2" fill={colors.secondary} />
            <rect x="11" y="11" width="3" height="1" fill={colors.gear} />
          </>
        ) : (
          <>
            <rect x="4" y="8" width="1" height="3" fill={colors.secondary} />
            <rect x="11" y="8" width="1" height="3" fill={colors.secondary} />
          </>
        )}

        {/* Legs / Boots with walk animation offset */}
        {state === 'walking' ? (
          <>
            <rect x="5" y="12" width="2" height="3" fill="#0f172a" />
            <rect x="4" y="14" width="3" height="1" fill={colors.secondary} />
            <rect x="9" y="11" width="2" height="3" fill="#1e293b" />
            <rect x="9" y="13" width="3" height="1" fill={colors.secondary} />
          </>
        ) : (
          <>
            <rect x="5" y="12" width="2" height="3" fill="#0f172a" />
            <rect x="9" y="12" width="2" height="3" fill="#0f172a" />
            <rect x="4" y="14" width="3" height="1" fill={colors.secondary} />
            <rect x="9" y="14" width="3" height="1" fill={colors.secondary} />
          </>
        )}
      </svg>
    </div>
  );
};
