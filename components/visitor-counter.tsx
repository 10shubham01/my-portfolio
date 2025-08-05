"use client";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useState, useEffect } from "react";
import { FaUsers, FaEye, FaHeart, FaStar } from "react-icons/fa";

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(1247);
  const [pageViews, setPageViews] = useState(3421);
  const [likes, setLikes] = useState(89);
  const [rating, setRating] = useState(4.8);
  const [isVisible, setIsVisible] = useState(false);

  const count = useMotionValue(0);
  const roundedCount = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    // Show counter after 2 seconds
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Animate visitor count
      const animation = animate(count, visitorCount, { duration: 2 });
      return animation.stop;
    }
  }, [isVisible, visitorCount, count]);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 3) + 1);
      setPageViews(prev => prev + Math.floor(Math.random() * 5) + 2);
      if (Math.random() > 0.7) {
        setLikes(prev => prev + 1);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: <FaUsers className="text-blue-400" />,
      label: "Visitors",
      value: visitorCount,
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <FaEye className="text-green-400" />,
      label: "Page Views",
      value: pageViews,
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaHeart className="text-red-400" />,
      label: "Likes",
      value: likes,
      color: "from-red-500 to-red-600"
    },
    {
      icon: <FaStar className="text-yellow-400" />,
      label: "Rating",
      value: rating,
      color: "from-yellow-500 to-yellow-600",
      isDecimal: true
    }
  ];

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40"
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
    >
      <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-gray-700">
        <div className="text-center mb-3">
          <h3 className="text-sm font-semibold text-gray-300 mb-1">Live Stats</h3>
          <div className="w-full h-1 bg-gray-700 rounded-full">
            <motion.div
              className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, delay: 0.5 }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-1">
                {stat.icon}
              </div>
              <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
              <motion.div
                className={`text-lg font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                key={stat.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {stat.isDecimal ? stat.value : stat.value.toLocaleString()}
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-3 pt-3 border-t border-gray-700 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-xs text-gray-400 mb-1">Today's Visitors</div>
          <motion.div
            className="text-lg font-bold text-blue-400"
            key={visitorCount}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {visitorCount.toLocaleString()}
          </motion.div>
        </motion.div>

        {/* Pulse indicator */}
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

export default VisitorCounter; 