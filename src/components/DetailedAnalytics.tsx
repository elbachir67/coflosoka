import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  Calendar,
  Clock,
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  Loader2,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import LearningProgressChart from "./LearningProgressChart";

interface DetailedAnalyticsData {
  weeklyProgress: any[];
  monthlyStats: any[];
  categoryBreakdown: any[];
  timeDistribution: any[];
  performanceTrends: any[];
  learningVelocity: number;
  retentionRate: number;
  engagementScore: number;
  predictedCompletion: string;
}

const DetailedAnalytics: React.FC = () => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] =
    useState<DetailedAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "week" | "month" | "quarter"
  >("month");
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("area");

  useEffect(() => {
    fetchDetailedAnalytics();
  }, [selectedTimeframe]);

  const fetchDetailedAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${api.API_URL}/api/analytics/detailed?timeframe=${selectedTimeframe}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des analytiques détaillées");
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error("Error fetching detailed analytics:", error);
      setError("Impossible de charger les analytiques détaillées");

      // Données simulées pour la démonstration
      setAnalyticsData({
        weeklyProgress: [
          {
            date: "Sem 1",
            progress: 15,
            quizScore: 72,
            timeSpent: 8,
            xpGained: 120,
          },
          {
            date: "Sem 2",
            progress: 28,
            quizScore: 78,
            timeSpent: 12,
            xpGained: 180,
          },
          {
            date: "Sem 3",
            progress: 45,
            quizScore: 82,
            timeSpent: 15,
            xpGained: 220,
          },
          {
            date: "Sem 4",
            progress: 62,
            quizScore: 85,
            timeSpent: 18,
            xpGained: 280,
          },
          {
            date: "Sem 5",
            progress: 78,
            quizScore: 88,
            timeSpent: 20,
            xpGained: 320,
          },
          {
            date: "Sem 6",
            progress: 85,
            quizScore: 90,
            timeSpent: 16,
            xpGained: 250,
          },
        ],
        monthlyStats: [
          { month: "Jan", modules: 3, quizzes: 8, resources: 25, xp: 850 },
          { month: "Fév", modules: 5, quizzes: 12, resources: 38, xp: 1200 },
          { month: "Mar", modules: 4, quizzes: 10, resources: 32, xp: 980 },
        ],
        categoryBreakdown: [
          { name: "Machine Learning", value: 35, color: "#8B5CF6" },
          { name: "Deep Learning", value: 25, color: "#10B981" },
          { name: "Computer Vision", value: 20, color: "#3B82F6" },
          { name: "NLP", value: 15, color: "#F59E0B" },
          { name: "MLOps", value: 5, color: "#EF4444" },
        ],
        timeDistribution: [
          { activity: "Lecture", time: 40, color: "#8B5CF6" },
          { activity: "Vidéos", time: 25, color: "#10B981" },
          { activity: "Exercices", time: 20, color: "#3B82F6" },
          { activity: "Quiz", time: 15, color: "#F59E0B" },
        ],
        performanceTrends: [
          { date: "01/01", accuracy: 65, speed: 70, retention: 75 },
          { date: "08/01", accuracy: 70, speed: 72, retention: 78 },
          { date: "15/01", accuracy: 75, speed: 75, retention: 80 },
          { date: "22/01", accuracy: 78, speed: 78, retention: 82 },
          { date: "29/01", accuracy: 82, speed: 80, retention: 85 },
          { date: "05/02", accuracy: 85, speed: 82, retention: 87 },
        ],
        learningVelocity: 0.78,
        retentionRate: 0.85,
        engagementScore: 0.82,
        predictedCompletion: "2025-04-15",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: "csv" | "pdf") => {
    try {
      const response = await fetch(
        `${api.API_URL}/api/analytics/export-detailed?format=${format}&timeframe=${selectedTimeframe}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `analytics_detailed_${selectedTimeframe}.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success(`Rapport ${format.toUpperCase()} téléchargé`);
      } else {
        throw new Error("Erreur lors de l'export");
      }
    } catch (error) {
      console.error("Error exporting analytics:", error);
      toast.error("Erreur lors de l'export");
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Chargement des analytiques détaillées...</span>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 text-red-400">
          <AlertCircle className="w-5 h-5" />
          <span>{error || "Données analytiques non disponibles"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec contrôles */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-100 flex items-center">
          <Activity className="w-5 h-5 text-green-400 mr-2" />
          Analytiques Détaillées
        </h2>

        <div className="flex items-center space-x-3">
          <select
            value={selectedTimeframe}
            onChange={e =>
              setSelectedTimeframe(
                e.target.value as "week" | "month" | "quarter"
              )
            }
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
          </select>

          <select
            value={chartType}
            onChange={e =>
              setChartType(e.target.value as "line" | "area" | "bar")
            }
            className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="line">Ligne</option>
            <option value="area">Zone</option>
            <option value="bar">Barres</option>
          </select>

          <button
            onClick={() => fetchDetailedAnalytics()}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Actualiser
          </button>

          <button
            onClick={() => handleExport("csv")}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            CSV
          </button>
        </div>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-xl text-center">
          <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-100">
            {Math.round(analyticsData.learningVelocity * 100)}%
          </p>
          <p className="text-gray-400">Vitesse d'apprentissage</p>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-green-500 h-1.5 rounded-full"
              style={{ width: `${analyticsData.learningVelocity * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl text-center">
          <Activity className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-100">
            {Math.round(analyticsData.retentionRate * 100)}%
          </p>
          <p className="text-gray-400">Taux de rétention</p>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${analyticsData.retentionRate * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl text-center">
          <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <p className="text-2xl font-bold text-gray-100">
            {Math.round(analyticsData.engagementScore * 100)}%
          </p>
          <p className="text-gray-400">Score d'engagement</p>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-1.5">
            <div
              className="bg-purple-500 h-1.5 rounded-full"
              style={{ width: `${analyticsData.engagementScore * 100}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl text-center">
          <Calendar className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-gray-100">
            {new Date(analyticsData.predictedCompletion).toLocaleDateString()}
          </p>
          <p className="text-gray-400">Fin estimée</p>
          <p className="text-xs text-gray-500 mt-1">
            Basé sur votre rythme actuel
          </p>
        </div>
      </div>

      {/* Graphique principal de progression */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">
          Progression d'Apprentissage
        </h3>
        <LearningProgressChart
          data={analyticsData.weeklyProgress}
          type={chartType}
          showQuizScores={true}
          showTimeSpent={true}
          showXP={true}
          height={350}
        />
      </div>

      {/* Graphiques secondaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition par catégorie */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <PieChart className="w-5 h-5 text-purple-400 mr-2" />
            Répartition par Domaine
          </h3>
          <LearningProgressChart
            data={analyticsData.categoryBreakdown}
            type="pie"
            height={250}
          />
        </div>

        {/* Distribution du temps */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <Clock className="w-5 h-5 text-blue-400 mr-2" />
            Distribution du Temps
          </h3>
          <div className="space-y-4">
            {analyticsData.timeDistribution.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-400 mb-1">
                  <span>{item.activity}</span>
                  <span>{item.time}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{
                      width: `${item.time}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tendances de performance */}
        <div className="glass-card rounded-xl p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            Tendances de Performance
          </h3>
          <LearningProgressChart
            data={analyticsData.performanceTrends.map(trend => ({
              date: trend.date,
              progress: trend.accuracy,
              quizScore: trend.speed,
              timeSpent: trend.retention,
            }))}
            type="line"
            height={300}
            showQuizScores={true}
            showTimeSpent={true}
          />
        </div>
      </div>

      {/* Statistiques mensuelles */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 text-orange-400 mr-2" />
          Activité Mensuelle
        </h3>
        <LearningProgressChart
          data={analyticsData.monthlyStats.map(stat => ({
            date: stat.month,
            progress: stat.modules * 10, // Convertir en pourcentage pour l'affichage
            quizScore: stat.quizzes * 5,
            timeSpent: stat.resources,
            xpGained: stat.xp / 10, // Normaliser pour l'affichage
          }))}
          type="bar"
          showQuizScores={true}
          showTimeSpent={true}
          showXP={true}
          height={300}
        />
      </div>

      {/* Insights et recommandations */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-4">
          Insights d'Apprentissage
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <h4 className="text-green-400 font-medium mb-2">Points Forts</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Excellente régularité d'apprentissage</li>
                <li>• Scores aux quiz en amélioration constante</li>
                <li>• Bon équilibre théorie/pratique</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <h4 className="text-blue-400 font-medium mb-2">
                Recommandations
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Augmenter le temps consacré aux exercices pratiques</li>
                <li>• Explorer des sujets plus avancés</li>
                <li>• Participer davantage aux discussions communautaires</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
              <h4 className="text-yellow-400 font-medium mb-2">
                Axes d'Amélioration
              </h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Réviser les concepts mathématiques avancés</li>
                <li>• Pratiquer davantage la programmation</li>
                <li>• Améliorer la vitesse de résolution des quiz</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <h4 className="text-purple-400 font-medium mb-2">Prédictions</h4>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>
                  • Complétion du parcours actuel:{" "}
                  {analyticsData.predictedCompletion}
                </li>
                <li>• Probabilité de succès: 85%</li>
                <li>• Niveau estimé dans 3 mois: Expert</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalytics;
