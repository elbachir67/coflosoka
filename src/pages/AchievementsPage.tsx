import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  Award,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  Trophy,
  BookOpen,
  Calendar,
  Clock,
  Star,
  Users,
} from "lucide-react";
import { toast } from "react-hot-toast";
import AchievementCard from "../components/AchievementCard";
import ExperienceBar from "../components/ExperienceBar";
import AchievementUnlocked from "../components/AchievementUnlocked";
import Leaderboard from "../components/LeaderBoard";

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

interface UserAchievement {
  _id: string;
  userId: string;
  achievementId: Achievement;
  unlockedAt: Date;
  progress: number;
  isCompleted: boolean;
  isViewed: boolean;
}

interface GamificationProfile {
  level: number;
  currentXP: number;
  requiredXP: number;
  totalXP: number;
  rank: string;
  streakDays: number;
  achievements: UserAchievement[];
  inProgressAchievements: UserAchievement[];
  newAchievements: UserAchievement[];
}

function AchievementsPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAchievement, setSelectedAchievement] =
    useState<UserAchievement | null>(null);

  useEffect(() => {
    fetchGamificationProfile();
  }, []);

  const fetchGamificationProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.API_URL}/api/gamification/profile`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement du profil");
      }

      const data = await response.json();
      setProfile(data);

      // Si des nouveaux achievements sont disponibles, afficher le premier
      if (data.newAchievements && data.newAchievements.length > 0) {
        setSelectedAchievement(data.newAchievements[0]);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors du chargement des achievements");
    } finally {
      setLoading(false);
    }
  };

  const handleAchievementClick = (achievement: UserAchievement) => {
    setSelectedAchievement(achievement);
  };

  const handleCloseAchievement = async () => {
    if (selectedAchievement && !selectedAchievement.isViewed) {
      try {
        // Marquer l'achievement comme vu
        await fetch(
          `${api.API_URL}/api/gamification/achievements/${selectedAchievement.achievementId._id}/view`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Mettre à jour l'état local
        setProfile(prev => {
          if (!prev) return prev;

          return {
            ...prev,
            newAchievements: prev.newAchievements.filter(
              a => a._id !== selectedAchievement._id
            ),
          };
        });
      } catch (error) {
        console.error("Error marking achievement as viewed:", error);
      }
    }

    setSelectedAchievement(null);
  };

  const filterAchievements = (achievements: UserAchievement[]) => {
    return achievements.filter(achievement => {
      const matchesCategory =
        selectedCategory === "all" ||
        achievement.achievementId.category === selectedCategory;
      const matchesSearch =
        achievement.achievementId.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        achievement.achievementId.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement des achievements...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="mb-4">Erreur lors du chargement du profil</p>
        </div>
      </div>
    );
  }

  const unlockedAchievements = filterAchievements(profile.achievements);
  const inProgressAchievements = filterAchievements(
    profile.inProgressAchievements
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Achievements</h1>
        </div>

        {/* Experience Bar */}
        <div className="mb-8">
          <ExperienceBar
            level={profile.level}
            currentXP={profile.currentXP}
            requiredXP={profile.requiredXP}
            rank={profile.rank}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="glass-card p-6 rounded-xl mb-8">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-64">
                  <input
                    type="text"
                    placeholder="Rechercher un achievement..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>

                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="learning">Apprentissage</option>
                  <option value="engagement">Engagement</option>
                  <option value="milestone">Jalons</option>
                  <option value="special">Spécial</option>
                </select>
              </div>
            </div>

            {/* Unlocked Achievements */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
                <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                Achievements débloqués ({unlockedAchievements.length})
              </h2>

              {unlockedAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {unlockedAchievements.map(achievement => (
                    <AchievementCard
                      key={achievement._id}
                      achievement={{
                        ...achievement.achievementId,
                        unlockedAt: achievement.unlockedAt,
                      }}
                      isUnlocked={true}
                      isNew={profile.newAchievements.some(
                        a => a._id === achievement._id
                      )}
                      onClick={() => handleAchievementClick(achievement)}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl p-6 text-center">
                  <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Vous n'avez pas encore débloqué d'achievements.
                  </p>
                </div>
              )}
            </div>

            {/* In Progress Achievements */}
            <div>
              <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
                <Clock className="w-5 h-5 text-blue-400 mr-2" />
                En cours ({inProgressAchievements.length})
              </h2>

              {inProgressAchievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {inProgressAchievements.map(achievement => (
                    <AchievementCard
                      key={achievement._id}
                      achievement={{
                        ...achievement.achievementId,
                        progress: achievement.progress,
                      }}
                      isUnlocked={false}
                      onClick={() => handleAchievementClick(achievement)}
                    />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-xl p-6 text-center">
                  <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">
                    Aucun achievement en cours de progression.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div>
            <Leaderboard />
          </div>
        </div>

        {/* Achievement Unlocked Modal */}
        {selectedAchievement && (
          <AchievementUnlocked
            achievement={selectedAchievement.achievementId}
            onClose={handleCloseAchievement}
          />
        )}
      </div>
    </div>
  );
}

export default AchievementsPage;
