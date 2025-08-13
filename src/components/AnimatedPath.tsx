import { motion } from "framer-motion";

const AnimatedPath = () => (
  <svg
    className="absolute top-20 right-10 h-32 w-32 opacity-30"
    viewBox="0 0 100 100"
  >
    <motion.path
      d="M10,90 Q30,10 50,50 T90,10"
      stroke="#ff6b9d"
      strokeWidth="3"
      fill="none"
      strokeDasharray="5,5"
      animate={{
        strokeDashoffset: [0, -20],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </svg>
);

export default AnimatedPath;
