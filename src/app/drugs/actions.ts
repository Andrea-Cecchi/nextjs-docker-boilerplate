"use server";

import { db } from "~/server/db";

export async function getActiveSubstances(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const results = await db.drug.findMany({
      where: {
        activeSubstance: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        activeSubstance: true,
      },
      distinct: ["activeSubstance"],
      take: 10,
      orderBy: {
        activeSubstance: "asc",
      },
    });

    return results.map((drug) => drug.activeSubstance);
  } catch (error) {
    console.error("Error fetching active substances:", error);
    return [];
  }
}

export async function getAtcCodes(query: string) {
  if (!query || query.length < 1) return [];

  try {
    const results = await db.drug.findMany({
      where: {
        atc: {
          contains: query,
          mode: "insensitive",
        },
        NOT: {
          atc: null,
        },
      },
      select: {
        atc: true,
      },
      distinct: ["atc"],
      take: 10,
      orderBy: {
        atc: "asc",
      },
    });

    return results.map((drug) => drug.atc).filter(Boolean) as string[];
  } catch (error) {
    console.error("Error fetching ATC codes:", error);
    return [];
  }
}

export async function getHolders(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const results = await db.drug.findMany({
      where: {
        holder: {
          contains: query,
          mode: "insensitive",
        },
        NOT: {
          holder: null,
        },
      },
      select: {
        holder: true,
      },
      distinct: ["holder"],
      take: 10,
      orderBy: {
        holder: "asc",
      },
    });

    return results.map((drug) => drug.holder).filter(Boolean) as string[];
  } catch (error) {
    console.error("Error fetching holders:", error);
    return [];
  }
}

export async function getEquivalenceGroups(query: string) {
  if (!query || query.length < 1) return [];

  try {
    const results = await db.drug.findMany({
      where: {
        equivalenceGroupCode: {
          contains: query,
          mode: "insensitive",
        },
        NOT: {
          equivalenceGroupCode: null,
        },
      },
      select: {
        equivalenceGroupCode: true,
      },
      distinct: ["equivalenceGroupCode"],
      take: 10,
      orderBy: {
        equivalenceGroupCode: "asc",
      },
    });

    return results
      .map((drug) => drug.equivalenceGroupCode)
      .filter(Boolean) as string[];
  } catch (error) {
    console.error("Error fetching equivalence groups:", error);
    return [];
  }
}

export async function getGeneralSuggestions(query: string) {
  if (!query || query.length < 2) return [];

  try {
    const results = await db.drug.findMany({
      where: {
        OR: [
          {
            brandName: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            activeSubstance: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            id: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        brandName: true,
        activeSubstance: true,
        id: true,
      },
      take: 10,
      orderBy: {
        brandName: "asc",
      },
    });

    // Crea una lista di suggerimenti unici basati sui risultati
    const suggestions = new Set<string>();

    results.forEach((drug) => {
      // Aggiungi nome commerciale se contiene la query
      if (drug.brandName.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(drug.brandName);
      }

      // Aggiungi principio attivo se contiene la query
      if (drug.activeSubstance.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(drug.activeSubstance);
      }

      // Aggiungi codice AIC se contiene la query
      if (drug.id.toLowerCase().includes(query.toLowerCase())) {
        suggestions.add(drug.id);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  } catch (error) {
    console.error("Error fetching general suggestions:", error);
    return [];
  }
}
