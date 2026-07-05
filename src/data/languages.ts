
export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  layouts: string[];
}

export const ALL_LANGUAGES: LanguageInfo[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", layouts: ["QWERTY", "Dvorak", "Colemak"] },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", layouts: ["QWERTY"] },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", layouts: ["AZERTY", "QWERTY"] },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", layouts: ["QWERTZ", "QWERTY"] },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", layouts: ["QWERTY"] },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹", layouts: ["QWERTY"] },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", layouts: ["ЙЦУКЕН"] },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳", layouts: ["Pinyin", "Wubi"] },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", layouts: ["Romaji", "Kana"] },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", layouts: ["2-set", "3-set"] },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", layouts: ["QWERTY"] },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", layouts: ["InScript", "Phonetic"] },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪", layouts: ["QWERTY"] },
  { code: "ki", name: "Kikuyu", nativeName: "Gikuyu", flag: "🇰🇪", layouts: ["QWERTY"] },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", layouts: ["QWERTY", "AZERTY"] },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", layouts: ["Q", "F"] },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", layouts: ["Telex", "VNI"] },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", layouts: ["Programmers", "214"] },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦", layouts: ["ЙЦУКЕН"] },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", layouts: ["QWERTY"] }
];
