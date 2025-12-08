import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { api } from "../config/api";
import { Lock, Eye, EyeOff, AlertCircle, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger
    if (isAuthenticated) {
      const redirectUrl =
        localStorage.getItem("redirectAfterLogin") || "/goals";
      localStorage.removeItem("redirectAfterLogin"); // Nettoyer après utilisation
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate]);

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
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Identifiants invalides");
      }

      const data = await response.json();
      if (data.success) {
        await signIn(email, password);
        toast.success("Connexion réussie");
        // La redirection sera gérée par le useEffect
      } else {
        throw new Error(data.message || "Erreur de connexion");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error instanceof Error ? error.message : "Erreur de connexion");
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-300 ${
      isDark ? "bg-[#0A0A0F]" : "bg-slate-50"
    }`}>
      {/* Background gradient */}
      <div className={`absolute inset-0 pointer-events-none ${
        isDark
          ? "bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"
          : "bg-gradient-to-br from-purple-100/50 via-transparent to-blue-100/50"
      }`}></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`max-w-md w-full space-y-8 p-8 rounded-xl relative z-10 transition-all duration-300 ${
          isDark
            ? "bg-gray-900/60 border border-gray-800/50 backdrop-blur-md"
            : "bg-white shadow-lg border border-slate-200"
        }`}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mx-auto h-16 w-16 rounded-xl flex items-center justify-center ${
              isDark ? "bg-purple-600/20" : "bg-purple-100"
            }`}
          >
            <Lock className={`h-8 w-8 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
          </motion.div>
          <h2 className={`mt-6 text-3xl font-extrabold ${isDark ? "text-gray-100" : "text-slate-900"}`}>
            Connexion
          </h2>
          <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}>
            Ou{" "}
            <Link
              to="/register"
              className="font-medium text-purple-500 hover:text-purple-400 transition-colors"
            >
              créez un compte
            </Link>
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start"
          >
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-slate-700"}`}
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className={`h-5 w-5 ${isDark ? "text-gray-500" : "text-slate-400"}`} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2.5 border focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm transition-colors ${
                    isDark
                      ? "border-gray-700 bg-gray-800 placeholder-gray-500 text-gray-100"
                      : "border-slate-300 bg-white placeholder-slate-400 text-slate-900"
                  }`}
                  placeholder="Adresse email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="relative">
              <label
                htmlFor="password"
                className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-400" : "text-slate-700"}`}
              >
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 ${isDark ? "text-gray-500" : "text-slate-400"}`} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`appearance-none rounded-lg relative block w-full pl-10 px-3 py-2.5 border focus:outline-none focus:ring-2 focus:ring-purple-500 sm:text-sm pr-10 transition-colors ${
                    isDark
                      ? "border-gray-700 bg-gray-800 placeholder-gray-500 text-gray-100"
                      : "border-slate-300 bg-white placeholder-slate-400 text-slate-900"
                  }`}
                  placeholder="Mot de passe"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none ${
                    isDark ? "text-gray-400 hover:text-gray-300" : "text-slate-400 hover:text-slate-600"
                  }`}
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className={`h-4 w-4 text-purple-600 focus:ring-purple-500 rounded ${
                  isDark ? "border-gray-700 bg-gray-800" : "border-slate-300 bg-white"
                }`}
              />
              <label
                htmlFor="remember-me"
                className={`ml-2 block text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}
              >
                Se souvenir de moi
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-purple-500 hover:text-purple-400"
              >
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              {loading ? (
                "Connexion en cours..."
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;
