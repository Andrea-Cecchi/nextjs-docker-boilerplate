"use client";

import { NavBar } from "~/components/navbar";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { LegalFooter } from "~/components/legal-footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <div className="relative min-h-screen overflow-hidden">
        <NavBar />

        <main className="relative z-10 container mx-auto px-4 py-16">
        <div className="mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex items-center justify-center gap-4"
          >
            <motion.h1
              className="font-bungee bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-6xl font-black text-transparent md:text-8xl"
              animate={{
                scale: [1, 1.05, 1],
                rotate: [0, 1, -1, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              La salute,
            </motion.h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 flex items-center justify-center gap-4"
          >
            <h2 className="text-5xl font-black text-gray-800 md:text-7xl">
              conta molto.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12 flex items-center justify-center gap-4"
          >
            <h3 className="text-4xl font-black text-gray-800 md:text-6xl">
              Ma anche il tuo portafoglio!
            </h3>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mb-12 max-w-3xl text-xl font-medium text-gray-600 md:text-2xl"
          >
            Cerca farmaci, confronta i prezzi e salva i tuoi preferiti.
          </motion.p>

          <Button
            asChild
            className="rounded-2xl border-2 border-black bg-white/30 p-6 text-2xl text-black backdrop-blur-sm transition-all duration-300 hover:translate-x-1 hover:bg-white/80 hover:text-black"
          >
            <Link
              href="/drugs"
              className="flex items-center justify-center gap-2"
            >
              Vai alla ricerca
              <ArrowRight className="size-6" />
            </Link>
          </Button>
        </div>
        </main>
      </div>
      
      <LegalFooter />
    </div>
  );
}
