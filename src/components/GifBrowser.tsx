
import React, { useState, useEffect } from 'react';
import { activeGifProvider, GifItem, GIF_CATEGORIES } from '../gifsData';
import { motion } from 'motion/react';
import { Search } from 'lucide-react';

interface GifBrowserProps {
  onSelect: (url: string) => void;
}

export const GifBrowser: React.FC<GifBrowserProps> = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Trending");
  const [gifs, setGifs] = useState<GifItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [favorites, setFavorites] = useState<GifItem[]>(() => {
    const saved = localStorage.getItem("breezy_gif_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [recentlyUsed, setRecentlyUsed] = useState<GifItem[]>(() => {
    const saved = localStorage.getItem("breezy_gif_recent");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchGifs = async () => {
      if (category === "Favorites") {
        setGifs(favorites);
        return;
      }
      if (category === "Recent") {
        setGifs(recentlyUsed);
        return;
      }
      
      setLoading(true);
      try {
        let items: GifItem[] = [];
        if (category === "Trending") {
          items = await activeGifProvider.getTrendingGifs(24);
        } else {
          items = await activeGifProvider.searchGifs(category, 24);
        }
        setGifs(items);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchGifs();
  }, [category, favorites, recentlyUsed]);

  const handleSearch = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && search) {
      setLoading(true);
      const items = await activeGifProvider.searchGifs(search, 24);
      setGifs(items);
      setLoading(false);
    }
  };

  const handleSelect = (gif: GifItem) => {
    // Add to recently used
    const newRecent = [gif, ...recentlyUsed.filter(g => g.id !== gif.id)].slice(0, 20);
    setRecentlyUsed(newRecent);
    localStorage.setItem("breezy_gif_recent", JSON.stringify(newRecent));
    
    onSelect(gif.url);
  };

  const toggleFavorite = (gif: GifItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavs = favorites.some(g => g.id === gif.id) 
      ? favorites.filter(g => g.id !== gif.id) 
      : [gif, ...favorites];
    setFavorites(newFavs);
    localStorage.setItem("breezy_gif_favorites", JSON.stringify(newFavs));
  };

  const allCategories = ["Trending", "Recent", "Favorites", ...GIF_CATEGORIES];

  return (
    <div className="flex flex-col h-full bg-[#121212]/95 backdrop-blur-xl rounded-t-3xl overflow-hidden p-4 border-t border-white/10">
      <div className="flex items-center gap-2 bg-white/5 p-2.5 rounded-xl mb-4 border border-white/5">
        <Search className="w-4 h-4 text-white/50" />
        <input 
          placeholder="Search Tenor GIFs..." 
          className="bg-transparent text-xs w-full outline-none text-white placeholder:text-white/30"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
        {allCategories.map(c => (
          <button 
            key={c}
            onClick={() => setCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${category === c ? "bg-white text-black border-white shadow-lg" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-2.5 pb-24 scrollbar-none">
        {loading ? (
            <div className="col-span-2 text-center text-xs text-white/30 pt-12 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span className="font-mono uppercase tracking-widest text-[9px]">Loading Tenor Gifs...</span>
            </div>
        ) : gifs.length === 0 ? (
          <div className="col-span-2 text-center py-12">
            <p className="text-xs text-white/40 italic">No GIFs found in this category.</p>
          </div>
        ) : (
            gifs.map(gif => (
            <div
                key={gif.id}
                className="relative group overflow-hidden rounded-xl border border-white/10 transition-all hover:border-white/30 bg-black/40 h-28"
            >
                <img 
                  src={gif.previewUrl} 
                  alt={gif.title} 
                  className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform duration-500"
                  onClick={() => handleSelect(gif)}
                  loading="lazy"
                />
                <button 
                  onClick={(e) => toggleFavorite(gif, e)}
                  className="absolute top-1.5 right-1.5 p-1.5 bg-black/50 backdrop-blur-md rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className={`w-3 h-3 ${favorites.some(f => f.id === gif.id) ? "fill-rose-500 text-rose-500" : "text-white/60"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </button>
            </div>
            ))
        )}
      </div>
    </div>
  );
};
