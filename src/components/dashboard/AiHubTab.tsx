import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, CheckCircle, MessageSquare } from 'lucide-react';
import { UserProfile } from '../../types';

interface AiHubTabProps {
  userProfile: UserProfile;
  aiHistory: { prompt: string; response: string; date: string }[];
}

export const AiHubTab: React.FC<AiHubTabProps> = ({ userProfile, aiHistory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="space-y-4"
    >
      {/* Free Access Model banner */}
      <div className="w-full bg-white/10 p-5 rounded-2xl border border-white/20 backdrop-blur-2xl space-y-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center space-x-1.5 font-display tracking-wide uppercase">
              <Sparkles className="w-4.5 h-4.5 text-white animate-pulse" />
              <span>Free Access Model</span>
            </h3>
            <p className="text-[10px] text-white/80 leading-relaxed max-w-sm">
              BREEZYKEYBOARD is completely free for all users. There are no subscriptions, no locked features, and no daily AI usage limits.
            </p>
          </div>
          <span className="px-2.5 py-1 bg-white/20 text-white rounded-lg text-[9px] font-bold border border-white/30 flex items-center space-x-0.5 shrink-0 shadow-sm uppercase tracking-wider">
            <CheckCircle className="w-3 h-3 text-white" />
            <span>UNLOCKED</span>
          </span>
        </div>

        <div className="border-t border-white/10 pt-3">
          <span className="text-[9px] font-bold text-white/50 uppercase block mb-2">Every user receives unlimited access to:</span>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-white/90">
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited typing</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited AI features</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited Thinking Mode</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited translation</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited voice typing</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited grammar correction</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited text rewriting</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited emoji & GIFs</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited Breezy Hub</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited Breezy Learn</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited Breezy Protect</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited live themes</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited fonts</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <span>Unlimited cloud sync</span>
            </div>
          </div>
        </div>

        <p className="text-[9px] text-white/50 italic leading-snug border-t border-white/5 pt-2.5">
          Designed with a strong focus on user privacy, raw local performance, and accessibility while remaining fast, secure, and incredibly responsive.
        </p>
      </div>

      {/* AI History Logs */}
      <div className="bg-white/10 backdrop-blur-2xl p-4 rounded-2xl border border-white/20 space-y-3.5 shadow-lg">
        <h4 className="text-xs font-semibold text-white flex items-center space-x-1.5 font-display uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-white" />
          <span>Recent AI Generated History ({aiHistory.length})</span>
        </h4>

        {aiHistory.length === 0 ? (
          <p className="text-[11px] text-white/60 py-4 text-center italic border border-dashed border-white/20 rounded-xl bg-white/5">
            No history found. Try correcting spelling or translating text from the keyboard AI toolbar.
          </p>
        ) : (
          <div className="space-y-3 max-h-60 overflow-y-auto no-scrollbar">
            {aiHistory.map((hist, i) => (
              <div key={i} className="p-3 bg-white/10 rounded-xl border border-white/20 text-[11px] space-y-1.5 backdrop-blur-md shadow-md">
                <div className="flex justify-between items-center text-[8.5px] text-white/70 font-mono">
                  <span className="font-bold text-white uppercase tracking-wider">Trigger Request</span>
                  <span>{hist.date}</span>
                </div>
                <p className="text-white font-medium">"{hist.prompt}"</p>
                <div className="border-t border-white/20 pt-2 mt-2 text-white/90 leading-relaxed">
                  <span className="text-[8px] font-bold text-white/70 block uppercase tracking-widest font-mono">Glass AI</span>
                  {hist.response}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
