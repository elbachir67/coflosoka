import { LearnerProfile } from "../models/LearnerProfile.js";
import { Pathway } from "../models/Pathway.js";
import { Goal } from "../models/LearningGoal.js";
import { QuizAttempt } from "../models/QuizAttempt.js";
import { logger } from "../utils/logger.js";

class AIRecommendationService {
  /**
   * Génère des recommandations basées sur l'IA avancée
   */
  static async generateSmartRecommendations(userId) {
    try {
      const profile = await LearnerProfile.findOne({ userId }).populate("goal");
      const pathways = await Pathway.find({ userId }).populate("goalId");
      const quizAttempts = await QuizAttempt.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      // Analyser les patterns d'apprentissage
      const learningPatterns = this.analyzeLearningPatterns(
        profile,
        pathways,
        quizAttempts
      );

      // Prédire les performances futures
      const performancePrediction = this.predictPerformance(learningPatterns);

      // Générer des recommandations personnalisées
      const recommendations = await this.generatePersonalizedRecommendations(
        profile,
        learningPatterns,
        performancePrediction
      );

      // Recommandations adaptatives basées sur le contexte
      const adaptiveRecommendations = this.generateAdaptiveRecommendations(
        learningPatterns,
        performancePrediction
      );

      return {
        recommendations,
        adaptiveRecommendations,
        learningPatterns,
        performancePrediction,
        insights: this.generateLearningInsights(learningPatterns),
      };
    } catch (error) {
      logger.error("Error generating AI recommendations:", error);
      throw error;
    }
  }

  /**
   * Analyse avancée des patterns d'apprentissage
   */
  static analyzeLearningPatterns(profile, pathways, quizAttempts) {
    const patterns = {
      learningVelocity: 0,
      consistencyScore: 0,
      difficultyProgression: [],
      topicAffinities: {},
      strugglingAreas: [],
      strengths: [],
      timePatterns: {
        preferredHours: [],
        sessionDuration: 0,
        frequency: 0,
      },
      cognitiveLoad: {
        optimal: 0,
        current: 0,
        recommendation: "maintain",
      },
      retentionRate: 0,
      engagementLevel: 0,
    };

    // Analyser la vélocité d'apprentissage
    if (pathways.length > 0) {
      const totalProgress = pathways.reduce(
        (sum, pathway) => sum + pathway.progress,
        0
      );
      const avgProgress = totalProgress / pathways.length;
      const timeSpent = pathways.reduce((sum, pathway) => {
        const startDate = new Date(pathway.startedAt);
        const lastDate = new Date(pathway.lastAccessedAt);
        return sum + (lastDate - startDate) / (1000 * 60 * 60 * 24); // jours
      }, 0);

      patterns.learningVelocity = timeSpent > 0 ? avgProgress / timeSpent : 0;
    }

    // Analyser la consistance
    patterns.consistencyScore = this.calculateConsistencyScore(pathways);

    // Analyser les affinités par sujet
    patterns.topicAffinities = this.analyzeTopicAffinities(quizAttempts);

    // Identifier les forces et faiblesses
    const { strengths, weaknesses } =
      this.identifyStrengthsWeaknesses(quizAttempts);
    patterns.strengths = strengths;
    patterns.strugglingAreas = weaknesses;

    // Analyser les patterns temporels
    patterns.timePatterns = this.analyzeTimePatterns(pathways, quizAttempts);

    // Calculer la charge cognitive optimale
    patterns.cognitiveLoad = this.calculateOptimalCognitiveLoad(
      profile,
      quizAttempts
    );

    // Calculer le taux de rétention
    patterns.retentionRate = this.calculateRetentionRate(quizAttempts);

    // Calculer le niveau d'engagement
    patterns.engagementLevel = this.calculateEngagementLevel(
      pathways,
      quizAttempts
    );

    return patterns;
  }

