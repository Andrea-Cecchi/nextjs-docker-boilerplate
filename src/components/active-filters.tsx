"use client";

import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

interface SearchParams {
  activeSubstance?: string;
  atc?: string;
  holder?: string;
  minPrice?: string;
  maxPrice?: string;
  note?: string;
  equivalenceGroup?: string;
}

interface ActiveFiltersProps {
  searchParams: SearchParams;
}

export function ActiveFilters({ searchParams }: ActiveFiltersProps) {
  const removeFilter = (filterName: string) => {
    const url = new URL(window.location.href);
    url.searchParams.delete(filterName);
    window.location.href = url.toString();
  };

  const removePriceFilter = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("minPrice");
    url.searchParams.delete("maxPrice");
    window.location.href = url.toString();
  };

  const hasActiveFilters = !!(
    searchParams.activeSubstance ||
    searchParams.atc ||
    searchParams.holder ||
    searchParams.minPrice ||
    searchParams.maxPrice ||
    searchParams.note ||
    searchParams.equivalenceGroup
  );

  if (!hasActiveFilters) {
    return (
      <span className="text-muted-foreground text-sm">
        Nessun filtro attivo
      </span>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {searchParams.activeSubstance && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          Principio: {searchParams.activeSubstance}
          <X
            onClick={(e) => {
              e.stopPropagation();
              removeFilter("activeSubstance");
            }}
            className="h-3 w-3 cursor-pointer hover:text-blue-600"
          />
        </span>
      )}
      {searchParams.atc && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          ATC: {searchParams.atc}
          <X
            onClick={(e) => {
              e.stopPropagation();
              removeFilter("atc");
            }}
            className="h-3 w-3 cursor-pointer hover:text-blue-600"
          />
        </span>
      )}
      {searchParams.holder && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          Titolare: {searchParams.holder}
          <X
            onClick={(e) => {
              e.stopPropagation();
              removeFilter("holder");
            }}
            className="h-3 w-3 cursor-pointer hover:text-blue-600"
          />
        </span>
      )}
      {searchParams.equivalenceGroup && (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          Gruppo: {searchParams.equivalenceGroup}
          <X
            onClick={(e) => {
              e.stopPropagation();
              removeFilter("equivalenceGroup");
            }}
            className="h-3 w-3 cursor-pointer hover:text-blue-600"
          />
        </span>
      )}
    </div>
  );
}
