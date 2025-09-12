import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { api } from "../config/api";
import {
  Users,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  Shield,
  User,
  Loader2,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface UserData {
  _id: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  profile?: {
    learningStyle: string;
    preferences: {
      mathLevel: string;
      programmingLevel: string;
      preferredDomain: string;
    };
    assessments: any[];
  };
}

function AdminUsersPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin");
      return;
    }

    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.users}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error("Erreur lors du chargement");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(`${api.users}/${userId}/toggle-status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast.success(
          `Utilisateur ${!currentStatus ? "activé" : "désactivé"} avec succès`
        );
        fetchUsers();
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handlePromoteUser = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";

    if (
      !confirm(
        `Êtes-vous sûr de vouloir ${
          newRole === "admin" ? "promouvoir" : "rétrograder"
        } cet utilisateur ?`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`${api.users}/${userId}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        toast.success(
          `Utilisateur ${
            newRole === "admin" ? "promu" : "rétrogradé"
          } avec succès`
        );
        fetchUsers();
      } else {
        throw new Error("Erreur lors de la mise à jour");
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du rôle");
    }
  };

  const exportUsers = () => {
    const csvContent = [
      ["Email", "Rôle", "Statut", "Date d'inscription", "Dernière connexion"],
      ...users.map(u => [
        u.email,
        u.role,
        u.isActive ? "Actif" : "Inactif",
        new Date(u.createdAt).toLocaleDateString(),
        u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Jamais",
      ]),
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "active" && user.isActive) ||
      (selectedStatus === "inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement des utilisateurs...</span>
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
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-400 mt-2">
              Gérez les comptes utilisateurs et leurs permissions
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={exportUsers}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </button>
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-8 h-8 text-blue-400" />
              <span className="text-2xl font-bold text-gray-100">
                {users.length}
              </span>
            </div>
            <p className="text-gray-400">Total utilisateurs</p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <span className="text-2xl font-bold text-gray-100">
                {users.filter(u => u.isActive).length}
              </span>
            </div>
            <p className="text-gray-400">Utilisateurs actifs</p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-gray-100">
                {users.filter(u => u.role === "admin").length}
              </span>
            </div>
            <p className="text-gray-400">Administrateurs</p>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-yellow-400" />
              <span className="text-2xl font-bold text-gray-100">
                {
                  users.filter(
                    u =>
                      new Date(u.createdAt) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length
                }
              </span>
            </div>
            <p className="text-gray-400">Nouveaux (7j)</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 rounded-xl mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative flex-1 min-w-64">
              <input
                type="text"
                placeholder="Rechercher par email..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>

            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les rôles</option>
              <option value="user">Utilisateurs</option>
              <option value="admin">Administrateurs</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Utilisateur
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Rôle
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Inscription
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Dernière connexion
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredUsers.map(userData => (
                  <tr key={userData._id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-purple-500/20 mr-3">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-gray-200 font-medium">
                            {userData.email}
                          </div>
                          {userData.profile && (
                            <div className="text-sm text-gray-400">
                              {userData.profile.preferences.preferredDomain} •{" "}
                              {userData.profile.preferences.mathLevel}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userData.role === "admin"
                            ? "bg-purple-500/20 text-purple-400"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {userData.role === "admin" ? "Admin" : "Utilisateur"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          userData.isActive
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {userData.isActive ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {userData.lastLogin
                        ? new Date(userData.lastLogin).toLocaleDateString()
                        : "Jamais"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            handleToggleUserStatus(
                              userData._id,
                              userData.isActive
                            )
                          }
                          className={`p-2 rounded-lg transition-colors ${
                            userData.isActive
                              ? "text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              : "text-green-400 hover:text-green-300 hover:bg-green-500/10"
                          }`}
                          title={userData.isActive ? "Désactiver" : "Activer"}
                        >
                          {userData.isActive ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handlePromoteUser(userData._id, userData.role)
                          }
                          className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors"
                          title={
                            userData.role === "admin"
                              ? "Rétrograder"
                              : "Promouvoir admin"
                          }
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Aucun utilisateur trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminUsersPage;
