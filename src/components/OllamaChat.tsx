import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  Bot,
  User,
  Send,
  Loader2,
  AlertCircle,
  Settings,
  Code,
  HelpCircle,
  Lightbulb,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

const OllamaChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<OllamaModel[]>([]);
  const [selectedModel, setSelectedModel] = useState("mistral");
  const [showSettings, setShowSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(500);
  const [ollamaStatus, setOllamaStatus] = useState<string>("unknown");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkOllamaHealth();
    fetchModels();

    // Message de bienvenue
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Bonjour ! Je suis votre assistant IA local alimenté par Ollama. Je peux vous aider avec vos questions sur l'IA, générer du code, expliquer des concepts, et bien plus encore. Comment puis-je vous aider aujourd'hui ?",
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkOllamaHealth = async () => {
    try {
      const response = await fetch(`${api.API_URL}/api/ollama/health`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOllamaStatus(data.status);
      } else {
        setOllamaStatus("unavailable");
      }
    } catch (error) {
      console.error("Error checking Ollama health:", error);
      setOllamaStatus("unavailable");
    }
  };

  const fetchModels = async () => {
    try {
      const response = await fetch(`${api.API_URL}/api/ollama/models`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModels(data);

        // Sélectionner le premier modèle disponible si aucun n'est sélectionné
        if (data.length > 0 && !selectedModel) {
          setSelectedModel(data[0].name);
        }
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Erreur lors de la récupération des modèles");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${api.API_URL}/api/ollama/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content,
          })),
          model: selectedModel,
          temperature,
          maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la communication avec Ollama");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.message,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erreur lors de l'envoi du message");

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Désolé, je n'ai pas pu traiter votre demande. Veuillez vérifier que Ollama est en cours d'exécution.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    let prompt = "";

    switch (action) {
      case "explain-ml":
        prompt =
          "Peux-tu m'expliquer les concepts fondamentaux du machine learning de manière simple ?";
        break;
      case "generate-code":
        prompt =
          "Génère un exemple de code Python pour un classificateur simple avec scikit-learn";
        break;
      case "quiz-help":
        prompt =
          "Aide-moi à comprendre la différence entre overfitting et underfitting";
        break;
      case "career-advice":
        prompt = "Quels sont les débouchés professionnels en IA en Afrique ?";
        break;
      default:
        return;
    }

    setInput(prompt);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat réinitialisé. Comment puis-je vous aider ?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gray-800/50 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-100">
                Assistant IA Local
              </h3>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    ollamaStatus === "healthy" ? "bg-green-400" : "bg-red-400"
                  }`}
                />
                <span className="text-sm text-gray-400">
                  {selectedModel} •{" "}
                  {ollamaStatus === "healthy" ? "En ligne" : "Hors ligne"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-300" />
            </button>
            <button
              onClick={clearChat}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 p-4 bg-gray-900/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Modèle
                </label>
                <select
                  value={selectedModel}
                  onChange={e => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {models.map(model => (
                    <option key={model.name} value={model.name}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Température ({temperature})
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tokens max
                </label>
                <input
                  type="number"
                  min="100"
                  max="2000"
                  value={maxTokens}
                  onChange={e => setMaxTokens(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gray-800/30 border-b border-gray-700">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleQuickAction("explain-ml")}
            className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors text-sm flex items-center"
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            Expliquer ML
          </button>
          <button
            onClick={() => handleQuickAction("generate-code")}
            className="px-3 py-1 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors text-sm flex items-center"
          >
            <Code className="w-3 h-3 mr-1" />
            Générer code
          </button>
          <button
            onClick={() => handleQuickAction("quiz-help")}
            className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors text-sm flex items-center"
          >
            <HelpCircle className="w-3 h-3 mr-1" />
            Aide quiz
          </button>
          <button
            onClick={() => handleQuickAction("career-advice")}
            className="px-3 py-1 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-colors text-sm flex items-center"
          >
            <User className="w-3 h-3 mr-1" />
            Conseils carrière
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {ollamaStatus !== "healthy" && (
          <div className="p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-300 font-medium">Ollama non disponible</p>
              <p className="text-red-400 text-sm">
                Assurez-vous qu'Ollama est en cours d'exécution sur le port
                11434.
              </p>
              <div className="text-red-400 text-xs mt-2 space-y-1">
                <p>
                  1. Démarrez Ollama :{" "}
                  <code className="bg-gray-800 px-1 rounded">ollama serve</code>
                </p>
                <p>
                  2. Vérifiez les modèles :{" "}
                  <code className="bg-gray-800 px-1 rounded">ollama list</code>
                </p>
                <p>
                  3. Si besoin, installez :{" "}
                  <code className="bg-gray-800 px-1 rounded">
                    ollama pull mistral
                  </code>
                </p>
              </div>
            </div>
          </div>
        )}

        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[80%] ${
                message.role === "user"
                  ? "flex-row-reverse items-end"
                  : "items-start"
              }`}
            >
              <div
                className={`flex-shrink-0 ${
                  message.role === "user" ? "ml-3" : "mr-3"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-blue-500/20"
                      : "bg-purple-500/20"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Bot className="w-4 h-4 text-purple-400" />
                  )}
                </div>
              </div>

              <div
                className={`rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div
                  className={`text-xs mt-2 ${
                    message.role === "user" ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">L'assistant réfléchit...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-gray-800/50 border-t border-gray-700"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Posez votre question..."
            disabled={loading || ollamaStatus !== "healthy"}
            className="flex-1 bg-gray-900 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || ollamaStatus !== "healthy"}
            className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default OllamaChat;
