import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { api } from "../config/api";
import {
  Cloud,
  Search,
  Loader2,
  AlertCircle,
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Gauge,
  MapPin,
  Calendar,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface WeatherData {
  name: string;
  sys: {
    country: string;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  coord: {
    lat: number;
    lon: number;
  };
}

const WeatherWidget: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [searchCity, setSearchCity] = useState("Dakar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Charger la météo de Dakar par défaut
    fetchWeather("Dakar");
  }, []);

  const fetchWeather = async (city: string = searchCity) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${api.API_URL}/api/external/weather?city=${encodeURIComponent(city)}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = "Erreur lors de la récupération des données météo";

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorMessage;
        } catch {
          // Si ce n'est pas du JSON, utiliser le message par défaut
          errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setWeatherData(data);

      // Récompenser l'utilisateur pour l'utilisation de l'API
      await rewardAction("use_weather_api");
    } catch (error) {
      console.error("Error fetching weather:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Impossible de récupérer les données météo"
      );
      toast.error("Erreur lors de la récupération des données météo");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCity.trim()) {
      fetchWeather(searchCity.trim());
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
        <Cloud className="w-5 h-5 text-blue-400 mr-2" />
        Données Météo en Temps Réel
      </h2>

      <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchCity}
            onChange={e => setSearchCity(e.target.value)}
            placeholder="Rechercher une ville (ex: Dakar, Paris, New York)..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
        <button
          type="submit"
          disabled={loading || !searchCity.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Search className="w-4 h-4 mr-2" />
          )}
          Rechercher
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 mb-6 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mr-3" />
          <p className="text-gray-400">Récupération des données météo...</p>
        </div>
      ) : weatherData ? (
        <div className="space-y-6">
          {/* Informations principales */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-2">
              <MapPin className="w-5 h-5 text-blue-400 mr-2" />
              <h3 className="text-2xl font-bold text-gray-100">
                {weatherData.name}, {weatherData.sys.country}
              </h3>
            </div>
            <p className="text-gray-400">
              {weatherData.weather[0].description.charAt(0).toUpperCase() +
                weatherData.weather[0].description.slice(1)}
            </p>
            <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
              <span>Lat: {weatherData.coord.lat.toFixed(4)}</span>
              <span className="mx-2">•</span>
              <span>Lon: {weatherData.coord.lon.toFixed(4)}</span>
            </div>
          </div>

          {/* Cartes météo */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <Thermometer className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-gray-100">
                  {Math.round(weatherData.main.temp)}°C
                </span>
              </div>
              <p className="text-blue-400 font-medium">Température</p>
              <p className="text-gray-400 text-sm">
                Ressenti: {Math.round(weatherData.main.feels_like)}°C
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30">
              <div className="flex items-center justify-between mb-4">
                <Droplets className="w-8 h-8 text-cyan-400" />
                <span className="text-3xl font-bold text-gray-100">
                  {weatherData.main.humidity}%
                </span>
              </div>
              <p className="text-cyan-400 font-medium">Humidité</p>
              <p className="text-gray-400 text-sm">
                Pression: {weatherData.main.pressure} hPa
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <Wind className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-gray-100">
                  {Math.round(weatherData.wind.speed * 3.6)}
                </span>
              </div>
              <p className="text-green-400 font-medium">Vent (km/h)</p>
              <p className="text-gray-400 text-sm">Vitesse du vent</p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <Eye className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-gray-100">
                  {Math.round(weatherData.visibility / 1000)}
                </span>
              </div>
              <p className="text-purple-400 font-medium">Visibilité (km)</p>
              <p className="text-gray-400 text-sm">Conditions visuelles</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => fetchWeather()}
              disabled={loading}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Actualiser
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Cloud className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            Recherchez une ville pour voir les données météo
          </p>
        </div>
      )}

      <div className="mt-8 p-4 rounded-lg bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">
          À propos de cette API
        </h3>
        <p className="text-gray-400 mb-4">
          Cette démo utilise l'API OpenWeatherMap pour récupérer des données
          météorologiques en temps réel pour n'importe quelle ville dans le
          monde.
        </p>
        <div className="flex items-center">
          <a
            href="https://openweathermap.org/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center"
          >
            Documentation OpenWeatherMap API
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
