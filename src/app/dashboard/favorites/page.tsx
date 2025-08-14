import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { NavBar } from "~/components/navbar";
import { FavoriteButton } from "~/components/favorite-button";
import { LegalFooter } from "~/components/legal-footer";
import { Heart, Pill, Euro, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { auth } from "~/lib/auth";
import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { Decimal } from "@prisma/client/runtime/library";

interface FavoriteWithDrug {
  id: number;
  drug: {
    id: string;
    activeSubstance: string;
    brandName: string;
    pack: string;
    holder: string | null;
    priceHistory: {
      id: number;
      drugId: string;
      date: Date;
      ssnReferencePrice: Decimal;
      publicPrice: Decimal | null;
    }[];
  };
}

async function getFavorites(userId: string) {
  const favorites = await db.favorite.findMany({
    where: { userId },
    include: {
      drug: {
        include: {
          priceHistory: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  // Convert date strings back to Date objects if needed (for Redis caching)
  return favorites.map((favorite) => ({
    ...favorite,
    drug: {
      ...favorite.drug,
      priceHistory: favorite.drug.priceHistory.map((price) => ({
        ...price,
        date: price.date instanceof Date ? price.date : new Date(price.date),
      })),
    },
  }));
}

function FavoriteCard({ favorite }: { favorite: FavoriteWithDrug }) {
  const latestPrice = favorite.drug.priceHistory[0];

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066cc]/10">
              <Pill className="h-4 w-4 text-[#0066cc]" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {favorite.drug.brandName}
              </CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                AIC: {favorite.drug.id}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {latestPrice && (
              <div className="text-right">
                <div className="flex items-center gap-1 text-lg font-semibold text-[#0066cc]">
                  <Euro className="h-4 w-4" />€
                  {Number(latestPrice.ssnReferencePrice).toString()}
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {latestPrice.date.toLocaleDateString("it-IT")}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Principio Attivo
            </p>
            <p className="text-sm">{favorite.drug.activeSubstance}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Confezione
            </p>
            <p className="text-sm">{favorite.drug.pack}</p>
          </div>
          {favorite.drug.holder && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Titolare AIC
              </p>
              <p className="text-sm">{favorite.drug.holder}</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex gap-2 border-t pt-4">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/drugs/${favorite.drug.id}`}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Visualizza grafico
            </Link>
          </Button>
          <FavoriteButton
            drugId={favorite.drug.id}
            initialIsFavorite={true}
            variant="outline"
            size="sm"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function FavoritesPage() {
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  if (!session) {
    redirect("/auth/login");
  }

  const favorites = await getFavorites(session.user.id);

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">I Miei Farmaci Preferiti</h1>
          <p className="text-muted-foreground">
            Monitora i farmaci di tuo interesse e il loro andamento di prezzo
          </p>
        </div>

        {favorites.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <Heart className="text-muted-foreground h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Nessun farmaco preferito
              </h3>
              <p className="text-muted-foreground mb-4">
                Inizia aggiungendo farmaci ai tuoi preferiti per monitorarne
                l&apos;andamento.
              </p>
              <Link href="/drugs">
                <Button className="bg-[#0066cc] hover:bg-[#0066cc]/90">
                  Cerca farmaci
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-muted-foreground text-sm">
                {favorites.length} farmaco{favorites.length !== 1 ? "i" : ""}{" "}
                preferito{favorites.length !== 1 ? "i" : ""}
              </p>
              <Link href="/drugs">
                <Button variant="outline">Aggiungi altri farmaci</Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {favorites.map((favorite) => (
                <FavoriteCard key={favorite.id} favorite={favorite} />
              ))}
            </div>
          </>
        )}
      </main>
      
      <LegalFooter />
    </div>
  );
}
