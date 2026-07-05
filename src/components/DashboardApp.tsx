/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { BreezyKeyboard } from "./BreezyKeyboard";
import { AiHubTab } from "./dashboard/AiHubTab";
import { AcademyTab } from "./dashboard/AcademyTab";
import { AboutTab } from "./dashboard/AboutTab";
import { PrivacyLegalTab } from "./dashboard/PrivacyLegalTab";
import { HelpSupportTab } from "./dashboard/HelpSupportTab";
import { OnboardingTour } from "./dashboard/OnboardingTour";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, setDoc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import {
  KeyboardTheme,
  KeyboardFont,
  UserProfile,
  SupportedLanguage,
  KeyboardLayoutType,
  GrammarLesson,
  DailyChallenge,
  VocabularyWord,
  AchievementBadge,
  Note,
  KeyboardLightingSettings,
  AISettings,
  AIProviderType,
  AIThinkingMode
} from "../types";
import {
  THEMES,
  FONTS,
  GRAMMAR_LESSONS,
  ACHIEVEMENTS,
  FAVORITE_PROMPTS,
  WORD_OF_THE_DAY_FALLBACKS,
  DEFAULT_LIGHTING_SETTINGS,
  PRESET_LIGHTING_COLORS
} from "../data";
import { BUILT_IN_FONTS, loadGoogleFont } from "../fontsData";
import {
  Sparkles,
  BookOpen,
  Award,
  Palette,
  EyeOff,
  Sliders,
  CheckCircle,
  Plus,
  Trash,
  HelpCircle,
  Play,
  RotateCcw,
  Zap,
  Globe,
  Lock,
  Volume2,
  FileText,
  User,
  Heart,
  Search,
  MessageSquare,
  Bookmark,
  Activity,
  Mic,
  Languages,
  Type as FontIcon,
  FolderLock,
  History,
  Info,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Smile,
  Image,
  Vibrate,
  Accessibility,
  Cloud,
  Layout,
  ArrowsUpFromLine as HeightIcon,
  Settings,
  Video
} from "lucide-react";

import { ALL_LANGUAGES, LanguageInfo } from "../data/languages";

