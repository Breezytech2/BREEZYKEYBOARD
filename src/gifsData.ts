/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GifItem {
  id: string;
  url: string; // Animated image url
  previewUrl: string; // Static or compressed preview url
  title: string;
  category: string;
  tags: string[];
}

export const GIF_CATEGORIES = [
  "Trending", "Thumbs Up", "Mind Blown", "Facepalm", "Sigh", 
  "Happy Dance", "Celebration", "Shocked", "Mic Drop", "Sassy", "Confused"
];

// Curated high-fidelity backup GIFs that load instantly and provide realistic presets
export const FALLBACK_GIFS: GifItem[] = [
  {
    id: "gif_1",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3YydGwyM2V2czI4Zml4am9mNWwxd2t4ZXIzdWN4aXR5NHJtYWxsayZlcD12MV9pbnRlcm5hbF9naWZfYnlfZ2lmeSZjdD1n/t3s3S6DPJRg54bkdV9/giphy.gif",
    previewUrl: "https://media.giphy.com/media/t3s3S6DPJRg54bkdV9/giphy-downsized.gif",
    title: "Excited Cat Dance",
    category: "Happy Dance",
    tags: ["happy", "dance", "cat", "cute"]
  },
  {
    id: "gif_2",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDVqNml3azEyaDNoNmd5Z3YxaTFib3RkZDRubmN6cnA2bjc2NDYwOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfZ2lmeSZjdD1n/HteV6h0c0HN7y/giphy.gif",
    previewUrl: "https://media.giphy.com/media/HteV6h0c0HN7y/giphy-downsized.gif",
    title: "Minion Celebration",
    category: "Celebration",
    tags: ["minions", "party", "happy", "yes"]
  },
  {
    id: "gif_3",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5pOTNoNnNxOTg2eWJ1eTJpOGF2aDNnd3R4amg2MW04MG1pMTgyayZlcD12MV9pbnRlcm5hbF9naWZfYnlfZ2lmeSZjdD1n/l3q2K1M66D9RCRSf6/giphy.gif",
    previewUrl: "https://media.giphy.com/media/l3q2K1M66D9RCRSf6/giphy-downsized.gif",
    title: "Mind Blown Galaxy",
    category: "Mind Blown",
    tags: ["mind", "blown", "galaxy", "wow", "incredible"]
  },
  {
    id: "gif_4",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGx0cG43Nm82OGVnbTJid3Z4c3h3ZHh1NGo3ajk2ZzNwdjV6ZHR6YiZlcD12MV9pbnRlcm5hbF9naWZfYnlfZ2lmeSZjdD1n/3og0IPxMM0erATuefC/giphy.gif",
    previewUrl: "https://media.giphy.com/media/3og0IPxMM0erATuefC/giphy-downsized.gif",
    title: "Thumbs Up Kid",
    category: "Thumbs Up",
    tags: ["thumbs", "up", "yes", "nice", "job"]
  },
  {
    id: "gif_5",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdDJtZnZ2Ynltd25id2ZpeTNnbnF0N2RkdXp4c3h3ZHh1NGo3ajk2ZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfZ2lmeSZjdD1n/j85AoJKs7rhmg/giphy.gif",
    previewUrl: "https://media.giphy.com/media/j85AoJKs7rhmg/giphy-downsized.gif",
    title: "Sigh Facepalm",
    category: "Facepalm",
    tags: ["facepalm", "sigh", "unbelievable"]
  },
  {
    id: "gif_6",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHV3ODRtdnpveTB3ZHlqamxib3RkZDRubmN6cnA2bjc2NDYwOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfZ2lmeSZjdD1n/mGK1g88HZRa2FlKGbz/giphy.gif",
    previewUrl: "https://media.giphy.com/media/mGK1g88HZRa2FlKGbz/giphy-downsized.gif",
    title: "Mic Drop Obama",
    category: "Mic Drop",
    tags: ["mic", "drop", "done", "boss", "cool"]
  },
  {
    id: "gif_7",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmVndDZsZ3YxaTFib3RkZDRubmN6cnA2bjc2NDYwOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfZ2lmeSZjdD1n/t7pQY8S67ZshS/giphy.gif",
    previewUrl: "https://media.giphy.com/media/t7pQY8S67ZshS/giphy-downsized.gif",
    title: "Confused Lady Math",
    category: "Confused",
    tags: ["confused", "what", "math", "lost"]
  },
  {
    id: "gif_8",
    url: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW5pOTNoNnNxOTg2eWJ1eTJpOGF2aDNnd3R4amg2MW04MG1pMTgyayZlcD12MV9pbnRlcm5hbF9naWZfYnlfZ2lmeSZjdD1n/l3vQYm0jW7pSg/giphy.gif",
    previewUrl: "https://media.giphy.com/media/l3vQYm0jW7pSg/giphy-downsized.gif",
    title: "Shocked Pikachu",
    category: "Shocked",
    tags: ["shocked", "wow", "pikachu"]
  }
];

/**
 * Interface representing a swapable GIF Provider
 */
export interface GifProvider {
  searchGifs: (query: string, limit?: number) => Promise<GifItem[]>;
  getTrendingGifs: (limit?: number) => Promise<GifItem[]>;
}

/**
 * Tenor GIF Provider (using open public endpoints)
 */
class TenorGifProvider implements GifProvider {
  private cache = new Map<string, GifItem[]>();

  async searchGifs(query: string, limit = 16): Promise<GifItem[]> {
    const cacheKey = `search:${query}:${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Free public Tenor API key or fallback to anonymous demo queries
      const url = `https://tenor.googleapis.com/v2/search?q=${encodeURIComponent(query)}&key=LIVDTRZ9OROC&limit=${limit}&client_key=breezy_keyboard`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Tenor error");
      const data = await res.json();
      
      const items: GifItem[] = data.results.map((r: any) => ({
        id: r.id,
        url: r.media_formats?.gif?.url || r.media_formats?.mediumgif?.url,
        previewUrl: r.media_formats?.tinygif?.url || r.media_formats?.nanogif?.url,
        title: r.title || query,
        category: "Search",
        tags: [query]
      }));

      this.cache.set(cacheKey, items);
      return items;
    } catch (e) {
      console.warn("Tenor API search fallback active", e);
      // Filter curated local fallbacks by tag
      const lowerQuery = query.toLowerCase();
      return FALLBACK_GIFS.filter(g => 
        g.title.toLowerCase().includes(lowerQuery) || 
        g.tags.some(t => t.includes(lowerQuery)) ||
        g.category.toLowerCase().includes(lowerQuery)
      );
    }
  }

  async getTrendingGifs(limit = 16): Promise<GifItem[]> {
    const cacheKey = `trending:${limit}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `https://tenor.googleapis.com/v2/featured?key=LIVDTRZ9OROC&limit=${limit}&client_key=breezy_keyboard`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Tenor error");
      const data = await res.json();

      const items: GifItem[] = data.results.map((r: any) => ({
        id: r.id,
        url: r.media_formats?.gif?.url || r.media_formats?.mediumgif?.url,
        previewUrl: r.media_formats?.tinygif?.url || r.media_formats?.nanogif?.url,
        title: r.title || "Trending",
        category: "Trending",
        tags: ["trending"]
      }));

      this.cache.set(cacheKey, items);
      return items;
    } catch (e) {
      console.warn("Tenor API trending fallback active", e);
      return FALLBACK_GIFS;
    }
  }
}

// Instantiate the active provider. This makes it trivial to swap in the future!
export const activeGifProvider: GifProvider = new TenorGifProvider();
