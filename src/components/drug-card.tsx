import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Pill, Euro } from "lucide-react";
import { FavoriteButton } from "~/components/favorite-button";
import { AifaAttribution } from "~/components/aifa-attribution";
import type { DrugWithPriceHistoryAndFavorites } from "~/types/drugs";

interface DrugCardProps {
  drug: DrugWithPriceHistoryAndFavorites;
}

export function DrugCard({ drug }: DrugCardProps) {
  const latestPrice = drug.priceHistory[0];

  // Calcola la differenza di prezzo se entrambi i prezzi sono disponibili
  const priceDifference =
    drug.ssnReferencePrice && drug.publicPrice
      ? Number(drug.publicPrice) - Number(drug.ssnReferencePrice)
      : null;

  return (
    <Card className="border border-white/20 bg-white/50 shadow-xl backdrop-blur-xs transition-all duration-300 hover:bg-white/80 hover:shadow-lg dark:border-gray-700/50 dark:bg-gray-900/70 dark:hover:bg-gray-900/80">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066cc]/10">
              <Pill className="h-4 w-4 text-[#0066cc]" />
            </div>
            <div>
              <CardTitle className="text-lg">{drug.brandName}</CardTitle>
              <CardDescription className="text-muted-foreground text-sm">
                AIC: {drug.id}
              </CardDescription>
            </div>
          </div>
          {latestPrice && (
            <div className="text-right">
              <div className="flex items-center gap-1 text-lg font-semibold text-[#0066cc]">
                <Euro className="h-4 w-4" />
                {Number(latestPrice.ssnReferencePrice).toString()}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Principio Attivo
            </p>
            <p className="text-sm">{drug.activeSubstance}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Confezione
            </p>
            <p className="text-sm">{drug.pack}</p>
          </div>
          {drug.atc && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Codice ATC
              </p>
              <p className="font-mono text-sm text-xs">{drug.atc}</p>
            </div>
          )}
          {drug.holder && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Titolare AIC
              </p>
              <p className="text-sm">{drug.holder}</p>
            </div>
          )}
          {drug.ssnReferencePrice && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Prezzo SSN
              </p>
              <p className="text-sm font-semibold text-[#0066cc]">
                €{Number(drug.ssnReferencePrice).toFixed(2)}
              </p>
            </div>
          )}
          {drug.publicPrice && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Prezzo Pubblico
              </p>
              <p className="text-sm font-semibold text-[#0066cc]">
                €{Number(drug.publicPrice).toFixed(2)}
              </p>
            </div>
          )}
          {priceDifference !== null && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Differenza
              </p>
              <p
                className={`text-sm font-semibold ${priceDifference > 0 ? "text-red-600" : priceDifference < 0 ? "text-green-600" : "text-muted-foreground"}`}
              >
                {priceDifference > 0 ? "+" : ""}€{priceDifference.toFixed(2)}
              </p>
            </div>
          )}

          {drug.equivalenceGroupCode && (
            <div>
              <p className="text-muted-foreground text-sm font-medium">
                Gruppo Equivalenza
              </p>
              <p className="font-mono text-sm text-xs">
                {drug.equivalenceGroupCode}
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-4 border-t pt-3">
          <AifaAttribution variant="compact" className="mb-3" />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" asChild>
            <Link href={`/drugs/${drug.id}`}>Visualizza dettagli</Link>
          </Button>
          <FavoriteButton
            drugId={drug.id}
            initialIsFavorite={drug.isFavorited}
          />
        </div>
      </CardContent>
    </Card>
  );
}
