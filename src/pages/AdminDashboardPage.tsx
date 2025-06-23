import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";
import {
  Users,
  BookOpen,
  Target,
  BarChart3,
  TrendingUp,
  Clock,
  Award,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGoals: number;
  totalPathways: number;
  completionRate: number;
  averageScore: number;
  recentActivity: {
    type: string;
    description: string;
    timestamp: Date;
    userId?: string;
  }[];
}

function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [goals, setGoals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }

    fetchAdminData();
  }, [isAdmin, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch admin statistics
      const [goalsRes, usersRes] = await Promise.all([
        fetch(`${api.goals}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        }),
        fetch(`${api.users}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        }),
      ]);

      const goalsData = await goalsRes.json();
      const usersData = await usersRes.json();

      setGoals(goalsData);
      setUsers(usersData);

      // Calculate stats
      const adminStats: AdminStats = {
        totalUsers: usersData.length,
        activeUsers: usersData.filter((u: any) => u.isActive).length,
        totalGoals: goalsData.length,
        totalPathways: 0, // Will be calculated from pathways
        completionRate: 75, // Mock data
        averageScore: 82, // Mock data
        recentActivity: [
          {
            type: "user_registration",
            description: "Nouvel utilisateur inscrit",
            timestamp: new Date(),
          },
          {
            type: "goal_completion",
            description: "Objectif complété",
            timestamp: new Date(Date.now() - 3600000),
          },
        ],
      };

      setStats(adminStats);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast.error("Erreur lors du chargement des données");
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
        fetchAdminData();
      } else {
        throw new Error("Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement du tableau de bord admin...</span>
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
              Tableau de bord Admin
            </h1>
            <p className="text-gray-400 mt-2">
              Gérez votre plateforme d'apprentissage IA
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/admin/goals/new")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouvel Objectif
            </button>
            <button
              onClick={() => navigate("/admin/users")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Users className="w-4 h-4 mr-2" />
              Gérer Utilisateurs
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-gray-100">
                {stats?.totalUsers}
              </span>
            </div>
            <p className="text-gray-400">Utilisateurs totaux</p>
            <p className="text-sm text-green-400 mt-1">
              {stats?.activeUsers} actifs
            </p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-gray-100">
                {stats?.totalGoals}
              </span>
            </div>
            <p className="text-gray-400">Objectifs créés</p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-gray-100">
                {stats?.completionRate}%
              </span>
            </div>
            <p className="text-gray-400">Taux de complétion</p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-100">
                {stats?.averageScore}%
              </span>
            </div>
            <p className="text-gray-400">Score moyen</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Goals Management */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">
                Gestion des Objectifs
              </h2>
              <button
                onClick={() => navigate("/admin/goals")}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Voir tout
              </button>
            </div>

            <div className="space-y-4">
              {goals.slice(0, 3).map(goal => (
                <div
                  key={goal._id}
                  className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg"
                >
                  <div>
                    <h3 className="text-gray-200 font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-400">
                      {goal.category} • {goal.level}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/admin/goals/${goal._id}/edit`)}
                      className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigate(`/goals/${goal._id}`)}
                      className="p-2 text-green-400 hover:text-green-300 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal._id)}
                      className="p-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-card p-6 rounded-xl">
            <h2 className="text-xl font-bold text-gray-100 mb-6">
              Activité Récente
            </h2>

            <div className="space-y-4">
              {stats?.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="p-2 rounded-full bg-purple-500/20">
                    <Clock className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-200">{activity.description}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass-card p-6 rounded-xl">
          <h2 className="text-xl font-bold text-gray-100 mb-6">
            Statistiques Rapides
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {users.filter(u => u.role === "user").length}
              </div>
              <p className="text-gray-400">Étudiants</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {goals.filter(g => g.level === "beginner").length}
              </div>
              <p className="text-gray-400">Objectifs Débutant</p>
            </div>

            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {goals.filter(g => g.level === "advanced").length}
              </div>
              <p className="text-gray-400">Objectifs Avancés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
