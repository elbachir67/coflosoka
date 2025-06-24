import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  User,
  Mail,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";

function RegisterPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(api.auth.register, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'inscription");
      }

      const data = await response.json();

      // Connecter l'utilisateur
      await signIn(email, password);

      toast.success("Inscription réussie");
      // Rediriger vers l'évaluation après l'inscription
      navigate("/assessment");
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error instanceof Error ? error.message : "Erreur lors de l'inscription"
      );
      toast.error("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const checkPasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    checkPasswordStrength(newPassword);
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Très faible";
      case 1:
        return "Faible";
      case 2:
        return "Moyen";
      case 3:
        return "Fort";
      case 4:
        return "Très fort";
      default:
        return "";
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-red-500";
      case 1:
        return "bg-orange-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-green-500";
      case 4:
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 glass-card p-8 rounded-xl relative z-10"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto h-16 w-16 bg-purple-600/20 rounded-xl flex items-center justify-center"
          >
            <User className="h-8 w-8 text-purple-400" />
          </motion.div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-100">
            Créer un compte
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Ou{" "}
            <Link
              to="/login"
              className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
            >
              connectez-vous à votre compte
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
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                  placeholder="Adresse email"
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
                Mot de passe
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
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Mot de passe"
                  value={password}
                  onChange={handlePasswordChange}
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

              {/* Password strength indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-400">
                      Force du mot de passe: {getPasswordStrengthText()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {passwordStrength}/4
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
                      style={{ width: `${(passwordStrength / 4) * 100}%` }}
                    ></div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="flex items-center text-xs">
                      <CheckCircle
                        className={`w-3 h-3 mr-1 ${
                          password.length >= 8
                            ? "text-green-400"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={
                          password.length >= 8
                            ? "text-gray-300"
                            : "text-gray-500"
                        }
                      >
                        8+ caractères
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <CheckCircle
                        className={`w-3 h-3 mr-1 ${
                          /[A-Z]/.test(password)
                            ? "text-green-400"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={
                          /[A-Z]/.test(password)
                            ? "text-gray-300"
                            : "text-gray-500"
                        }
                      >
                        Majuscule
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <CheckCircle
                        className={`w-3 h-3 mr-1 ${
                          /[0-9]/.test(password)
                            ? "text-green-400"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={
                          /[0-9]/.test(password)
                            ? "text-gray-300"
                            : "text-gray-500"
                        }
                      >
                        Chiffre
                      </span>
                    </div>
                    <div className="flex items-center text-xs">
                      <CheckCircle
                        className={`w-3 h-3 mr-1 ${
                          /[^A-Za-z0-9]/.test(password)
                            ? "text-green-400"
                            : "text-gray-600"
                        }`}
                      />
                      <span
                        className={
                          /[^A-Za-z0-9]/.test(password)
                            ? "text-gray-300"
                            : "text-gray-500"
                        }
                      >
                        Caractère spécial
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pr-10"
                  placeholder="Confirmer le mot de passe"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* Password match indicator */}
              {confirmPassword && (
                <div className="mt-1 flex items-center">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-xs text-green-400">
                        Les mots de passe correspondent
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-400 mr-1" />
                      <span className="text-xs text-red-400">
                        Les mots de passe ne correspondent pas
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
              J'accepte les{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                conditions d'utilisation
              </a>{" "}
              et la{" "}
              <a href="#" className="text-purple-400 hover:text-purple-300">
                politique de confidentialité
              </a>
            </label>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                "Inscription en cours..."
              ) : (
                <>
                  S'inscrire
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

export default RegisterPage;
