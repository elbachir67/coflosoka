import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  BookOpen,
  Calendar,
  CheckSquare,
  Clock,
  Layers,
  LogIn,
  Map,
  Star,
  Users,
} from "lucide-react";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  points: number;
  rarity: string;
  badgeUrl?: string;
  unlockedAt?: Date;
  progress?: number;
}

interface AchievementCardProps {
  achievement: Achievement;
  isUnlocked?: boolean;
  isNew?: boolean;
  onClick?: () => void;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  isUnlocked = false,
  isNew = false,
  onClick,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "BookOpen":
        return <BookOpen className="w-6 h-6" />;
      case "Layers":
        return <Layers className="w-6 h-6" />;
      case "Map":
        return <Map className="w-6 h-6" />;
      case "CheckSquare":
        return <CheckSquare className="w-6 h-6" />;
      case "Award":
        return <Award className="w-6 h-6" />;
      case "LogIn":
        return <LogIn className="w-6 h-6" />;
      case "Calendar":
        return <Calendar className="w-6 h-6" />;
      case "Clock":
        return <Clock className="w-6 h-6" />;
      case "Star":
        return <Star className="w-6 h-6" />;
      case "Users":
        return <Users className="w-6 h-6" />;
      default:
        return <Award className="w-6 h-6" />;
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "text-gray-300 bg-gray-800/50";
      case "uncommon":
        return "text-green-400 bg-green-500/20";
      case "rare":
        return "text-blue-400 bg-blue-500/20";
      case "epic":
        return "text-purple-400 bg-purple-500/20";
      case "legendary":
        return "text-yellow-400 bg-yellow-500/20";
      default:
        return "text-gray-300 bg-gray-800/50";
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "Commun";
      case "uncommon":
        return "Peu commun";
      case "rare":
        return "Rare";
      case "epic":
        return "Épique";
      case "legendary":
        return "Légendaire";
      default:
        return "Commun";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-card rounded-xl p-4 cursor-pointer relative ${
        !isUnlocked ? "opacity-60 grayscale" : ""
      }`}
      onClick={onClick}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          NOUVEAU
        </div>
      )}

      <div className="flex items-center mb-3">
        <div
          className={`p-3 rounded-lg mr-3 ${getRarityColor(
            achievement.rarity
          )}`}
        >
          {getIcon(achievement.icon)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-200">
            {achievement.title}
          </h3>
          <div className="flex items-center">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRarityColor(
                achievement.rarity
              )}`}
            >
              {getRarityLabel(achievement.rarity)}
            </span>
            <span className="text-xs text-gray-400 ml-2">
              {achievement.points} XP
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-400 text-sm mb-3">{achievement.description}</p>

      {isUnlocked ? (
        <div className="text-xs text-gray-400">
          Débloqué le{" "}
          {achievement.unlockedAt
            ? new Date(achievement.unlockedAt).toLocaleDateString()
            : ""}
        </div>
      ) : achievement.progress !== undefined ? (
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Progression</span>
            <span>{achievement.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-purple-600 h-1.5 rounded-full"
              style={{ width: `${achievement.progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="text-xs text-gray-400">Non débloqué</div>
      )}
    </motion.div>
  );
};

export default AchievementCard;
