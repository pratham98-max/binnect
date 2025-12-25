// src/components/FloatingBot.jsx
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Bot } from 'lucide-react';

const FloatingBot = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [30, -30]);
  const rotateY = useTransform(x, [-100, 100], [-30, 30]);

  return (
    <div className="fixed bottom-10 right-10 z-50 perspective-1000">
      <motion.div
        style={{ x, y, rotateX, rotateY, z: 100 }}
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        whileHover={{ scale: 1.1 }}
        className="w-20 h-20 bg-blue-600 rounded-3xl cursor-grab active:cursor-grabbing flex items-center justify-center shadow-[0_20px_50px_rgba(0,102,255,0.4)] border border-white/30 backdrop-blur-lg"
      >
        <Bot size={32} color="white" />
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-4 border-[#050505]" />
      </motion.div>
    </div>
  );
};