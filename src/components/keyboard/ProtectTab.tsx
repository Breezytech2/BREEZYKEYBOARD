import React, { memo } from "react";
import { motion } from "motion/react";
import { FolderLock, ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { ProtectReport } from "../../types";

interface ProtectTabProps {
  protectReport: ProtectReport | null;
  protectLoading: boolean;
  handleProtectScan: () => Promise<void>;
}

export const ProtectTab = memo(({
  protectReport,
  protectLoading,
  handleProtectScan
}: ProtectTabProps) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="w-full bg-slate-900/90 backdrop-blur-3xl border-b border-white/20 p-3 flex flex-col space-y-3 shadow-inner"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase tracking-tight">
          <FolderLock className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Glass Protect Shield</span>
        </span>
        <button
          onClick={handleProtectScan}
          disabled={protectLoading}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-[10px] font-black tracking-widest uppercase active:scale-95 transition-all shadow-lg shadow-black/20"
        >
          {protectLoading ? "Scanning..." : "Scan Message"}
        </button>
      </div>

      {!protectReport && !protectLoading && (
        <div className="text-center py-4 text-white/50 text-[11px] bg-black/20 rounded-xl border border-dashed border-white/10 shadow-inner px-4 leading-relaxed italic">
          Audit your text for password leaks, PII exposure, and fraudulent triggers before sending.
        </div>
      )}

      {protectLoading && (
        <div className="flex items-center justify-center py-5 space-x-2.5 bg-black/20 rounded-xl border border-white/10 shadow-inner">
          <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-sm" />
          <span className="text-xs text-white/90 font-bold uppercase tracking-widest font-mono">Auditing draft...</span>
        </div>
      )}

      {protectReport && (
        <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col space-y-2.5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/60 uppercase font-black tracking-widest">Audit Results</span>
            <div className="flex items-center space-x-1">
              {protectReport.isSafe ? (
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded-lg flex items-center space-x-1 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SECURE</span>
                </span>
              ) : (
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 text-[10px] font-black rounded-lg flex items-center space-x-1 border border-rose-500/30 animate-pulse">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>RISK FOUND</span>
                </span>
              )}
            </div>
          </div>

          {protectReport.warnings.map((w, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-[11px] text-white/90 bg-black/20 p-2 rounded-lg border border-white/5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{w}</span>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-3 text-[10px] border-t border-white/10 pt-2 font-mono">
            <div>
              <span className="text-white/40 block font-bold uppercase tracking-tighter mb-0.5">PII Exposure:</span>
              <span className="text-white font-black truncate block">
                {protectReport.piiDetected.length > 0 ? protectReport.piiDetected.join(", ") : "CLEAN"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-white/40 block font-bold uppercase tracking-tighter mb-0.5">Scam Vector:</span>
              <span className={`font-black uppercase ${protectReport.scamProbability === "high" ? "text-rose-400" : protectReport.scamProbability === "medium" ? "text-amber-400" : "text-emerald-400"}`}>
                {protectReport.scamProbability}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
});

ProtectTab.displayName = "ProtectTab";
