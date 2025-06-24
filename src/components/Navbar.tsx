import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import {
  BookOpen,
  LogOut,
  User,
  Plus,
  LayoutDashboard,
  Menu,
  X,
  Brain,
  Code,
  Database,
  Bot,
  Settings,
  Users,
  Target,
  Award,
  Zap,
  Share2,
  ExternalLink,
  ChevronDown,
  Bell,
  Home,
} from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, signOut, user, isAuthenticated } = useAuth();
  const { profile } = useGamification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
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
    return location.pathname === path ? "active" : "";
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
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
  }, [location.pathname]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-purple-500 animate-float" />
              <span className="ml-2 text-xl font-bold gradient-text">
                IA4Nieup
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`nav-link ${isActive("/")}`}>
              <div className="flex items-center space-x-1">
                <Home className="w-4 h-4" />
                <span>Accueil</span>
              </div>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive("/dashboard")}`}
                >
                  <div className="flex items-center space-x-1">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Tableau de bord</span>
                  </div>
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-200 transition-colors duration-200">
                    <Target className="w-4 h-4" />
                    <span>Apprentissage</span>
                    <ChevronDown className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/goals"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <Target className="w-4 h-4 inline mr-2" />
                        Objectifs
                      </Link>
                      <Link
                        to="/assessment"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <Brain className="w-4 h-4 inline mr-2" />
                        Évaluation
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-gray-200 transition-colors duration-200">
                    <Share2 className="w-4 h-4" />
                    <span>Communauté</span>
                    <ChevronDown className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/collaboration"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <Users className="w-4 h-4 inline mr-2" />
                        Collaboration
                      </Link>
                      <Link
                        to="/achievements"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                      >
                        <Award className="w-4 h-4 inline mr-2" />
                        Achievements
                      </Link>
                    </div>
                  </div>
                </div>

                <Link
                  to="/external-apis"
                  className={`nav-link ${isActive("/external-apis")}`}
                >
                  <div className="flex items-center space-x-1">
                    <ExternalLink className="w-4 h-4" />
                    <span>APIs</span>
                  </div>
                </Link>
              </>
            ) : (
              <Link
                to="/assessment"
                className={`nav-link ${isActive("/assessment")}`}
              >
                Évaluation
              </Link>
            )}

            {/* Admin Menu */}
            {isAdmin && (
              <div className="relative group">
                <button className="flex items-center px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                  <ChevronDown className="w-3 h-3 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <LayoutDashboard className="w-4 h-4 inline mr-2" />
                      Tableau de bord
                    </Link>
                    <Link
                      to="/admin/goals"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Target className="w-4 h-4 inline mr-2" />
                      Gérer Objectifs
                    </Link>
                    <Link
                      to="/admin/users"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Users className="w-4 h-4 inline mr-2" />
                      Gérer Utilisateurs
                    </Link>
                    <Link
                      to="/admin/goals/new"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Nouvel Objectif
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative notifications-menu">
                  <button
                    onClick={toggleNotifications}
                    className="p-1.5 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors relative"
                  >
                    <Bell className="w-5 h-5 text-gray-300" />
                    {unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {unreadNotificationsCount}
                      </span>
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-lg z-50 overflow-hidden">
                      <div className="p-3 border-b border-gray-800 flex justify-between items-center">
                        <h3 className="font-medium text-gray-200">
                          Notifications
                        </h3>
                        <button className="text-xs text-blue-400 hover:text-blue-300">
                          Marquer tout comme lu
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                          notifications.map(notification => (
                            <div
                              key={notification.id}
                              className={`p-3 border-b border-gray-800 hover:bg-gray-800/50 ${
                                !notification.read ? "bg-gray-800/30" : ""
                              }`}
                            >
                              <div className="flex justify-between">
                                <p className="font-medium text-gray-200">
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-400">
                            Aucune notification
                          </div>
                        )}
                      </div>
                      <div className="p-2 border-t border-gray-800 text-center">
                        <button className="text-sm text-gray-400 hover:text-gray-300">
                          Voir toutes les notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* XP and Level */}
                {profile && (
                  <div className="flex items-center space-x-2 bg-gray-800/50 px-3 py-1 rounded-lg">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400 font-medium">
                        {profile.totalXP} XP
                      </span>
                    </div>
                    <div className="text-gray-400">|</div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-purple-400 mr-1" />
                      <span className="text-purple-400 font-medium">
                        Niv. {profile.level}
                      </span>
                    </div>
                  </div>
                )}

                {/* User Menu */}
                <div className="relative user-menu">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="hidden lg:block max-w-[120px] truncate">
                      {user?.email?.split("@")[0]}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        userMenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-lg z-50">
                      <div className="p-3 border-b border-gray-800">
                        <p className="font-medium text-gray-200">
                          {user?.email}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {profile?.rank || "Utilisateur"}
                        </p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          <LayoutDashboard className="w-4 h-4 inline mr-2" />
                          Tableau de bord
                        </Link>
                        <Link
                          to="/achievements"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white"
                        >
                          <Award className="w-4 h-4 inline mr-2" />
                          Achievements
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 hover:text-red-300"
                        >
                          <LogOut className="w-4 h-4 inline mr-2" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
              >
                Connexion
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Accueil
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Link>
                <Link
                  to="/goals"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Target className="w-4 h-4 inline mr-2" />
                  Objectifs
                </Link>
                <Link
                  to="/assessment"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Brain className="w-4 h-4 inline mr-2" />
                  Évaluation
                </Link>
                <Link
                  to="/achievements"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Award className="w-4 h-4 mr-2" />
                  Achievements
                </Link>
                <Link
                  to="/collaboration"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Collaboration
                </Link>
                <Link
                  to="/external-apis"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  APIs Externes
                </Link>

                {/* Admin mobile menu */}
                {isAdmin && (
                  <>
                    <div className="border-t border-gray-700 mt-2 pt-2">
                      <p className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                        Administration
                      </p>
                      <Link
                        to="/admin/dashboard"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 inline mr-2" />
                        Tableau de bord Admin
                      </Link>
                      <Link
                        to="/admin/goals"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Target className="w-4 h-4 inline mr-2" />
                        Gérer Objectifs
                      </Link>
                      <Link
                        to="/admin/users"
                        className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Users className="w-4 h-4 inline mr-2" />
                        Gérer Utilisateurs
                      </Link>
                    </div>
                  </>
                )}
              </>
            ) : (
              <Link
                to="/assessment"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Évaluation
              </Link>
            )}

            {isAuthenticated ? (
              <div className="pt-4 pb-3 border-t border-gray-700">
                {profile && (
                  <div className="flex items-center justify-between px-3 py-2 bg-gray-800/50 rounded-lg mb-3">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-yellow-400 font-medium">
                        {profile.totalXP} XP
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Award className="w-4 h-4 text-purple-400 mr-1" />
                      <span className="text-purple-400 font-medium">
                        Niv. {profile.level}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-300" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-300">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="block mt-4 px-3 py-2 rounded-md text-base font-medium bg-purple-600 text-white hover:bg-purple-700 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
