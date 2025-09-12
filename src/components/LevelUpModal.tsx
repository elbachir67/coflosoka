import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronUp, X } from "lucide-react";
import Confetti from "react-confetti";

interface LevelUpModalProps {
  level: number;
  rank: string;
  onClose: () => void;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({
  level,
  rank,
  onClose,
}) => {
  useEffect(() => {
    // Fermer automatiquement après 5 secondes
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur-sm">
        <Confetti recycle={false} numberOfPieces={300} />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20" />

          <div className="relative z-10">
            <div className="text-center mb-6">
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                  delay: 0.2,
                }}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4"
              >
                <ChevronUp className="w-12 h-12 text-white" />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-3xl font-bold text-white mb-2">
                  Niveau {level} !
                </h2>
                <p className="text-purple-400 font-semibold text-xl">
                  Vous êtes maintenant un{" "}
                  <span className="text-yellow-400">{rank}</span>
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-gray-800/50 rounded-lg p-4 mb-6"
            >
              <p className="text-gray-300 text-center">
                Félicitations pour votre progression ! Continuez à apprendre et
                à relever de nouveaux défis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <p className="text-gray-400 mb-4">
                De nouvelles opportunités et achievements vous attendent !
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

export default LevelUpModal;
