import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Download,
  Loader2,
  Target,
  Clock,
  BarChart,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Goal } from "../types";

function AdminGoalsPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }

    fetchGoals();
  }, [isAdmin, navigate]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.goals}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setGoals(data);
      } else {
        throw new Error("Erreur lors du chargement");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors du chargement des objectifs");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) return;

    try {
      const response = await fetch(`${api.goals}/${goalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (response.ok) {
        toast.success("Objectif supprimé avec succès");
        fetchGoals();
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || goal.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "all" || goal.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-500/20 text-green-400";
      case "intermediate":
        return "bg-blue-500/20 text-blue-400";
      case "advanced":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "ml":
        return "🤖";
      case "dl":
        return "🧠";
      case "computer_vision":
        return "👁️";
      case "nlp":
        return "💬";
      case "data_science":
        return "📊";
      case "mlops":
        return "⚙️";
      default:
        return "🎯";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement des objectifs...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">
              Gestion des Objectifs
            </h1>
            <p className="text-gray-400 mt-2">
              Créez et gérez les objectifs d'apprentissage
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Retour
            </button>
            <button
              onClick={() => navigate("/admin/goals/new")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Objectif
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-64">
              <input
                type="text"
                placeholder="Rechercher un objectif..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>

            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Toutes les catégories</option>
              <option value="ml">Machine Learning</option>
              <option value="dl">Deep Learning</option>
              <option value="computer_vision">Computer Vision</option>
              <option value="nlp">NLP</option>
              <option value="data_science">Data Science</option>
              <option value="mlops">MLOps</option>
            </select>

            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <div key={goal._id} className="glass-card p-6 rounded-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">
                    {getCategoryIcon(goal.category)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                      goal.level
                    )}`}
                  >
                    {goal.level}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => navigate(`/goals/${goal._id}`)}
                    className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/goals/${goal._id}/edit`)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal._id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-100 mb-2">
                {goal.title}
              </h3>
              <p className="text-gray-400 mb-4 line-clamp-2">
                {goal.description}
              </p>

              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{goal.estimatedDuration} sem.</span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 mr-1" />
                  <span>{goal.modules?.length || 0} modules</span>
                </div>
                <div className="flex items-center">
                  <BarChart className="w-4 h-4 mr-1" />
                  <span>{goal.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">Aucun objectif trouvé</p>
            <button
              onClick={() => navigate("/admin/goals/new")}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Créer le premier objectif
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminGoalsPage;
