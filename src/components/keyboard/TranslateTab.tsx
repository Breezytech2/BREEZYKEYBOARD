import React, { memo } from "react";
import { motion } from "motion/react";
import { Languages } from "lucide-react";

interface TranslateTabProps {
  transToLang: string;
  setTransToLang: (lang: string) => void;
  isTranslateOnTypeActive: boolean;
  setIsTranslateOnTypeActive: (val: boolean) => void;
  translateLoading: boolean;
  triggerTranslationOnType: () => Promise<void>;
  handleAIClick: (action: string) => Promise<void>;
}

export const TranslateTab = memo(({
  transToLang,
  setTransToLang,
  isTranslateOnTypeActive,
  setIsTranslateOnTypeActive,
  translateLoading,
  triggerTranslationOnType,
  handleAIClick
}: TranslateTabProps) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="w-full bg-slate-900/90 backdrop-blur-3xl border-b border-white/20 p-3 flex flex-col space-y-3 shadow-inner"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase tracking-tight">
          <Languages className="w-4 h-4 text-cyan-400" />
          <span>Glass Translate Tool</span>
        </span>
        <div className="flex items-center space-x-2 bg-white/5 px-2 py-1 rounded-lg border border-white/10">
          <span className="text-[9px] text-white/50 font-black uppercase tracking-widest">To:</span>
          <select
            value={transToLang}
            onChange={(e) => setTransToLang(e.target.value)}
            className="bg-transparent text-[10px] text-white font-bold focus:outline-none cursor-pointer"
          >
            <option value="English">English</option>
            <option value="Swahili">Swahili</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="Kikuyu">Kikuyu</option>
            <option value="German">German</option>
            <option value="Japanese">Japanese</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between bg-black/20 p-3 rounded-2xl border border-white/10 backdrop-blur-md shadow-inner">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">Translate while typing</span>
          <span className="text-[9px] text-white/50 leading-tight">Converts sentences when you hit space</span>
        </div>
        <button
          onClick={() => setIsTranslateOnTypeActive(!isTranslateOnTypeActive)}
          className={`w-10 h-5.5 rounded-full p-0.5 transition-colors shadow-inner flex items-center ${isTranslateOnTypeActive ? "bg-cyan-500/50" : "bg-white/10 border border-white/10"}`}
        >
          <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-sm transition-transform ${isTranslateOnTypeActive ? "translate-x-4.5" : "translate-x-0"}`} />
        </button>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={triggerTranslationOnType}
          disabled={translateLoading}
          className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black tracking-widest uppercase shadow-md border border-white/20 active:scale-95 transition-all disabled:opacity-50"
        >
          {translateLoading ? "Translating..." : "Translate Draft"}
        </button>
        <button
          onClick={() => handleAIClick("explain")}
          className="px-4 py-2 bg-black/40 hover:bg-black/60 text-white border border-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-inner active:scale-95 transition-all"
        >
          Explain
        </button>
      </div>
    </motion.div>
  );
});

TranslateTab.displayName = "TranslateTab";
