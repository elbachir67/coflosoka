/**
 * Système de scoring avancé pour les évaluations et quiz
 */

// Poids pour le calcul du score
const SCORING_WEIGHTS = {
  correctness: 0.7, // 70% pour la justesse de la réponse
  timeEfficiency: 0.2, // 20% pour l'efficacité temporelle
  difficulty: 0.1, // 10% pour la difficulté de la question
};

// Temps de référence par difficulté (en secondes)
const TIME_THRESHOLDS = {
  basic: 45,
  intermediate: 60,
  advanced: 90,
};

// Multiplicateurs de difficulté
const DIFFICULTY_MULTIPLIERS = {
  basic: 1.0,
  intermediate: 1.3,
  advanced: 1.6,
};

/**
 * Calcule le score d'une réponse individuelle
 */
export function calculateQuestionScore(question, response) {
  const { isCorrect, timeSpent } = response;
  const difficulty = question.difficulty || "intermediate";

  // Score de base (correct/incorrect)
  const correctnessScore = isCorrect ? 1 : 0;

  // Score d'efficacité temporelle
  const timeThreshold = TIME_THRESHOLDS[difficulty];
  const timeEfficiency = Math.max(
    0,
    Math.min(1, (timeThreshold - timeSpent) / timeThreshold + 0.5)
  );

  // Multiplicateur de difficulté
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[difficulty];

  // Score final pondéré
  const finalScore =
    (correctnessScore * SCORING_WEIGHTS.correctness +
      timeEfficiency * SCORING_WEIGHTS.timeEfficiency +
      (isCorrect ? difficultyMultiplier - 1 : 0) * SCORING_WEIGHTS.difficulty) *
    100;

  return {
    score: Math.max(0, Math.min(100, finalScore)),
    correctnessScore,
    timeEfficiency,
    difficultyBonus: isCorrect
      ? (difficultyMultiplier - 1) * SCORING_WEIGHTS.difficulty * 100
      : 0,
  };
}

/**
 * Calcule le score global d'une évaluation
 */
export function calculateOverallScore(questions, responses) {
  if (!questions.length || !responses.length) return 0;

  let totalScore = 0;
  let totalWeight = 0;

  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (question) {
      const questionScore = calculateQuestionScore(question, response);
      const weight =
        DIFFICULTY_MULTIPLIERS[question.difficulty || "intermediate"];

      totalScore += questionScore.score * weight;
      totalWeight += weight;
    }
  });

  return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
}

/**
 * Analyse détaillée des performances par catégorie
 */
export function analyzePerformanceByCategory(questions, responses) {
  const categoryStats = {};

  responses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (!question) return;

    const category = question.category;
    if (!categoryStats[category]) {
      categoryStats[category] = {
        totalQuestions: 0,
        correctAnswers: 0,
        totalTime: 0,
        scores: [],
        difficulties: [],
      };
    }

    const stats = categoryStats[category];
    const questionScore = calculateQuestionScore(question, response);

    stats.totalQuestions++;
    stats.correctAnswers += response.isCorrect ? 1 : 0;
    stats.totalTime += response.timeSpent;
    stats.scores.push(questionScore.score);
    stats.difficulties.push(question.difficulty);
  });

  // Calculer les métriques finales
  Object.keys(categoryStats).forEach(category => {
    const stats = categoryStats[category];
    stats.accuracy = (stats.correctAnswers / stats.totalQuestions) * 100;
    stats.averageTime = stats.totalTime / stats.totalQuestions;
    stats.averageScore =
      stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length;
    stats.level = determineLevel(stats.averageScore);
  });

  return categoryStats;
}

/**
 * Détermine le niveau basé sur le score
 */
function determineLevel(score) {
  if (score >= 85) return "expert";
  if (score >= 70) return "advanced";
  if (score >= 50) return "intermediate";
  return "beginner";
}

/**
 * Génère des recommandations personnalisées
 */
export function generatePersonalizedRecommendations(
  categoryStats,
  userProfile
) {
  const recommendations = [];

  Object.entries(categoryStats).forEach(([category, stats]) => {
    if (stats.accuracy < 60) {
      recommendations.push({
        type: "review",
        category,
        priority: "high",
        message: `Révisez les concepts fondamentaux en ${category} (${Math.round(
          stats.accuracy
        )}% de réussite)`,
      });
    } else if (stats.accuracy < 80) {
      recommendations.push({
        type: "practice",
        category,
        priority: "medium",
        message: `Pratiquez davantage en ${category} pour améliorer vos performances`,
      });
    }

    if (stats.averageTime > TIME_THRESHOLDS.intermediate) {
      recommendations.push({
        type: "speed",
        category,
        priority: "medium",
        message: `Travaillez votre rapidité en ${category} (temps moyen: ${Math.round(
          stats.averageTime
        )}s)`,
      });
    }
  });

  return recommendations;
}
