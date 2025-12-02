import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Target, Lightbulb, User, Bot } from "lucide-react";

interface Message {
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface TutorResponseProps {
  messages: Message[];
  isLoading: boolean;
}

function TutorResponse({ messages, isLoading }: TutorResponseProps) {
  // Parser la réponse structurée du tuteur
  const parseResponse = (content: string) => {
    const sections = {
      definition: "",
      analogy: "",
      takeaway: "",
      raw: content,
    };

    // Essayer de parser le format structuré
    const definitionMatch = content.match(/📖\s*(?:Définition|Definition)\s*:\s*([^🎯💡]*)/i);
    const analogyMatch = content.match(/🎯\s*(?:Analogie|Analogy)\s*:\s*([^📖💡]*)/i);
    const takeawayMatch = content.match(/💡\s*(?:À retenir|Key takeaway)\s*:\s*([^📖🎯]*)/i);

    if (definitionMatch) sections.definition = definitionMatch[1].trim();
    if (analogyMatch) sections.analogy = analogyMatch[1].trim();
    if (takeawayMatch) sections.takeaway = takeawayMatch[1].trim();

    return sections;
  };

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <Bot className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Posez une question pour commencer</p>
          <p className="text-sm mt-2">
            Sélectionnez une catégorie et posez votre question
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-2">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex ${
            message.type === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.type === "user" ? (
            // Message utilisateur
            <div className="flex items-start space-x-3 max-w-[80%]">
              <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl rounded-tr-sm px-4 py-3">
                <p className="text-white text-sm">{message.content}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            // Réponse du tuteur
            <div className="flex items-start space-x-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800/80 rounded-2xl rounded-tl-sm p-4 border border-gray-700/50">
                {(() => {
                  const parsed = parseResponse(message.content);
                  const hasStructure = parsed.definition || parsed.analogy || parsed.takeaway;

                  if (hasStructure) {
                    return (
                      <div className="space-y-4">
                        {parsed.definition && (
                          <div className="flex items-start space-x-3">
                            <div className="p-1.5 rounded-lg bg-blue-500/20 flex-shrink-0">
                              <BookOpen className="w-4 h-4 text-blue-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-blue-400 mb-1">
                                Définition
                              </p>
                              <p className="text-sm text-gray-300">
                                {parsed.definition}
                              </p>
                            </div>
                          </div>
                        )}
                        {parsed.analogy && (
                          <div className="flex items-start space-x-3">
                            <div className="p-1.5 rounded-lg bg-orange-500/20 flex-shrink-0">
                              <Target className="w-4 h-4 text-orange-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-orange-400 mb-1">
                                Analogie
                              </p>
                              <p className="text-sm text-gray-300">
                                {parsed.analogy}
                              </p>
                            </div>
                          </div>
                        )}
                        {parsed.takeaway && (
                          <div className="flex items-start space-x-3">
                            <div className="p-1.5 rounded-lg bg-yellow-500/20 flex-shrink-0">
                              <Lightbulb className="w-4 h-4 text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-yellow-400 mb-1">
                                À retenir
                              </p>
                              <p className="text-sm text-gray-300">
                                {parsed.takeaway}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }

                  // Affichage brut si pas de structure détectée
                  return (
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">
                      {message.content}
                    </p>
                  );
                })()}
              </div>
            </div>
          )}
        </motion.div>
      ))}

      {/* Indicateur de chargement */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-start space-x-3"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div className="bg-gray-800/80 rounded-2xl rounded-tl-sm px-4 py-3 border border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                />
              </div>
              <span className="text-sm text-gray-400">Réflexion en cours...</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default TutorResponse;
