
import React, { useState, useMemo } from 'react';
import { BUILT_IN_FONTS, RichFont } from '../fontsData';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';

interface FontPickerProps {
  onSelect: (font: RichFont) => void;
  currentFontId: string;
}

export const FontPicker: React.FC<FontPickerProps> = ({ onSelect, currentFontId }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(BUILT_IN_FONTS.map(f => f.category))];
  
  const filteredFonts = useMemo(() => {
    return BUILT_IN_FONTS.filter(f => 
      (category === "All" || f.category === category) &&
      (f.name.toLowerCase().includes(search.toLowerCase()) || f.family.toLowerCase().includes(search.toLowerCase()))
    );
  }, [search, category]);

  return (
    <div className="flex flex-col h-full bg-[#121212]/90 backdrop-blur-md rounded-t-3xl overflow-hidden p-4 border-t border-white/10">
      <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl mb-4">
        <Search className="w-4 h-4 text-white/50" />
        <input 
          placeholder="Search fonts..." 
          className="bg-transparent text-xs w-full outline-none text-white placeholder:text-white/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {categories.map(c => (
          <button 
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3 py-1 rounded-full text-[10px] whitespace-nowrap ${category === c ? "bg-white text-black font-bold" : "bg-white/5 text-white/70"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2 pb-20">
        {filteredFonts.map(font => (
          <button
            key={font.id}
            onClick={() => onSelect(font)}
            className={`p-3 rounded-xl border ${currentFontId === font.id ? "border-cyan-400 bg-cyan-400/10" : "border-white/10 bg-white/5"} transition-colors`}
          >
            <div className={`text-base truncate ${font.className}`}>{font.name}</div>
            <div className="text-[9px] text-white/40">{font.category}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
