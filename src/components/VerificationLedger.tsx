import React, { useState } from 'react';
import { ClaimVerification, ToolReceipt } from '../types/starnet';
import {
  ShieldCheck,
  ShieldAlert,
  Hash,
  DollarSign,
  FileCheck2,
  ExternalLink,
  Cpu,
  Layers,
} from 'lucide-react';

interface VerificationLedgerProps {
  ledger: ClaimVerification[];
  receipts: ToolReceipt[];
  costReport: {
    total_spend: number;
    budget_cap: number;
    per_agent_breakdown: Record<string, number>;
  };
  onSelectReceipt: (receipt: ToolReceipt) => void;
}

export const VerificationLedger: React.FC<VerificationLedgerProps> = ({
  ledger,
  receipts,
  costReport,
  onSelectReceipt,
}) => {
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(null);

  const getReceiptForClaim = (receiptRef: string | null) => {
    if (!receiptRef) return null;
    return receipts.find((r) => r.receipt_id === receiptRef) || null;
  };

  const verifiedCount = ledger.filter((c) => c.verified).length;
  const unverifiedCount = ledger.length - verifiedCount;

  return (
    <div className="bg-[#0b101b] border border-slate-800 rounded-xl p-5 shadow-xl">
      {/* Verification Ledger Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wide">
            3. Verification Ledger (Claims vs Receipts)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{verifiedCount} VERIFIED</span>
          </span>
          {unverifiedCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              <span>{unverifiedCount} UNVERIFIED</span>
            </span>
          )}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left font-mono text-xs border border-slate-800 rounded-lg overflow-hidden">
          <thead className="bg-slate-900/90 text-slate-400 text-[11px] border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">CLAIM STATEMENT</th>
              <th className="py-2.5 px-3">SOURCE AGENT</th>
              <th className="py-2.5 px-3">ROOM</th>
              <th className="py-2.5 px-3">RECEIPT REF (SHA256)</th>
              <th className="py-2.5 px-3 text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-950/60">
            {ledger.map((item) => {
              const rcpt = getReceiptForClaim(item.receipt_ref);
              return (
                <tr
                  key={item.claim_id}
                  className={`hover:bg-slate-900/50 transition ${
                    !item.verified ? 'bg-red-950/20' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 text-slate-200 max-w-sm">
                    <span className="font-medium">{item.claim}</span>
                  </td>
                  <td className="py-2.5 px-3 text-cyan-300 uppercase font-semibold">
                    {item.source_agent}
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                    {item.room_id}
                  </td>
                  <td className="py-2.5 px-3">
                    {item.receipt_ref && rcpt ? (
                      <button
                        onClick={() => onSelectReceipt(rcpt)}
                        className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <Hash className="w-3 h-3" />
                        <span>{rcpt.sha256_hash}</span>
                      </button>
                    ) : (
                      <span className="text-red-400 italic text-[11px]">
                        Null (Unverified)
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    {item.verified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-bold text-[11px] px-2 py-0.5 rounded bg-red-950/60 border border-red-800 animate-pulse">
                        <ShieldAlert className="w-3 h-3" /> UNVERIFIED
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Cost Report (Total spend & per-agent breakdown) */}
      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="font-heading font-bold text-sm text-slate-100 uppercase tracking-wide">
              4. Cost Report (Real Spend Ledger)
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            <span>TOTAL EXPENDITURE: </span>
            <span className="text-emerald-400 font-bold text-sm">
              ${costReport.total_spend.toFixed(4)}
            </span>
            <span className="text-slate-500"> / Budget Cap: ${costReport.budget_cap.toFixed(2)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {Object.entries(costReport.per_agent_breakdown).map(([agent, spend]) => (
            <div
              key={agent}
              className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-col justify-between"
            >
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold truncate">
                Agent: {agent}
              </span>
              <span className="text-sm font-mono font-bold text-slate-200 mt-1">
                ${spend.toFixed(4)}
              </span>
              <div className="w-full bg-slate-950 h-1 rounded mt-1 overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded"
                  style={{
                    width: `${Math.min(100, (spend / (costReport.total_spend || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