interface DashboardAppProps {
  userProfile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  activeTab: string; // "ai" | "learn" | "themes" | "protect" | "settings" | "hub"
  onCloseApp: () => void;
  onSelectTheme: (theme: KeyboardTheme) => void;
  onSelectFont: (font: KeyboardFont) => void;
  activeThemeId: string;
  activeFontId: string;
  keyboardHeight: number;
  setKeyboardHeight: (val: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (val: boolean) => void;
  incognitoMode: boolean;
  setIncognitoMode: (val: boolean) => void;
  isAutoCorrectionEnabled: boolean;
  setAutoCorrectionEnabled: (val: boolean) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  keyboardLayout: KeyboardLayoutType;
  setLayout: (layout: KeyboardLayoutType) => void;
  notes: Note[];
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  aiHistory: { prompt: string; response: string; date: string }[];
  lightingSettings?: KeyboardLightingSettings;
  onUpdateLightingSettings?: (settings: KeyboardLightingSettings) => void;
  aiSettings: AISettings;
  onUpdateAiSettings: (settings: AISettings) => void;
}

export const DashboardApp: React.FC<DashboardAppProps> = ({
  userProfile,
  onChangeProfile,
  activeTab: initialTab,
  onCloseApp,
  onSelectTheme,
  onSelectFont,
  activeThemeId,
  activeFontId,
  keyboardHeight,
  setKeyboardHeight,
  soundEnabled,
  setSoundEnabled,
  vibrationEnabled,
  setVibrationEnabled,
  incognitoMode,
  setIncognitoMode,
  isAutoCorrectionEnabled,
  setAutoCorrectionEnabled,
  language,
  setLanguage,
  keyboardLayout,
  setLayout,
  notes,
  onAddNote,
  onDeleteNote,
  aiHistory,
  lightingSettings,
  onUpdateLightingSettings,
  aiSettings,
  onUpdateAiSettings
}) => {
  const [activeSubTab, setActiveSubTab] = useState<string>(initialTab || "ai");
  const [showSessionOnboarding, setShowSessionOnboarding] = useState<boolean>(true);
  const [currentVideo, setCurrentVideo] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("breezy_kb_bg_video") || "none";
    }
    return "none";
  });

  // Learning states
  const [wordOfTheDay, setWordOfTheDay] = useState<VocabularyWord>(WORD_OF_THE_DAY_FALLBACKS[0]);
  const [wordLoading, setWordLoading] = useState<boolean>(false);
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [lessons, setLessons] = useState<GrammarLesson[]>(GRAMMAR_LESSONS);

  // Load learning progress (completed quizzes) from Firestore when authenticated
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const q = query(
          collection(db, "learning_progress"),
          where("userId", "==", user.uid)
        );
        
        getDocs(q).then((snapshot) => {
          const completed: Record<string, boolean> = {};
          const answers: Record<string, string> = {};
          
          snapshot.docs.forEach(doc => {
            const data = doc.data();
            if (data.lessonId) {
              completed[data.lessonId] = true;
              if (data.selectedAnswer) {
                answers[data.lessonId] = data.selectedAnswer;
              }
            }
          });
          
          setCompletedQuizzes(completed);
          setQuizAnswers(answers);
        }).catch((err) => {
          console.error("Error loading learning progress from Firestore:", err);
        });
      } else {
        setCompletedQuizzes({});
        setQuizAnswers({});
      }
    });

    return unsubscribeAuth;
  }, []);

  // Custom theme builder states
  const [customThemeName, setCustomThemeName] = useState<string>("My Glass Retro");
  const [customBg, setCustomBg] = useState<string>("#0b0c10");
  const [customKeyBg, setCustomKeyBg] = useState<string>("#1f2833");
  const [customText, setCustomText] = useState<string>("#66fcf1");
  const [customAccent, setCustomAccent] = useState<string>("#45f3ff");
  // Theme Preview States
  const [previewThemeId, setPreviewThemeId] = useState<string>(activeThemeId);
  const [previewFontId, setPreviewFontId] = useState<string>(activeFontId);

  // New Settings Search State
  const [settingsSearchQuery, setSettingsSearchQuery] = useState<string>("");
  const [languageSearchQuery, setLanguageSearchQuery] = useState<string>("");

  // Profile Form States
  const [editName, setEditName] = useState(userProfile?.name || "");
  const [editUsername, setEditUsername] = useState(userProfile?.username || "");
  const [editAvatar, setEditAvatar] = useState(userProfile?.avatarUrl || "");
  const [editCountry, setEditCountry] = useState(userProfile?.country || "United States");
  const [editLanguage, setEditLanguage] = useState(userProfile?.preferredLanguage || "English");
  const [editTheme, setEditTheme] = useState(userProfile?.themePreference || "cyberpunk_neon");
  const [editBrightness, setEditBrightness] = useState(userProfile?.brightnessPreference ?? 85);
  const [editFont, setEditFont] = useState(userProfile?.fontPreference || "font_inter");
  const [editEmoji, setEditEmoji] = useState(userProfile?.emojiPreference || "classic");
  const [editSticker, setEditSticker] = useState(userProfile?.stickerPreference || "vector_pack");
  const [editAi, setEditAi] = useState(userProfile?.aiSettings?.provider || "gemini");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Keyboard Personalization state hook variables
  const [persHeight, setPersHeight] = useState<number>(() => Number(localStorage.getItem("breezy_kb_height") || keyboardHeight || "100"));
  const [persWidth, setPersWidth] = useState<number>(() => Number(localStorage.getItem("breezy_kb_key_width") || "100"));
  const [persSpacing, setPersSpacing] = useState<number>(() => Number(localStorage.getItem("breezy_kb_key_spacing") || "4"));
  const [persRadius, setPersRadius] = useState<number>(() => Number(localStorage.getItem("breezy_kb_key_radius") || "12"));
  const [persLabelSize, setPersLabelSize] = useState<number>(() => Number(localStorage.getItem("breezy_kb_label_size") || "14"));
  const [persFontSize, setPersFontSize] = useState<number>(() => Number(localStorage.getItem("breezy_kb_font_size") || "14"));
  const [persBgOpacity, setPersBgOpacity] = useState<number>(() => Number(localStorage.getItem("breezy_kb_bg_opacity") || "80"));
  const [persPressAnim, setPersPressAnim] = useState<string>(() => localStorage.getItem("breezy_kb_key_press_anim") || "bubble");
  const [persSoundType, setPersSoundType] = useState<string>(() => localStorage.getItem("breezy_kb_press_sound_type") || "mechanical");
  const [persVibeStrength, setPersVibeStrength] = useState<number>(() => Number(localStorage.getItem("breezy_kb_vibe_strength") || "15"));
  const [persLongPress, setPersLongPress] = useState<number>(() => Number(localStorage.getItem("breezy_kb_long_press_duration") || "450"));

  // Accessibility state variables
  const [accContrast, setAccContrast] = useState<boolean>(() => localStorage.getItem("breezy_accessibility_high_contrast") === "true");
  const [accColorBlind, setAccColorBlind] = useState<string>(() => localStorage.getItem("breezy_accessibility_color_blind") || "none");
  const [accScreenReader, setAccScreenReader] = useState<boolean>(() => localStorage.getItem("breezy_accessibility_screen_reader") === "true");

  const triggerSettingsSync = () => {
    window.dispatchEvent(new Event("breezy_settings_updated"));
  };

  const savePersSetting = (key: string, value: any) => {
    localStorage.setItem(key, String(value));
    if (key === "breezy_kb_height") {
      setKeyboardHeight(Number(value));
    }
    triggerSettingsSync();
  };

  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.name || "");
      setEditUsername(userProfile.username || "");
      setEditAvatar(userProfile.avatarUrl || "");
      setEditCountry(userProfile.country || "United States");
      setEditLanguage(userProfile.preferredLanguage || "English");
      setEditTheme(userProfile.themePreference || "cyberpunk_neon");
      setEditBrightness(userProfile.brightnessPreference ?? 85);
      setEditFont(userProfile.fontPreference || "font_inter");
      setEditEmoji(userProfile.emojiPreference || "classic");
      setEditSticker(userProfile.stickerPreference || "vector_pack");
      setEditAi(userProfile.aiSettings?.provider || "gemini");
    }
  }, [userProfile]);

  const handleSaveProfile = () => {
    setSaveStatus("saving");
    const updatedProfile: UserProfile = {
      ...userProfile,
      name: editName,
      username: editUsername,
      avatarUrl: editAvatar,
      country: editCountry,
      preferredLanguage: editLanguage,
      themePreference: editTheme,
      brightnessPreference: editBrightness,
      fontPreference: editFont,
      emojiPreference: editEmoji,
      stickerPreference: editSticker,
      aiSettings: {
        ...userProfile.aiSettings,
        provider: editAi as any
      }
    };
    onChangeProfile(updatedProfile);
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
  };

  // New Live Themes States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("breezy_favorites");
      if (saved) return JSON.parse(saved);
    }
    return THEMES.filter(t => t.isFavorite).map(t => t.id);
  });
  const [liveThemes, setLiveThemes] = useState<KeyboardTheme[]>(() => {
    // If the theme list is empty, automatically load a built-in collection of live themes
    return THEMES && THEMES.length > 0 ? THEMES : [];
  });
  const [themesLoading, setThemesLoading] = useState<boolean>(false);
  const [themesError, setThemesError] = useState<string | null>(null);

  // New Font Browser States
  const [fontSearchQuery, setFontSearchQuery] = useState<string>("");
  const [selectedFontCategory, setSelectedFontCategory] = useState<string>("All");
  const [favoriteFonts, setFavoriteFonts] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("breezy_favorite_fonts");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return []; }
      }
    }
    return ["font_inter", "font_space_grotesk", "font_orbitron", "font_pacifico"];
  });
  const [recentFonts, setRecentFonts] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("breezy_recent_fonts");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { return []; }
      }
    }
    return [];
  });

  const updateRecentFonts = (fontId: string) => {
    setRecentFonts(prev => {
      const next = [fontId, ...prev.filter(id => id !== fontId)].slice(0, 10);
      if (typeof window !== "undefined") {
        localStorage.setItem("breezy_recent_fonts", JSON.stringify(next));
      }
      return next;
    });
  };

  const loadThemesAsync = (forceError = false) => {
    setThemesLoading(true);
    setThemesError(null);
    const timer = setTimeout(() => {
      if (forceError) {
        setThemesError("Failed to fetch live themes catalog. Network request timed out.");
        setThemesLoading(false);
      } else {
        // Automatically ensure liveThemes has built-in themes if empty
        if (!liveThemes || liveThemes.length === 0) {
          setLiveThemes(THEMES);
        }
        setThemesLoading(false);
      }
    }, 500);
    return timer;
  };

  useEffect(() => {
    const timer = loadThemesAsync(false);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory]);

  const toggleFavorite = (themeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(themeId) ? prev.filter(id => id !== themeId) : [...prev, themeId];
      if (typeof window !== "undefined") {
        localStorage.setItem("breezy_favorites", JSON.stringify(next));
      }
      return next;
    });
  };

  // Notes states
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteContent, setNoteContent] = useState<string>("");

  const updateAiSettings = (updates: Partial<AISettings>) => {
    onUpdateAiSettings({ ...aiSettings, ...updates });
  };

  const updateLighting = (updates: Partial<KeyboardLightingSettings>) => {
    if (onUpdateLightingSettings && lightingSettings) {
      onUpdateLightingSettings({ ...lightingSettings, ...updates });
    }
  };

  useEffect(() => {
    if (initialTab) {
      setActiveSubTab(initialTab);
    }
  }, [initialTab]);

  // Fetch AI generated Word of the Day
  const handleFetchWordOfTheDay = async () => {
    setWordLoading(true);
    try {
      const res = await fetch("/api/gemini/keyboard-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate-word",
          text: "vocabulary challenge",
          options: {
            lang: language,
            langName: language === "sw" ? "Swahili" : language === "es" ? "Spanish" : language === "fr" ? "French" : language === "ki" ? "Kikuyu" : "English"
          }
        })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setWordOfTheDay(data.result);
      }
    } catch (e) {
      // fallback based on language selection
      const fallback = WORD_OF_THE_DAY_FALLBACKS.find(w => w.language === language) || WORD_OF_THE_DAY_FALLBACKS[0];
      setWordOfTheDay(fallback);
    } finally {
      setWordLoading(false);
    }
  };

  useEffect(() => {
    handleFetchWordOfTheDay();
  }, [language]);

  // Quiz evaluation
  const handleQuizSubmit = (lessonId: string, selected: string, correct: string, pts: number) => {
    if (completedQuizzes[lessonId]) return;

    setQuizAnswers(prev => ({ ...prev, [lessonId]: selected }));

    if (selected === correct) {
      setCompletedQuizzes(prev => ({ ...prev, [lessonId]: true }));
      
      // Update User Profile with points & streak
      const updatedProfile = {
        ...userProfile,
        totalPoints: userProfile.totalPoints + pts,
        streak: userProfile.streak + 1
      };
      
      // Check for first completed lesson achievement
      if (!updatedProfile.achievements.includes("vocab_champ")) {
        updatedProfile.achievements.push("vocab_champ");
      }
      
      onChangeProfile(updatedProfile);

      // Save progress to Firestore
      if (auth.currentUser) {
        addDoc(collection(db, "learning_progress"), {
          userId: auth.currentUser.uid,
          lessonId,
          selectedAnswer: selected,
          completedAt: serverTimestamp(),
          wpm: 0,
          accuracy: 100
        }).catch((err) => {
          console.error("Error saving learning progress to Firestore:", err);
        });
      }
    }
  };

  // Custom Theme compilation
  const handleCompileCustomTheme = () => {
    const customTheme: KeyboardTheme = {
      id: "custom_user_theme",
      name: customThemeName || "Custom Glass",
      bgClass: `bg-[${customBg}]/20 backdrop-blur-3xl border-t border-white/20`,
      keyBgClass: `bg-[${customKeyBg}]/30 hover:bg-[${customKeyBg}]/50 border border-white/30 backdrop-blur-sm shadow-sm`,
      keyTextClass: `text-[${customText}] font-bold drop-shadow-sm`,
      accentClass: `bg-[${customAccent}]/40 text-[${customText}] font-bold border border-white/40 shadow-sm backdrop-blur-md`
    };
    onSelectTheme(customTheme);
  };

  return (
    <div className="w-full h-full bg-slate-900/10 text-slate-100 flex flex-col font-sans overflow-hidden">
      
      {/* APP TOP NAVIGATION BAR */}
      <div className="w-full h-14 bg-white/10 backdrop-blur-3xl border-b border-white/20 flex items-center justify-between px-3.5 shadow-sm relative z-20">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/20 border border-white/30 p-0.5 shadow-sm">
            <div className="w-full h-full rounded-[10px] bg-slate-900/50 flex items-center justify-center font-bold text-white text-xs">
              BK
            </div>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight font-display text-white uppercase">BREEZYKEYBOARD</h1>
            <p className="text-[8.5px] text-white/70 font-mono font-medium tracking-widest uppercase">The Companion Academy</p>
          </div>
        </div>

        <button
          onClick={onCloseApp}
          className="text-[10.5px] font-bold px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-xl text-white border border-white/30 backdrop-blur-md shadow-sm transition-all active:scale-95"
        >
          Close App
        </button>
      </div>

      {/* HORIZONTAL APP CATEGORY SLIDER */}
      <div className="w-full h-11 border-b border-white/20 bg-slate-900/20 backdrop-blur-3xl flex items-center px-2 overflow-x-auto no-scrollbar space-x-1.5 shrink-0 shadow-sm">
        {[
          { id: "ai", label: "AI Hub", icon: Sparkles },
          { id: "learn", label: "Academy", icon: BookOpen },
          { id: "translate", label: "Translate", icon: Languages },
          { id: "protect", label: "Protect", icon: ShieldCheck },
          { id: "history", label: "AI History", icon: History },
          { id: "settings", label: "Settings", icon: Sliders },
          { id: "profile", label: "Profile", icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl flex items-center space-x-1 text-xs font-bold whitespace-nowrap transition-all ${isActive ? "bg-white/20 text-white border border-white/30 shadow-md" : "text-white/60 hover:text-white"}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* PRIMARY ACTIVE INTERFACE BODY */}
      <div className="flex-1 w-full overflow-y-auto p-4 space-y-4 no-scrollbar pb-16">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: AI HUB */}
          {activeSubTab === "ai" && (
            <AiHubTab 
              userProfile={userProfile} 
              aiHistory={aiHistory} 
            />
          )}

          {/* TAB 2: GLASS ACADEMY (LEARN) */}
          {activeSubTab === "learn" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              {/* Scorecard row */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-white/10 backdrop-blur-2xl p-3 rounded-2xl border border-white/20 text-center space-y-0.5 shadow-lg">
                  <span className="text-[9px] font-semibold text-white/70 uppercase tracking-widest block font-display">Active Streak</span>
                  <span className="text-base font-bold text-white font-mono drop-shadow-sm">🔥 {userProfile.streak} Days</span>
                </div>
                <div className="bg-white/10 backdrop-blur-2xl p-3 rounded-2xl border border-white/20 text-center space-y-0.5 shadow-lg">
                  <span className="text-[9px] font-semibold text-white/70 uppercase tracking-widest block font-display">Academy XP</span>
                  <span className="text-base font-bold text-white font-mono drop-shadow-sm">💎 {userProfile.totalPoints} XP</span>
                </div>
                <div className="bg-white/10 backdrop-blur-2xl p-3 rounded-2xl border border-white/20 text-center space-y-0.5 shadow-lg">
                  <span className="text-[9px] font-semibold text-white/70 uppercase tracking-widest block font-display">Badges</span>
                  <span className="text-base font-bold text-white font-mono drop-shadow-sm">🏅 {userProfile.achievements.length}</span>
                </div>
              </div>

              {/* Dynamic Word of the Day Widget */}
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 space-y-3 relative backdrop-blur-2xl shadow-lg">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 bg-white/20 text-white rounded-lg text-[9px] font-bold border border-white/30 uppercase tracking-wide shadow-sm">
                    Word of the Day ({language.toUpperCase()})
                  </span>
                  <button
                    onClick={handleFetchWordOfTheDay}
                    disabled={wordLoading}
                    className="text-[10px] font-bold text-white hover:underline flex items-center space-x-1"
                  >
                    <span>{wordLoading ? "Generating..." : "Next Word ⚡"}</span>
                  </button>
                </div>

                {wordLoading ? (
                  <div className="py-6 flex flex-col items-center space-y-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shadow-sm" />
                    <span className="text-xs text-white/70">Glass AI is crafting new vocabulary challenge...</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div>
                      <h3 className="text-lg font-bold text-white">{wordOfTheDay.word}</h3>
                      <span className="text-xs text-white/70 font-mono">{wordOfTheDay.pronunciation}</span>
                    </div>
                    <p className="text-xs text-white bg-black/20 p-2.5 rounded-lg border border-white/20 leading-relaxed shadow-inner">
                      <span className="font-bold text-white mr-1.5">Definition:</span>
                      {wordOfTheDay.meaning}
                    </p>
                    <p className="text-xs text-white/80 italic">
                      <span className="font-bold text-white/60 block not-italic uppercase text-[9px] tracking-wide mb-0.5">Example Usage:</span>
                      "{wordOfTheDay.example}"
                    </p>
                  </div>
                )}
              </div>

              {/* Grammar Quizzes */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wide">Dynamic Grammar Quizzes</h4>
                <div className="space-y-3">
                  {lessons.map(lesson => {
                    const isCompleted = completedQuizzes[lesson.id];
                    const chosen = quizAnswers[lesson.id];

                    return (
                      <div key={lesson.id} className="bg-white/10 p-4 rounded-2xl border border-white/20 space-y-3 backdrop-blur-2xl shadow-lg">
                        <div className="flex justify-between items-center">
                          <h5 className="text-xs font-bold text-white">{lesson.title}</h5>
                          <span className="px-2 py-0.5 bg-white/20 rounded-lg text-[9px] font-mono text-white font-bold border border-white/30 shadow-sm">
                            +{lesson.points} XP
                          </span>
                        </div>
                        <p className="text-[11.5px] text-white/80 leading-relaxed">{lesson.explanation}</p>
                        
                        <div className="bg-black/20 p-2 rounded-lg border border-white/20 space-y-1 shadow-inner">
                          <span className="text-[9px] font-bold text-white/60 uppercase tracking-wide block">Example:</span>
                          {lesson.examples.map((ex, i) => (
                            <p key={i} className="text-xs italic text-white/70">"{ex}"</p>
                          ))}
                        </div>

                        {/* Quiz module */}
                        <div className="border-t border-white/20 pt-3 space-y-2 mt-2">
                          <p className="text-xs font-semibold text-white">{lesson.quizQuestion}</p>
                          <div className="space-y-1.5">
                            {lesson.quizOptions.map((opt, oIdx) => {
                              const isSelected = chosen === opt;
                              const isCorrect = opt === lesson.quizAnswer;
                              let btnStyle = "bg-white/10 border-white/20 text-white hover:bg-white/20";
                              
                              if (chosen) {
                                if (isCorrect) btnStyle = "bg-green-500/30 border-green-500/50 text-white";
                                else if (isSelected) btnStyle = "bg-red-500/30 border-red-500/50 text-white";
                              }

                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleQuizSubmit(lesson.id, opt, lesson.quizAnswer, lesson.points)}
                                  disabled={chosen !== undefined}
                                  className={`w-full p-2 text-left rounded-lg text-xs font-semibold border transition-all shadow-sm ${btnStyle}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {isCompleted && (
                            <div className="text-[11px] font-bold text-white flex items-center space-x-1 py-1 bg-white/5 px-2 rounded">
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Correct! Awarded +{lesson.points} Points and extended typing streak!</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Achievement badges showcase */}
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 space-y-3 backdrop-blur-2xl shadow-lg">
                <h4 className="text-xs font-semibold text-white/80 uppercase tracking-wide">Unlocked Typing Achievements</h4>
                <div className="grid grid-cols-2 gap-2">
                  {ACHIEVEMENTS.map(badge => {
                    const isUnlocked = userProfile.achievements.includes(badge.id);
                    return (
                      <div
                        key={badge.id}
                        className={`p-2.5 rounded-xl border transition-all flex items-center space-x-2.5 ${isUnlocked ? "bg-white/20 border-white/30 shadow-md" : "bg-white/5 border-white/10 opacity-60"}`}
                      >
                        <span className="text-xl shrink-0">{badge.icon}</span>
                        <div className="min-w-0">
                          <h5 className="text-[10.5px] font-bold text-white truncate">{badge.title}</h5>
                          <p className="text-[8.5px] text-white/70 line-clamp-2">{badge.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
          {/* TAB 3: LIVE THEMES */}
          {activeSubTab === "themes" && (() => {
            const previewTheme = liveThemes.find(t => t.id === previewThemeId) || liveThemes[0] || THEMES[0];
            const previewFont = FONTS.find(f => f.id === previewFontId) || FONTS[0];

            const categories = ["All", "Favorites", "Neon", "Sci-Fi", "Gaming", "Nature", "Ambient", "Minimal"];

            const filteredThemes = liveThemes.filter(th => {
              const matchesSearch = th.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    (th.category && th.category.toLowerCase().includes(searchQuery.toLowerCase()));
              if (!matchesSearch) return false;

              if (selectedCategory === "Favorites") {
                return favorites.includes(th.id);
              } else if (selectedCategory !== "All") {
                return th.category === selectedCategory;
              }
              return true;
            });

            return (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4 pb-24"
            >
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Live Theme Preview</h3>
                <p className="text-[10.5px] text-white/70">Test how the keyboard feels and typed letters display before applying.</p>
              </div>

              {/* Interactive Preview Window */}
              <div className="w-full rounded-2xl relative overflow-hidden flex flex-col p-0 border border-white/20 shadow-2xl bg-[#06080d]">
                <div className="w-full h-15 p-3 flex flex-col justify-end bg-black/40 backdrop-blur-md border-b border-white/10 z-10">
                   <div className="text-[9px] text-white/50 mb-0.5 font-bold uppercase tracking-wider">Preview Keycap Output</div>
                   <div className="text-xs text-white font-medium break-words h-4 overflow-hidden">{noteTitle || "Tap keys below to start preview typing..."}</div>
                </div>
                <div className="relative w-full h-[320px]">
                  <BreezyKeyboard
                    theme={previewTheme}
                    font={previewFont}
                    language={language}
                    layout={keyboardLayout}
                    heightPercent={keyboardHeight}
                    soundEnabled={soundEnabled}
                    vibrationEnabled={vibrationEnabled}
                    incognitoMode={incognitoMode}
                    isAutoCorrectionEnabled={isAutoCorrectionEnabled}
                    userProfile={userProfile}
                    currentInputText={noteTitle}
                    onInputChange={(newVal) => setNoteTitle(newVal)}
                    onSendInput={() => setNoteTitle("")}
                    onOpenSettings={() => {}}
                    onOpenDashboardTab={() => {}}
                    onAddClipboard={() => {}}
                    onAddAIConversation={() => {}}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => {
                    onSelectTheme(previewTheme);
                    onSelectFont(previewFont);
                  }}
                  className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-white/20 flex items-center space-x-1.5"
                >
                  <CheckCircle className="w-4.5 h-4.5" />
                  <span>Apply Theme & Font</span>
                </button>
              </div>

              {/* Live Search and Filters */}
              <div className="space-y-3 pt-2">
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/40">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search themes by name or style..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 text-xs text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-white/30 backdrop-blur-md transition-all shadow-inner"
                  />
                </div>

                {/* Categories scrolling list */}
                <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                  {categories.map(cat => {
                    const isCatActive = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 text-[10.5px] rounded-full font-bold transition-all shrink-0 border uppercase tracking-wider ${isCatActive ? "bg-white text-black border-white shadow-md scale-105" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"}`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Theme Gallery Grid with Skeletons and Empty States */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                    Vibe Library ({filteredThemes.length})
                  </span>
                  <button
                    onClick={() => loadThemesAsync(true)}
                    className="text-[9px] font-bold text-red-400/70 hover:text-red-400 uppercase tracking-wider hover:underline"
                    title="Simulate network loading failure for error-handling verification"
                  >
                    Simulate Error
                  </button>
                </div>

                {themesLoading ? (
                  /* skeleton loading view */
                  <div className="space-y-3">
                    <div className="text-center py-2 text-xs text-white/50 animate-pulse font-mono uppercase tracking-wide">
                      Loading Live Themes...
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[1, 2, 3, 4].map(idx => (
                        <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3 h-28 flex flex-col justify-between animate-pulse">
                          <div className="flex justify-between items-start">
                            <div className="h-3 w-20 bg-white/10 rounded" />
                            <div className="h-4 w-4 bg-white/10 rounded-full" />
                          </div>
                          <div className="h-8 w-full bg-white/10 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : themesError ? (
                  /* Error handling state */
                  <div className="text-center py-8 px-4 bg-red-500/10 border border-red-500/20 rounded-2xl space-y-3 backdrop-blur-md">
                    <p className="text-xs font-bold text-red-400">Failed to load themes</p>
                    <p className="text-[10.5px] text-white/70 max-w-xs mx-auto leading-relaxed">{themesError}</p>
                    <button
                      onClick={() => loadThemesAsync(false)}
                      className="px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg shadow transition-all active:scale-95 uppercase tracking-wider"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredThemes.length === 0 ? (
                  /* Empty state */
                  <div className="text-center py-10 px-4 bg-white/5 border border-white/10 rounded-2xl space-y-2 backdrop-blur-md">
                    <p className="text-xs font-semibold text-white/80">No neon vibes found</p>
                    <p className="text-[10.5px] text-white/50">Try broadening your search query or selecting a different tab filter.</p>
                  </div>
                ) : (
                  /* Themes grid list */
                  <div className="grid grid-cols-2 gap-2.5">
                    {filteredThemes.map(th => {
                      const isActive = previewThemeId === th.id;
                      const isFavorite = favorites.includes(th.id);
                      const glowColors = th.previewColors || ["#3b82f6", "#8b5cf6"];

                      return (
                        <div
                          key={th.id}
                          onClick={() => setPreviewThemeId(th.id)}
                          className={`p-3 rounded-2xl border cursor-pointer transition-all backdrop-blur-md shadow-sm relative overflow-hidden flex flex-col justify-between ${isActive ? "bg-white/15 border-white/40 scale-[1.01]" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}
                          style={{
                            boxShadow: isActive ? `0 0 15px ${glowColors[0]}33` : "none"
                          }}
                        >
                          {/* Animated background glow layer inside card */}
                          {th.isAnimated && (
                            <div className="absolute -inset-10 opacity-10 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-spin-slow pointer-events-none z-0" style={{
                              animationDuration: th.animation === "flowing" ? "6s" : "12s"
                            }} />
                          )}

                          <div className="flex justify-between items-start mb-2 relative z-10">
                            <div className="flex flex-col min-w-0 pr-2">
                              <span className="text-xs font-bold text-white truncate">{th.name}</span>
                              <span className="text-[8px] text-white/50 uppercase font-mono tracking-wider">{th.category || "Vibe"}</span>
                            </div>
                            <button
                              onClick={(e) => toggleFavorite(th.id, e)}
                              className="p-1 hover:bg-white/10 rounded-lg text-white/80 active:scale-90 transition-all shrink-0"
                            >
                              <Heart className={`w-3.5 h-3.5 transition-all ${isFavorite ? "fill-rose-500 text-rose-500 scale-110" : "text-white/40"}`} />
                            </button>
                          </div>

                          <div className="relative z-10 w-full h-11 rounded-lg flex items-center justify-around px-1 overflow-hidden border border-white/10 bg-black/40">
                            {/* Inner ambient keys simulation */}
                            {["A", "S", "D", "F"].map((k, i) => (
                              <span
                                key={i}
                                className="text-[9px] px-1.5 py-0.5 rounded text-white/90 font-bold opacity-85 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] transition-all"
                                style={{
                                  background: th.keyBgClass.includes("bg-") ? "rgba(255,255,255,0.1)" : undefined,
                                  borderColor: "rgba(255,255,255,0.15)",
                                  borderWidth: "1px",
                                  textShadow: `0 0 4px ${glowColors[0]}`
                                }}
                              >
                                {k}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between mt-2.5 pt-1 border-t border-white/5 relative z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPreviewThemeId(th.id);
                              }}
                              className={`text-[9px] font-bold uppercase transition-all px-1.5 py-0.5 rounded ${isActive ? "text-white bg-white/10" : "text-white/60 hover:text-white"}`}
                            >
                              Preview
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectTheme(th);
                                onSelectFont(previewFont);
                              }}
                              className="text-[9px] bg-white text-black font-extrabold px-2 py-1 rounded-lg active:scale-95 transition-all uppercase"
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Fonts browser panel */}
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 space-y-4 backdrop-blur-xl shadow-lg">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    <span>Typography Style Engine</span>
                  </h4>
                  <button 
                    onClick={() => {
                      const inter = BUILT_IN_FONTS.find(f => f.id === "font_inter") || BUILT_IN_FONTS[0];
                      onSelectFont(inter);
                    }}
                    className="text-[9px] text-white/50 hover:text-cyan-400 transition-colors uppercase font-bold tracking-widest flex items-center space-x-1"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Restore Default</span>
                  </button>
                </div>

                {/* Font Search & Filters */}
                <div className="space-y-2.5">
                  <div className="relative w-full">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-white/40">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      type="text"
                      placeholder="Search 50 fonts..."
                      value={fontSearchQuery}
                      onChange={(e) => setFontSearchQuery(e.target.value)}
                      className="w-full bg-black/30 text-[11px] text-white pl-9 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-white/25 transition-all shadow-inner"
                    />
                  </div>

                  {/* Horizontal Font Categories list */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                    {["All", "Favorites", "Recent", "Modern", "Elegant", "Handwriting", "Bold", "Minimal", "Gaming", "Futuristic", "Neon", "Classic", "Decorative"].map(cat => {
                      const isCatActive = selectedFontCategory === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedFontCategory(cat)}
                          className={`px-2.5 py-1 text-[9.5px] rounded-full font-bold transition-all shrink-0 border uppercase tracking-wider ${isCatActive ? "bg-white text-black border-white shadow-sm" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Fonts Grid */}
                {(() => {
                  const filteredFonts = BUILT_IN_FONTS.filter(fo => {
                    const matchesSearch = fo.name.toLowerCase().includes(fontSearchQuery.toLowerCase()) || 
                                          fo.category.toLowerCase().includes(fontSearchQuery.toLowerCase());
                    if (!matchesSearch) return false;

                    if (selectedFontCategory === "Favorites") {
                      return favoriteFonts.includes(fo.id);
                    } else if (selectedFontCategory === "Recent") {
                      return recentFonts.includes(fo.id);
                    } else if (selectedFontCategory !== "All") {
                      return fo.category === selectedFontCategory;
                    }
                    return true;
                  });

                  if (filteredFonts.length === 0) {
                    return (
                      <div className="text-center py-6 bg-white/5 rounded-xl border border-white/10 text-xs text-white/50 italic">
                        No fonts match your criteria.
                      </div>
                    );
                  }

                  return (
                    <div className="grid grid-cols-2 gap-2 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                      {filteredFonts.map(fo => {
                        const isFontActive = previewFontId === fo.id;
                        const isFav = favoriteFonts.includes(fo.id);
                        
                        // Load Google Font style dynamically on render
                        if (typeof window !== "undefined" && fo.family) {
                          loadGoogleFont(fo.family);
                        }

                        return (
                          <div
                            key={fo.id}
                            onClick={() => {
                              setPreviewFontId(fo.id);
                              // Trigger state lift if supported
                              const loadedF = BUILT_IN_FONTS.find(f => f.id === fo.id) || fo;
                              onSelectFont(loadedF);
                              updateRecentFonts(fo.id);
                            }}
                            className={`p-2.5 rounded-xl border transition-all text-left flex flex-col justify-between relative cursor-pointer ${isFontActive ? "bg-white/15 border-white/35 shadow-sm" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
                          >
                            <div className="flex justify-between items-start w-full">
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-white block truncate leading-tight">{fo.name}</span>
                                <span className="text-[7.5px] text-white/50 uppercase font-mono tracking-wider">{fo.category}</span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setFavoriteFonts(prev => {
                                    const next = prev.includes(fo.id) ? prev.filter(id => id !== fo.id) : [...prev, fo.id];
                                    if (typeof window !== "undefined") {
                                      localStorage.setItem("breezy_favorite_fonts", JSON.stringify(next));
                                    }
                                    return next;
                                  });
                                }}
                                className="p-0.5 hover:bg-white/10 rounded text-white/60 active:scale-90 transition-all shrink-0"
                              >
                                <Heart className={`w-3 h-3 ${isFav ? "fill-rose-500 text-rose-500" : "text-white/40"}`} />
                              </button>
                            </div>

                            {/* Live Typographic rendering of Preview Text */}
                            <div 
                              className="my-2.5 text-xs text-white/90 truncate min-h-5 flex items-center"
                              style={{ fontFamily: `'${fo.family}', sans-serif` }}
                            >
                              Breezy Keyboard
                            </div>

                            <div className="flex justify-between items-center w-full pt-1.5 border-t border-white/5">
                              <span className="text-[8px] text-white/50 font-mono">
                                FREE
                              </span>
                              <span className={`text-[8.5px] font-black uppercase tracking-wider ${isFontActive ? "text-cyan-400" : "text-white/60"}`}>
                                {isFontActive ? "Selected" : "Tap Use"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
            );
          })()}


          {/* TAB 4: GLASS PROTECT */}
          {activeSubTab === "protect" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wide">Glass Protect Shield</h3>
                <p className="text-[10.5px] text-slate-400">Configure cyber safety, links detection, and credentials leaks scan protocols.</p>
              </div>

              {/* Security indicators */}
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 flex items-center space-x-3 backdrop-blur-2xl shadow-lg">
                <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white shadow-sm">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Safe Keyboard Standard Active</h4>
                  <p className="text-[10.5px] text-white/70">Glass Protect is continuously scanning local input buffers.</p>
                </div>
              </div>

              {/* Toggles */}
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 space-y-3 backdrop-blur-2xl shadow-lg">
                {[
                  { id: "incognito", title: "Incognito Keyboard Mode", desc: "Prevents saving typing predictions, custom vocabularies, or clipboards", state: incognitoMode, toggle: () => setIncognitoMode(!incognitoMode) },
                  { id: "vibrate", title: "Smart Passwords Guard", desc: "Warns if credit card or password sequence matches common keys", state: true, toggle: () => {} },
                  { id: "scams", title: "Scam Detection Engine", desc: "Alerts of fraud-phishing vocabulary inside active chats", state: true, toggle: () => {} }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-b-0">
                    <div className="flex-1 pr-4">
                      <h5 className="text-xs font-bold text-white">{item.title}</h5>
                      <p className="text-[10px] text-white/70">{item.desc}</p>
                    </div>
                    <button
                      onClick={item.toggle}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 shadow-inner ${item.state ? "bg-white/40" : "bg-black/20 border border-white/10"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${item.state ? "translate-x-4" : "translate-x-0"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: HUB (NOTES & CLIPBOARD) */}
          {activeSubTab === "hub" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wide">Glass Notes & Clipboard History</h3>
                <p className="text-[10.5px] text-slate-400">Compose drafting ideas, store favorite transcripts, and organize notes.</p>
              </div>

              {/* Add Note form */}
              <div className="bg-white/10 p-4 rounded-2xl border border-white/20 space-y-2.5 backdrop-blur-2xl shadow-lg">
                <h4 className="text-xs font-bold text-white">Create New Note</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Note Title"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-xs text-white placeholder-white/50 focus:outline-none focus:border-white/50 shadow-inner transition-all"
                  />
                  <textarea
                    placeholder="Start typing draft here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={3}
                    className="w-full bg-white/10 border border-white/20 rounded-xl p-2 text-xs text-white placeholder-white/50 focus:outline-none focus:border-white/50 shadow-inner transition-all"
                  />
                  <button
                    onClick={() => {
                      if (!noteTitle || !noteContent) return;
                      onAddNote(noteTitle, noteContent);
                      setNoteTitle("");
                      setNoteContent("");
                    }}
                    className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-xl text-xs font-bold flex items-center space-x-1 shadow-sm transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>

              {/* Notes list */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white/80">Saved Notes ({notes.length})</h4>
                {notes.length === 0 ? (
                  <p className="text-[11px] text-white/50 italic py-2 text-center">No notes composed yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {notes.map(note => (
                      <div key={note.id} className="bg-white/10 p-3 rounded-2xl border border-white/20 space-y-1 relative group backdrop-blur-2xl shadow-lg">
                        <div className="flex justify-between items-start">
                          <h5 className="text-xs font-bold text-white">{note.title}</h5>
                          <button
                            onClick={() => onDeleteNote(note.id)}
                            className="text-white/50 hover:text-white transition-colors"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11.5px] text-white/80 leading-relaxed">{note.content}</p>
                        <span className="text-[8px] text-white/50 block font-mono">{note.createdAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB: LANGUAGE MANAGER */}
          {activeSubTab === "language_manager" && (
            <motion.div
              key="language_manager"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setActiveSubTab("settings")}
                    className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 rotate-90" />
                  </button>
                  <h2 className="text-xl font-bold text-white tracking-tight">Language Manager</h2>
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full border border-emerald-500/30">
                  {ALL_LANGUAGES.length} AVAILABLE
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-emerald-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Search languages or layouts..."
                  value={languageSearchQuery}
                  onChange={(e) => setLanguageSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl py-3.5 pl-11 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:bg-white/15 transition-all"
                />
              </div>

              {/* Languages List */}
              <div className="grid grid-cols-1 gap-3">
                {ALL_LANGUAGES.filter(lang => 
                  lang.name.toLowerCase().includes(languageSearchQuery.toLowerCase()) ||
                  lang.nativeName.toLowerCase().includes(languageSearchQuery.toLowerCase()) ||
                  lang.code.toLowerCase().includes(languageSearchQuery.toLowerCase()) ||
                  lang.layouts.some(l => l.toLowerCase().includes(languageSearchQuery.toLowerCase()))
                ).map(langItem => {
                  const isSelected = language === langItem.code;
                  return (
                    <div
                      key={langItem.code}
                      onClick={() => setLanguage(langItem.code as SupportedLanguage)}
                      className={`group relative p-4 rounded-3xl border transition-all cursor-pointer backdrop-blur-xl ${
                        isSelected 
                          ? "bg-emerald-500/20 border-emerald-400/50 shadow-lg shadow-emerald-500/10" 
                          : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl filter drop-shadow-sm">{langItem.flag}</div>
                          <div>
                            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                              <span>{langItem.name}</span>
                              <span className="text-[10px] text-white/40 font-mono">({langItem.nativeName})</span>
                            </h3>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {langItem.layouts.map(layout => (
                                <span key={layout} className="text-[9px] px-1.5 py-0.5 bg-white/10 text-white/60 rounded-md font-mono">
                                  {layout}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        {isSelected ? (
                          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-colors">
                            <Plus className="w-4 h-4 text-white/40 group-hover:text-white" />
                          </div>
                        )}
                      </div>
                      
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-emerald-500/20 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {langItem.layouts.map(lay => {
                            const isLayoutSelected = keyboardLayout.toLowerCase() === lay.toLowerCase();
                            return (
                              <button
                                key={lay}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setLayout(lay.toLowerCase() as any);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap ${
                                  isLayoutSelected
                                    ? "bg-emerald-400 text-black shadow-md"
                                    : "bg-white/10 text-white/70 hover:bg-white/20"
                                }`}
                              >
                                {lay}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Info */}
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10 text-center">
                <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">
                  Breezy Cloud Dictionary Sync Active
                </p>
                <p className="text-[9px] text-white/30 mt-1">
                  Keyboard layouts are optimized for high-speed typing and low latency.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB: RGB LIGHTING MANAGER */}
          {activeSubTab === "lighting_manager" && (
            <motion.div
              key="lighting_manager"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setActiveSubTab("settings")}
                    className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 rotate-90" />
                  </button>
                  <h2 className="text-xl font-bold text-white tracking-tight font-display">RGB PRO LIGHTING</h2>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest font-mono">Synced</span>
                </div>
              </div>

              {lightingSettings ? (
                <div className="space-y-8 pb-10">
                  {/* Mode Picker */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-1 font-mono">Animation Protocol</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: "static", label: "Static Vibe", desc: "Solid neon glow" },
                        { id: "breathing", label: "Breathing", desc: "Pulse in/out" },
                        { id: "rainbow", label: "Prism Wave", desc: "Spectrum cycle" },
                        { id: "wave", label: "Flow Wave", desc: "Liquid motion" },
                        { id: "pulse", label: "Heartbeat", desc: "Sharp pulses" },
                        { id: "lightning", label: "Storm", desc: "Random bolts" },
                        { id: "aurora", label: "Aurora", desc: "Boreal flow" },
                        { id: "galaxy", label: "Nebula", desc: "Cosmic purple" },
                        { id: "fire", label: "Inferno", desc: "Flickering flame" },
                        { id: "ocean", label: "Ocean", desc: "Tidal blue" },
                        { id: "crystal_glow", label: "Diamond", desc: "White sparkle" }
                      ].map(m => (
                        <button
                          key={m.id}
                          onClick={() => updateLighting({ mode: m.id as any })}
                          className={`p-3.5 rounded-2xl border text-left transition-all backdrop-blur-xl group ${
                            lightingSettings.mode === m.id 
                              ? "bg-white/20 border-white/50 shadow-xl scale-[1.02]" 
                              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          <h5 className={`text-xs font-bold transition-colors ${lightingSettings.mode === m.id ? "text-white" : "text-white/80 group-hover:text-white"}`}>{m.label}</h5>
                          <p className="text-[9px] text-white/40 mt-0.5 leading-tight">{m.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Sync */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-1 font-mono">Color Palette</label>
                    <div className="flex flex-wrap gap-2.5">
                      {PRESET_LIGHTING_COLORS.map(c => (
                        <button
                          key={c.name}
                          onClick={() => updateLighting({ color: c.value })}
                          className={`w-11 h-11 rounded-2xl border-2 transition-all flex items-center justify-center relative overflow-hidden group ${
                            lightingSettings.color === c.value ? "border-white scale-110 shadow-2xl" : "border-white/10 hover:border-white/30"
                          }`}
                          style={{ background: c.value === "rainbow" ? "linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8f00ff)" : c.value }}
                        >
                          {lightingSettings.color === c.value && (
                            <div className="absolute inset-0 bg-white/20 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-white drop-shadow-lg" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
                        </button>
                      ))}
                      
                      <div className="flex-1 min-w-[140px] bg-white/10 border border-white/20 rounded-2xl p-2.5 flex items-center gap-3 shadow-inner">
                        <div className="w-8 h-8 rounded-xl shadow-lg border border-white/20" style={{ backgroundColor: lightingSettings.color.startsWith("#") ? lightingSettings.color : "#FFFFFF" }} />
                        <div className="flex-1 flex flex-col">
                          <span className="text-[8px] font-bold text-white/40 uppercase tracking-wider">Manual HEX</span>
                          <input 
                            type="text" 
                            value={lightingSettings.color.startsWith("#") ? lightingSettings.color : "#FFFFFF"}
                            onChange={(e) => updateLighting({ color: e.target.value })}
                            className="bg-transparent text-[11px] text-white font-mono outline-none font-bold"
                            placeholder="#FFFFFF"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hardware Controls */}
                  <div className="bg-white/10 rounded-[2.5rem] border border-white/20 p-6 space-y-7 backdrop-blur-3xl shadow-2xl">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2.5">
                          <Zap className="w-4 h-4 text-yellow-400" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Glow Intensity</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-white/80">{lightingSettings.glowIntensity}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={lightingSettings.glowIntensity} 
                        onChange={(e) => updateLighting({ glowIntensity: parseInt(e.target.value) })}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white shadow-inner"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2.5">
                          <Palette className="w-4 h-4 text-pink-400" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Brightness</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-white/80">{lightingSettings.brightness}%</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" 
                        value={lightingSettings.brightness} 
                        onChange={(e) => updateLighting({ brightness: parseInt(e.target.value) })}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white shadow-inner"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2.5">
                          <Activity className="w-4 h-4 text-emerald-400" />
                          <span className="text-[10px] font-bold text-white uppercase tracking-widest font-mono">Pulse Frequency</span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">{lightingSettings.speed.replace("_", " ")}</span>
                      </div>
                      <div className="flex gap-2">
                        {["very_slow", "slow", "normal", "fast", "very_fast"].map(s => (
                          <button
                            key={s}
                            onClick={() => updateLighting({ speed: s as any })}
                            className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase transition-all border shadow-sm ${
                              lightingSettings.speed === s ? "bg-white text-black border-white scale-105" : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                            }`}
                          >
                            {s.split("_")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                                  {/* Underglow Toggle */}
                  <div className="bg-white/10 rounded-3xl border border-white/20 p-5 flex items-center justify-between backdrop-blur-3xl shadow-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                        <Activity className="w-6 h-6 text-cyan-400" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-tight">Base Underglow</h4>
                        <p className="text-[10px] text-white/40 font-medium">Ambient surface radiance</p>
                      </div>
                    </div>
                    <button
                      onClick={() => updateLighting({ underglow: lightingSettings.underglow === -1 ? 50 : -1 })}
                      className={`w-14 h-7 rounded-full p-1 transition-all flex items-center ${lightingSettings.underglow !== -1 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-white/10"}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform shadow-md ${lightingSettings.underglow !== -1 ? "translate-x-7" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {/* Animated Video Background Card */}
                  <div className="bg-white/10 rounded-[2.5rem] border border-white/20 p-6 space-y-6 backdrop-blur-3xl shadow-2xl">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2.5">
                        <Video className="w-5 h-5 text-indigo-400 font-bold" />
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Animated Video Background</h4>
                      </div>
                      <p className="text-[10px] text-white/40 leading-snug">Bring your keyboard to life with smooth, high-definition looping animations embedded behind keys.</p>
                    </div>

                    {/* Presets Grid */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] px-1 font-mono">Select Video Engine</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { id: "none", name: "Classic Glass", url: "none", desc: "No video animation" },
                          { id: "custom_video", name: "Uploaded Video", url: "/video.mp4", desc: "Your uploaded video" },
                          { id: "nature_flower", name: "Nature Bloom", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", desc: "Blooming flower loop" },
                          { id: "friday", name: "Friday", url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4", desc: "Friday vibe loop" },
                          { id: "cyberpunk_grid", name: "Cyberpunk Grid", url: "https://assets.codepen.io/3364143/7btrrd.mp4", desc: "Retro synth grids" },
                          { id: "digital_storm", name: "Digital Storm", url: "https://www.w3schools.com/html/mov_bbb.mp4", desc: "Matrix code streams" }
                        ].map((preset) => (
                          <button
                            key={preset.id}
                            onClick={() => {
                              localStorage.setItem("breezy_kb_bg_video", preset.url);
                              setCurrentVideo(preset.url);
                              window.dispatchEvent(new Event("breezy_settings_updated"));
                            }}
                            className={`p-3 rounded-2xl border text-left transition-all ${
                              currentVideo === preset.url
                                ? "bg-white/25 border-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.3)] scale-[1.02]"
                                : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                            }`}
                          >
                            <h5 className="text-xs font-bold text-white leading-tight">{preset.name}</h5>
                            <p className="text-[9px] text-white/40 mt-0.5 leading-snug">{preset.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Video URL Input */}
                    <div className="space-y-2.5 bg-black/20 p-4 rounded-2xl border border-white/5 shadow-inner">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-white/50 uppercase tracking-widest font-mono">Custom MP4 / WEBM URL</span>
                        <input
                          type="text"
                          value={currentVideo !== "none" && !["https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.webm", "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/friday.mp4", "https://assets.codepen.io/3364143/7btrrd.mp4", "https://www.w3schools.com/html/mov_bbb.mp4", "/video.mp4"].includes(currentVideo) ? currentVideo : ""}
                          onChange={(e) => {
                            const val = e.target.value.trim() || "none";
                            localStorage.setItem("breezy_kb_bg_video", val);
                            setCurrentVideo(val);
                            window.dispatchEvent(new Event("breezy_settings_updated"));
                          }}
                          placeholder="https://example.com/stream.mp4"
                          className="bg-transparent text-xs text-white outline-none font-bold placeholder-white/20 mt-1 font-mono w-full"
                        />
                      </div>
                    </div>
                  </div>     </div>
                </div>
              ) : (
                <div className="text-center py-24 text-white/30 italic font-mono uppercase tracking-[0.2em] text-[10px]">
                  Connecting to RGB Controller...
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: TRANSLATE */}
          {activeSubTab === "translate" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="bg-white/10 p-5 rounded-[2.5rem] border border-white/20 space-y-4 backdrop-blur-3xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                    <Languages className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Breezy Translate</h3>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Global Communication Engine</p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white">Translate while typing</span>
                      <p className="text-[9px] text-white/40">Convert text instantly as you press keys</p>
                    </div>
                    <button
                      onClick={() => updateAiSettings({ translateWhileTyping: !aiSettings.translateWhileTyping })}
                      className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${aiSettings.translateWhileTyping ? "bg-cyan-500" : "bg-white/10"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${aiSettings.translateWhileTyping ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white">Auto-Detect Language</span>
                      <p className="text-[9px] text-white/40">Identify incoming text language automatically</p>
                    </div>
                    <button
                      className="w-12 h-6 rounded-full p-1 bg-cyan-500 flex items-center"
                    >
                      <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-2">
                   <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center space-y-1">
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">From</span>
                      <span className="text-xs font-bold text-white">Auto Detect</span>
                   </div>
                   <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center space-y-1">
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">To</span>
                      <span className="text-xs font-bold text-white">{language.toUpperCase()}</span>
                   </div>
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-[2.5rem] border border-white/10 text-center space-y-1">
                 <Globe className="w-5 h-5 text-white/20 mx-auto" />
                 <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">100+ Languages Supported</p>
                 <p className="text-[9px] text-white/30 italic">Powered by Breezy Neural Translation</p>
              </div>
            </motion.div>
          )}

          {/* TAB 4: PROTECT */}
          {activeSubTab === "protect" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="bg-white/10 p-5 rounded-[2.5rem] border border-white/20 space-y-4 backdrop-blur-3xl shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Breezy Protect</h3>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">Privacy & Security Shield</p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-2">
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white">Password Detection</span>
                      <p className="text-[9px] text-white/40">Alert when typing sensitive credentials</p>
                    </div>
                    <div className="w-12 h-6 rounded-full p-1 bg-rose-500 flex items-center">
                      <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white">PII Masking</span>
                      <p className="text-[9px] text-white/40">Hide addresses and phone numbers</p>
                    </div>
                    <button
                      onClick={() => updateAiSettings({ detectLanguage: !aiSettings.detectLanguage })}
                      className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${aiSettings.detectLanguage ? "bg-rose-500" : "bg-white/10"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${aiSettings.detectLanguage ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-white">Incognito Mode</span>
                      <p className="text-[9px] text-white/40">Prevent learning from typing history</p>
                    </div>
                    <button
                      onClick={() => setIncognitoMode(!incognitoMode)}
                      className={`w-12 h-6 rounded-full p-1 transition-all flex items-center ${incognitoMode ? "bg-rose-500" : "bg-white/10"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform ${incognitoMode ? "translate-x-6" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-[2rem] flex items-center space-x-3">
                 <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                 <div className="space-y-0.5">
                    <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Threat Intelligence</h4>
                    <p className="text-[9.5px] text-rose-100/70 leading-snug">Scam link detection and clipboard privacy is active.</p>
                 </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: HISTORY */}
          {activeSubTab === "history" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between px-1">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">AI Interaction Logs</h3>
                 <button className="text-[9px] font-bold text-white/40 uppercase hover:text-rose-400 transition-colors">Clear All</button>
              </div>

              <div className="space-y-3 pb-10">
                {aiHistory.length > 0 ? (
                  aiHistory.map((entry, idx) => (
                    <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-3.5 space-y-2 backdrop-blur-xl group">
                      <div className="flex justify-between items-start">
                         <span className="text-[10px] font-bold text-white/40 font-mono tracking-widest uppercase">{entry.date}</span>
                         <Heart className="w-3.5 h-3.5 text-white/20 hover:text-pink-500 cursor-pointer transition-colors" />
                      </div>
                      <p className="text-[11px] font-bold text-white/90 line-clamp-1 italic">"{entry.prompt}"</p>
                      <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-[10.5px] text-white/70 leading-relaxed shadow-inner group-hover:text-white/90 transition-colors">
                         {entry.response}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-3 opacity-30">
                     <History className="w-10 h-10 mx-auto" />
                     <p className="text-xs font-bold uppercase tracking-[0.2em]">No History Found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {activeSubTab === "settings" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              {/* Settings Search Bar */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-white/40 group-focus-within:text-white transition-colors" />
                </div>
                <input
                  type="text"
                  placeholder="Search settings and features..."
                  value={settingsSearchQuery}
                  onChange={(e) => setSettingsSearchQuery(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-white/40 backdrop-blur-xl shadow-inner transition-all"
                />
              </div>

              <div className="space-y-6">
                {[
                  {
                    id: "ai_platform",
                    title: "AI Platform",
                    icon: <Cpu className="w-4 h-4 text-amber-400" />,
                    items: [
                      { id: "ai_provider", label: "AI Provider", desc: "Choose the brain behind Breezy AI", action: () => updateAiSettings({ provider: aiSettings.provider === AIProviderType.GEMINI ? AIProviderType.MOCK : AIProviderType.GEMINI }), labelSuffix: aiSettings.provider.toUpperCase() },
                      { id: "thinking_mode_cfg", label: "Thinking Mode", desc: "Balance speed vs deep reasoning", action: () => updateAiSettings({ thinkingMode: aiSettings.thinkingMode === AIThinkingMode.NORMAL ? AIThinkingMode.ADVANCED : AIThinkingMode.NORMAL }), labelSuffix: aiSettings.thinkingMode.toUpperCase() },
                      { id: "ai_history_cfg", label: "Save History", desc: "Keep a log of your AI conversations", action: () => {}, state: true },
                      { id: "clear_ai_cache", label: "Clear AI Cache", desc: "Reset temporary AI learning data", action: () => {} }
                    ]
                  },
                  {
                    id: "voice_typing",
                    title: "Breezy Voice",
                    icon: <Mic className="w-4 h-4 text-rose-400" />,
                    items: [
                      { id: "voice_punct", label: "Auto Punctuation", desc: "Add periods and commas automatically", action: () => updateAiSettings({ voiceAutoPunctuation: !aiSettings.voiceAutoPunctuation }), state: aiSettings.voiceAutoPunctuation },
                      { id: "voice_filler", label: "Remove Fillers", desc: "Strip 'um', 'ah', and 'like' from speech", action: () => updateAiSettings({ voiceRemoveFiller: !aiSettings.voiceRemoveFiller }), state: aiSettings.voiceRemoveFiller },
                      { id: "voice_lang", label: "Primary Language", desc: "Native voice recognition model", action: () => {}, labelSuffix: language.toUpperCase() },
                      { id: "smart_formatting", label: "Smart Formatting", desc: "Auto-format dates, prices, and lists", action: () => {}, state: true }
                    ]
                  },
                  {
                    id: "ai_writing",
                    title: "AI & Writing",
                    icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
                    items: [
                      { id: "ai_hub", label: "Breezy AI", desc: "Access the full AI writing assistant", action: () => setActiveSubTab("ai") },
                      { id: "thinking_mode", label: "Thinking Mode", desc: "Enable deep reasoning for AI responses", action: () => setActiveSubTab("ai") },
                      { id: "rewrite", label: "Rewrite", desc: "Professional, casual, or witty text rewriting", action: () => setActiveSubTab("ai") },
                      { id: "grammar", label: "Grammar", desc: "AI-powered real-time grammar correction", action: () => setAutoCorrectionEnabled(!isAutoCorrectionEnabled), state: isAutoCorrectionEnabled },
                      { id: "smart_replies", label: "Smart Replies", desc: "Context-aware reply suggestions", action: () => setActiveSubTab("ai") },
                      { id: "summarize", label: "Summarize", desc: "Condense long text into bullet points", action: () => setActiveSubTab("ai") }
                    ]
                  },
                  {
                    id: "appearance",
                    title: "Appearance",
                    icon: <Palette className="w-4 h-4 text-pink-400" />,
                    items: [
                      { id: "live_themes", label: "Live Themes", desc: "Browse and apply animated glass themes", action: () => setActiveSubTab("themes") },
                      { id: "theme_creator", label: "Theme Creator", desc: "Design your own custom glass keyboard", action: () => setActiveSubTab("themes") },
                      { id: "rgb_lighting", label: "RGB Lighting", desc: "Configure key glows and underglow effects", action: () => setActiveSubTab("lighting_manager") },
                      { id: "keyboard_brightness", label: "Keyboard Brightness", desc: "Adjust transparency and glow intensity", action: () => setActiveSubTab("lighting_manager") },
                      { id: "fonts", label: "Fonts", desc: "Choose from 50+ distinctive typography styles", action: () => setActiveSubTab("themes") },
                      { id: "colors", label: "Colors", desc: "Customize accent and text color palettes", action: () => setActiveSubTab("themes") },
                      { id: "key_size", label: "Key Size", desc: "Adjust keycap width and height scaling", action: () => setActiveSubTab("keyboard_personalization") },
                      { id: "keyboard_height", label: "Keyboard Height", desc: "Set the overall height of the keyboard", action: () => setActiveSubTab("keyboard_personalization") }
                    ]
                  },
                  {
                    id: "language",
                    title: "Language",
                    icon: <Globe className="w-4 h-4 text-emerald-400" />,
                    items: [
                      { id: "translate", label: "Translate", desc: "Real-time translation as you type", action: () => setLanguage(language === "en" ? "es" : "en"), labelSuffix: language.toUpperCase() },
                      { id: "language_manager", label: "Language Manager", desc: "Download and organize keyboard layouts", action: () => setActiveSubTab("language_manager") },
                      { id: "voice_languages", label: "Voice Languages", desc: "Set primary language for voice typing", action: () => {} },
                      { id: "auto_correct", label: "Auto-Correct", desc: "Toggle automatic typo fixing", action: () => setAutoCorrectionEnabled(!isAutoCorrectionEnabled), state: isAutoCorrectionEnabled },
                      { id: "predictions", label: "Predictions", desc: "Enable next-word suggestion bar", action: () => {} }
                    ]
                  },
                  {
                    id: "media",
                    title: "Media",
                    icon: <Smile className="w-4 h-4 text-amber-400" />,
                    items: [
                      { id: "emoji", label: "Emoji", desc: "Quick access to all emojis and symbols", action: () => {} },
                      { id: "gifs", label: "GIFs", desc: "Search and share GIFs from Tenor", action: () => {} },
                      { id: "stickers", label: "Stickers", desc: "Browse custom vector sticker packs", action: () => {} }
                    ]
                  },
                  {
                    id: "productivity",
                    title: "Productivity",
                    icon: <Zap className="w-4 h-4 text-yellow-400" />,
                    items: [
                      { id: "breezy_hub", label: "Breezy Hub", desc: "Unified workspace for notes and clipboard", action: () => setActiveSubTab("hub") },
                      { id: "clipboard", label: "Clipboard", desc: "Manage your copied text history", action: () => setActiveSubTab("hub") },
                      { id: "saved_replies", label: "Saved Replies", desc: "Quick-paste your common responses", action: () => setActiveSubTab("hub") },
                      { id: "notes", label: "Notes", desc: "Draft and save long-form text ideas", action: () => setActiveSubTab("hub") },
                      { id: "favorite_prompts", label: "Favorite Prompts", desc: "Store your best AI instructions", action: () => setActiveSubTab("hub") }
                    ]
                  },
                  {
                    id: "learning",
                    title: "Learning",
                    icon: <BookOpen className="w-4 h-4 text-blue-400" />,
                    items: [
                      { id: "breezy_learn", label: "Breezy Learn", desc: "Practice typing and grammar lessons", action: () => setActiveSubTab("learn") },
                      { id: "daily_vocabulary", label: "Daily Vocabulary", desc: "Learn a new word every single day", action: () => setActiveSubTab("learn") },
                      { id: "typing_practice", label: "Typing Practice", desc: "Improve your speed and accuracy", action: () => setActiveSubTab("learn") }
                    ]
                  },
                  {
                    id: "privacy_security",
                    title: "Privacy & Security",
                    icon: <Lock className="w-4 h-4 text-red-400" />,
                    items: [
                      { id: "breezy_protect", label: "Breezy Protect", desc: "Scan messages for sensitive data leaks", action: () => setActiveSubTab("protect") },
                      { id: "incognito_mode", label: "Incognito Mode", desc: "Prevent learning or saving typed data", action: () => setIncognitoMode(!incognitoMode), state: incognitoMode },
                      { id: "clipboard_privacy", label: "Clipboard Privacy", desc: "Auto-clear clipboard after 5 minutes", action: () => {} },
                      { id: "scam_detection", label: "Scam Detection", desc: "Identify fraudulent links and requests", action: () => setActiveSubTab("protect") },
                      { id: "password_protection", label: "Password Protection", desc: "Secure your hub with biometric lock", action: () => {} }
                    ]
                  },
                  {
                    id: "general",
                    title: "General",
                    icon: <Settings className="w-4 h-4 text-slate-400" />,
                    items: [
                      { id: "sound", label: "Sound", desc: "Enable mechanical keyboard click sounds", action: () => setSoundEnabled(!soundEnabled), state: soundEnabled },
                      { id: "vibration", label: "Vibration", desc: "Haptic feedback on every key press", action: () => setVibrationEnabled(!vibrationEnabled), state: vibrationEnabled },
                      { id: "backup_restore", label: "Backup & Restore", desc: "Sync your settings to the cloud", action: () => setActiveSubTab("backup_restore") },
                      { id: "accessibility", label: "Accessibility", desc: "High contrast and screen reader support", action: () => setActiveSubTab("accessibility") },
                      { id: "about", label: "About", desc: "Version info and mission statement", action: () => setActiveSubTab("about") },
                      { id: "help_feedback", label: "Help & Feedback", desc: "Get support or request new features", action: () => setActiveSubTab("help") },
                      { id: "onboarding_tour", label: "Onboarding Tour", desc: "Re-run first-time setup guide", action: () => setActiveSubTab("onboarding") },
                      { id: "privacy_legal", label: "Privacy & Legal Policy", desc: "Review terms, safety policies, and disclosures", action: () => setActiveSubTab("legal") }
                    ]
                  }
                ].map((category) => {
                  const filteredItems = category.items.filter(item => 
                    item.label.toLowerCase().includes(settingsSearchQuery.toLowerCase()) ||
                    item.desc.toLowerCase().includes(settingsSearchQuery.toLowerCase())
                  );

                  if (filteredItems.length === 0 && settingsSearchQuery) return null;

                  return (
                    <div key={category.id} className="space-y-3">
                      <div className="flex items-center space-x-2 px-1">
                        {category.icon}
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">{category.title}</h4>
                      </div>
                      <div className="bg-white/10 rounded-3xl border border-white/20 overflow-hidden backdrop-blur-2xl shadow-lg">
                        {filteredItems.map((item, idx) => (
                          <div 
                            key={item.id} 
                            onClick={item.action}
                            className={`flex justify-between items-center px-4 py-3.5 cursor-pointer transition-colors hover:bg-white/5 active:bg-white/10 ${idx !== filteredItems.length - 1 ? "border-b border-white/5" : ""}`}
                          >
                            <div className="flex-1 min-w-0 pr-4">
                              <div className="flex items-center space-x-2">
                                <h5 className="text-[12.5px] font-bold text-white truncate">{item.label}</h5>
                                {item.labelSuffix && (
                                  <span className="px-1.5 py-0.5 bg-white/20 text-white text-[9px] font-bold rounded-lg uppercase tracking-wide">
                                    {item.labelSuffix}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-white/60 truncate">{item.desc}</p>
                            </div>
                            
                            {item.state !== undefined ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); item.action(); }}
                                className={`w-9 h-5 rounded-full p-0.5 transition-colors shadow-inner shrink-0 ${item.state ? "bg-white/40" : "bg-black/20 border border-white/10"}`}
                              >
                                <div className={`w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${item.state ? "translate-x-4" : "translate-x-0"}`} />
                              </button>
                            ) : (
                              <button className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-wider transition-colors">
                                Open
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 7: PROFILE */}
          {activeSubTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-5 pb-10"
            >
              <div className="flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">User Profile & Customization</h3>
                <div className="flex items-center space-x-1.5 text-[9.5px] font-bold text-emerald-400 uppercase tracking-widest font-mono">
                  <Cloud className="w-3.5 h-3.5 shrink-0" />
                  <span>Real-time Sync</span>
                </div>
              </div>

              {/* Avatar Preset Selector */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-3 backdrop-blur-xl">
                <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest">Select Avatar Preset</h4>
                <div className="grid grid-cols-4 gap-3.5">
                  {[
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
                    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80"
                  ].map((preset, pIdx) => {
                    const isSelected = editAvatar === preset;
                    return (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setEditAvatar(preset)}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isSelected ? "border-cyan-400 scale-105 shadow-lg shadow-cyan-500/20" : "border-white/10 hover:border-white/30"}`}
                      >
                        <img referrerPolicy="no-referrer" src={preset} alt="Avatar Preset" className="w-full h-full object-cover" />
                        {isSelected && (
                          <div className="absolute inset-0 bg-cyan-500/20 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-cyan-300 drop-shadow" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="space-y-1 pt-1">
                  <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">Custom Image URL</span>
                  <input 
                    type="text" 
                    value={editAvatar} 
                    onChange={(e) => setEditAvatar(e.target.value)} 
                    placeholder="Enter custom image URL..." 
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 transition-colors"
                  />
                </div>
              </div>

              {/* Form Info Fields */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-4 backdrop-blur-xl">
                <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest">Account Details</h4>
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">Display Name</label>
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">Username</label>
                      <input 
                        type="text" 
                        value={editUsername} 
                        onChange={(e) => setEditUsername(e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20"
                        placeholder="john_doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Lock className="absolute right-3.5 top-2.5 w-3.5 h-3.5 text-white/30" />
                      <input 
                        type="email" 
                        value={auth.currentUser?.isAnonymous ? "Guest Session (Unlinked)" : auth.currentUser?.email || "No email available"} 
                        disabled 
                        className="w-full bg-black/15 border border-white/5 rounded-xl px-3 py-2 text-[11px] text-white/50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">Country</label>
                      <select 
                        value={editCountry} 
                        onChange={(e) => setEditCountry(e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 appearance-none"
                      >
                        <option value="United States">United States</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                        <option value="Japan">Japan</option>
                        <option value="India">India</option>
                        <option value="Brazil">Brazil</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">Preferred Language</label>
                      <select 
                        value={editLanguage} 
                        onChange={(e) => setEditLanguage(e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 appearance-none"
                      >
                        <option value="English">English</option>
                        <option value="Spanish">Spanish</option>
                        <option value="French">French</option>
                        <option value="German">German</option>
                        <option value="Japanese">Japanese</option>
                        <option value="Portuguese">Portuguese</option>
                        <option value="Chinese">Chinese</option>
                        <option value="Hindi">Hindi</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Keyboard Custom Preferences */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-4 space-y-4 backdrop-blur-xl">
                <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest">BreezyKeyboard Custom Preferences</h4>
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest flex justify-between">
                      <span>Glow Brightness</span>
                      <span className="text-cyan-400 font-mono">{editBrightness}%</span>
                    </label>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={editBrightness} 
                      onChange={(e) => setEditBrightness(Number(e.target.value))} 
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">Keyboard Theme</label>
                      <select 
                        value={editTheme} 
                        onChange={(e) => setEditTheme(e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 appearance-none"
                      >
                        <option value="cyberpunk_neon">Cyberpunk Neon ⚡</option>
                        <option value="glass_retro">Glass Retro 💎</option>
                        <option value="bubblegum_glow">Bubblegum Glow 🌸</option>
                        <option value="matrix_mono">Matrix Mono 📟</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">Typing Font</label>
                      <select 
                        value={editFont} 
                        onChange={(e) => setEditFont(e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 appearance-none"
                      >
                        <option value="font_inter">Inter Sans</option>
                        <option value="font_roboto">Roboto Modern</option>
                        <option value="font_fira_code">Fira Code Mono</option>
                        <option value="font_space_grotesk">Space Grotesk Tech</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">Emoji Pack</label>
                      <select 
                        value={editEmoji} 
                        onChange={(e) => setEditEmoji(e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 appearance-none"
                      >
                        <option value="classic">Classic Unicode</option>
                        <option value="neon">Breezy Neon</option>
                        <option value="kawaii">Kawaii 🌸</option>
                        <option value="minimalist">Minimalist Flat</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">Sticker Pack</label>
                      <select 
                        value={editSticker} 
                        onChange={(e) => setEditSticker(e.target.value)} 
                        className="w-full bg-black/30 border border-white/10 rounded-xl px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 appearance-none"
                      >
                        <option value="vector_pack">Vector Pack</option>
                        <option value="neon_retro">Neon Retro Pack</option>
                        <option value="kawaii_food">Kawaii Food</option>
                        <option value="developer">Developer Stickers</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-white/40 uppercase tracking-widest">AI Engine Integration</label>
                    <select 
                      value={editAi} 
                      onChange={(e) => setEditAi(e.target.value)} 
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-2.5 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 appearance-none"
                    >
                      <option value="gemini">Gemini API (Cloud AI)</option>
                      <option value="local">Local Grammar Model (Offline)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Glowing Save Button */}
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saveStatus === "saving"}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all border shadow-lg ${
                  saveStatus === "saving" 
                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 cursor-not-allowed"
                    : saveStatus === "saved"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10"
                      : "bg-white/10 hover:bg-white/15 text-white border-white/20 active:scale-98 shadow-black/40"
                }`}
              >
                {saveStatus === "saving" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>Syncing Settings...</span>
                  </>
                ) : saveStatus === "saved" ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Profile Saved & Cloud Synced!</span>
                  </>
                ) : (
                  <>
                    <Cloud className="w-4 h-4 text-white/70 shrink-0" />
                    <span>Save Profile & Sync Cloud</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* TAB 8: KEYBOARD PERSONALIZATION */}
          {activeSubTab === "keyboard_personalization" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-5 pb-10"
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveSubTab("settings")}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs"
                  >
                    ← Back
                  </button>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Keyboard Layout & Sizes</h3>
                </div>
                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest font-mono">Custom Layout</span>
              </div>

              {/* Sliders Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 backdrop-blur-xl">
                <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest border-b border-white/5 pb-2">Layout & Size Scaling</h4>

                {/* Keyboard Height */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70 font-semibold">Keyboard Height</span>
                    <span className="text-cyan-400 font-mono font-bold">{persHeight}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="140"
                    value={persHeight}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPersHeight(val);
                      savePersSetting("breezy_kb_height", val);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer bg-white/10 h-1.5 rounded-lg appearance-none"
                  />
                </div>

                {/* Key Width Scale */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70 font-semibold">Key Width Scale</span>
                    <span className="text-cyan-400 font-mono font-bold">{persWidth}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={persWidth}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPersWidth(val);
                      savePersSetting("breezy_kb_key_width", val);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer bg-white/10 h-1.5 rounded-lg appearance-none"
                  />
                </div>

                {/* Key Spacing */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70 font-semibold">Key Spacing</span>
                    <span className="text-cyan-400 font-mono font-bold">{persSpacing}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={persSpacing}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPersSpacing(val);
                      savePersSetting("breezy_kb_key_spacing", val);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer bg-white/10 h-1.5 rounded-lg appearance-none"
                  />
                </div>

                {/* Key Corner Radius */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70 font-semibold">Key Corner Radius</span>
                    <span className="text-cyan-400 font-mono font-bold">{persRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={persRadius}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPersRadius(val);
                      savePersSetting("breezy_kb_key_radius", val);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer bg-white/10 h-1.5 rounded-lg appearance-none"
                  />
                </div>

                {/* Label Size */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70 font-semibold">Key Label Size</span>
                    <span className="text-cyan-400 font-mono font-bold">{persLabelSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="22"
                    value={persLabelSize}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPersLabelSize(val);
                      savePersSetting("breezy_kb_label_size", val);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer bg-white/10 h-1.5 rounded-lg appearance-none"
                  />
                </div>

                {/* Background Transparency */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70 font-semibold">Background Opacity</span>
                    <span className="text-cyan-400 font-mono font-bold">{persBgOpacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={persBgOpacity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPersBgOpacity(val);
                      savePersSetting("breezy_kb_bg_opacity", val);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer bg-white/10 h-1.5 rounded-lg appearance-none"
                  />
                </div>
              </div>

              {/* Interaction Details Card */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 backdrop-blur-xl">
                <h4 className="text-[10px] font-black text-white/50 uppercase tracking-widest border-b border-white/5 pb-2">Feedback & Interactions</h4>

                {/* Key Press Animation Selector */}
                <div className="space-y-2">
                  <span className="text-xs text-white/70 font-semibold block">Key Press Animation</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "bubble", label: "Bubble Pop", desc: "Classic preview" },
                      { id: "scale", label: "Micro Scale", desc: "Press shrink" },
                      { id: "fade", label: "Glass Fade", desc: "Opacity flash" },
                      { id: "glow", label: "RGB Ignite", desc: "Neon pulse" }
                    ].map(anim => (
                      <button
                        key={anim.id}
                        onClick={() => {
                          setPersPressAnim(anim.id);
                          savePersSetting("breezy_kb_key_press_anim", anim.id);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          persPressAnim === anim.id 
                            ? "bg-white text-slate-950 border-white shadow-lg" 
                            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-tight">{anim.label}</p>
                        <p className={`text-[9px] ${persPressAnim === anim.id ? "text-slate-600" : "text-white/40"}`}>{anim.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sound Type Selector */}
                <div className="space-y-2">
                  <span className="text-xs text-white/70 font-semibold block">Click Sound Profile</span>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "mechanical", label: "Mechanical Blue", desc: "Crisp clicky" },
                      { id: "retro", label: "Retro Typewriter", desc: "Iron strike" },
                      { id: "bubble", label: "Soap Bubble", desc: "Damped pop" },
                      { id: "synth", label: "Cosmic Synth", desc: "Analog chirp" }
                    ].map(sound => (
                      <button
                        key={sound.id}
                        onClick={() => {
                          setPersSoundType(sound.id);
                          savePersSetting("breezy_kb_press_sound_type", sound.id);
                        }}
                        className={`p-2.5 rounded-xl text-left border transition-all ${
                          persSoundType === sound.id 
                            ? "bg-white text-slate-950 border-white shadow-lg" 
                            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-tight">{sound.label}</p>
                        <p className={`text-[9px] ${persSoundType === sound.id ? "text-slate-600" : "text-white/40"}`}>{sound.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vibration Strength Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70 font-semibold">Vibration Haptic Strength</span>
                    <span className="text-cyan-400 font-mono font-bold">{persVibeStrength}ms</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="60"
                    value={persVibeStrength}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPersVibeStrength(val);
                      savePersSetting("breezy_kb_vibe_strength", val);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer bg-white/10 h-1.5 rounded-lg appearance-none"
                  />
                </div>

                {/* Long Press Threshold Slider */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/70 font-semibold">Long Press Accents Hold</span>
                    <span className="text-cyan-400 font-mono font-bold">{persLongPress}ms</span>
                  </div>
                  <input
                    type="range"
                    min="250"
                    max="900"
                    step="50"
                    value={persLongPress}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPersLongPress(val);
                      savePersSetting("breezy_kb_long_press_duration", val);
                    }}
                    className="w-full accent-cyan-400 cursor-pointer bg-white/10 h-1.5 rounded-lg appearance-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 9: ACCESSIBILITY */}
          {activeSubTab === "accessibility" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-5 pb-10"
            >
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setActiveSubTab("settings")}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs"
                  >
                    ← Back
                  </button>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Accessibility & Speech</h3>
                </div>
                <span className="text-[9px] font-bold text-pink-400 uppercase tracking-widest font-mono">Universal Access</span>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-5 backdrop-blur-xl">
                {/* High Contrast Mode */}
                <div className="flex items-center justify-between p-1">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">High Contrast Mode</p>
                    <p className="text-[9.5px] text-white/40">Thick outlines and higher keyboard visual readability</p>
                  </div>
                  <button
                    onClick={() => {
                      const val = !accContrast;
                      setAccContrast(val);
                      localStorage.setItem("breezy_accessibility_high_contrast", String(val));
                      triggerSettingsSync();
                    }}
                    className={`w-11 h-6 rounded-full transition-all relative ${accContrast ? "bg-cyan-500" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${accContrast ? "left-6" : "left-1"}`} />
                  </button>
                </div>

                {/* Spoken feedback Screen Reader */}
                <div className="flex items-center justify-between p-1 border-t border-white/5 pt-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-white uppercase tracking-tight">Spoken Key Feedback</p>
                    <p className="text-[9.5px] text-white/40">TTS screen reader voice guidance for letters and symbols</p>
                  </div>
                  <button
                    onClick={() => {
                      const val = !accScreenReader;
                      setAccScreenReader(val);
                      localStorage.setItem("breezy_accessibility_screen_reader", String(val));
                      triggerSettingsSync();
                    }}
                    className={`w-11 h-6 rounded-full transition-all relative ${accScreenReader ? "bg-cyan-500" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${accScreenReader ? "left-6" : "left-1"}`} />
                  </button>
                </div>

                {/* Color Blind Mode */}
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <p className="text-xs font-bold text-white uppercase tracking-tight">Color Blind Palette Filters</p>
                  <p className="text-[9.5px] text-white/40 mb-2">Simulate or optimize RGB themes for color conditions</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "none", label: "None (Standard)", desc: "Full spectrum" },
                      { id: "protanopia", label: "Protanopia", desc: "Red blind" },
                      { id: "deuteranopia", label: "Deuteranopia", desc: "Green blind" },
                      { id: "tritanopia", label: "Tritanopia", desc: "Blue blind" }
                    ].map(cond => (
                      <button
                        key={cond.id}
                        onClick={() => {
                          setAccColorBlind(cond.id);
                          localStorage.setItem("breezy_accessibility_color_blind", cond.id);
                          triggerSettingsSync();
                        }}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          accColorBlind === cond.id 
                            ? "bg-white text-slate-950 border-white shadow-lg" 
                            : "bg-white/5 text-white border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-xs font-bold uppercase tracking-tight">{cond.label}</p>
                        <p className={`text-[9px] ${accColorBlind === cond.id ? "text-slate-600" : "text-white/40"}`}>{cond.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 10: BACKUP & RESTORE */}
          {activeSubTab === "backup_restore" && (() => {
            const [syncLoading, setSyncLoading] = useState(false);
            const [syncStatusMsg, setSyncStatusMsg] = useState("");
            const [syncError, setSyncError] = useState("");
            const [importText, setImportText] = useState("");
            const [showImporter, setShowImporter] = useState(false);

            const handleBackup = async () => {
              setSyncLoading(true);
              setSyncError("");
              setSyncStatusMsg("");
              
              const currentUser = auth.currentUser;
              if (!currentUser) {
                setSyncError("Sign-in required to perform durable Cloud Backup.");
                setSyncLoading(false);
                return;
              }

              try {
                // Collect all Breezy settings from local storage
                const keysToBackup = [
                  "breezy_kb_height", "breezy_kb_key_width", "breezy_kb_key_spacing", "breezy_kb_key_radius",
                  "breezy_kb_label_size", "breezy_kb_font_size", "breezy_kb_bg_opacity", "breezy_kb_key_press_anim",
                  "breezy_kb_press_sound_type", "breezy_kb_vibe_strength", "breezy_kb_long_press_duration",
                  "breezy_accessibility_high_contrast", "breezy_accessibility_color_blind", "breezy_accessibility_screen_reader"
                ];
                
                const backupData: Record<string, any> = {};
                keysToBackup.forEach(k => {
                  backupData[k] = localStorage.getItem(k);
                });

                backupData.updatedAt = serverTimestamp();
                backupData.userEmail = currentUser.email;

                await setDoc(doc(db, "user_backups", currentUser.uid), backupData);
                setSyncStatusMsg("Durable cloud backup completed successfully!");
              } catch (err: any) {
                setSyncError(err?.message || "Firestore permission denied. Try signing in again.");
              } finally {
                setSyncLoading(false);
              }
            };

            const handleRestore = async () => {
              setSyncLoading(true);
              setSyncError("");
              setSyncStatusMsg("");

              const currentUser = auth.currentUser;
              if (!currentUser) {
                setSyncError("Sign-in required to fetch Cloud backups.");
                setSyncLoading(false);
                return;
              }

              try {
                const docSnap = await getDoc(doc(db, "user_backups", currentUser.uid));
                if (docSnap.exists()) {
                  const data = docSnap.data();
                  Object.entries(data).forEach(([key, val]) => {
                    if (key !== "updatedAt" && key !== "userEmail" && val !== null && val !== undefined) {
                      localStorage.setItem(key, String(val));
                    }
                  });
                  // Trigger Sync
                  triggerSettingsSync();
                  setSyncStatusMsg("Cloud backup settings restored and synchronized!");
                } else {
                  setSyncError("No previous backups found for this user account.");
                }
              } catch (err: any) {
                setSyncError(err?.message || "Failed to load backup from Cloud.");
              } finally {
                setSyncLoading(false);
              }
            };

            const handleResetDefault = () => {
              if (confirm("Reset all custom settings to system defaults? This cannot be undone.")) {
                const keysToRemove = [
                  "breezy_kb_height", "breezy_kb_key_width", "breezy_kb_key_spacing", "breezy_kb_key_radius",
                  "breezy_kb_label_size", "breezy_kb_font_size", "breezy_kb_bg_opacity", "breezy_kb_key_press_anim",
                  "breezy_kb_press_sound_type", "breezy_kb_vibe_strength", "breezy_kb_long_press_duration",
                  "breezy_accessibility_high_contrast", "breezy_accessibility_color_blind", "breezy_accessibility_screen_reader"
                ];
                keysToRemove.forEach(k => localStorage.removeItem(k));
                triggerSettingsSync();
                alert("Settings reset to defaults!");
                window.location.reload();
              }
            };

            const handleExport = () => {
              const exportKeys = [
                "breezy_kb_height", "breezy_kb_key_width", "breezy_kb_key_spacing", "breezy_kb_key_radius",
                "breezy_kb_label_size", "breezy_kb_font_size", "breezy_kb_bg_opacity", "breezy_kb_key_press_anim",
                "breezy_kb_press_sound_type", "breezy_kb_vibe_strength", "breezy_kb_long_press_duration",
                "breezy_accessibility_high_contrast", "breezy_accessibility_color_blind", "breezy_accessibility_screen_reader"
              ];
              const config: Record<string, string | null> = {};
              exportKeys.forEach(k => {
                config[k] = localStorage.getItem(k);
              });
              
              const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const link = document.createElement("a");
              link.href = url;
              link.download = "breezy_settings_backup.json";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };

            const handleImport = () => {
              try {
                const config = JSON.parse(importText);
                Object.entries(config).forEach(([key, val]) => {
                  if (val !== null && val !== undefined) {
                    localStorage.setItem(key, String(val));
                  }
                });
                triggerSettingsSync();
                alert("Settings imported successfully!");
                window.location.reload();
              } catch (e) {
                alert("Invalid settings JSON structure.");
              }
            };

            return (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-5 pb-10"
              >
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => setActiveSubTab("settings")}
                      className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs"
                    >
                      ← Back
                    </button>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Backup & Cloud Restore</h3>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Durable Storage</span>
                </div>

                {/* Main panel */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-5 space-y-4 backdrop-blur-xl">
                  <div className="text-center p-3 rounded-2xl bg-black/20 space-y-2 border border-white/5">
                    <Cloud className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
                    <p className="text-xs font-bold text-white uppercase tracking-wide">Sync configurations across devices</p>
                    <p className="text-[9px] text-white/40 max-w-xs mx-auto">
                      Durable Cloud Sync keeps your keyboard layouts, spacing, sizes, and haptics safely synced.
                    </p>
                  </div>

                  {syncStatusMsg && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 shrink-0" />
                      <span>{syncStatusMsg}</span>
                    </div>
                  )}

                  {syncError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs rounded-xl">
                      {syncError}
                    </div>
                  )}

                  {/* Cloud Action Buttons */}
                  <div className="grid grid-cols-2 gap-3.5 pt-2">
                    <button
                      onClick={handleBackup}
                      disabled={syncLoading}
                      className="py-3.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 border border-cyan-500/20 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 active:scale-95"
                    >
                      {syncLoading ? (
                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Backup Cloud</span>
                      )}
                    </button>

                    <button
                      onClick={handleRestore}
                      disabled={syncLoading}
                      className="py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 font-bold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 active:scale-95"
                    >
                      {syncLoading ? (
                        <div className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span>Restore Cloud</span>
                      )}
                    </button>
                  </div>

                  {/* Local Export/Import actions */}
                  <div className="border-t border-white/5 pt-4 space-y-3">
                    <p className="text-[9.5px] font-black text-white/40 uppercase tracking-widest">Local Settings & Transfers</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleExport}
                        className="py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Export JSON File
                      </button>
                      <button
                        onClick={() => setShowImporter(!showImporter)}
                        className="py-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Import JSON Config
                      </button>
                    </div>

                    {showImporter && (
                      <div className="space-y-2.5 bg-black/30 border border-white/10 p-3 rounded-2xl animate-fadeIn">
                        <textarea
                          placeholder="Paste JSON settings content here..."
                          value={importText}
                          onChange={(e) => setImportText(e.target.value)}
                          className="w-full bg-black/40 border border-white/5 rounded-xl p-2.5 text-[10px] font-mono text-white placeholder-white/20 h-24 focus:outline-none focus:border-white/20"
                        />
                        <button
                          onClick={handleImport}
                          className="w-full py-2 bg-cyan-500 text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all hover:bg-cyan-400"
                        >
                          Apply Import Config
                        </button>
                      </div>
                    )}

                    <button
                      onClick={handleResetDefault}
                      className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      Reset All Settings to System Defaults
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {activeSubTab === "about" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setActiveSubTab("settings")}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs cursor-pointer"
                >
                  ← Back to Settings
                </button>
              </div>
              <AboutTab />
            </motion.div>
          )}

          {activeSubTab === "legal" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setActiveSubTab("settings")}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs cursor-pointer"
                >
                  ← Back to Settings
                </button>
              </div>
              <PrivacyLegalTab />
            </motion.div>
          )}

          {activeSubTab === "help" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setActiveSubTab("settings")}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs cursor-pointer"
                >
                  ← Back to Settings
                </button>
              </div>
              <HelpSupportTab />
            </motion.div>
          )}

          {activeSubTab === "onboarding" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setActiveSubTab("settings")}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs cursor-pointer"
                >
                  ← Back to Settings
                </button>
              </div>
              <OnboardingTour 
                onComplete={() => {
                  setActiveSubTab("settings");
                  if (userProfile && onChangeProfile) {
                    onChangeProfile({ ...userProfile, onboardingCompleted: true });
                  }
                }}
                onSkip={() => {
                  setActiveSubTab("settings");
                }}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {userProfile && !userProfile.onboardingCompleted && showSessionOnboarding && (
        <OnboardingTour 
          onComplete={() => {
            setShowSessionOnboarding(false);
            if (onChangeProfile) {
              onChangeProfile({ ...userProfile, onboardingCompleted: true });
            }
          }}
          onSkip={() => {
            setShowSessionOnboarding(false);
            if (onChangeProfile) {
              onChangeProfile({ ...userProfile, onboardingCompleted: true });
            }
          }}
        />
      )}

    </div>
  );
};
