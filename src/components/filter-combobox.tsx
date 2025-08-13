"use client";

import { useState, useEffect, useTransition } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface FilterComboboxProps {
  name: string;
  placeholder: string;
  defaultValue?: string;
  fetchSuggestions: (query: string) => Promise<string[]>;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function FilterCombobox({
  name,
  placeholder,
  defaultValue = "",
  fetchSuggestions,
  onValueChange,
  className,
}: FilterComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState("");

  // Carica suggestions quando si apre o quando cambia il searchValue
  useEffect(() => {
    if (open) {
      const query = searchValue.length >= 1 ? searchValue : "";
      startTransition(async () => {
        try {
          const results = await fetchSuggestions(query);
          setSuggestions(results.slice(0, 15)); // Limita a 15 per performance
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        }
      });
    } else {
      setSuggestions([]);
    }
  }, [open, searchValue, fetchSuggestions]);

  // Sincronizza il valore quando defaultValue cambia
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  // Notifica il parent del cambio valore
  useEffect(() => {
    if (onValueChange) {
      onValueChange(value);
    }
    // Aggiorna l'input nascosto nel DOM se esiste
    const hiddenInput = document.querySelector(
      `input[name="${name}"]`,
    ) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = value;
    }
  }, [value, name, onValueChange]);

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);
    setSearchValue("");

    // Trigger form submission automatically when a value is selected
    setTimeout(() => {
      const form = document.getElementById("search-form") as HTMLFormElement;
      if (form) {
        form.requestSubmit();
      }
    }, 100);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Cerca ${placeholder.toLowerCase()}...`}
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
              {isPending ? "Caricamento..." : "Nessun risultato trovato."}
            </CommandEmpty>
            {suggestions.length > 0 && (
              <CommandGroup>
                {/* Opzione per svuotare */}
                {value && (
                  <CommandItem
                    value=""
                    onSelect={() => handleSelect("")}
                    className="text-muted-foreground"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        !value ? "opacity-100" : "opacity-0",
                      )}
                    />
                    Nessun filtro
                  </CommandItem>
                )}
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion}
                    value={suggestion}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === suggestion ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {suggestion}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
