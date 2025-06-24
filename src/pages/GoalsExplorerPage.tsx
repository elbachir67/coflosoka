import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Lock,
  AlertCircle,
  Sparkles,
  Target,
  BookOpen,
  Clock,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GoalCard from "../components/GoalCard";
import { Goal, GoalCategory, GoalDifficulty } from "../types";
import { api } from "../config/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import {
  filterGoalsByUserProfile,
  filterGoalsBySearch,
} from "../utils/goalFilters";

function GoalsExplorerPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasCompletedAssessment } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    GoalCategory | "all"
  >("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    GoalDifficulty | "all"
  >("all");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showAssessmentBanner, setShowAssessmentBanner] = useState(
    !hasCompletedAssessment
  );

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/goals");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer le profil utilisateur
        const profileResponse = await fetch(api.profiles, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!profileResponse.ok) {
          throw new Error("Erreur lors du chargement du profil");
        }

        const profileData = await profileResponse.json();
        setUserProfile(profileData);

        // Récupérer les objectifs avec les paramètres du profil
        const goalsResponse = await fetch(
          `${api.goals}?${new URLSearchParams({
            mathLevel: profileData.preferences.mathLevel,
            programmingLevel: profileData.preferences.programmingLevel,
            preferredDomain: profileData.preferences.preferredDomain,
          })}`,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!goalsResponse.ok) {
          throw new Error("Erreur lors du chargement des objectifs");
        }

        const goalsData = await goalsResponse.json();

        // Filtrer et marquer les objectifs recommandés
        const { recommended, others } = filterGoalsByUserProfile(
          goalsData,
          profileData
        );
        setGoals([...recommended, ...others]);
      } catch (error) {
        console.error("Erreur:", error);
        setError(
          error instanceof Error ? error.message : "Erreur lors du chargement"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, hasCompletedAssessment, navigate]);

  // Filtrer les objectifs selon la recherche et les filtres
  const filteredGoals = filterGoalsBySearch(
    goals,
    searchQuery,
    selectedCategory === "all" ? undefined : selectedCategory,
    selectedDifficulty === "all" ? undefined : selectedDifficulty
  );

  // Séparer les objectifs recommandés des autres
  const recommendedGoals = filteredGoals.filter(goal => goal.isRecommended);
  const otherGoals = filteredGoals.filter(goal => !goal.isRecommended);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-gray-400">Chargement des objectifs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">
                Objectifs d'Apprentissage
              </h1>
              <p className="text-gray-400 mt-1">
                Explorez nos parcours structurés et choisissez celui qui
                correspond à vos ambitions
              </p>
            </div>
          </div>

          {/* Bannière d'évaluation */}
          {showAssessmentBanner && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-xl p-6 mb-8 bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-purple-500/20 relative overflow-hidden"
            >
              <button
                onClick={() => setShowAssessmentBanner(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-6 md:mb-0 md:mr-6">
                  <h2 className="text-xl font-bold text-gray-100 mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
                    Obtenez des recommandations personnalisées
                  </h2>
                  <p className="text-gray-300">
                    Complétez notre évaluation rapide pour obtenir des
                    recommandations adaptées à votre profil et à vos objectifs.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/assessment")}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center whitespace-nowrap"
                >
                  Faire l'évaluation
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Filtres */}
          <div className="glass-card rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="Rechercher un objectif..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-10"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              </div>

              {/* Filtres */}
              <div className="flex items-center space-x-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <select
                    value={selectedCategory}
                    onChange={e =>
                      setSelectedCategory(
                        e.target.value as GoalCategory | "all"
                      )
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10"
                  >
                    <option value="all">Toutes les catégories</option>
                    <option value="ml">Machine Learning</option>
                    <option value="dl">Deep Learning</option>
                    <option value="data_science">Data Science</option>
                    <option value="mlops">MLOps</option>
                    <option value="computer_vision">Computer Vision</option>
                    <option value="nlp">NLP</option>
                  </select>
                  <Filter className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>

                <div className="relative flex-1 md:flex-none">
                  <select
                    value={selectedDifficulty}
                    onChange={e =>
                      setSelectedDifficulty(
                        e.target.value as GoalDifficulty | "all"
                      )
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10"
                  >
                    <option value="all">Tous les niveaux</option>
                    <option value="beginner">Débutant</option>
                    <option value="intermediate">Intermédiaire</option>
                    <option value="advanced">Avancé</option>
                  </select>
                  <Filter className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Objectifs recommandés */}
        {recommendedGoals.length > 0 && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-12"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center">
              <Sparkles className="w-5 h-5 text-yellow-400 mr-2" />
              Recommandés pour vous
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedGoals.map(goal => (
                <motion.div key={goal._id} variants={item}>
                  <GoalCard goal={goal} isRecommended={true} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Autres objectifs */}
        <motion.div variants={container} initial="hidden" animate="show">
          <h2 className="text-xl font-semibold text-gray-100 mb-6 flex items-center">
            <Target className="w-5 h-5 text-blue-400 mr-2" />
            Tous les objectifs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherGoals.map(goal => (
              <motion.div key={goal._id} variants={item}>
                <GoalCard goal={goal} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Message si aucun résultat */}
        {filteredGoals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 glass-card rounded-xl p-8"
          >
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">
              Aucun objectif ne correspond à vos critères de recherche.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedDifficulty("all");
              }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default GoalsExplorerPage;