  /**
   * Prédiction avancée des performances
   */
  static predictPerformance(patterns) {
    const prediction = {
      successProbability: 0,
      estimatedCompletionTime: 0,
      recommendedDifficulty: "intermediate",
      riskFactors: [],
      opportunities: [],
      nextMilestones: [],
      adaptationNeeds: [],
    };

    // Calculer la probabilité de succès basée sur plusieurs facteurs
    let successScore = 0;

    // Facteur vélocité (30%)
    if (patterns.learningVelocity > 0.8) successScore += 30;
    else if (patterns.learningVelocity > 0.5) successScore += 20;
    else if (patterns.learningVelocity > 0.2) successScore += 10;

    // Facteur consistance (25%)
    successScore += patterns.consistencyScore * 0.25;

    // Facteur engagement (25%)
    successScore += patterns.engagementLevel * 0.25;

    // Facteur rétention (20%)
    successScore += patterns.retentionRate * 0.2;

    prediction.successProbability = Math.min(100, successScore) / 100;

    // Identifier les facteurs de risque
    if (patterns.learningVelocity < 0.3) {
      prediction.riskFactors.push("Vitesse d'apprentissage lente");
    }
    if (patterns.consistencyScore < 0.5) {
      prediction.riskFactors.push("Manque de régularité");
    }
    if (patterns.retentionRate < 0.6) {
      prediction.riskFactors.push("Difficultés de rétention");
    }
    if (patterns.engagementLevel < 0.4) {
      prediction.riskFactors.push("Faible engagement");
    }

    // Identifier les opportunités
    if (patterns.strengths.length > patterns.strugglingAreas.length) {
      prediction.opportunities.push(
        "Exploiter les points forts pour accélérer l'apprentissage"
      );
    }
    if (patterns.cognitiveLoad.current < patterns.cognitiveLoad.optimal) {
      prediction.opportunities.push(
        "Augmenter la charge cognitive pour optimiser l'apprentissage"
      );
    }

    // Recommander le niveau de difficulté
    const avgPerformance =
      Object.values(patterns.topicAffinities).reduce(
        (sum, score) => sum + score,
        0
      ) / Object.keys(patterns.topicAffinities).length || 0;

    if (avgPerformance > 0.8) prediction.recommendedDifficulty = "advanced";
    else if (avgPerformance > 0.6)
      prediction.recommendedDifficulty = "intermediate";
    else prediction.recommendedDifficulty = "beginner";

    return prediction;
  }

  /**
   * Génère des recommandations personnalisées avancées
   */
  static async generatePersonalizedRecommendations(
    profile,
    patterns,
    prediction
  ) {
    const recommendations = [];

    // Recommandations basées sur la vélocité d'apprentissage
    if (patterns.learningVelocity < 0.3) {
      recommendations.push({
        type: "learning_pace",
        title: "Optimiser votre rythme d'apprentissage",
        description:
          "Votre vitesse d'apprentissage pourrait être améliorée. Essayez des sessions plus courtes mais plus fréquentes.",
        priority: "high",
        actions: [
          "Planifier des sessions de 25-30 minutes",
          "Utiliser la technique Pomodoro",
          "Fixer des objectifs quotidiens réalisables",
        ],
        estimatedImpact: "Amélioration de 40% de la rétention",
      });
    }

    // Recommandations basées sur la consistance
    if (patterns.consistencyScore < 0.5) {
      recommendations.push({
        type: "consistency",
        title: "Améliorer la régularité d'apprentissage",
        description:
          "Une pratique plus régulière vous aiderait à progresser plus efficacement.",
        priority: "high",
        actions: [
          "Créer un planning d'étude fixe",
          "Utiliser des rappels quotidiens",
          "Commencer par 15 minutes par jour",
        ],
        estimatedImpact: "Progression 60% plus rapide",
      });
    }

    // Recommandations basées sur les forces
    if (patterns.strengths.length > 0) {
      recommendations.push({
        type: "strength_based",
        title: "Exploiter vos points forts",
        description: `Vous excellez en ${patterns.strengths
          .slice(0, 2)
          .join(" et ")}. Utilisez ces compétences comme levier.`,
        priority: "medium",
        actions: await this.getAdvancedGoalsForCategories(patterns.strengths),
        estimatedImpact: "Confiance accrue et motivation renforcée",
      });
    }

    // Recommandations pour les difficultés
    if (patterns.strugglingAreas.length > 0) {
      recommendations.push({
        type: "improvement",
        title: "Renforcer les bases",
        description: `Concentrez-vous sur ${patterns.strugglingAreas
          .slice(0, 2)
          .join(" et ")} pour solidifier vos fondations.`,
        priority: "high",
        actions: await this.getFoundationalResourcesForCategories(
          patterns.strugglingAreas
        ),
        estimatedImpact: "Réduction de 50% des lacunes identifiées",
      });
    }

    // Recommandations basées sur la charge cognitive
    if (patterns.cognitiveLoad.recommendation === "increase") {
      recommendations.push({
        type: "cognitive_load",
        title: "Augmenter le défi",
        description:
          "Vous pouvez gérer une charge cognitive plus élevée. Il est temps d'augmenter la difficulté.",
        priority: "medium",
        actions: [
          "Aborder des sujets plus complexes",
          "Combiner plusieurs concepts",
          "Prendre des projets plus ambitieux",
        ],
        estimatedImpact: "Accélération de l'apprentissage de 30%",
      });
    }

    // Recommandations temporelles
    if (patterns.timePatterns.preferredHours.length > 0) {
      const bestHours = patterns.timePatterns.preferredHours.slice(0, 2);
      recommendations.push({
        type: "timing",
        title: "Optimiser vos créneaux d'apprentissage",
        description: `Vos meilleures performances sont entre ${bestHours.join(
          "h et "
        )}h.`,
        priority: "low",
        actions: [
          `Planifier les sujets difficiles entre ${bestHours[0]}h et ${
            bestHours[0] + 2
          }h`,
          "Réserver les révisions pour les autres créneaux",
          "Respecter votre rythme circadien",
        ],
        estimatedImpact: "Efficacité accrue de 25%",
      });
    }

    return recommendations;
  }

