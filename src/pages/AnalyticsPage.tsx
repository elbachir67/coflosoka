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
} from "lucide-react";
import AIInsights from "../components/AIInsights";
import PerformancePrediction from "../components/PerformancePrediction";
import LearningProgressChart from "../components/LearningProgressChart";
import SmartRecommendations from "../components/SmartRecommendations";

function AnalyticsPage() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "recommendations" | "insights" | "predictions"
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
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement des données analytiques...</span>
        </div>
      </div>
    );
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="mb-4">
            {error || "Données analytiques non disponibles"}
          </p>
        </div>
      </div>
    );
  }

  // Données simulées pour le graphique de progression
  const progressData = [
    { date: "01/01", progress: 10, quizScore: 65, timeSpent: 45 },
    { date: "08/01", progress: 20, quizScore: 70, timeSpent: 60 },
    { date: "15/01", progress: 35, quizScore: 75, timeSpent: 55 },
    { date: "22/01", progress: 45, quizScore: 80, timeSpent: 50 },
    { date: "29/01", progress: 60, quizScore: 85, timeSpent: 65 },
    { date: "05/02", progress: 75, quizScore: 90, timeSpent: 70 },
    { date: "12/02", progress: 85, quizScore: 88, timeSpent: 60 },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">
            Tableau de Bord Analytique
          </h1>

          <div className="flex space-x-4">
            <button
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
            </button>

            <button
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
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "overview"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab("recommendations")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "recommendations"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Recommandations IA
          </button>
          <button
            onClick={() => setActiveTab("insights")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "insights"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Insights IA
          </button>
          <button
            onClick={() => setActiveTab("predictions")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "predictions"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Prédictions
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-blue-400" />
                  <span className="text-2xl font-bold text-gray-100">
                    {analyticsData.totalLearningTime}h
                  </span>
                </div>
                <p className="text-gray-400">Temps d'apprentissage total</p>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 text-green-400" />
                  <span className="text-2xl font-bold text-gray-100">
                    {analyticsData.completionRate}%
                  </span>
                </div>
                <p className="text-gray-400">Taux de complétion</p>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <Brain className="w-8 h-8 text-purple-400" />
                  <span className="text-2xl font-bold text-gray-100">
                    {analyticsData.averageScore}%
                  </span>
                </div>
                <p className="text-gray-400">Score moyen aux évaluations</p>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-100">
                    {analyticsData.activeDays} jours
                  </span>
                </div>
                <p className="text-gray-400">Jours d'activité</p>
              </div>
            </div>

            {/* Learning Progress Chart */}
            <div className="glass-card p-6 rounded-xl mb-8">
              <div className="flex items-center mb-6">
                <LineChart className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-xl font-bold text-gray-100">
                  Progression d'Apprentissage
                </h2>
              </div>

              <LearningProgressChart data={progressData} height={300} />
            </div>

            {/* Concept Mastery and Time Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center mb-6">
                  <BarChart className="w-6 h-6 text-green-400 mr-3" />
                  <h2 className="text-xl font-bold text-gray-100">
                    Maîtrise des Concepts
                  </h2>
                </div>

                <div className="space-y-4">
                  {["Machine Learning", "Deep Learning", "Computer Vision"].map(
                    (concept, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>{concept}</span>
                          <span>{70 + index * 10}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                ? "bg-green-500"
                                : "bg-purple-500"
                            }`}
                            style={{ width: `${70 + index * 10}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center mb-6">
                  <PieChart className="w-6 h-6 text-purple-400 mr-3" />
                  <h2 className="text-xl font-bold text-gray-100">
                    Distribution du Temps
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Lecture", value: 40, color: "bg-blue-500" },
                    { label: "Vidéos", value: 25, color: "bg-green-500" },
                    { label: "Exercices", value: 20, color: "bg-purple-500" },
                    { label: "Quiz", value: 15, color: "bg-yellow-500" },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm text-gray-400 mb-1">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Recommendations */}
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center mb-6">
                <Brain className="w-6 h-6 text-yellow-400 mr-3" />
                <h2 className="text-xl font-bold text-gray-100">
                  Recommandations d'Apprentissage
                </h2>
              </div>

              <div className="space-y-4">
                {analyticsData.recommendations.map(
                  (recommendation: any, index: number) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-gray-800/50 border-l-4 border-yellow-500"
                    >
                      <p className="text-gray-200 font-medium mb-2">
                        {recommendation.title}
                      </p>
                      <p className="text-gray-400">
                        {recommendation.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === "recommendations" && <SmartRecommendations />}
        {activeTab === "insights" && <AIInsights />}

        {activeTab === "predictions" && <PerformancePrediction />}
      </div>
    </div>
  );
}

export default AnalyticsPage;
