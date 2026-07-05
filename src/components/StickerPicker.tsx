
import React, { useState, useMemo } from 'react';
import { INITIAL_STICKERS, STICKER_CATEGORIES, Sticker } from '../stickersData';
import { motion } from 'motion/react';
import { Search, Heart, History } from 'lucide-react';

interface StickerPickerProps {
  onSelect: (emoji: string) => void;
}

export const StickerPicker: React.FC<StickerPickerProps> = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Smileys");

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("breezy_sticker_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [recentStickers, setRecentStickers] = useState<string[]>(() => {
    const saved = localStorage.getItem("breezy_sticker_recent");
    return saved ? JSON.parse(saved) : [];
  });

  const filteredStickers = useMemo(() => {
    let base = INITIAL_STICKERS;
    
    if (category === "Favorites") {
      base = INITIAL_STICKERS.filter(s => favorites.includes(s.id));
    } else if (category === "Recent") {
      base = recentStickers.map(id => INITIAL_STICKERS.find(s => s.id === id)).filter(Boolean) as Sticker[];
    } else {
      base = INITIAL_STICKERS.filter(s => s.category === category);
    }

    return base.filter(s => 
      s.name.toLowerCase().includes(search.toLowerCase()) || 
      s.tags.some(t => t.includes(search.toLowerCase()))
    );
  }, [search, category, favorites, recentStickers]);

  const handleSelect = (sticker: Sticker) => {
    onSelect(sticker.emoji);
    
    // Add to recent
    setRecentStickers(prev => {
      const next = [sticker.id, ...prev.filter(id => id !== sticker.id)].slice(0, 32);
      localStorage.setItem("breezy_sticker_recent", JSON.stringify(next));
      return next;
    });
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [id, ...prev];
      localStorage.setItem("breezy_sticker_favorites", JSON.stringify(next));
      return next;
    });
  };

  const allCategories = ["Recent", "Favorites", ...STICKER_CATEGORIES];

  return (
    <div className="flex flex-col h-full bg-[#121212]/95 backdrop-blur-xl rounded-t-3xl overflow-hidden p-4 border-t border-white/10">
      <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl mb-4 border border-white/5">
        <Search className="w-4 h-4 text-white/50" />
        <input 
          placeholder="Search stickers by name..." 
          className="bg-transparent text-xs w-full outline-none text-white placeholder:text-white/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {allCategories.map(c => {
          const isActive = category === c;
          return (
            <button 
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${isActive ? "bg-white text-black border-white shadow-lg" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"}`}
            >
              {c === "Recent" && <History className="w-3 h-3 inline mr-1" />}
              {c === "Favorites" && <Heart className="w-3 h-3 inline mr-1" />}
              {c}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-2.5 pb-24 scrollbar-none">
        {filteredStickers.length === 0 ? (
          <div className="col-span-4 text-center py-12">
            <p className="text-xs text-white/40 italic">No stickers found in this category.</p>
          </div>
        ) : (
          filteredStickers.map(sticker => {
            const isFav = favorites.includes(sticker.id);
            return (
              <div
                key={sticker.id}
                onClick={() => handleSelect(sticker)}
                className="group relative p-3 text-3xl bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center transition-all cursor-pointer border border-white/5 hover:border-white/20 active:scale-95"
              >
                {sticker.emoji}
                <button 
                  onClick={(e) => toggleFavorite(e, sticker.id)}
                  className={`absolute top-1 right-1 p-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ${isFav ? "text-rose-500 opacity-100" : "text-white/20 hover:text-white/50"}`}
                >
                  <Heart className={`w-2.5 h-2.5 ${isFav ? "fill-rose-500" : ""}`} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
