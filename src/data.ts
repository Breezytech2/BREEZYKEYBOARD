/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  KeyboardTheme,
  KeyboardFont,
  UserProfile,
  LanguageInfo,
  GrammarLesson,
  AchievementBadge,
  DailyChallenge,
  VocabularyWord,
  AIProviderType,
  AIThinkingMode
} from "./types";

export const LANGUAGES: Record<string, LanguageInfo> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    predictions: ["the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at"]
  },
  sw: {
    code: "sw",
    name: "Swahili",
    nativeName: "Kiswahili",
    flag: "🇰🇪",
    predictions: ["na", "ya", "wa", "kwa", "katika", "ni", "za", "la", "cha", "vya", "kama", "hadi", "sana", "ambao", "hivyo", "mimi", "sisi", "ndio", "lakini", "hapa"]
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    predictions: ["el", "la", "de", "que", "en", "y", "un", "una", "los", "las", "se", "no", "haber", "con", "por", "para", "como", "estar", "tener", "todo"]
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    predictions: ["le", "la", "les", "de", "un", "une", "et", "en", "que", "qui", "dans", "pour", "dans", "sur", "avec", "nous", "vous", "ils", "elles", "mais"]
  },
  ki: {
    code: "ki",
    name: "Kikuyu",
    nativeName: "Gĩkũyũ",
    flag: "🇰🇪",
    predictions: ["na", "wa", "ya", "nĩ", "kĩ", "ũrĩa", "mũndũ", "atĩ", "tondũ", "ake", "guo", "gũkũ", "andũ", "ndĩ", "ũhoro", "njĩra", "mũgũnda", "kũgĩa", "mũno", "kana"]
  }
};

