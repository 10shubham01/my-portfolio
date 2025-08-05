"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "./theme-provider";
import { 
  FaVuejs, 
  FaReact, 
  FaNodeJs, 
  FaDatabase, 
  FaAws, 
  FaGitAlt,
  FaCode,
  FaRocket,
  FaTrophy,
  FaPlay,
  FaRedo,
  FaHome
} from "react-icons/fa";
import { 
  SiTypescript, 
  SiJavascript, 
  SiNextdotjs, 
  SiNuxtdotjs, 
  SiTailwindcss,
  SiPostgresql,
  SiMysql,
  SiExpress,
  SiAdonisjs
} from "react-icons/si";

interface TechCard {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
}

interface GameState {
  score: number;
  timeLeft: number;
  currentRound: number;
  isPlaying: boolean;
  isGameOver: boolean;
  matchedPairs: string[];
  selectedCards: string[];
  flippedCards: string[];
}

const techCards: TechCard[] = [
  {
    id: "typescript",
    name: "TypeScript",
    icon: <SiTypescript className="text-blue-600" />,
    description: "Advanced JavaScript with static typing",
    category: "Frontend"
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: <SiJavascript className="text-yellow-400" />,
    description: "Dynamic programming language for web",
    category: "Frontend"
  },
  {
    id: "vue",
    name: "Vue.js",
    icon: <FaVuejs className="text-green-500" />,
    description: "Progressive JavaScript framework",
    category: "Frontend"
  },
  {
    id: "react",
    name: "React.js",
    icon: <FaReact className="text-blue-400" />,
    description: "Component-based UI library",
    category: "Frontend"
  },
  {
    id: "nextjs",
    name: "Next.js",
    icon: <SiNextdotjs className="text-black" />,
    description: "Full-stack React framework",
    category: "Frontend"
  },
  {
    id: "nuxtjs",
    name: "Nuxt.js",
    icon: <SiNuxtdotjs className="text-green-600" />,
    description: "Vue.js meta-framework",
    category: "Frontend"
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="text-cyan-500" />,
    description: "Utility-first CSS framework",
    category: "Frontend"
  },
  {
    id: "nodejs",
    name: "Node.js",
    icon: <FaNodeJs className="text-green-600" />,
    description: "Server-side JavaScript runtime",
    category: "Backend"
  },
  {
    id: "express",
    name: "Express.js",
    icon: <SiExpress className="text-gray-600" />,
    description: "Web application framework for Node.js",
    category: "Backend"
  },
  {
    id: "adonisjs",
    name: "AdonisJS",
    icon: <SiAdonisjs className="text-green-700" />,
    description: "Full-stack Node.js framework",
    category: "Backend"
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: <SiPostgresql className="text-blue-700" />,
    description: "Advanced open-source database",
    category: "Database"
  },
  {
    id: "mysql",
    name: "MySQL",
    icon: <SiMysql className="text-orange-500" />,
    description: "Popular relational database",
    category: "Database"
  }
];

