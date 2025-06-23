import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

interface XPNotificationProps {
  xp: number;
  reason: string;
  onClose: () => void;
}

const XPNotification: React.FC<XPNotificationProps> = ({
  xp,
  reason,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        className="fixed top-20 right-4 z-50"
      >
        <div className="glass-card rounded-lg p-3 border-l-4 border-yellow-500 flex items-center space-x-3 shadow-lg">
          <div className="p-2 rounded-full bg-yellow-500/20">
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <p className="text-yellow-400 font-bold">+{xp} XP</p>
            <p className="text-gray-300 text-sm">{reason}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default XPNotification;
