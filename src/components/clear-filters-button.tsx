"use client";

import { Button } from "~/components/ui/button";
import { X } from "lucide-react";

export function ClearFiltersButton() {
  const handleClearFilters = () => {
    const form = document.querySelector("form") as HTMLFormElement;
    if (form) {
      form.reset();
      window.location.href = "/drugs";
    }
  };

  return (
    <Button type="button" variant="outline" onClick={handleClearFilters}>
      <X className="mr-2 h-4 w-4" />
      Azzera filtri
    </Button>
  );
}
