import React from 'react';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export const AcademyTab: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -5 }}
      className="space-y-4"
    >
        <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
            <BookOpen className="w-10 h-10 text-white mx-auto" />
            <h3 className="text-lg font-bold text-white font-display">Glass Academy</h3>
            <p className="text-sm text-white/70">
            Master the art of efficient typing with Glass. Interactive tutorials coming soon.
            </p>
        </div>
    </motion.div>
  );
};
