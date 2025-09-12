import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { api } from "../config/api";
import {
  Cloud,
  Database,
  MessageSquare,
  Bot,
  Loader2,
  AlertCircle,
  ExternalLink,
  Zap,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";
import WeatherWidget from "../components/WeatherWidget";
import NewsWidget from "../components/NewsWidget";
import DatasetExplorer from "../components/DatasetExplorer";
import OllamaChat from "../components/OllamaChat";

const ExternalApisPage: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [activeTab, setActiveTab] = useState<
    "weather" | "news" | "datasets" | "ollama"
  >("weather");

  const tabs = [
    {
      id: "weather",
      label: "Météo",
      icon: Cloud,
      description: "Données météorologiques en temps réel",
      color: "blue",
    },
    {
      id: "news",
      label: "Actualités IA",
      icon: Database,
      description: "Dernières nouvelles en intelligence artificielle",
      color: "green",
    },
    {
      id: "datasets",
      label: "Datasets",
      icon: Database,
      description: "Explorer des datasets pour vos projets",
      color: "purple",
    },
    {
      id: "ollama",
      label: "Assistant IA Local",
      icon: Bot,
      description: "Chat avec un modèle IA local (Ollama)",
      color: "orange",
    },
  ];

  const handleTabChange = async (tabId: string) => {
    setActiveTab(tabId as any);
    // Récompenser l'utilisateur pour l'exploration des APIs
    await rewardAction("explore_external_api", { api: tabId });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20">
              <ExternalLink className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
            APIs Externes
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto mb-6">
            Explorez des données en temps réel grâce à l'intégration d'APIs
            externes. Météo, actualités, datasets et intelligence artificielle à
            votre portée.
          </p>
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
              <Zap className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">
                APIs Réelles Connectées
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="glass-card rounded-xl p-2 mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap rounded-lg transition-all duration-200 flex items-center space-x-3 min-w-0 ${
                    isActive
                      ? `bg-gradient-to-r from-${tab.color}-500/20 to-${tab.color}-600/20 text-${tab.color}-400 border border-${tab.color}-500/30 shadow-lg`
                      : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="text-left">
                    <div className="font-semibold">{tab.label}</div>
                    <div className="text-xs opacity-75">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="min-h-[600px]">
          {activeTab === "weather" && <WeatherWidget />}
          {activeTab === "news" && <NewsWidget />}
          {activeTab === "datasets" && <DatasetExplorer />}
          {activeTab === "ollama" && <OllamaChat />}
        </div>

        {/* Footer Info */}
        <div className="mt-12 glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
            <ExternalLink className="w-5 h-5 text-blue-400 mr-2" />À propos des
            APIs Externes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-300 mb-2">
                Objectifs Pédagogiques
              </h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Apprendre l'intégration d'APIs tierces</li>
                <li>• Comprendre les formats de données JSON</li>
                <li>• Pratiquer la gestion d'erreurs réseau</li>
                <li>• Explorer des sources de données réelles</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-300 mb-2">
                Technologies Utilisées
              </h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• OpenWeatherMap API pour la météo</li>
                <li>• News API pour les actualités</li>
                <li>• Kaggle API pour les datasets</li>
                <li>• Ollama pour l'IA locale</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalApisPage;
