import React, { useState } from 'react';
import { DelegationContractEvent } from '../types/starnet';
import {
  Code,
  Copy,
  Check,
  Download,
  Play,
  ArrowRight,
  Database,
  Terminal,
} from 'lucide-react';

interface OverlayEventStreamViewerProps {
  events: DelegationContractEvent[];
  currentEventIndex: number;
  onSelectEventIndex: (idx: number) => void;
}

export const OverlayEventStreamViewer: React.FC<OverlayEventStreamViewerProps> = ({
  events,
  currentEventIndex,
  onSelectEventIndex,
}) => {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(events, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `starnet_overlay_stream_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wide">
            5. Overlay Event Stream (Game Layer Ingest)
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            {events.length} EVENTS
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-slate-300 hover:text-cyan-300 transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-mono text-slate-300 hover:text-cyan-300 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Stream</span>
          </button>
        </div>
      </div>

      {/* Event Timeline Scrubber */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
          <span>EVENT SCRUBBER: Click to replay state on Game Overlay</span>
          <span>
            {currentEventIndex + 1} / {events.length || 1}
          </span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {events.map((ev, idx) => {
            const isSelected = currentEventIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => onSelectEventIndex(idx)}
                className={`px-2.5 py-1.5 rounded text-[10px] font-mono uppercase whitespace-nowrap border transition ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md ring-2 ring-cyan-400/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600 hover:text-slate-200'
                }`}
              >
                #{idx + 1} {ev.phase}
              </button>
            );
          })}
        </div>
      </div>

      {/* JSON Viewer with Syntax Styling */}
      <div className="bg-slate-950 rounded-lg border border-slate-800/90 p-4 font-mono text-xs text-cyan-300/90 overflow-x-auto max-h-[380px] overflow-y-auto leading-relaxed">
        <pre className="selection:bg-cyan-900 selection:text-white">
          {jsonString}
        </pre>
      </div>

      <div className="mt-3 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>Contract: StarNet Structured Delegation Schema</span>
        <span>Target: Living Station Overlay Engine</span>
      </div>
    </div>
  );
};
