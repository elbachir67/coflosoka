import { Question } from "../types";

interface UserResponse {
  questionId: string;
  selectedOption: string;
  timeSpent: number;
  isCorrect?: boolean;
}

interface CategoryScore {
  category: string;
  score: number;
  confidence: number;
  timeEfficiency: number;
  weakPoints: string[];
  strongPoints: string[];
}

interface ScoringWeights {
  correctness: number;
  timeEfficiency: number;
  difficulty: number;
}

type DifficultyLevel = "basic" | "intermediate" | "advanced";

const WEIGHTS: ScoringWeights = {
  correctness: 0.7, // 70% pour la justesse
  timeEfficiency: 0.2, // 20% pour l'efficacité temporelle
  difficulty: 0.1, // 10% pour la difficulté
};

const DIFFICULTY_MULTIPLIERS: Record<DifficultyLevel, number> = {
  basic: 1.0,
  intermediate: 1.3,
  advanced: 1.6,
};

const TIME_THRESHOLDS: Record<DifficultyLevel, number> = {
  basic: 45, // 45 secondes pour une question basique
  intermediate: 60, // 60 secondes pour une question intermédiaire
  advanced: 90, // 90 secondes pour une question avancée
};

/**
 * Calcule le score d'une question individuelle
 */
function calculateQuestionScore(
  question: Question,
  response: UserResponse & { isCorrect: boolean }
) {
  const { isCorrect, timeSpent } = response;
  const difficulty = (question.difficulty as DifficultyLevel) || "intermediate";

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
    (correctnessScore * WEIGHTS.correctness +
      timeEfficiency * WEIGHTS.timeEfficiency +
      (isCorrect ? (difficultyMultiplier - 1) * WEIGHTS.difficulty : 0)) *
    100;

  return {
    score: Math.max(0, Math.min(100, finalScore)),
    correctnessScore,
    timeEfficiency,
    difficultyBonus: isCorrect
      ? (difficultyMultiplier - 1) * WEIGHTS.difficulty * 100
      : 0,
  };
}

/**
 * Calcule le score global avec le nouveau système
 */
export function calculateDetailedScore(
  questions: Question[],
  userResponses: UserResponse[]
): CategoryScore[] {
  const categoryScores = new Map<string, CategoryScore>();

  // Initialiser les scores par catégorie
  questions.forEach(question => {
    if (!categoryScores.has(question.category)) {
      categoryScores.set(question.category, {
        category: question.category,
        score: 0,
        confidence: 0,
        timeEfficiency: 0,
        weakPoints: [],
        strongPoints: [],
      });
    }
  });

  // Calculer les scores et identifier les points forts/faibles
  userResponses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (!question) return;

    const categoryScore = categoryScores.get(question.category)!;

    // Déterminer si la réponse est correcte
    const isCorrect =
      response.isCorrect !== undefined
        ? response.isCorrect
        : question.options.find(opt => opt.id === response.selectedOption)
            ?.isCorrect || false;

    const scoreDetails = calculateQuestionScore(question, {
      ...response,
      isCorrect,
    });

    categoryScore.score += scoreDetails.score;
    categoryScore.confidence += scoreDetails.correctnessScore;
    categoryScore.timeEfficiency += scoreDetails.timeEfficiency;

    // Identifier les points forts et faibles basés sur la performance
    if (scoreDetails.score > 70) {
      categoryScore.strongPoints.push(question.text.substring(0, 50) + "...");
    } else if (scoreDetails.score < 40) {
      categoryScore.weakPoints.push(question.text.substring(0, 50) + "...");
    }
  });

  // Normaliser les scores
  return Array.from(categoryScores.values()).map(score => {
    const questionCount = userResponses.filter(
      r =>
        questions.find(q => q.id === r.questionId)?.category === score.category
    ).length;

    return {
      ...score,
      score: questionCount > 0 ? Math.round(score.score / questionCount) : 0,
      confidence:
        questionCount > 0
          ? Math.round((score.confidence / questionCount) * 100)
          : 0,
      timeEfficiency:
        questionCount > 0
          ? Math.round((score.timeEfficiency / questionCount) * 100)
          : 0,
      weakPoints: Array.from(new Set(score.weakPoints)),
      strongPoints: Array.from(new Set(score.strongPoints)),
    };
  });
}

/**
 * Génère des recommandations basées sur les performances
 */
export function generateRecommendations(
  categoryScores: CategoryScore[],
  userProfile: {
    mathLevel: string;
    programmingLevel: string;
    domain: string;
  }
): AssessmentResult[] {
  return categoryScores.map(categoryScore => {
    const { category, score, weakPoints, strongPoints } = categoryScore;
    const level = determineLevel(score);

    return {
      category,
      level,
      score,
      recommendations: generateCategoryRecommendations(
        category,
        level,
        score,
        weakPoints,
        strongPoints,
        userProfile
      ),
    };
  });
}

function determineLevel(score: number): string {
  if (score >= 85) return "expert";
  if (score >= 70) return "advanced";
  if (score >= 50) return "intermediate";
  return "beginner";
}

function generateCategoryRecommendations(
  category: string,
  level: string,
  score: number,
  weakPoints: string[],
  strongPoints: string[],
  userProfile: {
    mathLevel: string;
    programmingLevel: string;
    domain: string;
  }
): string[] {
  const recommendations: string[] = [];

  // Recommandations basées sur les points faibles
  if (weakPoints.length > 0) {
    recommendations.push(
      `Concentrez-vous sur les concepts où vous avez eu des difficultés`
    );
  }

  // Recommandations basées sur le score
  if (score < 50) {
    recommendations.push(
      "Révisez les concepts fondamentaux avant de passer aux sujets avancés",
      "Pratiquez avec des exercices de base pour renforcer vos connaissances"
    );
  } else if (score < 70) {
    recommendations.push(
      "Approfondissez vos connaissances avec des projets pratiques",
      "Travaillez sur la rapidité de résolution des problèmes"
    );
  } else {
    recommendations.push(
      "Excellentes performances ! Vous pouvez aborder des sujets plus avancés",
      "Partagez vos connaissances en aidant d'autres apprenants"
    );
  }

  // Recommandations spécifiques à la catégorie
  switch (category) {
    case "math":
      if (score < 70) {
        recommendations.push(
          "Utilisez des ressources visuelles pour mieux comprendre les concepts mathématiques",
          "Pratiquez régulièrement avec des exercices variés"
        );
      }
      break;
    case "programming":
      if (score < 70) {
        recommendations.push(
          "Implémentez les algorithmes de base pour mieux les comprendre",
          "Participez à des défis de programmation pour améliorer vos compétences"
        );
      }
      break;
    case "ml":
      if (score < 70) {
        recommendations.push(
          "Commencez par des datasets simples et bien documentés",
          "Maîtrisez les concepts théoriques avant de passer à l'implémentation"
        );
      }
      break;
  }

  return recommendations;
}

interface AssessmentResult {
  category: string;
  level: string;
  score: number;
  recommendations: string[];
}
