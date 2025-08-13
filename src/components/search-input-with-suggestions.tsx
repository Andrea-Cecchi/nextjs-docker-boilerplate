"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

interface SearchInputWithSuggestionsProps {
  name: string;
  placeholder: string;
  defaultValue?: string;
  fetchSuggestions: (query: string) => Promise<string[]>;
  className?: string;
}

export function SearchInputWithSuggestions({
  name,
  placeholder,
  defaultValue = "",
  fetchSuggestions,
  className,
}: SearchInputWithSuggestionsProps) {
  const [value, setValue] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Sincronizza il valore quando defaultValue cambia (dopo submit)
  useEffect(() => {
    setValue(defaultValue);
    // Nascondi sempre le suggestions quando la pagina ricarica
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveSuggestion(-1);
  }, [defaultValue]);

  // Debounce per l'autocompletamento
  useEffect(() => {
    if (value.length >= 2) {
      const debounceTimer = setTimeout(() => {
        startTransition(async () => {
          const results = await fetchSuggestions(value);
          setSuggestions(results);
          // Mostra suggestions solo se l'input ha il focus
          if (document.activeElement === inputRef.current) {
            setShowSuggestions(true);
          }
          setActiveSuggestion(-1);
        });
      }, 300); // 300ms di debounce

      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [value, fetchSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setValue(suggestion);
    setShowSuggestions(false);
    setActiveSuggestion(-1);

    // Aggiorna il valore dell'input prima del submit
    if (inputRef.current) {
      inputRef.current.value = suggestion;
    }

    // Rimuovi il focus dall'input
    if (inputRef.current) {
      inputRef.current.blur();
    }

    // Trigger automatico del form submit
    const form = inputRef.current?.closest("form");
    if (form) {
      form.requestSubmit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveSuggestion((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
          handleSuggestionClick(suggestions[activeSuggestion]);
        } else {
          // Se non c'è una suggestion attiva, esegui comunque la ricerca
          setShowSuggestions(false);
          setActiveSuggestion(-1);
          if (inputRef.current) {
            inputRef.current.blur();
          }
          const form = inputRef.current?.closest("form");
          if (form) {
            form.requestSubmit();
          }
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveSuggestion(-1);
        break;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveSuggestion(-1);
      // Reset suggestions per evitare che riappaiano
      setSuggestions([]);
    }, 150);
  };

  const handleFocus = () => {
    if (suggestions.length > 0 && value.length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Nascondi suggestions se l'input perde il focus (controllo globale)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
        setActiveSuggestion(-1);
      }
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute top-1/2 left-3 z-20 h-4 w-4 -translate-y-1/2 transform text-gray-600 drop-shadow-sm" />
      <div className="relative">
        <Input
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn("pl-10", className)}
          autoComplete="off"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          {isPending && (
            <div className="px-3 py-2 text-sm text-gray-500">
              Caricamento...
            </div>
          )}
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={cn(
                "cursor-pointer px-3 py-2 text-sm hover:bg-gray-100",
                activeSuggestion === index && "bg-blue-50 text-blue-600",
              )}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