export const THEMES: KeyboardTheme[] = [
  {
    id: "neon_blue",
    name: "Neon Blue 💠",
    bgClass: "bg-[#040814] border-t border-[#00e5ff]/30",
    keyBgClass: "keycap-blue bg-[#0b132b]/40 hover:bg-[#1c2541]/50 border border-[#00e5ff]/20",
    keyTextClass: "text-[#00e5ff] font-semibold",
    accentClass: "bg-[#00b0ff] text-white font-bold shadow-[0_0_15px_#00e5ff]",
    isAnimated: true,
    animationType: "neon",
    category: "Neon",
    previewColors: ["#00e5ff", "#0088ff"],
    animation: "breathing",
    glowIntensity: 9,
    backgroundEffect: "grid",
    keyStyle: "glass",
    isFavorite: true
  },
  {
    id: "neon_purple",
    name: "Neon Purple 🔮",
    bgClass: "bg-[#070414] border-t border-[#8a2be2]/30",
    keyBgClass: "keycap-purple bg-[#120826]/40 hover:bg-[#210f45]/50 border border-[#8a2be2]/20",
    keyTextClass: "text-[#d946ff] font-semibold",
    accentClass: "bg-[#8a2be2] text-white font-bold shadow-[0_0_15px_#d946ff]",
    isAnimated: true,
    animationType: "neon",
    category: "Neon",
    previewColors: ["#8a2be2", "#d946ff"],
    animation: "breathing",
    glowIntensity: 9,
    backgroundEffect: "grid",
    keyStyle: "glass",
    isFavorite: false
  },
  {
    id: "rgb_rainbow",
    name: "RGB Rainbow 🌈",
    bgClass: "bg-[#050508] border-t border-purple-500/30",
    keyBgClass: "keycap-rgb-flow bg-white/5 hover:bg-white/10 border border-white/10",
    keyTextClass: "text-white font-semibold",
    accentClass: "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white font-bold shadow-[0_0_15px_rgba(255,0,85,0.6)]",
    isAnimated: true,
    animationType: "neon",
    category: "Trending",
    previewColors: ["#ff0055", "#00f0ff", "#ffcc00"],
    animation: "flowing",
    glowIntensity: 10,
    backgroundEffect: "particles",
    keyStyle: "cyberpunk",
    isFavorite: true
  },
  {
    id: "lightning_volt",
    name: "Lightning Storm ⚡",
    bgClass: "bg-[#010105] border-t border-violet-500/30",
    keyBgClass: "keycap-purple bg-[#0f0a1c]/40 hover:bg-[#1e1438]/50 border border-violet-500/20",
    keyTextClass: "text-violet-300 font-semibold",
    accentClass: "bg-violet-600 text-white font-bold shadow-[0_0_15px_#8b5cf6]",
    isAnimated: true,
    animationType: "lightning",
    category: "Sci-Fi",
    previewColors: ["#a855f7", "#ffffff"],
    animation: "pulse",
    glowIntensity: 9,
    backgroundEffect: "lightning",
    keyStyle: "acrylic",
    isFavorite: false
  },
  {
    id: "neon_aurora",
    name: "Galaxy 🌌",
    bgClass: "bg-[#03001e] border-t border-[#ec38bc]/30",
    keyBgClass: "keycap-pink bg-black/40 hover:bg-black/60 border border-[#ec38bc]/20",
    keyTextClass: "text-white font-medium",
    accentClass: "bg-gradient-to-r from-[#ec38bc] to-[#7303c0] text-white font-extrabold shadow-[0_0_15px_rgba(236,56,188,0.8)]",
    isAnimated: true,
    animationType: "galaxy",
    category: "Sci-Fi",
    previewColors: ["#7303c0", "#ec38bc"],
    animation: "flowing",
    glowIntensity: 8,
    backgroundEffect: "stars",
    keyStyle: "glass",
    isFavorite: true
  },
  {
    id: "cyberpunk_neon",
    name: "Cyberpunk 🌆",
    bgClass: "bg-[#0b0313] border-t border-[#fd0054]/40",
    keyBgClass: "keycap-cyan bg-[#190426] hover:bg-[#2d0a40] border border-[#00f0ff]/30",
    keyTextClass: "text-[#00f0ff] font-semibold",
    accentClass: "bg-[#fd0054] text-white font-bold shadow-[0_0_15px_#fd0054]",
    isAnimated: true,
    animationType: "neon",
    category: "Gaming",
    previewColors: ["#fd0054", "#00f0ff"],
    animation: "breathing",
    glowIntensity: 10,
    backgroundEffect: "none",
    keyStyle: "cyberpunk",
    isFavorite: true
  },
  {
    id: "ocean_breeze",
    name: "Ocean Waves 🌊",
    bgClass: "bg-[#05161e] border-t border-[#00e5ff]/20",
    keyBgClass: "keycap-cyan bg-sky-950/40 hover:bg-sky-900/40 border border-sky-400/20",
    keyTextClass: "text-sky-100",
    accentClass: "bg-cyan-500 text-white font-bold shadow-[0_0_15px_rgba(6,182,212,0.6)]",
    isAnimated: true,
    animationType: "ocean",
    category: "Nature",
    previewColors: ["#203a43", "#00e5ff"],
    animation: "breathing",
    glowIntensity: 7,
    backgroundEffect: "wave",
    keyStyle: "acrylic",
    isFavorite: false
  },
  {
    id: "aurora_green",
    name: "Aurora 💚",
    bgClass: "bg-[#020d0f] border-t border-emerald-500/30",
    keyBgClass: "keycap-cyan bg-slate-900/40 hover:bg-slate-800/40 border border-emerald-400/20",
    keyTextClass: "text-emerald-300",
    accentClass: "bg-emerald-500 text-black font-extrabold shadow-[0_0_15px_rgba(16,185,129,0.8)]",
    isAnimated: true,
    animationType: "neon",
    category: "Nature",
    previewColors: ["#0575e6", "#00f260"],
    animation: "flowing",
    glowIntensity: 8,
    backgroundEffect: "aurora",
    keyStyle: "glass",
    isFavorite: false
  },
  {
    id: "neon_fire",
    name: "Fire 🔥",
    bgClass: "bg-[#150202] border-t border-red-500/30",
    keyBgClass: "keycap-pink bg-[#250b0b] hover:bg-[#451212] border border-orange-500/20",
    keyTextClass: "text-orange-400 font-medium",
    accentClass: "bg-gradient-to-r from-orange-500 to-red-600 text-white font-extrabold shadow-[0_0_20px_rgba(239,68,68,0.7)]",
    isAnimated: true,
    animationType: "fire",
    category: "Nature",
    previewColors: ["#f97316", "#ef4444"],
    animation: "pulse",
    glowIntensity: 9,
    backgroundEffect: "flame",
    keyStyle: "acrylic",
    isFavorite: false
  },
  {
    id: "neon_ice",
    name: "Ice ❄️",
    bgClass: "bg-[#0a192f] border-t border-sky-400/30",
    keyBgClass: "keycap-blue bg-sky-950/30 hover:bg-sky-900/40 border border-sky-300/20",
    keyTextClass: "text-sky-200",
    accentClass: "bg-sky-300 text-slate-900 font-bold shadow-[0_0_12px_#38bdf8]",
    isAnimated: true,
    animationType: "neon",
    category: "Nature",
    previewColors: ["#e0f2fe", "#38bdf8"],
    animation: "breathing",
    glowIntensity: 7,
    backgroundEffect: "snow",
    keyStyle: "glass",
    isFavorite: false
  },
  {
    id: "matrix_digital",
    name: "Matrix 🟩",
    bgClass: "bg-[#010a01] border-t border-green-500/30",
    keyBgClass: "keycap-cyan bg-[#021c02]/40 hover:bg-[#053305]/40 border border-green-500/20",
    keyTextClass: "text-green-400 font-semibold",
    accentClass: "bg-green-600 text-black font-bold shadow-[0_0_12px_#22c55e]",
    isAnimated: true,
    animationType: "neon",
    category: "Sci-Fi",
    previewColors: ["#22c55e", "#15803d"],
    animation: "flowing",
    glowIntensity: 8,
    backgroundEffect: "binary",
    keyStyle: "cyberpunk",
    isFavorite: false
  },
  {
    id: "sunset_glow",
    name: "Sunset 🌇",
    bgClass: "bg-[#14050a] border-t border-rose-500/30",
    keyBgClass: "keycap-pink bg-[#2d0a14]/40 hover:bg-[#420f1e]/40 border border-rose-500/20",
    keyTextClass: "text-rose-300 font-semibold",
    accentClass: "bg-gradient-to-r from-rose-500 to-yellow-500 text-white font-bold shadow-[0_0_12px_#f43f5e]",
    isAnimated: true,
    animationType: "neon",
    category: "Ambient",
    previewColors: ["#f43f5e", "#eab308"],
    animation: "breathing",
    glowIntensity: 7,
    backgroundEffect: "gradient",
    keyStyle: "glass",
    isFavorite: false
  },
  {
    id: "sunrise_glow",
    name: "Sunrise 🌅",
    bgClass: "bg-[#1a0c02] border-t border-orange-400/30",
    keyBgClass: "keycap-pink bg-[#331804]/40 hover:bg-[#4a2306]/40 border border-orange-400/20",
    keyTextClass: "text-orange-200 font-semibold",
    accentClass: "bg-gradient-to-r from-orange-400 to-yellow-400 text-slate-900 font-bold shadow-[0_0_12px_#f97316]",
    isAnimated: true,
    animationType: "neon",
    category: "Ambient",
    previewColors: ["#ff7e5f", "#feb47b"],
    animation: "breathing",
    glowIntensity: 7,
    backgroundEffect: "gradient",
    keyStyle: "acrylic",
    isFavorite: false
  },
  {
    id: "deep_space",
    name: "Space 🌌",
    bgClass: "bg-[#020205] border-t border-indigo-500/20",
    keyBgClass: "keycap-purple bg-indigo-950/20 hover:bg-indigo-900/30 border border-indigo-500/10",
    keyTextClass: "text-indigo-200",
    accentClass: "bg-indigo-600 text-white font-bold shadow-[0_0_10px_rgba(99,102,241,0.5)]",
    isAnimated: true,
    animationType: "galaxy",
    category: "Sci-Fi",
    previewColors: ["#0f172a", "#38bdf8"],
    animation: "flowing",
    glowIntensity: 6,
    backgroundEffect: "stars",
    keyStyle: "glass",
    isFavorite: false
  },
  {
    id: "rain_simulation",
    name: "Rain 🌧️",
    bgClass: "bg-[#0c101b] border-t border-blue-900/30",
    keyBgClass: "keycap-blue bg-white/5 hover:bg-white/10 border border-white/10",
    keyTextClass: "text-blue-200",
    accentClass: "bg-blue-600/70 text-white font-bold shadow-[0_0_12px_rgba(37,99,235,0.5)]",
    isAnimated: true,
    animationType: "rain",
    category: "Nature",
    previewColors: ["#1d4ed8", "#60a5fa"],
    animation: "flowing",
    glowIntensity: 6,
    backgroundEffect: "rain",
    keyStyle: "acrylic",
    isFavorite: false
  },
  {
    id: "snow_animation",
    name: "Snow ❄️",
    bgClass: "bg-[#0b1d33] border-t border-blue-200/20",
    keyBgClass: "keycap-blue bg-sky-900/20 hover:bg-sky-900/40 border border-white/5",
    keyTextClass: "text-blue-100",
    accentClass: "bg-sky-100 text-sky-950 font-bold shadow-[0_0_12px_rgba(240,249,255,0.7)]",
    isAnimated: true,
    animationType: "snow",
    category: "Nature",
    previewColors: ["#0f172a", "#ffffff"],
    animation: "breathing",
    glowIntensity: 6,
    backgroundEffect: "snow",
    keyStyle: "glass",
    isFavorite: false
  },
  {
    id: "sakura_spring",
    name: "Sakura 🌸",
    bgClass: "bg-[#1f1015] border-t border-pink-400/30",
    keyBgClass: "keycap-pink bg-pink-950/20 hover:bg-pink-900/30 border border-pink-400/10",
    keyTextClass: "text-pink-300",
    accentClass: "bg-pink-400 text-white font-bold shadow-[0_0_12px_#f472b6]",
    isAnimated: true,
    animationType: "neon",
    category: "Nature",
    previewColors: ["#fdf2f8", "#f472b6"],
    animation: "breathing",
    glowIntensity: 6,
    backgroundEffect: "cherry_blossom",
    keyStyle: "glass",
    isFavorite: false
  },
  {
    id: "dark_amoled",
    name: "Dark AMOLED 🖤",
    bgClass: "bg-black border-t border-zinc-900",
    keyBgClass: "keycap-rgb-flow bg-zinc-950 hover:bg-zinc-900 border border-zinc-900",
    keyTextClass: "text-zinc-100",
    accentClass: "bg-zinc-800 text-white font-bold",
    isAnimated: false,
    category: "Minimal",
    previewColors: ["#000000", "#18181b"],
    animation: "none",
    glowIntensity: 2,
    backgroundEffect: "none",
    keyStyle: "solid",
    isFavorite: false
  },
  {
    id: "crystal_glass",
    name: "Crystal Glass 💎",
    bgClass: "bg-white/5 border-t border-white/20 backdrop-blur-3xl",
    keyBgClass: "keycap-cyan bg-white/10 hover:bg-white/20 border border-white/20",
    keyTextClass: "text-white",
    accentClass: "bg-white/30 text-white border border-white/40 font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]",
    isAnimated: true,
    animationType: "neon",
    category: "Minimal",
    previewColors: ["#ffffff", "#e4e4e7"],
    animation: "breathing",
    glowIntensity: 7,
    backgroundEffect: "glass_reflection",
    keyStyle: "glass",
    isFavorite: false
  },
  {
    id: "electric_pulse",
    name: "Electric Pulse ⚡",
    bgClass: "bg-[#08020d] border-t border-rose-500/30",
    keyBgClass: "keycap-pink bg-[#1a042e]/40 hover:bg-[#2d094d]/40 border border-rose-500/20",
    keyTextClass: "text-rose-400 font-semibold",
    accentClass: "bg-rose-500 text-white font-bold shadow-[0_0_15px_#f43f5e]",
    isAnimated: true,
    animationType: "neon",
    category: "Gaming",
    previewColors: ["#3b82f6", "#ef4444"],
    animation: "pulse",
    glowIntensity: 10,
    backgroundEffect: "grid",
    keyStyle: "cyberpunk",
    isFavorite: false
  }
];

