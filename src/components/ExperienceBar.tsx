import React from "react";
import { motion } from "framer-motion";

interface ExperienceBarProps {
  level: number;
  currentXP: number;
  requiredXP: number;
  rank: string;
}

const ExperienceBar: React.FC<ExperienceBarProps> = ({
  level,
  currentXP,
  requiredXP,
  rank,
}) => {
  const progress = (currentXP / requiredXP) * 100;

  return (
    <div className="glass-card rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mr-3">
            <span className="text-white font-bold">{level}</span>
          </div>
          <div>
            <p className="text-gray-200 font-semibold">Niveau {level}</p>
            <p className="text-sm text-gray-400">{rank}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-gray-200">
            {currentXP} / {requiredXP} XP
          </p>
          <p className="text-xs text-gray-400">
            {Math.round(progress)}% jusqu'au niveau {level + 1}
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
        />
      </div>
    </div>
  );
};

export default ExperienceBar;
