import { Goal } from "../models/LearningGoal.js";
import { Concept } from "../models/Concept.js";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { logger } from "../utils/logger.js";

class PathwayGenerationService {
  /**
   * Génère un parcours personnalisé pour un apprenant
   */
  static async generatePathway(userId, goalId) {
    try {
      // Récupérer le profil de l'apprenant et l'objectif
      const [profile, goal] = await Promise.all([
        LearnerProfile.findOne({ userId }),
        Goal.findById(goalId).populate("requiredConcepts"),
      ]);

      if (!profile || !goal) {
        throw new Error("Profil ou objectif non trouvé");
      }

      // Vérifier les prérequis
      const prerequisites = await PathwayGenerationService.checkPrerequisites(
        profile,
        goal
      );

      // Calculer la charge cognitive optimale
      const cognitiveLoad =
        PathwayGenerationService.calculateOptimalCognitiveLoad(profile);

      // Adapter les modules selon le profil et la charge cognitive
      const adaptedModules = PathwayGenerationService.adaptModules(
        goal.modules,
        profile,
        prerequisites,
        cognitiveLoad
      );

      // Générer les recommandations initiales
      const recommendations =
        PathwayGenerationService.generateInitialRecommendations(
          profile,
          goal,
          cognitiveLoad
        );

      // Estimer les ressources nécessaires
      const resourceEstimation =
        PathwayGenerationService.estimateRequiredResources(
          adaptedModules,
          profile
        );

      // Créer le nouveau parcours
      const pathway = {
        userId,
        goalId,
        status: "active",
        progress: 0,
        currentModule: 0,
        moduleProgress: adaptedModules.map((module, index) => ({
          moduleIndex: index,
          completed: false,
          locked: index !== 0, // Premier module déverrouillé
          resources: module.resources.map(resource => ({
            resourceId: resource._id || resource.id,
            completed: false,
          })),
          quiz: {
            completed: false,
            score: null,
            completedAt: null,
          },
        })),
        startedAt: new Date(),
        lastAccessedAt: new Date(),
        estimatedCompletionDate:
          PathwayGenerationService.calculateEstimatedCompletionDate(
            adaptedModules,
            profile
          ),
        adaptiveRecommendations: recommendations.map(rec => ({
          ...rec,
          status: "pending",
        })),
      };

      return pathway;
    } catch (error) {
      logger.error("Error generating pathway:", error);
      throw error;
    }
  }

  /**
   * Vérifie les prérequis pour un objectif donné
   */
  static async checkPrerequisites(profile, goal) {
    const prerequisites = {
      met: [],
      missing: [],
    };

    // Vérifier les prérequis mathématiques
    const mathPrereqs = goal.prerequisites.filter(
      p => p.category.toLowerCase() === "math"
    );

    mathPrereqs.forEach(prereq => {
      const hasRequiredLevel = PathwayGenerationService.checkSkillLevel(
        profile.preferences.mathLevel,
        prereq.skills
      );
      if (hasRequiredLevel) {
        prerequisites.met.push(prereq);
      } else {
        prerequisites.missing.push(prereq);
      }
    });

    // Vérifier les prérequis en programmation
    const progPrereqs = goal.prerequisites.filter(
      p => p.category.toLowerCase() === "programming"
    );

    progPrereqs.forEach(prereq => {
      const hasRequiredLevel = PathwayGenerationService.checkSkillLevel(
        profile.preferences.programmingLevel,
        prereq.skills
      );
      if (hasRequiredLevel) {
        prerequisites.met.push(prereq);
      } else {
        prerequisites.missing.push(prereq);
      }
    });

    return prerequisites;
  }

  /**
   * Vérifie si le niveau de compétence est suffisant
   */
  static checkSkillLevel(userLevel, requiredSkills) {
    const levels = ["beginner", "intermediate", "advanced", "expert"];
    const userLevelIndex = levels.indexOf(userLevel);

    return requiredSkills.every(skill => {
      const requiredLevelIndex = levels.indexOf(skill.level);
      return userLevelIndex >= requiredLevelIndex;
    });
  }

