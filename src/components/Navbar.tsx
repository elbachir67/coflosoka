import React, { useState } from "react";
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
} from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, signOut, user, isAuthenticated } = useAuth();
  const { profile } = useGamification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm">
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
              Accueil
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
                <Link to="/goals" className={`nav-link ${isActive("/goals")}`}>
                  Objectifs
                </Link>
                <Link
                  to="/achievements"
                  className={`nav-link ${isActive("/achievements")}`}
                >
                  <div className="flex items-center space-x-1">
                    <Award className="w-4 h-4" />
                    <span>Achievements</span>
                  </div>
                </Link>
                <Link
                  to="/collaboration"
                  className={`nav-link ${isActive("/collaboration")}`}
                >
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Collaboration</span>
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
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
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
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
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
                  Objectifs
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
