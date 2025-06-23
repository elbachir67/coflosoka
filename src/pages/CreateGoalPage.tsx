import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { Plus, Trash2, Save, ArrowLeft } from "lucide-react";

interface Module {
  title: string;
  description: string;
  duration: number;
  skills: { name: string; level: string }[];
  resources: {
    title: string;
    url: string;
    type: string;
    duration: number;
  }[];
  validationCriteria: string[];
}

interface FormData {
  title: string;
  description: string;
  category: string;
  level: string;
  estimatedDuration: number;
  prerequisites: {
    category: string;
    skills: { name: string; level: string }[];
  }[];
  modules: Module[];
  careerOpportunities: {
    title: string;
    description: string;
    averageSalary: string;
    companies: string[];
  }[];
  certification: {
    available: boolean;
    name: string;
    provider: string;
    url: string;
  };
}

function CreateGoalPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "ml",
    level: "beginner",
    estimatedDuration: 8,
    prerequisites: [],
    modules: [
      {
        title: "",
        description: "",
        duration: 20,
        skills: [],
        resources: [],
        validationCriteria: [],
      },
    ],
    careerOpportunities: [],
    certification: {
      available: false,
      name: "",
      provider: "",
      url: "",
    },
  });

  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${api.goals}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'objectif");
      }

      toast.success("Objectif créé avec succès");
      navigate("/admin/goals");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la création de l'objectif");
    } finally {
      setLoading(false);
    }
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: "",
          description: "",
          duration: 20,
          skills: [],
          resources: [],
          validationCriteria: [],
        },
      ],
    }));
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter((_, i) => i !== index),
    }));
  };

  const updateModule = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === index ? { ...module, [field]: value } : module
      ),
    }));
  };

  const addResource = (moduleIndex: number) => {
    const newResource = {
      title: "",
      url: "",
      type: "article",
      duration: 30,
    };

    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? { ...module, resources: [...module.resources, newResource] }
          : module
      ),
    }));
  };

  const removeResource = (moduleIndex: number, resourceIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              resources: module.resources.filter(
                (_, ri) => ri !== resourceIndex
              ),
            }
          : module
      ),
    }));
  };

  const updateResource = (
    moduleIndex: number,
    resourceIndex: number,
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              resources: module.resources.map((resource, ri) =>
                ri === resourceIndex
                  ? { ...resource, [field]: value }
                  : resource
              ),
            }
          : module
      ),
    }));
  };

  const addCareerOpportunity = () => {
    setFormData(prev => ({
      ...prev,
      careerOpportunities: [
        ...prev.careerOpportunities,
        {
          title: "",
          description: "",
          averageSalary: "",
          companies: [],
        },
      ],
    }));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/goals")}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-100">
                Créer un Nouvel Objectif
              </h1>
              <p className="text-gray-400 mt-2">
                Définissez un parcours d'apprentissage complet
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-100 mb-6">
              Informations de base
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Titre de l'objectif
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ex: Maîtriser le Machine Learning"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="ml">Machine Learning</option>
                  <option value="dl">Deep Learning</option>
                  <option value="computer_vision">Computer Vision</option>
                  <option value="nlp">NLP</option>
                  <option value="data_science">Data Science</option>
                  <option value="mlops">MLOps</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Niveau de difficulté
                </label>
                <select
                  value={formData.level}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, level: e.target.value }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Durée estimée (semaines)
                </label>
                <input
                  type="number"
                  min="1"
                  max="52"
                  required
                  value={formData.estimatedDuration}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      estimatedDuration: parseInt(e.target.value),
                    }))
                  }
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Décrivez l'objectif d'apprentissage..."
              />
            </div>
          </div>

          {/* Modules */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">Modules</h2>
              <button
                type="button"
                onClick={addModule}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un module
              </button>
            </div>

            <div className="space-y-6">
              {formData.modules.map((module, moduleIndex) => (
                <div
                  key={moduleIndex}
                  className="p-6 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">
                      Module {moduleIndex + 1}
                    </h3>
                    {formData.modules.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeModule(moduleIndex)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Titre du module
                      </label>
                      <input
                        type="text"
                        required
                        value={module.title}
                        onChange={e =>
                          updateModule(moduleIndex, "title", e.target.value)
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Durée (heures)
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={module.duration}
                        onChange={e =>
                          updateModule(
                            moduleIndex,
                            "duration",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description du module
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={module.description}
                      onChange={e =>
                        updateModule(moduleIndex, "description", e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Resources */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-gray-300">
                        Ressources
                      </h4>
                      <button
                        type="button"
                        onClick={() => addResource(moduleIndex)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Ressource
                      </button>
                    </div>

                    <div className="space-y-3">
                      {module.resources.map((resource, resourceIndex) => (
                        <div
                          key={resourceIndex}
                          className="p-4 bg-gray-900/50 rounded-lg border border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-300">
                              Ressource {resourceIndex + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                removeResource(moduleIndex, resourceIndex)
                              }
                              className="p-1 text-red-400 hover:text-red-300 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <input
                                type="text"
                                placeholder="Titre de la ressource"
                                required
                                value={resource.title}
                                onChange={e =>
                                  updateResource(
                                    moduleIndex,
                                    resourceIndex,
                                    "title",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              />
                            </div>

                            <div>
                              <input
                                type="url"
                                placeholder="URL de la ressource"
                                required
                                value={resource.url}
                                onChange={e =>
                                  updateResource(
                                    moduleIndex,
                                    resourceIndex,
                                    "url",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              />
                            </div>

                            <div>
                              <select
                                value={resource.type}
                                onChange={e =>
                                  updateResource(
                                    moduleIndex,
                                    resourceIndex,
                                    "type",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              >
                                <option value="article">Article</option>
                                <option value="video">Vidéo</option>
                                <option value="course">Cours</option>
                                <option value="book">Livre</option>
                                <option value="use_case">Cas pratique</option>
                              </select>
                            </div>

                            <div>
                              <input
                                type="number"
                                placeholder="Durée (min)"
                                min="1"
                                required
                                value={resource.duration}
                                onChange={e =>
                                  updateResource(
                                    moduleIndex,
                                    resourceIndex,
                                    "duration",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/goals")}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Création...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Créer l'objectif
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGoalPage;