  /**
   * Calcule la charge cognitive optimale pour l'apprenant
   */
  static calculateOptimalCognitiveLoad(profile) {
    // Analyser l'historique d'apprentissage
    const learningHistory = profile.assessments || [];

    // Calculer la vitesse moyenne d'apprentissage
    const learningSpeed =
      PathwayGenerationService.calculateLearningSpeed(learningHistory);

    // Calculer le taux de rétention
    const retentionRate =
      PathwayGenerationService.calculateRetentionRate(learningHistory);

    // Déterminer la charge cognitive optimale
    return {
      contentPerStep: PathwayGenerationService.determineOptimalContentAmount(
        learningSpeed,
        retentionRate
      ),
      practiceFrequency:
        PathwayGenerationService.determineOptimalPracticeFrequency(
          retentionRate
        ),
      breakFrequency:
        PathwayGenerationService.determineOptimalBreakFrequency(learningSpeed),
    };
  }

  /**
   * Adapte les modules selon le profil et la charge cognitive
   */
  static adaptModules(modules, profile, prerequisites, cognitiveLoad) {
    return modules.map(module => {
      // Adapter la durée selon la vitesse d'apprentissage
      const adaptedDuration = PathwayGenerationService.adaptModuleDuration(
        module.duration,
        profile,
        cognitiveLoad
      );

      // Filtrer et réorganiser les ressources
      const adaptedResources = PathwayGenerationService.adaptResources(
        module.resources,
        profile,
        cognitiveLoad
      );

      return {
        ...module,
        duration: adaptedDuration,
        resources: adaptedResources,
      };
    });
  }

  /**
   * Adapte la durée d'un module
   */
  static adaptModuleDuration(baseDuration, profile, cognitiveLoad) {
    const speedMultiplier =
      {
        fast: 0.8,
        medium: 1,
        slow: 1.2,
      }[cognitiveLoad.learningSpeed] || 1;

    return Math.round(baseDuration * speedMultiplier);
  }

  /**
   * Adapte les ressources selon le profil
   */
  static adaptResources(resources, profile, cognitiveLoad) {
    // Filtrer les ressources selon le style d'apprentissage
    let adaptedResources = resources.filter(resource =>
      PathwayGenerationService.isResourceCompatible(resource, profile)
    );

    // Limiter le nombre de ressources selon la charge cognitive
    adaptedResources = adaptedResources.slice(0, cognitiveLoad.contentPerStep);

    // Trier les ressources par pertinence
    return adaptedResources.sort(
      (a, b) =>
        PathwayGenerationService.calculateResourceRelevance(b, profile) -
        PathwayGenerationService.calculateResourceRelevance(a, profile)
    );
  }

  /**
   * Vérifie si une ressource est compatible avec le profil
   */
  static isResourceCompatible(resource, profile) {
    // Vérifier le type de ressource selon le style d'apprentissage
    const learningStyle = profile.learningStyle || "visual";
    const compatibleTypes = {
      visual: ["video", "article"],
      auditory: ["video", "course"],
      reading: ["article", "book"],
      kinesthetic: ["use_case", "course"],
    };

    return compatibleTypes[learningStyle].includes(resource.type);
  }

  /**
   * Calcule la pertinence d'une ressource
   */
  static calculateResourceRelevance(resource, profile) {
    let score = 0;

    // Points pour le type de ressource préféré
    if (
      resource.type ===
      PathwayGenerationService.getPreferredResourceType(profile)
    ) {
      score += 3;
    }

    // Points pour le niveau approprié
    if (resource.level === profile.preferences?.mathLevel) {
      score += 2;
    }

    return score;
  }

  /**
   * Détermine le type de ressource préféré
   */
  static getPreferredResourceType(profile) {
    const styleToType = {
      visual: "video",
      auditory: "video",
      reading: "article",
      kinesthetic: "use_case",
    };

    return styleToType[profile.learningStyle] || "article";
  }

  /**
   * Génère les recommandations initiales
   */
  static generateInitialRecommendations(profile, goal, cognitiveLoad) {
    const recommendations = [];

    // Recommandations basées sur les prérequis manquants
    if (goal.prerequisites?.length > 0) {
      recommendations.push({
        type: "review",
        description: "Réviser les prérequis essentiels",
        priority: "high",
      });
    }

    // Recommandations basées sur le style d'apprentissage
    recommendations.push({
      type: "resource",
      description: `Ressources adaptées à votre style d'apprentissage ${profile.learningStyle}`,
      priority: "medium",
    });

    // Recommandations basées sur la charge cognitive
    if (cognitiveLoad.practiceFrequency === "high") {
      recommendations.push({
        type: "practice",
        description: "Exercices pratiques fréquents recommandés",
        priority: "high",
      });
    }

    return recommendations;
  }

