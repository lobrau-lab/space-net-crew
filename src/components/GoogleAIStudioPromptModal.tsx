import React, { useState } from 'react';
import { STARNET_SYSTEM_PROMPT, STARNET_TOOLS_DECLARATIONS } from '../data/starnetConfig';
import {
  X,
  Copy,
  Check,
  Code2,
  ExternalLink,
  BookOpen,
  Wrench,
  Sparkles,
} from 'lucide-react';

interface GoogleAIStudioPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAIStudioPromptModal: React.FC<GoogleAIStudioPromptModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'tools' | 'guide'>('prompt');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedTools, setCopiedTools] = useState(false);

  if (!isOpen) return null;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(STARNET_SYSTEM_PROMPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyTools = () => {
    navigator.clipboard.writeText(JSON.stringify(STARNET_TOOLS_DECLARATIONS, null, 2));
    setCopiedTools(true);
    setTimeout(() => setCopiedTools(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b101b] border border-cyan-500/50 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="font-heading font-bold text-base text-slate-100 uppercase tracking-wide">
                Google AI Studio Node Configuration
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Production-ready system instructions, tool declarations & integration guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="px-5 py-2.5 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('prompt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                activeTab === 'prompt'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>System Prompt</span>
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                activeTab === 'tools'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Tool Declarations (5 Tools)</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Setup Guide</span>
            </button>
          </div>

          <div>
            {activeTab === 'prompt' && (
              <button
                onClick={handleCopyPrompt}
                className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-500 text-xs font-mono text-cyan-300 hover:bg-cyan-900 transition flex items-center gap-1.5"
              >
                {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPrompt ? 'Copied Prompt' : 'Copy System Instructions'}</span>
              </button>
            )}
            {activeTab === 'tools' && (
              <button
                onClick={handleCopyTools}
                className="px-3 py-1.5 rounded bg-cyan-950 border border-cyan-500 text-xs font-mono text-cyan-300 hover:bg-cyan-900 transition flex items-center gap-1.5"
              >
                {copiedTools ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedTools ? 'Copied Tools' : 'Copy Tools JSON'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs text-slate-300 leading-relaxed bg-[#080d16]">
          {activeTab === 'prompt' && (
            <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-slate-200 whitespace-pre-wrap selection:bg-cyan-900">
              {STARNET_SYSTEM_PROMPT}
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <p className="text-slate-400 text-xs mb-3">
                The 5 required tools specified in the StarNet architecture. These can be defined in Google AI Studio's
                Function Calling tool declarations panel.
              </p>
              <pre className="bg-slate-950 rounded-lg p-4 border border-slate-800 text-cyan-300/90 whitespace-pre-wrap selection:bg-cyan-900 overflow-x-auto">
                {JSON.stringify(STARNET_TOOLS_DECLARATIONS, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs font-mono text-slate-300">
              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <h3 className="font-heading font-bold text-sm text-cyan-300 mb-2 uppercase">
                  1. Paste into Google AI Studio
                </h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
                  <li>Open <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">aistudio.google.com</a> and click <strong>Create Prompt</strong>.</li>
                  <li>In the <strong>System Instructions</strong> text field, paste the full System Prompt from the first tab.</li>
                  <li>Select model <strong>Gemini 2.5 Flash</strong>, <strong>Gemini 2.5 Pro</strong>, or <strong>Gemini 3.8 Flash</strong>.</li>
                  <li>Under <strong>Tools</strong>, enable Function Calling and add the 5 tool schemas.</li>
                </ol>
              </div>

              <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800">
                <h3 className="font-heading font-bold text-sm text-cyan-300 mb-2 uppercase">
                  2. Connecting the Living Game Overlay Layer
                </h3>
                <p className="text-slate-300 leading-relaxed mb-2">
                  The StarNet game overlay consumes the <strong>Overlay Event Stream</strong> JSON produced by the orchestration node.
                  Each delegation event maps to station visuals:
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold">room_id:</span> Lights up specialist room tile.
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold">agent_class:</span> Animates pixel agent sprite walk cycle.
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold">phase: route:</span> Draws energized hallway corridor beam.
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold">phase: monitor:</span> Triggers thought bubbles & progress bar.
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-cyan-400 font-bold">receipt_ref:</span> Spawns deliverable crate in OUTBOX.
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-red-400 font-bold">unverified_claims:</span> Triggers red security warning overlay.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
