import { Label } from "~/components/ui/label";
import { SearchInputWithSuggestions } from "~/components/search-input-with-suggestions";
import { FilterCombobox } from "~/components/filter-combobox";
import { ActiveFilters } from "~/components/active-filters";
import { SortSelect } from "~/components/sort-select";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  getActiveSubstances,
  getAtcCodes,
  getHolders,
  getEquivalenceGroups,
  getGeneralSuggestions,
} from "~/app/drugs/actions";
import type { SearchParams } from "~/types/drugs";
import { Filter, ArrowUpDown } from "lucide-react";

interface DrugSearchFormProps {
  searchParams: SearchParams;
}

export function DrugSearchForm({ searchParams }: DrugSearchFormProps) {
  return (
    <form id="search-form" method="GET" className="w-full space-y-6">
      {/* Input nascosti per i filtri - devono essere fuori dal popover */}
      <input
        type="hidden"
        name="activeSubstance"
        value={searchParams.activeSubstance ?? ""}
      />
      <input type="hidden" name="atc" value={searchParams.atc ?? ""} />
      <input type="hidden" name="holder" value={searchParams.holder ?? ""} />
      <input
        type="hidden"
        name="equivalenceGroup"
        value={searchParams.equivalenceGroup ?? ""}
      />
      <input type="hidden" name="sortBy" value={searchParams.sortBy ?? ""} />
      <input
        type="hidden"
        name="sortOrder"
        value={searchParams.sortOrder ?? ""}
      />

      {/* Search principale */}
      <SearchInputWithSuggestions
        name="q"
        placeholder="Cerca per nome commerciale, principio attivo o codice AIC..."
        defaultValue={searchParams.q ?? ""}
        fetchSuggestions={getGeneralSuggestions}
        className="h-12 rounded-lg border border-white/20 bg-white/50 shadow-sm backdrop-blur-xs transition-all duration-300 hover:bg-white/80 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-900/70 dark:hover:bg-gray-900/80"
      />

      {/* Pulsanti per Filtri e Ordinamento */}
      <div className="flex items-center gap-3">
        {/* Pulsante Filtri */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border border-white/20 bg-white/50 shadow-sm backdrop-blur-xs transition-all duration-300 hover:bg-white/80 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-900/70 dark:hover:bg-gray-900/80"
            >
              <Filter className="h-4 w-4" />
              <span className="ml-2">Filtri</span>
              {/* Indicatore filtri attivi */}
              {!!(
                searchParams.activeSubstance ||
                searchParams.atc ||
                searchParams.holder ||
                searchParams.equivalenceGroup
              ) && <div className="ml-2 h-2 w-2 rounded-full bg-blue-500" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="start">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">Filtri</h3>
                {/* Feedback visivo filtri attivi */}
                <ActiveFilters searchParams={searchParams} />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* Principio Attivo */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Principio Attivo
                    </Label>
                    <FilterCombobox
                      name="activeSubstance"
                      placeholder="Seleziona principio attivo"
                      defaultValue={searchParams.activeSubstance}
                      fetchSuggestions={getActiveSubstances}
                    />
                  </div>

                  {/* Codice ATC */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Codice ATC</Label>
                    <FilterCombobox
                      name="atc"
                      placeholder="Seleziona codice ATC"
                      defaultValue={searchParams.atc}
                      fetchSuggestions={getAtcCodes}
                    />
                  </div>

                  {/* Titolare AIC */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Titolare AIC</Label>
                    <FilterCombobox
                      name="holder"
                      placeholder="Seleziona titolare"
                      defaultValue={searchParams.holder}
                      fetchSuggestions={getHolders}
                    />
                  </div>

                  {/* Gruppo Equivalenza */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">
                      Gruppo Equivalenza
                    </Label>
                    <FilterCombobox
                      name="equivalenceGroup"
                      placeholder="Seleziona gruppo"
                      defaultValue={searchParams.equivalenceGroup}
                      fetchSuggestions={getEquivalenceGroups}
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Pulsante Ordinamento */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border border-white/20 bg-white/50 shadow-sm backdrop-blur-xs transition-all duration-300 hover:bg-white/80 hover:shadow-md dark:border-gray-700/50 dark:bg-gray-900/70 dark:hover:bg-gray-900/80"
            >
              <ArrowUpDown className="h-4 w-4" />
              <span className="ml-2">Ordina</span>
              {/* Indicatore ordinamento attivo */}
              {!!(searchParams.sortBy && searchParams.sortOrder) && (
                <div className="ml-2 h-2 w-2 rounded-full bg-blue-500" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-4">
              <div className="mb-4">
                <h3 className="mb-2 text-lg font-semibold">Ordina per</h3>
              </div>
              <div className="space-y-2">
                <SortSelect searchParams={searchParams} />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </form>
  );
}
