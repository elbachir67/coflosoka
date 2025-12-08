import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import {
  Brain,
  Target,
  ArrowRight,
  Sparkles,
  BookOpen,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";

const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Brain;
  title: string;
  description: string;
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`rounded-2xl p-6 transition-all duration-300 ${
        isDark
          ? "bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50"
          : "bg-white hover:shadow-lg border border-slate-200"
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
          isDark ? "bg-purple-500/20" : "bg-purple-100"
        }`}
      >
        <Icon className={`w-6 h-6 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
      </div>
      <h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}>
        {title}
      </h3>
      <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"}`}>
        {description}
      </p>
    </motion.div>
  );
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark ? "bg-[#0A0A0F]" : "bg-slate-50"
      }`}
    >
      {/* Hero Section - Sobre et épuré */}
      <div className="relative overflow-hidden">
        {/* Subtle background gradient */}
        <div
          className={`absolute inset-0 ${
            isDark
              ? "bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"
              : "bg-gradient-to-br from-purple-100/50 via-transparent to-blue-100/50"
          }`}
        />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 mb-6"
            >
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  isDark
                    ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                <Sparkles className="w-4 h-4 inline mr-1.5" />
                Plateforme d'apprentissage IA
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Apprenez l'Intelligence
              <br />
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
                Artificielle
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto ${
                isDark ? "text-gray-400" : "text-slate-600"
              }`}
            >
              Une formation personnalisée et adaptative pour maîtriser l'IA,
              de la théorie à la pratique.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                to="/assessment"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Commencer l'évaluation
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center justify-center ${
                    isDark
                      ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                      : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 shadow-sm"
                  }`}
                >
                  <Target className="w-5 h-5 mr-2" />
                  Mon tableau de bord
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={`py-20 ${isDark ? "bg-gray-900/30" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Pourquoi nous choisir ?
            </h2>
            <p className={`max-w-2xl mx-auto ${isDark ? "text-gray-400" : "text-slate-600"}`}>
              Une approche unique combinant personnalisation et ressources de qualité
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={Brain}
              title="Parcours Adaptatifs"
              description="Des recommandations basées sur votre niveau et vos objectifs professionnels."
            />
            <FeatureCard
              icon={BookOpen}
              title="Contenu Structuré"
              description="Des modules progressifs couvrant tous les aspects de l'IA moderne."
            />
            <FeatureCard
              icon={Users}
              title="Communauté Active"
              description="Échangez avec d'autres apprenants et experts du domaine."
            />
            <FeatureCard
              icon={Award}
              title="Certifications"
              description="Validez vos compétences avec des certifications reconnues."
            />
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Card 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-br from-purple-900/30 to-purple-800/10 border border-purple-500/20"
                  : "bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  isDark ? "bg-purple-500/20" : "bg-purple-200"
                }`}
              >
                <Brain className={`w-7 h-7 ${isDark ? "text-purple-400" : "text-purple-600"}`} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                Évaluation Personnalisée
              </h3>
              <p className={`mb-6 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                Découvrez votre niveau actuel et obtenez des recommandations sur mesure pour votre parcours d'apprentissage.
              </p>
              <Link
                to="/assessment"
                className={`inline-flex items-center font-medium ${
                  isDark ? "text-purple-400 hover:text-purple-300" : "text-purple-600 hover:text-purple-700"
                }`}
              >
                Commencer
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                isDark
                  ? "bg-gradient-to-br from-blue-900/30 to-blue-800/10 border border-blue-500/20"
                  : "bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  isDark ? "bg-blue-500/20" : "bg-blue-200"
                }`}
              >
                <Target className={`w-7 h-7 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
                Objectifs d'Apprentissage
              </h3>
              <p className={`mb-6 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                Explorez nos parcours structurés et choisissez celui qui correspond à vos ambitions.
              </p>
              <Link
                to={isAuthenticated ? "/goals" : "/assessment"}
                className={`inline-flex items-center font-medium ${
                  isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Explorer
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section - Minimal */}
      <div className={`py-16 ${isDark ? "bg-gray-900/50" : "bg-slate-100"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? "text-purple-400" : "text-purple-600"}`}>
                15+
              </div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                Parcours disponibles
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
                200+
              </div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                Ressources
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl md:text-4xl font-bold mb-2 ${isDark ? "text-green-400" : "text-green-600"}`}>
                1000+
              </div>
              <div className={`text-sm ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                Apprenants
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
            Prêt à commencer ?
          </h2>
          <p className={`mb-8 ${isDark ? "text-gray-400" : "text-slate-600"}`}>
            Évaluez vos compétences et démarrez votre parcours personnalisé dès aujourd'hui.
          </p>
          <Link
            to="/assessment"
            className="inline-flex items-center px-8 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Commencer l'évaluation
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className={`py-8 border-t ${isDark ? "border-gray-800" : "border-slate-200"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className={`text-center text-sm ${isDark ? "text-gray-500" : "text-slate-500"}`}>
            © 2025 AI4Nieup - Centre d'Excellence en Intelligence Artificielle
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
