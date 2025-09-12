import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  Share2,
  Plus,
  Loader2,
  AlertCircle,
  User,
  ThumbsUp,
  Search,
  Filter,
  X,
  ExternalLink,
  BookOpen,
  Video,
  GraduationCap,
  Laptop,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useGamification } from "../contexts/GamificationContext";

interface SharedResource {
  _id: string;
  title: string;
  description: string;
  url: string;
  type: "article" | "video" | "course" | "book" | "use_case" | "other";
  tags: string[];
  author: {
    _id: string;
    email: string;
  } | null;
  likes: string[];
  downloads: number;
  createdAt: string;
}

const ResourceSharing: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [resources, setResources] = useState<SharedResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResource, setEditingResource] = useState<SharedResource | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    type: "article",
    tags: [] as string[],
    newTag: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${api.API_URL}/api/collaboration/shared-resources`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des ressources");
      }

      const data = await response.json();
      setResources(data);
    } catch (error) {
      console.error("Error fetching shared resources:", error);
      setError("Erreur lors du chargement des ressources");
      toast.error("Erreur lors du chargement des ressources");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/shared-resources`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            url: formData.url,
            type: formData.type,
            tags: formData.tags,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du partage de la ressource");
      }

      const newResource = await response.json();
      setResources([newResource, ...resources]);
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        url: "",
        type: "article",
        tags: [],
        newTag: "",
      });
      toast.success("Ressource partagée avec succès");

      // Récompenser l'utilisateur pour avoir partagé une ressource
      await rewardAction("share_resource");
    } catch (error) {
      console.error("Error sharing resource:", error);
      toast.error("Erreur lors du partage de la ressource");
    }
  };

  const handleUpdateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token || !editingResource) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/shared-resources/${editingResource._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            url: formData.url,
            type: formData.type,
            tags: formData.tags,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la ressource");
      }

      const updatedResource = await response.json();
      setResources(
        resources.map(r =>
          r._id === updatedResource._id ? updatedResource : r
        )
      );
      setShowEditModal(false);
      setEditingResource(null);
      setFormData({
        title: "",
        description: "",
        url: "",
        type: "article",
        tags: [],
        newTag: "",
      });
      toast.success("Ressource mise à jour avec succès");
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Erreur lors de la mise à jour de la ressource");
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!user?.token) return;

    if (!confirm("Êtes-vous sûr de vouloir supprimer cette ressource ?"))
      return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/shared-resources/${resourceId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de la ressource");
      }

      setResources(resources.filter(r => r._id !== resourceId));
      toast.success("Ressource supprimée avec succès");
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Erreur lors de la suppression de la ressource");
    }
  };

  const startEditResource = (resource: SharedResource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      url: resource.url,
      type: resource.type,
      tags: resource.tags,
      newTag: "",
    });
    setShowEditModal(true);
  };

  const canEditOrDelete = (authorId: string) => {
    return authorId === user?.id || user?.isAdmin;
  };

  const handleAddTag = () => {
    if (
      formData.newTag.trim() &&
      !formData.tags.includes(formData.newTag.trim())
    ) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
        newTag: "",
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag),
    });
  };

  const handleLikeResource = async (resourceId: string) => {
    if (!user?.token) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/shared-resources/${resourceId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'action");
      }

      const updatedResource = await response.json();
      setResources(
        resources.map(r =>
          r._id === updatedResource._id ? updatedResource : r
        )
      );

      // Récompenser l'utilisateur pour son engagement
      await rewardAction("like_resource");
    } catch (error) {
      console.error("Error liking resource:", error);
      toast.error("Erreur lors de l'action");
    }
  };

  const handleDownloadResource = async (resourceId: string, url: string) => {
    if (!user?.token) return;

    try {
      // Ouvrir l'URL dans un nouvel onglet
      window.open(url, "_blank");

      // Incrémenter le compteur de téléchargements
      const response = await fetch(
        `${api.API_URL}/api/collaboration/shared-resources/${resourceId}/download`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'action");
      }

      const updatedResource = await response.json();
      setResources(
        resources.map(r =>
          r._id === updatedResource._id ? updatedResource : r
        )
      );

      // Récompenser l'utilisateur pour avoir téléchargé une ressource
      await rewardAction("download_resource");
    } catch (error) {
      console.error("Error downloading resource:", error);
      toast.error("Erreur lors de l'action");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "article":
        return <BookOpen className="w-5 h-5 text-blue-400" />;
      case "video":
        return <Video className="w-5 h-5 text-red-400" />;
      case "course":
        return <GraduationCap className="w-5 h-5 text-green-400" />;
      case "book":
        return <BookOpen className="w-5 h-5 text-purple-400" />;
      case "use_case":
        return <Laptop className="w-5 h-5 text-orange-400" />;
      default:
        return <Share2 className="w-5 h-5 text-gray-400" />;
    }
  };

  const getResourceTypeLabel = (type: string) => {
    switch (type) {
      case "article":
        return "Article";
      case "video":
        return "Vidéo";
      case "course":
        return "Cours";
      case "book":
        return "Livre";
      case "use_case":
        return "Cas pratique";
      default:
        return "Autre";
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType ? resource.type === selectedType : true;
    const matchesTag = selectedTag ? resource.tags.includes(selectedTag) : true;
    return matchesSearch && matchesType && matchesTag;
  });

  // Extraire tous les tags uniques
  const allTags = Array.from(
    new Set(resources.flatMap(resource => resource.tags))
  ).filter(tag => tag.trim() !== "");

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
        <span className="text-gray-400">Chargement des ressources...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center min-h-[400px]">
        <AlertCircle className="w-6 h-6 text-red-400 mr-2" />
        <span className="text-gray-400">{error}</span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100 flex items-center">
          <Share2 className="w-5 h-5 text-purple-400 mr-2" />
          Partage de ressources
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Partager une ressource
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative flex-1 min-w-64">
          <input
            type="text"
            placeholder="Rechercher une ressource..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        <div className="relative">
          <select
            value={selectedType || ""}
            onChange={e => setSelectedType(e.target.value || null)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10"
          >
            <option value="">Tous les types</option>
            <option value="article">Articles</option>
            <option value="video">Vidéos</option>
            <option value="course">Cours</option>
            <option value="book">Livres</option>
            <option value="use_case">Cas pratiques</option>
          </select>
          <Filter className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={selectedTag || ""}
            onChange={e => setSelectedTag(e.target.value || null)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10"
          >
            <option value="">Tous les tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <Filter className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Liste des ressources */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-8 min-h-[300px] flex flex-col items-center justify-center">
          <Share2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            Aucune ressource ne correspond à vos critères.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedType(null);
              setSelectedTag(null);
            }}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map(resource => (
            <div
              key={resource._id}
              className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 rounded-lg bg-gray-700 mr-3">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-200 mb-1">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {resource.description}
                  </p>
                </div>

                {/* Actions pour l'auteur ou admin */}
                {canEditOrDelete(resource.author?._id || "") && (
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => startEditResource(resource)}
                      className="p-1.5 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteResource(resource._id)}
                      className="p-1.5 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs">
                  {getResourceTypeLabel(resource.type)}
                </span>
                {resource.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center text-xs text-gray-400">
                  <User className="w-3 h-3 mr-1" />
                  <span>
                    {resource.author
                      ? resource.author.email.split("@")[0]
                      : "Utilisateur inconnu"}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(resource.createdAt)}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLikeResource(resource._id)}
                    className={`p-1.5 rounded-full ${
                      resource.likes.includes(user?.id || "")
                        ? "bg-purple-500/20 text-purple-400"
                        : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                    } transition-colors`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() =>
                      handleDownloadResource(resource._id, resource.url)
                    }
                    className="p-1.5 rounded-full bg-gray-700 text-gray-400 hover:bg-gray-600 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de création de ressource */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Partager une ressource
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateResource} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Titre
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  URL
                </label>
                <input
                  type="url"
                  id="url"
                  value={formData.url}
                  onChange={e =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Type de ressource
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={e =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="article">Article</option>
                  <option value="video">Vidéo</option>
                  <option value="course">Cours</option>
                  <option value="book">Livre</option>
                  <option value="use_case">Cas pratique</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Tags
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="tags"
                    value={formData.newTag}
                    onChange={e =>
                      setFormData({ ...formData, newTag: e.target.value })
                    }
                    placeholder="Ajouter un tag"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <div
                      key={tag}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-400 hover:text-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Partager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification de ressource */}
      {showEditModal && editingResource && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Modifier la ressource
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingResource(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateResource} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Titre
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  URL
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={e =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Type de ressource
                </label>
                <select
                  value={formData.type}
                  onChange={e =>
                    setFormData({ ...formData, type: e.target.value as any })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="article">Article</option>
                  <option value="video">Vidéo</option>
                  <option value="course">Cours</option>
                  <option value="book">Livre</option>
                  <option value="use_case">Cas pratique</option>
                  <option value="other">Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={formData.newTag}
                    onChange={e =>
                      setFormData({ ...formData, newTag: e.target.value })
                    }
                    placeholder="Ajouter un tag"
                    className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Ajouter
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <div
                      key={tag}
                      className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm flex items-center"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-400 hover:text-gray-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingResource(null);
                  }}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Mettre à jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResourceSharing;
