import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { Goal, Module, Resource, ResourceType } from "../types";
import {
  Clock,
  CheckCircle,
  Calendar,
  Award,
  Loader2,
  AlertCircle,
  BookOpen,
  Video,
  GraduationCap,
  Laptop,
  Bot,
  ChevronDown,
  Play,
  Pause,
  ArrowRight,
  RefreshCcw,
  Rocket,
  Brain,
  Target,
  Users,
  Briefcase,
  Bookmark,
  Star,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import AdaptiveRecommendations from "../components/AdaptiveRecommendations";
import LearningProgressChart from "../components/LearningProgressChart";

interface ResourceTypeConfig {
  icon: typeof BookOpen;
  color: string;
  bg: string;
}

const resourceTypeConfig: Record<ResourceType, ResourceTypeConfig> = {
  article: { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/20" },
  video: { icon: Video, color: "text-red-400", bg: "bg-red-400/20" },
  course: {
    icon: GraduationCap,
    color: "text-green-400",
    bg: "bg-green-400/20",
  },
  book: { icon: BookOpen, color: "text-purple-400", bg: "bg-purple-400/20" },
  use_case: { icon: Laptop, color: "text-orange-400", bg: "bg-orange-400/20" },
};

const levelConfig = {
  beginner: { color: "text-green-400", bg: "bg-green-500/20" },
  intermediate: { color: "text-blue-400", bg: "bg-blue-500/20" },
  advanced: { color: "text-purple-400", bg: "bg-purple-500/20" },
};

function GoalDetailPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<{
    [key: string]: boolean;
  }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedPathwayId, setGeneratedPathwayId] = useState<string | null>(
    null
  );
  const [generatingPathway, setGeneratingPathway] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "modules" | "career">(
    "overview"
  );

  useEffect(() => {
    const fetchGoal = async () => {
      if (!goalId || !user) return;

      try {
        console.log("Fetching goal with ID:", goalId);

        const response = await fetch(`${api.goals}/${goalId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received goal data:", {
          title: data.title,
          description: data.description,
          modules: data.modules?.length,
          category: data.category,
          level: data.level,
        });

        if (!data || !data.title || !data.modules) {
          throw new Error("Invalid or incomplete goal data received");
        }

        // Ensure each resource has a valid type
        const processedData = {
          ...data,
          modules: data.modules.map((module: any) => ({
            ...module,
            resources:
              module.resources?.map((resource: any) => ({
                ...resource,
                type: resource.type || "article", // Provide default type if missing
              })) || [],
          })),
        };

        setGoal(processedData);

        const initialExpandedState =
          processedData.modules?.reduce((acc: any, _: any, index: number) => {
            acc[index] = index === 0;
            return acc;
          }, {}) || {};

        setExpandedModules(initialExpandedState);
        setError(null);
      } catch (error) {
        console.error("Error fetching goal:", error);
        setError(
          error instanceof Error ? error.message : "Erreur lors du chargement"
        );
        toast.error("Erreur lors du chargement de l'objectif");
      } finally {
        setLoading(false);
      }
    };

    if (goalId && user) {
      fetchGoal();
    }
  }, [goalId, user]);

  const generatePathway = async () => {
    if (!goal || !user) return;

    // Vérifier d'abord si un parcours existe déjà
    try {
      const checkResponse = await fetch(`${api.pathways}/user/dashboard`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      });

      if (checkResponse.ok) {
        const dashboardData = await checkResponse.json();
        const existingPathway = [
          ...dashboardData.activePathways,
          ...dashboardData.completedPathways,
        ].find(p => p.goalId._id === goal._id);

        if (existingPathway) {
          toast.error(
            "Un parcours pour cet objectif existe déjà. Consultez votre tableau de bord pour y accéder.",
            {
              duration: 5000,
              icon: <AlertCircle className="text-orange-500" />,
            }
          );
          setTimeout(() => navigate("/dashboard"), 2000);
          return;
        }
      }
    } catch (error) {
      console.log("Could not check existing pathways, proceeding...");
    }

    setGeneratingPathway(true);
    try {
      const response = await fetch(`${api.pathways}/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goalId: goal._id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Erreur lors de la génération du parcours"
        );
      }

      const pathway = await response.json();
      setGeneratedPathwayId(pathway._id);
      setShowSuccessModal(true);
      toast.success("Parcours personnalisé généré avec succès !");
    } catch (error) {
      console.error("Error:", error);

      const errorMessage = error instanceof Error ? error.message : "";

      if (errorMessage.includes("existe déjà")) {
        toast.error(
          "Un parcours pour cet objectif existe déjà. Consultez votre tableau de bord pour y accéder.",
          {
            duration: 5000,
            icon: <AlertCircle className="text-orange-500" />,
          }
        );
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        toast.error(
          errorMessage ||
            "Impossible de générer le parcours. Veuillez réessayer plus tard.",
          {
            duration: 4000,
          }
        );
      }
    } finally {
      setGeneratingPathway(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="mb-4">{error || "Objectif non trouvé"}</p>
          <button
            onClick={() => navigate("/goals")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retour aux objectifs
          </button>
        </div>
      </div>
    );
  }

  const getResourceTypeConfig = (type: string): ResourceTypeConfig => {
    return (
      resourceTypeConfig[type as ResourceType] || resourceTypeConfig.article
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-xl p-8 mb-8 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-100 mb-4">
                {goal.title}
              </h1>
              <p className="text-xl text-gray-400 mb-6">{goal.description}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center text-gray-300 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{goal.estimatedDuration} semaines</span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      levelConfig[goal.level].bg
                    } ${levelConfig[goal.level].color}`}
                  >
                    {goal.level === "beginner"
                      ? "Débutant"
                      : goal.level === "intermediate"
                      ? "Intermédiaire"
                      : "Avancé"}
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generatePathway}
                  disabled={generatingPathway}
                  className="ml-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingPathway ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5 mr-2" />
                      Générer mon parcours personnalisé
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-800 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "overview"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center">
              <Target className="w-4 h-4 mr-1" />
              Vue d'ensemble
            </div>
          </button>
          <button
            onClick={() => setActiveTab("modules")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "modules"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              Modules ({goal.modules?.length || 0})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("career")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "career"
                ? "text-purple-400 border-b-2 border-purple-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center">
              <Briefcase className="w-4 h-4 mr-1" />
              Opportunités
            </div>
          </button>
        </div>

        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Prérequis */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                <Bookmark className="w-5 h-5 text-blue-400 mr-2" />
                Prérequis
              </h2>

              <div className="space-y-4">
                {goal.prerequisites?.map((prereq, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-200 mb-2">
                      {prereq.category === "math"
                        ? "Mathématiques"
                        : prereq.category === "programming"
                        ? "Programmation"
                        : prereq.category === "theory"
                        ? "Théorie"
                        : "Outils"}
                    </h3>
                    <div className="space-y-2">
                      {prereq.skills.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="flex items-center justify-between"
                        >
                          <span className="text-gray-300">{skill.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              skill.level === "basic"
                                ? "bg-green-500/20 text-green-400"
                                : skill.level === "intermediate"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-purple-500/20 text-purple-400"
                            }`}
                          >
                            {skill.level === "basic"
                              ? "Débutant"
                              : skill.level === "intermediate"
                              ? "Intermédiaire"
                              : "Avancé"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {(!goal.prerequisites || goal.prerequisites.length === 0) && (
                  <p className="text-gray-400">
                    Aucun prérequis spécifique pour cet objectif.
                  </p>
                )}
              </div>
            </div>

            {/* Aperçu des modules */}
            <div className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-100 flex items-center">
                  <BookOpen className="w-5 h-5 text-green-400 mr-2" />
                  Aperçu des modules
                </h2>
                <button
                  onClick={() => setActiveTab("modules")}
                  className="text-purple-400 hover:text-purple-300 flex items-center text-sm"
                >
                  Voir tous les modules
                  <ChevronDown className="w-4 h-4 ml-1" />
                </button>
              </div>

              <div className="space-y-3">
                {goal.modules?.slice(0, 3).map((module, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium text-gray-200">
                        Module {index + 1}: {module.title}
                      </h3>
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{module.duration}h</span>
                      </div>
                    </div>
                    <p className="text-gray-400 mt-1">{module.description}</p>
                  </div>
                ))}

                {goal.modules?.length > 3 && (
                  <div className="text-center py-2">
                    <button
                      onClick={() => setActiveTab("modules")}
                      className="text-purple-400 hover:text-purple-300"
                    >
                      Voir les {goal.modules.length - 3} autres modules...
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recommandé pour */}
            {goal.recommendedFor && goal.recommendedFor.length > 0 && (
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                  <Users className="w-5 h-5 text-purple-400 mr-2" />
                  Recommandé pour
                </h2>

                <div className="space-y-3">
                  {goal.recommendedFor.map((recommendation, index) => (
                    <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                      <h3 className="text-lg font-medium text-gray-200 mb-1">
                        {recommendation.profile}
                      </h3>
                      <p className="text-gray-400">{recommendation.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certification */}
            {goal.certification?.available && (
              <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                  <Award className="w-5 h-5 text-yellow-400 mr-2" />
                  Certification
                </h2>

                <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-200 mb-1">
                        {goal.certification.name}
                      </h3>
                      <p className="text-gray-400">
                        Délivrée par {goal.certification.provider}
                      </p>
                    </div>

                    {goal.certification.url && (
                      <a
                        href={goal.certification.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 md:mt-0 px-4 py-2 bg-yellow-600/30 hover:bg-yellow-600/50 text-yellow-400 rounded-lg transition-colors flex items-center justify-center"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Détails de la certification
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === "modules" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {goal.modules?.map((module: Module, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card rounded-xl p-6"
              >
                <button
                  onClick={() =>
                    setExpandedModules(prev => ({
                      ...prev,
                      [index]: !prev[index],
                    }))
                  }
                  className="w-full flex items-center justify-between text-left"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-200">
                      Module {index + 1}: {module.title}
                    </h3>
                    <p className="text-gray-400 mt-1">{module.description}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedModules[index] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedModules[index] && (
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center text-gray-300">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{module.duration} heures</span>
                      </div>
                    </div>

                    {/* Compétences */}
                    {module.skills && module.skills.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-300">
                          Compétences acquises
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {module.skills.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className={`px-3 py-1 rounded-full text-sm ${
                                skill.level === "basic"
                                  ? "bg-green-500/20 text-green-400"
                                  : skill.level === "intermediate"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-purple-500/20 text-purple-400"
                              }`}
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ressources */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-medium text-gray-300">
                        Ressources
                      </h4>
                      <div className="grid gap-4">
                        {module.resources?.map(
                          (resource: Resource, resourceIndex: number) => {
                            const typeConfig = getResourceTypeConfig(
                              resource.type
                            );
                            const Icon = typeConfig.icon;
                            return (
                              <a
                                key={resourceIndex}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors group"
                              >
                                <div
                                  className={`p-2 rounded-lg ${typeConfig.bg} mr-4 group-hover:scale-110 transition-transform`}
                                >
                                  <Icon
                                    className={`w-5 h-5 ${typeConfig.color}`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-gray-200 font-medium mb-1">
                                    {resource.title}
                                  </h5>
                                  <p className="text-sm text-gray-400">
                                    {resource.duration} minutes
                                  </p>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                              </a>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {/* Critères de validation */}
                    {module.validationCriteria &&
                      module.validationCriteria.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-medium text-gray-300">
                            Critères de validation
                          </h4>
                          <ul className="space-y-2">
                            {module.validationCriteria.map(
                              (criteria, criteriaIndex) => (
                                <li
                                  key={criteriaIndex}
                                  className="flex items-start"
                                >
                                  <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                  <span className="text-gray-300">
                                    {criteria}
                                  </span>
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === "career" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Opportunités de carrière */}
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
                <Briefcase className="w-5 h-5 text-blue-400 mr-2" />
                Opportunités de carrière
              </h2>

              <div className="space-y-6">
                {goal.careerOpportunities?.map((opportunity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/50"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-200">
                        {opportunity.title}
                      </h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                        {opportunity.averageSalary}
                      </span>
                    </div>

                    <p className="text-gray-400 mb-4">
                      {opportunity.description}
                    </p>

                    <div>
                      <h4 className="text-sm font-medium text-gray-300 mb-2">
                        Entreprises qui recrutent
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {opportunity.companies.map((company, companyIndex) => (
                          <span
                            key={companyIndex}
                            className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm"
                          >
                            {company}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {(!goal.careerOpportunities ||
                  goal.careerOpportunities.length === 0) && (
                  <p className="text-gray-400 text-center py-4">
                    Aucune opportunité de carrière spécifique n'est définie pour
                    cet objectif.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bouton de génération de parcours (fixe en bas) */}
        <div className="fixed bottom-8 right-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePathway}
            disabled={generatingPathway}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generatingPathway ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Génération...
              </>
            ) : (
              <>
                <Rocket className="w-5 h-5 mr-2" />
                Générer mon parcours
              </>
            )}
          </motion.button>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 rounded-xl p-8 max-w-md w-full mx-4 modal-content"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rocket className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-2">
                Parcours généré avec succès !
              </h3>
              <p className="text-gray-400 mb-6">
                Votre parcours personnalisé a été créé. Que souhaitez-vous faire
                maintenant ?
              </p>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/pathways/${generatedPathwayId}`)}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Play className="w-5 h-5 mr-2" />
                Commencer le parcours
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/dashboard")}
                className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Voir mon tableau de bord
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
              >
                Rester sur cette page
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default GoalDetailPage;
