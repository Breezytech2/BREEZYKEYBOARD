/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { KeyButton } from "./keyboard/KeyButton";
import { EmojiSearch } from "./dashboard/EmojiSearch";
import {
  KeyboardLayoutType,
  KeyboardTheme,
  KeyboardFont,
  SupportedLanguage,
  UserProfile,
  ClipboardItem,
  ProtectReport,
  KeyboardLightingSettings,
  AISettings,
  AIThinkingMode
} from "../types";
import { LANGUAGES, THEMES, DEFAULT_LIGHTING_SETTINGS } from "../data";
import { BUILT_IN_FONTS, loadGoogleFont } from "../fontsData";
import { INITIAL_STICKERS, STICKER_CATEGORIES } from "../stickersData";
import { activeGifProvider, FALLBACK_GIFS, GIF_CATEGORIES } from "../gifsData";
import { FontPicker } from "./FontPicker";
import { StickerPicker } from "./StickerPicker";
import { GifBrowser } from "./GifBrowser";
import { EmojiPicker } from "./EmojiPicker";
import { ProductivityHub } from "./keyboard/ProductivityHub";
import { AITab } from "./keyboard/AITab";
import { ProtectTab } from "./keyboard/ProtectTab";
import { VoiceTab } from "./keyboard/VoiceTab";
import { TranslateTab } from "./keyboard/TranslateTab";
import {
  Sparkles,
  Mic,
  Languages,
  FolderLock,
  History,
  Grid,
  ChevronUp,
  ChevronDown,
  Smile,
  Delete,
  CornerDownLeft,
  Volume2,
  VolumeX,
  Type as FontIcon,
  Settings,
  HelpCircle,
  TrendingUp,
  User,
  ShieldAlert,
  ShieldCheck,
  Check,
  AlertTriangle,
  Send,
  MessageSquare,
  Cpu,
  Heart,
  Search,
  Image,
  Flame,
  Layout,
  RefreshCw,
  Pin,
  Trash2,
  Eye,
  X
} from "lucide-react";

interface BreezyKeyboardProps {
  theme: KeyboardTheme;
  font: KeyboardFont;
  language: SupportedLanguage;
  layout: KeyboardLayoutType;
  heightPercent: number; // 80 - 120
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  incognitoMode: boolean;
  isAutoCorrectionEnabled: boolean;
  userProfile: UserProfile;
  currentInputText: string;
  onInputChange: (newText: string) => void;
  onCursorChange?: (index: number) => void;
  onSendInput: (immediateValue?: string) => void;
  onOpenSettings: () => void;
  onOpenDashboardTab: (tab: string) => void;
  onAddClipboard: (text: string) => void;
  onAddAIConversation: (prompt: string, response: string) => void;
  lightingSettings?: KeyboardLightingSettings;
  onSelectTheme?: (theme: KeyboardTheme) => void;
  onSelectFont?: (font: KeyboardFont) => void;
  aiSettings?: AISettings;
}

