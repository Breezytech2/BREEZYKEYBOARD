/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Keyboard,
  Settings,
  ShieldAlert,
  Sliders,
  Check,
  ArrowRight,
  Volume2,
  Mic,
  FileText
} from "lucide-react";

interface OnboardingTourProps {
  onComplete: () => void;
  onSkip: () => void;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to BreezyKeyboard",
      subtitle: "The only keyboard you'll ever need.",
      icon: <Keyboard className="w-12 h-12 text-cyan-400" />,
      content: (
        <div className="space-y-4 text-center">
          <p className="text-xs text-white/80 leading-relaxed max-w-sm mx-auto">
            Experience typing reinvented. BreezyKeyboard is a premium, secure, and smart keyboard that combines real-time multi-language layout selections, haptic feedback, voice transcriptions, and privacy scans.
          </p>
          <div className="py-2 flex justify-center space-x-2">
            <span className="px-2.5 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-[10px] font-bold tracking-wider">COMPLETELY FREE</span>
            <span className="px-2.5 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-[10px] font-bold tracking-wider">NO ADS</span>
            <span className="px-2.5 py-1 bg-white/10 text-white border border-white/20 rounded-lg text-[10px] font-bold tracking-wider">PRIVACY SECURED</span>
          </div>
        </div>
      )
    },
    {
      title: "Intelligent Features",
      subtitle: "Equipped with state-of-the-art AI wrappers",
      icon: <Sparkles className="w-12 h-12 text-pink-400" />,
      content: (
        <div className="space-y-3 max-w-md mx-auto">
          <div className="grid grid-cols-2 gap-2.5 text-left text-xs">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="font-bold text-white block">Glass AI Writing</span>
              <p className="text-[10px] text-white/60">Grammar correction, tone rewrites, and summaries inline.</p>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="font-bold text-white block">Breezy Voice</span>
              <p className="text-[10px] text-white/60">Flawless hands-free dictation with automatic filler word removal.</p>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="font-bold text-white block">Glass Protect</span>
              <p className="text-[10px] text-white/60">Scans outgoing drafts to safeguard passwords and confidential data.</p>
            </div>
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <span className="font-bold text-white block">Live Themes</span>
              <p className="text-[10px] text-white/60">Over 20 stunning, animated RGB lighting styles and custom creators.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Activate the Keyboard",
      subtitle: "Quick setup instructions for your device",
      icon: <Settings className="w-12 h-12 text-yellow-400" />,
      content: (
        <div className="space-y-3 text-left max-w-sm mx-auto text-xs text-white/80">
          <p className="text-[11px] text-white/60 text-center pb-1">Follow these simple steps in your actual device Settings to enable typing:</p>
          <div className="space-y-2">
            <div className="flex items-start space-x-2.5 bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
              <p>Open your phone's **Settings** app.</p>
            </div>
            <div className="flex items-start space-x-2.5 bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
              <p>Navigate to **System &gt; Languages &amp; input &gt; Keyboards**.</p>
            </div>
            <div className="flex items-start space-x-2.5 bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
              <p>Tap **Manage Keyboards** and toggle **BreezyKeyboard** to **ON**.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Set as Default Input",
      subtitle: "Switch to your beautiful glass layout",
      icon: <Sliders className="w-12 h-12 text-emerald-400" />,
      content: (
        <div className="space-y-3 text-left max-w-sm mx-auto text-xs text-white/80">
          <p className="text-[11px] text-white/60 text-center pb-1">To start typing on your chat apps and documents:</p>
          <div className="space-y-2">
            <div className="flex items-start space-x-2.5 bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
              <p>Tap inside any input field to raise your current keyboard.</p>
            </div>
            <div className="flex items-start space-x-2.5 bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
              <p>Click the **Keyboard Selection** icon on your screen navigation bar.</p>
            </div>
            <div className="flex items-start space-x-2.5 bg-white/5 p-2 rounded-xl border border-white/10">
              <span className="w-5 h-5 rounded-full bg-cyan-400 text-black flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
              <p>Select **BreezyKeyboard** as your primary keyboard.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Transparent Permissions",
      subtitle: "Privacy first, metadata secured",
      icon: <ShieldAlert className="w-12 h-12 text-red-400" />,
      content: (
        <div className="space-y-3 text-left max-w-md mx-auto text-xs text-white/80 leading-relaxed">
          <p className="text-[11px] text-white/60 text-center pb-1">BreezyKeyboard operates strictly locally. Here is why we ask for access:</p>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <div className="flex items-center space-x-1 text-cyan-400">
                <Mic className="w-3.5 h-3.5" />
                <span className="font-bold text-white">Microphone</span>
              </div>
              <p className="text-[10px] text-white/60">Only processed when you click 'Voice Typing' key to capture speech drafts. No ambient records.</p>
            </div>

            <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
              <div className="flex items-center space-x-1 text-cyan-400">
                <FileText className="w-3.5 h-3.5" />
                <span className="font-bold text-white">Clipboard History</span>
              </div>
              <p className="text-[10px] text-white/60">Allows instant copying and clipboard pasting logs, cleared automatically within 5 minutes.</p>
            </div>
          </div>

          <p className="text-[10px] text-white/40 text-center italic mt-2">We never track, store, or sell your typed messages or passwords.</p>
        </div>
      )
    },
    {
      title: "All Set & Unlocked!",
      subtitle: "Ready to elevate your writing experience",
      icon: <Check className="w-12 h-12 text-emerald-400" />,
      content: (
        <div className="space-y-4 text-center">
          <p className="text-xs text-white/80 leading-relaxed max-w-sm mx-auto">
            Congratulations! You've successfully completed the BreezyKeyboard setup tour. Start customized typing, practicing vocabulary, and exploring stunning themes!
          </p>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 max-w-xs mx-auto">
            <span className="text-[10px] font-bold text-white/40 block uppercase tracking-widest font-mono">Current Build</span>
            <span className="text-xs font-bold text-cyan-400">v1.5.0 Production Ready</span>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepInfo = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-slate-900/80 border border-white/20 p-6 rounded-3xl backdrop-blur-2xl shadow-2xl flex flex-col space-y-6 relative overflow-hidden"
      >
        {/* Decorative Grid glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-pink-500/10 pointer-events-none" />

        {/* Header bar */}
        <div className="flex justify-between items-center relative z-10 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-1.5 font-mono text-[9px] font-bold text-white/50 uppercase tracking-widest">
            <span>Setup Guide</span>
            <span>•</span>
            <span className="text-cyan-400">Step {currentStep + 1} of {steps.length}</span>
          </div>
          
          <button
            onClick={onSkip}
            className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-wider transition-colors flex items-center space-x-1 cursor-pointer"
          >
            <span>Skip Guide</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step Visual Body */}
        <div className="flex flex-col items-center space-y-3 text-center relative z-10 py-2">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl shadow-inner animate-bounce">
            {stepInfo.icon}
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide">{stepInfo.title}</h2>
            <p className="text-xs text-white/60 italic">{stepInfo.subtitle}</p>
          </div>
        </div>

        {/* Step Specific Content */}
        <div className="relative z-10 flex-1 min-h-[160px] flex items-center justify-center">
          {stepInfo.content}
        </div>

        {/* Progress Dots & Nav buttons */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4 relative z-10">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-3 py-1.5 text-[10.5px] rounded-xl font-bold uppercase tracking-wider flex items-center space-x-1 ${currentStep === 0 ? "text-white/25 pointer-events-none" : "text-white/80 hover:text-white"}`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center space-x-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentStep ? "bg-cyan-400 w-3.5" : "bg-white/20"}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-1.5 bg-white text-black font-extrabold text-[10.5px] rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wider flex items-center space-x-1 shadow-md cursor-pointer"
          >
            <span>{currentStep === steps.length - 1 ? "Finish" : "Next"}</span>
            {currentStep === steps.length - 1 ? <Check className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
