/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  KeyboardLayoutType,
  KeyboardTheme,
  KeyboardFont,
  SupportedLanguage,
  UserProfile,
  Note,
  KeyboardLightingSettings,
  AISettings,
  AIProviderType,
  AIThinkingMode
} from "../types";
import { THEMES, FONTS, DEFAULT_PROFILE, DEFAULT_LIGHTING_SETTINGS } from "../data";
import { BUILT_IN_FONTS, loadGoogleFont } from "../fontsData";
import { BreezyKeyboard } from "./BreezyKeyboard";
import { DashboardApp } from "./DashboardApp";
import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Wifi,
  Signal,
  Battery,
  ChevronLeft,
  Circle,
  Square,
  MessageSquare,
  FileText,
  BookOpen,
  Palette,
  EyeOff,
  Sliders,
  Send,
  User,
  Crown,
  Heart,
  Settings,
  Sparkles,
  Info
} from "lucide-react";

interface AndroidMockupProps {
  userProfile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
}

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
}

export const AndroidMockup: React.FC<AndroidMockupProps> = ({
  userProfile,
  onChangeProfile
}) => {
  // Device Core States
  const [currentTime, setCurrentTime] = useState<string>("");
  const [batteryLevel, setBatteryLevel] = useState<number>(100);

  // Active Screen Selector: "home" | "messenger" | "notes" | "dashboard"
  const [activeScreen, setActiveScreen] = useState<"home" | "messenger" | "notes" | "dashboard">("home");
  const [dashboardSubTab, setDashboardSubTab] = useState<string>("ai");

  // Keyboard Customization States
  const [activeTheme, setActiveTheme] = useState<KeyboardTheme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("breezy_theme_id");
      if (saved) {
        const found = THEMES.find(t => t.id === saved);
        if (found) return found;
      }
    }
    return THEMES[2]; // Cyberpunk default
  });
  const [activeFont, setActiveFont] = useState<KeyboardFont>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("breezy_font_id");
      if (saved) {
        const found = BUILT_IN_FONTS.find(f => f.id === saved) || FONTS.find(f => f.id === saved);
        if (found) return found;
      }
    }
    return BUILT_IN_FONTS.find(f => f.id === "font_space_grotesk") || BUILT_IN_FONTS[0] || FONTS[1];
  });

  useEffect(() => {
    const richFont = BUILT_IN_FONTS.find(f => f.id === activeFont.id);
    if (richFont && richFont.family) {
      loadGoogleFont(richFont.family);
    }
  }, [activeFont]);
  const [language, setLanguage] = useState<SupportedLanguage>("en");
  const [layout, setLayout] = useState<KeyboardLayoutType>(KeyboardLayoutType.QWERTY);
  const [keyboardHeight, setKeyboardHeight] = useState<number>(100); // 100%
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [vibrationEnabled, setVibrationEnabled] = useState<boolean>(true);
  const [incognitoMode, setIncognitoMode] = useState<boolean>(false);
  const [isAutoCorrectionEnabled, setIsAutoCorrectionEnabled] = useState<boolean>(true);
  const [aiSettings, setAiSettings] = useState<AISettings>({
    provider: AIProviderType.GEMINI,
    thinkingMode: AIThinkingMode.NORMAL,
    voiceAutoPunctuation: true,
    voiceRemoveFiller: true,
    translateWhileTyping: false,
    detectLanguage: true,
    incognitoMode: false
  });

  // Keyboard Lighting Settings state
  const [lightingSettings, setLightingSettings] = useState<KeyboardLightingSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("breezy_lighting_settings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return DEFAULT_LIGHTING_SETTINGS;
  });

  const handleUpdateLightingSettings = (newSettings: KeyboardLightingSettings) => {
    setLightingSettings(newSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem("breezy_lighting_settings", JSON.stringify(newSettings));
    }
  };

  // Active input buffer & focus tracker
  const [inputText, setInputText] = useState<string>("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [isKeyboardFocused, setIsKeyboardFocused] = useState<boolean>(false);

  // Notes state
  const [notes, setNotes] = useState<Note[]>([
    { id: "n1", title: "Meeting Prep", content: "Discuss the swahili localization project with Glass team.", createdAt: "07/03 09:30" },
    { id: "n2", title: "Ideas for post", content: "Compose beautiful caption using Glass AI /caption template.", createdAt: "07/03 10:15" }
  ]);

  // Messenger logs
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", sender: "bot", text: "Welcome to Glass Messenger! I'm Glass AI. Tap below to bring up the keyboard, start typing, and ask me anything!", time: "09:00" }
  ]);
  const [messengerLoading, setMessengerLoading] = useState<boolean>(false);

  // AI Usage metrics
  const [aiHistory, setAiHistory] = useState<{ prompt: string; response: string; date: string }[]>([]);

  // Update real-time clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      let hrs = d.getHours();
      let mins = d.getMinutes().toString().padStart(2, "0");
      let ampm = hrs >= 12 ? "PM" : "AM";
      hrs = hrs % 12 || 12;
      setCurrentTime(`${hrs}:${mins} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);

    // Battery simulation
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    return () => clearInterval(interval);
  }, []);

  // Sync profile values if theme/font is changed inside companion app
  const handleSelectTheme = (theme: KeyboardTheme) => {
    setActiveTheme(theme);
    if (typeof window !== "undefined") {
      localStorage.setItem("breezy_theme_id", theme.id);
    }
    // Auto point trigger
    if (!userProfile.achievements.includes("theme_explorer")) {
      const updated = {
        ...userProfile,
        achievements: [...userProfile.achievements, "theme_explorer"],
        totalPoints: userProfile.totalPoints + 15
      };
      onChangeProfile(updated);
    }
  };

  const handleSelectFont = (font: KeyboardFont) => {
    setActiveFont(font);
    if (typeof window !== "undefined") {
      localStorage.setItem("breezy_font_id", font.id);
    }
  };

  // Sync aiSettings state with userProfile.aiSettings
  useEffect(() => {
    if (userProfile && userProfile.aiSettings) {
      setAiSettings(userProfile.aiSettings);
    }
  }, [userProfile]);

  const handleUpdateAiSettings = (newSettings: AISettings) => {
    setAiSettings(newSettings);
    onChangeProfile({
      ...userProfile,
      aiSettings: newSettings
    });
  };

  // Load AI history from Firestore when authenticated
  useEffect(() => {
    let unsubscribeHistory: () => void;
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Clean up previous listener if it exists
      if (unsubscribeHistory) {
        unsubscribeHistory();
      }
      
      if (user) {
        const q = query(
          collection(db, "ai_history"),
          where("userId", "==", user.uid)
        );
        
        unsubscribeHistory = onSnapshot(q, (snapshot) => {
          const historyData = snapshot.docs.map(doc => {
            const data = doc.data();
            const dateStr = data.createdAt ? new Date(data.createdAt.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
            return {
              id: doc.id,
              prompt: data.prompt || "",
              response: data.response || "",
              date: dateStr,
              timestamp: data.createdAt ? data.createdAt.seconds : 0
            };
          }).sort((a, b) => b.timestamp - a.timestamp);
          setAiHistory(historyData);
        }, (error) => {
          console.error("Error fetching AI history from Firestore:", error);
        });

        
      } else {
        setAiHistory([]);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeHistory) {
        unsubscribeHistory();
      }
    };
  }, []);

  // Notes Handlers
  const handleAddNote = (title: string, content: string) => {
    const newNote: Note = {
      id: Math.random().toString(),
      title,
      content,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Quota and AI validation helper - completely unlimited under Free Access Model
  const handleDeductAIQuota = (): boolean => {
    return true;
  };

  const handleAddAIConversation = async (prompt: string, response: string) => {
    const date = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setAiHistory(prev => [
      { prompt, response, date },
      ...prev
    ]);

    if (auth.currentUser) {
      try {
        await addDoc(collection(db, "ai_history"), {
          userId: auth.currentUser.uid,
          prompt,
          response,
          createdAt: serverTimestamp(),
          isFavorite: false,
          isThinking: false
        });
      } catch (e) {
        console.error("Error saving AI conversation to Firestore:", e);
      }
    }
  };

  // Custom component for a visually interactive input with cursor
  const VisualInput = ({ text, cursorAt, placeholder, focused, onFocus }: { text: string, cursorAt: number, placeholder: string, focused: boolean, onFocus: () => void }) => {
    const leftText = text.slice(0, cursorAt);
    const rightText = text.slice(cursorAt);
    
    return (
      <div 
        onClick={onFocus}
        className={`flex-1 bg-slate-900/50 text-xs text-white p-2.5 rounded-full border border-white/20 min-h-[36px] flex items-center overflow-hidden cursor-text transition-all ${focused ? "border-white/50 bg-slate-900/60 shadow-inner" : "border-white/20"}`}
      >
        <div className="flex items-center w-full truncate font-sans">
          {text === "" && !focused ? (
            <span className="text-white/40">{placeholder}</span>
          ) : (
            <>
              <span>{leftText}</span>
              {focused && (
                <motion.div
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-[2px] h-3.5 bg-blue-400 mx-[1px] shrink-0"
                />
              )}
              <span>{rightText}</span>
            </>
          )}
        </div>
      </div>
    );
  };

  // Send message on Messenger
  const handleSendMessage = async (overrideText?: string) => {
    const textToSend = overrideText !== undefined ? overrideText : inputText;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    if (overrideText === undefined) {
      setInputText("");
    }
    setMessengerLoading(true);

    // Deduct AI quota
    if (!handleDeductAIQuota()) {
      setMessengerLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/gemini/keyboard-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reply",
          text: userMsg.text
        })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setMessages(prev => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "bot",
            text: data.result,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
        handleAddAIConversation(userMsg.text, data.result);
      } else {
        throw new Error();
      }
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "bot",
          text: "Glass AI: Sorry, I am having trouble connecting right now. Please verify your GEMINI_API_KEY in Secrets panel.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setMessengerLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col items-center">
      
      {/* PHONE HOUSING CONTAINER (Glassmorphic Outer Frame with Glass Outlines) */}
      <div className="w-full aspect-[9/19.2] bg-[#06080d]/85 backdrop-blur-3xl rounded-[52px] p-3.5 shadow-[0_0_35px_rgba(255,255,255,0.15),0_25px_60px_-15px_rgba(0,0,0,0.95)] border-4 border-white/20 relative overflow-hidden flex flex-col justify-between ">
        
        {/* CAMERA NOTCH & EARPIECE */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-[#06080d] rounded-b-3xl z-50 flex items-center justify-center space-x-2">
          <div className="w-16 h-1 bg-zinc-800 rounded-full" />
          <div className="w-3.5 h-3.5 bg-zinc-900 rounded-full border border-zinc-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-blue-900/60 rounded-full" />
          </div>
        </div>

        {/* DEVICE SCREEN VIEWPORT (Frosted OLED Glass look) */}
        <div className="w-full h-full bg-slate-900/10 rounded-[38px] overflow-hidden flex flex-col justify-between relative z-10 border border-white/20 backdrop-blur-2xl shadow-[inset_0_0_60px_rgba(255,255,255,0.05),0_10px_40px_rgba(0,0,0,0.5)]">
          
          {/* 1. STATUS BAR */}
          <div className="w-full h-8 px-5 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between text-[11px] font-bold text-white font-sans z-30 shrink-0 shadow-sm">
            <span>{currentTime || "12:00 PM"}</span>
            <div className="flex items-center space-x-1.5">
              <Signal className="w-3.5 h-3.5 text-white" />
              <span className="text-[9px] font-extrabold uppercase font-mono tracking-wider text-white/90">5G</span>
              <Wifi className="w-3.5 h-3.5 text-white" />
              <div className="flex items-center space-x-0.5">
                <span className="text-[9px]">{batteryLevel}%</span>
                <Battery className="w-4 h-4 fill-current rotate-90 origin-center text-slate-300" />
              </div>
            </div>
          </div>

          {/* 2. CORE VIEWPORT CONTAINER */}
          <div className="flex-1 w-full bg-transparent relative overflow-hidden flex flex-col">
            
            {/* SCREEN LAYOUTS SWITCHER */}
            <AnimatePresence mode="wait">
              
              {/* LAYOUT A: HOME SCREEN LAUNCHER */}
              {activeScreen === "home" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full p-5 flex flex-col justify-between relative bg-cover bg-center bg-transparent"
                >
                  {/* Digital Clock Widget with Text Glow and glass background pill */}
                  <div className="text-center space-y-1 pt-6 flex flex-col items-center">
                    <div className="px-5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
                      <h2 className="text-3.5xl font-black text-white font-display tracking-tight drop-shadow-md">
                        {currentTime.split(" ")[0]}
                      </h2>
                      <p className="text-[8.5px] font-black text-white/80 font-mono tracking-widest uppercase">
                        ✦ GLASS GLASS OS ✦
                      </p>
                    </div>
                  </div>

                  {/* App Shortcut grid */}
                  <div className="grid grid-cols-4 gap-4 my-auto px-1">
                    {[
                      { id: "messenger", label: "Messenger", icon: MessageSquare, color: "bg-white/10 text-white border border-white/20 shadow-md hover:bg-white/20" },
                      { id: "notes", label: "Drafts", icon: FileText, color: "bg-white/10 text-white border border-white/20 shadow-md hover:bg-white/20" },
                      { id: "dashboard_ai", label: "Glass AI", icon: Sparkles, color: "bg-white/10 text-white border border-white/20 shadow-md hover:bg-white/20", sub: "ai" },
                      { id: "dashboard_learn", label: "Academy", icon: BookOpen, color: "bg-white/10 text-white border border-white/20 shadow-md hover:bg-white/20", sub: "learn" },
                      { id: "dashboard_themes", label: "Themes", icon: Palette, color: "bg-white/10 text-white border border-white/20 shadow-md hover:bg-white/20", sub: "themes" },
                      { id: "dashboard_protect", label: "Protect", icon: EyeOff, color: "bg-white/10 text-white border border-white/20 shadow-md hover:bg-white/20", sub: "protect" },
                      { id: "dashboard_settings", label: "Settings", icon: Sliders, color: "bg-white/10 text-white border border-white/20 shadow-md hover:bg-white/20", sub: "settings" }
                    ].map(app => {
                      const Icon = app.icon;
                      return (
                        <button
                          key={app.id}
                          onClick={() => {
                            if (app.id.startsWith("dashboard")) {
                              setActiveScreen("dashboard");
                              setDashboardSubTab(app.sub || "ai");
                            } else {
                              setActiveScreen(app.id as any);
                            }
                          }}
                          className="flex flex-col items-center space-y-1 focus:outline-none hover:scale-105 transition-all"
                        >
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all active:scale-95 backdrop-blur-md ${app.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] text-slate-300 font-bold truncate tracking-tight">{app.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Desktop bottom persistent dock with rich glass and inner border glow */}
                  <div className="w-full bg-[#0a0c10]/40 backdrop-blur-xl p-2 rounded-[28px] border border-white/15 flex justify-around items-center shadow-[0_8px_32px_0_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] ">
                    {[
                      { id: "messenger", icon: MessageSquare },
                      { id: "notes", icon: FileText },
                      { id: "dashboard", icon: Settings }
                    ].map(dk => {
                      const Icon = dk.icon;
                      return (
                        <button
                          key={dk.id}
                          onClick={() => {
                            if (dk.id === "dashboard") {
                              setActiveScreen("dashboard");
                              setDashboardSubTab("ai");
                            } else {
                              setActiveScreen(dk.id as any);
                            }
                          }}
                          className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* LAYOUT B: GLASS MESSENGER */}
              {activeScreen === "messenger" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col justify-between bg-transparent"
                >
                  {/* Chat header */}
                  <div className="w-full h-13 border-b border-white/20 bg-white/10 backdrop-blur-3xl flex items-center px-4 space-x-3 shadow-sm z-20">
                    <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 p-0.5 shadow-sm">
                      <div className="w-full h-full rounded-full bg-slate-900/50 flex items-center justify-center font-bold text-white text-[10px]">
                        AI
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-semibold text-white font-display tracking-tight flex items-center space-x-1.5">
                        <span>Glass Assistant</span>
                      </h4>
                      <div className="flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-ping" />
                        <span className="text-[8.5px] text-white/70 font-medium uppercase font-mono tracking-wider">Real-Time</span>
                      </div>
                    </div>
                  </div>

                  {/* Messages scroll list */}
                  <div className="flex-1 w-full overflow-y-auto p-4 space-y-3.5 no-scrollbar pb-10 bg-transparent">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`max-w-[82%] p-3 rounded-2xl text-[11.5px] leading-relaxed relative border backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] ${msg.sender === "user" ? "bg-white/20 text-white border-white/30 rounded-tr-none ml-auto" : "bg-slate-900/40 text-slate-100 border-white/10 rounded-tl-none mr-auto"}`}
                      >
                        {msg.text.startsWith("http") && (msg.text.includes(".gif") || msg.text.includes("giphy.com") || msg.text.includes("tenor.com") || msg.text.includes("googleusercontent.com")) ? (
                          <div className="py-1">
                            <img
                              src={msg.text}
                              alt="Shared GIF"
                              className="max-w-full rounded-lg max-h-36 object-contain shadow-md"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        ) : (
                          msg.text
                        )}
                        <span className="text-[7px] opacity-60 absolute bottom-1 right-2 text-right">
                          {msg.time}
                        </span>
                      </div>
                    ))}
                    {messengerLoading && (
                      <div className="p-3 bg-slate-900/40 rounded-2xl rounded-tl-none border border-white/10 text-[11px] text-slate-300 mr-auto max-w-[80%] flex items-center space-x-1.5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)]">
                        <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        <span className="italic text-[10px] text-slate-300">Glass AI is typing...</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Messaging bar triggering Keyboard */}
                  <div className="w-full p-3 bg-white/10 backdrop-blur-3xl border-t border-white/20 flex items-center space-x-2 shrink-0 z-10 shadow-sm">
                    <VisualInput 
                      text={inputText}
                      cursorAt={cursorPosition}
                      placeholder="Type a message..."
                      focused={isKeyboardFocused}
                      onFocus={() => setIsKeyboardFocused(true)}
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="w-9 h-9 rounded-full bg-white/20 border border-white/30 hover:bg-white/30 text-white flex items-center justify-center shrink-0 shadow-lg active:scale-95 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* LAYOUT C: DRAFTS & NOTES */}
              {activeScreen === "notes" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full bg-transparent flex flex-col justify-between"
                >
                  <div className="p-4 flex-1 overflow-y-auto no-scrollbar space-y-4">
                    <div className="flex justify-between items-center border-b border-white/20 pb-2">
                      <h3 className="text-xs font-semibold text-white font-display uppercase tracking-widest">Drafts</h3>
                      <button
                        onClick={() => {
                          setActiveScreen("dashboard");
                          setDashboardSubTab("hub");
                        }}
                        className="px-2.5 py-1 bg-white/10 text-[10px] font-bold rounded-lg text-white border border-white/20 backdrop-blur-md hover:bg-white/20 active:scale-95 transition-all shadow-sm"
                      >
                        + Create
                      </button>
                    </div>

                    <div className="space-y-3">
                      {notes.map(note => (
                        <div key={note.id} className="p-3.5 bg-white/10 rounded-2xl border border-white/20 space-y-1.5 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:bg-white/20 transition-all">
                          <h4 className="text-xs font-bold text-white font-display">{note.title}</h4>
                          <p className="text-[10.5px] text-white/80 leading-relaxed line-clamp-3">{note.content}</p>
                          <span className="text-[7.5px] text-white/50 block font-mono uppercase tracking-wider">{note.createdAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notepad interactive composing bar */}
                  <div className="p-3 bg-white/10 backdrop-blur-3xl border-t border-white/20 flex flex-col shrink-0 z-10 shadow-sm">
                    <VisualInput 
                      text={inputText}
                      cursorAt={cursorPosition}
                      placeholder="Compose drafting notes..."
                      focused={isKeyboardFocused}
                      onFocus={() => setIsKeyboardFocused(true)}
                    />
                    {inputText && (
                      <button
                        onClick={() => {
                          handleAddNote("Quick Draft", inputText);
                          setInputText("");
                        }}
                        className="mt-2 py-2 bg-white/20 border border-white/30 text-white font-bold rounded-xl text-xs hover:bg-white/30 shadow-lg active:scale-95 transition-all"
                      >
                        SAVE NOTE
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* LAYOUT D: COMPANION APP DASHBOARD */}
              {activeScreen === "dashboard" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full overflow-hidden"
                >
                  <DashboardApp
                    userProfile={userProfile}
                    onChangeProfile={onChangeProfile}
                    activeTab={dashboardSubTab}
                    onCloseApp={() => setActiveScreen("home")}
                    onSelectTheme={handleSelectTheme}
                    onSelectFont={handleSelectFont}
                    activeThemeId={activeTheme.id}
                    activeFontId={activeFont.id}
                    keyboardHeight={keyboardHeight}
                    setKeyboardHeight={setKeyboardHeight}
                    soundEnabled={soundEnabled}
                    setSoundEnabled={setSoundEnabled}
                    vibrationEnabled={vibrationEnabled}
                    setVibrationEnabled={setVibrationEnabled}
                    incognitoMode={incognitoMode}
                    setIncognitoMode={setIncognitoMode}
                    isAutoCorrectionEnabled={isAutoCorrectionEnabled}
                    setAutoCorrectionEnabled={setIsAutoCorrectionEnabled}
                    language={language}
                    setLanguage={setLanguage}
                    keyboardLayout={layout}
                    setLayout={setLayout}
                    notes={notes}
                    onAddNote={handleAddNote}
                    onDeleteNote={handleDeleteNote}
                    aiHistory={aiHistory}
                    lightingSettings={lightingSettings}
                    onUpdateLightingSettings={handleUpdateLightingSettings}
                    aiSettings={aiSettings}
                    onUpdateAiSettings={handleUpdateAiSettings}
                  />
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* 3. VIRTUAL SLIDING KEYBOARD DRAWER */}
          <AnimatePresence>
            {isKeyboardFocused && (
              <motion.div
                initial={{ y: 300, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 300, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-full bg-slate-950 border-t border-white/10 relative z-40 shrink-0 select-none"
              >
                <BreezyKeyboard
                  theme={activeTheme}
                  font={activeFont}
                  language={language}
                  layout={layout}
                  heightPercent={keyboardHeight}
                  soundEnabled={soundEnabled}
                  vibrationEnabled={vibrationEnabled}
                  incognitoMode={incognitoMode}
                  isAutoCorrectionEnabled={isAutoCorrectionEnabled}
                  userProfile={userProfile}
                  currentInputText={inputText}
                  onInputChange={(newVal) => setInputText(newVal)}
                  onCursorChange={setCursorPosition}
                  onSendInput={(immediateValue) => {
                    // Send action depending on current screen
                    if (activeScreen === "messenger") {
                      handleSendMessage(immediateValue);
                    } else if (activeScreen === "notes") {
                      handleAddNote("Draft", immediateValue !== undefined ? immediateValue : inputText);
                      setInputText("");
                    }
                    setIsKeyboardFocused(false);
                  }}
                  onOpenSettings={() => {
                    setActiveScreen("dashboard");
                    setDashboardSubTab("settings");
                    setIsKeyboardFocused(false);
                  }}
                  onOpenDashboardTab={(tab) => {
                    setActiveScreen("dashboard");
                    setDashboardSubTab(tab);
                    setIsKeyboardFocused(false);
                  }}
                  onAddClipboard={(text) => {
                    // Save to local clipboards
                    if (!incognitoMode) {
                      // Save to clips
                    }
                  }}
                  onAddAIConversation={handleAddAIConversation}
                  lightingSettings={lightingSettings}
                  onSelectTheme={handleSelectTheme}
                  onSelectFont={handleSelectFont}
                  aiSettings={aiSettings}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. PHYSICAL ANDROID BOTTOM NAV BAR */}
          <div className="w-full h-11 bg-[#090b10] flex items-center justify-around text-slate-400 z-30 shrink-0">
            {/* Back Button */}
            <button
              onClick={() => {
                if (isKeyboardFocused) {
                  setIsKeyboardFocused(false);
                } else if (activeScreen !== "home") {
                  setActiveScreen("home");
                }
              }}
              className="p-2 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            
            {/* Home button */}
            <button
              onClick={() => {
                setActiveScreen("home");
                setIsKeyboardFocused(false);
              }}
              className="p-2 hover:text-white transition-colors"
            >
              <Circle className="w-4 h-4 fill-current stroke-[2.5]" />
            </button>

            {/* Recents button */}
            <button
              onClick={() => {
                setIsKeyboardFocused(!isKeyboardFocused);
              }}
              className="p-2 hover:text-white transition-colors"
            >
              <Square className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
