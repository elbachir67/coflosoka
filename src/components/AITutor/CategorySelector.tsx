import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Network,
  MessageSquare,
  Eye,
  Calculator,
  Code,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
  Brain,
  Network,
  MessageSquare,
  Eye,
  Calculator,
  Code,
};

const colorMap: Record<string, string> = {
  purple: "from-purple-500 to-purple-600 border-purple-500/30 hover:border-purple-500/50",
  blue: "from-blue-500 to-blue-600 border-blue-500/30 hover:border-blue-500/50",
  green: "from-green-500 to-green-600 border-green-500/30 hover:border-green-500/50",
  orange: "from-orange-500 to-orange-600 border-orange-500/30 hover:border-orange-500/50",
  red: "from-red-500 to-red-600 border-red-500/30 hover:border-red-500/50",
  yellow: "from-yellow-500 to-yellow-600 border-yellow-500/30 hover:border-yellow-500/50",
};

const selectedColorMap: Record<string, string> = {
  purple: "from-purple-500 to-purple-600 border-purple-400 shadow-purple-500/25",
  blue: "from-blue-500 to-blue-600 border-blue-400 shadow-blue-500/25",
  green: "from-green-500 to-green-600 border-green-400 shadow-green-500/25",
  orange: "from-orange-500 to-orange-600 border-orange-400 shadow-orange-500/25",
  red: "from-red-500 to-red-600 border-red-400 shadow-red-500/25",
  yellow: "from-yellow-500 to-yellow-600 border-yellow-400 shadow-yellow-500/25",
};

function CategorySelector({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {categories.map((category) => {
        const IconComponent = iconMap[category.icon] || Brain;
        const isSelected = selectedCategory === category.id;
        const colorClass = isSelected
          ? selectedColorMap[category.color]
          : colorMap[category.color];

        return (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(category.id)}
            className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
              isSelected
                ? `bg-gradient-to-br ${colorClass} shadow-lg`
                : `bg-gray-800/50 ${colorClass} hover:bg-gray-800`
            }`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div
                className={`p-2 rounded-lg ${
                  isSelected
                    ? "bg-white/20"
                    : "bg-gradient-to-br " + colorClass.split(" ")[0] + " " + colorClass.split(" ")[1] + " bg-opacity-20"
                }`}
              >
                <IconComponent
                  className={`w-5 h-5 ${isSelected ? "text-white" : "text-gray-300"}`}
                />
              </div>
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-white" : "text-gray-300"
                }`}
              >
                {category.name}
              </span>
            </div>
            {isSelected && (
              <motion.div
                layoutId="categoryIndicator"
                className="absolute inset-0 rounded-xl border-2 border-white/30"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export default CategorySelector;
