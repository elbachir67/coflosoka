import React, { useState, useEffect } from "react";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  Clock,
  Zap,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { api } from "../config/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface SmartRecommendation {
  type: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actions: string[];
  estimatedImpact: string;
  reasoning: string;
}

interface RecommendationData {
  recommendations: SmartRecommendation[];
  adaptiveRecommendations: any[];
  learningPatterns: any;
  performancePrediction: any;
  insights: any[];
}

const SmartRecommendations: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [data, setData] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${api.API_URL}/api/ai/recommendations`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des recommandations");
      }

      const recommendationData = await response.json();
      setData(recommendationData);

      // Récompenser l'utilisateur pour avoir consulté ses recommandations
      await rewardAction("view_recommendations");
    } catch (error) {
      console.error("Error fetching smart recommendations:", error);
      setError("Impossible de charger les recommandations personnalisées");
      toast.error("Erreur lors du chargement des recommandations");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecommendations();
    setRefreshing(false);
    toast.success("Recommandations mises à jour");
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-500/10";
      case "medium":
        return "border-yellow-500 bg-yellow-500/10";
      case "low":
        return "border-blue-500 bg-blue-500/10";
      default:
        return "border-gray-500 bg-gray-500/10";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case "medium":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "low":
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "learning_pace":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "consistency":
        return <Clock className="w-5 h-5 text-blue-400" />;
      case "strength_based":
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case "improvement":
        return <Target className="w-5 h-5 text-red-400" />;
      case "cognitive_load":
        return <Brain className="w-5 h-5 text-purple-400" />;
      case "timing":
        return <Clock className="w-5 h-5 text-orange-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Analyse de votre profil d'apprentissage...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-red-400">
            <AlertTriangle className="w-5 h-5" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchRecommendations}
            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.recommendations.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 mb-4">
          Continuez votre parcours pour recevoir des recommandations
          personnalisées.
        </p>
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Actualiser
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-100 flex items-center">
          <Sparkles className="w-5 h-5 text-purple-400 mr-2" />
          Recommandations Personnalisées
        </h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 mr-1 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-1" />
          )}
          Actualiser
        </button>
      </div>

      {/* Métriques de performance */}
      {data.learningPatterns && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="glass-card p-4 rounded-xl text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-100">
              {Math.round(data.learningPatterns.learningVelocity * 100)}%
            </p>
            <p className="text-sm text-gray-400">Vitesse d'apprentissage</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-100">
              {Math.round(data.learningPatterns.consistencyScore * 100)}%
            </p>
            <p className="text-sm text-gray-400">Régularité</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <Brain className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-100">
              {Math.round(data.learningPatterns.retentionRate * 100)}%
            </p>
            <p className="text-sm text-gray-400">Rétention</p>
          </div>
          <div className="glass-card p-4 rounded-xl text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-100">
              {Math.round(data.learningPatterns.engagementLevel * 100)}%
            </p>
            <p className="text-sm text-gray-400">Engagement</p>
          </div>
        </div>
      )}

      {/* Recommandations principales */}
      <div className="space-y-4">
        {data.recommendations.map((recommendation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`glass-card rounded-xl p-6 border-l-4 ${getPriorityColor(
              recommendation.priority
            )}`}
          >
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-lg bg-gray-800/50">
                {getTypeIcon(recommendation.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-200">
                    {recommendation.title}
                  </h3>
                  <div className="flex items-center">
                    {getPriorityIcon(recommendation.priority)}
                    <span
                      className={`ml-1 text-xs font-medium ${
                        recommendation.priority === "high"
                          ? "text-red-400"
                          : recommendation.priority === "medium"
                          ? "text-yellow-400"
                          : "text-blue-400"
                      }`}
                    >
                      {recommendation.priority === "high"
                        ? "Priorité élevée"
                        : recommendation.priority === "medium"
                        ? "Priorité moyenne"
                        : "Priorité faible"}
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 mb-4">
                  {recommendation.description}
                </p>

                {recommendation.actions &&
                  recommendation.actions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Actions recommandées :
                      </h4>
                      <ul className="space-y-1">
                        {recommendation.actions.map((action, actionIndex) => (
                          <li
                            key={actionIndex}
                            className="flex items-center text-sm text-gray-400"
                          >
                            <ArrowRight className="w-3 h-3 mr-2 text-purple-400" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-gray-800/30">
                    <p className="text-gray-300 font-medium mb-1">
                      Impact estimé :
                    </p>
                    <p className="text-gray-400">
                      {recommendation.estimatedImpact}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-800/30">
                    <p className="text-gray-300 font-medium mb-1">Pourquoi :</p>
                    <p className="text-gray-400">{recommendation.reasoning}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recommandations adaptatives */}
      {data.adaptiveRecommendations &&
        data.adaptiveRecommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-100 flex items-center">
              <Brain className="w-5 h-5 text-blue-400 mr-2" />
              Recommandations Adaptatives
            </h3>
            {data.adaptiveRecommendations.map((rec, index) => (
              <div
                key={index}
                className={`glass-card rounded-xl p-4 border-l-4 ${
                  rec.urgency === "high"
                    ? "border-red-500 bg-red-500/5"
                    : "border-blue-500 bg-blue-500/5"
                }`}
              >
                <h4 className="text-md font-semibold text-gray-200 mb-2">
                  {rec.title}
                </h4>
                <p className="text-gray-400 mb-3">{rec.description}</p>
                {rec.suggestions && (
                  <ul className="space-y-1">
                    {rec.suggestions.map((suggestion: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center text-sm text-gray-400"
                      >
                        <ArrowRight className="w-3 h-3 mr-2 text-blue-400" />
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

      {/* Insights d'apprentissage */}
      {data.insights && data.insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-100 flex items-center">
            <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
            Insights d'Apprentissage
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card rounded-xl p-4"
              >
                <h4 className="text-md font-semibold text-gray-200 mb-2">
                  {insight.title}
                </h4>
                <p className="text-gray-400 mb-3 text-sm">
                  {insight.description}
                </p>
                <div className="p-3 rounded-lg bg-gray-800/50 border-l-4 border-yellow-500">
                  <p className="text-gray-300 text-sm">
                    <span className="font-medium">Conseil :</span>{" "}
                    {insight.recommendation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Prédiction de performance */}
      {data.performancePrediction && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-100 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-400 mr-2" />
            Prédiction de Performance
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Probabilité de succès</span>
                <span className="text-2xl font-bold text-green-400">
                  {Math.round(
                    data.performancePrediction.successProbability * 100
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      data.performancePrediction.successProbability * 100
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <p className="text-gray-300 mb-2">Niveau recommandé</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  data.performancePrediction.recommendedDifficulty ===
                  "advanced"
                    ? "bg-purple-500/20 text-purple-400"
                    : data.performancePrediction.recommendedDifficulty ===
                      "intermediate"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-green-500/20 text-green-400"
                }`}
              >
                {data.performancePrediction.recommendedDifficulty === "advanced"
                  ? "Avancé"
                  : data.performancePrediction.recommendedDifficulty ===
                    "intermediate"
                  ? "Intermédiaire"
                  : "Débutant"}
              </span>
            </div>
          </div>

          {/* Facteurs de risque et opportunités */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {data.performancePrediction.riskFactors.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-300 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                  Facteurs de risque
                </h4>
                <ul className="space-y-2">
                  {data.performancePrediction.riskFactors.map(
                    (factor: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center text-sm text-gray-400"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2" />
                        {factor}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}

            {data.performancePrediction.opportunities.length > 0 && (
              <div>
                <h4 className="text-md font-medium text-gray-300 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                  Opportunités
                </h4>
                <ul className="space-y-2">
                  {data.performancePrediction.opportunities.map(
                    (opportunity: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center text-sm text-gray-400"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                        {opportunity}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;
