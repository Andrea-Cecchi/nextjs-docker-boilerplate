import { NavBar } from "~/components/navbar";
import { DrugSearchForm } from "~/components/drug-search-form";
import { DrugsList } from "~/components/drugs-content";
import { LegalFooter } from "~/components/legal-footer";
import type { SearchParams } from "~/types/drugs";

export default async function DrugsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Ricerca Farmaci</h1>
          <p className="text-muted-foreground">
            Cerca tra i farmaci delle Liste di Trasparenza AIFA
          </p>
        </div>

        <div className="mb-8">
          <DrugSearchForm searchParams={resolvedSearchParams} />
        </div>

        <DrugsList searchParams={resolvedSearchParams} />
      </main>
      
      <LegalFooter />
    </div>
  );
}
