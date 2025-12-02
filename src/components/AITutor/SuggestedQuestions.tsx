import React from "react";
import { motion } from "framer-motion";
import { Lightbulb, ArrowRight } from "lucide-react";

interface SuggestedQuestionsProps {
  questions: string[];
  onSelectQuestion: (question: string) => void;
  isLoading: boolean;
}

function SuggestedQuestions({
  questions,
  onSelectQuestion,
  isLoading,
}: SuggestedQuestionsProps) {
  return (
    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center space-x-2 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        <h3 className="text-sm font-medium text-gray-300">
          Questions suggérées
        </h3>
      </div>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: 4 }}
            onClick={() => onSelectQuestion(question)}
            disabled={isLoading}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 group ${
              isLoading
                ? "bg-gray-700/30 cursor-not-allowed opacity-50"
                : "bg-gray-700/50 hover:bg-gray-700 cursor-pointer"
            }`}
          >
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
              {question}
            </span>
            <ArrowRight
              className={`w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-all ${
                isLoading ? "opacity-0" : "opacity-0 group-hover:opacity-100"
              }`}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default SuggestedQuestions;
