import React, { useState } from 'react';
import { Search } from 'lucide-react';

// Simplified list of emojis
const EMOJIS = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "🥲", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "👋", "🤚", "🖐️", "✋", "👌", "🤌", "🤏", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲"];

export const EmojiSearch: React.FC<{ onSelect: (emoji: string) => void }> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recent, setRecent] = useState<string[]>(JSON.parse(localStorage.getItem('recentEmojis') || '[]'));

  const filteredEmojis = EMOJIS.filter(e => e.includes(searchTerm)); // Simple filter

  const selectEmoji = (emoji: string) => {
    const updatedRecent = [emoji, ...recent.filter(r => r !== emoji)].slice(0, 20);
    setRecent(updatedRecent);
    localStorage.setItem('recentEmojis', JSON.stringify(updatedRecent));
    onSelect(emoji);
  };

  return (
    <div className="w-full h-full p-2 space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 w-4 h-4 text-white/50" />
        <input
          type="text"
          placeholder="Search emojis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 pr-2 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-white/30"
        />
      </div>
      
      {recent.length > 0 && (
        <div className="space-y-1">
            <span className="text-[9px] font-bold text-white/50 uppercase">Recently Used</span>
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {recent.map(e => <button key={e} onClick={() => selectEmoji(e)} className="text-lg p-1 hover:bg-white/10 rounded">{e}</button>)}
            </div>
        </div>
      )}

      <div className="grid grid-cols-7 gap-1 overflow-y-auto max-h-40">
        {filteredEmojis.map(e => (
          <button key={e} onClick={() => selectEmoji(e)} className="text-xl hover:bg-white/10 rounded-lg p-1">
            {e}
          </button>
        ))}
      </div>
    </div>
  );
};
