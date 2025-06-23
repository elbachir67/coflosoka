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
  Filter,
  Search,
  X,
  Tag,
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
  };
  tags: string[];
  likes: string[];
  comments: {
    _id: string;
    content: string;
    author: {
      _id: string;
      email: string;
    };
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
  const [newComment, setNewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
    newTag: "",
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.API_URL}/api/forum/posts`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des discussions");
      }

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching forum posts:", error);
      toast.error("Erreur lors du chargement des discussions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api.API_URL}/api/forum/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          tags: formData.tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la discussion");
      }

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setShowCreateModal(false);
      setFormData({
        title: "",
        content: "",
        tags: [],
        newTag: "",
      });
      toast.success("Discussion créée avec succès");

      // Récompenser l'utilisateur pour avoir créé une discussion
      await rewardAction("create_forum_post");
    } catch (error) {
      console.error("Error creating forum post:", error);
      toast.error("Erreur lors de la création de la discussion");
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

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(
        `${api.API_URL}/api/forum/posts/${postId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'action");
      }

      const updatedPost = await response.json();
      setPosts(posts.map(p => (p._id === updatedPost._id ? updatedPost : p)));
      if (selectedPost?._id === updatedPost._id) {
        setSelectedPost(updatedPost);
      }

      // Récompenser l'utilisateur pour son engagement
      await rewardAction("like_post");
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Erreur lors de l'action");
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.trim()) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/forum/posts/${selectedPost._id}/comments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
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

      // Récompenser l'utilisateur pour avoir commenté
      await rewardAction("add_comment");
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Erreur lors de l'ajout du commentaire");
    }
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

  // Extraire tous les tags uniques
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).filter(
    tag => tag.trim() !== ""
  );

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
        <span className="text-gray-400">Chargement des discussions...</span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100 flex items-center">
          <MessageSquare className="w-5 h-5 text-purple-400 mr-2" />
          Forum de discussion
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nouvelle discussion
        </button>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="relative flex-1 min-w-64">
          <input
            type="text"
            placeholder="Rechercher une discussion..."
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des discussions */}
        <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">
                Aucune discussion ne correspond à vos critères.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTag(null);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div
                key={post._id}
                className={`p-4 rounded-lg ${
                  selectedPost?._id === post._id
                    ? "bg-purple-500/20 border border-purple-500/30"
                    : "bg-gray-800/50 hover:bg-gray-800/70"
                } cursor-pointer transition-colors`}
                onClick={() => setSelectedPost(post)}
              >
                <h3 className="text-lg font-semibold text-gray-200 mb-1">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                  {post.content}
                </p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{post.author.email.split("@")[0]}</span>
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {post.likes.length}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      {post.comments.length}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Détail de la discussion */}
        <div className="lg:col-span-2">
          {selectedPost ? (
            <div className="space-y-4">
              <div className="p-6 rounded-lg bg-gray-800/50">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-200">
                    {selectedPost.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleLikePost(selectedPost._id)}
                      className={`p-2 rounded-full ${
                        selectedPost.likes.includes(user?.id || "")
                          ? "bg-purple-500/20 text-purple-400"
                          : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                      } transition-colors`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-300 mb-4 whitespace-pre-line">
                  {selectedPost.content}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {selectedPost.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    <span>{selectedPost.author.email.split("@")[0]}</span>
                  </div>
                  <span>{formatDate(selectedPost.createdAt)}</span>
                </div>
              </div>

              {/* Commentaires */}
              <div>
                <h4 className="text-md font-medium text-gray-300 mb-4 flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Commentaires ({selectedPost.comments.length})
                </h4>

                <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 pr-2">
                  {selectedPost.comments.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">
                      Aucun commentaire. Soyez le premier à commenter !
                    </p>
                  ) : (
                    selectedPost.comments.map(comment => (
                      <div
                        key={comment._id}
                        className="p-4 rounded-lg bg-gray-800/30"
                      >
                        <p className="text-gray-300 mb-2">{comment.content}</p>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{comment.author.email.split("@")[0]}</span>
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

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
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Envoyer
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">
                  Sélectionnez une discussion pour voir les détails
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création de discussion */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Nouvelle discussion
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
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Contenu
                </label>
                <textarea
                  id="content"
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
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <Tag className="w-4 h-4 mr-1" />
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
                  Publier
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
