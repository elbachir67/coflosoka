import React, { useState, useEffect } from "react";
import { Trophy, Medal, Award, User, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { toast } from "react-hot-toast";

interface LeaderboardEntry {
  userId: {
    _id: string;
    email: string;
  };
  level: number;
  totalXP: number;
  rank: string;
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${api.API_URL}/api/gamification/leaderboard`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du chargement du classement");
      }

      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Erreur lors du chargement du classement");
    } finally {
      setLoading(false);
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-300" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return (
          <span className="text-gray-400 font-medium">{position + 1}</span>
        );
    }
  };

  if (loading) {
    return (
      <div className="glass-card rounded-xl p-6 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin mr-2" />
        <span className="text-gray-400">Chargement du classement...</span>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
        <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
        Classement
      </h2>

      <div className="space-y-4">
        {leaderboard.map((entry, index) => {
          const isCurrentUser = entry.userId._id === user?.id;

          return (
            <div
              key={entry.userId._id}
              className={`flex items-center p-3 rounded-lg ${
                isCurrentUser
                  ? "bg-purple-500/20 border border-purple-500/30"
                  : "bg-gray-800/50"
              }`}
            >
              <div className="w-8 flex justify-center mr-3">
                {getPositionIcon(index)}
              </div>

              <div className="flex-1">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${
                        isCurrentUser ? "text-purple-300" : "text-gray-200"
                      }`}
                    >
                      {entry.userId.email.split("@")[0]}
                      {isCurrentUser && " (Vous)"}
                    </p>
                    <p className="text-xs text-gray-400">{entry.rank}</p>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-gray-200">Niv. {entry.level}</p>
                <p className="text-xs text-gray-400">{entry.totalXP} XP</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
