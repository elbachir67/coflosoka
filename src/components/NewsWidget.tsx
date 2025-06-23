import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { api } from "../config/api";
import {
  Newspaper,
  Search,
  Loader2,
  AlertCircle,
  ExternalLink,
  Calendar,
  User,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}

const NewsWidget: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [searchQuery, setSearchQuery] = useState("intelligence artificielle");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${api.API_URL}/api/external/news?query=${encodeURIComponent(
          searchQuery
        )}&pageSize=12`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des actualités");
      }

      const data = await response.json();
      setArticles(data.articles || []);

      // Récompenser l'utilisateur pour l'utilisation de l'API
      await rewardAction("read_news");
    } catch (error) {
      console.error("Error fetching news:", error);
      setError(
        "Impossible de récupérer les actualités. Veuillez réessayer plus tard."
      );
      toast.error("Erreur lors de la récupération des actualités");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
        <Newspaper className="w-5 h-5 text-green-400 mr-2" />
        Actualités IA
      </h2>

      <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Rechercher des actualités..."
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={loading || !searchQuery.trim()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
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
          <Loader2 className="w-8 h-8 text-green-400 animate-spin mr-3" />
          <p className="text-gray-400">Chargement des actualités...</p>
        </div>
      ) : articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg overflow-hidden bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
              onClick={() => rewardAction("click_news_article")}
            >
              {article.urlToImage && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-200 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 mb-3 text-sm line-clamp-3">
                  {article.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    <span>{article.source.name}</span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Newspaper className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Aucun article trouvé</p>
          <p className="text-gray-500">Essayez une recherche différente</p>
        </div>
      )}

      {articles.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={fetchNews}
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
      )}

      <div className="mt-6 p-4 rounded-lg bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">
          À propos de cette API
        </h3>
        <p className="text-gray-400 mb-4">
          Cette démo utilise l'API News pour récupérer les dernières actualités
          sur l'intelligence artificielle et les technologies associées.
        </p>
        <div className="flex items-center">
          <a
            href="https://newsapi.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center"
          >
            Documentation News API
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsWidget;
