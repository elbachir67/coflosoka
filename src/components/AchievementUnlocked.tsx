import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, X } from "lucide-react";
import Confetti from "react-confetti";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  points: number;
  rarity: string;
  badgeUrl?: string;
}

interface AchievementUnlockedProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({
  achievement,
  onClose,
}) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Arrêter les confettis après 3 secondes
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "from-gray-500 to-gray-700";
      case "uncommon":
        return "from-green-500 to-green-700";
      case "rare":
        return "from-blue-500 to-blue-700";
      case "epic":
        return "from-purple-500 to-purple-700";
      case "legendary":
        return "from-yellow-500 to-yellow-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(
              achievement.rarity
            )} opacity-20`}
          />

          <div className="relative z-10">
            <div className="text-center mb-4">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4"
              >
                <Award className="w-10 h-10 text-white" />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-bold text-white mb-1">
                  Achievement débloqué !
                </h2>
                <p className="text-purple-400 font-semibold text-lg">
                  {achievement.title}
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/50 rounded-lg p-4 mb-4"
            >
              <p className="text-gray-300 text-center">
                {achievement.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="text-yellow-400 font-bold text-lg mb-4">
                +{achievement.points} XP
              </p>

              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
              >
                Continuer
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AchievementUnlocked;
