import { PrismaClient } from "@prisma/client";
import Prisma from "prisma";
import { env } from "~/env";
import Redis from "ioredis";
import createPrismaRedisCache from "prisma-redis-extension";

// Funzione per creare una connessione Redis con retry e gestione errori
const createRedisClient = () => {
  const redis = new Redis({
    host: "redis",
    port: 6379,
    lazyConnect: true, // Non connettersi immediatamente
  }) as any;

  // Gestione errori di connessione
  redis.on('error', (err: Error) => {
    console.log('Redis connection error:', err.message);
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected');
  });

  return redis;
};

// Inizializza Redis solo se non siamo in fase di build
let redis: any;
let cacheextension: any;

// Disabilita Redis durante il build
const isBuildProcess = process.env.NODE_ENV === 'production' && process.argv.includes('build');

if (!isBuildProcess) {
  try {
    redis = createRedisClient();
    
    cacheextension = createPrismaRedisCache({
      models: [
        { model: "PriceHistory", cacheTime: 86400 }, // 24 ore - i prezzi storici non cambiano
        // Drug temporaneamente escluso per debug
        // Favorite escluso dalla cache - sempre fresh
      ],
      storage: {
        type: "redis",
        options: {
          client: redis,
          invalidation: { referencesTTL: 86400 },
          log: console,
        },
      },
      cacheTime: 3600, // Default 1 ora
      excludeModels: [
        "Favorite",
        "Drug",
        "User",
        "Session",
        "Account",
        "Verification",
      ], // Drug temporaneamente escluso
      excludeMethods: ["count", "groupBy"],
      onHit: (key: any) => {
        console.log("✅ Cache HIT:", key);
      },
      onMiss: (key: any) => {
        console.log("❌ Cache MISS:", key);
      },
      onError: (key: any) => {
        console.log("💥 Cache ERROR:", key);
      },
    });
  } catch (error) {
    console.log('Redis not available, continuing without cache:', error);
    // Fallback senza cache
    cacheextension = {};
  }
}

const createPrismaClient = () => {
  const client = new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
  
  // Applica l'estensione cache solo se disponibile
  if (cacheextension && Object.keys(cacheextension).length > 0) {
    return client.$extends(cacheextension);
  }
  
  return client;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();
export const redisClient = redis;

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
