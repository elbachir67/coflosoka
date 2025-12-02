import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Globe, AlertCircle, RefreshCw } from "lucide-react";

interface TutorChatProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  language: "fr" | "en";
  onToggleLanguage: () => void;
  error?: string | null;
}

function TutorChat({
  onSendMessage,
  isLoading,
  language,
  onToggleLanguage,
  error,
}: TutorChatProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        120
      )}px`;
    }
  }, [inputValue]);

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
      {/* Barre d'erreur */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2 mb-3"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-300">{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              language === "fr"
                ? "Posez votre question sur l'IA..."
                : "Ask your question about AI..."
            }
            disabled={isLoading}
            rows={1}
            className="w-full bg-gray-900/50 border border-gray-600/50 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {/* Bouton de langue */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleLanguage}
          className="p-3 rounded-xl bg-gray-700/50 hover:bg-gray-700 border border-gray-600/50 transition-all duration-200 group"
          title={language === "fr" ? "Switch to English" : "Passer en français"}
        >
          <Globe className="w-5 h-5 text-gray-400 group-hover:text-white" />
          <span className="sr-only">
            {language === "fr" ? "EN" : "FR"}
          </span>
        </motion.button>

        {/* Bouton d'envoi */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!inputValue.trim() || isLoading}
          className={`p-3 rounded-xl transition-all duration-200 ${
            inputValue.trim() && !isLoading
              ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25"
              : "bg-gray-700/50 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
          ) : (
            <Send
              className={`w-5 h-5 ${
                inputValue.trim() ? "text-white" : "text-gray-500"
              }`}
            />
          )}
        </motion.button>
      </form>

      {/* Indicateur de langue */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700/50">
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">Langue:</span>
          <button
            onClick={onToggleLanguage}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              language === "fr"
                ? "bg-purple-500/20 text-purple-400"
                : "bg-gray-700/50 text-gray-400 hover:text-gray-300"
            }`}
          >
            FR
          </button>
          <button
            onClick={onToggleLanguage}
            className={`px-2 py-1 rounded text-xs font-medium transition-all ${
              language === "en"
                ? "bg-blue-500/20 text-blue-400"
                : "bg-gray-700/50 text-gray-400 hover:text-gray-300"
            }`}
          >
            EN
          </button>
        </div>
        <p className="text-xs text-gray-500">
          {language === "fr"
            ? "Les réponses en anglais sont plus précises"
            : "Responses in English are more accurate"}
        </p>
      </div>
    </div>
  );
}

export default TutorChat;
