import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import { useTheme } from "../contexts/ThemeContext";
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
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
        `${api.API_URL}/api/search/suggestions?query=${encodeURIComponent(query)}`,
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
        `${api.API_URL}/api/search/global?query=${encodeURIComponent(searchQuery)}${typeParam}&limit=20`,
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

      const newHistory = [
        searchQuery,
        ...searchHistory.filter(h => h !== searchQuery),
      ].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem("searchHistory", JSON.stringify(newHistory));

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

      await rewardAction("use_semantic_search");
    } catch (error) {
      console.error("Error in semantic search:", error);
      toast.error("Recherche sémantique non disponible");
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
        return <Target className="w-5 h-5 text-blue-500" />;
      case "forum":
        return <MessageSquare className="w-5 h-5 text-green-500" />;
      case "resource":
        return <Share2 className="w-5 h-5 text-purple-500" />;
      case "group":
        return <Users className="w-5 h-5 text-orange-500" />;
      case "achievement":
        return <Award className="w-5 h-5 text-yellow-500" />;
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
      <div className={`fixed inset-0 backdrop-blur-sm z-50 flex items-start justify-center pt-20 ${
        isDark ? "bg-black/70" : "bg-black/30"
      }`}>
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className={`w-full max-w-3xl mx-4 rounded-xl shadow-2xl overflow-hidden ${
            isDark ? "bg-gray-900" : "bg-white"
          }`}
        >
          {/* Header */}
          <div className={`p-6 border-b ${isDark ? "border-gray-800" : "border-slate-200"}`}>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-3 w-5 h-5 ${isDark ? "text-gray-400" : "text-slate-400"}`} />
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
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className={`px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100"
                      : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
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
                      : isDark
                      ? "bg-gray-800 text-gray-400 hover:text-gray-300"
                      : "bg-slate-100 text-slate-500 hover:text-slate-700"
                  }`}
                  title="Recherche sémantique avec IA"
                >
                  <Brain className="w-5 h-5" />
                </button>

                <button
                  onClick={onClose}
                  className={`p-3 transition-colors ${
                    isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-500 hover:text-slate-700"
                  }`}
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
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors disabled:opacity-50 flex items-center"
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
            <div className={`p-4 border-b ${isDark ? "border-gray-800" : "border-slate-200"}`}>
              <h3 className={`text-sm font-medium mb-2 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
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
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      isDark
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Historique de recherche */}
          {searchHistory.length > 0 && query.length === 0 && (
            <div className={`p-4 border-b ${isDark ? "border-gray-800" : "border-slate-200"}`}>
              <h3 className={`text-sm font-medium mb-2 ${isDark ? "text-gray-400" : "text-slate-500"}`}>
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
                    className={`px-3 py-1 rounded-full text-sm transition-colors flex items-center ${
                      isDark
                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
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
                <Loader2 className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
                <p className={isDark ? "text-gray-400" : "text-slate-500"}>
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
                    className={`p-4 rounded-lg cursor-pointer transition-colors group ${
                      isDark
                        ? "bg-gray-800/50 hover:bg-gray-800/70"
                        : "bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-white"}`}>
                        {getResultIcon(result.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`text-lg font-semibold transition-colors ${
                            isDark
                              ? "text-gray-200 group-hover:text-white"
                              : "text-slate-800 group-hover:text-slate-900"
                          }`}>
                            {result.title}
                          </h3>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            isDark
                              ? "bg-gray-700 text-gray-300"
                              : "bg-slate-200 text-slate-600"
                          }`}>
                            {getTypeLabel(result.type)}
                          </span>
                        </div>

                        <p className={`text-sm mb-2 line-clamp-2 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                          {result.description}
                        </p>

                        {result.aiExplanation && (
                          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 mb-2">
                            <div className="flex items-center mb-1">
                              <Sparkles className="w-3 h-3 text-purple-500 mr-1" />
                              <span className="text-xs font-medium text-purple-500">
                                IA Insight
                              </span>
                            </div>
                            <p className={`text-xs ${isDark ? "text-gray-300" : "text-slate-600"}`}>
                              {result.aiExplanation}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className={`flex items-center space-x-3 text-xs ${isDark ? "text-gray-500" : "text-slate-500"}`}>
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

                          <div className="flex items-center text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity">
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
                <Search className={`w-12 h-12 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-slate-400"}`} />
                <p className={`mb-2 ${isDark ? "text-gray-400" : "text-slate-500"}`}>Aucun résultat trouvé</p>
                <p className={`text-sm ${isDark ? "text-gray-500" : "text-slate-400"}`}>
                  Essayez des termes différents ou utilisez la recherche sémantique
                </p>
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: Target, color: "text-blue-500", label: "Objectifs" },
                    { icon: MessageSquare, color: "text-green-500", label: "Discussions" },
                    { icon: Share2, color: "text-purple-500", label: "Ressources" },
                    { icon: Users, color: "text-orange-500", label: "Groupes" },
                    { icon: Award, color: "text-yellow-500", label: "Achievements" },
                    { icon: Brain, color: "text-pink-500", label: "IA Sémantique" },
                  ].map(({ icon: Icon, color, label }) => (
                    <div
                      key={label}
                      className={`p-4 rounded-lg text-center ${isDark ? "bg-gray-800/30" : "bg-slate-100"}`}
                    >
                      <Icon className={`w-8 h-8 ${color} mx-auto mb-2`} />
                      <p className={`text-sm ${isDark ? "text-gray-300" : "text-slate-600"}`}>{label}</p>
                    </div>
                  ))}
                </div>
                <p className={isDark ? "text-gray-400" : "text-slate-500"}>
                  Recherchez dans tous les contenus de la plateforme
                </p>
              </div>
            )}
          </div>

          {/* Footer avec raccourcis */}
          <div className={`p-4 border-t ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-slate-50 border-slate-200"}`}>
            <div className={`flex items-center justify-between text-xs ${isDark ? "text-gray-500" : "text-slate-500"}`}>
              <div className="flex items-center space-x-4">
                <span>Enter Rechercher</span>
                <span>Esc Fermer</span>
                {showSemanticSearch && <span>IA activée</span>}
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
