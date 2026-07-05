/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KeyboardFont } from "./types";

export interface RichFont extends KeyboardFont {
  family: string;
  category: "Modern" | "Elegant" | "Handwriting" | "Bold" | "Minimal" | "Gaming" | "Futuristic" | "Neon" | "Classic" | "Decorative";
}

// 50 distinctive fonts grouped by 10 requested categories
export const BUILT_IN_FONTS: RichFont[] = [
  // 1. Modern
  { id: "font_inter", name: "Inter Classic", family: "Inter", className: "font-inter", category: "Modern" },
  { id: "font_roboto", name: "Roboto Neo", family: "Roboto", className: "font-roboto", category: "Modern" },
  { id: "font_outfit", name: "Outfit display", family: "Outfit", className: "font-outfit", category: "Modern" },
  { id: "font_manrope", name: "Manrope Tech", family: "Manrope", className: "font-manrope", category: "Modern" },
  { id: "font_plus_jakarta", name: "Plus Jakarta", family: "Plus Jakarta Sans", className: "font-jakarta", category: "Modern" },

  // 2. Elegant
  { id: "font_playfair", name: "Playfair Serif", family: "Playfair Display", className: "font-playfair", category: "Elegant" },
  { id: "font_cinzel", name: "Cinzel Roman", family: "Cinzel", className: "font-cinzel", category: "Elegant" },
  { id: "font_cormorant", name: "Cormorant Grace", family: "Cormorant Garamond", className: "font-cormorant", category: "Elegant" },
  { id: "font_bodoni", name: "Bodoni Luxury", family: "Bodoni Moda", className: "font-bodoni", category: "Elegant" },
  { id: "font_marcellus", name: "Marcellus Royal", family: "Marcellus", className: "font-marcellus", category: "Elegant" },

  // 3. Handwriting
  { id: "font_pacifico", name: "Pacifico Wave", family: "Pacifico", className: "font-pacifico", category: "Handwriting" },
  { id: "font_caveat", name: "Caveat Quill", family: "Caveat", className: "font-caveat", category: "Handwriting" },
  { id: "font_dancing", name: "Dancing Script", family: "Dancing Script", className: "font-dancing", category: "Handwriting" },
  { id: "font_sacramento", name: "Sacramento Flow", family: "Sacramento", className: "font-sacramento", category: "Handwriting" },
  { id: "font_great_vibes", name: "Great Vibes", family: "Great Vibes", className: "font-greatvibes", category: "Handwriting" },

  // 4. Bold
  { id: "font_anton", name: "Anton Impact", family: "Anton", className: "font-anton", category: "Bold" },
  { id: "font_paytone", name: "Paytone Punch", family: "Paytone One", className: "font-paytone", category: "Bold" },
  { id: "font_lilita", name: "Lilita Rounded", family: "Lilita One", className: "font-lilita", category: "Bold" },
  { id: "font_bungee", name: "Bungee Block", family: "Bungee", className: "font-bungee", category: "Bold" },
  { id: "font_rubik_mono", name: "Rubik Mono", family: "Rubik Mono One", className: "font-rubikmono", category: "Bold" },

  // 5. Minimal
  { id: "font_space_grotesk", name: "Space Grotesk", family: "Space Grotesk", className: "font-space", category: "Minimal" },
  { id: "font_syne", name: "Syne Minimal", family: "Syne", className: "font-syne", category: "Minimal" },
  { id: "font_lexend", name: "Lexend Clean", family: "Lexend", className: "font-lexend", category: "Minimal" },
  { id: "font_dm_sans", name: "DM Sans Pure", family: "DM Sans", className: "font-dmsans", category: "Minimal" },
  { id: "font_quicksand", name: "Quicksand Soft", family: "Quicksand", className: "font-quicksand", category: "Minimal" },

  // 6. Gaming
  { id: "font_press_start", name: "Press Start 2P", family: "Press Start 2P", className: "font-pressstart", category: "Gaming" },
  { id: "font_silkscreen", name: "Silkscreen Retro", family: "Silkscreen", className: "font-silkscreen", category: "Gaming" },
  { id: "font_black_ops", name: "Black Ops Army", family: "Black Ops One", className: "font-blackops", category: "Gaming" },
  { id: "font_russo", name: "Russo SciFi", family: "Russo One", className: "font-russo", category: "Gaming" },
  { id: "font_vt323", name: "VT323 Terminal", family: "VT323", className: "font-vt323", category: "Gaming" },

  // 7. Futuristic
  { id: "font_orbitron", name: "Orbitron Cyber", family: "Orbitron", className: "font-orbitron", category: "Futuristic" },
  { id: "font_syncopate", name: "Syncopate Space", family: "Syncopate", className: "font-syncopate", category: "Futuristic" },
  { id: "font_rajdhani", name: "Rajdhani Core", family: "Rajdhani", className: "font-rajdhani", category: "Futuristic" },
  { id: "font_audiowide", name: "Audiowide Pulse", family: "Audiowide", className: "font-audiowide", category: "Futuristic" },
  { id: "font_teko", name: "Teko Condensed", family: "Teko", className: "font-teko", category: "Futuristic" },

  // 8. Neon
  { id: "font_tilt_neon", name: "Tilt Neon", family: "Tilt Neon", className: "font-tiltneon", category: "Neon" },
  { id: "font_monoton", name: "Monoton Glow", family: "Monoton", className: "font-monoton", category: "Neon" },
  { id: "font_nabla", name: "Nabla isometric", family: "Nabla", className: "font-nabla", category: "Neon" },
  { id: "font_megrim", name: "Megrim Synth", family: "Megrim", className: "font-megrim", category: "Neon" },
  { id: "font_faster_one", name: "Faster Sprint", family: "Faster One", className: "font-faster", category: "Neon" },

  // 9. Classic
  { id: "font_merriweather", name: "Merriweather", family: "Merriweather", className: "font-merriweather", category: "Classic" },
  { id: "font_eb_garamond", name: "EB Garamond", family: "EB Garamond", className: "font-garamond", category: "Classic" },
  { id: "font_lora", name: "Lora Book", family: "Lora", className: "font-lora", category: "Classic" },
  { id: "font_pt_serif", name: "PT Serif", family: "PT Serif", className: "font-ptserif", category: "Classic" },
  { id: "font_cinzel_dec", name: "Cinzel Decorative", family: "Cinzel Decorative", className: "font-cinzeldec", category: "Classic" },

  // 10. Decorative
  { id: "font_creepster", name: "Creepster Spooky", family: "Creepster", className: "font-creepster", category: "Decorative" },
  { id: "font_rye", name: "Rye Western", family: "Rye", className: "font-rye", category: "Decorative" },
  { id: "font_sancreek", name: "Sancreek Vintage", family: "Sancreek", className: "font-sancreek", category: "Decorative" },
  { id: "font_uncial", name: "Uncial Celtic", family: "Uncial Antiqua", className: "font-uncial", category: "Decorative" },
  { id: "font_frederika", name: "Frederika Sketch", family: "Frederika the Great", className: "font-frederika", category: "Decorative" }
];

const loadedFonts = new Set<string>();

/**
 * Dynamically loads a Google Font in the browser by appending a stylesheet link tag
 */
export function loadGoogleFont(fontFamily: string) {
  if (typeof window === "undefined") return;
  if (loadedFonts.has(fontFamily)) return;

  try {
    const formattedFamily = fontFamily.replace(/ /g, "+");
    const linkId = `google-font-${formattedFamily}`;
    
    if (!document.getElementById(linkId)) {
      const link = document.createElement("link");
      link.id = linkId;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${formattedFamily}:wght@400;700;900&display=swap`;
      document.head.appendChild(link);
      
      // Inject standard font-family CSS style rule inside a stylesheet
      const styleId = `style-font-${formattedFamily}`;
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        const fontClassName = `font-${fontFamily.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
        style.innerHTML = `
          .${fontClassName} {
            font-family: "${fontFamily}", sans-serif !important;
          }
        `;
        document.head.appendChild(style);
      }
      
      loadedFonts.add(fontFamily);
    }
  } catch (err) {
    console.error("Failed to load dynamic font:", fontFamily, err);
  }
}
