import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  Users,
  Target,
  Database,
  Activity,
  Settings,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  FileText,
  Loader2,
  Play,
  Trash2,
  Shield,
  Server,
  HardDrive,
  Zap,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface AdminStats {
  users: {
    total: number;
    active: number;
    newThisWeek: number;
    activeRate: number;
  };
  pathways: {
    total: number;
    completed: number;
    active: number;
    completionRate: number;
  };
  quizzes: {
    total: number;
    averageScore: number;
  };
  recentActivity: any[];
}

interface BootstrapStatus {
  users: number;
  goals: number;
  achievements: number;
  forumPosts: number;
  sharedResources: number;
  studyGroups: number;
  lastUpdate: string;
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bootstrapStatus, setBootstrapStatus] =
    useState<BootstrapStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [bootstrapLoading, setBootstrapLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }

    fetchAdminStats();
    fetchBootstrapStatus();
  }, [isAdmin, navigate]);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch(`${api.API_URL}/api/analytics/admin`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      // Données simulées pour la démonstration
      setStats({
        users: { total: 25, active: 18, newThisWeek: 3, activeRate: 72 },
        pathways: { total: 45, completed: 12, active: 33, completionRate: 27 },
        quizzes: { total: 156, averageScore: 78 },
        recentActivity: [
          {
            type: "user_registration",
            description: "Nouvel utilisateur",
            timestamp: new Date(),
          },
          {
            type: "pathway_completion",
            description: "Parcours complété",
            timestamp: new Date(),
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchBootstrapStatus = async () => {
    try {
      const response = await fetch(
        `${api.API_URL}/api/admin/bootstrap/status`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBootstrapStatus(data);
      }
    } catch (error) {
      console.error("Error fetching bootstrap status:", error);
    }
  };

  const handleBootstrap = async (type: string) => {
    if (
      type === "reset" &&
      !confirm(
        "⚠️ ATTENTION : Cette action va SUPPRIMER toutes les données ! Êtes-vous sûr ?"
      )
    ) {
      return;
    }

    setBootstrapLoading(true);
    try {
      const endpoint =
        type === "complete"
          ? "/api/admin/bootstrap/complete"
          : type === "reset"
          ? "/api/admin/bootstrap/reset"
          : `/api/admin/bootstrap/${type}`;

      const body = type === "reset" ? { confirmReset: true } : {};

      const response = await fetch(`${api.API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        await fetchBootstrapStatus();
        await fetchAdminStats();
      } else {
        const error = await response.json();
        throw new Error(error.error);
      }
    } catch (error) {
      console.error("Bootstrap error:", error);
      toast.error(
        error instanceof Error ? error.message : "Erreur lors de l'opération"
      );
    } finally {
      setBootstrapLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      await handleBootstrap("export");
      toast.success("Base de données exportée avec succès");
    } catch (error) {
      toast.error("Erreur lors de l'export");
    } finally {
      setExportLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement du dashboard admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
              Dashboard Administrateur
            </h1>
            <p className="text-gray-400 mt-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Gestion et supervision de la plateforme AI4Nieup
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-red-400 font-semibold">MODE ADMIN</span>
          </div>
        </motion.div>

        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <Users className="w-8 h-8 text-blue-400" />
                <span className="text-3xl font-bold text-gray-100">
                  {stats.users.total}
                </span>
              </div>
              <p className="text-gray-400 font-medium">Utilisateurs Total</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-400">
                  {stats.users.active} actifs
                </span>
                <span className="text-gray-500 mx-2">•</span>
                <span className="text-blue-400">
                  {stats.users.newThisWeek} nouveaux
                </span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-gray-100">
                  {stats.pathways.total}
                </span>
              </div>
              <p className="text-gray-400 font-medium">Parcours Créés</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-400">
                  {stats.pathways.completed} complétés
                </span>
                <span className="text-gray-500 mx-2">•</span>
                <span className="text-purple-400">
                  {stats.pathways.completionRate}%
                </span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <BarChart3 className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-gray-100">
                  {stats.quizzes.averageScore}%
                </span>
              </div>
              <p className="text-gray-400 font-medium">Score Moyen Quiz</p>
              <div className="mt-2 flex items-center text-sm">
                <span className="text-green-400">
                  {stats.quizzes.total} quiz complétés
                </span>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20">
              <div className="flex items-center justify-between mb-4">
                <Activity className="w-8 h-8 text-yellow-400" />
                <span className="text-3xl font-bold text-gray-100">
                  {stats.users.activeRate}%
                </span>
              </div>
              <p className="text-gray-400 font-medium">Taux d'Activité</p>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.users.activeRate}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions Rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin/goals")}
            className="glass-card p-6 rounded-xl hover:bg-gray-800/30 transition-colors text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 ml-4">
                Gérer les Objectifs
              </h3>
            </div>
            <p className="text-gray-400">
              Créer, modifier et organiser les parcours d'apprentissage
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin/users")}
            className="glass-card p-6 rounded-xl hover:bg-gray-800/30 transition-colors text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 ml-4">
                Gérer les Utilisateurs
              </h3>
            </div>
            <p className="text-gray-400">
              Administrer les comptes et permissions utilisateurs
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/admin/goals/new")}
            className="glass-card p-6 rounded-xl hover:bg-gray-800/30 transition-colors text-left"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <FileText className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 ml-4">
                Créer un Objectif
              </h3>
            </div>
            <p className="text-gray-400">
              Ajouter de nouveaux parcours d'apprentissage
            </p>
          </motion.button>
        </motion.div>

        {/* État de la Base de Données */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-8 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-100 flex items-center">
              <Database className="w-6 h-6 text-red-400 mr-3" />
              État de la Base de Données
            </h2>
            <button
              onClick={fetchBootstrapStatus}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
          </div>

          {bootstrapStatus ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-100">
                  {bootstrapStatus.users}
                </p>
                <p className="text-sm text-gray-400">Utilisateurs</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-100">
                  {bootstrapStatus.goals}
                </p>
                <p className="text-sm text-gray-400">Objectifs</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-100">
                  {bootstrapStatus.achievements}
                </p>
                <p className="text-sm text-gray-400">Achievements</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <FileText className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-100">
                  {bootstrapStatus.forumPosts}
                </p>
                <p className="text-sm text-gray-400">Posts Forum</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <Upload className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-100">
                  {bootstrapStatus.sharedResources}
                </p>
                <p className="text-sm text-gray-400">Ressources</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-800/50">
                <Users className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-100">
                  {bootstrapStatus.studyGroups}
                </p>
                <p className="text-sm text-gray-400">Groupes</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">
                Chargement de l'état de la base de données...
              </p>
            </div>
          )}
        </motion.div>

        {/* Outils de Bootstrap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-8 mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
            <Server className="w-6 h-6 text-green-400 mr-3" />
            Outils de Bootstrap
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Bootstrap Complet */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBootstrap("complete")}
              disabled={bootstrapLoading}
              className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 hover:border-green-500/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center mb-3">
                <Play className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-lg font-bold text-green-400">
                  Bootstrap Complet
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Initialise toute la plateforme avec données complètes
              </p>
            </motion.button>

            {/* Données Initiales */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBootstrap("initial-data")}
              disabled={bootstrapLoading}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center mb-3">
                <Target className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-lg font-bold text-blue-400">
                  Données Initiales
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Objectifs, évaluations et quiz de base
              </p>
            </motion.button>

            {/* Achievements */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBootstrap("achievements")}
              disabled={bootstrapLoading}
              className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 hover:border-yellow-500/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center mb-3">
                <Zap className="w-6 h-6 text-yellow-400 mr-3" />
                <h3 className="text-lg font-bold text-yellow-400">
                  Achievements
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Système de gamification et badges
              </p>
            </motion.button>

            {/* Données Collaboratives */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBootstrap("collaborative")}
              disabled={bootstrapLoading}
              className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 hover:border-purple-500/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-lg font-bold text-purple-400">
                  Collaboration
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Forum, groupes et ressources partagées
              </p>
            </motion.button>

            {/* Utilisateurs Démo */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBootstrap("demo-data")}
              disabled={bootstrapLoading}
              className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 hover:border-cyan-500/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center mb-3">
                <Users className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-lg font-bold text-cyan-400">
                  Utilisateurs Démo
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Comptes de test avec profils variés
              </p>
            </motion.button>

            {/* Données Étendues */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBootstrap("extensive-data")}
              disabled={bootstrapLoading}
              className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 hover:border-orange-500/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center mb-3">
                <HardDrive className="w-6 h-6 text-orange-400 mr-3" />
                <h3 className="text-lg font-bold text-orange-400">
                  Données Étendues
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Contenu réaliste et complet
              </p>
            </motion.button>
          </div>

          {bootstrapLoading && (
            <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin mr-3" />
              <span className="text-blue-400">Opération en cours...</span>
            </div>
          )}
        </motion.div>

        {/* Opérations Critiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card rounded-xl p-8"
        >
          <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
            Opérations Critiques
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Export */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              disabled={exportLoading}
              className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/30 hover:border-green-500/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center mb-3">
                <Download className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-lg font-bold text-green-400">
                  Exporter BDD
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Sauvegarder toutes les données
              </p>
            </motion.button>

            {/* Import */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBootstrap("import")}
              disabled={bootstrapLoading}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/30 hover:border-blue-500/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center mb-3">
                <Upload className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-lg font-bold text-blue-400">
                  Importer BDD
                </h3>
              </div>
              <p className="text-gray-300 text-sm">
                Restaurer depuis une sauvegarde
              </p>
            </motion.button>

            {/* Reset */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleBootstrap("reset")}
              disabled={bootstrapLoading}
              className="p-6 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 hover:border-red-500/50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center mb-3">
                <Trash2 className="w-6 h-6 text-red-400 mr-3" />
                <h3 className="text-lg font-bold text-red-400">Reset BDD</h3>
              </div>
              <p className="text-gray-300 text-sm">
                ⚠️ Réinitialiser complètement
              </p>
            </motion.button>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-red-400 font-semibold">Attention</span>
            </div>
            <p className="text-gray-300 text-sm">
              Les opérations de reset sont irréversibles. Assurez-vous d'avoir
              une sauvegarde avant de procéder.
            </p>
          </div>
        </motion.div>

        {/* Activité Récente */}
        {stats?.recentActivity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="glass-card rounded-xl p-8"
          >
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
              <Activity className="w-6 h-6 text-blue-400 mr-3" />
              Activité Récente
            </h2>

            <div className="space-y-4">
              {stats.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 rounded-lg bg-gray-800/50"
                >
                  <div className="p-2 rounded-full bg-blue-500/20 mr-4">
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-200 font-medium">
                      {activity.description}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
