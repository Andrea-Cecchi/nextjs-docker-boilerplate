import { Suspense } from "react";
import Link from "next/link";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Search } from "lucide-react";
import { db } from "~/server/db";
import { auth } from "~/lib/auth";
import { DrugCard } from "~/components/drug-card";
import { DrugsLoadingSkeleton } from "~/components/drugs-loading-skeleton";
import type { SearchParams } from "~/types/drugs";

async function getDrugs(searchParams: SearchParams, userId?: string) {
  const q = searchParams.q ?? "";
  const page = parseInt(searchParams.page ?? "1");
  const limit = 20;
  const skip = (page - 1) * limit;

  // Build where condition with all filters
  const whereConditions: object[] = [];

  // General search
  if (q) {
    whereConditions.push({
      OR: [
        { brandName: { contains: q, mode: "insensitive" as const } },
        { activeSubstance: { contains: q, mode: "insensitive" as const } },
        { id: { contains: q, mode: "insensitive" as const } },
      ],
    });
  }

  // Specific filters
  if (searchParams.activeSubstance) {
    whereConditions.push({
      activeSubstance: {
        contains: searchParams.activeSubstance,
        mode: "insensitive" as const,
      },
    });
  }

  if (searchParams.atc) {
    whereConditions.push({
      atc: { contains: searchParams.atc, mode: "insensitive" as const },
    });
  }

  if (searchParams.holder) {
    whereConditions.push({
      holder: { contains: searchParams.holder, mode: "insensitive" as const },
    });
  }

  if (searchParams.note) {
    whereConditions.push({
      note: { contains: searchParams.note, mode: "insensitive" as const },
    });
  }

  if (searchParams.equivalenceGroup) {
    whereConditions.push({
      equivalenceGroupCode: {
        contains: searchParams.equivalenceGroup,
        mode: "insensitive" as const,
      },
    });
  }

  // Price range filter
  if (searchParams.minPrice ?? searchParams.maxPrice) {
    const priceFilter: { gte?: number; lte?: number } = {};

    if (searchParams.minPrice) {
      priceFilter.gte = parseFloat(searchParams.minPrice);
    }

    if (searchParams.maxPrice) {
      priceFilter.lte = parseFloat(searchParams.maxPrice);
    }

    whereConditions.push({
      ssnReferencePrice: priceFilter,
    } as const);
  }

  const whereCondition =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  // Build orderBy clause
  let orderBy: any = { brandName: "asc" }; // default

  if (
    searchParams.sortBy &&
    searchParams.sortOrder &&
    searchParams.sortBy !== ""
  ) {
    const { sortBy, sortOrder } = searchParams;

    switch (sortBy) {
      case "brandName":
      case "activeSubstance":
        orderBy = { [sortBy]: sortOrder };
        break;
      case "ssnReferencePrice":
      case "publicPrice":
        orderBy = { [sortBy]: sortOrder };
        break;
      case "priceDifference":
        // Per la differenza prezzo, ordiniamo per prezzo pubblico come fallback
        // e poi riordiniamo in memoria per la differenza
        orderBy = { publicPrice: sortOrder };
        break;
      default:
        orderBy = { brandName: "asc" };
    }
  }

  const [drugs, total] = await Promise.all([
    db.drug.findMany({
      where: whereCondition,
      include: {
        priceHistory: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      skip,
      take: limit,
      orderBy,
    }),
    db.drug.count({ where: whereCondition }),
  ]);

  // Riordina per differenza prezzo se necessario
  let sortedDrugs = drugs;
  if (searchParams.sortBy === "priceDifference" && searchParams.sortOrder) {
    sortedDrugs = [...drugs].sort((a, b) => {
      const diffA =
        (Number(a.publicPrice) || 0) - (Number(a.ssnReferencePrice) || 0);
      const diffB =
        (Number(b.publicPrice) || 0) - (Number(b.ssnReferencePrice) || 0);

      return searchParams.sortOrder === "desc" ? diffB - diffA : diffA - diffB;
    });
  }

  // Converte le date da stringhe a oggetti Date se necessario (per Redis caching)
  const drugsWithDates = sortedDrugs.map((drug) => ({
    ...drug,
    priceHistory: drug.priceHistory.map((price) => ({
      ...price,
      date: price.date instanceof Date ? price.date : new Date(price.date),
    })),
  }));

  // Get user's favorites if userId is provided
  let userFavorites = new Set<string>();
  if (userId) {
    const favorites = await db.favorite.findMany({
      where: { userId },
      select: { drugId: true },
    });
    userFavorites = new Set(favorites.map((f) => f.drugId));
  }

  // Add isFavorited property to each drug
  const drugsWithFavorites = drugsWithDates.map((drug) => ({
    ...drug,
    isFavorited: userFavorites.has(drug.id),
  }));

  return {
    drugs: drugsWithFavorites,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

interface DrugsContentProps {
  searchParams: SearchParams;
}

export async function DrugsContent({ searchParams }: DrugsContentProps) {
  // Get current user session
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  const { drugs, total, page, totalPages } = await getDrugs(
    searchParams,
    session?.user?.id,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {total > 0 ? `${total} farmaci trovati` : "Nessun farmaco trovato"}
        </p>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">
              Pagina {page} di {totalPages}
            </span>
          </div>
        )}
      </div>

      {drugs.length === 0 ? (
        <Card className="p-8 text-center">
          <CardContent>
            <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Search className="text-muted-foreground h-8 w-8" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              Nessun farmaco trovato
            </h3>
            <p className="text-muted-foreground">
              Prova a modificare i termini di ricerca o a utilizzare criteri
              meno specifici.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {drugs.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" asChild>
              <Link
                href={`/drugs?${new URLSearchParams({
                  ...(searchParams.q && { q: searchParams.q }),
                  ...(searchParams.activeSubstance && {
                    activeSubstance: searchParams.activeSubstance,
                  }),
                  ...(searchParams.atc && { atc: searchParams.atc }),
                  ...(searchParams.holder && { holder: searchParams.holder }),
                  ...(searchParams.minPrice && {
                    minPrice: searchParams.minPrice,
                  }),
                  ...(searchParams.maxPrice && {
                    maxPrice: searchParams.maxPrice,
                  }),
                  ...(searchParams.note && { note: searchParams.note }),
                  ...(searchParams.equivalenceGroup && {
                    equivalenceGroup: searchParams.equivalenceGroup,
                  }),
                  page: (page - 1).toString(),
                }).toString()}`}
              >
                Precedente
              </Link>
            </Button>
          )}
          {page < totalPages && (
            <Button variant="outline" asChild>
              <Link
                href={`/drugs?${new URLSearchParams({
                  ...(searchParams.q && { q: searchParams.q }),
                  ...(searchParams.activeSubstance && {
                    activeSubstance: searchParams.activeSubstance,
                  }),
                  ...(searchParams.atc && { atc: searchParams.atc }),
                  ...(searchParams.holder && { holder: searchParams.holder }),
                  ...(searchParams.minPrice && {
                    minPrice: searchParams.minPrice,
                  }),
                  ...(searchParams.maxPrice && {
                    maxPrice: searchParams.maxPrice,
                  }),
                  ...(searchParams.note && { note: searchParams.note }),
                  ...(searchParams.equivalenceGroup && {
                    equivalenceGroup: searchParams.equivalenceGroup,
                  }),
                  page: (page + 1).toString(),
                }).toString()}`}
              >
                Successiva
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

interface DrugsListProps {
  searchParams: SearchParams;
}

export function DrugsList({ searchParams }: DrugsListProps) {
  return (
    <Suspense fallback={<DrugsLoadingSkeleton key={searchParams.toString()} />}>
      <DrugsContent searchParams={searchParams} />
    </Suspense>
  );
}
