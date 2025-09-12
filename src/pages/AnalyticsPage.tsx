import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  BarChart,
  LineChart,
  PieChart,
  Download,
  Calendar,
  Clock,
  Award,
  Brain,
  Loader2,
  AlertCircle,
  Lightbulb,
  TrendingUp,
  Target,
  Activity,
  Users,
  Zap,
  Star,
  Trophy,
  BookOpen,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw,
  Filter,
  Eye,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import AIInsights from "../components/AIInsights";
import PerformancePrediction from "../components/PerformancePrediction";
import LearningProgressChart from "../components/LearningProgressChart";
import SmartRecommendations from "../components/SmartRecommendations";
import DetailedAnalytics from "../components/DetailedAnalytics";
import AnalyticsComparison from "../components/AnalyticsComparison";

function AnalyticsPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "detailed"
    | "comparison"
    | "recommendations"
    | "insights"
    | "predictions"
  >("overview");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user) return;

      try {
        const endpoint = isAdmin
          ? `${api.analytics}/admin`
          : `${api.analytics}/user`;

        const response = await fetch(endpoint, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données analytiques");
        }

        const data = await response.json();
        setAnalyticsData(data);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError(
          error instanceof Error ? error.message : "Erreur lors du chargement"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user, isAdmin]);

  const handleExportData = async (format: "csv" | "excel") => {
    if (!user) return;

    setExportLoading(true);

    try {
      const response = await fetch(`${api.analytics}/export?format=${format}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Erreur lors de l'export en format ${format.toUpperCase()}`
        );
      }

      // Create a download link for the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `learning_analytics_${
        new Date().toISOString().split("T")[0]
      }.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error instanceof Error
          ? error.message
          : `Erreur lors de l'export en ${format.toUpperCase()}`
      );
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center space-x-3 text-gray-400"
        >
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            <div className="absolute inset-0 w-8 h-8 border-2 border-purple-400/30 rounded-full animate-pulse"></div>
          </div>
          <span className="text-lg">
            Analyse de vos données d'apprentissage...
          </span>
        </motion.div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gray-400"
        >
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
          <p className="mb-4 text-xl">
            {error || "Données analytiques non disponibles"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Réessayer
          </button>
        </motion.div>
      </div>
    );
  }

  // Données simulées enrichies pour une démonstration complète
  const progressData = [
    {
      date: "01/01",
      progress: 10,
      quizScore: 65,
      timeSpent: 45,
      xpGained: 120,
      modulesCompleted: 1,
    },
    {
      date: "08/01",
      progress: 20,
      quizScore: 70,
      timeSpent: 60,
      xpGained: 180,
      modulesCompleted: 2,
    },
    {
      date: "15/01",
      progress: 35,
      quizScore: 75,
      timeSpent: 55,
      xpGained: 220,
      modulesCompleted: 3,
    },
    {
      date: "22/01",
      progress: 45,
      quizScore: 80,
      timeSpent: 50,
      xpGained: 280,
      modulesCompleted: 4,
    },
    {
      date: "29/01",
      progress: 60,
      quizScore: 85,
      timeSpent: 65,
      xpGained: 320,
      modulesCompleted: 5,
    },
    {
      date: "05/02",
      progress: 75,
      quizScore: 90,
      timeSpent: 70,
      xpGained: 380,
      modulesCompleted: 6,
    },
    {
      date: "12/02",
      progress: 85,
      quizScore: 88,
      timeSpent: 60,
      xpGained: 250,
      modulesCompleted: 7,
    },
  ];

  const conceptMasteryData = [
    { name: "Machine Learning", score: 85, trend: "up", improvement: 12 },
    { name: "Deep Learning", score: 78, trend: "up", improvement: 8 },
    { name: "Computer Vision", score: 82, trend: "stable", improvement: 2 },
    { name: "NLP", score: 75, trend: "down", improvement: -3 },
    { name: "MLOps", score: 70, trend: "up", improvement: 15 },
  ];

  const timeDistributionData = [
    { label: "Lecture", value: 40, color: "#8B5CF6", hours: 18 },
    { label: "Vidéos", value: 25, color: "#10B981", hours: 11 },
    { label: "Exercices", value: 20, color: "#3B82F6", hours: 9 },
    { label: "Quiz", value: 15, color: "#F59E0B", hours: 7 },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUp className="w-4 h-4 text-green-400" />;
      case "down":
        return <ArrowDown className="w-4 h-4 text-red-400" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec animations */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:justify-between md:items-center mb-8"
        >
          <div className="mb-6 md:mb-0">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Tableau de Bord Analytique
            </h1>
            <p className="text-gray-400 text-lg">
              Analysez votre progression et optimisez votre apprentissage avec
              l'IA
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExportData("csv")}
              disabled={exportLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              {exportLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Exporter CSV
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleExportData("excel")}
              disabled={exportLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            >
              {exportLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Exporter Excel
            </motion.button>
          </div>
        </motion.div>

        {/* Navigation Tabs avec design moderne */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-2 mb-8"
        >
          <div className="flex overflow-x-auto">
            {[
              {
                id: "overview",
                label: "Vue d'ensemble",
                icon: BarChart,
                color: "purple",
              },
              {
                id: "detailed",
                label: "Détaillées",
                icon: Activity,
                color: "blue",
              },
              {
                id: "comparison",
                label: "Comparaison",
                icon: Users,
                color: "green",
              },
              {
                id: "recommendations",
                label: "Recommandations IA",
                icon: Lightbulb,
                color: "yellow",
              },
              {
                id: "insights",
                label: "Insights IA",
                icon: Brain,
                color: "pink",
              },
              {
                id: "predictions",
                label: "Prédictions",
                icon: TrendingUp,
                color: "cyan",
              },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 font-medium text-sm whitespace-nowrap rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? `bg-gradient-to-r from-${tab.color}-500/20 to-${tab.color}-600/20 text-${tab.color}-400 border border-${tab.color}-500/30 shadow-lg`
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {isActive && <Sparkles className="w-3 h-3" />}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Key Metrics avec design amélioré */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <Clock className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-100">
                      {analyticsData.totalLearningTime}h
                    </span>
                    <div className="flex items-center justify-end mt-1 text-green-400">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      <span className="text-xs">+12%</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 font-medium">
                  Temps d'apprentissage total
                </p>
                <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full w-3/4"></div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <Award className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-100">
                      {analyticsData.completionRate}%
                    </span>
                    <div className="flex items-center justify-end mt-1 text-green-400">
                      <ArrowUp className="w-3 h-3 mr-1" />
                      <span className="text-xs">+5%</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 font-medium">Taux de complétion</p>
                <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analyticsData.completionRate}%` }}
                  ></div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <Brain className="w-8 h-8 text-purple-400" />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-100">
                      {analyticsData.averageScore}%
                    </span>
                    <div className="flex items-center justify-end mt-1 text-blue-400">
                      <Target className="w-3 h-3 mr-1" />
                      <span className="text-xs">Obj: 85%</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 font-medium">
                  Score moyen aux évaluations
                </p>
                <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${analyticsData.averageScore}%` }}
                  ></div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-card p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-yellow-500/20">
                    <Calendar className="w-8 h-8 text-yellow-400" />
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-gray-100">
                      {analyticsData.activeDays}
                    </span>
                    <div className="flex items-center justify-end mt-1 text-yellow-400">
                      <Zap className="w-3 h-3 mr-1" />
                      <span className="text-xs">Série: 7j</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 font-medium">Jours d'activité</p>
                <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full w-4/5"></div>
                </div>
              </motion.div>
            </div>

            {/* Learning Progress Chart avec design amélioré */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-8 rounded-xl bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <LineChart className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-100">
                      Progression d'Apprentissage
                    </h2>
                    <p className="text-gray-400">
                      Évolution de vos performances sur 7 semaines
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <Eye className="w-4 h-4" />
                  <span>Dernières 7 semaines</span>
                </div>
              </div>

              <LearningProgressChart
                data={progressData}
                type="area"
                showQuizScores={true}
                showTimeSpent={true}
                showXP={true}
                height={400}
              />
            </motion.div>

            {/* Concept Mastery et Time Distribution avec design moderne */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-8 rounded-xl"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-green-500/20">
                    <BarChart className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-100">
                      Maîtrise des Concepts
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Performance par domaine d'IA
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {conceptMasteryData.map((concept, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="relative"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-300 font-medium">
                            {concept.name}
                          </span>
                          {getTrendIcon(concept.trend)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-100">
                            {concept.score}%
                          </span>
                          <span
                            className={`text-xs ${getTrendColor(
                              concept.trend
                            )}`}
                          >
                            {concept.improvement > 0 ? "+" : ""}
                            {concept.improvement}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${concept.score}%` }}
                          transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                          className={`h-3 rounded-full bg-gradient-to-r ${
                            concept.score >= 80
                              ? "from-green-500 to-green-400"
                              : concept.score >= 60
                              ? "from-blue-500 to-blue-400"
                              : "from-yellow-500 to-yellow-400"
                          }`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-8 rounded-xl"
              >
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-3 rounded-xl bg-purple-500/20">
                    <PieChart className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-100">
                      Distribution du Temps
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Répartition de votre temps d'étude
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {timeDistributionData.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="relative"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-gray-300 font-medium">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-gray-100">
                            {item.value}%
                          </span>
                          <span className="text-xs text-gray-400">
                            ({item.hours}h)
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                          className="h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 font-medium">
                      Total cette semaine
                    </span>
                    <span className="text-xl font-bold text-purple-400">
                      45h
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Performance Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="glass-card p-8 rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-100">
                    Faits Marquants
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Vos accomplissements récents
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <Star className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-bold">
                      Excellent !
                    </span>
                  </div>
                  <p className="text-gray-300 font-medium mb-1">
                    Score parfait
                  </p>
                  <p className="text-gray-400 text-sm">
                    Quiz "Deep Learning Basics" - 100%
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="w-6 h-6 text-blue-400" />
                    <span className="text-blue-400 font-bold">Complété !</span>
                  </div>
                  <p className="text-gray-300 font-medium mb-1">
                    Module terminé
                  </p>
                  <p className="text-gray-400 text-sm">
                    "Computer Vision Fundamentals"
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                  <div className="flex items-center space-x-3 mb-3">
                    <Zap className="w-6 h-6 text-purple-400" />
                    <span className="text-purple-400 font-bold">Série !</span>
                  </div>
                  <p className="text-gray-300 font-medium mb-1">
                    7 jours consécutifs
                  </p>
                  <p className="text-gray-400 text-sm">
                    Continuez sur cette lancée !
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Learning Recommendations avec design moderne */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card p-8 rounded-xl"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 rounded-xl bg-yellow-500/20">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-100">
                    Recommandations Intelligentes
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Conseils personnalisés pour optimiser votre apprentissage
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analyticsData.recommendations.map(
                  (recommendation: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="p-6 rounded-xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-yellow-500/20 mt-1">
                          <Lightbulb className="w-4 h-4 text-yellow-400" />
                        </div>
                        <div>
                          <p className="text-gray-200 font-medium mb-2">
                            {recommendation.title}
                          </p>
                          <p className="text-gray-400 text-sm leading-relaxed">
                            {recommendation.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "detailed" && <DetailedAnalytics />}
        {activeTab === "comparison" && <AnalyticsComparison />}
        {activeTab === "recommendations" && <SmartRecommendations />}
        {activeTab === "insights" && <AIInsights />}
        {activeTab === "predictions" && <PerformancePrediction />}
      </div>
    </div>
  );
}

export default AnalyticsPage;
