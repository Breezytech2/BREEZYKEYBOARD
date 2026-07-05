import React, { useState, memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { History, Search, Pin, Heart, Eye, Trash2, X } from "lucide-react";
import { ClipboardItem } from "../../types";

interface ProductivityHubProps {
  hubTab: "clipboard" | "replies" | "prompts";
  setHubTab: (tab: "clipboard" | "replies" | "prompts") => void;
  clipboardItems: ClipboardItem[];
  setClipboardItems: (items: ClipboardItem[]) => void;
  onInputChange: (text: string) => void;
  playKeySound: (type: string) => void;
  triggerVibration: () => void;
  setActiveTab: (tab: any) => void;
  setAiAction: (action: string) => void;
}

export const ProductivityHub = memo(({
  hubTab,
  setHubTab,
  clipboardItems,
  setClipboardItems,
  onInputChange,
  playKeySound,
  triggerVibration,
  setActiveTab,
  setAiAction
}: ProductivityHubProps) => {
  const [clipSearch, setClipSearch] = useState("");
  const [previewClip, setPreviewClip] = useState<ClipboardItem | null>(null);

  const filteredClips = clipboardItems
    .filter(item => item.text.toLowerCase().includes(clipSearch.toLowerCase()))
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      className="w-full bg-slate-900/80 backdrop-blur-3xl border-b border-white/20 p-3 flex flex-col space-y-2 max-h-56 overflow-y-auto shadow-inner no-scrollbar"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white flex items-center space-x-1">
          <History className="w-4 h-4" />
          <span>Glass Productivity Hub</span>
        </span>
        <div className="flex space-x-1">
          {[
            { id: "clipboard", label: "Clipboard" },
            { id: "replies", label: "Quick Replies" },
            { id: "prompts", label: "Fav Prompts" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setHubTab(tab.id as any)}
              className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase transition-all shadow-sm ${hubTab === tab.id ? "bg-white text-black" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {hubTab === "clipboard" && (
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-1.5 bg-black/10 p-1.5 rounded-xl border border-white/10 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
              <input
                type="text"
                placeholder="Search copied clips..."
                value={clipSearch}
                onChange={(e) => setClipSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-2 py-1 text-[11px] text-white placeholder-white/30 focus:outline-none focus:border-white/30"
              />
            </div>
            <button
              onClick={() => {
                const remaining = clipboardItems.filter(item => item.isPinned);
                setClipboardItems(remaining);
                localStorage.setItem("breezy_clipboard_history", JSON.stringify(remaining));
                triggerVibration();
              }}
              className="px-2 py-1 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 rounded-lg text-[10px] text-red-300 font-bold transition-all shrink-0 active:scale-95"
            >
              Clear All
            </button>
          </div>

          <div className="flex flex-col space-y-1.5 max-h-40 overflow-y-auto no-scrollbar pb-1">
            {filteredClips.map(item => {
              const isNew = item.createdAt && (Date.now() - new Date(item.createdAt).getTime() < 15 * 60 * 1000);
              return (
                <div
                  key={item.id}
                  className={`p-2 rounded-xl border transition-all flex items-center justify-between shadow-sm relative group ${
                    item.isPinned ? "bg-amber-500/10 border-amber-500/30" : "bg-black/20 border-white/10 hover:bg-white/5"
                  }`}
                >
                  <div 
                    onClick={() => {
                      onInputChange(item.text);
                      playKeySound("standard");
                      triggerVibration();
                    }}
                    className="flex-1 min-w-0 pr-2 cursor-pointer"
                  >
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[11px] text-white truncate font-medium">{item.text}</span>
                      {isNew && <span className="bg-cyan-500/20 border border-cyan-400/40 text-[8px] text-cyan-300 font-black px-1 rounded uppercase tracking-wider scale-90">NEW</span>}
                    </div>
                    <span className="text-[8px] text-white/40 block mt-0.5">
                      {item.isPinned ? "Pinned" : "Copied"} • {new Date(item.createdAt || 0).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = clipboardItems.map(i => i.id === item.id ? { ...i, isPinned: !i.isPinned } : i);
                        setClipboardItems(updated);
                        localStorage.setItem("breezy_clipboard_history", JSON.stringify(updated));
                        triggerVibration();
                      }}
                      className={`p-1 rounded-md transition-all ${item.isPinned ? "text-amber-400 bg-amber-500/10" : "text-white/40 hover:text-white/80"}`}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = clipboardItems.map(i => i.id === item.id ? { ...i, isFavorite: !i.isFavorite } : i);
                        setClipboardItems(updated);
                        localStorage.setItem("breezy_clipboard_history", JSON.stringify(updated));
                        triggerVibration();
                      }}
                      className={`p-1 rounded-md transition-all ${item.isFavorite ? "text-rose-400 bg-rose-500/10" : "text-white/40 hover:text-white/80"}`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? "fill-rose-400 text-rose-400" : ""}`} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setPreviewClip(item); triggerVibration(); }}
                      className="p-1 rounded-md text-white/40 hover:text-white/80"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const remaining = clipboardItems.filter(i => i.id !== item.id);
                        setClipboardItems(remaining);
                        localStorage.setItem("breezy_clipboard_history", JSON.stringify(remaining));
                        triggerVibration();
                      }}
                      className="p-1 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <AnimatePresence>
        {previewClip && (
          <div className="absolute inset-x-0 bottom-0 bg-slate-950/95 backdrop-blur-md border-t border-white/20 p-4 rounded-t-2xl z-50 flex flex-col space-y-3 shadow-[0_-8px_24px_rgba(0,0,0,0.6)]">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">Clipboard Preview</span>
              <button onClick={() => setPreviewClip(null)} className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="bg-black/30 p-3 rounded-xl border border-white/10 text-xs text-white max-h-24 overflow-y-auto font-mono whitespace-pre-wrap select-text">{previewClip.text}</div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { navigator.clipboard.writeText(previewClip.text); setPreviewClip(null); triggerVibration(); }}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold rounded-lg transition-all active:scale-95"
              >
                Copy to OS
              </button>
              <button
                onClick={() => { onInputChange(previewClip.text); setPreviewClip(null); playKeySound("standard"); triggerVibration(); }}
                className="px-4 py-1.5 bg-cyan-500 text-black text-[11px] font-bold rounded-lg hover:bg-cyan-400 transition-all active:scale-95 shadow-md shadow-cyan-500/20"
              >
                Paste / Insert
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {hubTab === "replies" && (
        <div className="grid grid-cols-2 gap-1.5">
          {["Sounds perfect, talk to you then!", "On my way, running slightly behind.", "Can you send over the updated file?", "Let me review this and get right back to you.", "Awesome, that is incredibly helpful!"].map((rep, i) => (
            <button key={i} onClick={() => { onInputChange(rep); playKeySound("standard"); }} className="bg-black/20 p-2.5 rounded-xl border border-white/20 text-[10.5px] text-left text-white/90 hover:bg-white/10 truncate shadow-inner">{rep}</button>
          ))}
        </div>
      )}

      {hubTab === "prompts" && (
        <div className="flex flex-col space-y-1.5">
          {[
            { label: "Formal Draft", trigger: "Please write a formal message stating: " },
            { label: "Tone Polish", trigger: "Rewrite this nicely: " },
            { label: "Make Exciting", trigger: "Make this sound exciting: " },
            { label: "Explain in Swahili", trigger: "Eleza neno hili kwa Kiswahili: " }
          ].map((p, i) => (
            <div
              key={i}
              onClick={() => { onInputChange(p.trigger); setActiveTab("ai"); setAiAction("rewrite"); playKeySound("standard"); }}
              className="bg-black/20 p-2.5 rounded-xl border border-white/20 text-[11px] text-white hover:bg-white/10 cursor-pointer transition-all flex justify-between shadow-inner"
            >
              <span className="font-bold text-white">{p.label}</span>
              <span className="text-white/60 font-mono italic">"{p.trigger.slice(0, 15)}..."</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
});

ProductivityHub.displayName = "ProductivityHub";