  /**
   * Estime les ressources nécessaires pour le parcours
   */
  static estimateRequiredResources(modules, profile) {
    let totalTime = 0;
    let requiredResources = {
      free: [],
      premium: [],
    };

    modules.forEach(module => {
      // Estimer le temps nécessaire selon le profil
      const timeMultiplier = PathwayGenerationService.calculateTimeMultiplier(
        module,
        profile
      );
      totalTime += module.duration * timeMultiplier;

      // Catégoriser les ressources
      module.resources.forEach(resource => {
        if (resource.isPremium) {
          requiredResources.premium.push(resource);
        } else {
          requiredResources.free.push(resource);
        }
      });
    });

    return {
      estimatedTime: totalTime,
      resources: requiredResources,
      recommendedSchedule: PathwayGenerationService.generateRecommendedSchedule(
        totalTime,
        profile
      ),
    };
  }

  /**
   * Calcule le multiplicateur de temps selon le profil
   */
  static calculateTimeMultiplier(module, profile) {
    const baseMultiplier =
      {
        beginner: 1.3,
        intermediate: 1,
        advanced: 0.8,
      }[profile.preferences.mathLevel] || 1;

    // Ajuster selon l'historique des performances
    const performanceAdjustment =
      PathwayGenerationService.calculatePerformanceAdjustment(
        module.category,
        profile
      );

    return baseMultiplier * performanceAdjustment;
  }

  /**
   * Calcule l'ajustement basé sur les performances
   */
  static calculatePerformanceAdjustment(category, profile) {
    const relevantAssessments = profile.assessments.filter(
      a => a.category === category
    );

    if (!relevantAssessments.length) return 1;

    const averageScore =
      relevantAssessments.reduce((sum, a) => sum + a.score, 0) /
      relevantAssessments.length;

    if (averageScore > 85) return 0.8; // Excellent - accélérer
    if (averageScore < 60) return 1.2; // Difficultés - ralentir
    return 1;
  }

  /**
   * Génère un planning recommandé
   */
  static generateRecommendedSchedule(totalTime, profile) {
    const hoursPerWeek =
      PathwayGenerationService.estimateAvailableHours(profile);
    const weeksNeeded = Math.ceil(totalTime / hoursPerWeek);

    return {
      weeksNeeded,
      hoursPerWeek,
      recommendedSessions: PathwayGenerationService.generateSessionPlan(
        hoursPerWeek,
        profile
      ),
    };
  }

  /**
   * Calcule la date estimée de fin
   */
  static calculateEstimatedCompletionDate(modules, profile) {
    const totalHours = modules.reduce(
      (sum, module) => sum + module.duration,
      0
    );
    const hoursPerWeek =
      PathwayGenerationService.estimateAvailableHours(profile);
    const weeksNeeded = Math.ceil(totalHours / hoursPerWeek);

    const completionDate = new Date();
    completionDate.setDate(completionDate.getDate() + weeksNeeded * 7);

    return completionDate;
  }

  /**
   * Estime les heures disponibles par semaine
   */
  static estimateAvailableHours(profile) {
    // Par défaut 10h/semaine, ajuster selon le profil
    const baseHours = 10;

    // Ajuster selon l'historique d'engagement
    const engagementMultiplier =
      PathwayGenerationService.calculateEngagementMultiplier(profile);

    return Math.round(baseHours * engagementMultiplier);
  }

  /**
   * Calcule le multiplicateur d'engagement
   */
  static calculateEngagementMultiplier(profile) {
    if (!profile.assessments.length) return 1;

    // Analyser la régularité des sessions
    const sessionRegularity =
      PathwayGenerationService.analyzeSessionRegularity(profile);

    if (sessionRegularity > 0.8) return 1.2; // Très régulier
    if (sessionRegularity < 0.4) return 0.8; // Peu régulier
    return 1;
  }

