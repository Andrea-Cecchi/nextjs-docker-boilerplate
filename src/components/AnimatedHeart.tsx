import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const AnimatedHeart = ({ delay = 0, x = 0, y = 0 }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.7, 1, 0.7],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  >
    <Heart className="h-6 w-6 fill-pink-500 text-pink-500" />
  </motion.div>
);