export const BreezyKeyboard: React.FC<BreezyKeyboardProps> = ({
  theme,
  font,
  language,
  layout,
  heightPercent,
  soundEnabled,
  vibrationEnabled,
  incognitoMode,
  isAutoCorrectionEnabled,
  userProfile,
  currentInputText,
  onInputChange,
  onCursorChange,
  onSendInput,
  onOpenSettings,
  onOpenDashboardTab,
  onAddClipboard,
  onAddAIConversation,
  lightingSettings,
  onSelectTheme,
  onSelectFont,
  aiSettings
}) => {
  // Sound Synthesis helper
  const playKeySound = (soundType: "standard" | "space" | "backspace" | "modifier") => {
    if (!soundEnabled) return;
    try {
      const soundProfile = kbPressSoundType || "mechanical";
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const duration = soundType === "space" ? 0.08 : 0.05;
      
      if (soundProfile === "bubble") {
        // Bubble pop sound (frequency sweeps upwards rapidly)
        osc.type = "sine";
        const startFreq = soundType === "backspace" ? 200 : 400;
        const endFreq = soundType === "backspace" ? 400 : 800;
        osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } else if (soundProfile === "tech") {
        // High pitch short blip click
        osc.type = "sine";
        osc.frequency.setValueAtTime(1600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.02);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
        osc.start();
        osc.stop(ctx.currentTime + 0.02);
      } else if (soundProfile === "modern") {
        // Low pitch wooden clack click
        osc.type = "triangle";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start();
        osc.stop(ctx.currentTime + 0.04);
      } else {
        // Mechanical default sounds
        if (soundType === "standard") {
          osc.type = "sine";
          osc.frequency.setValueAtTime(1100, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.04);
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
          osc.start();
          osc.stop(ctx.currentTime + 0.04);
        } else if (soundType === "space") {
          osc.type = "triangle";
          osc.frequency.setValueAtTime(350, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.06);
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
          osc.start();
          osc.stop(ctx.currentTime + 0.06);
        } else if (soundType === "backspace") {
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(280, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.05);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        } else {
          osc.type = "sine";
          osc.frequency.setValueAtTime(750, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.05);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        }
      }
    } catch (e) {
      // Ignored if browser blocks audio
    }
  };

  const triggerVibration = () => {
    if (!vibrationEnabled) return;
    const strength = kbVibeStrength !== undefined ? kbVibeStrength : 15;
    if (strength <= 0) return;
    if (navigator.vibrate) {
      navigator.vibrate(strength);
    }
  };

  const uniqueId = React.useRef("breezy_" + Math.random().toString(36).substring(2, 9));
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Load lighting settings from prop, or local storage, or fallback to default
  const [localLighting, setLocalLighting] = useState<KeyboardLightingSettings>(() => {
    if (lightingSettings) return lightingSettings;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("breezy_lighting_settings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return DEFAULT_LIGHTING_SETTINGS;
  });

  // Sync lightingSettings prop if provided
  useEffect(() => {
    if (lightingSettings) {
      setLocalLighting(lightingSettings);
    }
  }, [lightingSettings]);

  const lightingStyles = React.useMemo(() => {
    const { brightness, glowIntensity, underglow, speed, mode, color } = localLighting;
    
    // Resolve animation duration based on speed
    const durations = {
      static: "0s",
      very_slow: "15s",
      slow: "10s",
      normal: "6s",
      fast: "3s",
      very_fast: "1.5s"
    };
    const duration = durations[speed] || "6s";
    
    // Base color hexes
    const resolvedColor = color === "rainbow" ? "#00e5ff" : color;
    const glowRadius = (20 * glowIntensity) / 100;
    const innerGlowRadius = (12 * glowIntensity) / 100;
    const textGlowRadius = (8 * glowIntensity) / 100;
    
    let styles = "";
    
    // Define CSS variables for keycaps
    styles += `
      #${uniqueId.current} {
        --brightness-val: ${brightness / 100};
        --underglow-opacity: ${underglow === -1 ? 0 : underglow / 100};
        --glow-color: ${resolvedColor};
        --glow-radius: ${glowRadius}px;
        --inner-glow-radius: ${innerGlowRadius}px;
        --text-glow-radius: ${textGlowRadius}px;
        --animation-duration: ${duration};
      }
    `;
    
    // Animations depending on the Mode
    if (mode === "breathing" && speed !== "static") {
      styles += `
        @keyframes breezyBreathing_${uniqueId.current} {
          0%, 100% { box-shadow: inset 0 0 calc(var(--inner-glow-radius) * 0.4) var(--glow-color), 0 0 calc(var(--glow-radius) * 0.3) var(--glow-color); opacity: 0.6; }
          50% { box-shadow: inset 0 0 var(--inner-glow-radius) var(--glow-color), 0 0 var(--glow-radius) var(--glow-color); opacity: 1; }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyBreathing_${uniqueId.current} var(--animation-duration) ease-in-out infinite !important;
        }
      `;
    } else if (mode === "rainbow" || color === "rainbow") {
      styles += `
        @keyframes breezyRainbow_${uniqueId.current} {
          0% { border-color: #ff0055; box-shadow: inset 0 0 var(--inner-glow-radius) #ff0055, 0 0 var(--glow-radius) #ff0055; --glow-color: #ff0055; }
          20% { border-color: #00e5ff; box-shadow: inset 0 0 var(--inner-glow-radius) #00e5ff, 0 0 var(--glow-radius) #00e5ff; --glow-color: #00e5ff; }
          40% { border-color: #8a2be2; box-shadow: inset 0 0 var(--inner-glow-radius) #8a2be2, 0 0 var(--glow-radius) #8a2be2; --glow-color: #8a2be2; }
          60% { border-color: #d946ff; box-shadow: inset 0 0 var(--inner-glow-radius) #d946ff, 0 0 var(--glow-radius) #d946ff; --glow-color: #d946ff; }
          80% { border-color: #00f260; box-shadow: inset 0 0 var(--inner-glow-radius) #00f260, 0 0 var(--glow-radius) #00f260; --glow-color: #00f260; }
          100% { border-color: #ff0055; box-shadow: inset 0 0 var(--inner-glow-radius) #ff0055, 0 0 var(--glow-radius) #ff0055; --glow-color: #ff0055; }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyRainbow_${uniqueId.current} var(--animation-duration) linear infinite !important;
        }
      `;
    } else if (mode === "wave" && speed !== "static") {
      styles += `
        @keyframes breezyWave_${uniqueId.current} {
          0%, 100% { border-color: var(--glow-color); box-shadow: inset 0 0 calc(var(--inner-glow-radius) * 0.5) var(--glow-color), 0 0 calc(var(--glow-radius) * 0.4) var(--glow-color); filter: brightness(0.8); }
          50% { border-color: #ffffff; box-shadow: inset 0 0 calc(var(--inner-glow-radius) * 1.5) var(--glow-color), 0 0 calc(var(--glow-radius) * 1.5) var(--glow-color); filter: brightness(1.3); }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyWave_${uniqueId.current} var(--animation-duration) ease-in-out infinite !important;
        }
      `;
    } else if (mode === "pulse" && speed !== "static") {
      styles += `
        @keyframes breezyPulse_${uniqueId.current} {
          0%, 80%, 100% { box-shadow: inset 0 0 calc(var(--inner-glow-radius) * 0.6) var(--glow-color), 0 0 calc(var(--glow-radius) * 0.3) var(--glow-color); }
          90% { box-shadow: inset 0 0 calc(var(--inner-glow-radius) * 1.8) var(--glow-color), 0 0 calc(var(--glow-radius) * 1.8) var(--glow-color); filter: brightness(1.4); }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyPulse_${uniqueId.current} var(--animation-duration) cubic-bezier(0.25, 1, 0.5, 1) infinite !important;
        }
      `;
    } else if (mode === "lightning" && speed !== "static") {
      styles += `
        @keyframes breezyLightning_${uniqueId.current} {
          0%, 100%, 20%, 40%, 45%, 80%, 100% { opacity: 1; box-shadow: inset 0 0 var(--inner-glow-radius) var(--glow-color), 0 0 var(--glow-radius) var(--glow-color); }
          15%, 42%, 75% { opacity: 0.2; box-shadow: none; }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyLightning_${uniqueId.current} 3s linear infinite !important;
        }
      `;
    } else if (mode === "ripple" && speed !== "static") {
      styles += `
        @keyframes breezyRipple_${uniqueId.current} {
          0% { box-shadow: inset 0 0 0 var(--glow-color), 0 0 0 var(--glow-color); border-color: rgba(255,255,255,0.1); }
          50% { box-shadow: inset 0 0 var(--inner-glow-radius) var(--glow-color), 0 0 var(--glow-radius) var(--glow-color); border-color: var(--glow-color); }
          100% { box-shadow: inset 0 0 0 var(--glow-color), 0 0 0 var(--glow-color); border-color: rgba(255,255,255,0.1); }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyRipple_${uniqueId.current} var(--animation-duration) ease-in-out infinite !important;
          animation-delay: calc(var(--key-row) * 0.1s + var(--key-col) * 0.05s) !important;
        }
      `;
    } else if (mode === "reactive") {
      styles += `
        #${uniqueId.current} .breezy-key-glowing {
          border-color: rgba(255, 255, 255, 0.15);
          box-shadow: none;
          transition: border-color 0.8s ease, box-shadow 0.8s ease, background 0.8s ease;
        }
        #${uniqueId.current} .breezy-key-glowing:active {
          border-color: var(--glow-color) !important;
          box-shadow: inset 0 0 var(--inner-glow-radius) var(--glow-color), 0 0 var(--glow-radius) var(--glow-color) !important;
          background: rgba(255, 255, 255, 0.25) !important;
          transition: none !important;
        }
      `;
    } else if (mode === "aurora" && speed !== "static") {
      styles += `
        @keyframes breezyAurora_${uniqueId.current} {
          0%, 100% { border-color: #00f260; box-shadow: inset 0 0 var(--inner-glow-radius) #00f260, 0 0 var(--glow-radius) #00f260; --glow-color: #00f260; }
          50% { border-color: #00e5ff; box-shadow: inset 0 0 var(--inner-glow-radius) #00e5ff, 0 0 var(--glow-radius) #00e5ff; --glow-color: #00e5ff; }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyAurora_${uniqueId.current} var(--animation-duration) ease-in-out infinite !important;
        }
      `;
    } else if (mode === "galaxy" && speed !== "static") {
      styles += `
        @keyframes breezyGalaxy_${uniqueId.current} {
          0%, 100% { border-color: #8a2be2; box-shadow: inset 0 0 var(--inner-glow-radius) #8a2be2, 0 0 var(--glow-radius) #8a2be2; --glow-color: #8a2be2; }
          50% { border-color: #d946ff; box-shadow: inset 0 0 var(--inner-glow-radius) #d946ff, 0 0 var(--glow-radius) #d946ff; --glow-color: #d946ff; }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyGalaxy_${uniqueId.current} var(--animation-duration) ease-in-out infinite !important;
        }
      `;
    } else if (mode === "fire" && speed !== "static") {
      styles += `
        @keyframes breezyFire_${uniqueId.current} {
          0%, 100% { border-color: #ff0055; box-shadow: inset 0 0 var(--inner-glow-radius) #ff0055, 0 0 var(--glow-radius) #ff0055; --glow-color: #ff0055; }
          33% { border-color: #f97316; box-shadow: inset 0 0 var(--inner-glow-radius) #f97316, 0 0 var(--glow-radius) #f97316; --glow-color: #f97316; }
          66% { border-color: #ffcc00; box-shadow: inset 0 0 var(--inner-glow-radius) #ffcc00, 0 0 var(--glow-radius) #ffcc00; --glow-color: #ffcc00; }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyFire_${uniqueId.current} var(--animation-duration) ease-in-out infinite !important;
        }
      `;
    } else if (mode === "ocean" && speed !== "static") {
      styles += `
        @keyframes breezyOcean_${uniqueId.current} {
          0%, 100% { border-color: #0088ff; box-shadow: inset 0 0 var(--inner-glow-radius) #0088ff, 0 0 var(--glow-radius) #0088ff; --glow-color: #0088ff; }
          50% { border-color: #00e5ff; box-shadow: inset 0 0 var(--inner-glow-radius) #00e5ff, 0 0 var(--glow-radius) #00e5ff; --glow-color: #00e5ff; }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyOcean_${uniqueId.current} var(--animation-duration) ease-in-out infinite !important;
        }
      `;
    } else if (mode === "crystal_glow" && speed !== "static") {
      styles += `
        @keyframes breezyCrystal_${uniqueId.current} {
          0%, 100% { border-color: #ffffff; box-shadow: inset 0 0 var(--inner-glow-radius) #ffffff, 0 0 var(--glow-radius) #ffffff; --glow-color: #ffffff; }
          50% { border-color: #a5f3fc; box-shadow: inset 0 0 var(--inner-glow-radius) #a5f3fc, 0 0 var(--glow-radius) #a5f3fc; --glow-color: #a5f3fc; }
        }
        #${uniqueId.current} .breezy-key-glowing {
          animation: breezyCrystal_${uniqueId.current} var(--animation-duration) ease-in-out infinite !important;
        }
      `;
    } else {
      styles += `
        #${uniqueId.current} .breezy-key-glowing {
          border-color: var(--glow-color) !important;
          box-shadow: inset 0 0 var(--inner-glow-radius) var(--glow-color), 0 0 var(--glow-radius) var(--glow-color) !important;
        }
      `;
    }
    
    styles += `
      #${uniqueId.current} .breezy-key-glowing .keycap-text {
        text-shadow: 0 0 var(--text-glow-radius) var(--glow-color);
      }
    `;
    
    return styles;
  }, [localLighting, uniqueId.current]);

  const getGlowStyleAndClass = React.useCallback((key: string, kIdx: number) => {
    const { keyLighting, mode } = localLighting;
    const isLetter = /^[a-zA-Z]$/.test(key) && key !== "Shift" && key !== "Backspace" && key !== "Enter" && key !== "Space";
    const isSpacebar = key === " " || key === "Space" || key.toLowerCase() === "space" || key === "NAFASI" || key === "ESPACIO" || key === "ESPACE";
    const isEnter = key === "Enter" || key === "CornerDownLeft" || key === "\n" || key === "Send";
    const isBackspace = key === "Backspace";
    const isShift = key === "Shift";
    const isNumber = /^[0-9]$/.test(key);
    const isFunction = !isLetter && !isSpacebar && !isEnter && !isBackspace && !isShift && !isNumber;

    let isLightingEnabled = true;
    if (keyLighting) {
      if (isLetter) isLightingEnabled = keyLighting.letters;
      else if (isSpacebar) isLightingEnabled = keyLighting.spacebar;
      else if (isEnter) isLightingEnabled = keyLighting.enter;
      else if (isBackspace) isLightingEnabled = keyLighting.backspace;
      else if (isShift) isLightingEnabled = keyLighting.shift;
      else if (isNumber) isLightingEnabled = keyLighting.numberRow;
      else if (isFunction) isLightingEnabled = keyLighting.functionKeys;
    }

    if (!isLightingEnabled) {
      return { className: "", style: {} };
    }

    const inlineStyle: React.CSSProperties = {
      filter: `brightness(${localLighting.brightness / 100})`
    };

    if (mode === "wave" && localLighting.speed !== "static") {
      inlineStyle.animationDelay = `${kIdx * 0.12}s`;
    }

    return {
      className: "breezy-key-glowing",
      style: inlineStyle
    };
  }, [localLighting]);

  // Keyboard state
  const [isShiftActive, setIsShiftActive] = useState<boolean>(false);
  const [isSymbolsActive, setIsSymbolsActive] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"keys" | "ai" | "voice" | "translate" | "protect" | "hub" | "fonts" | "stickers" | "gifs" | "layouts" | "emoji">("keys");
  const [isEmojiTab, setIsEmojiTab] = useState(false);

  // Advanced Personalization / Layout states
  const [kbHeight, setKbHeight] = useState<number>(() => Number(localStorage.getItem("breezy_kb_height") || heightPercent || "100"));
  const [kbKeyWidth, setKbKeyWidth] = useState<number>(() => Number(localStorage.getItem("breezy_kb_key_width") || "100"));
  const [kbKeySpacing, setKbKeySpacing] = useState<number>(() => Number(localStorage.getItem("breezy_kb_key_spacing") || "4"));
  const [kbKeyRadius, setKbKeyRadius] = useState<number>(() => Number(localStorage.getItem("breezy_kb_key_radius") || "12"));
  const [kbLabelSize, setKbLabelSize] = useState<number>(() => Number(localStorage.getItem("breezy_kb_label_size") || "14"));
  const [kbFontSize, setKbFontSize] = useState<number>(() => Number(localStorage.getItem("breezy_kb_font_size") || "14"));
  const [kbBgOpacity, setKbBgOpacity] = useState<number>(() => Number(localStorage.getItem("breezy_kb_bg_opacity") || "80"));
  const [kbKeyPressAnim, setKbKeyPressAnim] = useState<string>(() => localStorage.getItem("breezy_kb_key_press_anim") || "bubble");
  const [kbPressSoundType, setKbPressSoundType] = useState<string>(() => localStorage.getItem("breezy_kb_press_sound_type") || "mechanical");
  const [kbVibeStrength, setKbVibeStrength] = useState<number>(() => Number(localStorage.getItem("breezy_kb_vibe_strength") || "15"));
  const [kbLongPressDuration, setKbLongPressDuration] = useState<number>(() => Number(localStorage.getItem("breezy_kb_long_press_duration") || "450"));
  const [kbBgVideo, setKbBgVideo] = useState<string>(() => localStorage.getItem("breezy_kb_bg_video") || "none");

  // Accessibility flags
  const [accHighContrast, setAccHighContrast] = useState<boolean>(() => localStorage.getItem("breezy_accessibility_high_contrast") === "true");
  const [accColorBlind, setAccColorBlind] = useState<string>(() => localStorage.getItem("breezy_accessibility_color_blind") || "none");
  const [accScreenReader, setAccScreenReader] = useState<boolean>(() => localStorage.getItem("breezy_accessibility_screen_reader") === "true");

  // Sync settings when modified from Dashboard settings
  useEffect(() => {
    const handleSync = () => {
      setKbHeight(Number(localStorage.getItem("breezy_kb_height") || heightPercent || "100"));
      setKbKeyWidth(Number(localStorage.getItem("breezy_kb_key_width") || "100"));
      setKbKeySpacing(Number(localStorage.getItem("breezy_kb_key_spacing") || "4"));
      setKbKeyRadius(Number(localStorage.getItem("breezy_kb_key_radius") || "12"));
      setKbLabelSize(Number(localStorage.getItem("breezy_kb_label_size") || "14"));
      setKbFontSize(Number(localStorage.getItem("breezy_kb_font_size") || "14"));
      setKbBgOpacity(Number(localStorage.getItem("breezy_kb_bg_opacity") || "80"));
      setKbKeyPressAnim(localStorage.getItem("breezy_kb_key_press_anim") || "bubble");
      setKbPressSoundType(localStorage.getItem("breezy_kb_press_sound_type") || "mechanical");
      setKbVibeStrength(Number(localStorage.getItem("breezy_kb_vibe_strength") || "15"));
      setKbLongPressDuration(Number(localStorage.getItem("breezy_kb_long_press_duration") || "450"));
      setKbBgVideo(localStorage.getItem("breezy_kb_bg_video") || "none");
      
      setAccHighContrast(localStorage.getItem("breezy_accessibility_high_contrast") === "true");
      setAccColorBlind(localStorage.getItem("breezy_accessibility_color_blind") || "none");
      setAccScreenReader(localStorage.getItem("breezy_accessibility_screen_reader") === "true");
    };

    window.addEventListener("breezy_settings_updated", handleSync);
    return () => window.removeEventListener("breezy_settings_updated", handleSync);
  }, [heightPercent]);
  
  // Advanced Engine States
  const [cursorPosition, setCursorPosition] = useState<number>(currentInputText.length);
  
  // Force video to play when mounted or changed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video auto-play blocked:", e));
    }
  }, [kbBgVideo]);

  useEffect(() => {
    if (onCursorChange) {
      onCursorChange(cursorPosition);
    }
  }, [cursorPosition, onCursorChange]);
  const [lastSpaceTimestamp, setLastSpaceTimestamp] = useState<number>(0);
  const [isCursorMode, setIsCursorMode] = useState<boolean>(false);
  const [cursorSwipeStartX, setCursorSwipeStartX] = useState<number>(0);
  const [longPressKey, setLongPressKey] = useState<string | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<any>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const LONG_PRESS_MAP: Record<string, string[]> = {
    'e': ['e', 'é', 'è', 'ê', 'ë', '3'],
    'a': ['a', 'á', 'à', 'â', 'ä', '@'],
    'i': ['i', 'í', 'ì', 'î', 'ï', '1'],
    'o': ['o', 'ó', 'ò', 'ô', 'ö', '0'],
    'u': ['u', 'ú', 'ù', 'û', 'ü'],
    's': ['s', 'ß', '$'],
    'n': ['n', 'ñ'],
    'c': ['c', 'ç'],
    'y': ['y', 'ÿ', '¥'],
    't': ['t', '7'],
    'g': ['g', '9'],
    'h': ['h', '8'],
    'p': ['p', '0'],
    'l': ['l', '1'],
    'z': ['z', '2']
  };

  const handlePointerDown = useCallback((key: string) => {
    setPressedKey(key);
    if (["Shift", "Backspace", "Enter", "123", "ABC", " "].includes(key)) return;
    
    const timer = setTimeout(() => {
      if (LONG_PRESS_MAP[key.toLowerCase()]) {
        setLongPressKey(key.toLowerCase());
        triggerVibration();
      }
    }, kbLongPressDuration || 450);
    setLongPressTimer(timer);
  }, [kbLongPressDuration]);

  const handlePointerUp = useCallback(() => {
    setPressedKey(null);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  // Sync cursor position when external text changes
  useEffect(() => {
    if (cursorPosition > currentInputText.length) {
      setCursorPosition(currentInputText.length);
    }
  }, [currentInputText]);

  // Keyboard internal Fonts, Stickers, and GIFs browser states
  const [kbFontSearch, setKbFontSearch] = useState<string>("");
  const [kbFontCategory, setKbFontCategory] = useState<string>("All");
  
  const [kbStickerSearch, setKbStickerSearch] = useState<string>("");
  const [kbStickerCategory, setKbStickerCategory] = useState<string>("Smileys");

  const [kbGifSearch, setKbGifSearch] = useState<string>("");
  const [kbGifs, setKbGifs] = useState<any[]>(FALLBACK_GIFS);
  const [kbGifsLoading, setKbGifsLoading] = useState<boolean>(false);

  // Load active GIFs when tab changes or search query updates
  useEffect(() => {
    if (activeTab !== "gifs") return;
    let isMounted = true;
    setKbGifsLoading(true);
    
    const fetchGifs = async () => {
      try {
        let results = [];
        if (kbGifSearch.trim() === "") {
          results = await activeGifProvider.getTrendingGifs(20);
        } else {
          results = await activeGifProvider.searchGifs(kbGifSearch, 20);
        }
        if (isMounted) {
          setKbGifs(results);
        }
      } catch (err) {
        if (isMounted) {
          setKbGifs(FALLBACK_GIFS);
        }
      } finally {
        if (isMounted) {
          setKbGifsLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchGifs, 350);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [kbGifSearch, activeTab]);

  // Glass AI specific states
  const [aiAction, setAiAction] = useState<string>("grammar");
  const [aiCustomPrompt, setAiCustomPrompt] = useState<string>("");
  const [aiSelectedTone, setAiSelectedTone] = useState<string>("professional");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const [thinkingMode, setThinkingMode] = useState<boolean>(false);
  const [aiMode, setAiMode] = useState<"tools" | "chat">("tools");
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hello! I am Breezy AI. How can I help you type or edit text today?" }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [aiWarning, setAiWarning] = useState<string | null>(null);

  // Glass Voice specific states
  const [voiceLang, setVoiceLang] = useState<SupportedLanguage>(language);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>("");
  const [voiceCleanupLoading, setVoiceCleanupLoading] = useState<boolean>(false);
  const [voiceResult, setVoiceResult] = useState<{ cleanedText: string; summary: string } | null>(null);
  const [removeFillerWords, setRemoveFillerWords] = useState<boolean>(true);
  const mediaRecorderRef = useRef<any>(null);
  const speechRecognitionRef = useRef<any>(null);

  // Glass Translate states
  const [transToLang, setTransToLang] = useState<string>("sw");
  const [isTranslateOnTypeActive, setIsTranslateOnTypeActive] = useState<boolean>(false);
  const [translateLoading, setTranslateLoading] = useState<boolean>(false);

  // Glass Protect states
  const [protectReport, setProtectReport] = useState<ProtectReport | null>(null);
  const [protectLoading, setProtectLoading] = useState<boolean>(false);

  // Glass Hub states
  const [clipboardItems, setClipboardItems] = useState<ClipboardItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("breezy_clipboard_history");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [
      { id: "c1", text: "Welcome to BreezyKeyboard! Double click copy to save here.", createdAt: new Date().toISOString(), isPinned: true },
      { id: "c2", text: "jamesprezo78@gmail.com", createdAt: new Date().toISOString(), isFavorite: true }
    ];
  });
  const [hubTab, setHubTab] = useState<"clipboard" | "replies" | "prompts">("clipboard");
  const [clipSearch, setClipSearch] = useState<string>("");
  const [previewClip, setPreviewClip] = useState<ClipboardItem | null>(null);

  // Swipe Typing State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  const [swipePoints, setSwipePoints] = useState<{ x: number; y: number }[]>([]);
  const keyPositionsRef = useRef<Record<string, { x: number; y: number }>>({});

  // Dynamic next-word predictions
  const [predictions, setPredictions] = useState<string[]>([]);

  // Sync clipboard items across window changes
  useEffect(() => {
    const handleSyncClips = () => {
      const saved = localStorage.getItem("breezy_clipboard_history");
      if (saved) {
        try {
          setClipboardItems(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener("breezy_settings_updated", handleSyncClips);
    return () => window.removeEventListener("breezy_settings_updated", handleSyncClips);
  }, []);

  // Update dynamic word predictions based on active language, typed text, and emoji context
  useEffect(() => {
    if (!isAutoCorrectionEnabled) {
      setPredictions([]);
      return;
    }
    const words = currentInputText.trim().split(/\s+/);
    const lastWord = words[words.length - 1]?.toLowerCase() || "";
    const langPreds = LANGUAGES[language]?.predictions || [];
    
    let basePreds: string[] = [];
    if (lastWord === "") {
      basePreds = langPreds.slice(0, 3);
    } else {
      const filtered = langPreds.filter(w => w.startsWith(lastWord));
      if (filtered.length >= 3) {
        basePreds = filtered.slice(0, 3);
      } else {
        const fillers = langPreds.filter(w => !filtered.includes(w));
        basePreds = [...filtered, ...fillers].slice(0, 3);
      }
    }

    // Emoji Prediction Mapping
    const EMOJI_PREDICTIONS_MAP: Record<string, string[]> = {
      "smile": ["😊", "😀", "🙂"],
      "love": ["❤️", "😍", "😘"],
      "fire": ["🔥", "😎", "💥"],
      "cool": ["😎", "🙌", "🤙"],
      "cat": ["🐱", "🐈", "😸"],
      "dog": ["🐶", "🐕", "🐩"],
      "car": ["🚗", "🚙", "🏎️"],
      "sun": ["☀️", "🌤️", "🌅"],
      "clap": ["👏", "🙌", "🤝"],
      "party": ["🎉", "🥳", "🎈"],
      "ok": ["👌", "👍", "✅"],
      "good": ["👍", "🌟", "👏"],
      "coffee": ["☕", "🥐", "🍩"],
      "laugh": ["😂", "🤣", "😆"],
      "sad": ["😢", "😭", "😞"],
      "star": ["⭐", "🌟", "✨"],
      "heart": ["❤️", "💖", "💕"],
      "thank": ["🙏", "💐", "💖"],
      "please": ["🙏", "🥺"],
      "omg": ["😱", "😲", "🤯"],
      "yes": ["✅", "👍", "👌"],
      "no": ["❌", "👎", "🚫"]
    };

    const emojiMatches = EMOJI_PREDICTIONS_MAP[lastWord] || [];
    setPredictions([...basePreds, ...emojiMatches].slice(0, 4));
  }, [currentInputText, language, isAutoCorrectionEnabled]);

  // Swipe gesture renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (swipePoints.length < 2) return;

    ctx.strokeStyle = theme.id.includes("cyberpunk") || theme.id.includes("neon") ? "#00f0ff" : "#3b82f6";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    // Shadow glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = ctx.strokeStyle;

    ctx.beginPath();
    ctx.moveTo(swipePoints[0].x, swipePoints[0].y);
    for (let i = 1; i < swipePoints.length; i++) {
      ctx.lineTo(swipePoints[i].x, swipePoints[i].y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0; // reset
  }, [swipePoints, theme]);

  // Keyboard Key Rows setup
  const qwertyRows = useMemo(() => ({
    letters: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["Shift", "z", "x", "c", "v", "b", "n", "m", "Backspace"]
    ],
    symbols: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["@", "#", "$", "_", "&", "-", "+", "(", ")", "/"],
      ["*", "\"", "'", ":", ";", "!", "?", "Backspace"]
    ]
  }), []);

  const azertyRows = useMemo(() => ({
    letters: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["a", "z", "e", "r", "t", "y", "u", "i", "o", "p"],
      ["q", "s", "d", "f", "g", "h", "j", "k", "l", "m"],
      ["Shift", "w", "x", "c", "v", "b", "n", "Backspace"]
    ],
    symbols: qwertyRows.symbols
  }), [qwertyRows.symbols]);

  const qwertzRows = useMemo(() => ({
    letters: [
      ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
      ["q", "w", "e", "r", "t", "z", "u", "i", "o", "p"],
      ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
      ["Shift", "y", "x", "c", "v", "b", "n", "m", "Backspace"]
    ],
    symbols: qwertyRows.symbols
  }), [qwertyRows.symbols]);

  const handleKeyPress = useCallback((key: string) => {
    // Accessibility announcement for screen readers
    if (accScreenReader && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      let label = key;
      if (key === " ") label = "Space";
      if (key === "Backspace") label = "Delete";
      if (key === "Shift") label = "Shift";
      const utterance = new SpeechSynthesisUtterance(label);
      utterance.rate = 1.4;
      window.speechSynthesis.speak(utterance);
    }

    playKeySound(
      key === " " ? "space" : key === "Backspace" ? "backspace" : "standard"
    );
    triggerVibration();

    if (key === "Shift") {
      setIsShiftActive(prev => !prev);
      return;
    }

    if (key === "Backspace") {
      if (currentInputText.length > 0) {
        const left = currentInputText.slice(0, cursorPosition - 1);
        const right = currentInputText.slice(cursorPosition);
        setCursorPosition(Math.max(0, cursorPosition - 1));
        onInputChange(left + right);
      }
      return;
    }

    // Handle Space Intelligence (Double space for period)
    if (key === " ") {
      const now = Date.now();
      if (now - lastSpaceTimestamp < 350 && currentInputText.length > 0 && currentInputText.endsWith(" ")) {
        // Double space detected
        const left = currentInputText.slice(0, cursorPosition - 1);
        const right = currentInputText.slice(cursorPosition);
        setCursorPosition(cursorPosition + 1);
        onInputChange(left + ". " + right);
        setLastSpaceTimestamp(0);
        return;
      }
      setLastSpaceTimestamp(now);
    }

    let charToAppend = key;
    
    // Auto-Capitalization Logic
    const needsAutoCaps = () => {
      if (currentInputText.length === 0) return true;
      const lastChars = currentInputText.trim().slice(-1);
      return [".", "?", "!"].includes(lastChars);
    };

    if ((isShiftActive || (needsAutoCaps() && currentInputText.endsWith(" "))) && key.length === 1) {
      charToAppend = key.toUpperCase();
      setIsShiftActive(false); 
    }

    const left = currentInputText.slice(0, cursorPosition);
    const right = currentInputText.slice(cursorPosition);
    setCursorPosition(cursorPosition + charToAppend.length);
    onInputChange(left + charToAppend + right);

    // If translate-on-type is active, translate immediately or debounced
    if (isTranslateOnTypeActive && charToAppend === " ") {
      triggerTranslationOnType();
    }
  }, [accScreenReader, isShiftActive, cursorPosition, onInputChange, currentInputText, lastSpaceTimestamp, isTranslateOnTypeActive]);

  const handleSpaceDown = (e: React.MouseEvent | React.TouchEvent) => {
    const startX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setCursorSwipeStartX(startX);
    
    const timer = setTimeout(() => {
      setIsCursorMode(true);
      triggerVibration();
    }, 500);
    
    (window as any)._spaceTimer = timer;
  };

  const handleSpaceMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isCursorMode) return;
    
    const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const diff = currentX - cursorSwipeStartX;
    
    // Move cursor every 15px of swipe
    if (Math.abs(diff) > 15) {
      const steps = Math.floor(diff / 15);
      const newPos = Math.max(0, Math.min(currentInputText.length, cursorPosition + steps));
      if (newPos !== cursorPosition) {
        setCursorPosition(newPos);
        setCursorSwipeStartX(currentX);
        triggerVibration();
      }
    }
  };

  const handleSpaceUp = () => {
    clearTimeout((window as any)._spaceTimer);
    if (isCursorMode) {
      setIsCursorMode(false);
    } else {
      handleKeyPress(" ");
    }
  };

  const handlePredictionClick = (word: string) => {
    playKeySound("space");
    triggerVibration();
    
    const leftText = currentInputText.slice(0, cursorPosition);
    const rightText = currentInputText.slice(cursorPosition);
    
    // Find the word we're currently typing (the one to the left of the cursor)
    const words = leftText.split(/\s+/);
    words.pop(); // remove incomplete word
    
    const prefix = words.join(" ");
    const separator = prefix.length > 0 ? " " : "";
    const newLeft = prefix + separator + word + " ";
    
    onInputChange(newLeft + rightText);
    setCursorPosition(newLeft.length);
  };

  // Simulated Swipe Typing Word Resolver
  const startSwipe = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setIsSwiping(true);
    setSwipePoints([{ x, y }]);
  };

  const updateSwipe = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!isSwiping) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setSwipePoints(prev => [...prev, { x, y }]);
  };

  const endSwipe = () => {
    if (!isSwiping) return;
    setIsSwiping(false);

    // Resolve which keys were swiped over the most
    if (swipePoints.length > 5) {
      const swipedChars: string[] = [];
      swipePoints.forEach(pt => {
        // Find closest key
        let closestKey = "";
        let minDist = 40; // max click distance

        (Object.entries(keyPositionsRef.current) as [string, { x: number; y: number }][]).forEach(([key, pos]) => {
          const dist = Math.hypot(pt.x - pos.x, pt.y - pos.y);
          if (dist < minDist) {
            minDist = dist;
            closestKey = key;
          }
        });

        if (closestKey && swipedChars[swipedChars.length - 1] !== closestKey) {
          swipedChars.push(closestKey);
        }
      });

      // Filter swiped chars to form a rough simulated word
      const rawSwiped = swipedChars.join("");
      let swipedWord = "";

      // Match raw swiped characters to language dictionary words
      const langPreds = LANGUAGES[language]?.predictions || [];
      const match = langPreds.find(word => {
        // Simple regex sub-sequence checker
        let index = 0;
        for (const char of word) {
          index = rawSwiped.indexOf(char, index);
          if (index === -1) return false;
        }
        return true;
      });

      if (match) {
        swipedWord = match;
      } else if (rawSwiped.length > 2) {
        // fallback to a clean sequence
        swipedWord = rawSwiped.substring(0, 5);
      }

      if (swipedWord) {
        const leftText = currentInputText.slice(0, cursorPosition);
        const rightText = currentInputText.slice(cursorPosition);
        const spacer = leftText.endsWith(" ") || leftText === "" ? "" : " ";
        const newLeft = leftText + spacer + swipedWord + " ";
        onInputChange(newLeft + rightText);
        setCursorPosition(newLeft.length);
        playKeySound("space");
      }
    }

    setSwipePoints([]);
  };

  // Store key positions to resolve swipe typing
  const setKeyRef = useCallback((key: string, el: HTMLButtonElement | null) => {
    if (el) {
      const rect = el.getBoundingClientRect();
      const parent = el.offsetParent as HTMLElement;
      if (parent) {
        const pRect = parent.getBoundingClientRect();
        keyPositionsRef.current[key] = {
          x: rect.left - pRect.left + rect.width / 2,
          y: rect.top - pRect.top + rect.height / 2
        };
      }
    }
  }, []);

  // -------------------------------------------------------------------------
  // SERVER SIDE AI HANDLERS
  // -------------------------------------------------------------------------

  const handleAIClick = async (customAction?: string) => {
    const selectedAction = customAction || aiAction;

    if (selectedAction === "grammar" && !isAutoCorrectionEnabled) {
      setAiOutput("AI Auto-Correction is disabled in Settings.");
      return;
    }
    
    setAiLoading(true);
    setAiOutput("");
    setAiWarning(null);

    try {
      const payload: any = {
        action: selectedAction,
        text: currentInputText || (selectedAction === "email" ? "Requesting a meeting" : "Help write a greeting"),
        options: {
          tone: aiSelectedTone,
          toLang: transToLang,
          isThinking: aiSettings?.thinkingMode === AIThinkingMode.ADVANCED
        }
      };

      const res = await fetch("/api/gemini/keyboard-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok && data.result) {
        const finalResult = typeof data.result === "object" ? JSON.stringify(data.result) : data.result;
        setAiOutput(finalResult);
        // Replace active text or append based on context
        if (["grammar", "rewrite", "shorten", "expand", "translate"].includes(selectedAction)) {
          onInputChange(finalResult);
          onAddClipboard(finalResult);
        }
        onAddAIConversation(payload.text, finalResult);

        if (data.fallbackActive) {
          setAiWarning(`Usage limit reached. Switched to modular backup provider. Auto-resumes in ${data.nextResumeInSeconds || 15}s.`);
        }
      } else {
        setAiOutput(data.error || "Failed to contact Glass AI engine.");
      }
    } catch (e: any) {
      setAiOutput("Error communicating with servers. Ensure GEMINI_API_KEY is configured.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");
    setAiLoading(true);
    setAiWarning(null);

    try {
      const res = await fetch("/api/gemini/keyboard-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          text: userMsg,
          options: {
            thinking: thinkingMode
          }
        })
      });

      const data = await res.json();
      if (res.ok && data.result) {
        setChatHistory(prev => [...prev, { role: "ai", text: data.result }]);
        if (data.fallbackActive) {
          setAiWarning(`Usage limit reached. Switched to modular backup provider. Auto-resumes in ${data.nextResumeInSeconds || 15}s.`);
        }
      } else {
        setChatHistory(prev => [...prev, { role: "ai", text: data.error || "Failed to contact Glass AI engine." }]);
      }
    } catch (e: any) {
      setChatHistory(prev => [...prev, { role: "ai", text: "Error communicating with servers. Ensure GEMINI_API_KEY is configured." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const triggerTranslationOnType = async () => {
    if (!currentInputText.trim()) return;
    setTranslateLoading(true);
    try {
      const res = await fetch("/api/gemini/keyboard-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "translate",
          text: currentInputText,
          options: { toLang: transToLang }
        })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        onInputChange(data.result);
      }
    } catch (e) {
      // quiet fail for on-type convenience
    } finally {
      setTranslateLoading(false);
    }
  };

  // Speech Recognition (Intelligent Dictation)
  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      // Mock voice typing if API unsupported
      setIsRecording(true);
      setVoiceTranscript("Simulating voice input... I am typing words like Swahili and French beautifully.");
      setTimeout(() => {
        setVoiceTranscript("Hello um like I wanted to say ah thank you for this awesome keyboard app, it is cool.");
        setIsRecording(false);
      }, 3000);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = LANGUAGES[voiceLang]?.code === "sw" ? "sw-KE" : LANGUAGES[voiceLang]?.code === "es" ? "es-ES" : "en-US";

      rec.onstart = () => {
        setIsRecording(true);
        setVoiceTranscript("Listening...");
        triggerVibration();
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setVoiceTranscript(resultText);
      };

      rec.onerror = (event: any) => {
        setVoiceTranscript("Voice capture failed. Try speaking clearly.");
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      speechRecognitionRef.current = rec;
      rec.start();
    } catch (e) {
      setIsRecording(false);
    }
  };

  const cleanFillerWords = (text: string): string => {
    // Regex matches common filler words case-insensitively, boundary secured
    let cleaned = text.replace(/\b(um|uh|ah|er|like|basically|actually|literally|you\s+know)\b/gi, "");
    cleaned = cleaned.replace(/\s+/g, " ");
    cleaned = cleaned.replace(/\s+([.,!?;:])/, "$1");
    cleaned = cleaned.trim();
    if (cleaned && text && text[0] === text[0].toUpperCase()) {
      cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    }
    return cleaned;
  };

  const handleInsertTranscript = () => {
    let finalSelection = voiceTranscript;
    if (removeFillerWords) {
      finalSelection = cleanFillerWords(finalSelection);
    }
    onInputChange(finalSelection);
    onAddClipboard(finalSelection);
    setActiveTab("keys");
  };

  const handleVoiceCleanup = async () => {
    if (!voiceTranscript || voiceTranscript === "Listening...") return;
    setVoiceCleanupLoading(true);
    let textToProcess = voiceTranscript;
    if (removeFillerWords) {
      textToProcess = cleanFillerWords(textToProcess);
    }
    try {
      const res = await fetch("/api/gemini/keyboard-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "voice-cleanup",
          text: textToProcess
        })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        let cleanedResult = data.result.cleanedText;
        if (removeFillerWords) {
          cleanedResult = cleanFillerWords(cleanedResult);
        }
        setVoiceResult({
          ...data.result,
          cleanedText: cleanedResult
        });
        onInputChange(cleanedResult);
        onAddClipboard(cleanedResult);
      }
    } catch (e) {
      setVoiceTranscript("Error correcting audio transcription.");
    } finally {
      setVoiceCleanupLoading(false);
    }
  };

  // Cyber Protect Scan
  const handleProtectScan = async () => {
    if (!currentInputText.trim()) return;
    setProtectLoading(true);
    setProtectReport(null);
    try {
      const res = await fetch("/api/gemini/keyboard-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "protect-scan",
          text: currentInputText
        })
      });
      const data = await res.json();
      if (res.ok && data.result) {
        setProtectReport(data.result);
      }
    } catch (e) {
      // Fallback local analyzer if server fails
      const containsPass = /password|pw:|pin|admin/i.test(currentInputText);
      setProtectReport({
        isSafe: !containsPass,
        warnings: containsPass ? ["Accidental credentials might be shared!"] : ["No major security issues flagged locally."],
        piiDetected: containsPass ? ["Password / Pin"] : [],
        scamProbability: "low",
        suspiciousLinks: []
      });
    } finally {
      setProtectLoading(false);
    }
  };

  // Helper styles based on user active height percentage
  const dynamicHeightClass = heightPercent < 90 ? "h-60" : heightPercent > 110 ? "h-76" : "h-68";

  return (
    <div
      className={`breezy_keyboard_container w-full flex flex-col select-none relative bg-white/10 backdrop-blur-xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_0_20px_rgba(255,255,255,0.05)] border-t border-white/10 ${font.className} select-none transition-all duration-300`}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/10 animate-pulse pointer-events-none opacity-80" />
      {/* 1. TOP DOCK / SEARCH SHUTTLES / AI BAR */}
      <div className="w-full h-11 border-b border-white/20 flex items-center justify-center px-2 bg-white/5 backdrop-blur-md relative z-20 shadow-sm">
        <div className="flex items-center space-x-6 py-1">
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl flex items-center space-x-2 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-all"
            title="Keyboard Settings"
          >
            <Settings className="w-5 h-5" />
            <span className="font-semibold">Settings</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE WITH EXPANDED ASSISTANTS */}
      <div className="w-full relative bg-black/20 flex flex-col">
        <AnimatePresence mode="wait">
          {isEmojiTab && (
            <motion.div
              key="emoji-search"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="h-full"
            >
              <EmojiSearch onSelect={(e) => { onInputChange(currentInputText + e); setIsEmojiTab(false); }} />
            </motion.div>
          )}

          {/* GLASS POPUP SYSTEMS */}
          {activeTab === "fonts" && (
            <FontPicker 
              key="fonts"
              onSelect={(f) => {
                if (onSelectFont) onSelectFont(f);
                playKeySound("modifier");
              }} 
              currentFontId={font.id} 
            />
          )}
          {activeTab === "stickers" && (
            <StickerPicker 
              key="stickers"
              onSelect={(emoji) => {
                onSendInput(emoji);
                playKeySound("standard");
                triggerVibration();
              }} 
            />
          )}
          {activeTab === "gifs" && (
            <GifBrowser 
              key="gifs"
              onSelect={(url) => {
                onSendInput(url);
                playKeySound("standard");
                triggerVibration();
              }} 
            />
          )}
          {activeTab === "emoji" && (
            <EmojiPicker 
              key="emoji"
              onSelect={(emoji) => {
                onInputChange(currentInputText + emoji);
                playKeySound("standard");
                triggerVibration();
              }} 
            />
          )}
          {activeTab === "protect" && (
            <ProtectTab
              key="protect"
              protectReport={protectReport}
              protectLoading={protectLoading}
              handleProtectScan={handleProtectScan}
            />
          )}
          {activeTab === "hub" && (
            <ProductivityHub
              key="hub"
              hubTab={hubTab}
              setHubTab={setHubTab}
              clipboardItems={clipboardItems}
              setClipboardItems={setClipboardItems}
              onInputChange={(text) => onInputChange(currentInputText + text)}
              playKeySound={playKeySound}
              triggerVibration={triggerVibration}
              setActiveTab={setActiveTab}
              setAiAction={setAiAction}
            />
          )}
          {activeTab === "ai" && (
            <AITab
              key="ai"
              aiMode={aiMode}
              setAiMode={setAiMode}
              aiAction={aiAction}
              setAiAction={setAiAction}
              aiOutput={aiOutput}
              aiLoading={aiLoading}
              thinkingMode={thinkingMode}
              setThinkingMode={setThinkingMode}
              aiCustomPrompt={aiCustomPrompt}
              setAiCustomPrompt={setAiCustomPrompt}
              aiSelectedTone={aiSelectedTone}
              setAiSelectedTone={setAiSelectedTone}
              chatHistory={chatHistory}
              chatInput={chatInput}
              setChatInput={setChatInput}
              aiWarning={aiWarning}
              handleAIClick={handleAIClick}
              handleChatSubmit={handleChatSend}
              onInputChange={(text) => onInputChange(currentInputText + text)}
              triggerVibration={triggerVibration}
            />
          )}
          {activeTab === "voice" && (
            <VoiceTab
              key="voice"
              voiceLang={voiceLang}
              setVoiceLang={setVoiceLang}
              removeFillerWords={removeFillerWords}
              setRemoveFillerWords={setRemoveFillerWords}
              isRecording={isRecording}
              startRecording={startRecording}
              voiceTranscript={voiceTranscript}
              voiceCleanupLoading={voiceCleanupLoading}
              handleInsertTranscript={handleInsertTranscript}
              handleVoiceCleanup={handleVoiceCleanup}
              voiceResult={voiceResult}
            />
          )}
          {activeTab === "translate" && (
            <TranslateTab
              key="translate"
              transToLang={transToLang}
              setTransToLang={setTransToLang}
              isTranslateOnTypeActive={isTranslateOnTypeActive}
              setIsTranslateOnTypeActive={setIsTranslateOnTypeActive}
              translateLoading={translateLoading}
              triggerTranslationOnType={triggerTranslationOnType}
              handleAIClick={handleAIClick}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 3. NEXT-WORD PREDICTION BAR */}
      <div className="w-full h-10 border-b border-white/5 bg-black/45 flex items-center justify-around px-1 select-none z-10">
        {predictions.map((word, idx) => (
          <button
            key={idx}
            onClick={() => handlePredictionClick(word)}
            className="flex-1 py-1.5 mx-1 font-semibold text-xs rounded hover:bg-white/5 active:bg-white/10 transition-colors text-slate-300 truncate"
          >
            {word}
          </button>
        ))}
      </div>

      {/* 4. ACTUAL VIRTUAL KEYBOARD LAYOUT GRID */}
      <div
        id={uniqueId.current}
        className={`breezy_keyboard_container breezy-custom-lighting-container keyboard-underglow-effect relative overflow-hidden flex flex-col justify-between p-1.5`}
        style={{
          height: `${((kbHeight !== undefined ? kbHeight : 100) / 100) * 272}px`,
          width: `${kbKeyWidth !== undefined ? kbKeyWidth : 100}%`,
          margin: "0 auto",
          backgroundColor: kbBgVideo && kbBgVideo !== "none" 
            ? "transparent" 
            : `rgba(15, 23, 42, ${(kbBgOpacity !== undefined ? kbBgOpacity : 80) / 100})`,
          filter: accColorBlind === "protanopia" 
            ? "contrast(1.15) hue-rotate(-20deg)" 
            : accColorBlind === "deuteranopia" 
              ? "contrast(1.15) hue-rotate(20deg)" 
              : accColorBlind === "tritanopia" 
                ? "contrast(1.15) hue-rotate(180deg)" 
                : undefined
        }}
        onMouseDown={startSwipe}
        onMouseMove={updateSwipe}
        onMouseUp={endSwipe}
        onTouchStart={startSwipe}
        onTouchMove={updateSwipe}
        onTouchEnd={endSwipe}
      >
        {/* INJECT DYNAMIC LIGHTING ANIMATION STYLES */}
        <style dangerouslySetInnerHTML={{ __html: lightingStyles }} />

        {/* Dynamic Video Background Layer */}
        {kbBgVideo && kbBgVideo !== "none" && (
          <video
            ref={videoRef}
            key={kbBgVideo}
            src={kbBgVideo}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 transition-opacity duration-500"
            style={{
              opacity: (kbBgOpacity !== undefined ? kbBgOpacity : 80) / 100
            }}
          />
        )}

        {/* Dynamic Underglow Effect */}
        {localLighting.underglow !== -1 && (
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-4 blur-xl rounded-full pointer-events-none z-0 transition-all duration-300 animate-pulse"
            style={{
              backgroundColor: localLighting.color === "rainbow" ? "#00e5ff" : localLighting.color,
              opacity: localLighting.underglow / 100,
              boxShadow: `0 0 20px 6px ${localLighting.color === "rainbow" ? "#00e5ff" : localLighting.color}`
            }}
          />
        )}

        {/* SWIPE TYPING RENDERING CANVAS */}
        <canvas
          ref={canvasRef}
          width={500}
          height={300}
          className="absolute inset-0 pointer-events-none z-0 w-full h-full"
        />

        {/* Dynamic keyboard layouts mapping */}
        <div className="w-full flex-1 flex flex-col justify-around relative z-10">
          {(() => {
            const layoutRows = layout === KeyboardLayoutType.AZERTY ? azertyRows : layout === KeyboardLayoutType.QWERTZ ? qwertzRows : qwertyRows;
            return (isSymbolsActive ? layoutRows.symbols : layoutRows.letters).map((row, rowIdx) => {
            const isSplit = layout === KeyboardLayoutType.SPLIT;
            const isOneHandedLeft = layout === KeyboardLayoutType.ONE_HANDED_LEFT;
            const isOneHandedRight = layout === KeyboardLayoutType.ONE_HANDED_RIGHT;

            let rowContainerClass = "flex justify-center w-full my-0.5";
            if (isSplit) {
              rowContainerClass = "flex justify-between w-full my-0.5 px-4";
            } else if (isOneHandedLeft) {
              rowContainerClass = "flex justify-start w-[70%] my-0.5";
            } else if (isOneHandedRight) {
              rowContainerClass = "flex justify-end w-[70%] my-0.5 ml-auto";
            }

            // Splitting logic for split mode
            const renderRowKeys = () => {
              if (isSplit) {
                const mid = Math.ceil(row.length / 2);
                const leftPart = row.slice(0, mid);
                const rightPart = row.slice(mid);
                return (
                  <>
                    <div className="flex space-x-1 flex-1 justify-center">
                      {leftPart.map((key, kIdx) => renderKeyButton(key, kIdx, rowIdx))}
                    </div>
                    <div className="w-8" /> {/* spacer gap */}
                    <div className="flex space-x-1 flex-1 justify-center">
                      {rightPart.map((key, kIdx) => renderKeyButton(key, kIdx + mid, rowIdx))}
                    </div>
                  </>
                );
              }
              return row.map((key, kIdx) => renderKeyButton(key, kIdx, rowIdx));
            };

            const renderKeyButton = (key: string, kIdx: number, rIdx: number) => {
              // Resolve custom lighting or use standard rainbow glow classes
              const glowClassAndStyle = getGlowStyleAndClass(key, kIdx);
              const glowClass = glowClassAndStyle.className || (() => {
                let defaultGlow = "keycap-rgb-flow";
                if (!["Shift", "Backspace", "123", "ABC", "Space", "Enter"].includes(key)) {
                  const ratio = kIdx / (row.length || 10);
                  if (ratio < 0.25) {
                    defaultGlow = "keycap-cyan";
                  } else if (ratio < 0.5) {
                    defaultGlow = "keycap-blue";
                  } else if (ratio < 0.75) {
                    defaultGlow = "keycap-purple";
                  } else {
                    defaultGlow = "keycap-pink";
                  }
                }
                return defaultGlow;
              })();

              return (
                <div key={`${rIdx}-${kIdx}`} className="relative flex-1 flex">
                  <KeyButton
                    keyVal={key}
                    kIdx={kIdx}
                    rIdx={rIdx}
                    isShiftActive={isShiftActive}
                    isSymbolsActive={isSymbolsActive}
                    isPressed={pressedKey === key}
                    isBubbleAnim={kbKeyPressAnim === "bubble"}
                    isScaleAnim={kbKeyPressAnim === "scale"}
                    isFadeAnim={kbKeyPressAnim === "fade"}
                    isGlowAnim={kbKeyPressAnim === "glow"}
                    glowClass={glowClass}
                    glowStyle={glowClassAndStyle.style}
                    kbKeySpacing={kbKeySpacing !== undefined ? kbKeySpacing : 4}
                    kbKeyRadius={kbKeyRadius !== undefined ? kbKeyRadius : 12}
                    kbLabelSize={kbLabelSize || 14}
                    accHighContrast={accHighContrast}
                    onPointerDown={handlePointerDown}
                    onPointerUp={handlePointerUp}
                    onClick={(k) => {
                      if (!longPressKey) {
                        handleKeyPress(k);
                      }
                    }}
                    setKeyRef={setKeyRef}
                    rowLength={row.length}
                  />

                  {/* Long Press Options UI */}
                  <AnimatePresence>
                    {longPressKey === key.toLowerCase() && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: -50, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 z-[100] flex bg-slate-900/95 backdrop-blur-xl border border-white/20 p-1.5 rounded-2xl shadow-2xl space-x-1 mb-2"
                      >
                        {LONG_PRESS_MAP[longPressKey].map((opt, i) => (
                          <button
                            key={i}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleKeyPress(opt);
                              setLongPressKey(null);
                            }}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-black flex items-center justify-center text-sm font-black transition-all border border-white/10"
                          >
                            {isShiftActive ? opt.toUpperCase() : opt}
                          </button>
                        ))}
                        <button 
                          onClick={() => setLongPressKey(null)}
                          className="w-10 h-10 rounded-xl bg-white/10 text-white/50 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            };

            return (
              <div key={rowIdx} className={rowContainerClass}>
                {renderRowKeys()}
              </div>
            );
          })})()
          }

          {/* ROW 4: SYSTEM/LAYOUT MODIFIERS */}
          {(() => {
            const abcGlow = getGlowStyleAndClass("ABC", 0);
            const langGlow = getGlowStyleAndClass("Globe", 1);
            const emojiGlow = getGlowStyleAndClass("Emoji", 2);
            const micGlow = getGlowStyleAndClass("Mic", 3);
            const spaceGlow = getGlowStyleAndClass(" ", 5);
            const sendGlow = getGlowStyleAndClass("Enter", 9);

            return (
              <div className={`flex justify-center w-full my-0.5 px-0.5 ${layout === KeyboardLayoutType.ONE_HANDED_LEFT ? "w-[70%]" : layout === KeyboardLayoutType.ONE_HANDED_RIGHT ? "w-[70%] ml-auto" : ""}`}>
                {/* Toggle ABC/Symbols */}
                <button
                  onClick={() => setIsSymbolsActive(!isSymbolsActive)}
                  className={`mechanical-keycap ${abcGlow.className || "keycap-rgb-flow"} w-14 h-11 mx-0.75 flex items-center justify-center transition-all focus:outline-none relative select-none`}
                  style={abcGlow.style}
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="mechanical-switch-stem" />
                    <div className="mechanical-keycap-glass-highlight" />
                    <div className="mechanical-keycap-frosted-edges" />
                  </div>
                  <span className="keycap-text font-bold text-xs">
                    {isSymbolsActive ? "ABC" : "?123"}
                  </span>
                </button>

                {/* Language / Globe Key */}
                <button
                  onClick={() => onOpenDashboardTab("settings")}
                  className={`mechanical-keycap ${langGlow.className || "keycap-rgb-flow"} w-12 h-11 mx-0.75 flex items-center justify-center transition-all focus:outline-none relative select-none`}
                  style={langGlow.style}
                  title="Change keyboard language"
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="mechanical-switch-stem" />
                    <div className="mechanical-keycap-glass-highlight" />
                    <div className="mechanical-keycap-frosted-edges" />
                  </div>
                  <span className="keycap-text flex items-center justify-center text-[10px] font-bold uppercase">
                    <span className="text-sm mr-0.5">{LANGUAGES[language]?.flag}</span>
                    {language}
                  </span>
                </button>

                {/* Emoji Key */}
                <button
                  onClick={() => setActiveTab(activeTab === "emoji" ? "keys" : "emoji")}
                  className={`mechanical-keycap ${emojiGlow.className || "keycap-rgb-flow"} w-11 h-11 mx-0.75 flex items-center justify-center transition-all focus:outline-none relative select-none`}
                  style={emojiGlow.style}
                  title="Emojis"
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="mechanical-switch-stem" />
                    <div className="mechanical-keycap-glass-highlight" />
                    <div className="mechanical-keycap-frosted-edges" />
                  </div>
                  <span className="keycap-text">
                    <Smile className="w-5 h-5 text-white" />
                  </span>
                </button>

                {/* Micro/Voice Trigger key */}
                <button
                  onClick={() => setActiveTab(activeTab === "voice" ? "keys" : "voice")}
                  className={`mechanical-keycap ${micGlow.className || "keycap-rgb-flow"} w-11 h-11 mx-0.75 flex items-center justify-center transition-all focus:outline-none relative select-none`}
                  style={micGlow.style}
                  title="Trigger Glass Dictation"
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="mechanical-switch-stem" />
                    <div className="mechanical-keycap-glass-highlight" />
                    <div className="mechanical-keycap-frosted-edges" />
                  </div>
                  <span className="keycap-text">
                    <Mic className="w-4 h-4 text-white" />
                  </span>
                </button>

                {/* SPACEBAR */}
                <button
                  onPointerDown={handleSpaceDown}
                  onPointerMove={handleSpaceMove}
                  onPointerUp={handleSpaceUp}
                  onPointerCancel={handleSpaceUp}
                  className={`mechanical-keycap ${spaceGlow.className || "keycap-rgb-flow"} flex-[3] h-11 mx-1 flex items-center justify-center transition-all focus:outline-none relative select-none cursor-pointer active:scale-[0.98]`}
                  style={spaceGlow.style}
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className={`mechanical-switch-stem !w-16 ${isCursorMode ? "opacity-0" : "opacity-100"}`} />
                    <div className="mechanical-keycap-glass-highlight" />
                    <div className="mechanical-keycap-frosted-edges" />
                  </div>
                  <span className={`keycap-text text-xs tracking-wider font-bold transition-all ${isCursorMode ? "text-cyan-400 scale-110" : "text-white"}`}>
                    {isCursorMode ? "CURSOR CONTROL" : (language === "sw" ? "NAFASI" : language === "es" ? "ESPACIO" : language === "fr" ? "ESPACE" : "SPACE")}
                  </span>
                  
                  {isCursorMode && (
                    <motion.div 
                      layoutId="cursor-indicator"
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-cyan-500 text-black px-3 py-1 rounded-full text-[10px] font-black shadow-lg shadow-cyan-500/40 flex items-center space-x-1 whitespace-nowrap"
                    >
                      <span>{cursorPosition}</span>
                      <div className="w-1 h-3 bg-black/30 rounded-full animate-pulse" />
                    </motion.div>
                  )}
                </button>

                {/* Send / Enter button with accent styling */}
                <button
                  onClick={() => onSendInput()}
                  className={`mechanical-keycap ${sendGlow.className || "keycap-rgb-flow"} w-16 h-11 mx-0.75 flex items-center justify-center transition-all focus:outline-none relative select-none`}
                  style={sendGlow.style}
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                    <div className="mechanical-switch-stem" />
                    <div className="mechanical-keycap-glass-highlight" />
                    <div className="mechanical-keycap-frosted-edges" />
                  </div>
                  <span className="keycap-text">
                    <CornerDownLeft className="w-4.5 h-4.5 stroke-[2.5px]" />
                  </span>
                </button>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
