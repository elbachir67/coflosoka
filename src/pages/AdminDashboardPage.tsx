import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import {
  Home,
  LayoutDashboard,
  Target,
  Users,
  ExternalLink,
  Search,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Award,
  Zap,
  Shield,
  Settings,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
//import GlobalSearch from "./GlobalSearch";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, signOut, user } = useAuth();
  const { profile } = useGamification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Nouveau module disponible",
      message: "Le module 'Deep Learning Avancé' est maintenant accessible",
      time: "Il y a 2h",
      read: false,
    },
    {
      id: 2,
      title: "Quiz complété",
      message: "Félicitations ! Vous avez obtenu 85% au quiz ML",
      time: "Il y a 1 jour",
      read: true,
    },
  ]);

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Keyboard shortcut for search (non-admin only)
  useEffect(() => {
    if (isAdmin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isAdmin]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".notifications-menu")) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <span className="text-white font-bold text-lg">IA</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl opacity-20 group-hover:opacity-40 transition-opacity duration-200 -z-10"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  IA4Nieup
                </h1>
                <p className="text-xs text-gray-400 -mt-1">UCAD AI Center</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {isAdmin ? (
                /* ADMIN NAVIGATION - ÉPURÉE */
                <>
                  <Link
                    to="/admin/dashboard"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive("/admin/dashboard")
                        ? "bg-red-500/20 text-red-400 shadow-lg"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Administration</span>
                  </Link>
                  <Link
                    to="/admin/goals"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive("/admin/goals")
                        ? "bg-red-500/20 text-red-400 shadow-lg"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    <span>Objectifs</span>
                  </Link>
                  <Link
                    to="/admin/users"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive("/admin/users")
                        ? "bg-red-500/20 text-red-400 shadow-lg"
                        : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50"
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Utilisateurs</span>
                  </Link>
                </>
              ) : (
                /* USER NAVIGATION - COMPLÈTE */
                <>
                  <Link
                    to="/"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                      isActive("/") && location.pathname === "/"
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
                        <span>APIs Externes</span>
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Search Button - Only for non-admin users */}
            {!isAdmin && (
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
            )}

            {/* Right Side */}
            <div className="flex items-center space-x-3">
              {/* Search button for mobile - Only for non-admin */}
              {!isAdmin && (
                <button
                  onClick={toggleSearch}
                  className="md:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                >
                  <Search className="w-5 h-5 text-gray-400" />
                </button>
              )}

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
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-8 text-center text-gray-400">
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
                  <div className="relative">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={toggleMobileMenu}
                      className="flex items-center space-x-2 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                      <span className="hidden md:block text-gray-300 text-sm">
                        {user?.email?.split("@")[0]}
                      </span>
                    </motion.button>

                    <AnimatePresence>
                      {mobileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-800/50 overflow-hidden"
                        >
                          <div className="p-4 border-b border-gray-800/50">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
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
                              <div>
                                <p className="font-medium text-gray-200">
                                  {user?.email?.split("@")[0]}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {isAdmin ? "Administrateur" : "Apprenant"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-2">
                            {isAdmin ? (
                              /* MENU ADMIN MOBILE - ÉPURÉ */
                              <>
                                <Link
                                  to="/admin/dashboard"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                                >
                                  <Settings className="w-4 h-4" />
                                  <span>Dashboard Admin</span>
                                </Link>
                                <Link
                                  to="/admin/goals"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                                >
                                  <Target className="w-4 h-4" />
                                  <span>Gérer Objectifs</span>
                                </Link>
                                <Link
                                  to="/admin/users"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                                >
                                  <Users className="w-4 h-4" />
                                  <span>Gérer Utilisateurs</span>
                                </Link>
                                <Link
                                  to="/admin/goals/new"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                                >
                                  <Target className="w-4 h-4" />
                                  <span>Nouvel Objectif</span>
                                </Link>
                              </>
                            ) : (
                              /* MENU USER MOBILE - COMPLET */
                              <>
                                <Link
                                  to="/dashboard"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                                >
                                  <LayoutDashboard className="w-4 h-4" />
                                  <span>Tableau de bord</span>
                                </Link>
                                <Link
                                  to="/goals"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                                >
                                  <Target className="w-4 h-4" />
                                  <span>Objectifs</span>
                                </Link>
                                <Link
                                  to="/achievements"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                                >
                                  <Award className="w-4 h-4" />
                                  <span>Achievements</span>
                                </Link>
                                <Link
                                  to="/collaboration"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                                >
                                  <Users className="w-4 h-4" />
                                  <span>Communauté</span>
                                </Link>
                                <Link
                                  to="/analytics"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                                >
                                  <LayoutDashboard className="w-4 h-4" />
                                  <span>Analytiques</span>
                                </Link>
                                <Link
                                  to="/external-apis"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                  <span>APIs Externes</span>
                                </Link>
                              </>
                            )}

                            <div className="border-t border-gray-800/50 mt-2 pt-2">
                              <button
                                onClick={handleSignOut}
                                className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300 w-full"
                              >
                                <LogOut className="w-4 h-4" />
                                <span>Déconnexion</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                /* BOUTONS CONNEXION/INSCRIPTION */
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                  >
                    S'inscrire
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

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800/50"
            >
              <div className="px-4 py-4 space-y-2">
                {isAdmin ? (
                  /* MENU MOBILE ADMIN - ÉPURÉ */
                  <>
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                    >
                      <Settings className="w-5 h-5" />
                      <span>Dashboard Admin</span>
                    </Link>
                    <Link
                      to="/admin/goals"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                    >
                      <Target className="w-5 h-5" />
                      <span>Gérer Objectifs</span>
                    </Link>
                    <Link
                      to="/admin/users"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                    >
                      <Users className="w-5 h-5" />
                      <span>Gérer Utilisateurs</span>
                    </Link>
                  </>
                ) : (
                  /* MENU MOBILE USER - COMPLET */
                  <>
                    <Link
                      to="/"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                    >
                      <Home className="w-5 h-5" />
                      <span>Accueil</span>
                    </Link>
                    {isAuthenticated && (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                        >
                          <LayoutDashboard className="w-5 h-5" />
                          <span>Tableau de bord</span>
                        </Link>
                        <Link
                          to="/goals"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                        >
                          <Target className="w-5 h-5" />
                          <span>Objectifs</span>
                        </Link>
                        <Link
                          to="/collaboration"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                        >
                          <Users className="w-5 h-5" />
                          <span>Communauté</span>
                        </Link>
                        <Link
                          to="/external-apis"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white"
                        >
                          <ExternalLink className="w-5 h-5" />
                          <span>APIs Externes</span>
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Global Search - UNIQUEMENT pour les utilisateurs normaux */}
      {!isAdmin && (
        <GlobalSearch
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