export const FONTS: KeyboardFont[] = [
  { id: "font_inter", name: "Inter (Classic)", className: "font-sans" },
  { id: "font_space_grotesk", name: "Space Grotesk (Tech)", className: "font-mono" },
  { id: "font_playfair", name: "Playfair (Editorial) ✨", className: "font-serif" },
  { id: "font_jetbrains", name: "JetBrains (Code)", className: "font-mono" },
  { id: "font_comic", name: "Comic Craft 🎨", className: "font-sans font-semibold tracking-wide" },
  { id: "font_marker", name: "Neon Marker 🖌️", className: "font-serif tracking-wider capitalize" }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: "Breezy Typist",
  email: "guest@breezykeyboard.com",
  aiRequestCount: 0,
  aiLimitResetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  streak: 3,
  totalPoints: 120,
  achievements: ["first_typing", "ai_grammar_fix"],
  aiSettings: {
    provider: AIProviderType.GEMINI,
    thinkingMode: AIThinkingMode.NORMAL,
    voiceAutoPunctuation: true,
    voiceRemoveFiller: true,
    translateWhileTyping: false,
    detectLanguage: true,
    incognitoMode: false
  },
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
  username: "breezy_typist",
  country: "United States",
  preferredLanguage: "English",
  themePreference: "cyberpunk_neon",
  brightnessPreference: 85,
  fontPreference: "font_inter",
  emojiPreference: "classic",
  stickerPreference: "vector_pack"
};

