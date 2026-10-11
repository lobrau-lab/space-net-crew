import React, { useState } from 'react';
import { SAMPLE_BENCHMARKS } from '../data/starnetConfig';
import { OrchestrationPhase } from '../types/starnet';
import {
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  DollarSign,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sliders,
} from 'lucide-react';

interface OrchestrationControlsProps {
  prompt: string;
  setPrompt: (val: string) => void;
  isRunning: boolean;
  currentPhase: OrchestrationPhase | null;
  totalCost: number;
  budgetCap: number;
  setBudgetCap: (val: number) => void;
  executionSpeed: number;
  setExecutionSpeed: (val: number) => void;
  onRunOrchestration: () => void;
  onReset: () => void;
  apiKeyConfigured: boolean;
}

const PHASES: { id: OrchestrationPhase; label: string; desc: string }[] = [
  { id: 'receive', label: '1. RECEIVE', desc: 'Log Station Entry' },
  { id: 'decompose', label: '2. DECOMPOSE', desc: 'Bounded Sub-tasks' },
  { id: 'route', label: '3. ROUTE', desc: 'Authorized Hallways' },
  { id: 'monitor', label: '4. MONITOR', desc: 'Task Brief & Execution' },
  { id: 'synthesize', label: '5. SYNTHESIZE', desc: 'Source Attribution' },
  { id: 'verify', label: '6. VERIFY', desc: 'Receipts vs Claims' },
];

export const OrchestrationControls: React.FC<OrchestrationControlsProps> = ({
  prompt,
  setPrompt,
  isRunning,
  currentPhase,
  totalCost,
  budgetCap,
  setBudgetCap,
  executionSpeed,
  setExecutionSpeed,
  onRunOrchestration,
  onReset,
  apiKeyConfigured,
}) => {
  const [selectedBenchmarkId, setSelectedBenchmarkId] = useState<string>('benchmark_agent_harnesses');

  const handleSelectBenchmark = (bench: typeof SAMPLE_BENCHMARKS[0]) => {
    setSelectedBenchmarkId(bench.id);
    setPrompt(bench.prompt);
  };

  const getPhaseIndex = (phase: OrchestrationPhase | null) => {
    if (!phase) return -1;
    return PHASES.findIndex((p) => p.id === phase);
  };

  const currentPhaseIdx = getPhaseIndex(currentPhase);

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-5 shadow-xl">
      {/* Benchmark Presets Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Benchmark or Custom Request:</span>
          </label>
          <span className="text-[11px] font-mono text-cyan-400">
            {apiKeyConfigured ? '⚡ Server Gemini 3.8 Flash Active' : '⚙️ High-Fidelity StarNet Engine'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {SAMPLE_BENCHMARKS.map((bench) => {
            const isSelected = selectedBenchmarkId === bench.id && prompt === bench.prompt;
            return (
              <button
                key={bench.id}
                type="button"
                onClick={() => handleSelectBenchmark(bench)}
                className={`text-left p-2.5 rounded-lg border text-xs transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 text-cyan-100 ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-heading font-bold truncate text-[11px] text-slate-200">
                      {bench.title}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {bench.badge}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {bench.prompt}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Task Input Box */}
      <div className="mb-4">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isRunning}
            rows={3}
            placeholder="Enter request for StarNet central orchestration node..."
            className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none disabled:opacity-60 placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Constraints & Execution Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
        {/* Budget Cap */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-amber-400" />
              Budget Cap:
            </span>
            <span className="text-amber-400 font-bold">${budgetCap.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.10"
            max="1.50"
            step="0.05"
            value={budgetCap}
            onChange={(e) => setBudgetCap(parseFloat(e.target.value))}
            disabled={isRunning}
            className="w-full accent-amber-400 cursor-pointer h-1.5 bg-slate-800 rounded"
          />
        </div>

        {/* Real Work, Real Cost Ticker */}
        <div className="flex flex-col justify-center px-2 border-l border-slate-800/60">
          <span className="text-[10px] font-mono text-slate-500 uppercase">REAL SPEND DEBIT:</span>
          <span className="text-sm font-mono font-bold text-emerald-400">
            ${totalCost.toFixed(4)}{' '}
            <span className="text-[10px] text-slate-500 font-normal">/ ${budgetCap.toFixed(2)}</span>
          </span>
        </div>

        {/* Replay / Animation Speed */}
        <div className="flex flex-col gap-1 border-l border-slate-800/60 pl-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-cyan-400" />
              Speed:
            </span>
            <span className="text-cyan-400 font-bold">{executionSpeed}x</span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 4, 10].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setExecutionSpeed(s)}
                className={`flex-1 py-0.5 text-[10px] font-mono rounded border transition ${
                  executionSpeed === s
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {s === 10 ? 'MAX' : `${s}x`}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRunOrchestration}
            disabled={isRunning || !prompt.trim()}
            className="flex-1 py-2 px-3 rounded-lg font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition shadow-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isRunning ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-slate-950" />
                <span>Running Node...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Dispatch Run</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            disabled={isRunning}
            className="p-2 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            title="Reset Station State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* State Machine Flow Indicator */}
      <div className="pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-2">
          <span>STARNET STATE MACHINE PROGRESSION</span>
          <span>Zero Escalation Enforced</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
          {PHASES.map((p, idx) => {
            const isCompleted = currentPhaseIdx > idx;
            const isCurrent = currentPhaseIdx === idx;
            return (
              <div
                key={p.id}
                className={`p-2 rounded border text-left flex flex-col justify-between transition-all duration-300 ${
                  isCurrent
                    ? 'border-cyan-400 bg-cyan-950/60 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                    : isCompleted
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200'
                    : 'border-slate-800/80 bg-slate-950/40 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span
                    className={`font-mono text-[10px] font-bold ${
                      isCurrent
                        ? 'text-cyan-300'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-slate-500'
                    }`}
                  >
                    {p.label}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  ) : null}
                </div>
                <span className="text-[9px] font-mono text-slate-400 truncate">{p.desc}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
