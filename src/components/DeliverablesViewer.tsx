import React, { useState } from 'react';
import { OrchestrationResult } from '../types/starnet';
import {
  FileText,
  Copy,
  Check,
  ShieldAlert,
  Download,
  Terminal,
  ExternalLink,
  Code2,
  FileCheck,
} from 'lucide-react';

interface DeliverablesViewerProps {
  result: OrchestrationResult | null;
}

export const DeliverablesViewer: React.FC<DeliverablesViewerProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [activeFileTab, setActiveFileTab] = useState<number>(0);

  if (!result) {
    return (
      <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-8 text-center text-slate-500 font-mono text-xs flex flex-col items-center justify-center min-h-[300px]">
        <FileText className="w-8 h-8 text-slate-700 mb-2" />
        <span>No deliverables synthesized yet.</span>
        <span className="text-[11px] text-slate-600 mt-1">
          Execute a station run above to decompose tasks, route specialist agents, and verify artifacts.
        </span>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result.deliverables);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hasUnverified = result.unverified_claims && result.unverified_claims.length > 0;

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
      {/* Red Warning Overlay if unverified claims exist (StarNet Harness Law) */}
      {hasUnverified && (
        <div className="mb-4 p-3.5 rounded-lg border border-red-500/80 bg-red-950/40 text-red-200 text-xs font-mono flex items-start gap-3 shadow-lg">
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <div className="font-bold uppercase tracking-wider text-red-300 mb-1 flex items-center gap-2">
              <span>UNVERIFIED CLAIM WARNING (HARNESS LAW VIOLATION GUARD)</span>
              <span className="text-[10px] bg-red-900 px-1.5 py-0.2 rounded border border-red-500">
                PROVE OR MARK
              </span>
            </div>
            <p className="text-[11px] text-red-200/90 leading-relaxed mb-2">
              The interface must never assert state the harness cannot prove. The following claims
              lack cryptographic tool execution receipts:
            </p>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-red-300 font-medium">
              {result.unverified_claims.map((claim, idx) => (
                <li key={idx}>{claim}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Station Summary (Output requirement 1) */}
      <div className="mb-5 p-3.5 rounded-lg bg-slate-900/80 border border-slate-800">
        <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1 flex items-center justify-between">
          <span>1. STATION SUMMARY // ORCHESTRATION REPORT</span>
          <span className="text-slate-500 text-[9px]">ID: {result.orchestration_id}</span>
        </div>
        <p className="text-xs font-mono text-slate-200 leading-relaxed">
          {result.station_summary}
        </p>
      </div>

      {/* Deliverable Header & Action Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wide">
            2. Synthesized Deliverables
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800">
            Source Attributed
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-slate-300 hover:text-cyan-300 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Artifact'}</span>
          </button>
        </div>
      </div>

      {/* Deliverable Content Display */}
      <div className="bg-slate-950 rounded-lg border border-slate-800/90 p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed max-h-[460px] overflow-y-auto">
        <div className="whitespace-pre-wrap selection:bg-cyan-900 selection:text-cyan-100">
          {result.deliverables}
        </div>
      </div>

      {/* Deliverable Files metadata bar */}
      {result.deliverable_files && result.deliverable_files.length > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">OUTBOX FILE:</span>
            <span className="text-cyan-400 font-bold">{result.deliverable_files[0]?.name}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-500">AUTHORED BY:</span>
            <span className="text-slate-300 uppercase">{result.deliverable_files[0]?.author}</span>
          </div>
          <div className="text-emerald-400 font-bold flex items-center gap-1">
            <span>SEAL: {result.deliverable_files[0]?.receipt_ref}</span>
          </div>
        </div>
      )}
    </div>
  );
};
