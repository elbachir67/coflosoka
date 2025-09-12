import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { Shield, Lock, Eye, EyeOff, AlertCircle, User } from "lucide-react";
import { motion } from "framer-motion";

function AdminLoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(api.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          isAdminLogin: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur de connexion");
      }

      const data = await response.json();

      if (!data.user.isAdmin) {
        throw new Error("Accès administrateur requis");
      }

      await signIn(email, password);
      toast.success("Connexion administrateur réussie");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      setError(error instanceof Error ? error.message : "Erreur de connexion");
      toast.error("Erreur de connexion administrateur");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-purple-900/20 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 glass-card p-8 rounded-xl relative z-10 border border-red-500/20"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-16 w-16 bg-red-600/20 rounded-xl flex items-center justify-center border border-red-500/30"
          >
            <Shield className="h-8 w-8 text-red-400" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
            Administration
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Accès réservé aux administrateurs de la plateforme
          </p>
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">
                Zone sécurisée
              </span>
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start"
          >
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Email administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                  placeholder="admin@ucad.edu.sn"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Mot de passe administrateur
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Mot de passe sécurisé"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Vérification...
                </div>
              ) : (
                <div className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Accès Administrateur
                </div>
              )}
            </motion.button>
          </div>
        </form>

        <div className="border-t border-gray-700 pt-6">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-3">
              Compte de démonstration administrateur :
            </p>
            <motion.button
              whileHover={{
                scale: 1.02,
                backgroundColor: "rgba(75, 85, 99, 0.5)",
              }}
              onClick={() => {
                setEmail("admin@ucad.edu.sn");
                setPassword("Admin123!");
              }}
              className="w-full text-left px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-sm text-gray-300 transition-colors border border-red-500/20"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-red-500/20">
                  <Shield className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <div className="font-medium text-red-400">
                    admin@ucad.edu.sn
                  </div>
                  <div className="text-gray-500 text-xs">Admin123!</div>
                </div>
              </div>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default AdminLoginPage;
