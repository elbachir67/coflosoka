// Resource Types
export type ResourceType = "article" | "video" | "course" | "book" | "use_case";
export type GoalCategory =
  | "ml"
  | "dl"
  | "computer_vision"
  | "nlp"
  | "data_science"
  | "mlops";
export type GoalDifficulty = "beginner" | "intermediate" | "advanced";

export interface Resource {
  title: string;
  url: string;
  type: ResourceType;
  duration: number;
}

export interface CategoryResources {
  books?: Resource[];
  courses?: Resource[];
  videos?: Resource[];
  articles?: Resource[];
  practice?: Resource[];
}

// Fixed interface definition for AdditionalResources
export interface AdditionalResources {
  ml?: CategoryResources;
  dl?: CategoryResources;
  computer_vision?: CategoryResources;
  nlp?: CategoryResources;
  data_science?: CategoryResources;
  mlops?: CategoryResources;
}

// Question and Quiz Types
export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  explanation: string;
  category: string;
  difficulty: string;
}

export interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  options?: string[];
  component?: React.ReactNode;
}

// User Types
export interface UserProfile {
  mathLevel: GoalDifficulty;
  programmingLevel: GoalDifficulty;
  domain: GoalCategory;
}

// Goal Types
export interface Module {
  title: string;
  description: string;
  duration: number;
  skills: { name: string; level: string }[];
  resources: Resource[];
  validationCriteria: string[];
}

export interface Goal {
  _id: string;
  title: string;
  description: string;
  category: GoalCategory;
  level: GoalDifficulty;
  estimatedDuration: number;
  prerequisites: {
    category: string;
    skills: { name: string; level: string }[];
  }[];
  modules: Module[];
  careerOpportunities: {
    title: string;
    description: string;
    averageSalary: string;
    companies: string[];
  }[];
  certification?: {
    available: boolean;
    name?: string;
    provider?: string;
    url?: string;
  };
  isRecommended?: boolean;
  matchScore?: number;
}

// Pathway Types
export interface PathwayResource {
  resourceId: string;
  completed: boolean;
  completedAt?: Date;
  type: ResourceType;
}

export interface ModuleProgress {
  moduleIndex: number;
  completed: boolean;
  locked: boolean;
  resources: PathwayResource[];
  quiz: {
    completed: boolean;
    score?: number;
    completedAt?: Date;
  };
}

export interface Pathway {
  _id: string;
  userId: string;
  goalId: Goal;
  status: "active" | "completed" | "paused";
  progress: number;
  currentModule: number;
  moduleProgress: ModuleProgress[];
  startedAt: Date;
  lastAccessedAt: Date;
  estimatedCompletionDate: Date;
  adaptiveRecommendations?: {
    type: "resource" | "practice" | "review";
    description: string;
    priority: "high" | "medium" | "low";
    status: "pending" | "completed" | "skipped";
  }[];
}

// Quiz Types
export interface ModuleQuiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: Question[];
  passingScore: number;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: {
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}

// Analytics Types
export interface AnalyticsData {
  totalLearningTime: number;
  completionRate: number;
  averageScore: number;
  activeDays: number;
  recommendations: {
    title: string;
    description: string;
  }[];
}

// Dashboard Types
export interface LearnerDashboard {
  learningStats: {
    totalHoursSpent: number;
    completedResources: number;
    averageQuizScore: number;
    streakDays: number;
  };
  activePathways: Pathway[];
  completedPathways: Pathway[];
  nextMilestones: {
    goalTitle: string;
    moduleName: string;
    dueDate: Date;
  }[];
}

// Gamification Types
export interface Achievement {
  _id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  points: number;
  rarity: string;
  badgeUrl?: string;
}

export interface UserAchievement {
  _id: string;
  userId: string;
  achievementId: Achievement;
  unlockedAt: Date;
  progress: number;
  isCompleted: boolean;
  isViewed: boolean;
}

export interface GamificationProfile {
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

export interface XPGain {
  xpGained: number;
  reason: string;
  leveledUp: boolean;
  newLevel?: number;
}
