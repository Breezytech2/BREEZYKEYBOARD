import React, { memo } from "react";
import { motion } from "motion/react";
import { Mic } from "lucide-react";
import { SupportedLanguage } from "../../types";
import { LANGUAGES } from "../../data";

interface VoiceTabProps {
  voiceLang: SupportedLanguage;
  setVoiceLang: (lang: SupportedLanguage) => void;
  removeFillerWords: boolean;
  setRemoveFillerWords: (val: boolean) => void;
  isRecording: boolean;
  startRecording: () => void;
  voiceTranscript: string;
  voiceCleanupLoading: boolean;
  handleInsertTranscript: () => void;
  handleVoiceCleanup: () => Promise<void>;
  voiceResult: { cleanedText: string; summary: string } | null;
}

export const VoiceTab = memo(({
  voiceLang,
  setVoiceLang,
  removeFillerWords,
  setRemoveFillerWords,
  isRecording,
  startRecording,
  voiceTranscript,
  voiceCleanupLoading,
  handleInsertTranscript,
  handleVoiceCleanup,
  voiceResult
}: VoiceTabProps) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="w-full bg-slate-900/90 backdrop-blur-3xl border-b border-white/20 p-3 flex flex-col space-y-3 shadow-inner"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase tracking-tight">
          <Mic className="w-4 h-4 text-rose-400" />
          <span>Glass Voice Transcription Cleanup</span>
        </span>
        <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
          {(["en", "sw", "es"] as SupportedLanguage[]).map(l => (
            <button
              key={l}
              onClick={() => setVoiceLang(l)}
              className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md transition-all uppercase ${voiceLang === l ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
            >
              {LANGUAGES[l].name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/15">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-white">Remove Filler Words</span>
          <span className="text-[8.5px] text-white/60">Auto-strip "um", "like", "basically" before insertion</span>
        </div>
        <button
          onClick={() => setRemoveFillerWords(!removeFillerWords)}
          className={`w-8 h-4.5 rounded-full p-0.5 transition-colors shadow-inner flex items-center ${removeFillerWords ? "bg-cyan-500/50" : "bg-black/40 border border-white/10"}`}
        >
          <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform shadow-sm ${removeFillerWords ? "translate-x-3.5" : "translate-x-0"}`} />
        </button>
      </div>

      <div className="flex items-center space-x-3 bg-black/30 p-3 rounded-2xl border border-white/10 shadow-inner">
        <button
          onClick={isRecording ? () => {} : startRecording}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg shrink-0 border-2 ${isRecording ? "bg-rose-600 border-rose-400 animate-pulse text-white scale-110 shadow-rose-500/40" : "bg-white/10 hover:bg-white/20 border-white/20 text-white"}`}
        >
          <Mic className="w-6 h-6" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[9px] text-white/50 uppercase font-black tracking-widest mb-0.5">
            {isRecording ? "Capturing audio..." : "Tap mic to dictate"}
          </div>
          <div className="text-xs text-white truncate font-medium bg-black/20 px-2 py-1 rounded border border-white/5">
            {voiceTranscript || "Awaiting voice..."}
          </div>
        </div>
        {voiceTranscript && voiceTranscript !== "Listening..." && (
          <div className="flex space-x-1.5 shrink-0">
            <button
              onClick={handleInsertTranscript}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-[10px] font-bold shadow-md transition-all active:scale-95"
            >
              Insert
            </button>
            <button
              onClick={handleVoiceCleanup}
              disabled={voiceCleanupLoading}
              className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black border border-cyan-400/30 rounded-lg text-[10px] font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              {voiceCleanupLoading ? "Fixing..." : "AI FIX"}
            </button>
          </div>
        )}
      </div>

      {voiceResult && (
        <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex flex-col space-y-2 backdrop-blur-md shadow-lg">
          <div>
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-1 block">Cleaned Dictation</span>
            <p className="text-[11px] text-white leading-relaxed">{voiceResult.cleanedText}</p>
          </div>
          <div className="border-t border-white/10 pt-2 mt-1">
            <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1 block">Intelligence Summary</span>
            <p className="text-[10px] text-white/80 italic leading-snug">"{voiceResult.summary}"</p>
          </div>
        </div>
      )}
    </motion.div>
  );
});

VoiceTab.displayName = "VoiceTab";
