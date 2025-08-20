import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  FileText,
  Plus,
  Loader2,
  AlertCircle,
  User,
  MessageSquare,
  Send,
  X,
  Upload,
  Download,
  CheckCircle,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useGamification } from "../contexts/GamificationContext";

interface PeerReviewSubmission {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileName: string;
  author: {
    _id: string;
    email: string;
  } | null;
  status: "pending" | "reviewed" | "completed";
  reviews: {
    _id: string;
    reviewer: {
      _id: string;
      email: string;
    } | null;
    content: string;
    rating: number;
    createdAt: string;
  }[];
  createdAt: string;
}

const PeerReview: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [submissions, setSubmissions] = useState<PeerReviewSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] =
    useState<PeerReviewSubmission | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    file: null as File | null,
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${api.API_URL}/api/collaboration/peer-review/submissions`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des soumissions");
      }

      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      console.error("Error fetching peer review submissions:", error);
      setError("Erreur lors du chargement des soumissions");
      toast.error("Erreur lors du chargement des soumissions");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        file: e.target.files[0],
      });
    }
  };

  const handleCreateSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file || !user?.token) return;

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      formDataObj.append("file", formData.file);

      const response = await fetch(
        `${api.API_URL}/api/collaboration/peer-review/submissions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
          body: formDataObj,
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission");
      }

      const newSubmission = await response.json();
      setSubmissions([newSubmission, ...submissions]);
      setShowCreateModal(false);
      setFormData({
        title: "",
        description: "",
        file: null,
      });
      toast.success("Soumission créée avec succès");

      // Récompenser l'utilisateur pour avoir soumis un travail
      await rewardAction("create_submission");
    } catch (error) {
      console.error("Error creating submission:", error);
      toast.error("Erreur lors de la soumission");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission || !user?.token) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/peer-review/submissions/${selectedSubmission._id}/reviews`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: reviewContent,
            rating: reviewRating,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission de la revue");
      }

      const updatedSubmission = await response.json();
      setSubmissions(
        submissions.map(s =>
          s._id === updatedSubmission._id ? updatedSubmission : s
        )
      );
      setSelectedSubmission(updatedSubmission);
      setShowReviewModal(false);
      setReviewContent("");
      setReviewRating(3);
      toast.success("Revue soumise avec succès");

      // Récompenser l'utilisateur pour avoir fait une revue
      await rewardAction("submit_review");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Erreur lors de la soumission de la revue");
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "En attente de revue";
      case "reviewed":
        return "Revue en cours";
      case "completed":
        return "Revue complétée";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-500/20";
      case "reviewed":
        return "text-blue-400 bg-blue-500/20";
      case "completed":
        return "text-green-400 bg-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch =
      submission.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter
      ? submission.status === statusFilter
      : true;
    return matchesSearch && matchesStatus;
  });

  const mySubmissions = filteredSubmissions.filter(
    submission => submission.author && submission.author._id === user?.id
  );
  const otherSubmissions = filteredSubmissions.filter(
    submission => !submission.author || submission.author._id !== user?.id
  );

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
        <span className="text-gray-400">Chargement des soumissions...</span>
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
          <FileText className="w-5 h-5 text-purple-400 mr-2" />
          Revue par les pairs
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nouvelle soumission
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative flex-1 min-w-64">
          <input
            type="text"
            placeholder="Rechercher une soumission..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        <div className="relative">
          <select
            value={statusFilter || ""}
            onChange={e => setStatusFilter(e.target.value || null)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none pr-10"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="reviewed">En cours</option>
            <option value="completed">Complété</option>
          </select>
          <Filter className="absolute right-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Mes soumissions */}
      {mySubmissions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">
            Mes soumissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mySubmissions.map(submission => (
              <div
                key={submission._id}
                className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 cursor-pointer transition-colors"
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-200">
                    {submission.title}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      submission.status
                    )}`}
                  >
                    {getStatusLabel(submission.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {submission.description}
                </p>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{formatDate(submission.createdAt)}</span>
                  <span>{submission.reviews.length} revues</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Soumissions à réviser */}
      <div>
        <h3 className="text-lg font-semibold text-gray-200 mb-4">
          Soumissions à réviser
        </h3>
        {otherSubmissions.length === 0 ? (
          <div className="text-center py-8 min-h-[200px] flex flex-col items-center justify-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              Aucune soumission disponible pour révision.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {otherSubmissions.map(submission => (
              <div
                key={submission._id}
                className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 cursor-pointer transition-colors"
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-semibold text-gray-200">
                    {submission.title}
                  </h4>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                      submission.status
                    )}`}
                  >
                    {getStatusLabel(submission.status)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                  {submission.description}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    <span>
                      {submission.author
                        ? submission.author.email.split("@")[0]
                        : "Utilisateur inconnu"}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span>{formatDate(submission.createdAt)}</span>
                    <span className="mx-2">•</span>
                    <span>{submission.reviews.length} revues</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de détail de soumission */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                {selectedSubmission.title}
              </h3>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-sm text-gray-400">
                  <User className="w-4 h-4 mr-1" />
                  <span>
                    {selectedSubmission.author
                      ? selectedSubmission.author.email.split("@")[0]
                      : "Utilisateur inconnu"}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(selectedSubmission.createdAt)}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    selectedSubmission.status
                  )}`}
                >
                  {getStatusLabel(selectedSubmission.status)}
                </span>
              </div>
              <p className="text-gray-300 mb-4">
                {selectedSubmission.description}
              </p>
              <div className="p-4 rounded-lg bg-gray-800/50 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-gray-300">
                    {selectedSubmission.fileName}
                  </span>
                </div>
                <a
                  href={selectedSubmission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Télécharger
                </a>
              </div>
            </div>

            {/* Revues */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-200 mb-4">
                Revues ({selectedSubmission.reviews.length})
              </h4>
              {selectedSubmission.reviews.length === 0 ? (
                <p className="text-center text-gray-400 py-4">
                  Aucune revue pour le moment.
                </p>
              ) : (
                <div className="space-y-4">
                  {selectedSubmission.reviews.map(review => (
                    <div
                      key={review._id}
                      className="p-4 rounded-lg bg-gray-800/30"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center text-sm">
                          <User className="w-4 h-4 mr-1 text-gray-400" />
                          <span className="text-gray-300">
                            {review.reviewer
                              ? review.reviewer.email.split("@")[0]
                              : "Utilisateur inconnu"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < review.rating
                                  ? "text-yellow-400"
                                  : "text-gray-600"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 whitespace-pre-line">
                        {review.content}
                      </p>
                      <p className="text-right text-xs text-gray-400 mt-2">
                        {formatDate(review.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Boutons d'action */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Fermer
              </button>
              {selectedSubmission.author &&
                selectedSubmission.author._id !== user?.id && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Ajouter une revue
                  </button>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de soumission */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Nouvelle soumission
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubmission} className="space-y-4">
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
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Fichier
                </label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-700 bg-gray-800/50 hover:bg-gray-800"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">
                          Cliquez pour télécharger
                        </span>{" "}
                        ou glissez-déposez
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOCX, PPTX, ZIP (MAX. 10MB)
                      </p>
                    </div>
                    <input
                      id="file"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                </div>
                {formData.file && (
                  <p className="mt-2 text-sm text-gray-400">
                    Fichier sélectionné: {formData.file.name}
                  </p>
                )}
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
                  Soumettre
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'ajout de revue */}
      {showReviewModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Ajouter une revue
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Note
                </label>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReviewRating(i + 1)}
                      className="text-2xl focus:outline-none"
                    >
                      <span
                        className={`${
                          i < reviewRating ? "text-yellow-400" : "text-gray-600"
                        } hover:text-yellow-300`}
                      >
                        ★
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Commentaire
                </label>
                <textarea
                  id="content"
                  value={reviewContent}
                  onChange={e => setReviewContent(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Donnez votre avis constructif sur ce travail..."
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Soumettre la revue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PeerReview;
