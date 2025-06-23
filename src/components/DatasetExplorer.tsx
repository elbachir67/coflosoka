import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { api } from "../config/api";
import {
  Database,
  Search,
  Loader2,
  AlertCircle,
  ExternalLink,
  Download,
  FileText,
  BarChart,
  Users,
  Calendar,
  ThumbsUp,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Dataset {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  downloadCount: number;
  voteCount: number;
  usabilityRating: number;
  lastUpdated: string;
  ownerName: string;
  ownerRef: string;
  totalBytes: number;
  tags: string[];
}

const DatasetExplorer: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [searchQuery, setSearchQuery] = useState("");
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      setPage(1);

      const response = await fetch(
        `${api.API_URL}/api/external/kaggle/datasets?query=${encodeURIComponent(
          searchQuery
        )}&page=1&pageSize=10`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche de datasets");
      }

      const data = await response.json();
      setDatasets(data);

      // Récompenser l'utilisateur pour l'utilisation de l'API
      await rewardAction("search_datasets");
    } catch (error) {
      console.error("Error searching datasets:", error);
      setError(
        "Impossible de récupérer les datasets. Veuillez réessayer plus tard."
      );
      toast.error("Erreur lors de la recherche de datasets");
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
        <Database className="w-5 h-5 text-blue-400 mr-2" />
        Explorateur de Datasets
      </h2>

      <form onSubmit={handleSearch} className="mb-6 flex space-x-2">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Rechercher des datasets (ex: machine learning, computer vision)..."
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          disabled={loading || !searchQuery.trim()}
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
          <p className="text-gray-400">Recherche de datasets...</p>
        </div>
      ) : datasets.length > 0 ? (
        <div className="space-y-6">
          {datasets.map(dataset => (
            <div
              key={dataset.id}
              className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-200">
                  {dataset.title}
                </h3>
                <a
                  href={`https://www.kaggle.com/datasets/${dataset.ownerRef}/${dataset.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                  onClick={() => rewardAction("view_dataset")}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Voir
                </a>
              </div>

              <p className="text-gray-400 mb-3 line-clamp-2">
                {dataset.description || dataset.subtitle}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 text-blue-400 mr-1" />
                  <span className="text-gray-300">
                    {formatBytes(dataset.totalBytes)}
                  </span>
                </div>
                <div className="flex items-center">
                  <Download className="w-4 h-4 text-green-400 mr-1" />
                  <span className="text-gray-300">
                    {dataset.downloadCount} téléchargements
                  </span>
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-gray-300">
                    {dataset.voteCount} votes
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 text-purple-400 mr-1" />
                  <span className="text-gray-300">
                    {formatDate(dataset.lastUpdated)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {dataset.tags.slice(0, 5).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
                {dataset.tags.length > 5 && (
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs">
                    +{dataset.tags.length - 5}
                  </span>
                )}
              </div>
            </div>
          ))}

          {datasets.length >= 10 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={async () => {
                  try {
                    setLoading(true);
                    const nextPage = page + 1;

                    const response = await fetch(
                      `${
                        api.API_URL
                      }/api/external/kaggle/datasets?query=${encodeURIComponent(
                        searchQuery
                      )}&page=${nextPage}&pageSize=10`,
                      {
                        headers: {
                          Authorization: `Bearer ${user?.token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    if (!response.ok) {
                      throw new Error(
                        "Erreur lors du chargement de plus de datasets"
                      );
                    }

                    const newData = await response.json();
                    setDatasets([...datasets, ...newData]);
                    setPage(nextPage);
                  } catch (error) {
                    console.error("Error loading more datasets:", error);
                    toast.error(
                      "Erreur lors du chargement de plus de datasets"
                    );
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <BarChart className="w-4 h-4 mr-2" />
                )}
                Charger plus
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Aucun dataset trouvé</p>
          <p className="text-gray-500">Essayez une recherche différente</p>
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-gray-800/50">
        <h3 className="text-lg font-semibold text-gray-200 mb-2">
          À propos de cette API
        </h3>
        <p className="text-gray-400 mb-4">
          Cette démo utilise l'API Kaggle pour rechercher des datasets. Kaggle
          est l'une des plus grandes plateformes de data science et machine
          learning, avec des milliers de datasets publics.
        </p>
        <div className="flex items-center">
          <a
            href="https://www.kaggle.com/docs/api"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center"
          >
            Documentation Kaggle API
            <ExternalLink className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default DatasetExplorer;
