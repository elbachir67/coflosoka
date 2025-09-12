import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Users, Lightbulb, Award } from "lucide-react";
import CollaborationHub from "../components/CollaborationHub";

function CollaborationPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Collaboration</h1>
          <p className="text-gray-400 mt-2">
            Apprenez ensemble, partagez des ressources et progressez en équipe
          </p>
        </div>

        {/* Bannière des avantages */}
        <div className="glass-card rounded-xl p-6 mb-8 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-2">
                Pourquoi collaborer ?
              </h2>
              <p className="text-gray-300">
                L'apprentissage collaboratif améliore la rétention des
                connaissances de 70% et accélère votre progression.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-gray-200 font-medium">Entraide</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                <Lightbulb className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-gray-200 font-medium">Nouvelles idées</p>
              </div>
              <div className="p-4 rounded-lg bg-gray-800/50 text-center">
                <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-gray-200 font-medium">XP bonus</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <CollaborationHub />
      </div>
    </div>
  );
}

export default CollaborationPage;
