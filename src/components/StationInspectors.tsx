import React from 'react';
import { StationRoom, ToolReceipt } from '../types/starnet';
import {
  X,
  Lock,
  FileCode,
  ShieldCheck,
  Hash,
  DollarSign,
  Package,
  Layers,
  Terminal,
  Sparkles,
} from 'lucide-react';

interface RoomInspectorProps {
  room: StationRoom | null;
  onClose: () => void;
  onTriggerSpark?: (roomId: string) => void;
}

export const RoomInspectorModal: React.FC<RoomInspectorProps> = ({ room, onClose, onTriggerSpark }) => {
  if (!room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b101b] border border-cyan-500/50 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: room.color, boxShadow: `0 0 8px ${room.color}` }}
            />
            <span className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wide">
              {room.name} // Room Inspection
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Identity & Scope */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              ROLE & PRINCIPLES
            </span>
            <div className="text-slate-200 text-xs font-semibold mb-1">{room.role}</div>
            <div className="text-slate-400 text-[11px] leading-relaxed">
              "A room is a capability-scoped team with a defined room, bounded permission set, and
              private workspace. Zero lateral privilege escalation."
            </div>
          </div>

          {/* Allowed Capability Grant */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
              BOUNDED CAPABILITY GRANT (ROOM TOOLS)
            </span>
            <div className="flex flex-wrap gap-1.5">
              {room.allowed_capabilities.map((cap) => (
                <span
                  key={cap}
                  className="px-2 py-1 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-[10px] flex items-center gap-1"
                >
                  <Lock className="w-2.5 h-2.5" />
                  <span>{cap}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Private Workspace Isolation */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-2">
              PRIVATE WORKSPACE FILES
            </span>
            <div className="space-y-1.5">
              {room.workspace_files.map((file, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-slate-200">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                    <span>{file.size}</span>
                    <span className="text-emerald-400">{file.hash}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action: Trigger Visual Success Spark */}
          {onTriggerSpark && (
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  onTriggerSpark(room.id);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-950 border border-emerald-500/70 hover:bg-emerald-900 text-emerald-300 font-bold flex items-center gap-1.5 transition text-xs shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Trigger Visual Success Spark</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface ReceiptInspectorProps {
  receipt: ToolReceipt | null;
  onClose: () => void;
}

export const ReceiptInspectorModal: React.FC<ReceiptInspectorProps> = ({ receipt, onClose }) => {
  if (!receipt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#0b101b] border border-cyan-500/50 rounded-xl w-full max-w-xl shadow-2xl overflow-hidden font-mono text-xs">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-cyan-400" />
            <span className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wide">
              Cryptographic Tool Receipt // Proof Details
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* SHA256 Verification Badge */}
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-[10px] text-emerald-400 font-bold block uppercase">
                  CRYPTOGRAPHIC RECEIPT VERIFIED
                </span>
                <span className="text-xs text-emerald-200 font-bold">{receipt.sha256_hash}</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900 text-emerald-300">
              STARNET SEAL
            </span>
          </div>

          {/* Details Table */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">RECEIPT ID:</span>
              <span className="text-cyan-300">{receipt.receipt_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">AGENT CLASS:</span>
              <span className="text-slate-200 uppercase font-semibold">{receipt.agent_class}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">ROOM ID:</span>
              <span className="text-slate-200">{receipt.room_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TOOL EXECUTED:</span>
              <span className="text-emerald-400 font-bold">{receipt.tool_name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">TIMESTAMP:</span>
              <span className="text-slate-300">{receipt.timestamp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">DEBIT COST:</span>
              <span className="text-amber-400 font-bold">${receipt.cost_usd.toFixed(4)} USD</span>
            </div>
          </div>

          {/* Parameters Payload */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              TOOL INPUT PARAMETERS
            </span>
            <pre className="p-2.5 rounded bg-slate-950 text-slate-300 text-[10px] overflow-x-auto border border-slate-800">
              {JSON.stringify(receipt.parameters, null, 2)}
            </pre>
          </div>

          {/* Output Summary */}
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
              EXECUTION DELIVERABLE SUMMARY
            </span>
            <p className="text-slate-200 text-xs leading-relaxed">{receipt.output_summary}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
