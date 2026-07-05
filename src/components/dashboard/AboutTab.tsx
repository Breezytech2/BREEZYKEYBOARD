/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Info, Globe, Mail, ShieldAlert, Cpu, Heart, CheckCircle } from "lucide-react";

export const AboutTab: React.FC = () => {
  const changelog = [
    {
      version: "v1.5.0",
      date: "July 2026",
      items: [
        "Added onboarding tour setup guides",
        "Integrated Help Center, FAQ & custom feedback systems",
        "Configured Privacy, TOS, and AI disclosures",
        "Added custom glass theme creator in live themes panel",
        "Implemented Voice transcript filler removal ('um', 'ah', 'like')",
        "Added Glass Protect cyber PII leakage scanner"
      ]
    },
    {
      version: "v1.4.0",
      date: "May 2026",
      items: [
        "Implemented Swahili, Spanish, French, and Kikuyu next-word prediction engines",
        "Integrated server-side Gemini 3.5 AI writing shortcuts",
        "Added high-contrast Accessibility mode settings"
      ]
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="space-y-4 pb-12 font-sans text-slate-100"
    >
      {/* Brand Card */}
      <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-3xl border border-white/20 text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-white/25 border border-white/40 p-1 mx-auto shadow-lg flex items-center justify-center">
          <div className="w-full h-full rounded-[11px] bg-slate-900/50 flex items-center justify-center font-black text-white text-xl">
            BK
          </div>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-white font-display uppercase">BREEZYKEYBOARD</h2>
          <p className="text-xs text-cyan-400 font-medium tracking-wide">"The only keyboard you'll ever need."</p>
        </div>

        <p className="text-xs text-white/75 leading-relaxed max-w-sm mx-auto">
          BreezyKeyboard is an intelligent, high-contrast, multi-modal companion keyboard and dashboard designed to optimize your workspace with real-time text predictions, translations, voice transcripts cleanup, and cyber privacy scanners.
        </p>

        <div className="flex justify-center space-x-6 text-[11px] text-white/50 border-t border-white/10 pt-4 font-mono">
          <span>Version: 1.5.0 Stable</span>
          <span>Build: 2026.07.05</span>
        </div>
      </div>

      {/* Developer Information */}
      <div className="bg-white/10 backdrop-blur-2xl p-5 rounded-3xl border border-white/20 space-y-3.5 shadow-lg">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center space-x-2">
          <Cpu className="w-4.5 h-4.5 text-cyan-400" />
          <span>Product Engineering</span>
        </h3>
        
        <div className="space-y-2.5 text-xs text-white/80 leading-relaxed">
          <p>
            Developed with passion by the **Glass AI Engineering Team**, committed to crafting secure, client-side intelligence utilities that empower typing experiences without compromising private communication metadata.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a 
              href="https://breezykeyboard.app" 
              target="_blank" 
              rel="noreferrer"
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors flex items-center space-x-2 text-[10px] text-white font-semibold"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>breezykeyboard.app</span>
            </a>
            <a 
              href="mailto:support@breezykeyboard.app"
              className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors flex items-center space-x-2 text-[10px] text-white font-semibold"
            >
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>support@breezykeyboard.app</span>
            </a>
          </div>
        </div>
      </div>

      {/* Changelog section */}
      <div className="bg-white/10 backdrop-blur-2xl p-5 rounded-3xl border border-white/20 space-y-4 shadow-lg">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display flex items-center space-x-2">
          <Info className="w-4.5 h-4.5 text-cyan-400" />
          <span>Changelog & History</span>
        </h3>

        <div className="space-y-4 divide-y divide-white/5">
          {changelog.map((log, index) => (
            <div key={log.version} className={`space-y-2 ${index > 0 ? "pt-4" : ""}`}>
              <div className="flex justify-between items-center font-mono">
                <span className="text-xs font-bold text-cyan-300">{log.version}</span>
                <span className="text-[10px] text-white/40">{log.date}</span>
              </div>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-white/70">
                {log.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Legal Disclaimer card */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start space-x-3 text-[10px] text-amber-200/90 shadow-md">
        <ShieldAlert className="w-4.5 h-4.5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-amber-300 uppercase tracking-wide">Developer Notice</span>
          <p>
            All generated AI outputs are calculated utilizing Gemini Large Language Models. Generative text is informative only; please cross-verify critical financial or medical drafting suggestions independently.
          </p>
        </div>
      </div>
    </motion.div>
  );
};
