import React, { useState, useMemo, useEffect } from "react";
import { Search, Heart, Clock, Smile, Laptop, Apple, Coffee, Car, Lightbulb, Flag, X, Flame } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

const EMOJI_CATEGORIES = [
  { id: "recent", icon: <Clock className="w-4 h-4" />, label: "Recent" },
  { id: "frequent", icon: <Flame className="w-4 h-4" />, label: "Hot" },
  { id: "favorites", icon: <Heart className="w-4 h-4" />, label: "Favs" },
  { id: "smileys", icon: <Smile className="w-4 h-4" />, label: "Faces" },
  { id: "activities", icon: <Laptop className="w-4 h-4" />, label: "Work" },
  { id: "nature", icon: <Apple className="w-4 h-4" />, label: "Food" },
  { id: "travel", icon: <Car className="w-4 h-4" />, label: "Travel" },
  { id: "objects", icon: <Lightbulb className="w-4 h-4" />, label: "Stuff" },
  { id: "flags", icon: <Flag className="w-4 h-4" />, label: "Flags" },
];

const EMOJI_DATA: Record<string, string[]> = {
  smileys: ["👍", "👎", "👋", "👏", "🙌", "👐", "🙋", "💁", "🙅", "🙆", "🙇", "🧘", "🧗", "🏃", "🚶", "✍️", "💪", "✌️", "👌", "☝️", "✋", "✊", "👊", "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "☺️", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿", "👹", "👺", "🤡", "👻", "💀", "☠️", "👽", "👾", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾"],
  activities: ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🎿", "⛷️", "🏂", "🪂", "🏋️", "🤼", "🤸", "⛹️", "🤺", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚵", "🚴", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏵️", "🎗️", "🎫", "🎟️", "🎭", "🎨", "🎬", "🎤", "🎧", "🎼", "🎹", "🥁", "🎸", "🎻", "🎲", "♟️", "🎯", "🎳", "🎮", "🎰", "🧩"],
  nature: ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🌽", "🥕", "🧄", "🧅", "🥔", "🍠", "🥐", "🥯", "🍞", "🥖", "🥨", "🧀", "🥚", "🍳", "🧈", "🥞", "🧇", "🥓", "🥩", "🍗", "🍖", "🦴", "🌭", "🍔", "🍟", "🍕", "🥪", "🥙", "🧆", "🌮", "🌯", "🥗", "🥘", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪", "🌰", "🥜", "🍯", "🥛", "☕", "🍵", "🧃", "🥤", "🍶", "🍺", "🍻", "🥂", "🍷", "🥃", "🍸", "🍹", "🧉", "🍾", "🧊", "🥄", "🍴", "🍽️", "🥣", "🥡", "🥢", "🧂"],
  travel: ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🚚", "🚛", "🚜", "🦯", "🦽", "🦼", "🛴", "🚲", "🛵", "🏍️", "🛺", "🚨", "🚔", "🚍", "🚘", "🚖", "🚡", "🚠", "🚟", "🚃", "🚋", "🚞", "🚝", "🚄", "🚅", "🚈", "🚂", "🚆", "🚇", "🚊", "🚉", "✈️", "🛫", "🛬", "🛩️", "💺", "🛰️", "🚀", "🛸", "🚁", "🛶", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "⚓", "🚧", "⛽", "🚏", "🚦", "🚥", "🏁", "🚢", "🎡", "🎢", "🎠", "🏗️", "🌁", "🗼", "🏭", "⛲", "🎑", "⛰️", "🏔️", "🗻", "🌋", "🗾", "🏕️", "⛺", "🏞️", "🛣️", "🛤️", "🌅", "🌄", "🏜️", "🏖️", "🏝️", "🌇", "🌆", "🏙️", "🌃", "🌉", "🌌", "🌠", "🎇", "🎆", "🏘️", "🏰", "🏯", "🏟️", "🏠", "🏡", "🏢", "🏣", "🏤", "🏥", "🏦", "🏨", "🏩", "🏪", "🏫", "🏬", "💒", "⛪", "🕌", "🕍", "🕋", "⛩️"],
  objects: ["⌚", "📱", "📲", "💻", "⌨️", "🖱️", "🖲️", "🕹️", "🗜️", "💽", "💾", "💿", "DVD", "📼", "📷", "📸", "📹", "🎥", "📽️", "🎞️", "📞", "📟", "📠", "📺", "📻", "🎙️", "🎚️", "🎛️", "🧭", "⏱️", "⏲️", "⏰", "🕰️", "⌛", "⏳", "📡", "🔋", "🔌", "💡", "🔦", "🕯️", "🪔", "🧯", "🛢️", "💸", "💵", "💴", "💶", "💷", "💰", "💳", "💎", "⚖️", "🧰", "🔧", "🔨", "⚒️", "🛠️", "⛏️", "🔩", "⚙️", "🧱", "⛓️", "🧲", "🔫", "💣", "🧨", "🪓", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "⚱️", "🏺", "🔮", "📿", "🧿", "💈", "⚗️", "🔭", "🔬", "🕳️", "🩹", "🩺", "💊", "💉", "🩸", "🧬", "🦠", "🌡️", "🧹", "🧺", "🧻", "🧼", "🧽", "🧴", "🛎️", "🔑", "🗝️", "🚪", "🪑", "🛋️", "🛏️", "🛌", "🧸", "🖼️", "🛍️", "🛒", "🎁", "🎈", "🎏", "🎀", "🎊", "🎉", "🎎", "🏮", "🎐", "🧧", "✉️", "📩", "📨", "📧", "💌", "📥", "📤", "📦", "🏷️", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️", "🔨", "⚒️", "🛠️", "⛏️", "🔩", "⚙️", "🧱", "⛓️", "🧲", "🔫", "💣", "🧨", "🪓", "🔪", "🗡️", "⚔️", "🛡️", "🚬", "⚰️", "⚱️", "🏺", "🔮", "📿", "🧿", "💈", "⚗️", "🔭", "🔬", "🕳️", "🩹", "🩺", "💊", "💉", "🩸", "🧬", "🦠", "🌡️", "🧹", "🧺", "🧻", "🧼", "🧽", "🧴", "🛎️", "🔑", "🗝️", "🚪", "🪑", "🛋️", "🛏️", "🛌", "🧸", "🖼️", "🛍️", "🛒", "🎁", "🎈", "🎏", "🎀", "🎊", "🎉", "🎎", "🏮", "🎐", "🧧", "✉️", "📩", "📨", "📧", "💌", "📥", "📤", "📦", "🏷️", "📁", "📂", "🗂️", "📅", "📆", "🗒️", "🗓️", "📇", "📈", "📉", "📊", "📋", "📌", "📍", "📎", "🖇️", "📏", "📐", "✂️", "🗃️", "🗄️", "🗑️", "🔒", "🔓", "🔏", "🔐", "🔑", "🗝️"],
  flags: ["🏁", "🚩", "🎌", "🏴", "🏳️", "🏳️‍🌈", "🏳️‍⚧️", "🏴‍☠️", "🇦🇫", "🇦🇽", "🇦🇱", "🇩🇿", "🇦🇸", "🇦🇩", "🇦🇴", "🇦🇮", "🇦🇶", "🇦🇬", "🇦🇷", "🇦🇲", "🇦🇼", "🇦🇺", "🇦🇹", "🇦🇿", "🇧🇸", "🇧🇭", "🇧🇩", "🇧🇧", "🇧🇾", "🇧🇪", "🇧🇿", "🇧🇯", "🇧🇲", "🇧🇹", "🇧🇴", "🇧🇦", "🇧🇼", "🇧🇷", "🇮🇴", "🇻🇬", "🇧🇳", "🇧🇬", "🇧🇫", "🇧🇮", "🇰🇭", "🇨🇲", "🇨🇦", "🇮🇨", "🇨🇻", "🇧???", "🇰🇾", "🇨🇫", "🇹🇩", "🇨🇱", "🇨🇳", "🇨🇽", "🇨🇨", "🇨🇴", "🇰🇲", "🇨🇬", "🇨🇩", "🇨🇰", "🇨🇷", "🇨🇮", "🇭🇷", "🇨🇺", "🇨🇼", "🇨🇾", "🇨🇿", "🇩🇰", "🇩🇯", "🇩🇲", "🇩🇴", "🇪🇨", "🇪🇬", "🇸🇻", "🇬🇶", "🇪🇷", "🇪🇪", "🇸🇿", "🇪🇹", "🇪🇺", "🇫🇰", "🇫🇴", "🇫🇯", "🇫🇮", "🇫🇷", "🇬🇫", "🇵🇫", "🇹🇫", "🇬🇦", "🇬🇲", "🇬🇪", "🇩🇪", "🇬🇭", "🇬🇮", "🇬🇷", "🇬🇱", "🇬🇩", "🇬🇵", "🇬🇺", "🇬🇹", "🇬🇬", "🇬🇳", "🇬🇼", "🇬🇾", "🇭🇹", "🇭🇳", "🇭🇰", "🇭🇺", "🇮🇸", "🇮🇳", "🇮🇩", "🇮🇷", "🇮🇶", "🇮🇪", "🇮🇲", "🇮🇱", "🇮🇹", "🇨🇲", "🇯🇵", "🇯🇪", "🇯🇴", "🇰🇿", "🇰🇪", "🇰🇮", "🇽🇰", "🇰🇼", "🇰🇬", "🇱🇦", "🇱🇻", "🇱🇧", "🇱🇸", "🇱🇷", "🇱🇾", "🇱🇮", "🇱🇹", "🇱🇺", "🇲🇴", "🇲🇬", "🇲🇼", "🇲🇾", "🇲🇻", "🇲🇱", "🇲🇹", "🇲🇭", "🇲🇶", "🇲🇷", "🇲🇺", "🇾🇹", "🇲🇽", "🇫🇲", "🇲🇩", "🇲🇨", "🇲🇳", "🇲🇪", "🇲🇸", "🇲🇦", "🇲🇿", "🇲🇲", "🇳🇦", "🇳🇷", "🇳🇵", "🇳🇱", "🇳🇨", "🇳🇿", "🇳🇮", "🇳🇪", "🇳🇬", "🇳🇺", "🇳🇫", "🇰🇵", "🇲🇰", "🇲🇵", "🇳🇴", "🇴🇲", "🇵🇰", "🇵🇼", "🇵🇸", "🇵🇦", "🇵🇬", "🇵🇾", "🇵🇪", "🇵🇭", "🇵🇳", "🇵🇱", "🇵🇹", "🇵🇷", "🇶🇦", "🇷🇪", "🇷🇴", "🇷🇺", "🇷🇼", "🇼🇸", "🇸🇲", "🇸🇹", "🇸🇦", "🇸🇳", "🇷🇸", "🇸🇨", "🇸🇱", "🇸🇬", "🇸🇽", "🇸🇰", "🇸🇮", "🇬🇸", "🇸🇧", "🇸🇴", "🇿🇦", "🇰🇷", "🇸🇸", "🇪🇸", "🇱🇰", "🇧🇱", "🇸🇭", "🇰🇳", "🇱🇨", "🇵🇲", "🇻🇨", "🇸🇩", "🇸🇷", "🇸🇪", "🇨🇭", "🇸🇾", "🇹🇼", "🇹🇯", "🇹🇿", "🇹🇭", "🇹🇱", "🇹🇬", "🇹🇰", "🇹🇴", "🇹🇹", "🇹🇳", "🇹🇷", "🇹🇲", "🇹🇨", "🇹🇻", "🇺🇬", "🇺🇦", "🇦🇪", "🇬🇧", "🇺🇸", "🇺🇾", "🇺🇿", "🇻🇺", "🇻🇦", "🇻🇪", "🇻🇳", "🇻🇮", "🇼🇫", "🇪🇭", "🇾🇪", "🇿🇲", "🇿🇼"]
};

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const [activeCategory, setActiveCategory] = useState("smileys");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("breezy_favorite_emojis");
    return saved ? JSON.parse(saved) : ["❤️", "🔥", "✨", "🙌", "😂", "🚀"];
  });
  const [recent, setRecent] = useState<string[]>(() => {
    const saved = localStorage.getItem("breezy_recent_emojis");
    return saved ? JSON.parse(saved) : [];
  });

  const [skinTone, setSkinTone] = useState<string>(() => {
    return localStorage.getItem("breezy_emoji_skin_tone") || "";
  });

  const allEmojis = useMemo(() => {
    const all: string[] = [];
    Object.values(EMOJI_DATA).forEach(cat => all.push(...cat));
    return all;
  }, []);

  const filteredEmojis = useMemo(() => {
    if (searchQuery) {
      return allEmojis.filter(e => e.includes(searchQuery)).slice(0, 50);
    }
    if (activeCategory === "recent") return recent;
    if (activeCategory === "favorites") return favorites;
    
    if (activeCategory === "frequent") {
      const freqSaved = localStorage.getItem("breezy_frequent_emojis");
      if (freqSaved) {
        try {
          const freq: Record<string, number> = JSON.parse(freqSaved);
          return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0])
            .slice(0, 24);
        } catch (e) {}
      }
      return ["😊", "🔥", "😂", "❤️", "👍", "✨"];
    }

    return EMOJI_DATA[activeCategory] || [];
  }, [activeCategory, searchQuery, favorites, recent, allEmojis]);

  const applySkinTone = (emoji: string, toneCode: string) => {
    if (!toneCode) return emoji;
    const modifiable = [
      "👍", "👎", "👋", "👏", "🙌", "👐", "🙋", "💁", "🙅", "🙆", "🙇", "🧘", "🧗", "🏃", "🚶", "✍️", "💪", "✌️", "👌", "☝️", "✋", "✊", "👊", "🤝", "🙏"
    ];
    if (modifiable.includes(emoji)) {
      return emoji + toneCode;
    }
    return emoji;
  };

  const displayedEmojis = useMemo(() => {
    return filteredEmojis.map(e => applySkinTone(e, skinTone));
  }, [filteredEmojis, skinTone]);

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    
    // Update recent
    const nextRecent = [emoji, ...recent.filter(e => e !== emoji)].slice(0, 30);
    setRecent(nextRecent);
    localStorage.setItem("breezy_recent_emojis", JSON.stringify(nextRecent));

    // Update frequent counts
    const freqSaved = localStorage.getItem("breezy_frequent_emojis");
    const freq: Record<string, number> = freqSaved ? JSON.parse(freqSaved) : {};
    // Extract base emoji to count properly regardless of tone
    const baseEmoji = emoji.replace(/[\u{1F3FB}-\u{1F3FF}]/gu, "");
    freq[baseEmoji] = (freq[baseEmoji] || 0) + 1;
    localStorage.setItem("breezy_frequent_emojis", JSON.stringify(freq));
  };

  const toggleFavorite = (e: React.MouseEvent, emoji: string) => {
    e.stopPropagation();
    const nextFavs = favorites.includes(emoji)
      ? favorites.filter(f => f !== emoji)
      : [emoji, ...favorites];
    setFavorites(nextFavs);
    localStorage.setItem("breezy_favorite_emojis", JSON.stringify(nextFavs));
  };

  const SKIN_TONES = [
    { code: "", name: "Default", color: "bg-yellow-400 border-amber-300" },
    { code: "🏻", name: "Light", color: "bg-[#F9DEC9] border-[#E8C1A8]" },
    { code: "🏼", name: "Medium-Light", color: "bg-[#E0B594] border-[#C29878]" },
    { code: "🏽", name: "Medium", color: "bg-[#C6936E] border-[#A87856]" },
    { code: "🏾", name: "Medium-Dark", color: "bg-[#9A623B] border-[#7F4E2D]" },
    { code: "🏿", name: "Dark", color: "bg-[#5C3B24] border-[#442C1D]" }
  ];

  const handleSkinToneSelect = (code: string) => {
    setSkinTone(code);
    localStorage.setItem("breezy_emoji_skin_tone", code);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/80 backdrop-blur-3xl border border-white/20 rounded-t-3xl overflow-hidden shadow-2xl">
      {/* Header with Search */}
      <div className="p-3 space-y-2 border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] font-mono">Emoji Universe</span>
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" />
            <span className="text-[9px] text-cyan-400 font-bold uppercase">Pro Panel</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Search emojis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder:text-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-white/40 hover:text-white" />
              </button>
            )}
          </div>

          {/* Skin Tone Panel */}
          <div className="flex items-center space-x-1 bg-white/5 border border-white/10 px-1.5 py-1 rounded-xl">
            {SKIN_TONES.map(tone => (
              <button
                key={tone.code}
                onClick={() => handleSkinToneSelect(tone.code)}
                title={tone.name}
                className={`w-4 h-4 rounded-full border transition-all active:scale-90 ${tone.color} ${
                  skinTone === tone.code 
                    ? "scale-125 ring-1 ring-white" 
                    : "opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar px-3 py-2 border-b border-white/5 bg-black/20 shrink-0">
        {EMOJI_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setSearchQuery(""); }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full transition-all shrink-0 border ${
              activeCategory === cat.id && !searchQuery
                ? "bg-white text-slate-950 border-white shadow-lg scale-105"
                : "bg-white/5 text-white/40 border-white/10 hover:bg-white/10"
            }`}
          >
            {cat.icon}
            <span className="text-[9px] font-black uppercase tracking-tight">{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Emoji Grid */}
      <div className="flex-1 overflow-y-auto p-3 no-scrollbar select-none">
        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
          {displayedEmojis.map((emoji, idx) => (
            <motion.button
              key={`${emoji}-${idx}`}
              whileHover={{ scale: 1.2, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleSelect(emoji)}
              onContextMenu={(e) => toggleFavorite(e, emoji)}
              className="aspect-square flex items-center justify-center text-2xl relative group bg-white/5 rounded-xl border border-white/5 hover:border-white/20 hover:bg-white/10 transition-all"
            >
              {emoji}
              <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {favorites.includes(emoji) ? (
                  <Heart className="w-2.5 h-2.5 text-pink-500 fill-pink-500" />
                ) : (
                  <Heart className="w-2.5 h-2.5 text-white/20" />
                )}
              </div>
            </motion.button>
          ))}
          {displayedEmojis.length === 0 && (
            <div className="col-span-full py-10 text-center flex flex-col items-center justify-center space-y-2">
              <Smile className="w-8 h-8 text-white/10" />
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">No emojis found</p>
            </div>
          )}
        </div>
      </div>

      {/* Tip Footer */}
      <div className="p-2 bg-black/40 border-t border-white/10 text-center shrink-0">
        <p className="text-[8px] text-white/20 uppercase tracking-[0.3em] font-black">Tap to insert • Right click/Hold to Favorite</p>
      </div>
    </div>
  );
};