const SkillGame = () => {
  const { themeConfig } = useTheme();
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    timeLeft: 120, // 2 minutes
    currentRound: 1,
    isPlaying: false,
    isGameOver: false,
    matchedPairs: [],
    selectedCards: [],
    flippedCards: []
  });

  const [gameCards, setGameCards] = useState<TechCard[]>([]);
  const [showInstructions, setShowInstructions] = useState(true);

  // Initialize game cards (duplicate each card for matching)
  useEffect(() => {
    const duplicatedCards = [...techCards, ...techCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: `${card.id}-${index}` }));
    setGameCards(duplicatedCards);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState.isPlaying && gameState.timeLeft > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (gameState.timeLeft === 0) {
      setGameState(prev => ({
        ...prev,
        isGameOver: true,
        isPlaying: false
      }));
    }

    return () => clearInterval(interval);
  }, [gameState.isPlaying, gameState.timeLeft]);

  const startGame = () => {
    setGameState({
      score: 0,
      timeLeft: 120,
      currentRound: 1,
      isPlaying: true,
      isGameOver: false,
      matchedPairs: [],
      selectedCards: [],
      flippedCards: []
    });
    setShowInstructions(false);
  };

  const resetGame = () => {
    const duplicatedCards = [...techCards, ...techCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ ...card, id: `${card.id}-${index}` }));
    setGameCards(duplicatedCards);
    startGame();
  };

  const handleCardClick = (cardId: string) => {
    if (!gameState.isPlaying || gameState.selectedCards.length >= 2) return;
    if (gameState.matchedPairs.includes(cardId) || gameState.selectedCards.includes(cardId)) return;

    const newSelectedCards = [...gameState.selectedCards, cardId];
    setGameState(prev => ({
      ...prev,
      selectedCards: newSelectedCards,
      flippedCards: [...prev.flippedCards, cardId]
    }));

    if (newSelectedCards.length === 2) {
      const [card1Id, card2Id] = newSelectedCards;
      const card1 = gameCards.find(card => card.id === card1Id);
      const card2 = gameCards.find(card => card.id === card2Id);

      if (card1 && card2 && card1.name === card2.name) {
        // Match found
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            matchedPairs: [...prev.matchedPairs, card1Id, card2Id],
            selectedCards: [],
            score: prev.score + 10
          }));
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            selectedCards: [],
            flippedCards: prev.flippedCards.filter(id => !newSelectedCards.includes(id))
          }));
        }, 1500);
      }
    }
  };

  const getCardDisplay = (card: TechCard) => {
    const isSelected = gameState.selectedCards.includes(card.id);
    const isMatched = gameState.matchedPairs.includes(card.id);
    const isFlipped = gameState.flippedCards.includes(card.id);

    if (isMatched) {
      return (
        <motion.div
          className="w-full h-full bg-green-500 rounded-lg flex flex-col items-center justify-center p-4 text-white"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="text-3xl mb-2">{card.icon}</div>
          <div className="text-sm font-semibold text-center">{card.name}</div>
        </motion.div>
      );
    }

    if (isFlipped) {
      return (
        <motion.div
          className="w-full h-full bg-blue-600 rounded-lg flex flex-col items-center justify-center p-4 text-white"
          initial={{ rotateY: 180 }}
          animate={{ rotateY: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-3xl mb-2">{card.icon}</div>
          <div className="text-sm font-semibold text-center">{card.name}</div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaCode className="text-4xl text-gray-500" />
      </motion.div>
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showInstructions) {
    return (
      <div className={`min-h-screen ${themeConfig.background} text-white p-8`}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            className={`w-24 h-24 bg-gradient-to-r ${themeConfig.primary} rounded-full flex items-center justify-center mx-auto mb-8`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaCode className="text-4xl text-white" />
          </motion.div>
          
          <h1 className={`text-4xl font-bold mb-6 bg-gradient-to-r ${themeConfig.primary} bg-clip-text text-transparent`}>
            Tech Stack Memory Game
          </h1>
          
          <div className="bg-gray-800 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">How to Play</h2>
            <ul className="text-left space-y-3 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">1</span>
                Match technology cards with their descriptions
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">2</span>
                You have 2 minutes to find all matches
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">3</span>
                Each match gives you 10 points
              </li>
              <li className="flex items-center gap-3">
                <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm">4</span>
                Test your knowledge of Shubham's tech stack!
              </li>
            </ul>
          </div>
          
          <motion.button
            onClick={startGame}
            className={`bg-gradient-to-r ${themeConfig.primary} text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center gap-3 mx-auto`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlay />
            Start Game
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (gameState.isGameOver) {
    const totalPossibleScore = techCards.length * 10;
    const percentage = Math.round((gameState.score / totalPossibleScore) * 100);
    
    return (
      <div className={`min-h-screen ${themeConfig.background} text-white p-8`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <motion.div
            className="w-24 h-24 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaTrophy className="text-4xl text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-4">Game Over!</h1>
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <p className="text-2xl font-bold text-blue-400 mb-2">{gameState.score}</p>
            <p className="text-gray-400 mb-4">Final Score</p>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-400">{percentage}% of possible score</p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <motion.button
              onClick={resetGame}
              className={`bg-gradient-to-r ${themeConfig.primary} text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaRedo />
              Play Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeConfig.background} text-white p-8`}>
      {/* Game Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-3xl font-bold bg-gradient-to-r ${themeConfig.primary} bg-clip-text text-transparent`}>
            Tech Stack Memory Game
          </h1>
          <div className="flex gap-4">
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-400">Score:</span>
              <span className="ml-2 font-bold text-blue-400">{gameState.score}</span>
            </div>
            <div className="bg-gray-800 px-4 py-2 rounded-lg">
              <span className="text-sm text-gray-400">Time:</span>
              <span className={`ml-2 font-bold ${gameState.timeLeft < 30 ? 'text-red-400' : 'text-green-400'}`}>
                {formatTime(gameState.timeLeft)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            className={`bg-gradient-to-r ${themeConfig.primary} h-2 rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${(gameState.matchedPairs.length / 2 / techCards.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-center text-gray-400">
          {gameState.matchedPairs.length / 2} of {techCards.length} pairs matched
        </p>
      </div>

      {/* Game Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <AnimatePresence>
            {gameCards.map((card) => (
              <motion.div
                key={card.id}
                className="aspect-square cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                onClick={() => handleCardClick(card.id)}
              >
                {getCardDisplay(card)}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Game Controls */}
      <div className="flex justify-center mt-8">
        <motion.button
          onClick={resetGame}
          className="bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaRedo />
          Reset Game
        </motion.button>
      </div>
    </div>
  );
};

export default SkillGame; 