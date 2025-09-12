import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { Plus, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";
import { Goal, Module, Resource } from "../types";

function EditGoalPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: "",
    description: "",
    category: "ml",
    level: "beginner",
    estimatedDuration: 8,
    prerequisites: [],
    modules: [],
    careerOpportunities: [],
    certification: {
      available: false,
      name: "",
      provider: "",
      url: "",
    },
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }

    const fetchGoal = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${api.goals}/${goalId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement de l'objectif");
        }

        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erreur lors du chargement de l'objectif");
        navigate("/admin/goals");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [goalId, isAdmin, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${api.goals}/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'objectif");
      }

      toast.success("Objectif mis à jour avec succès");
      navigate("/admin/goals");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la mise à jour de l'objectif");
    } finally {
      setSaving(false);
    }
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      modules: [
        ...(prev.modules || []),
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
      modules: prev.modules?.filter((_, i) => i !== index),
    }));
  };

  const updateModule = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules?.map((module, i) =>
        i === index ? { ...module, [field]: value } : module
      ),
    }));
  };

  const addResource = (moduleIndex: number) => {
    const newResource = {
      title: "",
      url: "",
      type: "article" as Resource["type"],
      duration: 30,
    };

    setFormData(prev => ({
      ...prev,
      modules: prev.modules?.map((module, i) =>
        i === moduleIndex
          ? { ...module, resources: [...(module.resources || []), newResource] }
          : module
      ),
    }));
  };

  const removeResource = (moduleIndex: number, resourceIndex: number) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules?.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              resources: module.resources?.filter(
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
      modules: prev.modules?.map((module, i) =>
        i === moduleIndex
          ? {
              ...module,
              resources: module.resources?.map((resource, ri) =>
                ri === resourceIndex
                  ? { ...resource, [field]: value }
                  : resource
              ),
            }
          : module
      ),
    }));
  };

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [
        ...(prev.prerequisites || []),
        {
          category: "math",
          skills: [{ name: "", level: "basic" }],
        },
      ],
    }));
  };

  const removePrerequisite = (index: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.filter((_, i) => i !== index),
    }));
  };

  const updatePrerequisite = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.map((prereq, i) =>
        i === index ? { ...prereq, [field]: value } : prereq
      ),
    }));
  };

  const addSkill = (prereqIndex: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.map((prereq, i) =>
        i === prereqIndex
          ? {
              ...prereq,
              skills: [...(prereq.skills || []), { name: "", level: "basic" }],
            }
          : prereq
      ),
    }));
  };

  const removeSkill = (prereqIndex: number, skillIndex: number) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.map((prereq, i) =>
        i === prereqIndex
          ? {
              ...prereq,
              skills: prereq.skills?.filter((_, si) => si !== skillIndex),
            }
          : prereq
      ),
    }));
  };

  const updateSkill = (
    prereqIndex: number,
    skillIndex: number,
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites?.map((prereq, i) =>
        i === prereqIndex
          ? {
              ...prereq,
              skills: prereq.skills?.map((skill, si) =>
                si === skillIndex ? { ...skill, [field]: value } : skill
              ),
            }
          : prereq
      ),
    }));
  };

  const addCareerOpportunity = () => {
    setFormData(prev => ({
      ...prev,
      careerOpportunities: [
        ...(prev.careerOpportunities || []),
        {
          title: "",
          description: "",
          averageSalary: "",
          companies: [],
        },
      ],
    }));
  };

  const removeCareerOpportunity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      careerOpportunities: prev.careerOpportunities?.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const updateCareerOpportunity = (
    index: number,
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      careerOpportunities: prev.careerOpportunities?.map((career, i) =>
        i === index ? { ...career, [field]: value } : career
      ),
    }));
  };

  const updateCompanies = (index: number, value: string) => {
    const companies = value.split(",").map(company => company.trim());
    setFormData(prev => ({
      ...prev,
      careerOpportunities: prev.careerOpportunities?.map((career, i) =>
        i === index ? { ...career, companies } : career
      ),
    }));
  };

  const updateCertification = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      certification: {
        ...(prev.certification || {
          available: false,
          name: "",
          provider: "",
          url: "",
        }),
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement de l'objectif...</span>
        </div>
      </div>
    );
  }

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
                Modifier l'Objectif
              </h1>
              <p className="text-gray-400 mt-2">
                Mettez à jour le parcours d'apprentissage
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
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={formData.category}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      category: e.target.value as Goal["category"],
                    }))
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
                    setFormData(prev => ({
                      ...prev,
                      level: e.target.value as Goal["level"],
                    }))
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
              />
            </div>
          </div>

          {/* Prerequisites */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">Prérequis</h2>
              <button
                type="button"
                onClick={addPrerequisite}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un prérequis
              </button>
            </div>

            <div className="space-y-6">
              {formData.prerequisites?.map((prereq, prereqIndex) => (
                <div
                  key={prereqIndex}
                  className="p-6 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">
                      Prérequis {prereqIndex + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removePrerequisite(prereqIndex)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Catégorie
                    </label>
                    <select
                      value={prereq.category}
                      onChange={e =>
                        updatePrerequisite(
                          prereqIndex,
                          "category",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="math">Mathématiques</option>
                      <option value="programming">Programmation</option>
                      <option value="theory">Théorie</option>
                      <option value="tools">Outils</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-semibold text-gray-300">
                        Compétences requises
                      </h4>
                      <button
                        type="button"
                        onClick={() => addSkill(prereqIndex)}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Compétence
                      </button>
                    </div>

                    <div className="space-y-3">
                      {prereq.skills?.map((skill, skillIndex) => (
                        <div
                          key={skillIndex}
                          className="flex items-center space-x-3"
                        >
                          <input
                            type="text"
                            placeholder="Nom de la compétence"
                            required
                            value={skill.name}
                            onChange={e =>
                              updateSkill(
                                prereqIndex,
                                skillIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          />

                          <select
                            value={skill.level}
                            onChange={e =>
                              updateSkill(
                                prereqIndex,
                                skillIndex,
                                "level",
                                e.target.value
                              )
                            }
                            className="w-40 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                          >
                            <option value="basic">Débutant</option>
                            <option value="intermediate">Intermédiaire</option>
                            <option value="advanced">Avancé</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => removeSkill(prereqIndex, skillIndex)}
                            className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
              {formData.modules?.map((module, moduleIndex) => (
                <div
                  key={moduleIndex}
                  className="p-6 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">
                      Module {moduleIndex + 1}
                    </h3>
                    {formData.modules && formData.modules.length > 1 && (
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
                      {module.resources?.map((resource, resourceIndex) => (
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

          {/* Career Opportunities */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">
                Opportunités de Carrière
              </h2>
              <button
                type="button"
                onClick={addCareerOpportunity}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une opportunité
              </button>
            </div>

            <div className="space-y-6">
              {formData.careerOpportunities?.map((career, careerIndex) => (
                <div
                  key={careerIndex}
                  className="p-6 bg-gray-800/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-200">
                      Opportunité {careerIndex + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeCareerOpportunity(careerIndex)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Titre du poste
                      </label>
                      <input
                        type="text"
                        required
                        value={career.title}
                        onChange={e =>
                          updateCareerOpportunity(
                            careerIndex,
                            "title",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Salaire moyen
                      </label>
                      <input
                        type="text"
                        required
                        value={career.averageSalary}
                        onChange={e =>
                          updateCareerOpportunity(
                            careerIndex,
                            "averageSalary",
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Ex: 45-65k€/an"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={career.description}
                      onChange={e =>
                        updateCareerOpportunity(
                          careerIndex,
                          "description",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Entreprises (séparées par des virgules)
                    </label>
                    <input
                      type="text"
                      required
                      value={career.companies?.join(", ")}
                      onChange={e =>
                        updateCompanies(careerIndex, e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Ex: Google, Amazon, Microsoft"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certification */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-100 mb-6">
              Certification
            </h2>

            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.certification?.available}
                  onChange={e =>
                    updateCertification("available", e.target.checked)
                  }
                  className="rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-gray-300">
                  Certification disponible
                </span>
              </label>
            </div>

            {formData.certification?.available && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nom de la certification
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.certification?.name}
                    onChange={e => updateCertification("name", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Organisme certificateur
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.certification?.provider}
                    onChange={e =>
                      updateCertification("provider", e.target.value)
                    }
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    URL de la certification
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.certification?.url}
                    onChange={e => updateCertification("url", e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            )}
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
              disabled={saving}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditGoalPage;
