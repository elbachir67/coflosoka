import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Send,
  Sun,
  Moon,
  Globe,
  Bot,
  User,
  BookOpen,
  Target,
  Lightbulb,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";

interface Message {
  type: "user" | "assistant";
  content: string;
}

const categories = [
  { id: "ml", name: "Machine Learning" },
  { id: "dl", name: "Deep Learning" },
  { id: "nlp", name: "NLP" },
  { id: "cv", name: "Computer Vision" },
  { id: "math", name: "Maths" },
  { id: "python", name: "Python" },
];

const defaultQuestions: Record<string, string[]> = {
  ml: ["C'est quoi le Machine Learning ?", "Supervisé vs non supervisé ?", "C'est quoi l'overfitting ?"],
  dl: ["C'est quoi un réseau de neurones ?", "Comment marche le backpropagation ?", "C'est quoi un CNN ?"],
  nlp: ["C'est quoi le NLP ?", "Comment marche un tokenizer ?", "C'est quoi un Transformer ?"],
  cv: ["C'est quoi la Computer Vision ?", "Comment marche une convolution ?", "C'est quoi le pooling ?"],
  math: ["C'est quoi un gradient ?", "Comment marche la descente de gradient ?", "C'est quoi une matrice ?"],
  python: ["C'est quoi NumPy ?", "Comment utiliser Pandas ?", "C'est quoi TensorFlow ?"],
};

function AITutorPage() {
  const { user } = useAuth();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [category, setCategory] = useState("ml");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === "dark";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const parseResponse = (content: string) => {
    const sections = { definition: "", analogy: "", takeaway: "" };
    const defMatch = content.match(/📖\s*(?:Définition|Definition)\s*:\s*([^🎯💡]*)/i);
    const anaMatch = content.match(/🎯\s*(?:Analogie|Analogy)\s*:\s*([^📖💡]*)/i);
    const keyMatch = content.match(/💡\s*(?:À retenir|Key takeaway)\s*:\s*([^📖🎯]*)/i);
    if (defMatch) sections.definition = defMatch[1].trim();
    if (anaMatch) sections.analogy = anaMatch[1].trim();
    if (keyMatch) sections.takeaway = keyMatch[1].trim();
    return sections;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !user || isLoading) return;

    setMessages((prev) => [...prev, { type: "user", content: text }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${api.tutor}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ question: text, category, language }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages((prev) => [...prev, { type: "assistant", content: data.data.answer }]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  // Thème styles
  const bg = isDark ? "bg-gray-950" : "bg-gray-50";
  const cardBg = isDark ? "bg-gray-900" : "bg-white";
  const border = isDark ? "border-gray-800" : "border-gray-200";
  const text = isDark ? "text-gray-100" : "text-gray-900";
  const textMuted = isDark ? "text-gray-400" : "text-gray-500";
  const inputBg = isDark ? "bg-gray-800" : "bg-gray-100";

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* Header compact */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-xl ${isDark ? "bg-blue-500/10" : "bg-blue-50"}`}>
              <Bot className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
            </div>
            <div>
              <h1 className={`text-xl font-semibold ${text}`}>AI Tutor</h1>
              <p className={`text-xs ${textMuted}`}>Apprenez simplement</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${inputBg} ${textMuted} hover:opacity-80 transition`}
            >
              {language.toUpperCase()}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className={`p-2 rounded-lg ${inputBg} ${textMuted} hover:opacity-80 transition`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Category selector - compact */}
        <div className="relative mb-4">
          <button
            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${cardBg} border ${border} ${text} text-sm`}
          >
            <span>{categories.find((c) => c.id === category)?.name}</span>
            <ChevronDown className={`w-4 h-4 ${textMuted}`} />
          </button>

          {showCategoryMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`absolute top-full left-0 mt-2 ${cardBg} border ${border} rounded-xl shadow-lg z-10 overflow-hidden`}
            >
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCategory(c.id);
                    setShowCategoryMenu(false);
                    clearChat();
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${text} hover:${isDark ? "bg-gray-800" : "bg-gray-100"} transition`}
                >
                  {c.name}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Chat container */}
        <div className={`${cardBg} border ${border} rounded-2xl overflow-hidden`} style={{ height: "500px" }}>

          {/* Messages */}
          <div className="h-[380px] overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center">
                <Bot className={`w-12 h-12 ${textMuted} opacity-30 mb-4`} />
                <p className={`${textMuted} text-sm mb-6`}>Posez une question ou choisissez ci-dessous</p>

                {/* Quick questions */}
                <div className="flex flex-wrap justify-center gap-2 max-w-md">
                  {defaultQuestions[category]?.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className={`px-3 py-1.5 rounded-full text-xs ${inputBg} ${textMuted} hover:opacity-80 transition`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.type === "user" ? (
                      <div className={`max-w-[80%] px-4 py-2 rounded-2xl rounded-tr-sm ${isDark ? "bg-blue-600" : "bg-blue-500"} text-white text-sm`}>
                        {msg.content}
                      </div>
                    ) : (
                      <div className={`max-w-[85%] ${inputBg} rounded-2xl rounded-tl-sm p-4`}>
                        {(() => {
                          const p = parseResponse(msg.content);
                          const hasStructure = p.definition || p.analogy || p.takeaway;

                          if (hasStructure) {
                            return (
                              <div className="space-y-3">
                                {p.definition && (
                                  <div className="flex items-start space-x-2">
                                    <BookOpen className={`w-4 h-4 mt-0.5 ${isDark ? "text-blue-400" : "text-blue-600"}`} />
                                    <p className={`text-sm ${text}`}>{p.definition}</p>
                                  </div>
                                )}
                                {p.analogy && (
                                  <div className="flex items-start space-x-2">
                                    <Target className={`w-4 h-4 mt-0.5 ${isDark ? "text-orange-400" : "text-orange-600"}`} />
                                    <p className={`text-sm ${text}`}>{p.analogy}</p>
                                  </div>
                                )}
                                {p.takeaway && (
                                  <div className="flex items-start space-x-2">
                                    <Lightbulb className={`w-4 h-4 mt-0.5 ${isDark ? "text-yellow-400" : "text-yellow-600"}`} />
                                    <p className={`text-sm ${text} font-medium`}>{p.takeaway}</p>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return <p className={`text-sm ${text}`}>{msg.content}</p>;
                        })()}
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`${inputBg} rounded-2xl rounded-tl-sm px-4 py-3`}>
                      <div className="flex space-x-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                            className={`w-2 h-2 rounded-full ${isDark ? "bg-blue-400" : "bg-blue-500"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className={`p-4 border-t ${border}`}>
            <form onSubmit={handleSubmit} className="flex items-end space-x-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={language === "fr" ? "Posez votre question..." : "Ask your question..."}
                rows={1}
                className={`flex-1 px-4 py-3 rounded-xl ${inputBg} ${text} placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-3 rounded-xl transition ${
                  input.trim() && !isLoading
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : `${inputBg} ${textMuted} cursor-not-allowed`
                }`}
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>

            <p className={`text-xs ${textMuted} mt-2 text-center`}>
              {language === "fr" ? "Réponses en anglais plus précises" : "English responses are more accurate"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AITutorPage;
