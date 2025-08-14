"use client";

import Link from "next/link";
import { Separator } from "./ui/separator";
import { ExternalLink, Shield, Cookie, FileText } from "lucide-react";

export function LegalFooter() {
  return (
    <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Informazioni Legali */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              Informazioni Legali
            </h3>
            <div className="space-y-2">
              <Link 
                href="/privacy" 
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#0066cc] dark:hover:text-[#0066cc] transition-colors"
              >
                <Shield className="h-3 w-3" />
                Privacy Policy
              </Link>
              <Link 
                href="/cookie-policy" 
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#0066cc] dark:hover:text-[#0066cc] transition-colors"
              >
                <Cookie className="h-3 w-3" />
                Cookie Policy
              </Link>
              <Link 
                href="/terms" 
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#0066cc] dark:hover:text-[#0066cc] transition-colors"
              >
                <FileText className="h-3 w-3" />
                Termini e Condizioni
              </Link>
              <button 
                onClick={() => {
                  // Trigger cookie settings dialog
                  const event = new CustomEvent('openCookieSettings');
                  window.dispatchEvent(event);
                }}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-[#0066cc] dark:hover:text-[#0066cc] transition-colors text-left"
              >
                <Cookie className="h-3 w-3" />
                Gestione Cookie
              </button>
            </div>
          </div>

          {/* Fonti e Disclaimer */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Fonti e Disclaimer
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2">
                <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Dati AIFA</p>
                  <p className="text-xs">
                    Fonte: <a 
                      href="https://www.aifa.gov.it" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#0066cc] hover:underline"
                    >
                      Agenzia Italiana del Farmaco
                    </a>
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-2 rounded text-xs">
                <strong>Importante:</strong>
                <br />
                <span className="text-muted-foreground">
                  Le informazioni hanno scopo informativo e non sostituiscono il parere medico.
                </span>
              </div>
            </div>
          </div>

          {/* Contatti e Supporto */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Contatti
            </h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <p className="font-medium">Supporto</p>
                <a 
                  href="mailto:support@farmix.info" 
                  className="text-[#0066cc] hover:underline"
                >
                  support@farmix.info
                </a>
              </div>
              <div>
                <p className="font-medium">Privacy</p>
                <a 
                  href="mailto:privacy@farmix.info" 
                  className="text-[#0066cc] hover:underline"
                >
                  privacy@farmix.info
                </a>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright e Note Finali */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="text-center md:text-left">
            <p>© {new Date().getFullYear()} Farmix. Tutti i diritti riservati.</p>
            <p className="mt-1">
              Farmix non è affiliato con AIFA. I dati sono forniti a scopo informativo.
            </p>
          </div>
          <div className="text-center md:text-right">
            <p>Sviluppato per la trasparenza sanitaria</p>
            <p className="mt-1">
              Ultimo aggiornamento dati: {new Date().toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