export const ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: "first_typing",
    title: "First Contact",
    description: "Type your very first words with BreezyKeyboard.",
    icon: "⌨️",
    points: 10
  },
  {
    id: "ai_grammar_fix",
    title: "Grammar Master",
    description: "Correct grammar for the first time using Breezy AI.",
    icon: "🧠",
    points: 20
  },
  {
    id: "theme_explorer",
    title: "Vibe Curator",
    description: "Customize your layout and set an animated theme.",
    icon: "🎨",
    points: 15
  },
  {
    id: "vocab_champ",
    title: "Word of the Day",
    description: "Successfully master a vocabulary daily challenge.",
    icon: "📚",
    points: 25
  },
  {
    id: "polyglot_writer",
    title: "Global Communicator",
    description: "Translate your text inline using Breezy Translate.",
    icon: "🌍",
    points: 30
  },
  {
    id: "security_shield",
    title: "Fort Knox",
    description: "Scan your drafts to verify that no sensitive data is leaked.",
    icon: "🛡️",
    points: 25
  }
];

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: "g_en_1",
    title: "English: Its vs It's",
    explanation: "'It's' is a contraction of 'it is' or 'it has'. 'Its' is a possessive pronoun indicating ownership.",
    examples: ["It's a beautiful day.", "The dog wagged its tail."],
    quizQuestion: "Which sentence is correct?",
    quizOptions: [
      "The smartphone lost it's signal.",
      "The smartphone lost its signal.",
      "Its a lovely evening tonight."
    ],
    quizAnswer: "The smartphone lost its signal.",
    points: 20
  },
  {
    id: "g_sw_1",
    title: "Swahili: Ngeli za Nomino (U-I)",
    explanation: "Noun class U-I deals with living things starting with 'M-' in singular and 'Mi-' in plural.",
    examples: ["Mti unaanguka (The tree is falling).", "Miti inaanguka (The trees are falling)."],
    quizQuestion: "What is the plural of 'Mchungwa' (orange tree)?",
    quizOptions: [
      "Migungwa",
      "Wachungwa",
      "Michungwa"
    ],
    quizAnswer: "Michungwa",
    points: 25
  },
  {
    id: "g_es_1",
    title: "Spanish: Por vs Para",
    explanation: "'Por' is used for cause, duration, exchange, and means of transport. 'Para' is used for destination, recipient, deadline, and goals.",
    examples: ["Estudio para ser doctor (Goal).", "Hablamos por teléfono (Means)."],
    quizQuestion: "Fill in: 'Este regalo es ___ ti.' (This gift is for you.)",
    quizOptions: [
      "por",
      "para",
      "de"
    ],
    quizAnswer: "para",
    points: 20
  },
  {
    id: "g_fr_1",
    title: "French: C'est vs Il est",
    explanation: "Use 'C'est' before modified nouns, proper names, or adjectives expressing feelings. Use 'Il est' before professions, nationalities, or adjectives modifying nouns directly.",
    examples: ["C'est un grand livre.", "Il est ingénieur."],
    quizQuestion: "Which one is correct for: 'He is French'?",
    quizOptions: [
      "Il est français",
      "C'est français",
      "Il est un français"
    ],
    quizAnswer: "Il est français",
    points: 20
  }
];

