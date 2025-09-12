import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Loader2,
  BarChart,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { toast } from "react-hot-toast";

interface PerformancePrediction {
  successProbability: number;
  estimatedCompletionTime: number;
  recommendedDifficulty: string;
  riskFactors: string[];
  opportunities: string[];
  nextMilestones: any[];
  adaptationNeeds: string[];
}

const PerformancePrediction: React.FC = () => {
  const { user } = useAuth();
  const [prediction, setPrediction] = useState<PerformancePrediction | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrediction();
  }, []);

  const fetchPrediction = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${api.API_URL}/api/ai/performance-prediction`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des prédictions");
      }

      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error("Error fetching performance prediction:", error);
      toast.error("Erreur lors du chargement des prédictions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-5 h-5 animate-pulse" />
          <span>Analyse de vos performances...</span>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <BarChart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">
          Continuez votre parcours pour générer des prédictions de performance.
        </p>
      </div>
    );
  }

  const successPercentage = Math.round(prediction.successProbability * 100);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
        <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
        Prédictions de Performance
      </h2>

      <div className="glass-card rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="p-3 rounded-full bg-blue-500/20 mr-4">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-200">
                Probabilité de succès
              </h3>
              <p className="text-gray-400">
                Basée sur votre progression actuelle
              </p>
            </div>
          </div>
          <div className="text-4xl font-bold text-blue-400">
            {successPercentage}%
          </div>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div
            className={`h-2 rounded-full ${
              successPercentage >= 70
                ? "bg-green-500"
                : successPercentage >= 40
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{ width: `${successPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facteurs de risque */}
          {prediction.riskFactors.length > 0 && (
            <div className="p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
                <h4 className="text-md font-medium text-gray-200">
                  Facteurs de risque
                </h4>
              </div>
              <ul className="space-y-2">
                {prediction.riskFactors.map((factor, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-400 text-sm"
                  >
                    <ArrowDown className="w-3 h-3 text-red-400 mr-2" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Opportunités */}
          {prediction.opportunities.length > 0 && (
            <div className="p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <h4 className="text-md font-medium text-gray-200">
                  Opportunités
                </h4>
              </div>
              <ul className="space-y-2">
                {prediction.opportunities.map((opportunity, index) => (
                  <li
                    key={index}
                    className="flex items-center text-gray-400 text-sm"
                  >
                    <ArrowUp className="w-3 h-3 text-green-400 mr-2" />
                    {opportunity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-gray-800/50 border-l-4 border-blue-500">
          <div className="flex items-center mb-2">
            <Target className="w-5 h-5 text-blue-400 mr-2" />
            <h4 className="text-md font-medium text-gray-200">
              Niveau recommandé
            </h4>
          </div>
          <p className="text-gray-400">
            Basé sur votre profil, nous vous recommandons de suivre des parcours
            de niveau{" "}
            <span className="font-medium text-blue-400">
              {prediction.recommendedDifficulty === "beginner"
                ? "débutant"
                : prediction.recommendedDifficulty === "intermediate"
                ? "intermédiaire"
                : "avancé"}
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformancePrediction;