  /**
   * Analyse la régularité des sessions
   */
  static analyzeSessionRegularity(profile) {
    const sessions = profile.assessments.map(a => new Date(a.completedAt));
    if (sessions.length < 2) return 1;

    sessions.sort((a, b) => a - b);

    // Calculer les intervalles entre sessions
    const intervals = [];
    for (let i = 1; i < sessions.length; i++) {
      intervals.push(sessions[i] - sessions[i - 1]);
    }

    // Calculer la variance des intervalles
    const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    const variance =
      intervals.reduce((sum, interval) => {
        return sum + Math.pow(interval - avgInterval, 2);
      }, 0) / intervals.length;

    // Normaliser la régularité (0-1)
    return 1 / (1 + Math.sqrt(variance) / avgInterval);
  }

  /**
   * Génère un plan de sessions recommandé
   */
  static generateSessionPlan(hoursPerWeek, profile) {
    const sessionsPerWeek = Math.ceil(hoursPerWeek / 2); // Max 2h par session
    const sessions = [];

    for (let i = 0; i < sessionsPerWeek; i++) {
      sessions.push({
        duration: 120, // minutes
        type: i % 2 === 0 ? "learning" : "practice",
        intensity: PathwayGenerationService.determineOptimalIntensity(profile),
      });
    }

    return sessions;
  }

  /**
   * Détermine l'intensité optimale des sessions
   */
  static determineOptimalIntensity(profile) {
    const recentAssessments = profile.assessments
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
      .slice(0, 3);

    if (!recentAssessments.length) return "medium";

    const averageScore =
      recentAssessments.reduce((sum, a) => sum + a.score, 0) /
      recentAssessments.length;

    if (averageScore > 85) return "high";
    if (averageScore < 60) return "low";
    return "medium";
  }

  /**
   * Calcule la vitesse d'apprentissage basée sur l'historique
   */
  static calculateLearningSpeed(history) {
    if (!history.length) return "medium";

    const completionTimes = history.map(assessment => {
      return {
        timeSpent: assessment.responses.reduce(
          (sum, r) => sum + r.timeSpent,
          0
        ),
        score: assessment.score,
      };
    });

    const averageTimePerPoint =
      completionTimes.reduce((sum, item) => {
        return sum + item.timeSpent / item.score;
      }, 0) / completionTimes.length;

    if (averageTimePerPoint < 30) return "fast";
    if (averageTimePerPoint > 60) return "slow";
    return "medium";
  }

  /**
   * Calcule le taux de rétention basé sur l'historique
   */
  static calculateRetentionRate(history) {
    if (!history.length) return 0.7; // Taux par défaut

    const assessmentsByTopic = {};
    history.forEach(assessment => {
      if (!assessmentsByTopic[assessment.category]) {
        assessmentsByTopic[assessment.category] = [];
      }
      assessmentsByTopic[assessment.category].push(assessment);
    });

    let totalRetention = 0;
    let topicCount = 0;

    Object.values(assessmentsByTopic).forEach(assessments => {
      if (assessments.length > 1) {
        const sorted = assessments.sort(
          (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        );
        const retention = sorted[0].score / sorted[1].score;
        totalRetention += retention;
        topicCount++;
      }
    });

    return topicCount > 0 ? totalRetention / topicCount : 0.7;
  }

  /**
   * Détermine la quantité optimale de contenu par étape
   */
  static determineOptimalContentAmount(learningSpeed, retentionRate) {
    const baseAmount =
      {
        fast: 5,
        medium: 3,
        slow: 2,
      }[learningSpeed] || 3;

    return Math.round(baseAmount * retentionRate);
  }

  /**
   * Détermine la fréquence optimale des exercices pratiques
   */
  static determineOptimalPracticeFrequency(retentionRate) {
    if (retentionRate < 0.6) return "high"; // Pratique après chaque concept
    if (retentionRate < 0.8) return "medium"; // Pratique après 2-3 concepts
    return "low"; // Pratique après chaque module
  }

  /**
   * Détermine la fréquence optimale des pauses
   */
  static determineOptimalBreakFrequency(learningSpeed) {
    return (
      {
        fast: 45, // minutes
        medium: 30,
        slow: 20,
      }[learningSpeed] || 30
    );
  }
}

export default PathwayGenerationService;
