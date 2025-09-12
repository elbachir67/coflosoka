import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../config/api";
import { toast } from "react-hot-toast";

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

interface XPGain {
  xpGained: number;
  reason: string;
  leveledUp: boolean;
  newLevel?: number;
}

interface GamificationContextType {
  profile: GamificationProfile | null;
  loading: boolean;
  rewardAction: (
    action: string,
    additionalParams?: any
  ) => Promise<XPGain | null>;
  refreshProfile: () => Promise<void>;
  showLevelUp: boolean;
  setShowLevelUp: (show: boolean) => void;
  showXPNotification: boolean;
  setShowXPNotification: (show: boolean) => void;
  lastXPGain: XPGain | null;
  newAchievement: UserAchievement | null;
  setNewAchievement: (achievement: UserAchievement | null) => void;
  markAchievementAsViewed: (achievementId: string) => Promise<void>;
}

export const GamificationContext = createContext<
  GamificationContextType | undefined
>(undefined);

export function GamificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<GamificationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showXPNotification, setShowXPNotification] = useState(false);
  const [lastXPGain, setLastXPGain] = useState<XPGain | null>(null);
  const [newAchievement, setNewAchievement] = useState<UserAchievement | null>(
    null
  );

  useEffect(() => {
    if (isAuthenticated) {
      fetchGamificationProfile();
    }
  }, [isAuthenticated]);

  const fetchGamificationProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response = await fetch(`${api.API_URL}/api/gamification/profile`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement du profil de gamification");
      }

      const data = await response.json();
      setProfile(data);

      // Vérifier s'il y a de nouveaux achievements
      if (data.newAchievements && data.newAchievements.length > 0) {
        setNewAchievement(data.newAchievements[0]);
      }
    } catch (error) {
      console.error("Error fetching gamification profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const rewardAction = async (action: string, additionalParams = {}) => {
    if (!user) return null;

    try {
      const response = await fetch(`${api.API_URL}/api/gamification/reward`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, additionalParams }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la récompense de l'action");
      }

      const data = await response.json();

      // Mettre à jour le profil avec les nouvelles données
      if (profile) {
        setProfile({
          ...profile,
          level: data.leveledUp ? data.newLevel : profile.level,
          currentXP: data.currentXP,
          requiredXP: data.requiredXP,
          totalXP: data.totalXP,
          rank: data.rank,
        });
      }

      // Afficher la notification XP
      setLastXPGain({
        xpGained: data.xpGained,
        reason: data.reason,
        leveledUp: data.leveledUp,
        newLevel: data.newLevel,
      });
      setShowXPNotification(true);

      // Si l'utilisateur a monté de niveau, afficher la modal
      if (data.leveledUp) {
        setShowLevelUp(true);
      }

      // Rafraîchir le profil pour vérifier les nouveaux achievements
      await fetchGamificationProfile();

      return data;
    } catch (error) {
      console.error("Error rewarding action:", error);
      return null;
    }
  };

  const refreshProfile = async () => {
    await fetchGamificationProfile();
  };

  const markAchievementAsViewed = async (achievementId: string) => {
    if (!user) return;

    try {
      await fetch(
        `${api.API_URL}/api/gamification/achievements/${achievementId}/view`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Mettre à jour l'état local
      if (profile) {
        setProfile({
          ...profile,
          newAchievements: profile.newAchievements.filter(
            a => a.achievementId._id !== achievementId
          ),
        });
      }

      setNewAchievement(null);
    } catch (error) {
      console.error("Error marking achievement as viewed:", error);
    }
  };

  return (
    <GamificationContext.Provider
      value={{
        profile,
        loading,
        rewardAction,
        refreshProfile,
        showLevelUp,
        setShowLevelUp,
        showXPNotification,
        setShowXPNotification,
        lastXPGain,
        newAchievement,
        setNewAchievement,
        markAchievementAsViewed,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error(
      "useGamification must be used within a GamificationProvider"
    );
  }
  return context;
}
