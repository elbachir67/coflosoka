import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  FileText,
  Share2,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import StudyGroup from "./StudyGroup";
import DiscussionForum from "./DiscussionForum";
import ResourceSharing from "./ResourceSharing";
import PeerReview from "./PeerReview";

const CollaborationHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "groups" | "forum" | "resources" | "review"
  >("groups");

  // Utiliser useEffect pour persister l'onglet actif dans le localStorage
  useEffect(() => {
    const savedTab = localStorage.getItem("collaborationActiveTab");
    if (savedTab) {
      setActiveTab(savedTab as "groups" | "forum" | "resources" | "review");
    }
  }, []);

  // Sauvegarder l'onglet actif quand il change
  const handleTabChange = (
    tab: "groups" | "forum" | "resources" | "review"
  ) => {
    setActiveTab(tab);
    localStorage.setItem("collaborationActiveTab", tab);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
        <Users className="w-6 h-6 text-purple-400 mr-2" />
        Espace Collaboratif
      </h2>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-800 mb-6 overflow-x-auto">
        <button
          onClick={() => handleTabChange("groups")}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "groups"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            Groupes d'étude
          </div>
        </button>
        <button
          onClick={() => handleTabChange("forum")}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "forum"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            Forum de discussion
          </div>
        </button>
        <button
          onClick={() => handleTabChange("resources")}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "resources"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center">
            <Share2 className="w-4 h-4 mr-1" />
            Partage de ressources
          </div>
        </button>
        <button
          onClick={() => handleTabChange("review")}
          className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
            activeTab === "review"
              ? "text-purple-400 border-b-2 border-purple-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <div className="flex items-center">
            <FileText className="w-4 h-4 mr-1" />
            Revue par les pairs
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === "groups" && <StudyGroup />}
        {activeTab === "forum" && <DiscussionForum />}
        {activeTab === "resources" && <ResourceSharing />}
        {activeTab === "review" && <PeerReview />}
      </div>

      {/* Conseils de collaboration */}
      <div className="glass-card rounded-xl p-6 mt-8">
        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
          Conseils pour une collaboration efficace
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-gray-800/50">
            <div className="flex items-center mb-2">
              <Users className="w-4 h-4 text-purple-400 mr-2" />
              <h4 className="font-medium text-gray-300">Groupes d'étude</h4>
            </div>
            <p className="text-sm text-gray-400">
              Planifiez des sessions régulières et définissez des objectifs
              clairs pour chaque réunion. Alternez les rôles d'animateur pour
              maximiser l'engagement.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-800/50">
            <div className="flex items-center mb-2">
              <MessageSquare className="w-4 h-4 text-blue-400 mr-2" />
              <h4 className="font-medium text-gray-300">Forum de discussion</h4>
            </div>
            <p className="text-sm text-gray-400">
              Posez des questions précises et fournissez du contexte. Répondez
              aux questions des autres pour renforcer vos connaissances.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-800/50">
            <div className="flex items-center mb-2">
              <Share2 className="w-4 h-4 text-green-400 mr-2" />
              <h4 className="font-medium text-gray-300">
                Partage de ressources
              </h4>
            </div>
            <p className="text-sm text-gray-400">
              Ajoutez une brève description expliquant pourquoi la ressource est
              utile. Classez correctement vos ressources pour faciliter la
              recherche.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gray-800/50">
            <div className="flex items-center mb-2">
              <FileText className="w-4 h-4 text-orange-400 mr-2" />
              <h4 className="font-medium text-gray-300">Revue par les pairs</h4>
            </div>
            <p className="text-sm text-gray-400">
              Donnez des retours constructifs et spécifiques. Soyez ouvert aux
              critiques et utilisez-les pour améliorer votre travail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationHub;
