import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  MessageSquare,
  Plus,
  Loader2,
  AlertCircle,
  User,
  ThumbsUp,
  MessageCircle,
  Send,
  X,
  Search,
  Filter,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useGamification } from "../contexts/GamificationContext";

interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    email: string;
  } | null;
  tags: string[];
  likes: string[];
  comments: {
    _id: string;
    author: {
      _id: string;
      email: string;
    } | null;
    content: string;
    createdAt: string;
  }[];
  createdAt: string;
}

const DiscussionForum: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);
  const [editingComment, setEditingComment] = useState<{
    postId: string;
    commentId: string;
    content: string;
  } | null>(null);
  const [newComment, setNewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    newTag: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!user?.token) return;

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${api.API_URL}/api/collaboration/forum/posts`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des posts");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      setError("Erreur lors du chargement des posts");
      toast.error("Erreur lors du chargement des posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/forum/posts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            tags: formData.tags,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la création du post");
      }

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setShowCreateModal(false);
      setFormData({ title: "", content: "", tags: [], newTag: "" });
      toast.success("Post créé avec succès");

      await rewardAction("create_forum_post");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Erreur lors de la création du post");
    }
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token || !editingPost) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/forum/posts/${editingPost._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            content: formData.content,
            tags: formData.tags,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du post");
      }

      const updatedPost = await response.json();
      setPosts(posts.map(p => (p._id === updatedPost._id ? updatedPost : p)));
      setShowEditModal(false);
      setEditingPost(null);
      setFormData({ title: "", content: "", tags: [], newTag: "" });
      toast.success("Post mis à jour avec succès");
    } catch (error) {
      console.error("Error updating post:", error);
      toast.error("Erreur lors de la mise à jour du post");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user?.token) return;

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce post ?")) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/forum/posts/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du post");
      }

      setPosts(posts.filter(p => p._id !== postId));
      if (selectedPost?._id === postId) {
        setSelectedPost(null);
      }
      toast.success("Post supprimé avec succès");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Erreur lors de la suppression du post");
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user?.token) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/forum/posts/${postId}/like`,
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

      const updatedPost = await response.json();
      setPosts(posts.map(p => (p._id === updatedPost._id ? updatedPost : p)));

      if (selectedPost?._id === postId) {
        setSelectedPost(updatedPost);
      }

      await rewardAction("like_post");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Erreur lors de l'action");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.trim() || !user?.token) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/forum/posts/${selectedPost._id}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newComment }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du commentaire");
      }

      const updatedPost = await response.json();
      setPosts(posts.map(p => (p._id === updatedPost._id ? updatedPost : p)));
      setSelectedPost(updatedPost);
      setNewComment("");

      await rewardAction("add_comment");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
  };

  const handleUpdateComment = async () => {
    if (!editingComment || !user?.token) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/forum/posts/${editingComment.postId}/comments/${editingComment.commentId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: editingComment.content }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du commentaire");
      }

      const updatedPost = await response.json();
      setPosts(posts.map(p => (p._id === updatedPost._id ? updatedPost : p)));
      setSelectedPost(updatedPost);
      setEditingComment(null);
      toast.success("Commentaire mis à jour avec succès");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Erreur lors de la mise à jour du commentaire");
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!user?.token) return;

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/collaboration/forum/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du commentaire");
      }

      const updatedPost = await response.json();
      setPosts(posts.map(p => (p._id === updatedPost._id ? updatedPost : p)));
      setSelectedPost(updatedPost);
      toast.success("Commentaire supprimé avec succès");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Erreur lors de la suppression du commentaire");
    }
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

  const startEditPost = (post: ForumPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      tags: post.tags,
      newTag: "",
    });
    setShowEditModal(true);
  };

  const startEditComment = (
    postId: string,
    commentId: string,
    content: string
  ) => {
    setEditingComment({ postId, commentId, content });
  };

  const canEditOrDelete = (authorId: string) => {
    return authorId === user?.id || user?.isAdmin;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
        <span className="text-gray-400">Chargement du forum...</span>
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
          <MessageSquare className="w-5 h-5 text-green-400 mr-2" />
          Forum de discussion
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nouveau post
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative flex-1 min-w-64">
          <input
            type="text"
            placeholder="Rechercher dans le forum..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
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

      {/* Liste des posts */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-8 min-h-[300px] flex flex-col items-center justify-center">
          <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            {searchQuery || selectedTag
              ? "Aucun post ne correspond à vos critères."
              : "Aucune discussion pour le moment."}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Créer le premier post
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <div
              key={post._id}
              className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 cursor-pointer transition-colors"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-200 flex-1 pr-4">
                  {post.title}
                </h3>

                {/* Actions pour l'auteur ou admin */}
                {canEditOrDelete(post.author?._id || "") && (
                  <div
                    className="flex space-x-2"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={() => startEditPost(post)}
                      className="p-1.5 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="p-1.5 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-400 mb-3 line-clamp-2">{post.content}</p>

              <div className="flex flex-wrap gap-1 mb-3">
                {post.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-400">
                <div className="flex items-center">
                  <User className="w-3 h-3 mr-1" />
                  <span>
                    {post.author
                      ? post.author.email.split("@")[0]
                      : "Utilisateur inconnu"}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    <span>{post.likes.length}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    <span>{post.comments.length}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de détail du post */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                {selectedPost.title}
              </h3>
              <button
                onClick={() => setSelectedPost(null)}
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
                    {selectedPost.author
                      ? selectedPost.author.email.split("@")[0]
                      : "Utilisateur inconnu"}
                  </span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(selectedPost.createdAt)}</span>
                </div>

                {/* Actions pour l'auteur ou admin */}
                {canEditOrDelete(selectedPost.author?._id || "") && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditPost(selectedPost)}
                      className="p-1.5 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePost(selectedPost._id)}
                      className="p-1.5 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-300 mb-4 whitespace-pre-line">
                {selectedPost.content}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                  {selectedPost.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => handleLikePost(selectedPost._id)}
                  className={`flex items-center px-3 py-1.5 rounded-lg transition-colors ${
                    selectedPost.likes.includes(user?.id || "")
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {selectedPost.likes.length}
                </button>
              </div>
            </div>

            {/* Commentaires */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-200 mb-4">
                Commentaires ({selectedPost.comments.length})
              </h4>

              {selectedPost.comments.length === 0 ? (
                <p className="text-center text-gray-400 py-4">
                  Aucun commentaire. Soyez le premier à commenter !
                </p>
              ) : (
                <div className="space-y-4 mb-6">
                  {selectedPost.comments.map(comment => (
                    <div
                      key={comment._id}
                      className="p-4 rounded-lg bg-gray-800/30"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center text-sm text-gray-400">
                          <User className="w-4 h-4 mr-1" />
                          <span>
                            {comment.author
                              ? comment.author.email.split("@")[0]
                              : "Utilisateur inconnu"}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>

                        {/* Actions pour l'auteur du commentaire ou admin */}
                        {canEditOrDelete(comment.author?._id || "") && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                startEditComment(
                                  selectedPost._id,
                                  comment._id,
                                  comment.content
                                )
                              }
                              className="p-1 rounded-full bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-colors"
                              title="Modifier"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteComment(
                                  selectedPost._id,
                                  comment._id
                                )
                              }
                              className="p-1 rounded-full bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {editingComment?.commentId === comment._id ? (
                        <div className="space-y-2">
                          <textarea
                            value={editingComment.content}
                            onChange={e =>
                              setEditingComment({
                                ...editingComment,
                                content: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            rows={3}
                          />
                          <div className="flex space-x-2">
                            <button
                              onClick={handleUpdateComment}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                              Sauvegarder
                            </button>
                            <button
                              onClick={() => setEditingComment(null)}
                              className="px-3 py-1 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-300 whitespace-pre-line">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Formulaire d'ajout de commentaire */}
              <form onSubmit={handleAddComment} className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Send className="w-4 h-4 mr-1" />
                  Envoyer
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de création de post */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Créer un nouveau post
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
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
                  Contenu
                </label>
                <textarea
                  value={formData.content}
                  onChange={e =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
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
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de modification de post */}
      {showEditModal && editingPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Modifier le post
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingPost(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdatePost} className="space-y-4">
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
                  Contenu
                </label>
                <textarea
                  value={formData.content}
                  onChange={e =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  rows={6}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
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
                    setEditingPost(null);
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

export default DiscussionForum;
