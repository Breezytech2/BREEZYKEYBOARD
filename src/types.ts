/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum KeyboardLayoutType {
  QWERTY = "qwerty",
  AZERTY = "azerty",
  QWERTZ = "qwertz",
  SPLIT = "split",
  ONE_HANDED_LEFT = "one_handed_left",
  ONE_HANDED_RIGHT = "one_handed_right",
  FLOATING = "floating"
}

export type SupportedLanguage = "en" | "sw" | "es" | "fr" | "ki";

export enum AIProviderType {
  GEMINI = "gemini",
  MOCK = "mock"
}

export enum AIThinkingMode {
  NORMAL = "normal",
  ADVANCED = "advanced"
}

export interface AISettings {
  provider: AIProviderType;
  thinkingMode: AIThinkingMode;
  voiceAutoPunctuation: boolean;
  voiceRemoveFiller: boolean;
  translateWhileTyping: boolean;
  detectLanguage: boolean;
  incognitoMode: boolean;
}

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
  predictions: string[];
}

export interface KeyboardTheme {
  id: string;
  name: string;
  bgClass: string;
  keyBgClass: string;
  keyTextClass: string;
  accentClass: string;
  isAnimated?: boolean;
  animationType?: "neon" | "rain" | "snow" | "galaxy" | "lightning" | "ocean" | "fire" | "music" | "battery" | "custom";
  neonShadow?: string;
  category?: string;
  previewColors?: string[];
  animation?: string;
  glowIntensity?: number;
  backgroundEffect?: string;
  keyStyle?: "acrylic" | "glass" | "solid" | "cyberpunk";
  isFavorite?: boolean;
}

export interface KeyboardFont {
  id: string;
  name: string;
  className: string;
}

export interface UserProfile {
  name: string;
  email: string;
  aiRequestCount: number;
  aiLimitResetTime: string; // ISO String
  streak: number;
  totalPoints: number;
  achievements: string[]; // achievement IDs
  aiSettings: AISettings;
  avatarUrl?: string;
  username?: string;
  country?: string;
  preferredLanguage?: string;
  themePreference?: string;
  brightnessPreference?: number;
  fontPreference?: string;
  emojiPreference?: string;
  stickerPreference?: string;
  onboardingCompleted?: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface ClipboardItem {
  id: string;
  text: string;
  createdAt: string;
  isPinned?: boolean;
  isFavorite?: boolean;
}

export interface SavedAIConv {
  id: string;
  prompt: string;
  response: string;
  createdAt: string;
  isFavorite?: boolean;
  action?: string;
  isThinking?: boolean;
}

export interface FavoriteTranslation {
  id: string;
  originalText: string;
  translatedText: string;
  fromLang: string;
  toLang: string;
  createdAt: string;
}

export interface VocabularyWord {
  word: string;
  meaning: string;
  example: string;
  pronunciation: string;
  language: SupportedLanguage;
}

export interface GrammarLesson {
  id: string;
  title: string;
  explanation: string;
  examples: string[];
  quizQuestion: string;
  quizOptions: string[];
  quizAnswer: string;
  points: number;
  completed?: boolean;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  points: number;
  completed: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: string;
}

export interface ProtectReport {
  isSafe: boolean;
  warnings: string[];
  piiDetected: string[];
  scamProbability: "low" | "medium" | "high";
  suspiciousLinks: string[];
}

export interface KeyboardLightingSettings {
  brightness: number;
  glowIntensity: number;
  underglow: number; // -1 for Off, or 0-100
  speed: "static" | "very_slow" | "slow" | "normal" | "fast" | "very_fast";
  mode: "static" | "breathing" | "wave" | "rainbow" | "pulse" | "lightning" | "ripple" | "reactive" | "aurora" | "galaxy" | "fire" | "ocean" | "crystal_glow";
  color: string; // Hex color or "rainbow"
  keyLighting: {
    letters: boolean;
    functionKeys: boolean;
    spacebar: boolean;
    enter: boolean;
    backspace: boolean;
    shift: boolean;
    numberRow: boolean;
  };
}