export const WORD_OF_THE_DAY_FALLBACKS: VocabularyWord[] = [
  {
    word: "Serendipity",
    meaning: "The occurrence of events by chance in a happy or beneficial way.",
    example: "We found the charming little cafe by pure serendipity.",
    pronunciation: "/ˌserənˈdipədē/",
    language: "en"
  },
  {
    word: "Amani",
    meaning: "Peace, harmony, and freedom from stress or violence.",
    example: "Tunatafuta amani na usalama katika maisha yetu.",
    pronunciation: "/ah-mah-nee/",
    language: "sw"
  },
  {
    word: "Ataraxia",
    meaning: "A state of serene calmness and untroubled mind.",
    example: "The monk achieved ataraxia through daily mindfulness and focus.",
    pronunciation: "/ˌatəˈraksēə/",
    language: "en"
  },
  {
    word: "Ubora",
    meaning: "Excellence, top-grade status, or outstanding quality.",
    example: "Kazi hii inaonyesha ubora wa kipekee.",
    pronunciation: "/oo-boh-rah/",
    language: "sw"
  }
];

export const FAVORITE_PROMPTS = [
  { title: "Professional Rephrase", text: "Please rewrite this draft in a highly professional, polite business tone:" },
  { title: "Write an Instagram Caption", text: "Create a catchy Instagram caption for this with relevant hashtags:" },
  { title: "Formal Email Draft", text: "Draft a concise formal email requesting a meeting regarding:" },
  { title: "Explain like I'm 5", text: "Explain this concept in simple, accessible analogies for a child:" },
  { title: "Sassy Comeback", text: "Generate a witty, cheeky, but respectful reply to this comment:" }
];

export const DEFAULT_LIGHTING_SETTINGS = {
  brightness: 75,
  glowIntensity: 50,
  underglow: 50,
  speed: "normal",
  mode: "rainbow",
  color: "rainbow",
  keyLighting: {
    letters: true,
    functionKeys: true,
    spacebar: true,
    enter: true,
    backspace: true,
    shift: true,
    numberRow: true
  }
};

export const PRESET_LIGHTING_COLORS = [
  { name: "Cyan", value: "#00e5ff" },
  { name: "Electric Blue", value: "#0088ff" },
  { name: "Purple", value: "#8a2be2" },
  { name: "Pink", value: "#d946ff" },
  { name: "Red", value: "#ff0055" },
  { name: "Orange", value: "#f97316" },
  { name: "Yellow", value: "#ffcc00" },
  { name: "Green", value: "#00f260" },
  { name: "White", value: "#ffffff" },
  { name: "Gold", value: "#ffd700" },
  { name: "Rainbow", value: "rainbow" }
];

