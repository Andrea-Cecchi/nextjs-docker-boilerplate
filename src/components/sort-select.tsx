"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { SearchParams } from "~/types/drugs";

const sortOptions = [
  { value: "none", label: "Nessun ordinamento" },
  { value: "brandName_asc", label: "Nome commerciale (A-Z)" },
  { value: "brandName_desc", label: "Nome commerciale (Z-A)" },
  { value: "activeSubstance_asc", label: "Principio attivo (A-Z)" },
  { value: "activeSubstance_desc", label: "Principio attivo (Z-A)" },
  { value: "ssnReferencePrice_asc", label: "Prezzo SSN (crescente)" },
  { value: "ssnReferencePrice_desc", label: "Prezzo SSN (decrescente)" },
  { value: "publicPrice_asc", label: "Prezzo pubblico (crescente)" },
  { value: "publicPrice_desc", label: "Prezzo pubblico (decrescente)" },
  { value: "priceDifference_asc", label: "Differenza prezzo (minore)" },
  { value: "priceDifference_desc", label: "Differenza prezzo (maggiore)" },
];

interface SortSelectProps {
  searchParams: SearchParams;
}

export function SortSelect({ searchParams }: SortSelectProps) {
  const currentSort =
    searchParams.sortBy && searchParams.sortOrder
      ? `${searchParams.sortBy}_${searchParams.sortOrder}`
      : "none";

  const handleSortChange = (value: string) => {
    const form = document.getElementById("search-form") as HTMLFormElement;
    if (!form) return;

    if (value === "none") {
      // Rimuovi ordinamento
      const sortByInput = form.querySelector(
        'input[name="sortBy"]',
      ) as HTMLInputElement;
      const sortOrderInput = form.querySelector(
        'input[name="sortOrder"]',
      ) as HTMLInputElement;

      if (sortByInput && sortOrderInput) {
        sortByInput.value = "";
        sortOrderInput.value = "";
      }
    } else {
      const [sortBy, sortOrder] = value.split("_");

      // Aggiorna gli input hidden
      const sortByInput = form.querySelector(
        'input[name="sortBy"]',
      ) as HTMLInputElement;
      const sortOrderInput = form.querySelector(
        'input[name="sortOrder"]',
      ) as HTMLInputElement;

      if (sortByInput && sortOrderInput) {
        sortByInput.value = sortBy || "";
        sortOrderInput.value = sortOrder || "";
      }
    }

    // Submit del form
    form.submit();
  };

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleziona ordinamento" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
