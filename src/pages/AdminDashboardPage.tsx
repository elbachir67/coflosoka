import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";
import {
  Users,
  Database,
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
  RefreshCw,
  Settings,
  Shield,
  Activity,
  FileText,
  Upload,
  Play,
  Pause,
  Server,
  HardDrive,
  Zap,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
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
  recentActivity: {
    type: string;
    description: string;
    timestamp: Date;
    userId?: string;
  }[];
}

interface DatabaseOperation {
  name: string;
  description: string;
  action: string;
  icon: typeof Database;
  color: string;
  dangerous?: boolean;
}

function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState({
    database: "healthy",
    server: "healthy",
    apis: "healthy",
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }

    fetchAdminData();
    checkSystemStatus();
  }, [isAdmin, navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${api.API_URL}/api/analytics/admin`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error("Erreur lors du chargement");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors du chargement des données admin");
    } finally {
      setLoading(false);
    }
  };

  const checkSystemStatus = async () => {
    try {
      // Vérifier le statut de la base de données
      const dbResponse = await fetch("/health", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      setSystemStatus(prev => ({
        ...prev,
        database: dbResponse.ok ? "healthy" : "error",
        server: "healthy",
        apis: "healthy",
      }));
    } catch (error) {
      setSystemStatus(prev => ({
        ...prev,
        database: "error",
      }));
    }
  };

  const handleDatabaseOperation = async (operation: string) => {
    const confirmMessage = {
      reset:
        "Êtes-vous sûr de vouloir RÉINITIALISER COMPLÈTEMENT la base de données ? Cette action est IRRÉVERSIBLE !",
      populate:
        "Voulez-vous peupler la base de données avec des données de démonstration ?",
      backup: "Voulez-vous créer une sauvegarde de la base de données ?",
      export: "Voulez-vous exporter toutes les données ?",
    };

    if (
      operation === "reset" &&
      !confirm(confirmMessage[operation as keyof typeof confirmMessage])
    ) {
      return;
    }

    setOperationLoading(operation);

    try {
      const response = await fetch(
        `${api.API_URL}/api/admin/database/${operation}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        toast.success(result.message || `Opération ${operation} réussie`);

        if (operation === "reset" || operation === "populate") {
          // Recharger les stats après reset/populate
          setTimeout(() => fetchAdminData(), 2000);
        }
      } else {
        throw new Error(`Erreur lors de l'opération ${operation}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Erreur lors de l'opération ${operation}`);
    } finally {
      setOperationLoading(null);
    }
  };

  const handleExportData = async (format: "csv" | "json" | "excel") => {
    setOperationLoading(`export-${format}`);

    try {
      const response = await fetch(
        `${api.API_URL}/api/admin/export?format=${format}`,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `platform_data_${
          new Date().toISOString().split("T")[0]
        }.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success(`Export ${format.toUpperCase()} téléchargé`);
      } else {
        throw new Error("Erreur lors de l'export");
      }
    } catch (error) {
      toast.error("Erreur lors de l'export");
    } finally {
      setOperationLoading(null);
    }
  };

  const databaseOperations: DatabaseOperation[] = [
    {
      name: "Peupler les données",
      description:
        "Ajouter des données de démonstration (utilisateurs, objectifs, quiz)",
      action: "populate",
      icon: Upload,
      color: "bg-green-500/20 text-green-400 border-green-500/30",
    },
    {
      name: "Sauvegarder",
      description: "Créer une sauvegarde complète de la base de données",
      action: "backup",
      icon: HardDrive,
      color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },
    {
      name: "Réinitialiser",
      description: "ATTENTION: Supprimer TOUTES les données et recommencer",
      action: "reset",
      icon: Trash2,
      color: "bg-red-500/20 text-red-400 border-red-500/30",
      dangerous: true,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
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
        {/* Header Admin */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-400 via-purple-400 to-red-400 bg-clip-text text-transparent mb-2">
              Administration IA4Nieup
            </h1>
            <p className="text-gray-400 text-lg">
              Gérez votre plateforme d'apprentissage IA
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-red-400 font-bold">Mode Administrateur</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-xl mb-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50"
        >
          <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
            <Server className="w-5 h-5 text-blue-400 mr-2" />
            État du Système
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Database className="w-6 h-6 text-blue-400" />
                <span className="text-gray-300">Base de données</span>
              </div>
              {getStatusIcon(systemStatus.database)}
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Server className="w-6 h-6 text-green-400" />
                <span className="text-gray-300">Serveur</span>
              </div>
              {getStatusIcon(systemStatus.server)}
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Zap className="w-6 h-6 text-yellow-400" />
                <span className="text-gray-300">APIs externes</span>
              </div>
              {getStatusIcon(systemStatus.apis)}
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-3xl font-bold text-gray-100">
                {stats?.users.total || 0}
              </span>
            </div>
            <p className="text-gray-400 font-medium">Utilisateurs totaux</p>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-green-400">
                {stats?.users.active || 0} actifs
              </span>
              <span className="text-blue-400">
                {stats?.users.newThisWeek || 0} nouveaux
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-400" />
              <span className="text-3xl font-bold text-gray-100">
                {stats?.pathways.total || 0}
              </span>
            </div>
            <p className="text-gray-400 font-medium">Parcours créés</p>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-green-400">
                {stats?.pathways.completed || 0} terminés
              </span>
              <span className="text-blue-400">
                {stats?.pathways.active || 0} actifs
              </span>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
              <span className="text-3xl font-bold text-gray-100">
                {stats?.pathways.completionRate || 0}%
              </span>
            </div>
            <p className="text-gray-400 font-medium">Taux de complétion</p>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats?.pathways.completionRate || 0}%` }}
              />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-card p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border border-yellow-500/20"
          >
            <div className="flex items-center justify-between mb-4">
              <Award className="w-8 h-8 text-yellow-400" />
              <span className="text-3xl font-bold text-gray-100">
                {stats?.quizzes.averageScore || 0}%
              </span>
            </div>
            <p className="text-gray-400 font-medium">Score moyen global</p>
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats?.quizzes.averageScore || 0}%` }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Database Management */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">
                  Gestion de la Base de Données
                </h2>
                <p className="text-gray-400 text-sm">
                  Opérations sur les données de la plateforme
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {databaseOperations.map((operation, index) => {
                const Icon = operation.icon;
                const isLoading = operationLoading === operation.action;

                return (
                  <motion.button
                    key={operation.action}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleDatabaseOperation(operation.action)}
                    disabled={isLoading || operationLoading !== null}
                    className={`w-full p-4 rounded-lg border transition-all duration-200 ${
                      operation.color
                    } ${
                      operation.dangerous ? "hover:border-red-400" : ""
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                        <div className="text-left">
                          <p className="font-medium">{operation.name}</p>
                          <p className="text-sm opacity-80">
                            {operation.description}
                          </p>
                        </div>
                      </div>
                      {operation.dangerous && (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Content Management */}
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-purple-500/20">
                <Settings className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">
                  Gestion du Contenu
                </h2>
                <p className="text-gray-400 text-sm">
                  Créer et gérer les éléments pédagogiques
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/goals")}
                className="w-full p-4 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-400 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Target className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Gérer les Objectifs</p>
                    <p className="text-sm opacity-80">
                      Créer, modifier, supprimer les parcours d'apprentissage
                    </p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/goals/new")}
                className="w-full p-4 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:border-green-400 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Créer un Objectif</p>
                    <p className="text-sm opacity-80">
                      Ajouter un nouveau parcours d'apprentissage
                    </p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/admin/users")}
                className="w-full p-4 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:border-blue-400 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5" />
                  <div className="text-left">
                    <p className="font-medium">Gérer les Utilisateurs</p>
                    <p className="text-sm opacity-80">
                      Administrer les comptes et permissions
                    </p>
                  </div>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 rounded-xl mb-8"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Download className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-100">
                Export des Données
              </h2>
              <p className="text-gray-400 text-sm">
                Télécharger les données de la plateforme
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExportData("csv")}
              disabled={operationLoading?.startsWith("export")}
              className="p-4 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:border-blue-400 transition-all duration-200 disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                {operationLoading === "export-csv" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
                <div className="text-left">
                  <p className="font-medium">Export CSV</p>
                  <p className="text-sm opacity-80">Données tabulaires</p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExportData("json")}
              disabled={operationLoading?.startsWith("export")}
              className="p-4 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:border-purple-400 transition-all duration-200 disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                {operationLoading === "export-json" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Database className="w-5 h-5" />
                )}
                <div className="text-left">
                  <p className="font-medium">Export JSON</p>
                  <p className="text-sm opacity-80">Données structurées</p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExportData("excel")}
              disabled={operationLoading?.startsWith("export")}
              className="p-4 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:border-green-400 transition-all duration-200 disabled:opacity-50"
            >
              <div className="flex items-center space-x-3">
                {operationLoading === "export-excel" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <BarChart3 className="w-5 h-5" />
                )}
                <div className="text-left">
                  <p className="font-medium">Export Excel</p>
                  <p className="text-sm opacity-80">Rapport complet</p>
                </div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 rounded-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <Activity className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">
                  Activité Récente
                </h2>
                <p className="text-gray-400 text-sm">
                  Dernières actions sur la plateforme
                </p>
              </div>
            </div>
            <button
              onClick={fetchAdminData}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-300" />
            </button>
          </div>

          <div className="space-y-4 max-h-64 overflow-y-auto">
            {stats?.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors"
              >
                <div className="p-2 rounded-full bg-purple-500/20">
                  <Clock className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 font-medium">
                    {activity.description}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-xs text-gray-500">
                  {activity.type.replace("_", " ")}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
