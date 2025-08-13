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

interface AutocompleteInputProps {
  name: string;
  placeholder: string;
  defaultValue?: string;
  fetchSuggestions: (query: string) => Promise<string[]>;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function AutocompleteInput({
  name,
  placeholder,
  defaultValue = "",
  fetchSuggestions,
  onValueChange,
  className,
}: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (value.length >= 2) {
      startTransition(async () => {
        const results = await fetchSuggestions(value);
        setSuggestions(results);
      });
    } else {
      setSuggestions([]);
    }
  }, [value, fetchSuggestions]);

  // Aggiorna l'input nascosto quando il valore cambia
  useEffect(() => {
    if (onValueChange) {
      onValueChange(value);
    }
    // Aggiorna anche l'input nascosto nel DOM se esiste
    const hiddenInput = document.querySelector(
      `input[name="${name}"]`,
    ) as HTMLInputElement;
    if (hiddenInput) {
      hiddenInput.value = value;
    }
  }, [value, name, onValueChange]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
          >
            {value || placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={`Cerca ${placeholder.toLowerCase()}...`}
              value={value}
              onValueChange={setValue}
            />
            <CommandList>
              <CommandEmpty>
                {isPending ? "Caricamento..." : "Nessun risultato trovato."}
              </CommandEmpty>
              {suggestions.length > 0 && (
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      value={suggestion}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
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
    </>
  );
}
