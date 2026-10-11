import React, { useState, useEffect, useRef } from 'react';
import {
  StationRoom,
  StationHallway,
  AgentSpriteState,
  AgentClass,
  DelegationContractEvent,
  ToolReceipt,
  OrchestrationPhase,
} from '../types/starnet';
import { PixelSprite } from './PixelSprite';
import { SuccessSpark } from './SuccessSpark';
import { audioSynth } from '../utils/audioSynthesis';
import {
  ShieldAlert,
  Terminal,
  Cpu,
  Package,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  Maximize2,
  Minimize2,
  Eye,
  FileCode,
  Flame,
  Sparkles,
} from 'lucide-react';

interface StationOverlayProps {
  rooms: StationRoom[];
  hallways: StationHallway[];
  agents: Record<AgentClass, AgentSpriteState>;
  currentEvent: DelegationContractEvent | null;
  receipts: ToolReceipt[];
  unverifiedClaims: string[];
  currentPhase: OrchestrationPhase | null;
  isRunning: boolean;
  onSelectRoom: (roomId: string) => void;
  onSelectReceipt: (receipt: ToolReceipt) => void;
  onSelectCrate: () => void;
}

export const StationOverlay: React.FC<StationOverlayProps> = ({
  rooms,
  hallways,
  agents,
  currentEvent,
  receipts,
  unverifiedClaims,
  currentPhase,
  isRunning,
  onSelectRoom,
  onSelectReceipt,
  onSelectCrate,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pulseTick, setPulseTick] = useState(0);
  const [sparkingRooms, setSparkingRooms] = useState<Record<string, { timestamp: number; receiptRef?: string | null }>>({});
  const prevReceiptCountRef = useRef(receipts.length);

  const triggerRoomSpark = (roomId: string, receiptRef?: string | null) => {
    audioSynth.playSuccessSpark();
    setSparkingRooms((prev) => ({
      ...prev,
      [roomId]: { timestamp: Date.now(), receiptRef },
    }));
    setTimeout(() => {
      setSparkingRooms((prev) => {
        const next = { ...prev };
        delete next[roomId];
        return next;
      });
    }, 2200);
  };

  // Trigger visual success spark when a new tool receipt is minted for a room
  useEffect(() => {
    if (receipts.length > prevReceiptCountRef.current) {
      const newReceipts = receipts.slice(prevReceiptCountRef.current);
      newReceipts.forEach((rcpt) => {
        if (rcpt.room_id) {
          triggerRoomSpark(rcpt.room_id, rcpt.receipt_id);
        }
      });
    }
    prevReceiptCountRef.current = receipts.length;
  }, [receipts]);

  // Trigger visual success spark when a delegation concludes in an event
  useEffect(() => {
    if (currentEvent?.phase === 'monitor' && currentEvent.delegations) {
      currentEvent.delegations.forEach((del) => {
        if (del.status === 'completed' || del.receipt_ref) {
          triggerRoomSpark(del.room_id, del.receipt_ref);
        }
      });
    } else if (currentEvent?.phase === 'synthesize') {
      // Station synthesis complete: harmonic hub spark
      triggerRoomSpark('orchestrator_hub');
    }
  }, [currentEvent]);

  // Periodic heartbeat for visual pulses
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick((prev) => (prev + 1) % 100);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Determine active rooms based on current event delegations
  const activeRoomIds = new Set<string>();
  if (currentEvent?.delegations) {
    currentEvent.delegations.forEach((d) => activeRoomIds.add(d.room_id));
  }
  if (currentPhase === 'receive' || currentPhase === 'decompose' || currentPhase === 'synthesize') {
    activeRoomIds.add('orchestrator_hub');
  }

  // Hallway connections coordinate mapping (in % of canvas)
  const getRoomCenter = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return { x: 50, y: 50 };
    return {
      x: room.x + room.width / 2,
      y: room.y + room.height / 2,
    };
  };

  const hubPos = getRoomCenter('orchestrator_hub');

  return (
    <div
      className={`relative rounded-xl border border-cyan-500/30 bg-[#070b12] overflow-hidden select-none shadow-2xl transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 h-[calc(100vh-2rem)]' : 'h-[620px] w-full'
      }`}
    >
      {/* Background Tactical Grid & Scanlines */}
      <div className="absolute inset-0 bg-tactical-grid opacity-60 pointer-events-none" />
      <div className="absolute inset-0 scanlines" />

      {/* Red Warning Overlay if unverified claims exist (StarNet Core Law) */}
      {unverifiedClaims.length > 0 && currentPhase === 'verify' && (
        <div className="absolute inset-0 border-4 border-red-500/60 pointer-events-none z-30 animate-pulse bg-red-950/10">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-red-900/90 text-red-200 border border-red-500 px-4 py-1.5 rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-lg backdrop-blur">
            <ShieldAlert className="w-4 h-4 text-red-400 animate-bounce" />
            <span>HARNESS LAW ALERT: {unverifiedClaims.length} UNVERIFIED CLAIM(S) DETECTED</span>
          </div>
        </div>
      )}

      {/* Top Station HUD Bar */}
      <div className="absolute top-0 inset-x-0 h-11 bg-slate-950/80 border-b border-cyan-900/40 px-4 flex items-center justify-between z-20 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-heading tracking-widest text-xs uppercase font-bold text-cyan-300">
              STARNET STATION OVERLAY // NODE-PRIME
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">PHASE:</span>
            <span
              className={`px-2 py-0.5 rounded uppercase text-[11px] font-bold ${
                currentPhase === 'receive'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : currentPhase === 'decompose'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : currentPhase === 'route'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : currentPhase === 'monitor'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                  : currentPhase === 'synthesize'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : currentPhase === 'verify'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {currentPhase || 'STATION IDLE'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              const target = activeRoomIds.size > 0
                ? Array.from(activeRoomIds).find((id) => id !== 'orchestrator_hub') || 'room_alpha_research'
                : 'room_alpha_research';
              triggerRoomSpark(target, 'rcpt_spark_test');
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/60 hover:border-emerald-400 hover:bg-emerald-900/80 text-[10px] font-mono text-emerald-300 font-bold transition shadow-sm"
            title="Trigger visual success spark animation on station tile"
          >
            <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="hidden xs:inline">Test Spark</span>
          </button>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="text-slate-500">RECEIPTS:</span>
            <span className="text-emerald-400 font-bold">{receipts.length}</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-500">OUTBOX CRATES:</span>
            <span className="text-cyan-400 font-bold">
              {receipts.filter((r) => r.verified).length}
            </span>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* SVG Canvas for Hallways (Handoff Lanes) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="hallwayCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="hallwayActive" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glowEffect">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Draw Hallway Corridors */}
        {hallways.map((hw) => {
          const fromPos = getRoomCenter(hw.from_room_id);
          const toPos = getRoomCenter(hw.to_room_id);

          const isConnectingActiveRoom =
            activeRoomIds.has(hw.from_room_id) && activeRoomIds.has(hw.to_room_id);
          const isRoutePhase = currentPhase === 'route' || currentPhase === 'monitor';
          const isPulsing = isConnectingActiveRoom && isRoutePhase;

          return (
            <g key={hw.id}>
              {/* Outer Corridor Tube */}
              <line
                x1={`${fromPos.x}%`}
                y1={`${fromPos.y}%`}
                x2={`${toPos.x}%`}
                y2={`${toPos.y}%`}
                stroke={isPulsing ? '#0e7490' : '#1e293b'}
                strokeWidth={isPulsing ? 8 : 4}
                strokeLinecap="round"
                opacity={isPulsing ? 0.9 : 0.4}
              />

              {/* Inner Glowing Conduit Beam */}
              <line
                x1={`${fromPos.x}%`}
                y1={`${fromPos.y}%`}
                x2={`${toPos.x}%`}
                y2={`${toPos.y}%`}
                stroke={isPulsing ? '#22d3ee' : '#334155'}
                strokeWidth={isPulsing ? 2.5 : 1}
                strokeDasharray={isPulsing ? '6,6' : 'none'}
                className={isPulsing ? 'animate-beam-flow' : ''}
                filter={isPulsing ? 'url(#glowEffect)' : undefined}
              />

              {/* Security Barrier Icon (authorized handoff lane gate) */}
              <circle
                cx={`${(fromPos.x + toPos.x) / 2}%`}
                cy={`${(fromPos.y + toPos.y) / 2}%`}
                r="4"
                fill={isPulsing ? '#22d3ee' : '#1e293b'}
                stroke={isPulsing ? '#0891b2' : '#475569'}
                strokeWidth="1.5"
              />
            </g>
          );
        })}
      </svg>

      {/* Specialist Rooms (Capability-Scoped Pods) */}
      {rooms.map((room) => {
        const isHub = room.id === 'orchestrator_hub';
        const isActive = activeRoomIds.has(room.id);
        const activeDelegation = currentEvent?.delegations?.find((d) => d.room_id === room.id);
        const isSparking = Boolean(sparkingRooms[room.id]);

        return (
          <div
            key={room.id}
            onClick={() => onSelectRoom(room.id)}
            style={{
              left: `${room.x}%`,
              top: `${room.y}%`,
              width: `${room.width}%`,
              height: `${room.height}%`,
            }}
            className={`absolute z-10 rounded-lg p-2.5 flex flex-col justify-between cursor-pointer transition-all duration-300 border ${
              isSparking
                ? 'border-emerald-400 bg-emerald-950/80 shadow-[0_0_35px_rgba(16,185,129,0.85)] ring-2 ring-emerald-400 scale-[1.04] z-30'
                : isActive
                ? 'border-cyan-400 bg-slate-900/95 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/40 scale-[1.02]'
                : 'border-slate-800 bg-slate-950/80 hover:border-slate-600 hover:bg-slate-900/60'
            }`}
          >
            {/* Visual Success Spark Animation overlay when delegation concludes */}
            {isSparking && (
              <SuccessSpark
                roomId={room.id}
                receiptRef={sparkingRooms[room.id]?.receiptRef}
              />
            )}

            {/* Room Header & Badges */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
              <div className="flex items-center gap-1.5 truncate">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: isSparking ? '#34d399' : isActive ? room.color : '#475569',
                    boxShadow: isSparking
                      ? '0 0 10px #34d399'
                      : isActive
                      ? `0 0 8px ${room.color}`
                      : 'none',
                  }}
                />
                <span className="font-heading text-xs font-bold text-slate-200 truncate tracking-wide">
                  {room.name}
                </span>
              </div>
              {isSparking ? (
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-900 text-emerald-200 border border-emerald-400 animate-pulse font-bold flex items-center gap-1 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
                  <span>SUCCESS</span>
                </span>
              ) : (
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {room.agent_class}
                </span>
              )}
            </div>

            {/* Room Core Workspace & Interactive Display */}
            <div className="flex-1 flex flex-col justify-center my-1 relative overflow-hidden">
              {isHub ? (
                // Central Orchestrator Core View
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="relative mb-1">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                        isRunning
                          ? 'border-cyan-400 bg-cyan-950/60 animate-pulse'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      <Cpu
                        className={`w-5 h-5 ${
                          isRunning ? 'text-cyan-300 animate-spin' : 'text-slate-400'
                        }`}
                        style={{ animationDuration: '6s' }}
                      />
                    </div>
                    {isRunning && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                    {currentPhase ? `HUB: ${currentPhase}` : 'HUB IDLE'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    Zero privilege escalation
                  </span>
                </div>
              ) : (
                // Specialist Bay View
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <PixelSprite
                      agentClass={room.agent_class}
                      state={isActive && currentPhase === 'monitor' ? 'working' : 'idle'}
                      size={32}
                    />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-mono font-medium text-slate-300">
                        {agents[room.agent_class]?.name}
                      </span>
                      <span className="text-[9px] text-slate-500 font-mono">
                        {isActive ? (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <Activity className="w-2.5 h-2.5 animate-pulse" /> RUN ACTIVE
                          </span>
                        ) : (
                          'STANDBY'
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Capability lock badge */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      <Lock className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{room.allowed_capabilities.length} tools</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress bar or thought bubble during MONITOR phase */}
              {isActive && currentPhase === 'monitor' && activeDelegation && (
                <div className="mt-1 pt-1 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-0.5">
                    <span className="truncate text-cyan-300">
                      {activeDelegation.task_brief?.slice(0, 24)}...
                    </span>
                    <span className="text-emerald-400 font-bold">TURN 3/8</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500 animate-pulse"
                      style={{ width: '75%' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Room Footer Status Bar */}
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-800/60">
              <span className="truncate text-slate-500">
                Grant: {room.allowed_capabilities[0] || 'sandbox'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerRoomSpark(room.id, 'rcpt_preview');
                  }}
                  className="text-slate-500 hover:text-emerald-400 transition flex items-center gap-0.5"
                  title="Trigger success spark animation on this tile"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Spark</span>
                </button>
                <span className="text-slate-500 hover:text-cyan-400 transition">
                  Inspect ↗
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* OUTBOX DOCK (Bottom Right Dock) */}
      <div
        onClick={onSelectCrate}
        className="absolute right-4 bottom-4 z-20 w-44 rounded-lg border border-slate-700 bg-slate-950/90 p-2.5 shadow-xl backdrop-blur-md hover:border-cyan-500 cursor-pointer transition group"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Package className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-heading text-xs font-bold text-slate-200 uppercase">
              OUTBOX DOCK
            </span>
          </div>
          <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-1 rounded border border-cyan-800">
            {receipts.length} CRATES
          </span>
        </div>

        {/* Deliverable Crate Icons */}
        <div className="flex items-center gap-1.5 flex-wrap min-h-[38px]">
          {receipts.length === 0 ? (
            <span className="text-[10px] font-mono text-slate-600 italic">
              Awaiting signed deliverables...
            </span>
          ) : (
            receipts.map((rcpt, idx) => (
              <div
                key={rcpt.receipt_id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectReceipt(rcpt);
                }}
                className="relative p-1 rounded bg-slate-900 border border-cyan-500/50 hover:border-cyan-300 hover:scale-110 transition shadow-sm"
                title={`Crate: ${rcpt.tool_name} | Hash: ${rcpt.sha256_hash}`}
              >
                <div className="w-6 h-6 flex items-center justify-center text-cyan-400">
                  <Package className="w-4 h-4 animate-bounce" style={{ animationDuration: `${2 + idx * 0.5}s` }} />
                </div>
                <span className="absolute -bottom-1 -right-1 text-[8px] bg-emerald-950 text-emerald-400 font-mono px-0.5 rounded border border-emerald-700">
                  ✓
                </span>
              </div>
            ))
          )}
        </div>

        <div className="text-[9px] font-mono text-slate-500 mt-1 flex justify-between items-center group-hover:text-cyan-400">
          <span>Cryptographic Receipts</span>
          <span>Open →</span>
        </div>
      </div>

      {/* Bottom Live Event Stream Ticker */}
      <div className="absolute bottom-0 inset-x-0 h-8 bg-slate-950/90 border-t border-slate-800 px-4 flex items-center justify-between text-xs font-mono z-15">
        <div className="flex items-center gap-2 truncate text-slate-300">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="text-cyan-400 font-bold">STREAM:</span>
          <span className="truncate text-slate-300">
            {currentEvent?.event_description || 'Node ready. Listening for station entry requests...'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-slate-500 text-[11px] shrink-0 font-mono">
          <span>LAW: No state without proof</span>
        </div>
      </div>
    </div>
  );
};
