import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  Users,
  Plus,
  Loader2,
  AlertCircle,
  User,
  MessageSquare,
  Send,
  X,
  Upload,
  Download,
  CheckCircle,
  Clock,
  Filter,
  Search,
  Calendar,
  UserPlus,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useGamification } from "../contexts/GamificationContext";

interface StudyGroup {
  _id: string;
  name: string;
  description: string;
  topic: string;
  createdBy: {
    _id: string;
    email: string;
  };
  members: {
    _id: string;
    email: string;
  }[];
  messages: {
    _id: string;
    sender: {
      _id: string;
      email: string;
    };
    content: string;
    createdAt: string;
  }[];
  meetingSchedule?: {
    date: string;
    duration: number;
    topic: string;
  };
  createdAt: string;
}

const StudyGroup: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    topic: "",
  });
  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    duration: 60,
    topic: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStudyGroups();
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedGroup?.messages]);

  const fetchStudyGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${api.API_URL}/api/study-groups`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des groupes d'étude");
      }

      const data = await response.json();
      setGroups(data);

      // Si un groupe était sélectionné, mettre à jour ses données
      if (selectedGroup) {
        const updatedGroup = data.find(
          (g: { _id: string }) => g._id === selectedGroup._id
        );
        if (updatedGroup) {
          setSelectedGroup(updatedGroup);
        }
      }
    } catch (error) {
      console.error("Error fetching study groups:", error);
      toast.error("Erreur lors du chargement des groupes d'étude");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${api.API_URL}/api/study-groups`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du groupe");
      }

      const newGroup = await response.json();
      setGroups([...groups, newGroup]);
      setShowCreateModal(false);
      setFormData({ name: "", description: "", topic: "" });
      toast.success("Groupe d'étude créé avec succès");

      // Récompenser l'utilisateur pour avoir créé un groupe
      await rewardAction("create_study_group");
    } catch (error) {
      console.error("Error creating study group:", error);
      toast.error("Erreur lors de la création du groupe");
    }
  };

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/study-groups/${selectedGroup._id}/invite`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: inviteEmail }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'invitation");
      }

      const updatedGroup = await response.json();
      setGroups(
        groups.map(g => (g._id === updatedGroup._id ? updatedGroup : g))
      );
      setSelectedGroup(updatedGroup);
      setShowInviteModal(false);
      setInviteEmail("");
      toast.success("Invitation envoyée avec succès");

      // Récompenser l'utilisateur pour avoir invité un membre
      await rewardAction("invite_member");
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Erreur lors de l'invitation");
    }
  };

  const handleScheduleMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup) return;

    try {
      const dateTime = new Date(`${scheduleData.date}T${scheduleData.time}`);

      const response = await fetch(
        `${api.API_URL}/api/study-groups/${selectedGroup._id}/schedule`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            date: dateTime.toISOString(),
            duration: scheduleData.duration,
            topic: scheduleData.topic,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la planification");
      }

      const updatedGroup = await response.json();
      setGroups(
        groups.map(g => (g._id === updatedGroup._id ? updatedGroup : g))
      );
      setSelectedGroup(updatedGroup);
      setShowScheduleModal(false);
      setScheduleData({
        date: "",
        time: "",
        duration: 60,
        topic: "",
      });
      toast.success("Réunion planifiée avec succès");

      // Récompenser l'utilisateur pour avoir planifié une réunion
      await rewardAction("schedule_meeting");
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast.error("Erreur lors de la planification");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroup || !newMessage.trim()) return;

    try {
      const response = await fetch(
        `${api.API_URL}/api/study-groups/${selectedGroup._id}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: newMessage }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      const updatedGroup = await response.json();
      setGroups(
        groups.map(g => (g._id === updatedGroup._id ? updatedGroup : g))
      );
      setSelectedGroup(updatedGroup);
      setNewMessage("");

      // Récompenser l'utilisateur pour sa participation
      await rewardAction("send_message");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
        <span className="text-gray-400">Chargement des groupes d'étude...</span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-100 flex items-center">
          <Users className="w-5 h-5 text-purple-400 mr-2" />
          Groupes d'étude
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-1" />
          Créer un groupe
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            Vous n'avez pas encore rejoint de groupe d'étude.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Créer votre premier groupe
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {groups.map(group => (
            <div
              key={group._id}
              className={`p-4 rounded-lg ${
                selectedGroup?._id === group._id
                  ? "bg-purple-500/20 border border-purple-500/30"
                  : "bg-gray-800/50 hover:bg-gray-800/70"
              } cursor-pointer transition-colors`}
              onClick={() => setSelectedGroup(group)}
            >
              <h3 className="text-lg font-semibold text-gray-200 mb-1">
                {group.name}
              </h3>
              <p className="text-sm text-gray-400 mb-2">{group.description}</p>
              <div className="flex justify-between text-xs text-gray-400">
                <span>{group.topic}</span>
                <span>{group.members.length} membres</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGroup && (
        <div className="mt-6 border-t border-gray-800 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-200">
              {selectedGroup.name}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
              >
                <Calendar className="w-4 h-4 mr-1" />
                Planifier
              </button>
              <button
                onClick={() => setShowInviteModal(true)}
                className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Inviter
              </button>
            </div>
          </div>

          {/* Réunion planifiée */}
          {selectedGroup.meetingSchedule && (
            <div className="mb-4 p-3 rounded-lg bg-blue-500/20 border border-blue-500/30">
              <div className="flex items-center text-blue-400 mb-1">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="font-medium">Prochaine réunion</span>
              </div>
              <p className="text-gray-300">
                {formatDate(selectedGroup.meetingSchedule.date)}
              </p>
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{selectedGroup.meetingSchedule.topic}</span>
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {selectedGroup.meetingSchedule.duration} min
                </span>
              </div>
            </div>
          )}

          {/* Membres */}
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-300 mb-2">Membres</h4>
            <div className="flex flex-wrap gap-2">
              {selectedGroup.members.map(member => (
                <div
                  key={member._id}
                  className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm flex items-center"
                >
                  <Users className="w-3 h-3 mr-1" />
                  {member.email.split("@")[0]}
                  {member._id === selectedGroup.createdBy._id && (
                    <span className="ml-1 text-xs text-purple-400">
                      (Admin)
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="mb-4">
            <h4 className="text-md font-medium text-gray-300 mb-2 flex items-center">
              <MessageSquare className="w-4 h-4 mr-1" />
              Discussion
            </h4>
            <div className="bg-gray-800/50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
              {selectedGroup.messages.length === 0 ? (
                <p className="text-center text-gray-400">
                  Aucun message. Soyez le premier à écrire !
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedGroup.messages.map(message => {
                    const isCurrentUser = message.sender._id === user?.id;
                    return (
                      <div
                        key={message._id}
                        className={`flex ${
                          isCurrentUser ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex max-w-[80%] ${
                            isCurrentUser
                              ? "flex-row-reverse items-end"
                              : "items-start"
                          }`}
                        >
                          <div
                            className={`p-3 rounded-lg ${
                              isCurrentUser
                                ? "bg-purple-600 text-white"
                                : "bg-gray-700 text-gray-200"
                            }`}
                          >
                            <div className="flex items-center mb-1">
                              <span
                                className={`text-xs font-medium ${
                                  isCurrentUser
                                    ? "text-purple-200"
                                    : "text-gray-400"
                                }`}
                              >
                                {message.sender.email.split("@")[0]}
                              </span>
                            </div>
                            <p>{message.content}</p>
                            <div
                              className={`text-right text-xs ${
                                isCurrentUser
                                  ? "text-purple-200"
                                  : "text-gray-400"
                              }`}
                            >
                              {new Date(message.createdAt).toLocaleTimeString(
                                "fr-FR",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..."
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-4 h-4 mr-1" />
                Envoyer
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal de création de groupe */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Créer un groupe d'étude
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Nom du groupe
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Sujet
                </label>
                <select
                  id="topic"
                  value={formData.topic}
                  onChange={e =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Sélectionnez un sujet</option>
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Deep Learning">Deep Learning</option>
                  <option value="Computer Vision">Computer Vision</option>
                  <option value="NLP">NLP</option>
                  <option value="MLOps">MLOps</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={e =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Créer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'invitation */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Inviter un membre
              </h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleInviteMember} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="email@exemple.com"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Inviter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de planification */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-100">
                Planifier une réunion
              </h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleScheduleMeeting} className="space-y-4">
              <div>
                <label
                  htmlFor="topic"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Sujet de la réunion
                </label>
                <input
                  type="text"
                  id="topic"
                  value={scheduleData.topic}
                  onChange={e =>
                    setScheduleData({ ...scheduleData, topic: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    value={scheduleData.date}
                    onChange={e =>
                      setScheduleData({ ...scheduleData, date: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="time"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Heure
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={scheduleData.time}
                    onChange={e =>
                      setScheduleData({ ...scheduleData, time: e.target.value })
                    }
                    required
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={scheduleData.duration}
                  onChange={e =>
                    setScheduleData({
                      ...scheduleData,
                      duration: parseInt(e.target.value),
                    })
                  }
                  min="15"
                  max="180"
                  required
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Planifier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyGroup;
