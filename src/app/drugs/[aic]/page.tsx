import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { NavBar } from "~/components/navbar";
import {
  Pill,
  Euro,
  Calendar,
  TrendingUp,
  Building2,
  Package,
} from "lucide-react";
import { db } from "~/server/db";
import { PriceChart } from "~/components/price-chart";
import { BackButton } from "~/components/BackButton";
import { FavoriteButton } from "~/components/favorite-button";
import { LegalFooter } from "~/components/legal-footer";
import { auth } from "~/lib/auth";

interface DrugDetailProps {
  params: Promise<{
    aic: string;
  }>;
}

async function getDrugDetail(aic: string) {
  const drug = await db.drug.findUnique({
    where: { id: aic },
    include: {
      priceHistory: {
        orderBy: { date: "desc" },
      },
    },
  });

  if (!drug) return null;

  // Converte le date da stringhe a oggetti Date se necessario (per Redis caching)
  const drugWithDates = {
    ...drug,
    priceHistory: drug.priceHistory.map((price) => ({
      ...price,
      date: price.date instanceof Date ? price.date : new Date(price.date),
    })),
  };

  return drugWithDates;
}

// type DrugWithHistory = NonNullable<Awaited<ReturnType<typeof getDrugDetail>>>;

function DrugDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb skeleton */}
      <div className="bg-muted h-4 w-32 animate-pulse rounded" />

      {/* Header skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="animate-pulse lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-muted h-12 w-12 rounded-xl" />
                <div className="space-y-2">
                  <div className="bg-muted h-6 w-48 rounded" />
                  <div className="bg-muted h-4 w-32 rounded" />
                </div>
              </div>
              <div className="bg-muted h-8 w-24 rounded" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="bg-muted h-4 w-24 rounded" />
                <div className="bg-muted h-4 w-32 rounded" />
              </div>
              <div className="space-y-2">
                <div className="bg-muted h-4 w-20 rounded" />
                <div className="bg-muted h-4 w-36 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-pulse">
          <CardHeader>
            <div className="bg-muted h-5 w-32 rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="bg-muted h-8 w-20 rounded" />
              <div className="bg-muted h-4 w-28 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart skeleton */}
      <Card className="animate-pulse">
        <CardHeader>
          <div className="bg-muted h-5 w-48 rounded" />
          <div className="bg-muted h-4 w-64 rounded" />
        </CardHeader>
        <CardContent>
          <div className="bg-muted h-80 rounded" />
        </CardContent>
      </Card>
    </div>
  );
}

