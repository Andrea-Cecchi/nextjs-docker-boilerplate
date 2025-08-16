import { motion } from "motion/react";

export default function ScrollIndicator() {
    return(
        <div className="flex w-5 h-8 border-2 border-gray-500 dark:border-gray-400 rounded-full mt-auto justify-center py-1 mb-4">
            <motion.div
                animate={{ y: [0,8,0]}}
                transition={{
                    duration: 1.7,
                    
                    repeat: Infinity,
                }}
             className="w-1 h-3 bg-gray-300 rounded-full"></motion.div>
        </div>
    )
}