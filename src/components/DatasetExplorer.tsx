import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGamification } from "../contexts/GamificationContext";
import {
  Database,
  Search,
  Loader2,
  AlertCircle,
  ExternalLink,
  Download,
  FileText,
  BarChart,
  Users,
  Calendar,
  ThumbsUp,
  Filter,
  Brain,
  Eye,
  Camera,
  MessageSquare,
  TrendingUp,
  Zap,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface Dataset {
  id: string;
  title: string;
  description: string;
  url: string;
  downloadCount: number;
  voteCount: number;
  usabilityRating: number;
  lastUpdated: string;
  ownerName: string;
  totalBytes: number;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

const KAGGLE_DATASETS = {
  "machine-learning": [
    {
      id: "titanic",
      title: "Titanic - Machine Learning from Disaster",
      description:
        "Prédisez la survie des passagers du Titanic avec des techniques de machine learning. Dataset parfait pour débuter en classification.",
      url: "https://www.kaggle.com/c/titanic",
      downloadCount: 150000,
      voteCount: 12500,
      usabilityRating: 9.4,
      lastUpdated: "2024-12-15T10:30:00Z",
      ownerName: "Kaggle",
      totalBytes: 59000,
      tags: ["classification", "beginner", "tutorial", "pandas"],
      difficulty: "beginner",
    },
    {
      id: "house-prices",
      title: "House Prices - Advanced Regression Techniques",
      description:
        "Prédisez les prix de l'immobilier et pratiquez le feature engineering avancé. Excellent pour apprendre la régression.",
      url: "https://www.kaggle.com/c/house-prices-advanced-regression-techniques",
      downloadCount: 89000,
      voteCount: 8900,
      usabilityRating: 8.7,
      lastUpdated: "2024-11-20T14:15:00Z",
      ownerName: "Kaggle",
      totalBytes: 460000,
      tags: ["regression", "feature engineering", "intermediate"],
      difficulty: "intermediate",
    },
    {
      id: "iris",
      title: "Iris Species Classification",
      description:
        "Le dataset classique pour apprendre la classification. Parfait pour comprendre les bases du machine learning.",
      url: "https://www.kaggle.com/datasets/uciml/iris",
      downloadCount: 200000,
      voteCount: 15000,
      usabilityRating: 9.8,
      lastUpdated: "2024-10-01T08:00:00Z",
      ownerName: "UCI ML Repository",
      totalBytes: 4000,
      tags: ["classification", "beginner", "classic", "scikit-learn"],
      difficulty: "beginner",
    },
    {
      id: "wine-quality",
      title: "Wine Quality Dataset",
      description:
        "Prédisez la qualité du vin basée sur ses propriétés physicochimiques. Excellent pour la régression et classification.",
      url: "https://www.kaggle.com/datasets/uciml/red-wine-quality-cortez-et-al-2009",
      downloadCount: 75000,
      voteCount: 6800,
      usabilityRating: 8.9,
      lastUpdated: "2024-09-15T12:30:00Z",
      ownerName: "UCI ML Repository",
      totalBytes: 84000,
      tags: ["regression", "classification", "intermediate", "wine"],
      difficulty: "intermediate",
    },
  ],
  "computer-vision": [
    {
      id: "digit-recognizer",
      title: "Digit Recognizer (MNIST)",
      description:
        "Reconnaissez les chiffres manuscrits avec le célèbre dataset MNIST. Le 'Hello World' de la vision par ordinateur.",
      url: "https://www.kaggle.com/c/digit-recognizer",
      downloadCount: 125000,
      voteCount: 11200,
      usabilityRating: 9.1,
      lastUpdated: "2024-10-05T09:45:00Z",
      ownerName: "Kaggle",
      totalBytes: 11000000,
      tags: ["computer vision", "deep learning", "mnist", "beginner"],
      difficulty: "beginner",
    },
    {
      id: "cats-vs-dogs",
      title: "Dogs vs. Cats Classification",
      description:
        "Classifiez des images de chiens et chats. Parfait pour apprendre les CNN et le transfer learning.",
      url: "https://www.kaggle.com/c/dogs-vs-cats",
      downloadCount: 95000,
      voteCount: 8500,
      usabilityRating: 8.8,
      lastUpdated: "2024-11-10T16:20:00Z",
      ownerName: "Kaggle",
      totalBytes: 543000000,
      tags: ["computer vision", "cnn", "classification", "animals"],
      difficulty: "intermediate",
    },
    {
      id: "fashion-mnist",
      title: "Fashion-MNIST",
      description:
        "Version moderne de MNIST avec des vêtements. Plus challenging que MNIST classique pour tester vos modèles.",
      url: "https://www.kaggle.com/datasets/zalando-research/fashionmnist",
      downloadCount: 67000,
      voteCount: 5900,
      usabilityRating: 9.0,
      lastUpdated: "2024-08-25T11:15:00Z",
      ownerName: "Zalando Research",
      totalBytes: 29300000,
      tags: ["computer vision", "fashion", "classification", "cnn"],
      difficulty: "intermediate",
    },
    {
      id: "plant-pathology",
      title: "Plant Pathology 2021 - FGVC8",
      description:
        "Identifiez les maladies des plantes à partir d'images de feuilles. Application pratique de la vision par ordinateur.",
      url: "https://www.kaggle.com/c/plant-pathology-2021-fgvc8",
      downloadCount: 23000,
      voteCount: 1800,
      usabilityRating: 7.9,
      lastUpdated: "2024-07-12T14:30:00Z",
      ownerName: "FGVC",
      totalBytes: 1200000000,
      tags: ["computer vision", "agriculture", "classification", "advanced"],
      difficulty: "advanced",
    },
  ],
  nlp: [
    {
      id: "sentiment140",
      title: "Sentiment140 Dataset",
      description:
        "Analysez le sentiment de 1.6 million de tweets. Parfait pour débuter en analyse de sentiment et NLP.",
      url: "https://www.kaggle.com/datasets/kazanova/sentiment140",
      downloadCount: 45000,
      voteCount: 3200,
      usabilityRating: 8.3,
      lastUpdated: "2024-09-30T10:00:00Z",
      ownerName: "Stanford",
      totalBytes: 238000000,
      tags: ["nlp", "sentiment analysis", "twitter", "beginner"],
      difficulty: "beginner",
    },
    {
      id: "imdb-reviews",
      title: "IMDB Movie Reviews",
      description:
        "50,000 critiques de films pour l'analyse de sentiment binaire. Dataset de référence en NLP.",
      url: "https://www.kaggle.com/datasets/lakshmi25npathi/imdb-dataset-of-50k-movie-reviews",
      downloadCount: 78000,
      voteCount: 6500,
      usabilityRating: 9.2,
      lastUpdated: "2024-10-18T13:45:00Z",
      ownerName: "Stanford AI Lab",
      totalBytes: 66000000,
      tags: ["nlp", "sentiment analysis", "movies", "intermediate"],
      difficulty: "intermediate",
    },
    {
      id: "news-category",
      title: "News Category Dataset",
      description:
        "Classifiez des articles de presse par catégorie. Excellent pour la classification de texte multi-classe.",
      url: "https://www.kaggle.com/datasets/rmisra/news-category-dataset",
      downloadCount: 34000,
      voteCount: 2800,
      usabilityRating: 8.6,
      lastUpdated: "2024-08-14T09:20:00Z",
      ownerName: "Rishabh Misra",
      totalBytes: 29000000,
      tags: ["nlp", "classification", "news", "intermediate"],
      difficulty: "intermediate",
    },
    {
      id: "quora-questions",
      title: "Quora Question Pairs",
      description:
        "Identifiez si deux questions Quora sont similaires. Challenge avancé en NLP et similarity matching.",
      url: "https://www.kaggle.com/c/quora-question-pairs",
      downloadCount: 56000,
      voteCount: 4200,
      usabilityRating: 7.8,
      lastUpdated: "2024-06-22T15:10:00Z",
      ownerName: "Quora",
      totalBytes: 384000000,
      tags: ["nlp", "similarity", "questions", "advanced"],
      difficulty: "advanced",
    },
  ],
  "data-science": [
    {
      id: "world-happiness",
      title: "World Happiness Report",
      description:
        "Analysez les facteurs du bonheur mondial. Parfait pour l'analyse exploratoire et la visualisation de données.",
      url: "https://www.kaggle.com/datasets/unsdsn/world-happiness",
      downloadCount: 89000,
      voteCount: 7200,
      usabilityRating: 9.0,
      lastUpdated: "2024-12-01T11:00:00Z",
      ownerName: "UN Sustainable Development Solutions Network",
      totalBytes: 25000,
      tags: ["data science", "visualization", "happiness", "beginner"],
      difficulty: "beginner",
    },
    {
      id: "covid19-data",
      title: "COVID-19 Open Research Dataset",
      description:
        "Dataset massif sur la recherche COVID-19. Excellent pour l'analyse de données textuelles et la recherche d'informations.",
      url: "https://www.kaggle.com/datasets/allen-institute-for-ai/CORD-19-research-challenge",
      downloadCount: 67000,
      voteCount: 5400,
      usabilityRating: 8.1,
      lastUpdated: "2024-07-30T14:20:00Z",
      ownerName: "Allen Institute for AI",
      totalBytes: 13000000000,
      tags: ["data science", "covid19", "research", "advanced"],
      difficulty: "advanced",
    },
    {
      id: "sales-forecasting",
      title: "Store Sales - Time Series Forecasting",
      description:
        "Prédisez les ventes futures d'une chaîne de magasins. Excellent pour apprendre les séries temporelles.",
      url: "https://www.kaggle.com/c/store-sales-time-series-forecasting",
      downloadCount: 42000,
      voteCount: 3600,
      usabilityRating: 8.4,
      lastUpdated: "2024-09-05T10:15:00Z",
      ownerName: "Kaggle",
      totalBytes: 128000000,
      tags: ["time series", "forecasting", "sales", "intermediate"],
      difficulty: "intermediate",
    },
  ],
};

const DatasetExplorer: React.FC = () => {
  const { user } = useAuth();
  const { rewardAction } = useGamification();
  const [selectedDomain, setSelectedDomain] =
    useState<string>("machine-learning");
  const [selectedSource, setSelectedSource] = useState<"kaggle" | "dataspace">(
    "kaggle"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const domains = [
    {
      id: "machine-learning",
      label: "Machine Learning",
      icon: Brain,
      color: "purple",
      description: "Datasets pour classification, régression et clustering",
    },
    {
      id: "computer-vision",
      label: "Computer Vision",
      icon: Camera,
      color: "blue",
      description: "Images, détection d'objets et reconnaissance",
    },
    {
      id: "nlp",
      label: "NLP",
      icon: MessageSquare,
      color: "green",
      description: "Traitement du langage naturel et analyse de texte",
    },
    {
      id: "data-science",
      label: "Data Science",
      icon: BarChart,
      color: "orange",
      description: "Analyse exploratoire et visualisation de données",
    },
  ];

  const handleDomainChange = async (domainId: string) => {
    setSelectedDomain(domainId);
    setSearchQuery("");

    // Récompenser l'utilisateur pour l'exploration
    await rewardAction("explore_datasets", { domain: domainId });
  };

  const handleSourceChange = (source: "kaggle" | "dataspace") => {
    setSelectedSource(source);
    if (source === "dataspace") {
      toast("Data Space sera bientôt disponible ! 🚀", {
        duration: 3000,
        icon: "🔜",
      });
    }
  };

  const getCurrentDatasets = (): Dataset[] => {
    if (selectedSource === "dataspace") {
      return []; // Pas encore disponible
    }

    const datasets =
      KAGGLE_DATASETS[selectedDomain as keyof typeof KAGGLE_DATASETS] || [];

    if (!searchQuery.trim()) {
      return datasets.map(ds => ({
        ...ds,
        difficulty: ds.difficulty as "beginner" | "intermediate" | "advanced",
      }));
    }

    return datasets
      .filter(
        dataset =>
          dataset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dataset.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          dataset.tags.some(tag =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
      .map(ds => ({
        ...ds,
        difficulty: ds.difficulty as "beginner" | "intermediate" | "advanced",
      }));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-400";
      case "intermediate":
        return "bg-blue-500/20 text-blue-400";
      case "advanced":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const currentDatasets = getCurrentDatasets();

  return (
    <div className="glass-card rounded-xl p-6">
      <h2 className="text-xl font-bold text-gray-100 mb-6 flex items-center">
        <Database className="w-5 h-5 text-blue-400 mr-2" />
        Explorateur de Datasets
      </h2>

      {/* Sélecteur de source */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-3">
          Source de données
        </h3>
        <div className="flex space-x-4">
          <button
            onClick={() => handleSourceChange("kaggle")}
            className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center space-x-3 ${
              selectedSource === "kaggle"
                ? "bg-blue-500/20 border-blue-500/50 text-blue-400"
                : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            <Database className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Kaggle Datasets</div>
              <div className="text-xs opacity-75">
                Datasets gratuits et populaires
              </div>
            </div>
            {selectedSource === "kaggle" && (
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            )}
          </button>

          <button
            onClick={() => handleSourceChange("dataspace")}
            className={`px-4 py-3 rounded-lg border transition-all duration-200 flex items-center space-x-3 relative ${
              selectedSource === "dataspace"
                ? "bg-purple-500/20 border-purple-500/50 text-purple-400"
                : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600"
            }`}
          >
            <Zap className="w-5 h-5" />
            <div className="text-left">
              <div className="font-medium">Data Space</div>
              <div className="text-xs opacity-75">Bientôt disponible</div>
            </div>
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
              SOON
            </span>
          </button>
        </div>
      </div>

      {/* Sélecteur de domaine */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-200 mb-3">
          Domaine d'application
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {domains.map(domain => {
            const Icon = domain.icon;
            const isSelected = selectedDomain === domain.id;

            return (
              <button
                key={domain.id}
                onClick={() => handleDomainChange(domain.id)}
                className={`p-4 rounded-lg border transition-all duration-200 text-left ${
                  isSelected
                    ? `bg-${domain.color}-500/20 border-${domain.color}-500/50 text-${domain.color}-400`
                    : "bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-gray-800/70"
                }`}
              >
                <div className="flex items-center mb-2">
                  <Icon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{domain.label}</span>
                </div>
                <p className="text-xs opacity-75">{domain.description}</p>
                {isSelected && (
                  <div className="mt-2 flex items-center">
                    <div
                      className={`w-2 h-2 bg-${domain.color}-400 rounded-full mr-2`}
                    ></div>
                    <span className="text-xs font-medium">Sélectionné</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={`Rechercher dans ${
              domains.find(d => d.id === selectedDomain)?.label
            }...`}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 pl-12"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-300"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Datasets */}
      {selectedSource === "dataspace" ? (
        <div className="text-center py-12">
          <div className="relative">
            <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
              <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                BIENTÔT
              </div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-100 mb-2">Data Space</h3>
          <p className="text-gray-400 mb-4">
            Une nouvelle source de datasets premium sera bientôt disponible !
          </p>
          <div className="inline-flex items-center space-x-2 bg-purple-500/10 px-4 py-2 rounded-lg border border-purple-500/20">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-purple-400 font-medium">
              En développement
            </span>
          </div>
        </div>
      ) : currentDatasets.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-400">
              {currentDatasets.length} dataset
              {currentDatasets.length > 1 ? "s" : ""} trouvé
              {currentDatasets.length > 1 ? "s" : ""} en{" "}
              {domains.find(d => d.id === selectedDomain)?.label}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Datasets gratuits</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentDatasets.map(dataset => (
              <div
                key={dataset.id}
                className="p-6 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors border border-gray-700/50 hover:border-gray-600/50"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-200 flex-1 pr-4">
                    {dataset.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                      dataset.difficulty
                    )}`}
                  >
                    {dataset.difficulty === "beginner"
                      ? "Débutant"
                      : dataset.difficulty === "intermediate"
                      ? "Intermédiaire"
                      : "Avancé"}
                  </span>
                </div>

                <p className="text-gray-400 mb-4 text-sm leading-relaxed">
                  {dataset.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 text-blue-400 mr-2" />
                    <span className="text-gray-300">
                      {formatBytes(dataset.totalBytes)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Download className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-gray-300">
                      {dataset.downloadCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsUp className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-gray-300">
                      {dataset.voteCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-gray-300">
                      {formatDate(dataset.lastUpdated)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {dataset.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="flex items-center mr-4">
                      <Users className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-gray-400 text-sm">
                        {dataset.ownerName}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                      <span className="text-green-400 text-sm font-medium">
                        {dataset.usabilityRating}/10
                      </span>
                    </div>
                  </div>

                  <a
                    href={dataset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                    onClick={() =>
                      rewardAction("view_dataset", { datasetId: dataset.id })
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Voir sur Kaggle
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Database className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Aucun dataset trouvé</p>
          <p className="text-gray-500">
            Essayez une recherche différente ou changez de domaine
          </p>
        </div>
      )}

      {/* Informations sur les sources */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <div className="flex items-center mb-2">
            <Database className="w-5 h-5 text-blue-400 mr-2" />
            <h4 className="font-semibold text-blue-400">Kaggle Datasets</h4>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            Plateforme mondiale de data science avec des milliers de datasets
            gratuits et des compétitions.
          </p>
          <div className="flex items-center">
            <a
              href="https://www.kaggle.com/datasets"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
            >
              Explorer Kaggle
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20 relative">
          <div className="flex items-center mb-2">
            <Zap className="w-5 h-5 text-purple-400 mr-2" />
            <h4 className="font-semibold text-purple-400">Data Space</h4>
            <span className="ml-2 bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full font-bold">
              BIENTÔT
            </span>
          </div>
          <p className="text-gray-400 text-sm mb-3">
            Nouvelle plateforme de datasets premium avec des données exclusives
            et des outils d'analyse avancés.
          </p>
          <div className="flex items-center text-purple-400 text-sm">
            <Clock className="w-3 h-3 mr-1" />
            <span>En développement</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatasetExplorer;
