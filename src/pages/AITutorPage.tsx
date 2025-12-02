import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Zap,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import {
  CategorySelector,
  SuggestedQuestions,
  TutorResponse,
  TutorChat,
} from "../components/AITutor";
import { api } from "../config/api";

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

interface Message {
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TutorStatus {
  ollamaAvailable: boolean;
  tinyLlamaReady: boolean;
  availableModels: string[];
}

function AITutorPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("ml");
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<TutorStatus | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Charger les catégories au démarrage
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${api.tutor}/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        // Catégories par défaut si l'API échoue
        setCategories([
          { id: "ml", name: "Machine Learning", icon: "Brain", description: "Apprentissage automatique", color: "purple" },
          { id: "dl", name: "Deep Learning", icon: "Network", description: "Réseaux profonds", color: "blue" },
          { id: "nlp", name: "NLP", icon: "MessageSquare", description: "Traitement du langage", color: "green" },
          { id: "cv", name: "Computer Vision", icon: "Eye", description: "Vision par ordinateur", color: "orange" },
          { id: "math", name: "Maths pour l'IA", icon: "Calculator", description: "Fondements mathématiques", color: "red" },
          { id: "python", name: "Python", icon: "Code", description: "Programmation Python", color: "yellow" },
        ]);
      }
    };

    const checkStatus = async () => {
      try {
        const response = await fetch(`${api.tutor}/status`);
        const data = await response.json();
        if (data.success) {
          setStatus(data.status);
        }
      } catch (err) {
        console.error("Error checking status:", err);
      }
    };

    fetchCategories();
    checkStatus();
  }, []);

  // Charger les questions suggérées quand la catégorie change
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(
          `${api.tutor}/questions/${selectedCategory}`
        );
        const data = await response.json();
        if (data.success) {
          setSuggestedQuestions(data.questions);
        }
      } catch (err) {
        console.error("Error fetching questions:", err);
        // Questions par défaut
        setSuggestedQuestions([
          "C'est quoi le Machine Learning ?",
          "Comment ça fonctionne ?",
          "À quoi ça sert ?",
        ]);
      }
    };

    fetchQuestions();
  }, [selectedCategory]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (question: string) => {
    if (!user) return;

    // Ajouter le message utilisateur
    const userMessage: Message = {
      type: "user",
      content: question,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${api.tutor}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          question,
          category: selectedCategory,
          language,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          type: "assistant",
          content: data.data.answer,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setError(data.message || "Une erreur est survenue");
      }
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Impossible de communiquer avec le tuteur. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === "fr" ? "en" : "fr"));
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Réinitialiser la conversation lors du changement de catégorie
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl mb-4">
            <GraduationCap className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            AI Basics Tutor
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Apprenez les concepts de l'IA simplement avec des explications
            claires et des analogies du quotidien
          </p>

          {/* Status indicator */}
          <div className="flex items-center justify-center space-x-4 mt-4">
            {status && (
              <div
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs ${
                  status.ollamaAvailable
                    ? "bg-green-500/10 text-green-400"
                    : "bg-red-500/10 text-red-400"
                }`}
              >
                {status.ollamaAvailable ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <AlertTriangle className="w-3 h-3" />
                )}
                <span>
                  {status.ollamaAvailable ? "Tuteur disponible" : "Tuteur indisponible"}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs">
              <Zap className="w-3 h-3" />
              <span>Propulsé par TinyLlama</span>
            </div>
          </div>
        </motion.div>

        {/* Catégories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="text-sm font-medium text-gray-400 mb-3 flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Choisissez une catégorie</span>
          </h2>
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
          />
        </motion.div>

        {/* Zone principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Questions suggérées (sidebar gauche) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <SuggestedQuestions
              questions={suggestedQuestions}
              onSelectQuestion={handleSelectQuestion}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Zone de chat principale */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 flex flex-col bg-gray-900/50 rounded-2xl border border-gray-800/50 overflow-hidden"
            style={{ height: "600px" }}
          >
            {/* Zone des messages */}
            <div className="flex-1 overflow-y-auto p-4">
              <TutorResponse messages={messages} isLoading={isLoading} />
              <div ref={messagesEndRef} />
            </div>

            {/* Zone de saisie */}
            <div className="p-4 border-t border-gray-800/50">
              <TutorChat
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                language={language}
                onToggleLanguage={handleToggleLanguage}
                error={error}
              />
            </div>
          </motion.div>
        </div>

        {/* Note informative */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            Ce tuteur utilise TinyLlama pour générer des réponses. Les
            explications sont simplifiées pour les débutants.
            <br />
            Pour des informations plus techniques, consultez les ressources de
            la plateforme.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default AITutorPage;
