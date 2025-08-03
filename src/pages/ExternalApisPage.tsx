import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { api } from "../config/api";
import {
  Brain,
  Database,
  Newspaper,
  CloudSun,
  Loader2,
  AlertCircle,
  Search,
  ExternalLink,
  Clock,
  ThermometerSun,
  Wind,
  Droplets,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DatasetExplorer from "../components/DatasetExplorer";
import NewsWidget from "../components/NewsWidget";
import OllamaChat from "../components/OllamaChat";

function ExternalApisPage() {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [activeTab, setActiveTab] = useState<
    "ollama" | "datasets" | "news" | "weather"
  >("ollama");
  const [weatherData, setWeatherData] = useState<any>(null);
  const [weatherCity, setWeatherCity] = useState("Dakar");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const fetchWeatherData = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!weatherCity.trim()) return;

    try {
      setWeatherLoading(true);
      setWeatherError(null);

      const response = await fetch(
        `${api.API_URL}/api/external/weather?city=${encodeURIComponent(
          weatherCity
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des données météo");
      }

      const data = await response.json();
      setWeatherData(data);

      // Récompenser l'utilisateur pour l'utilisation de l'API
      await rewardAction("use_external_api");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherError(
        "Impossible de récupérer les données météo pour cette ville"
      );
      toast.error("Erreur lors de la récupération des données météo");
    } finally {
      setWeatherLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">APIs Externes</h1>
          <p className="text-gray-400 mt-2">
            Explorez et interagissez avec différentes APIs pour enrichir votre
            apprentissage
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab("ollama")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "ollama"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center">
              <Brain className="w-4 h-4 mr-1" />
              Assistant IA Local
            </div>
          </button>
          <button
            onClick={() => setActiveTab("datasets")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "datasets"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center">
              <Database className="w-4 h-4 mr-1" />
              Datasets
            </div>
          </button>
          <button
            onClick={() => setActiveTab("news")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "news"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center">
              <Newspaper className="w-4 h-4 mr-1" />
              Actualités IA
            </div>
          </button>
          <button
            onClick={() => setActiveTab("weather")}
            className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
              activeTab === "weather"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center">
              <CloudSun className="w-4 h-4 mr-1" />
              Météo
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === "ollama" && <OllamaChat />}
        {activeTab === "datasets" && <DatasetExplorer />}
        {activeTab === "news" && <NewsWidget />}

        {activeTab === "weather" && (
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
              <CloudSun className="w-5 h-5 text-blue-400 mr-2" />
              Données Météo
            </h2>

            <form onSubmit={fetchWeatherData} className="mb-6 flex space-x-2">
              <input
                type="text"
                value={weatherCity}
                onChange={e => setWeatherCity(e.target.value)}
                placeholder="Entrez une ville..."
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={weatherLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
              >
                {weatherLoading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Rechercher
              </button>
            </form>

            {weatherError && (
              <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 mb-6 flex items-start">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-red-300">{weatherError}</p>
              </div>
            )}

            {weatherData && (
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold text-gray-100 mb-1">
                      {weatherData.name}, {weatherData.sys.country}
                    </h3>
                    <div className="flex items-center">
                      <img
                        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt={weatherData.weather[0].description}
                        className="w-16 h-16"
                      />
                      <div>
                        <p className="text-4xl font-bold text-gray-100">
                          {Math.round(weatherData.main.temp)}°C
                        </p>
                        <p className="text-gray-300 capitalize">
                          {weatherData.weather[0].description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <ThermometerSun className="w-5 h-5 text-yellow-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-400">Ressenti</p>
                        <p className="text-lg font-semibold text-gray-200">
                          {Math.round(weatherData.main.feels_like)}°C
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Droplets className="w-5 h-5 text-blue-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-400">Humidité</p>
                        <p className="text-lg font-semibold text-gray-200">
                          {weatherData.main.humidity}%
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Wind className="w-5 h-5 text-green-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-400">Vent</p>
                        <p className="text-lg font-semibold text-gray-200">
                          {Math.round(weatherData.wind.speed * 3.6)} km/h
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-purple-400 mr-2" />
                      <div>
                        <p className="text-sm text-gray-400">Mise à jour</p>
                        <p className="text-lg font-semibold text-gray-200">
                          {new Date(weatherData.dt * 1000).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 rounded-lg bg-gray-800/50">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                À propos de cette API
              </h3>
              <p className="text-gray-400 mb-4">
                Cette démo utilise l'API OpenWeather pour récupérer les données
                météorologiques en temps réel pour n'importe quelle ville dans
                le monde.
              </p>
              <div className="flex items-center">
                <a
                  href="https://openweathermap.org/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center"
                >
                  Documentation OpenWeather
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExternalApisPage;
