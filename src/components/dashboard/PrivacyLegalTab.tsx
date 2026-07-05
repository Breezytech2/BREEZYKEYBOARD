/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, FileText, Activity, Sparkles, BookOpen, Scale, ArrowRight, ShieldCheck } from "lucide-react";

export const PrivacyLegalTab: React.FC = () => {
  const [activeSection, setActiveSection] = useState<"privacy" | "terms" | "data" | "ai" | "licenses">("privacy");

  const sections = [
    { id: "privacy", label: "Privacy Policy", icon: Lock },
    { id: "terms", label: "Terms of Service", icon: FileText },
    { id: "data", label: "Data Usage", icon: Activity },
    { id: "ai", label: "AI Usage Notice", icon: Sparkles },
    { id: "licenses", label: "Licenses", icon: BookOpen }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="space-y-4 pb-12 font-sans text-slate-100"
    >
      <div className="flex items-center space-x-2 px-1">
        <Scale className="w-4.5 h-4.5 text-cyan-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Privacy &amp; Legal Center</h3>
      </div>

      {/* Horizontal Tabs selector */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
        {sections.map(sec => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`px-3 py-1.5 text-[10.5px] rounded-full font-bold transition-all shrink-0 border uppercase tracking-wider flex items-center space-x-1.5 ${isActive ? "bg-white text-black border-white shadow-md scale-105" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
          className="bg-white/10 backdrop-blur-2xl p-5 rounded-3xl border border-white/20 space-y-4 shadow-lg text-xs leading-relaxed text-white/80"
        >
          {activeSection === "privacy" && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-white/15 pb-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white uppercase tracking-wider font-display">Privacy Policy</h4>
              </div>
              <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Last Updated: July 2026</p>
              
              <p>
                At **BreezyKeyboard**, we prioritize user privacy above everything else. Because your keyboard processes highly sensitive personal and professional communication data, we operate under a strict privacy-by-design policy.
              </p>

              <div className="space-y-2.5">
                <h5 className="font-bold text-white">1. Core Data Protection</h5>
                <p>
                  We **never** collect, track, store, or sell any text you type, including search terms, credentials, notes, or messages. All keystroke predictions, layout selections, and sound haptics are generated locally on your local device container without network interactions.
                </p>

                <h5 className="font-bold text-white">2. AI API Routing Protocols</h5>
                <p>
                  When you explicitly use Breezy AI functions (such as Grammar Check, Tone Translation, or AI Replier), your current input buffer is sent securely to the Google Gemini API server-side endpoint. Keystrokes are sent strictly on-demand. Keystroke data is never buffered, stored, or used for AI training algorithms.
                </p>

                <h5 className="font-bold text-white">3. Secure Cloud Synchronization</h5>
                <p>
                  If you opt-in to Firebase Cloud Sync, your custom layout configurations (such as active themes, font choice, and Academy XP scores) are saved securely in our cloud-hosted database (Firestore) with full Google/Firebase Authentication access tokens. This data is private to your registered user profile and cannot be accessed by unauthorized clients.
                </p>
              </div>

              <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/25 rounded-2xl flex items-start space-x-2 text-emerald-200">
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" />
                <p className="text-[10.5px]">
                  **Local Processing Isolation**: When **Incognito Mode** is toggled ON, both clipboard tracking and local next-word learning algorithms are completely halted.
                </p>
              </div>
            </div>
          )}

          {activeSection === "terms" && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-white/15 pb-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white uppercase tracking-wider font-display">Terms of Service</h4>
              </div>
              
              <p>
                By downloading, installing, or interacting with the BreezyKeyboard applet or associated companion dashboard, you agree to these transparent Terms of Service.
              </p>

              <div className="space-y-2.5">
                <h5 className="font-bold text-white">1. Unlocked Access Model</h5>
                <p>
                  BreezyKeyboard is provided completely **free of charge**. There are no premium lockups, paid plans, or user-facing subscription tiers. You are granted a personal, non-exclusive, non-transferable, and revocable license to operate the keyboard simulation solely for personal or educational typing purposes.
                </p>

                <h5 className="font-bold text-white">2. Acceptable Usage</h5>
                <p>
                  You agree not to utilize the virtual keyboard interface or integrated AI handlers to intentionally generate fraudulent links, disseminate abusive language, engage in automated denial-of-service, or spoof credential inputs.
                </p>

                <h5 className="font-bold text-white">3. Disclaimer of Liability</h5>
                <p>
                  The software is provided "AS IS" without warranty of any kind. The development team is not responsible for any accidental loss of data, typing delays, or server-side API rate-limits that may occur during typing workflows.
                </p>
              </div>
            </div>
          )}

          {activeSection === "data" && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-white/15 pb-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white uppercase tracking-wider font-display">Data Usage &amp; Consent</h4>
              </div>

              <p>
                To provide smart next-word typing suggestions, voice corrections, and cross-device sync features, BreezyKeyboard accesses the following localized scopes with explicit consent:
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Microphone Input</span>
                    <p className="text-[11px] text-white/70">
                      Accessed ONLY when you press the microphone key in Voice mode. Audio is captured locally to transcribe and clean up speech transcript patterns via server-side processing. Audio clips are never cached permanently.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Clipboard Buffer Scopes</span>
                    <p className="text-[11px] text-white/70">
                      Kept strictly in-memory in your local sandbox to allow quick pasting, editing, or AI summary requests. The clipboard data is cleared automatically on app exit or after a 5-minute timeout.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start space-x-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Learning Dictionaries</span>
                    <p className="text-[11px] text-white/70">
                      We store frequent word sequences locally to build your customized typing model. If you wish to wipe this history, you may press the "Reset to Default" button in Settings at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "ai" && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-white/15 pb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white uppercase tracking-wider font-display">AI Usage &amp; Disclosures</h4>
              </div>

              <p>
                BreezyKeyboard integrates Gemini Large Language Models via modern API handlers to power translation, contextual smart replies, speech cleanups, and grammar checks.
              </p>

              <div className="space-y-2.5">
                <h5 className="font-bold text-white">1. Secure Key Architecture</h5>
                <p>
                  Your API keys are stored strictly in-backend within your secure environment container. No client-side browser inspect tools can expose your Gemini credentials, preventing security compromise or quota hijacking.
                </p>

                <h5 className="font-bold text-white">2. Content Limitations &amp; Hallucinations</h5>
                <p>
                  AI generated text suggestions are predictive approximations. Typographical completions, speech corrections, and quick answers may occasionally contain mistakes, tone inaccuracies, or historical anomalies. Always verify important instructions or communications manually.
                </p>

                <h5 className="font-bold text-white">3. Strict Data Decoupling</h5>
                <p>
                  None of your typed logs are shared with public LLMs for continuous general training purposes. Your AI sessions are private, isolated, and discarded immediately after processing.
                </p>
              </div>
            </div>
          )}

          {activeSection === "licenses" && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2 border-b border-white/15 pb-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h4 className="font-bold text-white uppercase tracking-wider font-display">Open Source Licenses</h4>
              </div>

              <p>
                BreezyKeyboard is proudly built with the support of incredible open source tools and libraries. Here is our direct attribution to packages that power our user experience:
              </p>

              <div className="space-y-2 font-mono text-[10.5px] max-h-56 overflow-y-auto pr-1 no-scrollbar text-white/70">
                <div className="p-2 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <p className="font-bold text-white">React v19 (MIT License)</p>
                  <p className="text-[9px] text-white/50">Copyright (c) Meta Platforms, Inc. and affiliates.</p>
                </div>
                <div className="p-2 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <p className="font-bold text-white">Vite v6 (MIT License)</p>
                  <p className="text-[9px] text-white/50">Copyright (c) 2019-present, Yuzu and contributors.</p>
                </div>
                <div className="p-2 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <p className="font-bold text-white">Tailwind CSS (MIT License)</p>
                  <p className="text-[9px] text-white/50">Copyright (c) Tailwind Labs, Inc.</p>
                </div>
                <div className="p-2 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <p className="font-bold text-white">Lucide React (ISC License)</p>
                  <p className="text-[9px] text-white/50">Copyright (c) 2016-present, Lucide Contributors.</p>
                </div>
                <div className="p-2 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <p className="font-bold text-white">Firebase SDK (Apache v2.0)</p>
                  <p className="text-[9px] text-white/50">Licensed under the Apache License, Version 2.0.</p>
                </div>
                <div className="p-2 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <p className="font-bold text-white">Motion/react (MIT License)</p>
                  <p className="text-[9px] text-white/50">Copyright (c) 2018 Matt Perry.</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};