  /**
   * Génère des recommandations adaptatives en temps réel
   */
  static generateAdaptiveRecommendations(patterns, prediction) {
    const adaptiveRecs = [];

    // Adaptation basée sur la performance récente
    const recentPerformance = this.calculateRecentPerformance(patterns);

    if (recentPerformance < 0.6) {
      adaptiveRecs.push({
        type: "immediate_support",
        title: "Support immédiat recommandé",
        description:
          "Vos performances récentes suggèrent un besoin d'aide supplémentaire.",
        urgency: "high",
        suggestions: [
          "Prendre une pause de 1-2 jours",
          "Réviser les concepts de base",
          "Demander de l'aide sur les forums",
        ],
      });
    }

    // Adaptation basée sur la progression
    if (
      patterns.learningVelocity > 0.8 &&
      prediction.successProbability > 0.8
    ) {
      adaptiveRecs.push({
        type: "acceleration",
        title: "Accélération possible",
        description:
          "Vos excellentes performances permettent d'accélérer le rythme.",
        urgency: "medium",
        suggestions: [
          "Passer aux modules avancés",
          "Prendre des défis supplémentaires",
          "Mentorer d'autres apprenants",
        ],
      });
    }

    return adaptiveRecs;
  }

  /**
   * Génère des insights sur l'apprentissage
   */
  static generateLearningInsights(patterns) {
    const insights = [];

    // Insight sur le style d'apprentissage
    if (patterns.timePatterns.sessionDuration > 60) {
      insights.push({
        type: "learning_style",
        title: "Apprenant marathon",
        description: "Vous préférez les sessions longues et approfondies.",
        recommendation:
          "Continuez avec des sessions de 60-90 minutes avec des pauses régulières.",
      });
    } else if (patterns.timePatterns.sessionDuration < 30) {
      insights.push({
        type: "learning_style",
        title: "Apprenant sprint",
        description: "Vous excellez dans les sessions courtes et intenses.",
        recommendation:
          "Optimisez avec des sessions de 20-25 minutes très focalisées.",
      });
    }

    // Insight sur la progression
    if (patterns.learningVelocity > 0.7) {
      insights.push({
        type: "progression",
        title: "Progression rapide",
        description: "Votre vitesse d'apprentissage est excellente.",
        recommendation:
          "Maintenez ce rythme et envisagez des défis plus complexes.",
      });
    }

    // Insight sur la rétention
    if (patterns.retentionRate > 0.8) {
      insights.push({
        type: "retention",
        title: "Excellente rétention",
        description: "Vous retenez très bien les informations apprises.",
        recommendation:
          "Votre méthode d'apprentissage est efficace, continuez ainsi.",
      });
    }

    return insights;
  }

  // Méthodes utilitaires
  static calculateConsistencyScore(pathways) {
    if (pathways.length === 0) return 0;

    const accessDates = pathways.map(p => new Date(p.lastAccessedAt));
    accessDates.sort((a, b) => a - b);

    if (accessDates.length < 2) return 0.5;

    const intervals = [];
    for (let i = 1; i < accessDates.length; i++) {
      intervals.push(accessDates[i] - accessDates[i - 1]);
    }

    const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
    const variance =
      intervals.reduce((sum, interval) => {
        return sum + Math.pow(interval - avgInterval, 2);
      }, 0) / intervals.length;

    const consistency = 1 / (1 + Math.sqrt(variance) / avgInterval);
    return Math.min(1, Math.max(0, consistency));
  }

