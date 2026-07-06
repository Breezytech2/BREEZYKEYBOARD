import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BookOpen, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { auth, db } from '../../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface WpmData {
  date: string;
  wpm: number;
}

export const AcademyTab: React.FC = () => {
  const [wpmData, setWpmData] = useState<WpmData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!auth.currentUser) return;
      
      try {
        const q = query(
          collection(db, "learning_progress"),
          where("userId", "==", auth.currentUser.uid)
        );
        
        const snapshot = await getDocs(q);
        
        let data: WpmData[] = [];
        snapshot.docs.forEach(doc => {
          const docData = doc.data();
          if (docData.completedAt && docData.wpm > 0) {
            const date = new Date(docData.completedAt.seconds * 1000);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            data.push({
              date: dateStr,
              wpm: docData.wpm,
              timestamp: docData.completedAt.seconds
            } as any);
          }
        });
        
        // Sort by timestamp client-side to avoid needing a Firestore composite index
        data = data.sort((a: any, b: any) => a.timestamp - b.timestamp);

        if (data.length > 0) {
          // Group by date and average if multiple entries per day
          const groupedData: Record<string, { sum: number, count: number }> = {};
          data.forEach(item => {
            if (!groupedData[item.date]) {
              groupedData[item.date] = { sum: 0, count: 0 };
            }
            groupedData[item.date].sum += item.wpm;
            groupedData[item.date].count += 1;
          });
          
          const finalData = Object.keys(groupedData).map(date => ({
            date,
            wpm: Math.round(groupedData[date].sum / groupedData[date].count)
          }));
          
          setWpmData(finalData);
        } else {
          // Fallback mock data if no real data is available
          setWpmData([
            { date: 'Mon', wpm: 45 },
            { date: 'Tue', wpm: 48 },
            { date: 'Wed', wpm: 52 },
            { date: 'Thu', wpm: 51 },
            { date: 'Fri', wpm: 58 },
            { date: 'Sat', wpm: 63 },
            { date: 'Sun', wpm: 65 },
          ]);
        }
      } catch (err) {
        console.error("Error fetching WPM data:", err);
        // Fallback mock data on error
        setWpmData([
          { date: 'Mon', wpm: 45 },
          { date: 'Tue', wpm: 48 },
          { date: 'Wed', wpm: 52 },
          { date: 'Thu', wpm: 51 },
          { date: 'Fri', wpm: 58 },
          { date: 'Sat', wpm: 63 },
          { date: 'Sun', wpm: 65 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

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

        <div className="bg-white/10 backdrop-blur-2xl p-6 rounded-2xl border border-white/20 shadow-lg">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">Typing Speed</h3>
              <p className="text-xs text-white/50 font-mono">WPM over time</p>
            </div>
          </div>
          
          <div className="h-64 w-full">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white/20 border-t-emerald-400 rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={wpmData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={10}
                    tickMargin={10}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.4)" 
                    fontSize={10}
                    tickMargin={10}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ color: '#34d399', fontWeight: 'bold' }}
                    labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    name="WPM"
                    stroke="#34d399" 
                    strokeWidth={3}
                    dot={{ fill: '#34d399', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: '#fff', stroke: '#34d399', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
    </motion.div>
  );
};
