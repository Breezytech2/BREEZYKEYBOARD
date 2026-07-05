/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Mail,
  Bug,
  ThumbsUp,
  Star,
  CheckCircle,
  AlertCircle,
  BookOpen
} from "lucide-react";

export const HelpSupportTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Forms states
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const [bugForm, setBugForm] = useState({ severity: "low", area: "keyboard", desc: "" });
  const [bugSuccess, setBugSuccess] = useState(false);
  const [bugLoading, setBugLoading] = useState(false);

  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: "" });
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const [supportTab, setSupportTab] = useState<"faq" | "contact" | "bug" | "feedback">("faq");

  const faqs = [
    {
      q: "Is BreezyKeyboard really free?",
      a: "Yes! BreezyKeyboard is completely free. We do not have any hidden fees, subscription tiers, locked layouts, or advertisement displays. You get access to the full keyboard client and companion app features."
    },
    {
      q: "How does the Glass AI feature protect my typing secrets?",
      a: "BreezyKeyboard uses localized keystroke handling. Your words are compiled only inside your local sandbox. Text is sent to the AI engine ONLY when you actively press an AI feature button (like Grammar Check or translate). We never track keystrokes or store inputs on any secondary servers."
    },
    {
      q: "What is Incognito Mode, and when should I toggle it?",
      a: "Incognito Mode stops the keyboard's localized machine learning dictionary from recording your vocabulary habits. It also temporarily blocks the Breezy Hub from capturing clipboard copy logs. Use it when typing personal information or credentials."
    },
    {
      q: "How can I activate BreezyKeyboard on my actual Android device?",
      a: "In your device system settings: 1. Go to System > Languages & Input. 2. Tap On-screen Keyboard > Manage Keyboards. 3. Turn on the toggle next to 'BreezyKeyboard'. 4. Select it as your default keyboard when prompted in any chat input field."
    },
    {
      q: "Why is my voice typing filler removal not functioning?",
      a: "Make sure you have granted microphone and speech recording permissions inside your browser/emulator settings. Filler removal requires a valid backend API connection to run the correction script successfully."
    }
  ];

  const filteredFaqs = faqs.filter(
    faq =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setTimeout(() => {
      setContactSuccess(true);
      setContactLoading(false);
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setContactSuccess(false), 3000);
    }, 1000);
  };

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBugLoading(true);
    setTimeout(() => {
      setBugSuccess(true);
      setBugLoading(false);
      setBugForm({ severity: "low", area: "keyboard", desc: "" });
      setTimeout(() => setBugSuccess(false), 3000);
    }, 1000);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackLoading(true);
    setTimeout(() => {
      setFeedbackSuccess(true);
      setFeedbackLoading(false);
      setFeedbackForm({ rating: 5, comment: "" });
      setTimeout(() => setFeedbackSuccess(false), 3000);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="space-y-4 pb-12 font-sans text-slate-100"
    >
      <div className="flex items-center space-x-2 px-1">
        <HelpCircle className="w-4.5 h-4.5 text-cyan-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">Support &amp; Feedback Center</h3>
      </div>

      {/* Horizontal Nav Categories */}
      <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1">
        {[
          { id: "faq", label: "FAQ / Center", icon: HelpCircle },
          { id: "contact", label: "Contact Us", icon: Mail },
          { id: "bug", label: "Report Bug", icon: Bug },
          { id: "feedback", label: "Send Feedback", icon: ThumbsUp }
        ].map(item => {
          const Icon = item.icon;
          const isActive = supportTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setSupportTab(item.id as any)}
              className={`px-3 py-1.5 text-[10.5px] rounded-full font-bold transition-all shrink-0 border uppercase tracking-wider flex items-center space-x-1.5 ${isActive ? "bg-white text-black border-white shadow-md scale-105" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={supportTab}
          initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
          className="space-y-4"
        >
          {/* TAB 1: FAQ AND HELP CENTER */}
          {supportTab === "faq" && (
            <div className="space-y-3">
              {/* Search Index */}
              <div className="relative group">
                <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-white/40">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30 backdrop-blur-md transition-all shadow-inner"
                />
              </div>

              <div className="space-y-2.5">
                {filteredFaqs.length === 0 ? (
                  <div className="p-8 text-center text-xs text-white/50 bg-white/5 border border-dashed border-white/15 rounded-2xl">
                    No matching questions found. Try searching for 'privacy', 'activating', or 'free'.
                  </div>
                ) : (
                  filteredFaqs.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div
                        key={index}
                        className="bg-white/10 border border-white/20 rounded-2xl overflow-hidden backdrop-blur-2xl shadow-sm transition-all"
                      >
                        <button
                          onClick={() => setOpenFaq(isOpen ? null : index)}
                          className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-white/5 active:bg-white/10 transition-colors"
                        >
                          <span className="text-[12px] font-bold text-white pr-2">{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-white/50 shrink-0 transition-transform ${isOpen ? "rotate-180 text-white" : ""}`} />
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: "auto" }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-3 pt-1 text-[11px] text-white/70 leading-relaxed border-t border-white/5">
                                {faq.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CONTACT SUPPORT */}
          {supportTab === "contact" && (
            <div className="bg-white/10 border border-white/20 p-5 rounded-3xl space-y-4 backdrop-blur-2xl shadow-lg">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Contact Support</h4>
                <p className="text-[10.5px] text-white/60">Have any technical difficulties? Shoot us a detailed message!</p>
              </div>

              {contactSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-200 animate-pulse">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Message Sent Successfully!</span>
                    <p className="text-[10.5px] text-white/70">Our support engineers will review your request and contact you within 24 hours.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest">Name</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest">Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20"
                      placeholder="Typing delay on Swahili keyboard"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 h-20 resize-none"
                      placeholder="Please explain your issue in detail..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={contactLoading}
                    className="w-full py-2.5 bg-white text-black font-extrabold text-[11px] rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wide flex items-center justify-center space-x-1.5"
                  >
                    <span>{contactLoading ? "Submitting Request..." : "Submit Message"}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: REPORT A BUG */}
          {supportTab === "bug" && (
            <div className="bg-white/10 border border-white/20 p-5 rounded-3xl space-y-4 backdrop-blur-2xl shadow-lg">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Report Bug</h4>
                <p className="text-[10.5px] text-white/60">Encountered an exception or visual glitch? Help us resolve it!</p>
              </div>

              {bugSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-200 animate-pulse">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Bug Filed Successfully!</span>
                    <p className="text-[10.5px] text-white/70">Our developer logs have recorded this report. A fix is scheduled in our upcoming micro-release.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBugSubmit} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest">Bug Severity</label>
                      <select
                        value={bugForm.severity}
                        onChange={(e) => setBugForm({ ...bugForm, severity: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20"
                      >
                        <option value="low">Low (UI Typo)</option>
                        <option value="medium">Medium (Layout Glitch)</option>
                        <option value="critical">Critical (Crash)</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest">App Area</label>
                      <select
                        value={bugForm.area}
                        onChange={(e) => setBugForm({ ...bugForm, area: e.target.value })}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20"
                      >
                        <option value="keyboard">Keyboard Keys</option>
                        <option value="themes">Live Themes</option>
                        <option value="ai">Glass AI Tab</option>
                        <option value="dashboard">Companion Dashboard</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest">Bug Details</label>
                    <textarea
                      value={bugForm.desc}
                      onChange={(e) => setBugForm({ ...bugForm, desc: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 h-24 resize-none"
                      placeholder="Please write reproduction steps (e.g., I tapped voice tab twice and...)"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={bugLoading}
                    className="w-full py-2.5 bg-white text-black font-extrabold text-[11px] rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wide flex items-center justify-center space-x-1.5"
                  >
                    <span>{bugLoading ? "Filing Bug Report..." : "File Bug Report"}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: SEND USER FEEDBACK */}
          {supportTab === "feedback" && (
            <div className="bg-white/10 border border-white/20 p-5 rounded-3xl space-y-4 backdrop-blur-2xl shadow-lg">
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">Send Feedback</h4>
                <p className="text-[10.5px] text-white/60">Share your thoughts on how we can improve BreezyKeyboard!</p>
              </div>

              {feedbackSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl flex items-start space-x-2.5 text-xs text-emerald-200 animate-pulse">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white block mb-0.5">Thank you for your review!</span>
                    <p className="text-[10.5px] text-white/70">Your rating stars and feedback points have been calculated. We appreciate your partnership!</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest block mb-1">Overall Rating</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFeedbackForm({ ...feedbackForm, rating: num })}
                          className="focus:outline-none hover:scale-110 transition-all text-yellow-400"
                        >
                          <Star className={`w-6 h-6 ${num <= feedbackForm.rating ? "fill-current" : "text-white/20"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-bold text-white/50 uppercase tracking-widest">Comments &amp; Ideas</label>
                    <textarea
                      value={feedbackForm.comment}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-[11px] text-white focus:outline-none focus:border-white/20 h-24 resize-none"
                      placeholder="What is your favorite layout theme? What features should we add next?"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={feedbackLoading}
                    className="w-full py-2.5 bg-white text-black font-extrabold text-[11px] rounded-xl hover:opacity-90 active:scale-95 transition-all uppercase tracking-wide flex items-center justify-center space-x-1.5"
                  >
                    <span>{feedbackLoading ? "Sending Feedback..." : "Send Feedback"}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* App Version Info Block */}
      <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between text-[11px] font-mono text-white/50 shadow-inner">
        <span>BreezyKeyboard Version</span>
        <span className="font-bold text-cyan-400">v1.5.0 Production Stable</span>
      </div>
    </motion.div>
  );
};
