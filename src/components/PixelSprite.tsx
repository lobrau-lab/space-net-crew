import React, { useState, useEffect } from 'react';
import { AgentClass } from '../types/starnet';

interface PixelSpriteProps {
  agentClass: AgentClass;
  state?: 'idle' | 'walking' | 'working' | 'thinking';
  size?: number; // default 36
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
  const [walkFrame, setWalkFrame] = useState(0);

  useEffect(() => {
    if (state !== 'walking') return;
    const interval = setInterval(() => {
      setWalkFrame(f => (f === 0 ? 1 : 0));
    }, 200);
    return () => clearInterval(interval);
  }, [state]);

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

  const badgeColor = {
    researcher: '#ffffff',
    coder: '#c084fc',
    analyst: '#fde047',
    communicator: '#6ee7b7',
    specialist: '#fda4af'
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
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className="overflow-visible"
        shapeRendering="crispEdges"
      >
        <ellipse cx="16" cy="30" rx="10" ry="2.5" fill="rgba(0,0,0,0.4)" />

{state === 'idle' && (
      <g>
        <rect x="11" y="2" width="8" height="1" fill="#0f172a" />
        <rect x="10" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="3" width="6" height="1" fill="#1e293b" />
        <rect x="18" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="4" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="5" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="6" width="2" height="1" fill={colors.secondary} />
        <rect x="12" y="6" width="6" height="1" fill={colors.visor} />
        <rect x="18" y="6" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="7" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="7" width="1" height="1" fill={colors.visor} />
        <rect x="12" y="7" width="1" height="1" fill="#ffffff" />
        <rect x="13" y="7" width="5" height="1" fill={colors.visor} />
        <rect x="18" y="7" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="8" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="8" width="7" height="1" fill={colors.visor} />
        <rect x="18" y="8" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="9" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="10" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="10" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="10" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="11" width="10" height="1" fill="#0f172a" />
        <rect x="13" y="12" width="4" height="1" fill="#0f172a" />
        <rect x="11" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="13" y="13" width="4" height="1" fill={colors.primary} />
        <rect x="17" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="14" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="14" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="14" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="15" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="16" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="16" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="16" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="17" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="17" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="17" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="18" width="1" height="1" fill={colors.gear} />
        <rect x="11" y="18" width="1" height="1" fill={colors.secondary} />
        <rect x="12" y="18" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="18" width="1" height="1" fill={colors.gear} />
        <rect x="19" y="18" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="19" width="1" height="1" fill={colors.gear} />
        <rect x="11" y="19" width="1" height="1" fill={colors.secondary} />
        <rect x="12" y="19" width="2" height="1" fill={colors.primary} />
        <rect x="14" y="19" width="2" height="1" fill={badgeColor} />
        <rect x="16" y="19" width="2" height="1" fill={colors.primary} />
        <rect x="18" y="19" width="1" height="1" fill={colors.gear} />
        <rect x="19" y="19" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="20" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="20" width="1" height="1" fill={colors.secondary} />
        <rect x="12" y="20" width="7" height="1" fill={colors.primary} />
        <rect x="19" y="20" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="20" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="21" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="21" width="8" height="1" fill={colors.secondary} />
        <rect x="19" y="21" width="3" height="1" fill="#0f172a" />
        <rect x="10" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="22" width="6" height="1" fill={colors.secondary} />
        <rect x="18" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="25" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="25" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="26" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="26" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="27" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="27" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="27" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="27" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="27" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="28" width="4" height="1" fill="#0f172a" />
        <rect x="16" y="28" width="4" height="1" fill="#0f172a" />
      </g>
      )}
{state === 'walking' && walkFrame === 0 && (
      <g>
        <rect x="11" y="1" width="8" height="1" fill="#0f172a" />
        <rect x="10" y="2" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="2" width="6" height="1" fill="#1e293b" />
        <rect x="18" y="2" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="3" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="4" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="5" width="2" height="1" fill={colors.secondary} />
        <rect x="12" y="5" width="6" height="1" fill={colors.visor} />
        <rect x="18" y="5" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="6" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="6" width="1" height="1" fill={colors.visor} />
        <rect x="12" y="6" width="1" height="1" fill="#ffffff" />
        <rect x="13" y="6" width="5" height="1" fill={colors.visor} />
        <rect x="18" y="6" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="7" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="7" width="7" height="1" fill={colors.visor} />
        <rect x="18" y="7" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="8" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="9" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="10" width="10" height="1" fill="#0f172a" />
        <rect x="13" y="11" width="4" height="1" fill="#0f172a" />
        <rect x="11" y="12" width="2" height="1" fill="#0f172a" />
        <rect x="13" y="12" width="4" height="1" fill={colors.primary} />
        <rect x="17" y="12" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="13" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="14" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="14" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="14" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="15" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="15" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="15" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="16" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="16" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="16" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="17" width="1" height="1" fill={colors.gear} />
        <rect x="11" y="17" width="1" height="1" fill={colors.secondary} />
        <rect x="12" y="17" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="17" width="1" height="1" fill={colors.gear} />
        <rect x="19" y="17" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="18" width="1" height="1" fill={colors.gear} />
        <rect x="11" y="18" width="1" height="1" fill={colors.secondary} />
        <rect x="12" y="18" width="2" height="1" fill={colors.primary} />
        <rect x="14" y="18" width="2" height="1" fill={badgeColor} />
        <rect x="16" y="18" width="2" height="1" fill={colors.primary} />
        <rect x="18" y="18" width="1" height="1" fill={colors.gear} />
        <rect x="19" y="18" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="19" width="1" height="1" fill={colors.secondary} />
        <rect x="12" y="19" width="7" height="1" fill={colors.primary} />
        <rect x="19" y="19" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="20" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="20" width="8" height="1" fill={colors.secondary} />
        <rect x="19" y="20" width="3" height="1" fill="#0f172a" />
        <rect x="10" y="21" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="21" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="21" width="4" height="1" fill="#0f172a" />
        <rect x="10" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="22" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="22" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="25" width="6" height="1" fill="#0f172a" />
        <rect x="16" y="25" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="14" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="26" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="14" y="27" width="4" height="1" fill="#0f172a" />
      </g>
      )}
{state === 'walking' && walkFrame === 1 && (
      <g>
        <rect x="11" y="1" width="8" height="1" fill="#0f172a" />
        <rect x="10" y="2" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="2" width="6" height="1" fill="#1e293b" />
        <rect x="18" y="2" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="3" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="4" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="5" width="2" height="1" fill={colors.secondary} />
        <rect x="12" y="5" width="6" height="1" fill={colors.visor} />
        <rect x="18" y="5" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="6" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="6" width="1" height="1" fill={colors.visor} />
        <rect x="12" y="6" width="1" height="1" fill="#ffffff" />
        <rect x="13" y="6" width="5" height="1" fill={colors.visor} />
        <rect x="18" y="6" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="7" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="7" width="7" height="1" fill={colors.visor} />
        <rect x="18" y="7" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="8" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="9" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="10" width="10" height="1" fill="#0f172a" />
        <rect x="13" y="11" width="4" height="1" fill="#0f172a" />
        <rect x="11" y="12" width="2" height="1" fill="#0f172a" />
        <rect x="13" y="12" width="4" height="1" fill={colors.primary} />
        <rect x="17" y="12" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="13" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="14" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="14" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="14" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="15" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="15" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="15" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="16" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="16" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="16" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="17" width="1" height="1" fill={colors.gear} />
        <rect x="11" y="17" width="1" height="1" fill={colors.secondary} />
        <rect x="12" y="17" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="17" width="1" height="1" fill={colors.gear} />
        <rect x="19" y="17" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="18" width="1" height="1" fill={colors.gear} />
        <rect x="11" y="18" width="1" height="1" fill={colors.secondary} />
        <rect x="12" y="18" width="2" height="1" fill={colors.primary} />
        <rect x="14" y="18" width="2" height="1" fill={badgeColor} />
        <rect x="16" y="18" width="2" height="1" fill={colors.primary} />
        <rect x="18" y="18" width="1" height="1" fill={colors.gear} />
        <rect x="19" y="18" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="19" width="1" height="1" fill={colors.secondary} />
        <rect x="12" y="19" width="7" height="1" fill={colors.primary} />
        <rect x="19" y="19" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="20" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="20" width="8" height="1" fill={colors.secondary} />
        <rect x="19" y="20" width="3" height="1" fill="#0f172a" />
        <rect x="12" y="21" width="6" height="1" fill="#0f172a" />
        <rect x="18" y="21" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="21" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="22" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="22" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="25" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="25" width="5" height="1" fill="#0f172a" />
        <rect x="10" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="26" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="27" width="4" height="1" fill="#0f172a" />
      </g>
      )}
{state === 'working' && (
      <g>
        <rect x="11" y="2" width="8" height="1" fill="#0f172a" />
        <rect x="10" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="3" width="6" height="1" fill="#1e293b" />
        <rect x="18" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="4" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="5" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="6" width="2" height="1" fill={colors.secondary} />
        <rect x="12" y="6" width="6" height="1" fill={colors.visor} />
        <rect x="18" y="6" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="7" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="7" width="1" height="1" fill={colors.visor} />
        <rect x="12" y="7" width="1" height="1" fill="#ffffff" />
        <rect x="13" y="7" width="5" height="1" fill={colors.visor} />
        <rect x="18" y="7" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="8" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="8" width="7" height="1" fill={colors.visor} />
        <rect x="18" y="8" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="9" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="10" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="10" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="10" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="11" width="10" height="1" fill="#0f172a" />
        <rect x="13" y="12" width="4" height="1" fill="#0f172a" />
        <rect x="11" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="13" y="13" width="4" height="1" fill={colors.primary} />
        <rect x="17" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="14" width="3" height="1" fill="#0f172a" />
        <rect x="12" y="14" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="14" width="3" height="1" fill="#0f172a" />
        <rect x="8" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="15" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="15" width="1" height="1" fill="#0f172a" />
        <rect x="12" y="15" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="15" width="1" height="1" fill="#0f172a" />
        <rect x="19" y="15" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="7" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="16" width="1" height="1" fill={colors.gear} />
        <rect x="10" y="16" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="16" width="1" height="1" fill="#0f172a" />
        <rect x="12" y="16" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="16" width="1" height="1" fill="#0f172a" />
        <rect x="19" y="16" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="16" width="1" height="1" fill={colors.gear} />
        <rect x="22" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="7" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="17" width="1" height="1" fill={colors.gear} />
        <rect x="10" y="17" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="17" width="1" height="1" fill="#0f172a" />
        <rect x="12" y="17" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="17" width="1" height="1" fill="#0f172a" />
        <rect x="19" y="17" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="17" width="1" height="1" fill={colors.gear} />
        <rect x="22" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="7" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="18" width="2" height="1" fill={colors.secondary} />
        <rect x="11" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="13" y="18" width="2" height="1" fill={colors.primary} />
        <rect x="15" y="18" width="2" height="1" fill={badgeColor} />
        <rect x="17" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="19" y="18" width="3" height="1" fill={colors.secondary} />
        <rect x="22" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="7" y="19" width="4" height="1" fill="#0f172a" />
        <rect x="12" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="14" y="19" width="3" height="1" fill={colors.primary} />
        <rect x="17" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="20" y="19" width="4" height="1" fill="#0f172a" />
        <rect x="12" y="20" width="2" height="1" fill="#0f172a" />
        <rect x="14" y="20" width="3" height="1" fill={colors.primary} />
        <rect x="17" y="20" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="21" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="21" width="6" height="1" fill={colors.secondary} />
        <rect x="18" y="21" width="3" height="1" fill="#0f172a" />
        <rect x="10" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="22" width="6" height="1" fill={colors.secondary} />
        <rect x="18" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="25" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="25" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="26" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="26" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="27" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="27" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="27" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="27" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="27" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="28" width="4" height="1" fill="#0f172a" />
        <rect x="16" y="28" width="4" height="1" fill="#0f172a" />
      </g>
      )}
{state === 'thinking' && (
      <g>
        <rect x="11" y="2" width="8" height="1" fill="#0f172a" />
        <rect x="10" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="3" width="6" height="1" fill="#1e293b" />
        <rect x="18" y="3" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="4" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="4" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="5" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="5" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="6" width="2" height="1" fill={colors.secondary} />
        <rect x="12" y="6" width="6" height="1" fill={colors.visor} />
        <rect x="18" y="6" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="6" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="7" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="7" width="1" height="1" fill={colors.visor} />
        <rect x="12" y="7" width="1" height="1" fill="#ffffff" />
        <rect x="13" y="7" width="5" height="1" fill={colors.visor} />
        <rect x="18" y="7" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="7" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="8" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="8" width="7" height="1" fill={colors.visor} />
        <rect x="18" y="8" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="8" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="9" width="10" height="1" fill="#1e293b" />
        <rect x="20" y="9" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="10" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="10" width="8" height="1" fill="#1e293b" />
        <rect x="19" y="10" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="11" width="10" height="1" fill="#0f172a" />
        <rect x="13" y="12" width="4" height="1" fill="#0f172a" />
        <rect x="11" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="13" y="13" width="4" height="1" fill={colors.primary} />
        <rect x="17" y="13" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="14" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="14" width="6" height="1" fill={colors.primary} />
        <rect x="18" y="14" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="11" y="15" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="15" width="2" height="1" fill="#0f172a" />
        <rect x="8" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="16" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="16" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="16" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="16" width="2" height="1" fill="#0f172a" />
        <rect x="7" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="17" width="1" height="1" fill={colors.gear} />
        <rect x="10" y="17" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="17" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="17" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="17" width="2" height="1" fill="#0f172a" />
        <rect x="7" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="18" width="1" height="1" fill={colors.gear} />
        <rect x="10" y="18" width="1" height="1" fill={colors.secondary} />
        <rect x="11" y="18" width="8" height="1" fill={colors.primary} />
        <rect x="19" y="18" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="18" width="2" height="1" fill="#0f172a" />
        <rect x="7" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="9" y="19" width="2" height="1" fill={colors.secondary} />
        <rect x="11" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="13" y="19" width="2" height="1" fill={colors.primary} />
        <rect x="15" y="19" width="2" height="1" fill={badgeColor} />
        <rect x="17" y="19" width="2" height="1" fill={colors.primary} />
        <rect x="19" y="19" width="2" height="1" fill={colors.secondary} />
        <rect x="21" y="19" width="2" height="1" fill="#0f172a" />
        <rect x="7" y="20" width="4" height="1" fill="#0f172a" />
        <rect x="12" y="20" width="2" height="1" fill="#0f172a" />
        <rect x="14" y="20" width="4" height="1" fill={colors.primary} />
        <rect x="18" y="20" width="2" height="1" fill={colors.secondary} />
        <rect x="20" y="20" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="21" width="2" height="1" fill="#0f172a" />
        <rect x="14" y="21" width="6" height="1" fill={colors.secondary} />
        <rect x="20" y="21" width="3" height="1" fill="#0f172a" />
        <rect x="10" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="22" width="6" height="1" fill={colors.secondary} />
        <rect x="18" y="22" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="23" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="23" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="24" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="24" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="25" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="25" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="25" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="26" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="26" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="26" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="27" width="2" height="1" fill="#0f172a" />
        <rect x="12" y="27" width="2" height="1" fill={colors.secondary} />
        <rect x="14" y="27" width="2" height="1" fill="#0f172a" />
        <rect x="16" y="27" width="2" height="1" fill={colors.secondary} />
        <rect x="18" y="27" width="2" height="1" fill="#0f172a" />
        <rect x="10" y="28" width="4" height="1" fill="#0f172a" />
        <rect x="16" y="28" width="4" height="1" fill="#0f172a" />
      </g>
      )}

      </svg>
    </div>
  );
};
