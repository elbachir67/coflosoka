import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import GlobalSearch from "./GlobalSearch";
import {
  BookOpen,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
  Brain,
  Target,
  Award,
  Zap,
  Users,
  ExternalLink,
  ChevronDown,
  Bell,
  Home,
  Search,
  Settings,
  Plus,
  MessageSquare,
  BarChart3,
  Sparkles,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, signOut, user, isAuthenticated } = useAuth();
  const { profile } = useGamification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouveau module disponible",
      message:
        "Le module 'Introduction au Deep Learning' est maintenant disponible",
      time: "Il y a 2 heures",
      read: false,
    },
    {
      id: 2,
      title: "Quiz terminé",
      message: "Vous avez obtenu un score de 85% au quiz 'Fondamentaux du ML'",
      time: "Hier",
      read: true,
    },
  ]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
    setUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  // Raccourci clavier pour la recherche
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const markAllNotificationsAsRead = () => {
    setNotifications(
      notifications.map(notification => ({
        ...notification,
        read: true,
      }))
    );
  };

  // Fermer les menus déroulants quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".user-menu") &&
        !target.closest(".notifications-menu")
      ) {
        setUserMenuOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fermer les menus au changement de route
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-gray-900" />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    IA4Nieup
                  </span>
                  <div className="text-xs text-gray-400 -mt-1">
                    AI Learning Platform
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  isActive("/")
                    ? "bg-purple-500/20 text-purple-400 shadow-lg"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive("/dashboard")
                        ? "bg-purple-500/20 text-purple-400 shadow-lg"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Tableau de bord</span>
                  </Link>

                  <Link
                    to="/goals"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive("/goals")
                        ? "bg-purple-500/20 text-purple-400 shadow-lg"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    <span>Objectifs</span>
                  </Link>

                  <Link
                    to="/collaboration"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive("/collaboration")
                        ? "bg-purple-500/20 text-purple-400 shadow-lg"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Communauté</span>
                  </Link>

                  <Link
                    to="/external-apis"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive("/external-apis")
                        ? "bg-purple-500/20 text-purple-400 shadow-lg"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>APIs</span>
                  </Link>
                </>
              )}
            </div>

            {/* Search Button */}
            <div className="hidden md:block">
              <button
                onClick={toggleSearch}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50 group"
              >
                <Search className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                <span className="text-gray-400 group-hover:text-gray-300">
                  Rechercher...
                </span>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                    ⌘
                  </kbd>
                  <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                    K
                  </kbd>
                </div>
              </button>
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Search button for mobile */}
              <button
                onClick={toggleSearch}
                className="md:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-400" />
              </button>

              {isAuthenticated ? (
                <>
                  {/* XP and Level Display - Only for non-admin users */}
                  {profile && !isAdmin && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="hidden sm:flex items-center space-x-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-4 py-2 rounded-lg border border-purple-500/20"
                    >
                      <div className="flex items-center space-x-1">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-semibold">
                          {profile.totalXP.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm">XP</span>
                      </div>
                      <div className="w-px h-4 bg-gray-600"></div>
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400 font-semibold">
                          {profile.level}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Admin Badge */}
                  {isAdmin && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-red-500/10 to-purple-500/10 px-4 py-2 rounded-lg border border-red-500/20"
                    >
                      <Shield className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-semibold text-sm">
                        ADMIN
                      </span>
                    </motion.div>
                  )}

                  {/* Notifications - Only for non-admin users */}
                  {!isAdmin && (
                    <div className="relative notifications-menu">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleNotifications}
                        className="relative p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                      >
                        <Bell className="w-5 h-5 text-gray-300" />
                        {unreadNotificationsCount > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                          >
                            {unreadNotificationsCount}
                          </motion.span>
                        )}
                      </motion.button>

                      <AnimatePresence>
                        {notificationsOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 overflow-hidden"
                          >
                            <div className="p-4 border-b border-gray-800/50 flex justify-between items-center">
                              <h3 className="font-semibold text-gray-200">
                                Notifications
                              </h3>
                              <button
                                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                onClick={markAllNotificationsAsRead}
                              >
                                Tout marquer comme lu
                              </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                              {notifications.length > 0 ? (
                                notifications.map(notification => (
                                  <div
                                    key={notification.id}
                                    className={`p-4 border-b border-gray-800/30 hover:bg-gray-800/30 transition-colors ${
                                      !notification.read
                                        ? "bg-purple-500/5"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <div className="flex-1">
                                        <p className="font-medium text-gray-200 mb-1">
                                          {notification.title}
                                        </p>
                                        <p className="text-sm text-gray-400 mb-2">
                                          {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {notification.time}
                                        </p>
                                      </div>
                                      {!notification.read && (
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-1"></div>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-6 text-center text-gray-400">
                                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                  <p>Aucune notification</p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* User Menu */}
                  <div className="relative user-menu">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleUserMenu}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 border ${
                        isAdmin
                          ? "bg-red-800/50 hover:bg-red-700/50 border-red-700/50 hover:border-red-600/50"
                          : "bg-gray-800/50 hover:bg-gray-700/50 border-gray-700/50 hover:border-gray-600/50"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-lg ${
                          isAdmin
                            ? "bg-gradient-to-br from-red-500 to-purple-500"
                            : "bg-gradient-to-br from-purple-500 to-blue-500"
                        }`}
                      >
                        {isAdmin ? (
                          <Shield className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="hidden lg:block text-left">
                        <div
                          className={`text-sm font-medium max-w-[120px] truncate ${
                            isAdmin ? "text-red-200" : "text-gray-200"
                          }`}
                        >
                          {user?.email?.split("@")[0]}
                        </div>
                        <div
                          className={`text-xs ${
                            isAdmin ? "text-red-400" : "text-gray-400"
                          }`}
                        >
                          {isAdmin
                            ? "Administrateur"
                            : profile?.rank || "Utilisateur"}
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isAdmin ? "text-red-400" : "text-gray-400"
                        } ${userMenuOpen ? "rotate-180" : ""}`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {userMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 overflow-hidden"
                        >
                          {/* User Info */}
                          <div
                            className={`p-4 border-b border-gray-800/50 ${
                              isAdmin
                                ? "bg-gradient-to-r from-red-500/10 to-purple-500/10"
                                : "bg-gradient-to-r from-purple-500/10 to-blue-500/10"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                  isAdmin
                                    ? "bg-gradient-to-br from-red-500 to-purple-500"
                                    : "bg-gradient-to-br from-purple-500 to-blue-500"
                                }`}
                              >
                                {isAdmin ? (
                                  <Shield className="w-6 h-6 text-white" />
                                ) : (
                                  <User className="w-6 h-6 text-white" />
                                )}
                              </div>
                              <div>
                                <p
                                  className={`font-semibold ${
                                    isAdmin ? "text-red-200" : "text-gray-200"
                                  }`}
                                >
                                  {user?.email?.split("@")[0]}
                                </p>
                                <p
                                  className={`text-sm ${
                                    isAdmin ? "text-red-400" : "text-gray-400"
                                  }`}
                                >
                                  {isAdmin
                                    ? "Administrateur"
                                    : profile?.rank || "Utilisateur"}
                                </p>
                                {profile && !isAdmin && (
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div className="flex items-center space-x-1">
                                      <Zap className="w-3 h-3 text-yellow-400" />
                                      <span className="text-xs text-yellow-400 font-medium">
                                        {profile.totalXP.toLocaleString()} XP
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Award className="w-3 h-3 text-purple-400" />
                                      <span className="text-xs text-purple-400 font-medium">
                                        Niv. {profile.level}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Menu Items */}
                          <div className="py-2">
                            {isAdmin ? (
                              // Admin Menu Items
                              <>
                                <Link
                                  to="/admin/dashboard"
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                                  onClick={() => setUserMenuOpen(false)}
                                >
                                  <Settings className="w-4 h-4" />
                                  <span>Dashboard Admin</span>
                                </Link>
                                <Link
                                  to="/admin/goals"
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                                  onClick={() => setUserMenuOpen(false)}
                                >
                                  <Target className="w-4 h-4" />
                                  <span>Gérer Objectifs</span>
                                </Link>
                                <Link
                                  to="/admin/users"
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                                  onClick={() => setUserMenuOpen(false)}
                                >
                                  <Users className="w-4 h-4" />
                                  <span>Gérer Utilisateurs</span>
                                </Link>
                                <Link
                                  to="/admin/goals/new"
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                                  onClick={() => setUserMenuOpen(false)}
                                >
                                  <Plus className="w-4 h-4" />
                                  <span>Nouvel Objectif</span>
                                </Link>
                              </>
                            ) : (
                              // Regular User Menu Items
                              <>
                                <Link
                                  to="/dashboard"
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                  onClick={() => setUserMenuOpen(false)}
                                >
                                  <LayoutDashboard className="w-4 h-4" />
                                  <span>Tableau de bord</span>
                                </Link>
                                <Link
                                  to="/achievements"
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                  onClick={() => setUserMenuOpen(false)}
                                >
                                  <Award className="w-4 h-4" />
                                  <span>Achievements</span>
                                </Link>
                                <Link
                                  to="/analytics"
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                                  onClick={() => setUserMenuOpen(false)}
                                >
                                  <BarChart3 className="w-4 h-4" />
                                  <span>Analytiques</span>
                                </Link>
                                <button
                                  onClick={() => {
                                    toggleSearch();
                                    setUserMenuOpen(false);
                                  }}
                                  className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors w-full text-left"
                                >
                                  <Search className="w-4 h-4" />
                                  <span>Recherche globale</span>
                                  <div className="ml-auto flex items-center space-x-1">
                                    <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                                      ⌘K
                                    </kbd>
                                  </div>
                                </button>
                              </>
                            )}
                          </div>

                          {/* Logout */}
                          <div className="border-t border-gray-800/50">
                            <button
                              onClick={handleSignOut}
                              className={`flex items-center space-x-3 px-4 py-3 text-sm transition-colors w-full text-left ${
                                isAdmin
                                  ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                  : "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              }`}
                            >
                              <LogOut className="w-4 h-4" />
                              <span>Déconnexion</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/assessment"
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Évaluation</span>
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg"
                  >
                    Connexion
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-gray-900/98 backdrop-blur-xl border-t border-gray-800/50"
            >
              <div className="px-4 py-4 space-y-2">
                {/* User info for mobile */}
                {isAuthenticated && (
                  <div
                    className={`flex items-center space-x-3 p-3 rounded-lg border mb-4 ${
                      isAdmin
                        ? "bg-gradient-to-r from-red-500/10 to-purple-500/10 border-red-500/20"
                        : "bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isAdmin
                          ? "bg-gradient-to-br from-red-500 to-purple-500"
                          : "bg-gradient-to-br from-purple-500 to-blue-500"
                      }`}
                    >
                      {isAdmin ? (
                        <Shield className="w-5 h-5 text-white" />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          isAdmin ? "text-red-200" : "text-gray-200"
                        }`}
                      >
                        {user?.email?.split("@")[0]}
                      </p>
                      <p
                        className={`text-sm ${
                          isAdmin ? "text-red-400" : "text-gray-400"
                        }`}
                      >
                        {isAdmin
                          ? "Administrateur"
                          : profile?.rank || "Utilisateur"}
                      </p>
                    </div>
                    {profile && !isAdmin && (
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-yellow-400">
                          <Zap className="w-3 h-3" />
                          <span className="text-sm font-medium">
                            {profile.totalXP}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 text-purple-400">
                          <Award className="w-3 h-3" />
                          <span className="text-sm font-medium">
                            Niv. {profile.level}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Links */}
                <Link
                  to="/"
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive("/")
                      ? "bg-purple-500/20 text-purple-400"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Accueil</span>
                </Link>

                {isAuthenticated ? (
                  <>
                    {isAdmin ? (
                      // Admin Mobile Menu
                      <>
                        <Link
                          to="/admin/dashboard"
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Settings className="w-5 h-5" />
                          <span>Dashboard Admin</span>
                        </Link>
                        <Link
                          to="/admin/goals"
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Target className="w-5 h-5" />
                          <span>Gérer Objectifs</span>
                        </Link>
                        <Link
                          to="/admin/users"
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Users className="w-5 h-5" />
                          <span>Gérer Utilisateurs</span>
                        </Link>
                        <Link
                          to="/admin/goals/new"
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Plus className="w-5 h-5" />
                          <span>Nouvel Objectif</span>
                        </Link>
                      </>
                    ) : (
                      // Regular User Mobile Menu
                      <>
                        <Link
                          to="/dashboard"
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive("/dashboard")
                              ? "bg-purple-500/20 text-purple-400"
                              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Tableau de bord</span>
                        </Link>

                        <Link
                          to="/goals"
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive("/goals")
                              ? "bg-purple-500/20 text-purple-400"
                              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Target className="w-5 h-5" />
                          <span>Objectifs</span>
                        </Link>

                        <Link
                          to="/assessment"
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive("/assessment")
                              ? "bg-purple-500/20 text-purple-400"
                              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Brain className="w-5 h-5" />
                          <span>Évaluation</span>
                        </Link>

                        <Link
                          to="/collaboration"
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive("/collaboration")
                              ? "bg-purple-500/20 text-purple-400"
                              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Users className="w-5 h-5" />
                          <span>Communauté</span>
                        </Link>

                        <Link
                          to="/achievements"
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive("/achievements")
                              ? "bg-purple-500/20 text-purple-400"
                              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Award className="w-5 h-5" />
                          <span>Achievements</span>
                        </Link>

                        <Link
                          to="/external-apis"
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive("/external-apis")
                              ? "bg-purple-500/20 text-purple-400"
                              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>APIs Externes</span>
                        </Link>

                        <Link
                          to="/analytics"
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            isActive("/analytics")
                              ? "bg-purple-500/20 text-purple-400"
                              : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <BarChart3 className="w-5 h-5" />
                          <span>Analytiques</span>
                        </Link>

                        <button
                          onClick={() => {
                            toggleSearch();
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors w-full text-left"
                        >
                          <Search className="w-4 h-4" />
                          <span>Recherche globale</span>
                          <div className="ml-auto flex items-center space-x-1">
                            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">
                              ⌘K
                            </kbd>
                          </div>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <Link
                      to="/assessment"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800/50 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Brain className="w-5 h-5" />
                      <span>Évaluation</span>
                    </Link>
                    <div className="border-t border-gray-800/50 pt-4">
                      <Link
                        to="/login"
                        className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>Connexion</span>
                      </Link>
                    </div>
                  </>
                )}

                {/* Logout */}
                {isAuthenticated && (
                  <div className="border-t border-gray-800/50 mt-2">
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Spacer pour compenser la navbar fixe */}
      <div className="h-16"></div>

      {/* Composant de recherche globale */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

export default Navbar;
