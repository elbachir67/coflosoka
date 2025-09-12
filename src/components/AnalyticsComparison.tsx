import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  Users,
  TrendingUp,
  Award,
  Clock,
  BarChart3,
  Loader2,
  AlertCircle,
  Target,
  Zap,
  Brain,
} from "lucide-react";
import { toast } from "react-hot-toast";
import LearningProgressChart from "./LearningProgressChart";

interface ComparisonData {
  userStats: {
    totalXP: number;
    level: number;
    averageScore: number;
    completionRate: number;
    streakDays: number;
    timeSpent: number;
  };
  platformAverage: {
    totalXP: number;
    level: number;
    averageScore: number;
    completionRate: number;
    streakDays: number;
    timeSpent: number;
  };
  ranking: {
    position: number;
    totalUsers: number;
    percentile: number;
  };
  categoryComparison: {
    category: string;
    userScore: number;
    averageScore: number;
    ranking: number;
  }[];
}

const AnalyticsComparison: React.FC = () => {
  const { user } = useAuth();
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComparisonData();
  }, []);

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${api.API_URL}/api/analytics/comparison`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données de comparaison");
      }

      const data = await response.json();
      setComparisonData(data);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      setError("Impossible de charger les données de comparaison");

      // Données simulées pour la démonstration
      setComparisonData({
        userStats: {
          totalXP: 2450,
          level: 12,
          averageScore: 82,
          completionRate: 75,
          streakDays: 15,
          timeSpent: 45,
        },
        platformAverage: {
          totalXP: 1800,
          level: 8,
          averageScore: 78,
          completionRate: 65,
          streakDays: 8,
          timeSpent: 35,
        },
        ranking: {
          position: 23,
          totalUsers: 156,
          percentile: 85,
        },
        categoryComparison: [
          { category: "ml", userScore: 85, averageScore: 75, ranking: 12 },
          { category: "dl", userScore: 78, averageScore: 72, ranking: 28 },
          {
            category: "computer_vision",
            userScore: 82,
            averageScore: 70,
            ranking: 15,
          },
          { category: "nlp", userScore: 75, averageScore: 80, ranking: 45 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (userValue: number, averageValue: number) => {
    const ratio = userValue / averageValue;
    if (ratio >= 1.2) return "text-green-400";
    if (ratio >= 0.8) return "text-blue-400";
    return "text-yellow-400";
  };

  const getPerformanceIcon = (userValue: number, averageValue: number) => {
    const ratio = userValue / averageValue;
    if (ratio >= 1.2) return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (ratio >= 0.8) return <Target className="w-4 h-4 text-blue-400" />;
    return <AlertCircle className="w-4 h-4 text-yellow-400" />;
  };

  const getPercentileMessage = (percentile: number) => {
    if (percentile >= 90) return "Top 10% des apprenants !";
    if (percentile >= 75) return "Parmi les 25% meilleurs";
    if (percentile >= 50) return "Au-dessus de la moyenne";
    if (percentile >= 25) return "Progression normale";
    return "Potentiel d'amélioration";
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Analyse comparative en cours...</span>
        </div>
      </div>
    );
  }

  if (error || !comparisonData) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error || "Données de comparaison non disponibles"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
        <BarChart3 className="w-5 h-5 text-blue-400 mr-2" />
        Comparaison avec la Communauté
      </h2>

      {/* Classement général */}
      <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-200">
            Votre Classement
          </h3>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold">
              #{comparisonData.ranking.position}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {comparisonData.ranking.position}
            </p>
            <p className="text-gray-400">Position</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {comparisonData.ranking.totalUsers}
            </p>
            <p className="text-gray-400">Total apprenants</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-400">
              {Math.round(comparisonData.ranking.percentile)}%
            </p>
            <p className="text-gray-400">Percentile</p>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-gray-800/50">
          <p className="text-center text-gray-300">
            {getPercentileMessage(comparisonData.ranking.percentile)}
          </p>
        </div>
      </div>

      {/* Comparaison détaillée */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-yellow-400 mr-2" />
              <span className="text-gray-300">XP Total</span>
            </div>
            {getPerformanceIcon(
              comparisonData.userStats.totalXP,
              comparisonData.platformAverage.totalXP
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Vous</span>
              <span
                className={`font-bold ${getPerformanceColor(
                  comparisonData.userStats.totalXP,
                  comparisonData.platformAverage.totalXP
                )}`}
              >
                {comparisonData.userStats.totalXP.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Moyenne</span>
              <span className="text-gray-300">
                {comparisonData.platformAverage.totalXP.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (comparisonData.userStats.totalXP /
                      comparisonData.platformAverage.totalXP) *
                      50
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Award className="w-6 h-6 text-purple-400 mr-2" />
              <span className="text-gray-300">Niveau</span>
            </div>
            {getPerformanceIcon(
              comparisonData.userStats.level,
              comparisonData.platformAverage.level
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Vous</span>
              <span
                className={`font-bold ${getPerformanceColor(
                  comparisonData.userStats.level,
                  comparisonData.platformAverage.level
                )}`}
              >
                Niv. {comparisonData.userStats.level}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Moyenne</span>
              <span className="text-gray-300">
                Niv. {Math.round(comparisonData.platformAverage.level)}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (comparisonData.userStats.level /
                      comparisonData.platformAverage.level) *
                      50
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Brain className="w-6 h-6 text-blue-400 mr-2" />
              <span className="text-gray-300">Score Moyen</span>
            </div>
            {getPerformanceIcon(
              comparisonData.userStats.averageScore,
              comparisonData.platformAverage.averageScore
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Vous</span>
              <span
                className={`font-bold ${getPerformanceColor(
                  comparisonData.userStats.averageScore,
                  comparisonData.platformAverage.averageScore
                )}`}
              >
                {comparisonData.userStats.averageScore}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Moyenne</span>
              <span className="text-gray-300">
                {Math.round(comparisonData.platformAverage.averageScore)}%
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(
                    100,
                    (comparisonData.userStats.averageScore /
                      comparisonData.platformAverage.averageScore) *
                      50
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Comparaison par catégorie */}
      {comparisonData.categoryComparison.length > 0 && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 text-green-400 mr-2" />
            Performance par Domaine
          </h3>

          <div className="space-y-4">
            {comparisonData.categoryComparison.map((category, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-300 font-medium">
                    {category.category.toUpperCase()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      #{category.ranking}
                    </span>
                    {getPerformanceIcon(
                      category.userScore,
                      category.averageScore
                    )}
                  </div>
                </div>

                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    Vous:{" "}
                    <span
                      className={getPerformanceColor(
                        category.userScore,
                        category.averageScore
                      )}
                    >
                      {category.userScore}%
                    </span>
                  </span>
                  <span className="text-gray-400">
                    Moyenne: {Math.round(category.averageScore)}%
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      category.userScore >= category.averageScore
                        ? "bg-green-500"
                        : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (category.userScore /
                          Math.max(category.averageScore, category.userScore)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Graphique radar de comparaison */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
          <Target className="w-5 h-5 text-purple-400 mr-2" />
          Profil de Performance
        </h3>

        <LearningProgressChart
          data={[
            {
              date: "Actuel",
              progress: comparisonData.userStats.completionRate,
              quizScore: comparisonData.userStats.averageScore,
              timeSpent: comparisonData.userStats.timeSpent,
            },
          ]}
          type="radar"
          height={300}
        />

        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Votre profil de performance comparé aux standards de la plateforme
          </p>
        </div>
      </div>

      {/* Conseils d'amélioration */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
          <Brain className="w-5 h-5 text-blue-400 mr-2" />
          Conseils d'Amélioration
        </h3>

        <div className="space-y-3">
          {comparisonData.userStats.averageScore <
            comparisonData.platformAverage.averageScore && (
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <p className="text-yellow-400 font-medium mb-1">
                Améliorer les scores aux quiz
              </p>
              <p className="text-gray-400 text-sm">
                Votre score moyen ({comparisonData.userStats.averageScore}%) est
                en dessous de la moyenne. Prenez plus de temps pour réviser
                avant les quiz.
              </p>
            </div>
          )}

          {comparisonData.userStats.streakDays <
            comparisonData.platformAverage.streakDays && (
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <p className="text-orange-400 font-medium mb-1">
                Améliorer la régularité
              </p>
              <p className="text-gray-400 text-sm">
                Votre série ({comparisonData.userStats.streakDays} jours) peut
                être améliorée. Essayez de vous connecter quotidiennement, même
                15 minutes.
              </p>
            </div>
          )}

          {comparisonData.userStats.completionRate <
            comparisonData.platformAverage.completionRate && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 font-medium mb-1">
                Augmenter le taux de complétion
              </p>
              <p className="text-gray-400 text-sm">
                Votre taux de complétion (
                {comparisonData.userStats.completionRate}%) peut être amélioré.
                Concentrez-vous sur terminer les parcours commencés.
              </p>
            </div>
          )}

          {comparisonData.ranking.percentile >= 75 && (
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <p className="text-green-400 font-medium mb-1">
                Excellentes performances !
              </p>
              <p className="text-gray-400 text-sm">
                Vous êtes dans le top 25% ! Continuez sur cette lancée et
                envisagez de mentorer d'autres apprenants.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsComparison;
