import { motion } from "framer-motion";
import { Pill } from "lucide-react";

const AnimatedPill = ({ delay = 0, x = 0, y = 0, color = "#ff6b9d" }) => (
  <motion.div
    className="absolute"
    style={{ left: `${x}%`, top: `${y}%` }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 360],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 3,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut",
    }}
  >
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full"
      style={{ backgroundColor: color }}
    >
      <Pill className="h-5 w-5 text-white" />
    </div>
  </motion.div>
);
