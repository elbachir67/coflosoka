import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { LearnerDashboard, Pathway } from "../types";
import {
  BookOpen,
  Clock,
  Award,
  ChevronRight,
  BarChart,
  Calendar,
  CheckCircle,
  Flame,
  Loader2,
  Play,
  Pause,
  ArrowRight,
  Brain,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import AIInsights from "../components/AIInsights";
import PerformancePrediction from "../components/PerformancePrediction";
import SmartRecommendations from "../components/SmartRecommendations";

function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasCompletedAssessment } = useAuth();
  const [dashboard, setDashboard] = useState<LearnerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "recommendations" | "insights" | "predictions"
  >("overview");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        const response = await fetch(`${api.pathways}/user/dashboard`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement du tableau de bord");
        }

        const data = await response.json();
        setDashboard(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [isAuthenticated, user, navigate]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement du tableau de bord...</span>
        </div>
      </div>
    );
  }

  // Afficher une bannière d'évaluation si l'utilisateur n'a pas encore fait l'évaluation
  const renderAssessmentBanner = () => {
    if (!hasCompletedAssessment) {
      return (
        <div className="glass-card rounded-xl p-6 mb-8 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-purple-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-xl font-bold text-gray-100 mb-2 flex items-center">
                <HelpCircle className="w-5 h-5 text-purple-400 mr-2" />
                Complétez votre évaluation
              </h2>
              <p className="text-gray-300">
                Pour obtenir des recommandations personnalisées et un parcours
                adapté à votre profil, prenez quelques minutes pour compléter
                l'évaluation initiale.
              </p>
            </div>
            <button
              onClick={() => navigate("/assessment")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center"
            >
              Commencer l'évaluation
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!dashboard) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100">
              Tableau de bord
            </h1>
            <p className="text-gray-400 mt-2">
              Bienvenue sur votre espace personnel
            </p>
          </div>

          {renderAssessmentBanner()}

          <div className="text-center py-12 glass-card rounded-xl p-8">
            <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-100 mb-2">
                🚀 Commencez votre parcours d'apprentissage !
              </h2>
              <p className="text-gray-400">
                Vous n'avez pas encore de parcours actif. Explorez nos objectifs
                ou passez l'évaluation pour des recommandations personnalisées.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {!hasCompletedAssessment && (
                <button
                  onClick={() => navigate("/assessment")}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <HelpCircle className="w-5 h-5 mr-2" />
                  Faire l'évaluation
                </button>
              )}
              <button
                onClick={() => navigate("/goals")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explorer les objectifs
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Tableau de bord</h1>
          <p className="text-gray-400 mt-2">
            Suivez votre progression et gérez vos parcours d'apprentissage
          </p>
        </div>

        {renderAssessmentBanner()}

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
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <Clock className="w-8 h-8 text-blue-400" />
                  <span className="text-2xl font-bold text-gray-100">
                    {dashboard.learningStats.totalHoursSpent}h
                  </span>
                </div>
                <p className="text-gray-400">Temps d'apprentissage</p>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <BookOpen className="w-8 h-8 text-green-400" />
                  <span className="text-2xl font-bold text-gray-100">
                    {dashboard.learningStats.completedResources}
                  </span>
                </div>
                <p className="text-gray-400">Ressources complétées</p>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 text-yellow-400" />
                  <span className="text-2xl font-bold text-gray-100">
                    {dashboard.learningStats.averageQuizScore}%
                  </span>
                </div>
                <p className="text-gray-400">Score moyen aux quiz</p>
              </div>

              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <Flame className="w-8 h-8 text-orange-400" />
                  <span className="text-2xl font-bold text-gray-100">
                    {dashboard.learningStats.streakDays} jours
                  </span>
                </div>
                <p className="text-gray-400">Série d'apprentissage</p>
              </div>
            </div>

            {/* Parcours actifs */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-100 mb-6">
                Parcours en cours
              </h2>
              <div className="space-y-4">
                {dashboard.activePathways.map(pathway => (
                  <div key={pathway._id} className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-200">
                          {pathway.goalId.title}
                        </h3>
                        <p className="text-gray-400">
                          Module {pathway.currentModule + 1} sur{" "}
                          {pathway.moduleProgress.length}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/pathways/${pathway._id}`)}
                        className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Continuer
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </button>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Progression</span>
                        <span>{pathway.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pathway.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>Commencé le {formatDate(pathway.startedAt)}</span>
                      </div>
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          Fin estimée :{" "}
                          {formatDate(pathway.estimatedCompletionDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {dashboard.activePathways.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">
                      Vous n'avez pas encore de parcours actif
                    </p>
                    <button
                      onClick={() => navigate("/goals")}
                      className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Explorer les objectifs
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Prochaines étapes */}
            <div className="mb-12">
              <h2 className="text-xl font-bold text-gray-100 mb-6">
                Prochaines étapes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dashboard.nextMilestones.map((milestone, index) => (
                  <div key={index} className="glass-card p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-200">
                        {milestone.goalTitle}
                      </h3>
                      <div className="p-2 rounded-full bg-purple-500/20">
                        <ChevronRight className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                    <p className="text-gray-400 mb-4">{milestone.moduleName}</p>
                    <div className="flex items-center text-sm text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        À compléter avant le {formatDate(milestone.dueDate)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Parcours complétés */}
            {dashboard.completedPathways.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-gray-100 mb-6">
                  🏆 Parcours complétés avec succès
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dashboard.completedPathways.map(pathway => (
                    <div
                      key={pathway._id}
                      className="glass-card p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-200">
                          {pathway.goalId.title}
                        </h3>
                        <div className="p-2 rounded-full bg-green-500/20">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      </div>
                      <div className="mb-3 p-2 rounded-lg bg-green-500/10">
                        <p className="text-green-400 text-sm font-medium">
                          ✅ Parcours terminé avec succès
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>
                          Complété le {formatDate(pathway.lastAccessedAt)}
                        </span>
                        <button
                          onClick={() => navigate(`/pathways/${pathway._id}`)}
                          className="text-green-400 hover:text-green-300 transition-colors flex items-center"
                        >
                          📊 Détails
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "recommendations" && <SmartRecommendations />}
        {activeTab === "insights" && <AIInsights />}

        {activeTab === "predictions" && <PerformancePrediction />}
      </div>
    </div>
  );
}

export default DashboardPage;
