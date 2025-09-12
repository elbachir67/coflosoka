/**
 * Base de données de questions pour les quiz des modules
 */

export const QUIZ_QUESTIONS = {
  // Questions génériques qui peuvent être adaptées à différents modules
  fundamentals: [
    {
      text: "Quel est le principe fondamental de l'apprentissage automatique ?",
      options: [
        { text: "Apprendre des patterns à partir de données", isCorrect: true },
        { text: "Programmer des règles explicites", isCorrect: false },
        { text: "Copier le comportement humain", isCorrect: false },
        { text: "Utiliser uniquement la logique", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "L'apprentissage automatique consiste à identifier des patterns dans les données pour faire des prédictions.",
    },
    {
      text: "Quelle est la différence entre données d'entraînement et de test ?",
      options: [
        {
          text: "Entraînement pour apprendre, test pour évaluer",
          isCorrect: true,
        },
        { text: "Aucune différence", isCorrect: false },
        {
          text: "Test pour apprendre, entraînement pour évaluer",
          isCorrect: false,
        },
        { text: "Les deux sont identiques", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Les données d'entraînement servent à apprendre le modèle, les données de test à évaluer ses performances.",
    },
    {
      text: "Qu'est-ce qu'un hyperparamètre ?",
      options: [
        {
          text: "Un paramètre configuré avant l'entraînement",
          isCorrect: true,
        },
        {
          text: "Un paramètre appris pendant l'entraînement",
          isCorrect: false,
        },
        { text: "Une métrique de performance", isCorrect: false },
        { text: "Un type de données", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Les hyperparamètres sont des configurations du modèle définies avant l'entraînement.",
    },
    {
      text: "Qu'est-ce que la généralisation en ML ?",
      options: [
        {
          text: "La capacité à bien performer sur de nouvelles données",
          isCorrect: true,
        },
        {
          text: "Mémoriser parfaitement les données d'entraînement",
          isCorrect: false,
        },
        { text: "Utiliser tous les features disponibles", isCorrect: false },
        { text: "Avoir un modèle très complexe", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La généralisation est la capacité du modèle à bien performer sur des données non vues.",
    },
    {
      text: "Qu'est-ce que le biais en machine learning ?",
      options: [
        {
          text: "L'erreur due aux hypothèses simplificatrices du modèle",
          isCorrect: true,
        },
        { text: "L'erreur due au bruit dans les données", isCorrect: false },
        { text: "L'erreur de mesure", isCorrect: false },
        { text: "L'erreur humaine", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "Le biais représente l'erreur due aux hypothèses simplificatrices du modèle.",
    },
    {
      text: "Qu'est-ce que la variance en machine learning ?",
      options: [
        {
          text: "La sensibilité du modèle aux variations dans les données",
          isCorrect: true,
        },
        { text: "La moyenne des erreurs", isCorrect: false },
        { text: "L'écart-type des prédictions", isCorrect: false },
        { text: "La complexité du modèle", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "La variance mesure à quel point les prédictions varient pour différents ensembles d'entraînement.",
    },
    {
      text: "Qu'est-ce que le compromis biais-variance ?",
      options: [
        {
          text: "L'équilibre entre sous-apprentissage et sur-apprentissage",
          isCorrect: true,
        },
        { text: "Le choix entre vitesse et précision", isCorrect: false },
        { text: "L'équilibre entre données et calcul", isCorrect: false },
        {
          text: "Le compromis entre simplicité et complexité",
          isCorrect: false,
        },
      ],
      difficulty: "advanced",
      explanation:
        "Le compromis biais-variance illustre l'équilibre entre sous-apprentissage (biais élevé) et sur-apprentissage (variance élevée).",
    },
    {
      text: "Qu'est-ce que la feature engineering ?",
      options: [
        {
          text: "Le processus de création et sélection de variables pertinentes",
          isCorrect: true,
        },
        { text: "L'optimisation des hyperparamètres", isCorrect: false },
        { text: "L'entraînement du modèle", isCorrect: false },
        { text: "L'évaluation des performances", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La feature engineering consiste à créer, transformer et sélectionner les variables les plus informatives.",
    },
    {
      text: "Qu'est-ce que la normalisation des données ?",
      options: [
        { text: "Mettre les variables à la même échelle", isCorrect: true },
        { text: "Supprimer les valeurs aberrantes", isCorrect: false },
        { text: "Remplir les valeurs manquantes", isCorrect: false },
        { text: "Réduire la dimensionnalité", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "La normalisation met toutes les variables à la même échelle pour éviter qu'une variable domine les autres.",
    },
    {
      text: "Qu'est-ce qu'un ensemble de validation ?",
      options: [
        {
          text: "Un sous-ensemble pour ajuster les hyperparamètres",
          isCorrect: true,
        },
        { text: "Un autre nom pour les données de test", isCorrect: false },
        { text: "Les données d'entraînement", isCorrect: false },
        { text: "Les données de production", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "L'ensemble de validation sert à ajuster les hyperparamètres sans biaiser l'évaluation finale.",
    },
  ],

  classification: [
    {
      text: "Qu'est-ce qu'une matrice de confusion ?",
      options: [
        {
          text: "Un tableau montrant les prédictions correctes et incorrectes",
          isCorrect: true,
        },
        { text: "Une méthode d'optimisation", isCorrect: false },
        { text: "Un type de réseau de neurones", isCorrect: false },
        { text: "Une technique de preprocessing", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "La matrice de confusion visualise les performances d'un classificateur en montrant les vrais/faux positifs/négatifs.",
    },
    {
      text: "Qu'est-ce que la courbe ROC ?",
      options: [
        {
          text: "Une courbe montrant le compromis sensibilité/spécificité",
          isCorrect: true,
        },
        { text: "Une méthode de régularisation", isCorrect: false },
        { text: "Un algorithme de classification", isCorrect: false },
        { text: "Une technique de feature selection", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La courbe ROC montre la performance d'un classificateur binaire à différents seuils.",
    },
    {
      text: "Qu'est-ce que l'AUC ?",
      options: [
        { text: "L'aire sous la courbe ROC", isCorrect: true },
        { text: "Un algorithme de clustering", isCorrect: false },
        { text: "Une fonction d'activation", isCorrect: false },
        { text: "Une métrique de régression", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "L'AUC (Area Under Curve) mesure la qualité globale d'un classificateur binaire.",
    },
    {
      text: "Qu'est-ce que le F1-score ?",
      options: [
        {
          text: "La moyenne harmonique de la précision et du rappel",
          isCorrect: true,
        },
        {
          text: "La moyenne arithmétique de la précision et du rappel",
          isCorrect: false,
        },
        { text: "Le produit de la précision et du rappel", isCorrect: false },
        { text: "La différence entre précision et rappel", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Le F1-score combine précision et rappel en une seule métrique équilibrée.",
    },
    {
      text: "Qu'est-ce qu'un classificateur naïf de Bayes ?",
      options: [
        {
          text: "Un classificateur basé sur le théorème de Bayes avec indépendance des features",
          isCorrect: true,
        },
        { text: "Un classificateur très simple", isCorrect: false },
        { text: "Un classificateur sans entraînement", isCorrect: false },
        { text: "Un classificateur linéaire", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Naive Bayes applique le théorème de Bayes en supposant l'indépendance conditionnelle des features.",
    },
  ],

  deep_learning: [
    {
      text: "Qu'est-ce qu'une époque (epoch) en deep learning ?",
      options: [
        {
          text: "Un passage complet sur toutes les données d'entraînement",
          isCorrect: true,
        },
        { text: "Une itération sur un batch", isCorrect: false },
        { text: "Une mise à jour des poids", isCorrect: false },
        { text: "Une validation du modèle", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Une époque correspond à un passage complet du modèle sur l'ensemble des données d'entraînement.",
    },
    {
      text: "Qu'est-ce qu'un batch en deep learning ?",
      options: [
        {
          text: "Un sous-ensemble de données traité en une fois",
          isCorrect: true,
        },
        { text: "Toutes les données d'entraînement", isCorrect: false },
        { text: "Une couche du réseau", isCorrect: false },
        { text: "Un hyperparamètre", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Un batch est un sous-ensemble de données traité simultanément pour une mise à jour des poids.",
    },
    {
      text: "Qu'est-ce que le learning rate ?",
      options: [
        {
          text: "La taille du pas lors de la mise à jour des poids",
          isCorrect: true,
        },
        { text: "La vitesse de traitement", isCorrect: false },
        { text: "Le nombre d'époques", isCorrect: false },
        { text: "La taille du batch", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Le learning rate contrôle l'amplitude des mises à jour des poids lors de l'optimisation.",
    },
    {
      text: "Qu'est-ce que la batch normalization ?",
      options: [
        {
          text: "Normaliser les activations de chaque couche",
          isCorrect: true,
        },
        { text: "Normaliser la taille des batchs", isCorrect: false },
        { text: "Normaliser les poids", isCorrect: false },
        { text: "Normaliser les gradients", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La batch normalization normalise les activations pour stabiliser et accélérer l'entraînement.",
    },
    {
      text: "Qu'est-ce que l'optimiseur Adam ?",
      options: [
        { text: "Un algorithme d'optimisation adaptatif", isCorrect: true },
        { text: "Un type de réseau de neurones", isCorrect: false },
        { text: "Une fonction d'activation", isCorrect: false },
        { text: "Une technique de régularisation", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Adam combine les avantages de RMSprop et momentum pour une optimisation adaptative.",
    },
  ],
};

// Fonction pour générer des questions de quiz pour un module spécifique
export function generateModuleQuiz(
  moduleTitle,
  moduleContent,
  questionCount = 10
) {
  const allQuestions = [
    ...QUIZ_QUESTIONS.fundamentals,
    ...QUIZ_QUESTIONS.classification,
    ...QUIZ_QUESTIONS.deep_learning,
  ];

  // Sélectionner des questions pertinentes basées sur le titre du module
  let relevantQuestions = allQuestions;

  if (moduleTitle.toLowerCase().includes("classification")) {
    relevantQuestions = [
      ...QUIZ_QUESTIONS.fundamentals,
      ...QUIZ_QUESTIONS.classification,
    ];
  } else if (
    moduleTitle.toLowerCase().includes("deep") ||
    moduleTitle.toLowerCase().includes("neural")
  ) {
    relevantQuestions = [
      ...QUIZ_QUESTIONS.fundamentals,
      ...QUIZ_QUESTIONS.deep_learning,
    ];
  }

  // Mélanger et sélectionner le nombre requis de questions
  const shuffled = relevantQuestions.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

  // Adapter les questions au contexte du module
  return selected.map((q, index) => ({
    text: q.text.replace(/machine learning|ML/gi, moduleTitle),
    options: q.options,
    difficulty: q.difficulty,
    explanation: q.explanation,
  }));
}
