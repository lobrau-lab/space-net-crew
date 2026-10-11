import React, { useState, useEffect, useRef } from 'react';
import {
  StationRoom,
  StationHallway,
  AgentSpriteState,
  AgentClass,
  DelegationContractEvent,
  ToolReceipt,
  OrchestrationResult,
  OrchestrationPhase,
} from './types/starnet';
import {
  INITIAL_ROOMS,
  INITIAL_HALLWAYS,
  INITIAL_AGENTS,
  SAMPLE_BENCHMARKS,
  STARNET_SYSTEM_PROMPT,
} from './data/starnetConfig';
import { StationOverlay } from './components/StationOverlay';
import { OrchestrationControls } from './components/OrchestrationControls';
import { DeliverablesViewer } from './components/DeliverablesViewer';
import { VerificationLedger } from './components/VerificationLedger';
import { OverlayEventStreamViewer } from './components/OverlayEventStreamViewer';
import { GoogleAIStudioPromptModal } from './components/GoogleAIStudioPromptModal';
import { RoomInspectorModal, ReceiptInspectorModal } from './components/StationInspectors';
import { RoomUtilizationChart } from './components/RoomUtilizationChart';
import { audioSynth } from './utils/audioSynthesis';
import {
  Cpu,
  Layers,
  FileCheck2,
  Terminal,
  ShieldCheck,
  Sparkles,
  Info,
  ExternalLink,
  Code2,
  Zap,
  Activity,
  BarChart3,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function App() {
  // Station State
  const [rooms, setRooms] = useState<StationRoom[]>(INITIAL_ROOMS);
  const [hallways, setHallways] = useState<StationHallway[]>(INITIAL_HALLWAYS);
  const [agents, setAgents] = useState<Record<AgentClass, AgentSpriteState>>(INITIAL_AGENTS);

  // Orchestration & Task Input
  const [prompt, setPrompt] = useState<string>(SAMPLE_BENCHMARKS[0].prompt);
  const [budgetCap, setBudgetCap] = useState<number>(0.50);
  const [executionSpeed, setExecutionSpeed] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // Runtime Progression & Results
  const [activeResult, setActiveResult] = useState<OrchestrationResult | null>(null);
  const [currentEventIndex, setCurrentEventIndex] = useState<number>(0);
  const [currentEvent, setCurrentEvent] = useState<DelegationContractEvent | null>(null);
  const [receipts, setReceipts] = useState<ToolReceipt[]>([]);
  const [unverifiedClaims, setUnverifiedClaims] = useState<string[]>([]);
  const [currentPhase, setCurrentPhase] = useState<OrchestrationPhase | null>(null);
  const [totalCost, setTotalCost] = useState<number>(0);

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState<'overlay' | 'telemetry' | 'stream'>('overlay');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => audioSynth.isEnabled());
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<ToolReceipt | null>(null);
  const [apiKeyConfigured, setApiKeyConfigured] = useState<boolean>(false);

  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch node status on mount
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        setApiKeyConfigured(Boolean(data.gemini_configured));
      })
      .catch((err) => {
        console.warn('Could not contact StarNet backend:', err);
      });
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    };
  }, []);

  // Dispatch an orchestration task run
  const handleRunOrchestration = async () => {
    if (isRunning || !prompt.trim()) return;

    audioSynth.playClick();
    setIsRunning(true);
    setCurrentPhase('receive');
    setReceipts([]);
    setUnverifiedClaims([]);
    setTotalCost(0);

    try {
      const response = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, maxBudget: budgetCap }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const result: OrchestrationResult = await response.json();
      setActiveResult(result);

      // Start stepping through the overlay event stream
      playEventStream(result.overlay_event_stream, result);
    } catch (error: any) {
      console.error('Orchestration run failed:', error);
      setIsRunning(false);
      setCurrentPhase(null);
    }
  };

  // Replay the overlay event stream step-by-step
  const playEventStream = (events: DelegationContractEvent[], fullResult: OrchestrationResult) => {
    if (!events || events.length === 0) {
      setIsRunning(false);
      return;
    }

    let idx = 0;
    const stepDuration = Math.max(250, 1800 / executionSpeed);

    const step = () => {
      if (idx >= events.length) {
        // Concluded
        setIsRunning(false);
        setCurrentPhase('verify');
        setReceipts(fullResult.receipts);
        setUnverifiedClaims(fullResult.unverified_claims || []);
        setTotalCost(fullResult.cost_report.total_spend);
        return;
      }

      const ev = events[idx];
      setCurrentEventIndex(idx);
      setCurrentEvent(ev);
      setCurrentPhase(ev.phase);

      // Trigger procedural audio cues for event occurrence and phase shifts
      audioSynth.playChirp();
      if (ev.phase) {
        audioSynth.playPhaseTransition(ev.phase);
      }
      if (ev.unverified_claims && ev.unverified_claims.length > 0) {
        audioSynth.playAlert();
      }

      // Accumulate receipts up to this point
      if (ev.receipt_ref) {
        const found = fullResult.receipts.find((r) => r.receipt_id === ev.receipt_ref);
        if (found) {
          setReceipts((prev) => (prev.some((r) => r.receipt_id === found.receipt_id) ? prev : [...prev, found]));
        }
      }

      if (ev.unverified_claims) {
        setUnverifiedClaims(ev.unverified_claims);
      }

      // Update cost ticker proportionally
      const progressRatio = (idx + 1) / events.length;
      setTotalCost(Number((fullResult.cost_report.total_spend * progressRatio).toFixed(4)));

      idx++;
      animationTimerRef.current = setTimeout(step, stepDuration);
    };

    step();
  };

  // User manually scrubs an event in the stream
  const handleSelectEventIndex = (idx: number) => {
    if (!activeResult || !activeResult.overlay_event_stream[idx]) return;
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    setIsRunning(false);

    audioSynth.playClick();
    const ev = activeResult.overlay_event_stream[idx];
    setCurrentEventIndex(idx);
    setCurrentEvent(ev);
    setCurrentPhase(ev.phase);

    // Filter receipts up to this event
    const upToReceipts = activeResult.receipts.slice(0, Math.max(1, Math.min(idx, activeResult.receipts.length)));
    setReceipts(upToReceipts);
    setUnverifiedClaims(ev.unverified_claims || []);
  };

  const handleReset = () => {
    audioSynth.playClick();
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    setIsRunning(false);
    setCurrentPhase(null);
    setCurrentEvent(null);
    setCurrentEventIndex(0);
    setReceipts([]);
    setUnverifiedClaims([]);
    setTotalCost(0);
  };

  const selectedRoomObj = rooms.find((r) => r.id === selectedRoomId) || null;

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-mono selection:bg-cyan-900 selection:text-white">
      {/* Top Application Navigation Bar */}
      <header className="border-b border-slate-800/90 bg-[#090d16]/90 backdrop-blur sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
              <Cpu className="w-4 h-4 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-sm font-bold text-slate-100 tracking-wider">
                STARNET ORCHESTRATION NODE
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 hidden sm:inline-block">
                GOOGLE AI STUDIO HARNESS
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-2">
              <span>LOCAL-FIRST AGENT RUNTIME</span>
              <span>•</span>
              <span className="text-emerald-400">ZERO PRIVILEGE ESCALATION</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Audio Synthesis Toggle */}
          <button
            onClick={() => {
              const next = audioSynth.toggle();
              setAudioEnabled(next);
            }}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer ${
              audioEnabled
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)]'
                : 'bg-slate-900/80 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={audioEnabled ? 'Audio Synthesis active (click to mute)' : 'Enable procedural Audio Synthesis cues'}
          >
            {audioEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">Audio Synthesis: ON</span>
                <span className="sm:hidden">Audio: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Audio Synthesis: OFF</span>
                <span className="sm:hidden">Audio: OFF</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/60 hover:bg-cyan-900 text-xs font-mono text-cyan-300 transition flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Google AI Studio Node Prompt</span>
            <span className="sm:hidden">Node Prompt</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Living Station Game Overlay Layer */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-300">
                1. LIVING STATION GAME OVERLAY (STARNET ARCHITECTURE)
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                "The layout you draw is the workflow the agents run"
              </span>
            </div>
          </div>

          <StationOverlay
            rooms={rooms}
            hallways={hallways}
            agents={agents}
            currentEvent={currentEvent}
            receipts={receipts}
            unverifiedClaims={unverifiedClaims}
            currentPhase={currentPhase}
            isRunning={isRunning}
            onSelectRoom={(roomId) => setSelectedRoomId(roomId)}
            onSelectReceipt={(rcpt) => setSelectedReceipt(rcpt)}
            onSelectCrate={() => {
              if (receipts.length > 0) setSelectedReceipt(receipts[receipts.length - 1]);
            }}
          />
        </section>

        {/* Orchestration Controls & State Machine HUD */}
        <section>
          <OrchestrationControls
            prompt={prompt}
            setPrompt={setPrompt}
            isRunning={isRunning}
            currentPhase={currentPhase}
            totalCost={totalCost}
            budgetCap={budgetCap}
            setBudgetCap={setBudgetCap}
            executionSpeed={executionSpeed}
            setExecutionSpeed={setExecutionSpeed}
            onRunOrchestration={handleRunOrchestration}
            onReset={handleReset}
            apiKeyConfigured={apiKeyConfigured}
          />
        </section>

        {/* Tabbed Results Navigation */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('overlay')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'overlay'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Deliverables & Verification</span>
              </button>

              <button
                onClick={() => setActiveTab('telemetry')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'telemetry'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Room Utilization Telemetry</span>
                {isRunning && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('stream')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'stream'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Overlay Event Stream JSON</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
              Receipts Sealed: {receipts.length} | Claims Verified: {activeResult?.verification_ledger.filter(c => c.verified).length || 0}
            </div>
          </div>

          {/* Active Tab Panel */}
          {activeTab === 'overlay' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <DeliverablesViewer result={activeResult} />
              <VerificationLedger
                ledger={activeResult?.verification_ledger || []}
                receipts={activeResult?.receipts || []}
                costReport={
                  activeResult?.cost_report || {
                    total_spend: totalCost,
                    budget_cap: budgetCap,
                    per_agent_breakdown: {},
                  }
                }
                onSelectReceipt={(rcpt) => setSelectedReceipt(rcpt)}
              />
            </div>
          ) : activeTab === 'telemetry' ? (
            <RoomUtilizationChart
              rooms={rooms}
              currentPhase={currentPhase}
              currentEvent={currentEvent}
              isRunning={isRunning}
            />
          ) : (
            <OverlayEventStreamViewer
              events={activeResult?.overlay_event_stream || (currentEvent ? [currentEvent] : [])}
              currentEventIndex={currentEventIndex}
              onSelectEventIndex={handleSelectEventIndex}
            />
          )}
        </section>

        {/* Architecture & Product Law Reference Footer */}
        <section className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs font-mono text-slate-400 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase text-[11px]">
            <Info className="w-4 h-4" />
            <span>StarNet Core Product Laws Enforced by This Orchestrator</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-300">
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
              <strong className="text-cyan-300 block mb-0.5">1. Capability-Scoped Rooms:</strong>
              Each agent operates in a strictly defined room with bounded permissions and private workspace. No cross-agent contamination.
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
              <strong className="text-cyan-300 block mb-0.5">2. Authorized Hallways:</strong>
              Handoff lanes only permit message flow between agents whose permissions overlap. Privilege escalation is physically prohibited.
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
              <strong className="text-cyan-300 block mb-0.5">3. State Proof Law:</strong>
              The interface never asserts state the harness cannot prove. Missing tool receipts result in explicit unverified claim flags.
            </div>
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
              <strong className="text-cyan-300 block mb-0.5">4. Real Work, Real Cost:</strong>
              Every execution turn incurs real cryptographic debit. Sub-agent failures are reported honestly, never simulated as artificial successes.
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <GoogleAIStudioPromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />

      <RoomInspectorModal
        room={selectedRoomObj}
        onClose={() => setSelectedRoomId(null)}
      />

      <ReceiptInspectorModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />
    </div>
  );
}