  static analyzeTopicAffinities(quizAttempts) {
    const affinities = {};

    quizAttempts.forEach(attempt => {
      const category = attempt.moduleId; // Simplification
      if (!affinities[category]) {
        affinities[category] = { total: 0, scores: [] };
      }
      affinities[category].total += 1;
      affinities[category].scores.push(attempt.score / 100);
    });

    Object.keys(affinities).forEach(category => {
      const scores = affinities[category].scores;
      affinities[category] = scores.reduce((a, b) => a + b) / scores.length;
    });

    return affinities;
  }

  static identifyStrengthsWeaknesses(quizAttempts) {
    const categoryPerformance = {};

    quizAttempts.forEach(attempt => {
      const category = attempt.moduleId;
      if (!categoryPerformance[category]) {
        categoryPerformance[category] = [];
      }
      categoryPerformance[category].push(attempt.score);
    });

    const strengths = [];
    const weaknesses = [];

    Object.entries(categoryPerformance).forEach(([category, scores]) => {
      const avgScore = scores.reduce((a, b) => a + b) / scores.length;
      if (avgScore > 80) {
        strengths.push(category);
      } else if (avgScore < 60) {
        weaknesses.push(category);
      }
    });

    return { strengths, weaknesses };
  }

  static analyzeTimePatterns(pathways, quizAttempts) {
    const patterns = {
      preferredHours: [],
      sessionDuration: 0,
      frequency: 0,
    };

    // Analyser les heures préférées (simulation)
    const hours = [9, 10, 14, 15, 16, 20, 21, 22];
    const hourCounts = {};

    hours.forEach(hour => {
      hourCounts[hour] = Math.floor(Math.random() * 10);
    });

    const sortedHours = Object.entries(hourCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => parseInt(entry[0]));

    patterns.preferredHours = sortedHours.slice(0, 3);

    // Calculer la durée moyenne des sessions (simulation)
    patterns.sessionDuration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes

    // Calculer la fréquence (sessions par semaine)
    patterns.frequency = Math.floor(Math.random() * 5) + 2; // 2-7 sessions par semaine

    return patterns;
  }

  static calculateOptimalCognitiveLoad(profile, quizAttempts) {
    // Simuler une analyse de charge cognitive
    const currentLoad = Math.random() * 0.8 + 0.2; // 0.2-1.0
    const optimalLoad = Math.random() * 0.3 + 0.6; // 0.6-0.9

    let recommendation = "maintain";
    if (currentLoad < optimalLoad - 0.1) {
      recommendation = "increase";
    } else if (currentLoad > optimalLoad + 0.1) {
      recommendation = "decrease";
    }

    return {
      optimal: optimalLoad,
      current: currentLoad,
      recommendation,
    };
  }

  static calculateRetentionRate(quizAttempts) {
    // Simuler un taux de rétention
    return Math.random() * 0.4 + 0.5; // 0.5-0.9
  }

  static calculateEngagementLevel(pathways, quizAttempts) {
    // Simuler un niveau d'engagement
    return Math.random() * 0.6 + 0.3; // 0.3-0.9
  }

  static calculateRecentPerformance(patterns) {
    // Simuler une performance récente
    return Math.random() * 0.8 + 0.2; // 0.2-1.0
  }

  static async getAdvancedGoalsForCategories(categories) {
    try {
      const goals = await Goal.find({
        category: { $in: categories },
        level: "advanced",
      }).limit(3);

      return goals.map(goal => goal.title);
    } catch (error) {
      logger.error("Error fetching advanced goals:", error);
      return [
        "Cours avancé de Machine Learning",
        "Deep Learning spécialisé",
        "Techniques avancées de NLP",
      ];
    }
  }

  static async getFoundationalResourcesForCategories(categories) {
    try {
      const goals = await Goal.find({
        category: { $in: categories },
        level: "beginner",
      }).limit(3);

      return goals.map(goal => goal.title);
    } catch (error) {
      logger.error("Error fetching foundational resources:", error);
      return [
        "Fondamentaux de l'IA",
        "Bases de Python pour l'IA",
        "Introduction aux mathématiques pour l'IA",
      ];
    }
  }

  /**
   * Analyse les patterns d'apprentissage pour un utilisateur spécifique
   */
  static async analyzeLearningPatterns(userId) {
    try {
      const profile = await LearnerProfile.findOne({ userId });
      const pathways = await Pathway.find({ userId }).populate("goalId");
      const quizAttempts = await QuizAttempt.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);

      return this.analyzeLearningPatterns(profile, pathways, quizAttempts);
    } catch (error) {
      logger.error("Error analyzing learning patterns:", error);
      throw error;
    }
  }
}

export default AIRecommendationService;