async function DrugDetailContent({ aic }: { aic: string }) {
  const drug = await getDrugDetail(aic);

  if (!drug) {
    notFound();
  }

  // Type assertion after null check
  const drugData = drug;

  // Check if this drug is in user's favorites
  const session = await auth.api.getSession({
    headers: await import("next/headers").then((mod) => mod.headers()),
  });

  let isFavorited = false;
  if (session?.user) {
    const favorite = await db.favorite.findUnique({
      where: {
        userId_drugId: {
          userId: session.user.id,
          drugId: aic,
        },
      },
    });
    isFavorited = !!favorite;
  }

  const latestPrice = drugData.priceHistory[0];
  const previousPrice = drugData.priceHistory[1];
  const priceChange =
    latestPrice && previousPrice
      ? Number(latestPrice.ssnReferencePrice) -
        Number(previousPrice.ssnReferencePrice)
      : null;

  // Prepara i dati per il grafico
  type PricePoint = {
    date: string;
    ssnReferencePrice: number;
    publicPrice?: number;
    rawDate: Date;
  };

  const chartData: PricePoint[] = drugData.priceHistory
    .map((item) => ({
      ...item,
      date: item.date instanceof Date ? item.date : new Date(item.date),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map((item) => ({
      date: item.date.toISOString().split("T")[0] as string,
      ssnReferencePrice: Number(item.ssnReferencePrice),
      publicPrice: item.publicPrice ? Number(item.publicPrice) : undefined,
      rawDate: item.date,
    }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[#0066cc]/10">
            <Pill className="h-6 w-6 text-[#0066cc]" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold">{drugData.brandName}</h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {drugData.activeSubstance}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="outline">AIC: {drugData.id}</Badge>
              {latestPrice && (
                <Badge
                  variant="secondary"
                  className="bg-[#0066cc]/10 text-[#0066cc]"
                >
                  <Euro className="mr-1 h-3 w-3" />€
                  {latestPrice.ssnReferencePrice.toString()}
                </Badge>
              )}
              <FavoriteButton
                drugId={drugData.id}
                initialIsFavorite={isFavorited}
                variant="outline"
                size="sm"
                showText={true}
                className="ml-auto"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Informazioni Farmaco */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Informazioni Farmaco
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Principio Attivo
              </p>
              <p className="text-sm">{drugData.activeSubstance}</p>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Confezione
              </p>
              <p className="text-sm">{drugData.pack}</p>
            </div>
            <Separator />
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Confezione di Riferimento
              </p>
              <p className="text-sm">{drugData.referencePackage}</p>
            </div>
            {drugData.atc && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Codice ATC
                  </p>
                  <p className="font-mono text-sm text-xs">{drugData.atc}</p>
                </div>
              </>
            )}
            {drugData.holder && (
              <>
                <Separator />
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Building2 className="text-muted-foreground h-4 w-4" />
                    <p className="text-muted-foreground text-sm font-medium">
                      Titolare AIC
                    </p>
                  </div>
                  <p className="text-sm">{drugData.holder}</p>
                </div>
              </>
            )}
            {drugData.equivalenceGroupCode && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Gruppo Equivalenza
                  </p>
                  <p className="font-mono text-sm text-xs">
                    {drugData.equivalenceGroupCode}
                  </p>
                </div>
              </>
            )}
            {drugData.note && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Note
                  </p>
                  <p className="text-sm">{drugData.note}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Prezzo Attuale */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prezzo di Riferimento
            </CardTitle>
            <CardDescription>
              Prezzo SSN più recente disponibile
            </CardDescription>
          </CardHeader>
          <CardContent>
            {latestPrice ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="mb-2 text-3xl font-bold text-[#0066cc]">
                    €{latestPrice.ssnReferencePrice.toString()}
                  </div>
                  <div className="text-muted-foreground flex items-center justify-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    Aggiornato il {latestPrice.date.toLocaleDateString("it-IT")}
                  </div>
                </div>

                {priceChange !== null && (
                  <div className="border-t pt-4 text-center">
                    <div
                      className={`text-sm ${priceChange > 0 ? "text-red-600" : priceChange < 0 ? "text-green-600" : "text-muted-foreground"}`}
                    >
                      {priceChange > 0 && "+"}€{priceChange.toFixed(2)} vs
                      precedente
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Nessun prezzo disponibile
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informazioni Prezzi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Euro className="h-5 w-5" />
              Informazioni Prezzi
            </CardTitle>
            <CardDescription>Prezzi SSN e pubblico</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {drugData.ssnReferencePrice && (
              <div>
                <p className="text-muted-foreground text-sm font-medium">
                  Prezzo Riferimento SSN
                </p>
                <p className="font-mono text-sm">
                  €{drugData.ssnReferencePrice.toString()}
                </p>
              </div>
            )}
            {drugData.publicPrice && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Prezzo Pubblico
                  </p>
                  <p className="font-mono text-sm">
                    €{drugData.publicPrice.toString()}
                  </p>
                </div>
              </>
            )}
            {drugData.priceDifference && (
              <>
                <Separator />
                <div>
                  <p className="text-muted-foreground text-sm font-medium">
                    Differenza
                  </p>
                  <p
                    className={`font-mono text-sm ${Number(drugData.priceDifference) > 0 ? "text-red-600" : Number(drugData.priceDifference) < 0 ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    {Number(drugData.priceDifference) > 0 ? "+" : ""}€
                    {drugData.priceDifference.toString()}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grafico Storico */}
      {chartData.length > 1 && <PriceChart data={chartData} />}

      {/* Storico Prezzi */}
      {/*drugData.priceHistory.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Storico Prezzi</CardTitle>
            <CardDescription>
              Ultimi {drugData.priceHistory.length} aggiornamenti di prezzo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {drugData.priceHistory.slice(0, 10).map((price, index) => (
                <div key={price.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-[#0066cc]' : 'bg-muted'}`} />
                    <span className="text-sm">
                      {price.date.toLocaleDateString("it-IT")}
                    </span>
                  </div>
                  <div className="font-mono text-sm">
                    €{price.ssnReferencePrice.toString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )*/}
    </div>
  );
}

export default async function DrugDetailPage({ params }: DrugDetailProps) {
  const { aic } = await params;

  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-br">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <BackButton />
        </div>

        <Suspense fallback={<DrugDetailSkeleton />}>
          <DrugDetailContent aic={aic} />
        </Suspense>
      </main>
      
      <LegalFooter />
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: DrugDetailProps) {
  const { aic } = await params;
  const drug = await getDrugDetail(aic);

  if (!drug) {
    return {
      title: "Farmaco non trovato - FarMix",
    };
  }

  return {
    title: `${drug.brandName} - ${drug.activeSubstance} | FarMix`,
    description: `Dettagli del farmaco ${drug.brandName} con principio attivo ${drug.activeSubstance}. Prezzo di riferimento SSN e storico aggiornamenti.`,
  };
}
