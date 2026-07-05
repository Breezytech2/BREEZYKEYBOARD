import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, MessageSquare, Cpu, Send, Check, AlertTriangle, RefreshCw } from "lucide-react";

interface AITabProps {
  aiMode: "tools" | "chat";
  setAiMode: (mode: "tools" | "chat") => void;
  aiAction: string;
  setAiAction: (action: string) => void;
  aiOutput: string;
  aiLoading: boolean;
  thinkingMode: boolean;
  setThinkingMode: (mode: boolean) => void;
  aiCustomPrompt: string;
  setAiCustomPrompt: (prompt: string) => void;
  aiSelectedTone: string;
  setAiSelectedTone: (tone: string) => void;
  chatHistory: { role: "user" | "ai"; text: string }[];
  chatInput: string;
  setChatInput: (input: string) => void;
  aiWarning: string | null;
  handleAIClick: (action: string) => Promise<void>;
  handleChatSubmit: () => Promise<void>;
  onInputChange: (text: string) => void;
  triggerVibration: () => void;
}

export const AITab = memo(({
  aiMode,
  setAiMode,
  aiAction,
  setAiAction,
  aiOutput,
  aiLoading,
  thinkingMode,
  setThinkingMode,
  aiCustomPrompt,
  setAiCustomPrompt,
  aiSelectedTone,
  setAiSelectedTone,
  chatHistory,
  chatInput,
  setChatInput,
  aiWarning,
  handleAIClick,
  handleChatSubmit,
  onInputChange,
  triggerVibration
}: AITabProps) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="w-full bg-slate-900/90 backdrop-blur-3xl border-b border-white/20 p-3 flex flex-col space-y-3 max-h-64 overflow-y-auto no-scrollbar shadow-inner"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-bold text-white tracking-tight uppercase">Glass AI Engine</span>
        </div>
        <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
          <button
            onClick={() => setAiMode("tools")}
            className={`px-2.5 py-0.5 text-[9px] font-bold rounded-md transition-all ${aiMode === "tools" ? "bg-white text-black shadow-sm" : "text-white/60 hover:text-white"}`}
          >
            Tools
          </button>
          <button
            onClick={() => setAiMode("chat")}
            className={`px-2.5 py-0.5 text-[9px] font-bold rounded-md transition-all ${aiMode === "chat" ? "bg-white text-black shadow-sm" : "text-white/60 hover:text-white"}`}
          >
            Chat
          </button>
        </div>
      </div>

      {aiMode === "tools" ? (
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: "rewrite", label: "Rewrite", icon: Sparkles },
              { id: "grammar", label: "Grammar", icon: Check },
              { id: "summarize", label: "Brief", icon: RefreshCw },
              { id: "custom", label: "Magic", icon: Sparkles }
            ].map(tool => (
              <button
                key={tool.id}
                onClick={() => setAiAction(tool.id)}
                className={`flex flex-col items-center justify-center py-2 rounded-xl border transition-all ${aiAction === tool.id ? "bg-cyan-500/20 border-cyan-400/50 text-white" : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"}`}
              >
                <tool.icon className="w-3.5 h-3.5 mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">{tool.label}</span>
              </button>
            ))}
          </div>

          <div className="bg-black/20 p-2.5 rounded-xl border border-white/10 space-y-2 shadow-inner">
            {aiAction === "rewrite" && (
              <div className="flex items-center space-x-1.5">
                <span className="text-[10px] text-white/50 uppercase font-mono">Tone:</span>
                <div className="flex space-x-1 overflow-x-auto no-scrollbar">
                  {["professional", "casual", "witty", "friendly", "concise", "formal"].map(tone => (
                    <button
                      key={tone}
                      onClick={() => setAiSelectedTone(tone)}
                      className={`px-2 py-0.5 rounded-full text-[9px] border transition-all ${aiSelectedTone === tone ? "bg-white/20 border-white/40 text-white" : "bg-white/5 border-white/10 text-white/40"}`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {aiAction === "custom" && (
              <input
                type="text"
                placeholder="What should the AI do? (e.g. Write a poem, Fix Swahili)"
                value={aiCustomPrompt}
                onChange={(e) => setAiCustomPrompt(e.target.value)}
                className="w-full bg-black/40 text-[10px] text-white p-2 rounded-lg border border-white/10 focus:outline-none focus:border-cyan-500/40"
              />
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setThinkingMode(!thinkingMode)}
                className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full border transition-all ${thinkingMode ? "bg-amber-500/10 border-amber-500/30 text-amber-300" : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"}`}
              >
                <Cpu className={`w-3 h-3 ${thinkingMode ? "animate-pulse" : ""}`} />
                <span className="text-[8.5px] font-bold uppercase tracking-widest">Deep Thinking</span>
              </button>

              <button
                onClick={() => handleAIClick(aiAction)}
                disabled={aiLoading}
                className="px-4 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black text-[10px] font-black rounded-lg transition-all active:scale-95 shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                {aiLoading ? "Processing..." : "Generate Magic"}
              </button>
            </div>
          </div>

          {aiOutput && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20 text-[11px] text-white leading-relaxed italic shadow-inner">
                {aiOutput}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => { onInputChange(aiOutput); triggerVibration(); }}
                  className="flex-1 py-1.5 bg-white/20 text-white rounded-lg text-[10px] font-bold border border-white/20 active:scale-95 transition-all"
                >
                  Apply Changes
                </button>
                <button
                  onClick={() => handleAIClick(aiAction)}
                  className="px-3 py-1.5 bg-black/20 text-white rounded-lg text-[10px] font-bold border border-white/10 active:scale-95 transition-all"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-48 bg-black/20 rounded-2xl border border-white/10 overflow-hidden shadow-inner">
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 no-scrollbar">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-2 rounded-xl text-[10.5px] leading-tight ${msg.role === "user" ? "bg-white/10 text-white border border-white/20 rounded-tr-none" : "bg-cyan-500/10 text-cyan-50 border border-cyan-500/20 rounded-tl-none"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-2 border-t border-white/10 bg-black/20 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Ask Breezy AI anything..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleChatSubmit()}
              className="flex-1 bg-white/5 text-[10px] text-white px-3 py-1.5 rounded-full border border-white/10 focus:outline-none focus:border-cyan-500/30"
            />
            <button onClick={handleChatSubmit} disabled={aiLoading || !chatInput} className="w-8 h-8 rounded-full bg-cyan-500 text-black flex items-center justify-center hover:bg-cyan-400 transition-all active:scale-90 disabled:opacity-50">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {aiWarning && (
        <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start space-x-1.5 text-[9px] text-amber-200">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <span>{aiWarning}</span>
        </div>
      )}
    </motion.div>
  );
});

AITab.displayName = "AITab";
