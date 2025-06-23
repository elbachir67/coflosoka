import React, { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { toast } from "react-hot-toast";

interface AIRecommendation {
  type: "strength_based" | "improvement" | "support";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actions: string[] | any[];
}

const AIRecommendations: React.FC = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  const fetchAIRecommendations = async () => {
    try {
      const response = await fetch(`${api.API_URL}/api/ai/recommendations`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecommendations(data);
      }
    } catch (error) {
      console.error("Error fetching AI recommendations:", error);
      toast.error("Erreur lors du chargement des recommandations IA");
    } finally {
      setLoading(false);
    }
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "strength_based":
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case "improvement":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "support":
        return <CheckCircle className="w-5 h-5 text-blue-400" />;
      default:
        return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 text-gray-400">
          <Brain className="w-5 h-5 animate-pulse" />
          <span>Génération de recommandations IA...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
        <Brain className="w-5 h-5 text-purple-400 mr-2" />
        Recommandations IA Personnalisées
      </h2>

      {recommendations.map((recommendation, index) => (
        <div
          key={index}
          className={`glass-card rounded-xl p-6 border-l-4 ${getPriorityColor(
            recommendation.priority
          )}`}
        >
          <div className="flex items-start space-x-4">
            {getTypeIcon(recommendation.type)}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {recommendation.title}
              </h3>
              <p className="text-gray-400 mb-4">{recommendation.description}</p>

              {recommendation.actions && recommendation.actions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">
                    Actions recommandées:
                  </h4>
                  <ul className="space-y-1">
                    {recommendation.actions.map((action, actionIndex) => (
                      <li
                        key={actionIndex}
                        className="flex items-center text-sm text-gray-400"
                      >
                        <ArrowRight className="w-3 h-3 mr-2" />
                        {typeof action === "string" ? action : action.title}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {recommendations.length === 0 && (
        <div className="glass-card rounded-xl p-6 text-center">
          <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">
            Continuez votre apprentissage pour recevoir des recommandations
            personnalisées.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
