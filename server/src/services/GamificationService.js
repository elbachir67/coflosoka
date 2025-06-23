import {
  UserLevel,
  UserAchievement,
  Achievement,
  QuizAttempt,
  Pathway,
} from "../models/index.js";
import { logger } from "../utils/logger.js";

class GamificationService {
  /**
   * Ajoute de l'expérience à un utilisateur et gère les montées de niveau
   */
  static async addExperience(userId, xpAmount, reason) {
    try {
      // Récupérer ou créer le niveau de l'utilisateur
      let userLevel = await UserLevel.findOne({ userId });

      if (!userLevel) {
        userLevel = new UserLevel({
          userId,
          level: 1,
          currentXP: 0,
          requiredXP: 100,
          totalXP: 0,
        });
      }

      // Ajouter l'XP
      userLevel.currentXP += xpAmount;
      userLevel.totalXP += xpAmount;

      // Mettre à jour la date de dernière activité
      userLevel.lastActivityDate = new Date();

      // Vérifier si l'utilisateur monte de niveau
      let leveledUp = false;
      let newLevel = userLevel.level;

      while (userLevel.currentXP >= userLevel.requiredXP) {
        userLevel.currentXP -= userLevel.requiredXP;
        userLevel.level += 1;
        newLevel = userLevel.level;

        // Calculer l'XP requise pour le prochain niveau (formule progressive)
        userLevel.requiredXP = Math.floor(
          100 * Math.pow(1.5, userLevel.level - 1)
        );

        leveledUp = true;
      }

      // Mettre à jour le rang en fonction du niveau
      userLevel.rank = this.calculateRank(userLevel.level);

      // Sauvegarder les changements
      await userLevel.save();

      // Vérifier les achievements liés à l'XP et au niveau
      if (leveledUp) {
        await this.checkLevelAchievements(userId, newLevel);
      }

      // Vérifier les achievements liés à l'XP totale
      await this.checkXPAchievements(userId, userLevel.totalXP);

      // Mettre à jour le streak si nécessaire
      await this.updateStreak(userId);

      return {
        leveledUp,
        newLevel: userLevel.level,
        currentXP: userLevel.currentXP,
        requiredXP: userLevel.requiredXP,
        totalXP: userLevel.totalXP,
        rank: userLevel.rank,
      };
    } catch (error) {
      logger.error(`Error adding experience for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie et met à jour les achievements d'un utilisateur
   */
  static async checkAchievements(userId) {
    try {
      // Récupérer tous les achievements disponibles
      const achievements = await Achievement.find({ isHidden: false });

      // Pour chaque achievement, vérifier s'il est déjà débloqué ou s'il peut être débloqué
      for (const achievement of achievements) {
        // Vérifier si l'utilisateur a déjà cet achievement
        let userAchievement = await UserAchievement.findOne({
          userId,
          achievementId: achievement._id,
        });

        // Si l'achievement n'existe pas encore pour cet utilisateur, le créer
        if (!userAchievement) {
          userAchievement = new UserAchievement({
            userId,
            achievementId: achievement._id,
            progress: 0,
            isCompleted: false,
            isViewed: false,
          });
        }

        // Si l'achievement n'est pas encore complété, vérifier les critères
        if (!userAchievement.isCompleted) {
          const progress = await this.checkAchievementProgress(
            userId,
            achievement
          );
          userAchievement.progress = progress;

          // Si le progrès atteint 100%, marquer comme complété
          if (progress >= 100) {
            userAchievement.isCompleted = true;
            userAchievement.unlockedAt = new Date();

            // Accorder des points d'XP pour l'achievement débloqué
            await this.addExperience(
              userId,
              achievement.points,
              `Achievement débloqué: ${achievement.title}`
            );
          }

          await userAchievement.save();
        }
      }

      // Retourner les achievements débloqués mais non vus
      return await UserAchievement.find({
        userId,
        isCompleted: true,
        isViewed: false,
      }).populate("achievementId");
    } catch (error) {
      logger.error(`Error checking achievements for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie le progrès d'un achievement spécifique
   */
  static async checkAchievementProgress(userId, achievement) {
    try {
      const { criteria } = achievement;

      switch (criteria.type) {
        case "complete_modules": {
          // Compter les modules complétés
          const pathways = await Pathway.find({ userId });
          let completedModules = 0;

          pathways.forEach(pathway => {
            completedModules += pathway.moduleProgress.filter(
              m => m.completed
            ).length;
          });

          return Math.min(100, (completedModules / criteria.threshold) * 100);
        }

        case "complete_pathways": {
          // Compter les parcours complétés
          const completedPathways = await Pathway.countDocuments({
            userId,
            status: "completed",
          });

          return Math.min(100, (completedPathways / criteria.threshold) * 100);
        }

        case "quiz_score": {
          // Vérifier les scores de quiz
          const quizAttempts = await QuizAttempt.find({
            userId,
            completed: true,
          })
            .sort({ score: -1 })
            .limit(5);

          if (quizAttempts.length === 0) return 0;

          const avgScore =
            quizAttempts.reduce((sum, attempt) => sum + attempt.score, 0) /
            quizAttempts.length;

          return Math.min(100, (avgScore / criteria.threshold) * 100);
        }

        case "streak_days": {
          // Vérifier les jours de streak
          const userLevel = await UserLevel.findOne({ userId });
          if (!userLevel) return 0;

          return Math.min(
            100,
            (userLevel.streakDays / criteria.threshold) * 100
          );
        }

        case "resources_completed": {
          // Compter les ressources complétées
          const pathways = await Pathway.find({ userId });
          let completedResources = 0;

          pathways.forEach(pathway => {
            pathway.moduleProgress.forEach(module => {
              completedResources += module.resources.filter(
                r => r.completed
              ).length;
            });
          });

          return Math.min(100, (completedResources / criteria.threshold) * 100);
        }

        case "time_spent": {
          // Calculer le temps passé (en heures)
          const pathways = await Pathway.find({ userId });
          let totalHours = 0;

          pathways.forEach(pathway => {
            const startDate = new Date(pathway.startedAt);
            const lastDate = new Date(pathway.lastAccessedAt);
            const hoursSpent = (lastDate - startDate) / (1000 * 60 * 60);
            totalHours += hoursSpent;
          });

          return Math.min(100, (totalHours / criteria.threshold) * 100);
        }

        default:
          return 0;
      }
    } catch (error) {
      logger.error(`Error checking achievement progress:`, error);
      return 0;
    }
  }

  /**
   * Met à jour le streak de l'utilisateur
   */
  static async updateStreak(userId) {
    try {
      const userLevel = await UserLevel.findOne({ userId });
      if (!userLevel) return;

      const lastActivity = new Date(userLevel.lastActivityDate);
      const today = new Date();

      // Réinitialiser les dates à minuit pour comparer uniquement les jours
      lastActivity.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today - lastActivity);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // L'utilisateur s'est connecté le jour suivant, augmenter le streak
        userLevel.streakDays += 1;
      } else if (diffDays > 1) {
        // L'utilisateur a manqué un jour, réinitialiser le streak
        userLevel.streakDays = 1;
      }
      // Si diffDays === 0, l'utilisateur s'est déjà connecté aujourd'hui, ne rien faire

      userLevel.lastActivityDate = today;
      await userLevel.save();

      // Vérifier les achievements liés au streak
      await this.checkStreakAchievements(userId, userLevel.streakDays);

      return userLevel.streakDays;
    } catch (error) {
      logger.error(`Error updating streak for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Vérifie les achievements liés au niveau
   */
  static async checkLevelAchievements(userId, level) {
    try {
      const levelAchievements = await Achievement.find({
        "criteria.type": "level",
      });

      for (const achievement of levelAchievements) {
        if (level >= achievement.criteria.threshold) {
          let userAchievement = await UserAchievement.findOne({
            userId,
            achievementId: achievement._id,
          });

          if (!userAchievement) {
            userAchievement = new UserAchievement({
              userId,
              achievementId: achievement._id,
            });
          }

          if (!userAchievement.isCompleted) {
            userAchievement.isCompleted = true;
            userAchievement.unlockedAt = new Date();
            userAchievement.progress = 100;
            await userAchievement.save();
          }
        }
      }
    } catch (error) {
      logger.error(`Error checking level achievements:`, error);
    }
  }

  /**
   * Vérifie les achievements liés à l'XP totale
   */
  static async checkXPAchievements(userId, totalXP) {
    try {
      const xpAchievements = await Achievement.find({
        "criteria.type": "total_xp",
      });

      for (const achievement of xpAchievements) {
        if (totalXP >= achievement.criteria.threshold) {
          let userAchievement = await UserAchievement.findOne({
            userId,
            achievementId: achievement._id,
          });

          if (!userAchievement) {
            userAchievement = new UserAchievement({
              userId,
              achievementId: achievement._id,
            });
          }

          if (!userAchievement.isCompleted) {
            userAchievement.isCompleted = true;
            userAchievement.unlockedAt = new Date();
            userAchievement.progress = 100;
            await userAchievement.save();
          }
        }
      }
    } catch (error) {
      logger.error(`Error checking XP achievements:`, error);
    }
  }

  /**
   * Vérifie les achievements liés au streak
   */
  static async checkStreakAchievements(userId, streakDays) {
    try {
      const streakAchievements = await Achievement.find({
        "criteria.type": "streak_days",
      });

      for (const achievement of streakAchievements) {
        if (streakDays >= achievement.criteria.threshold) {
          let userAchievement = await UserAchievement.findOne({
            userId,
            achievementId: achievement._id,
          });

          if (!userAchievement) {
            userAchievement = new UserAchievement({
              userId,
              achievementId: achievement._id,
            });
          }

          if (!userAchievement.isCompleted) {
            userAchievement.isCompleted = true;
            userAchievement.unlockedAt = new Date();
            userAchievement.progress = 100;
            await userAchievement.save();
          }
        }
      }
    } catch (error) {
      logger.error(`Error checking streak achievements:`, error);
    }
  }

  /**
   * Calcule le rang en fonction du niveau
   */
  static calculateRank(level) {
    if (level >= 50) return "Visionnaire";
    if (level >= 40) return "Grand Maître";
    if (level >= 30) return "Maître";
    if (level >= 20) return "Expert";
    if (level >= 15) return "Chercheur";
    if (level >= 10) return "Étudiant";
    if (level >= 5) return "Apprenti";
    return "Novice";
  }

  /**
   * Marque un achievement comme vu
   */
  static async markAchievementAsViewed(userId, achievementId) {
    try {
      const userAchievement = await UserAchievement.findOne({
        userId,
        achievementId,
      });

      if (userAchievement) {
        userAchievement.isViewed = true;
        await userAchievement.save();
      }

      return true;
    } catch (error) {
      logger.error(`Error marking achievement as viewed:`, error);
      return false;
    }
  }

  /**
   * Récupère le niveau et les achievements d'un utilisateur
   */
  static async getUserGamificationData(userId) {
    try {
      // Récupérer le niveau de l'utilisateur
      let userLevel = await UserLevel.findOne({ userId });

      if (!userLevel) {
        userLevel = new UserLevel({
          userId,
          level: 1,
          currentXP: 0,
          requiredXP: 100,
          totalXP: 0,
        });
        await userLevel.save();
      }

      // Récupérer les achievements de l'utilisateur
      const userAchievements = await UserAchievement.find({
        userId,
        isCompleted: true,
      }).populate("achievementId");

      // Récupérer les achievements en cours
      const inProgressAchievements = await UserAchievement.find({
        userId,
        isCompleted: false,
        progress: { $gt: 0 },
      }).populate("achievementId");

      // Récupérer les nouveaux achievements non vus
      const newAchievements = await UserAchievement.find({
        userId,
        isCompleted: true,
        isViewed: false,
      }).populate("achievementId");

      return {
        level: userLevel.level,
        currentXP: userLevel.currentXP,
        requiredXP: userLevel.requiredXP,
        totalXP: userLevel.totalXP,
        rank: userLevel.rank,
        streakDays: userLevel.streakDays,
        achievements: userAchievements,
        inProgressAchievements: inProgressAchievements,
        newAchievements: newAchievements,
      };
    } catch (error) {
      logger.error(`Error getting user gamification data:`, error);
      throw error;
    }
  }

  /**
   * Ajoute de l'XP pour une action spécifique
   */
  static async rewardAction(userId, action, additionalParams = {}) {
    try {
      let xpAmount = 0;
      let reason = "";

      // Définir les récompenses XP pour différentes actions
      switch (action) {
        case "complete_resource":
          xpAmount = 10;
          reason = "Ressource complétée";
          break;

        case "complete_module":
          xpAmount = 50;
          reason = "Module complété";
          break;

        case "complete_quiz":
          // Bonus basé sur le score
          const baseXP = 30;
          const score = additionalParams.score || 0;
          const bonus = Math.floor((score / 100) * 20); // Jusqu'à 20 XP de bonus pour 100%
          xpAmount = baseXP + bonus;
          reason = `Quiz complété avec ${score}%`;
          break;

        case "complete_pathway":
          xpAmount = 200;
          reason = "Parcours d'apprentissage complété";
          break;

        case "daily_login":
          xpAmount = 5;
          reason = "Connexion quotidienne";
          break;

        case "streak_milestone":
          const days = additionalParams.days || 0;
          xpAmount = days * 5; // 5 XP par jour de streak
          reason = `Série de ${days} jours consécutifs`;
          break;

        case "assessment_completion":
          xpAmount = 25;
          reason = "Évaluation complétée";
          break;

        default:
          xpAmount = 1;
          reason = "Action non spécifiée";
      }

      // Ajouter l'XP et vérifier les achievements
      const result = await this.addExperience(userId, xpAmount, reason);
      await this.checkAchievements(userId);

      return {
        ...result,
        xpGained: xpAmount,
        reason,
      };
    } catch (error) {
      logger.error(`Error rewarding action:`, error);
      throw error;
    }
  }
}

export default GamificationService;
