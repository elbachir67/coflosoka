/**
 * Base de données étendue de questions d'évaluation
 */

export const ASSESSMENT_QUESTIONS = {
  math: [
    {
      text: "Quelle est la dérivée de f(x) = x² + 3x + 2 ?",
      options: [
        { text: "2x + 3", isCorrect: true },
        { text: "x² + 3", isCorrect: false },
        { text: "2x + 2", isCorrect: false },
        { text: "x + 3", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "La dérivée de x² est 2x, la dérivée de 3x est 3, et la dérivée d'une constante est 0.",
    },
    {
      text: "Quelle est la probabilité d'obtenir un 6 en lançant un dé équilibré ?",
      options: [
        { text: "1/6", isCorrect: true },
        { text: "1/3", isCorrect: false },
        { text: "1/2", isCorrect: false },
        { text: "1/4", isCorrect: false },
      ],
      difficulty: "basic",
      explanation: "Un dé a 6 faces équiprobables, donc P(6) = 1/6.",
    },
    {
      text: "Que représente la matrice identité ?",
      options: [
        {
          text: "Une matrice avec des 1 sur la diagonale et des 0 ailleurs",
          isCorrect: true,
        },
        {
          text: "Une matrice avec tous les éléments égaux à 1",
          isCorrect: false,
        },
        { text: "Une matrice nulle", isCorrect: false },
        { text: "Une matrice triangulaire", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "La matrice identité I a des 1 sur la diagonale principale et des 0 partout ailleurs.",
    },
    {
      text: "Quelle est la formule de la variance ?",
      options: [
        { text: "E[(X - μ)²]", isCorrect: true },
        { text: "E[X] - μ", isCorrect: false },
        { text: "E[X²] - E[X]", isCorrect: false },
        { text: "√(E[(X - μ)²])", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La variance est l'espérance du carré des écarts à la moyenne : Var(X) = E[(X - μ)²].",
    },
    {
      text: "Qu'est-ce qu'une fonction convexe ?",
      options: [
        {
          text: "Une fonction où tout segment entre deux points est au-dessus de la courbe",
          isCorrect: true,
        },
        { text: "Une fonction strictement croissante", isCorrect: false },
        { text: "Une fonction dérivable partout", isCorrect: false },
        { text: "Une fonction continue", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Une fonction convexe satisfait f(λx + (1-λ)y) ≤ λf(x) + (1-λ)f(y) pour λ ∈ [0,1].",
    },
    {
      text: "Quelle est la définition d'un espace vectoriel ?",
      options: [
        {
          text: "Un ensemble muni d'une addition et d'une multiplication scalaire",
          isCorrect: true,
        },
        { text: "Un ensemble de vecteurs dans R³", isCorrect: false },
        { text: "Une matrice carrée", isCorrect: false },
        { text: "Un système d'équations linéaires", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Un espace vectoriel est un ensemble muni de deux opérations satisfaisant certains axiomes.",
    },
    {
      text: "Que signifie que deux vecteurs sont orthogonaux ?",
      options: [
        { text: "Leur produit scalaire est nul", isCorrect: true },
        { text: "Ils ont la même direction", isCorrect: false },
        { text: "Ils ont la même norme", isCorrect: false },
        { text: "Ils sont colinéaires", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Deux vecteurs sont orthogonaux si leur produit scalaire est égal à zéro.",
    },
    {
      text: "Qu'est-ce que la décomposition en valeurs singulières (SVD) ?",
      options: [
        { text: "Une factorisation A = UΣV^T", isCorrect: true },
        { text: "Une méthode de résolution d'équations", isCorrect: false },
        { text: "Un algorithme d'optimisation", isCorrect: false },
        { text: "Une technique de compression", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "La SVD décompose une matrice A en trois matrices : A = UΣV^T.",
    },
    {
      text: "Quelle est la différence entre corrélation et causalité ?",
      options: [
        { text: "La corrélation n'implique pas la causalité", isCorrect: true },
        { text: "Ce sont des concepts identiques", isCorrect: false },
        {
          text: "La causalité est plus faible que la corrélation",
          isCorrect: false,
        },
        {
          text: "La corrélation implique toujours la causalité",
          isCorrect: false,
        },
      ],
      difficulty: "intermediate",
      explanation:
        "Deux variables peuvent être corrélées sans qu'il y ait de relation causale entre elles.",
    },
    {
      text: "Qu'est-ce que le théorème central limite ?",
      options: [
        {
          text: "La distribution des moyennes d'échantillons tend vers une normale",
          isCorrect: true,
        },
        { text: "Toute distribution est normale", isCorrect: false },
        { text: "La moyenne est toujours au centre", isCorrect: false },
        {
          text: "Les échantillons sont toujours représentatifs",
          isCorrect: false,
        },
      ],
      difficulty: "advanced",
      explanation:
        "Le TCL stipule que la distribution des moyennes d'échantillons converge vers une loi normale.",
    },
  ],

  programming: [
    {
      text: "Quelle est la complexité temporelle de la recherche dans une liste triée avec la recherche binaire ?",
      options: [
        { text: "O(log n)", isCorrect: true },
        { text: "O(n)", isCorrect: false },
        { text: "O(n log n)", isCorrect: false },
        { text: "O(1)", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "La recherche binaire divise l'espace de recherche par 2 à chaque étape, d'où O(log n).",
    },
    {
      text: "Que fait la fonction map() en Python ?",
      options: [
        {
          text: "Applique une fonction à chaque élément d'un itérable",
          isCorrect: true,
        },
        { text: "Filtre les éléments d'une liste", isCorrect: false },
        { text: "Trie une liste", isCorrect: false },
        { text: "Compte les occurrences", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "map(function, iterable) applique la fonction à chaque élément de l'itérable.",
    },
    {
      text: "Qu'est-ce qu'une liste chaînée ?",
      options: [
        {
          text: "Une structure de données où chaque élément pointe vers le suivant",
          isCorrect: true,
        },
        { text: "Un tableau dynamique", isCorrect: false },
        { text: "Une pile LIFO", isCorrect: false },
        { text: "Un arbre binaire", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Une liste chaînée est composée de nœuds, chacun contenant des données et un pointeur vers le nœud suivant.",
    },
    {
      text: "Quelle est la différence entre une pile et une file ?",
      options: [
        { text: "Pile: LIFO, File: FIFO", isCorrect: true },
        { text: "Pile: FIFO, File: LIFO", isCorrect: false },
        { text: "Aucune différence", isCorrect: false },
        { text: "La pile est plus rapide", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Pile (Stack): Last In First Out. File (Queue): First In First Out.",
    },
    {
      text: "Qu'est-ce que la récursion ?",
      options: [
        { text: "Une fonction qui s'appelle elle-même", isCorrect: true },
        { text: "Une boucle infinie", isCorrect: false },
        { text: "Un algorithme de tri", isCorrect: false },
        { text: "Une structure de données", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "La récursion est une technique où une fonction s'appelle elle-même avec des paramètres modifiés.",
    },
    {
      text: "Quelle est la complexité de l'algorithme de tri rapide (quicksort) dans le pire cas ?",
      options: [
        { text: "O(n²)", isCorrect: true },
        { text: "O(n log n)", isCorrect: false },
        { text: "O(n)", isCorrect: false },
        { text: "O(log n)", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Dans le pire cas (pivot toujours le plus petit/grand), quicksort a une complexité O(n²).",
    },
    {
      text: "Qu'est-ce qu'un arbre binaire de recherche ?",
      options: [
        {
          text: "Un arbre où chaque nœud a au plus 2 enfants et respecte l'ordre",
          isCorrect: true,
        },
        { text: "Un arbre avec exactement 2 niveaux", isCorrect: false },
        { text: "Un arbre où tous les nœuds ont 2 enfants", isCorrect: false },
        { text: "Un graphe sans cycles", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Dans un ABR, pour chaque nœud, les valeurs à gauche sont inférieures et celles à droite supérieures.",
    },
    {
      text: "Qu'est-ce que la programmation orientée objet ?",
      options: [
        {
          text: "Un paradigme basé sur les objets et classes",
          isCorrect: true,
        },
        { text: "Une méthode de compilation", isCorrect: false },
        { text: "Un type de base de données", isCorrect: false },
        { text: "Un algorithme de tri", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La POO organise le code autour d'objets qui encapsulent données et comportements.",
    },
    {
      text: "Qu'est-ce que l'héritage en programmation ?",
      options: [
        {
          text: "Une classe peut hériter des propriétés d'une autre classe",
          isCorrect: true,
        },
        { text: "Partager des variables globales", isCorrect: false },
        { text: "Copier du code d'un fichier à l'autre", isCorrect: false },
        { text: "Utiliser des bibliothèques externes", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "L'héritage permet à une classe enfant d'hériter des attributs et méthodes de sa classe parent.",
    },
    {
      text: "Qu'est-ce qu'un algorithme de hachage ?",
      options: [
        {
          text: "Une fonction qui transforme des données en une valeur de taille fixe",
          isCorrect: true,
        },
        { text: "Un algorithme de tri", isCorrect: false },
        { text: "Une méthode de compression", isCorrect: false },
        { text: "Un protocole de communication", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "Une fonction de hachage produit une empreinte de taille fixe à partir de données de taille variable.",
    },
  ],

  ml: [
    {
      text: "Qu'est-ce que l'overfitting en machine learning ?",
      options: [
        {
          text: "Quand le modèle mémorise les données d'entraînement mais généralise mal",
          isCorrect: true,
        },
        { text: "Quand le modèle est trop simple", isCorrect: false },
        { text: "Quand les données sont insuffisantes", isCorrect: false },
        { text: "Quand l'algorithme converge trop vite", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "L'overfitting se produit quand le modèle s'adapte trop aux données d'entraînement et perd sa capacité de généralisation.",
    },
    {
      text: "Quelle est la différence entre classification et régression ?",
      options: [
        {
          text: "Classification: variables catégorielles, Régression: variables continues",
          isCorrect: true,
        },
        {
          text: "Classification: supervisé, Régression: non-supervisé",
          isCorrect: false,
        },
        { text: "Aucune différence", isCorrect: false },
        {
          text: "Classification: linéaire, Régression: non-linéaire",
          isCorrect: false,
        },
      ],
      difficulty: "basic",
      explanation:
        "La classification prédit des catégories/classes, la régression prédit des valeurs numériques continues.",
    },
    {
      text: "Qu'est-ce que la validation croisée ?",
      options: [
        {
          text: "Une technique pour évaluer la performance d'un modèle en divisant les données",
          isCorrect: true,
        },
        { text: "Une méthode de nettoyage des données", isCorrect: false },
        { text: "Un algorithme d'optimisation", isCorrect: false },
        { text: "Une technique de feature engineering", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La validation croisée divise les données en k-folds pour entraîner et tester le modèle plusieurs fois.",
    },
    {
      text: "Que mesure la précision (precision) ?",
      options: [
        {
          text: "Le ratio de vrais positifs parmi les prédictions positives",
          isCorrect: true,
        },
        {
          text: "Le ratio de vrais positifs parmi tous les positifs réels",
          isCorrect: false,
        },
        { text: "Le ratio de prédictions correctes", isCorrect: false },
        { text: "L'erreur moyenne du modèle", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Précision = TP / (TP + FP), soit la proportion de prédictions positives qui sont correctes.",
    },
    {
      text: "Qu'est-ce qu'un arbre de décision ?",
      options: [
        {
          text: "Un modèle qui utilise des règles if-then organisées en arbre",
          isCorrect: true,
        },
        { text: "Un réseau de neurones", isCorrect: false },
        { text: "Un algorithme de clustering", isCorrect: false },
        {
          text: "Une méthode de réduction de dimensionnalité",
          isCorrect: false,
        },
      ],
      difficulty: "basic",
      explanation:
        "Un arbre de décision divise récursivement l'espace des features selon des règles de décision.",
    },
    {
      text: "Qu'est-ce que le rappel (recall) ?",
      options: [
        {
          text: "Le ratio de vrais positifs parmi tous les positifs réels",
          isCorrect: true,
        },
        {
          text: "Le ratio de vrais positifs parmi les prédictions positives",
          isCorrect: false,
        },
        { text: "Le ratio de prédictions correctes", isCorrect: false },
        { text: "L'inverse de la précision", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Rappel = TP / (TP + FN), soit la proportion de positifs réels correctement identifiés.",
    },
    {
      text: "Qu'est-ce que l'algorithme k-means ?",
      options: [
        {
          text: "Un algorithme de clustering qui groupe les données en k clusters",
          isCorrect: true,
        },
        {
          text: "Un algorithme de classification supervisée",
          isCorrect: false,
        },
        { text: "Une méthode de régression", isCorrect: false },
        {
          text: "Un algorithme de réduction de dimensionnalité",
          isCorrect: false,
        },
      ],
      difficulty: "intermediate",
      explanation:
        "K-means partitionne les données en k clusters en minimisant la variance intra-cluster.",
    },
    {
      text: "Qu'est-ce que la régularisation ?",
      options: [
        {
          text: "Une technique pour éviter l'overfitting en pénalisant la complexité",
          isCorrect: true,
        },
        { text: "Une méthode de normalisation des données", isCorrect: false },
        { text: "Un algorithme d'optimisation", isCorrect: false },
        { text: "Une technique de feature selection", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "La régularisation ajoute un terme de pénalité à la fonction de coût pour contrôler la complexité du modèle.",
    },
    {
      text: "Qu'est-ce que l'ACP (Analyse en Composantes Principales) ?",
      options: [
        {
          text: "Une technique de réduction de dimensionnalité",
          isCorrect: true,
        },
        { text: "Un algorithme de classification", isCorrect: false },
        { text: "Une méthode de clustering", isCorrect: false },
        { text: "Un algorithme d'optimisation", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "L'ACP projette les données sur un espace de dimension réduite en préservant la variance maximale.",
    },
    {
      text: "Qu'est-ce que l'ensemble learning ?",
      options: [
        {
          text: "Combiner plusieurs modèles pour améliorer les performances",
          isCorrect: true,
        },
        { text: "Entraîner un seul modèle très complexe", isCorrect: false },
        { text: "Utiliser toutes les données disponibles", isCorrect: false },
        { text: "Optimiser les hyperparamètres", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "L'ensemble learning combine les prédictions de plusieurs modèles (bagging, boosting, stacking).",
    },
  ],

  dl: [
    {
      text: "Qu'est-ce que la rétropropagation ?",
      options: [
        {
          text: "L'algorithme pour calculer les gradients dans un réseau de neurones",
          isCorrect: true,
        },
        { text: "Une technique de régularisation", isCorrect: false },
        { text: "Un type d'activation", isCorrect: false },
        { text: "Une méthode d'initialisation", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La rétropropagation calcule les gradients en propageant l'erreur de la sortie vers l'entrée.",
    },
    {
      text: "Quelle est la fonction d'activation la plus utilisée actuellement ?",
      options: [
        { text: "ReLU", isCorrect: true },
        { text: "Sigmoid", isCorrect: false },
        { text: "Tanh", isCorrect: false },
        { text: "Linear", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "ReLU (Rectified Linear Unit) est populaire car elle évite le problème de gradient vanishing.",
    },
    {
      text: "Qu'est-ce qu'un CNN ?",
      options: [
        { text: "Convolutional Neural Network", isCorrect: true },
        { text: "Cascading Neural Network", isCorrect: false },
        { text: "Continuous Neural Network", isCorrect: false },
        { text: "Circular Neural Network", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "CNN utilise des couches de convolution pour traiter des données avec une structure spatiale comme les images.",
    },
    {
      text: "Qu'est-ce que le dropout ?",
      options: [
        {
          text: "Une technique de régularisation qui désactive aléatoirement des neurones",
          isCorrect: true,
        },
        { text: "Une fonction d'activation", isCorrect: false },
        { text: "Un algorithme d'optimisation", isCorrect: false },
        { text: "Une méthode de normalisation", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Le dropout désactive aléatoirement des neurones pendant l'entraînement pour éviter l'overfitting.",
    },
    {
      text: "Qu'est-ce que le transfer learning ?",
      options: [
        {
          text: "Utiliser un modèle pré-entraîné comme point de départ",
          isCorrect: true,
        },
        { text: "Transférer des données entre datasets", isCorrect: false },
        {
          text: "Changer d'algorithme pendant l'entraînement",
          isCorrect: false,
        },
        { text: "Optimiser les hyperparamètres", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Le transfer learning réutilise les poids d'un modèle pré-entraîné sur une tâche similaire.",
    },
    {
      text: "Qu'est-ce qu'un RNN ?",
      options: [
        {
          text: "Recurrent Neural Network pour traiter des séquences",
          isCorrect: true,
        },
        { text: "Random Neural Network", isCorrect: false },
        { text: "Recursive Neural Network", isCorrect: false },
        { text: "Radial Neural Network", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Les RNN ont des connexions récurrentes qui permettent de traiter des données séquentielles.",
    },
    {
      text: "Qu'est-ce que le gradient vanishing ?",
      options: [
        {
          text: "Quand les gradients deviennent très petits dans les couches profondes",
          isCorrect: true,
        },
        { text: "Quand le modèle converge trop vite", isCorrect: false },
        { text: "Quand les poids deviennent nuls", isCorrect: false },
        { text: "Quand l'erreur augmente", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "Le gradient vanishing rend l'entraînement des couches profondes très lent ou impossible.",
    },
    {
      text: "Qu'est-ce qu'un autoencoder ?",
      options: [
        {
          text: "Un réseau qui apprend à reconstruire ses entrées",
          isCorrect: true,
        },
        { text: "Un algorithme de classification", isCorrect: false },
        { text: "Une technique d'optimisation", isCorrect: false },
        { text: "Un type de fonction d'activation", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "Un autoencoder compresse puis décompresse les données, apprenant une représentation efficace.",
    },
    {
      text: "Qu'est-ce que l'attention mechanism ?",
      options: [
        {
          text: "Un mécanisme qui permet de pondérer l'importance des éléments",
          isCorrect: true,
        },
        { text: "Une fonction d'activation", isCorrect: false },
        { text: "Un algorithme d'optimisation", isCorrect: false },
        { text: "Une technique de régularisation", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "L'attention permet au modèle de se concentrer sur les parties pertinentes de l'entrée.",
    },
    {
      text: "Qu'est-ce qu'un GAN ?",
      options: [
        { text: "Generative Adversarial Network", isCorrect: true },
        { text: "Global Attention Network", isCorrect: false },
        { text: "Gradient Acceleration Network", isCorrect: false },
        { text: "Graph Analysis Network", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "Un GAN utilise deux réseaux en compétition : un générateur et un discriminateur.",
    },
  ],

  computer_vision: [
    {
      text: "Qu'est-ce qu'une convolution en traitement d'image ?",
      options: [
        {
          text: "Une opération qui applique un filtre sur une image",
          isCorrect: true,
        },
        { text: "Une technique de compression", isCorrect: false },
        { text: "Un algorithme de segmentation", isCorrect: false },
        { text: "Une méthode de détection de contours", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "La convolution applique un noyau (kernel) sur l'image pour extraire des caractéristiques.",
    },
    {
      text: "Qu'est-ce que la détection d'objets ?",
      options: [
        {
          text: "Localiser et classifier des objets dans une image",
          isCorrect: true,
        },
        { text: "Classifier une image entière", isCorrect: false },
        { text: "Segmenter une image en régions", isCorrect: false },
        { text: "Améliorer la qualité d'une image", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "La détection d'objets combine localisation (où) et classification (quoi) des objets.",
    },
    {
      text: "Qu'est-ce que YOLO ?",
      options: [
        {
          text: "You Only Look Once - un algorithme de détection d'objets",
          isCorrect: true,
        },
        { text: "Un type de réseau de neurones", isCorrect: false },
        { text: "Une technique de segmentation", isCorrect: false },
        { text: "Un format d'image", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "YOLO est un algorithme de détection d'objets en temps réel qui traite l'image en une seule passe.",
    },
    {
      text: "Qu'est-ce que la segmentation sémantique ?",
      options: [
        { text: "Classifier chaque pixel d'une image", isCorrect: true },
        { text: "Détecter les contours", isCorrect: false },
        { text: "Réduire le bruit", isCorrect: false },
        { text: "Compresser l'image", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "La segmentation sémantique assigne une classe à chaque pixel de l'image.",
    },
    {
      text: "Qu'est-ce que l'augmentation de données ?",
      options: [
        {
          text: "Créer de nouvelles données en transformant les existantes",
          isCorrect: true,
        },
        { text: "Collecter plus de données", isCorrect: false },
        { text: "Nettoyer les données", isCorrect: false },
        { text: "Compresser les données", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "L'augmentation applique des transformations (rotation, zoom, etc.) pour enrichir le dataset.",
    },
    {
      text: "Qu'est-ce que le pooling dans un CNN ?",
      options: [
        {
          text: "Réduire la taille spatiale des feature maps",
          isCorrect: true,
        },
        { text: "Augmenter le nombre de filtres", isCorrect: false },
        { text: "Normaliser les activations", isCorrect: false },
        { text: "Ajouter de la non-linéarité", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Le pooling (max, average) réduit la dimensionnalité tout en préservant l'information importante.",
    },
    {
      text: "Qu'est-ce que R-CNN ?",
      options: [
        { text: "Region-based Convolutional Neural Network", isCorrect: true },
        { text: "Recursive CNN", isCorrect: false },
        { text: "Residual CNN", isCorrect: false },
        { text: "Recurrent CNN", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "R-CNN utilise des propositions de régions pour la détection d'objets.",
    },
    {
      text: "Qu'est-ce que la segmentation d'instance ?",
      options: [
        {
          text: "Séparer chaque instance d'objet individuellement",
          isCorrect: true,
        },
        { text: "Classifier les pixels par catégorie", isCorrect: false },
        { text: "Détecter les contours", isCorrect: false },
        { text: "Réduire la résolution", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "La segmentation d'instance distingue chaque objet individuel, même de la même classe.",
    },
    {
      text: "Qu'est-ce que l'IoU (Intersection over Union) ?",
      options: [
        {
          text: "Une métrique pour évaluer la qualité des bounding boxes",
          isCorrect: true,
        },
        { text: "Un algorithme de détection", isCorrect: false },
        { text: "Une fonction de perte", isCorrect: false },
        { text: "Une technique d'augmentation", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "IoU mesure le chevauchement entre la prédiction et la vérité terrain.",
    },
    {
      text: "Qu'est-ce que le style transfer ?",
      options: [
        { text: "Appliquer le style d'une image à une autre", isCorrect: true },
        { text: "Transférer des objets entre images", isCorrect: false },
        { text: "Changer la résolution", isCorrect: false },
        { text: "Modifier les couleurs", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "Le style transfer combine le contenu d'une image avec le style artistique d'une autre.",
    },
  ],

  nlp: [
    {
      text: "Qu'est-ce que la tokenisation ?",
      options: [
        {
          text: "Diviser un texte en unités plus petites (mots, sous-mots)",
          isCorrect: true,
        },
        { text: "Traduire un texte", isCorrect: false },
        { text: "Analyser la grammaire", isCorrect: false },
        { text: "Extraire les entités nommées", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "La tokenisation découpe le texte en tokens (mots, sous-mots, caractères) pour le traitement.",
    },
    {
      text: "Qu'est-ce qu'un word embedding ?",
      options: [
        {
          text: "Une représentation vectorielle dense des mots",
          isCorrect: true,
        },
        { text: "Un dictionnaire de mots", isCorrect: false },
        { text: "Une technique de traduction", isCorrect: false },
        { text: "Un algorithme de parsing", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "Les word embeddings représentent les mots dans un espace vectoriel dense où la similarité sémantique est préservée.",
    },
    {
      text: "Qu'est-ce que l'attention dans les transformers ?",
      options: [
        {
          text: "Un mécanisme qui permet de pondérer l'importance des mots",
          isCorrect: true,
        },
        { text: "Une technique de régularisation", isCorrect: false },
        { text: "Un type de couche de neurones", isCorrect: false },
        { text: "Une méthode d'optimisation", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "L'attention permet au modèle de se concentrer sur les parties pertinentes de la séquence d'entrée.",
    },
    {
      text: "Qu'est-ce que BERT ?",
      options: [
        {
          text: "Bidirectional Encoder Representations from Transformers",
          isCorrect: true,
        },
        { text: "Basic Embedding Representation Technique", isCorrect: false },
        { text: "Binary Encoded Recurrent Transformer", isCorrect: false },
        { text: "Balanced Entity Recognition Tool", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "BERT est un modèle de langage bidirectionnel basé sur l'architecture Transformer.",
    },
    {
      text: "Qu'est-ce que le fine-tuning en NLP ?",
      options: [
        {
          text: "Adapter un modèle pré-entraîné à une tâche spécifique",
          isCorrect: true,
        },
        { text: "Optimiser les hyperparamètres", isCorrect: false },
        { text: "Nettoyer les données textuelles", isCorrect: false },
        { text: "Augmenter la taille du vocabulaire", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Le fine-tuning ajuste les poids d'un modèle pré-entraîné pour une tâche particulière.",
    },
    {
      text: "Qu'est-ce que TF-IDF ?",
      options: [
        { text: "Term Frequency-Inverse Document Frequency", isCorrect: true },
        { text: "Text Filtering-Information Detection", isCorrect: false },
        { text: "Token Frequency-Index Distribution", isCorrect: false },
        { text: "Text Feature-Input Data Format", isCorrect: false },
      ],
      difficulty: "basic",
      explanation:
        "TF-IDF mesure l'importance d'un terme dans un document par rapport à une collection de documents.",
    },
    {
      text: "Qu'est-ce que la reconnaissance d'entités nommées (NER) ?",
      options: [
        {
          text: "Identifier et classifier les entités dans un texte",
          isCorrect: true,
        },
        { text: "Traduire les noms propres", isCorrect: false },
        { text: "Corriger l'orthographe", isCorrect: false },
        { text: "Analyser la syntaxe", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "NER identifie les personnes, lieux, organisations, etc. dans un texte.",
    },
    {
      text: "Qu'est-ce qu'un modèle de langage ?",
      options: [
        {
          text: "Un modèle qui prédit la probabilité des séquences de mots",
          isCorrect: true,
        },
        { text: "Un dictionnaire multilingue", isCorrect: false },
        { text: "Un correcteur orthographique", isCorrect: false },
        { text: "Un analyseur syntaxique", isCorrect: false },
      ],
      difficulty: "intermediate",
      explanation:
        "Un modèle de langage estime la probabilité d'occurrence des séquences de mots.",
    },
    {
      text: "Qu'est-ce que GPT ?",
      options: [
        { text: "Generative Pre-trained Transformer", isCorrect: true },
        { text: "General Purpose Text processor", isCorrect: false },
        { text: "Gradient Processing Technique", isCorrect: false },
        { text: "Graph Pattern Transformer", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "GPT est un modèle génératif basé sur l'architecture Transformer, pré-entraîné sur de grandes quantités de texte.",
    },
    {
      text: "Qu'est-ce que le BLEU score ?",
      options: [
        {
          text: "Une métrique pour évaluer la qualité des traductions",
          isCorrect: true,
        },
        { text: "Un algorithme de clustering", isCorrect: false },
        { text: "Une technique d'embedding", isCorrect: false },
        { text: "Un modèle de classification", isCorrect: false },
      ],
      difficulty: "advanced",
      explanation:
        "BLEU (Bilingual Evaluation Understudy) compare les n-grammes entre traduction automatique et référence.",
    },
  ],
};

// Configuration pour le nombre de questions par évaluation/quiz
export const QUESTION_CONFIGS = {
  assessment: {
    questionsPerCategory: 5,
    timePerQuestion: 60, // secondes
    passingScore: 60,
  },
  quiz: {
    questionsPerModule: 10,
    timeLimit: 1800, // 30 minutes
    passingScore: 70,
  },
};
