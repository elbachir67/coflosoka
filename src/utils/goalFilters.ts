import { Goal, GoalCategory, GoalDifficulty, UserProfile } from "../types";

export function filterGoalsByUserProfile(
  goals: Goal[],
  profile: UserProfile | null
): { recommended: Goal[]; others: Goal[] } {
  if (!profile) {
    return {
      recommended: [],
      others: goals,
    };
  }

  // Extraire les niveaux depuis preferences ou directement depuis profile
  const mathLevel = profile.preferences?.mathLevel || profile.mathLevel;
  const programmingLevel =
    profile.preferences?.programmingLevel || profile.programmingLevel;
  const preferredDomain =
    profile.preferences?.preferredDomain || profile.domain;

  // Calculer le score de correspondance pour chaque objectif
  const scoredGoals = goals.map(goal => {
    let matchScore = 0;
    let isRecommended = false;

    // Logique de recommandation progressive
    // Si novice en maths -> recommander parcours maths
    if (mathLevel === "beginner" && goal.category === "math") {
      matchScore += 50;
      isRecommended = true;
    }

    // Si novice en programmation -> recommander Python
    if (programmingLevel === "beginner" && goal.category === "programming") {
      matchScore += 45;
      isRecommended = true;
    }

    // Si bases solides -> recommander domaine préféré
    if (mathLevel !== "beginner" && programmingLevel !== "beginner") {
      if (goal.category === preferredDomain) {
        matchScore += 40;
        isRecommended = true;
      }
    }

    // Vérifier les prérequis (25%)
    const hasRequiredSkills =
      goal.prerequisites?.every(prereq => {
        if (prereq.category.toLowerCase().includes("math")) {
          return isLevelSufficient(
            mathLevel,
            getMaxSkillLevelFromNamedSkills(prereq.skills)
          );
        }
        if (prereq.category.toLowerCase().includes("programming")) {
          return isLevelSufficient(
            programmingLevel,
            getMaxSkillLevelFromNamedSkills(prereq.skills)
          );
        }
        return true;
      }) ?? true;

    if (hasRequiredSkills) {
      matchScore += 25;
    } else {
      isRecommended = false;
    }

    // Vérifier le niveau de difficulté (25%)
    const difficultyMatch = getDifficultyMatchScore(
      goal.level,
      mathLevel,
      programmingLevel
    );
    matchScore += difficultyMatch;

    // Un objectif est recommandé s'il a un score > 60
    isRecommended = isRecommended && matchScore > 70;

    return {
      ...goal,
      matchScore,
      isRecommended,
    };
  });

  // Trier les objectifs par score
  const sortedGoals = scoredGoals.sort(
    (a, b) => (b.matchScore || 0) - (a.matchScore || 0)
  );

  return {
    recommended: sortedGoals.filter(goal => goal.isRecommended),
    others: sortedGoals.filter(goal => !goal.isRecommended),
  };
}

export function filterGoalsBySearch(
  goals: Goal[],
  searchQuery: string,
  category?: GoalCategory | "all",
  difficulty?: GoalDifficulty | "all"
): Goal[] {
  const searchLower = searchQuery.toLowerCase();

  return goals.filter(goal => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchLower) ||
      goal.description.toLowerCase().includes(searchLower) ||
      goal.modules?.some(
        m =>
          m.title.toLowerCase().includes(searchLower) ||
          m.description.toLowerCase().includes(searchLower)
      ) ||
      goal.careerOpportunities?.some(
        o =>
          o.title.toLowerCase().includes(searchLower) ||
          o.description.toLowerCase().includes(searchLower)
      );

    const matchesCategory =
      !category || category === "all" || goal.category === category;
    const matchesDifficulty =
      !difficulty || difficulty === "all" || goal.level === difficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });
}

// Fonctions utilitaires
function isLevelSufficient(
  userLevel: GoalDifficulty,
  requiredLevel: GoalDifficulty
): boolean {
  const levels = ["beginner", "intermediate", "advanced"];
  const userLevelIndex = levels.indexOf(userLevel);
  const requiredLevelIndex = levels.indexOf(requiredLevel);
  return userLevelIndex >= requiredLevelIndex;
}

function getMaxSkillLevel(skills: { level: GoalDifficulty }[]): GoalDifficulty {
  const levels = ["beginner", "intermediate", "advanced"];
  return skills.reduce((max, skill) => {
    const currentIndex = levels.indexOf(skill.level);
    const maxIndex = levels.indexOf(max);
    return currentIndex > maxIndex ? skill.level : max;
  }, "beginner" as GoalDifficulty);
}

function getMaxSkillLevelFromNamedSkills(
  skills: { name: string; level: string }[]
): GoalDifficulty {
  const levels = ["beginner", "intermediate", "advanced"];
  return skills.reduce((max, skill) => {
    const currentIndex = levels.indexOf(skill.level);
    const maxIndex = levels.indexOf(max);
    return currentIndex > maxIndex ? (skill.level as GoalDifficulty) : max;
  }, "beginner" as GoalDifficulty);
}

function getDifficultyMatchScore(
  goalLevel: GoalDifficulty,
  mathLevel: GoalDifficulty,
  programmingLevel: GoalDifficulty
): number {
  const levels = ["beginner", "intermediate", "advanced"];
  const goalIndex = levels.indexOf(goalLevel);
  const mathIndex = levels.indexOf(mathLevel);
  const progIndex = levels.indexOf(programmingLevel);

  // Calculer la moyenne des niveaux de l'utilisateur
  const userAvgLevel = (mathIndex + progIndex) / 2;

  // Calculer la différence avec le niveau requis
  const diff = Math.abs(goalIndex - userAvgLevel);

  // Score basé sur la différence
  if (diff === 0) return 30; // Parfaite correspondance
  if (diff <= 1) return 20; // Différence acceptable
  return 0; // Trop grande différence
}
