import React, { useState, useEffect } from "react";
import {
  Brain,
  Lightbulb,
  TrendingUp,
  Clock,
  BarChart,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { toast } from "react-hot-toast";

interface LearningInsight {
  type: string;
  title: string;
  description: string;
  recommendation: string;
}

const AIInsights: React.FC = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState<LearningInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${api.API_URL}/api/ai/learning-insights`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des insights");
      }

      const data = await response.json();
      setInsights(data);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      setError("Impossible de charger les insights d'apprentissage");
      toast.error("Erreur lors du chargement des insights");
    } finally {
      setLoading(false);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "learning_style":
        return <Brain className="w-5 h-5 text-purple-400" />;
      case "progression":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "retention":
        return <Zap className="w-5 h-5 text-yellow-400" />;
      case "timing":
        return <Clock className="w-5 h-5 text-blue-400" />;
      case "performance":
        return <BarChart className="w-5 h-5 text-red-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-amber-400" />;
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-pulse" />
          <span>Analyse de vos patterns d'apprentissage...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 text-gray-400">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <Lightbulb className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">
          Continuez votre parcours pour générer des insights personnalisés.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
        <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
        Insights d'Apprentissage
      </h2>

      {insights.map((insight, index) => (
        <div
          key={index}
          className="glass-card rounded-xl p-6 hover:bg-gray-800/30 transition-colors duration-300"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 rounded-lg bg-gray-800/50">
              {getInsightIcon(insight.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {insight.title}
              </h3>
              <p className="text-gray-400 mb-3">{insight.description}</p>
              <div className="p-3 rounded-lg bg-gray-800/50 border-l-4 border-yellow-500">
                <p className="text-gray-300 text-sm">
                  <span className="font-medium">Recommandation:</span>{" "}
                  {insight.recommendation}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIInsights;
