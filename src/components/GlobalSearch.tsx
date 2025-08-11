import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { api } from "../config/api";
import {
  Search,
  X,
  Loader2,
  Brain,
  BookOpen,
  MessageSquare,
  Users,
  Award,
  Share2,
  Target,
  Sparkles,
  Clock,
  TrendingUp,
  Filter,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResult {
  id: string;
  type: "goal" | "forum" | "resource" | "group" | "achievement";
  title: string;
  description: string;
  url: string;
  relevance: number;
  aiExplanation?: string;
  metadata?: any;
  author?: string;
  category?: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [showSemanticSearch, setShowSemanticSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Charger l'historique de recherche depuis localStorage
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const debounceTimer = setTimeout(() => {
        fetchSuggestions();
      }, 300);

      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        `${api.API_URL}/api/search/suggestions?query=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const typeParam = selectedType !== "all" ? `&type=${selectedType}` : "";
      const response = await fetch(
        `${api.API_URL}/api/search/global?query=${encodeURIComponent(
          searchQuery
        )}${typeParam}&limit=20`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data = await response.json();
      setResults(data.results);

      // Ajouter à l'historique
      const newHistory = [
        searchQuery,
        ...searchHistory.filter(h => h !== searchQuery),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));

      // Récompenser l'utilisateur pour l'utilisation de la recherche
      await rewardAction("use_global_search");
    } catch (error) {
      console.error("Error searching:", error);
      toast.error("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const handleSemanticSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${api.API_URL}/api/search/semantic`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          context: "learning platform",
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche sémantique");
      }

      const data = await response.json();
      setResults(data.results);
      toast.success("Recherche sémantique effectuée avec succès");

      // Récompenser l'utilisateur pour l'utilisation de la recherche sémantique
      await rewardAction("use_semantic_search");
    } catch (error) {
      console.error("Error in semantic search:", error);
      toast.error("Recherche sémantique non disponible");
      // Fallback vers recherche normale
      handleSearch();
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "resource" && result.url.startsWith("http")) {
      window.open(result.url, "_blank");
    } else {
      navigate(result.url);
      onClose();
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "goal":
        return <Target className="w-5 h-5 text-blue-400" />;
      case "forum":
        return <MessageSquare className="w-5 h-5 text-green-400" />;
      case "resource":
        return <Share2 className="w-5 h-5 text-purple-400" />;
      case "group":
        return <Users className="w-5 h-5 text-orange-400" />;
      case "achievement":
        return <Award className="w-5 h-5 text-yellow-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "goal":
        return "Objectif";
      case "forum":
        return "Discussion";
      case "resource":
        return "Ressource";
      case "group":
        return "Groupe";
      case "achievement":
        return "Achievement";
      default:
        return "Contenu";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="w-full max-w-3xl mx-4 bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      handleSearch();
                    } else if (e.key === "Escape") {
                      onClose();
                    }
                  }}
                  placeholder="Rechercher dans toute la plateforme..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">Tout</option>
                  <option value="goals">Objectifs</option>
                  <option value="forum">Forum</option>
                  <option value="resources">Ressources</option>
                  <option value="groups">Groupes</option>
                  <option value="achievements">Achievements</option>
                </select>

                <button
                  onClick={() => setShowSemanticSearch(!showSemanticSearch)}
                  className={`p-3 rounded-lg transition-colors ${
                    showSemanticSearch
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-gray-300"
                  }`}
                  title="Recherche sémantique avec IA"
                >
                  <Brain className="w-5 h-5" />
                </button>

                <button
                  onClick={onClose}
                  className="p-3 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions de recherche */}
            <div className="flex items-center space-x-3 mt-4">
              <button
                onClick={() => handleSearch()}
                disabled={!query.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Rechercher
              </button>

              {showSemanticSearch && (
                <button
                  onClick={handleSemanticSearch}
                  disabled={!query.trim() || loading}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Recherche IA
                </button>
              )}
            </div>
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && query.length >= 2 && (
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Suggestions :
              </h3>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion);
                      handleSearch(suggestion);
                    }}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Historique de recherche */}
          {searchHistory.length > 0 && query.length === 0 && (
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-sm font-medium text-gray-400 mb-2">
                Recherches récentes :
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 5).map((historyItem, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(historyItem);
                      handleSearch(historyItem);
                    }}
                    className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {historyItem}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Résultats */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">
                  {showSemanticSearch
                    ? "Recherche intelligente en cours..."
                    : "Recherche en cours..."}
                </p>
              </div>
            ) : results.length > 0 ? (
              <div className="p-4 space-y-3">
                {results.map((result, index) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleResultClick(result)}
                    className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-gray-700/50">
                        {getResultIcon(result.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-200 group-hover:text-white transition-colors">
                            {result.title}
                          </h3>
                          <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>

                        <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                          {result.description}
                        </p>

                        {result.aiExplanation && (
                          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-2">
                            <div className="flex items-center mb-1">
                              <Sparkles className="w-3 h-3 text-purple-400 mr-1" />
                              <span className="text-xs font-medium text-purple-400">
                                IA Insight
                              </span>
                            </div>
                            <p className="text-xs text-gray-300">
                              {result.aiExplanation}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            {result.author && <span>Par {result.author}</span>}
                            {result.metadata?.likes !== undefined && (
                              <span>{result.metadata.likes} likes</span>
                            )}
                            {result.metadata?.members !== undefined && (
                              <span>{result.metadata.members} membres</span>
                            )}
                            {result.metadata?.duration !== undefined && (
                              <span>{result.metadata.duration} sem.</span>
                            )}
                          </div>

                          <div className="flex items-center text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-xs mr-1">Ouvrir</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">Aucun résultat trouvé</p>
                <p className="text-gray-500 text-sm">
                  Essayez des termes différents ou utilisez la recherche
                  sémantique
                </p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="p-4 rounded-lg bg-gray-800/30 text-center">
                    <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Objectifs</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/30 text-center">
                    <MessageSquare className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Discussions</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/30 text-center">
                    <Share2 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Ressources</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/30 text-center">
                    <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Groupes</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/30 text-center">
                    <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">Achievements</p>
                  </div>
                  <div className="p-4 rounded-lg bg-gray-800/30 text-center">
                    <Brain className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-300">IA Sémantique</p>
                  </div>
                </div>
                <p className="text-gray-400">
                  Recherchez dans tous les contenus de la plateforme
                </p>
              </div>
            )}
          </div>

          {/* Footer avec raccourcis */}
          <div className="p-4 bg-gray-800/50 border-t border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>↵ Rechercher</span>
                <span>Esc Fermer</span>
                {showSemanticSearch && <span>🧠 IA activée</span>}
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-3 h-3" />
                <span>Recherche intelligente</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default GlobalSearch;
