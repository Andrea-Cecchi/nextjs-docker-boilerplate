import { ExternalLink, Info } from "lucide-react";
import { Card, CardContent } from "./ui/card";

interface AifaAttributionProps {
  className?: string;
  variant?: "full" | "compact" | "inline";
}

export function AifaAttribution({ className = "", variant = "full" }: AifaAttributionProps) {
  if (variant === "inline") {
    return (
      <p className={`text-xs text-muted-foreground ${className}`}>
        Fonte: <a 
          href="https://www.aifa.gov.it" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#0066cc] hover:underline"
        >
          Agenzia Italiana del Farmaco (AIFA)
        </a>
        {" "}• Elaborazione dati: Farmix • Nessun avallo ufficiale AIFA
      </p>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-2 text-xs text-muted-foreground p-2 bg-gray-50 dark:bg-gray-900 rounded ${className}`}>
        <Info className="h-3 w-3 flex-shrink-0" />
        <span>
          Dati da{" "}
          <a 
            href="https://www.aifa.gov.it" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#0066cc] hover:underline font-medium"
          >
            AIFA
          </a>
          {" "}• Elaborati da Farmix
        </span>
      </div>
    );
  }

  return (
    <Card className={`bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="h-8 w-8 bg-[#0066cc]/10 rounded-lg flex items-center justify-center">
              <Info className="h-4 w-4 text-[#0066cc]" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-sm">
              Fonte dei Dati
            </h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>Fonte:</strong> Agenzia Italiana del Farmaco (AIFA) - Liste di Trasparenza
                <br />
                <strong>Elaborazione:</strong> Farmix (visualizzazione e storico prezzi)
                <br />
                <strong>Licenza:</strong> Riutilizzo dati pubblici italiani (D.Lgs. 36/2006)
              </p>
              <div className="flex items-center gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                <a
                  href="https://www.aifa.gov.it"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#0066cc] hover:underline font-medium"
                >
                  Sito AIFA <ExternalLink className="h-3 w-3" />
                </a>
                <span className="text-xs text-muted-foreground">
                  Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
                </span>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs text-muted-foreground">
              <strong>Importante:</strong> Farmix non è affiliato con AIFA. 
              I dati sono forniti a scopo informativo e non sostituiscono il parere medico.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
