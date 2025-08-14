"use client";

import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { X } from "lucide-react";

// Funzione helper per ottenere il consenso dai cookie dal localStorage
export function getCookieConsent(): string {
  if (typeof window === 'undefined') return 'undecided';
  
  const consent = localStorage.getItem('cookie_consent');
  return consent || 'undecided';
}

export default function CookieBanner() {
  const [consentGiven, setConsentGiven] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    // Evita errori di idratazione controllando se siamo sul client
    const consent = getCookieConsent();
    setConsentGiven(consent);
    setIsVisible(consent === 'undecided');
  }, []);

  // Aggiorna la configurazione PostHog quando cambia il consenso
  useEffect(() => {
    if (consentGiven !== '' && posthog) {
      const persistence = consentGiven === 'yes' ? 'localStorage+cookie' : 'memory';
      posthog.set_config({ persistence });
      
      // Traccia l'evento in base alla scelta
      if (consentGiven === 'yes') {
        posthog.capture('cookie_consent_all_accepted');
      } else if (consentGiven === 'essential') {
        posthog.capture('cookie_consent_essential_only');
      } else if (consentGiven === 'no') {
        posthog.capture('cookie_consent_all_declined');
      }
    }
  }, [consentGiven, posthog]);

  const handleAcceptAllCookies = () => {
    localStorage.setItem('cookie_consent', 'yes');
    setConsentGiven('yes');
    setIsVisible(false);
  };

  const handleAcceptEssentialOnly = () => {
    localStorage.setItem('cookie_consent', 'essential');
    setConsentGiven('essential');
    setIsVisible(false);
  };

  const handleDeclineAllCookies = () => {
    localStorage.setItem('cookie_consent', 'no');
    setConsentGiven('no');
    setIsVisible(false);
  };

  const handleClose = () => {
    // Chiude il banner senza salvare preferenze (equivale a decline)
    handleDeclineAllCookies();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-auto md:right-6 md:max-w-sm z-50 p-4 md:p-0">
      <Card className="bg-white border shadow-lg mx-auto md:mx-0 max-w-sm md:max-w-md relative">
        <div className="p-5 md:p-4">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1"
            aria-label="Chiudi banner"
          >
            <X size={18} />
          </button>
          
          <div>
            <h3 className="text-base md:text-sm font-semibold text-gray-900 mb-3">
              Utilizziamo i cookie per migliorare la tua esperienza
            </h3>
            
            <p className="text-gray-600 mb-4 text-sm md:text-xs leading-relaxed">
              Utilizziamo cookie tecnici (necessari) e di analytics per comprendere come utilizzi Farmix e 
              migliorare il servizio. I cookie di analytics richiedono il tuo consenso.{" "}
              <a href="/cookie-policy" className="text-[#0066cc] hover:underline font-medium">
                Maggiori informazioni
              </a>
            </p>
            
            <div className="flex flex-col items-center gap-3 md:gap-2 w-full">
              <Button 
                onClick={handleAcceptAllCookies}
                size="default"
                className="w-full h-11 md:h-9 text-sm font-medium"
              >
                Accetta tutti
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleAcceptEssentialOnly}
                size="default"
                className="w-full h-11 md:h-9 text-sm font-medium"
              >
                Solo essenziali
              </Button>
              
              <Button 
                variant="ghost"
                onClick={handleDeclineAllCookies}
                size="default"
                className="w-full h-11 md:h-9 text-sm font-medium"
              >
                Rifiuta tutti
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 mt-3 text-center space-y-1">
              <p>Puoi modificare le preferenze tramite il pulsante "Gestione Cookie".</p>
              <p>
                Consulta la nostra{" "}
                <a href="/privacy" className="text-[#0066cc] hover:underline">Privacy Policy</a>
                {" "}per maggiori dettagli.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
