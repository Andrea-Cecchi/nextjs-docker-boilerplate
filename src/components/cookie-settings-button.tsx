"use client";

import { useState, useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Cookie } from "lucide-react";
import { getCookieConsent } from "./cookie-banner";

export function CookieSettingsButton() {
  const [consentGiven, setConsentGiven] = useState('');
  const [open, setOpen] = useState(false);
  const posthog = usePostHog();

  useEffect(() => {
    setConsentGiven(getCookieConsent());
    
    // Listen for custom event to open cookie settings
    const handleOpenCookieSettings = () => {
      setOpen(true);
    };
    
    window.addEventListener('openCookieSettings', handleOpenCookieSettings);
    
    return () => {
      window.removeEventListener('openCookieSettings', handleOpenCookieSettings);
    };
  }, []);

  // Solo mostra il bottone se l'utente ha già fatto una scelta sui cookie
  if (consentGiven === 'undecided') {
    return null;
  }

  const handleToggleConsent = (enabled: boolean) => {
    const newConsent = enabled ? 'yes' : 'essential';
    localStorage.setItem('cookie_consent', newConsent);
    setConsentGiven(newConsent);
    
    if (posthog) {
      const persistence = enabled ? 'localStorage+cookie' : 'memory';
      posthog.set_config({ 
        persistence,
        autocapture: enabled ? undefined : false
      });
      
      posthog.capture('cookie_preferences_updated', {
        new_consent: newConsent,
        previous_consent: consentGiven
      });
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            size="sm"
            variant="outline"
            className="h-10 w-10 rounded-full p-0 bg-white shadow-lg border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all duration-200"
            aria-label="Impostazioni Cookie"
          >
            <Cookie size={16} className="text-gray-600" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Preferenze Cookie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Cookie Essenziali</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Questi cookie sono necessari per il funzionamento del sito e non possono essere disabilitati.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="essential-cookies"
                    checked={true}
                    disabled={true}
                  />
                  <Label htmlFor="essential-cookies" className="text-sm">
                    Sempre attivi
                  </Label>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Cookie di Analytics</h4>
                <p className="text-xs text-gray-600 mb-3">
                  Ci aiutano a comprendere come utilizzi Farmix per migliorare il servizio.
                  Tracciamo le ricerche di farmaci e l'uso delle funzionalità.
                </p>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="analytics-cookies"
                    checked={consentGiven === 'yes'}
                    onCheckedChange={handleToggleConsent}
                  />
                  <Label htmlFor="analytics-cookies" className="text-sm">
                    {consentGiven === 'yes' ? 'Consentiti' : 'Solo essenziali'}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500 leading-relaxed">
                Le tue preferenze vengono salvate localmente. 
                Puoi modificarle in qualsiasi momento da questa pagina.
                I cookie di analytics ci aiutano a migliorare la ricerca dei farmaci 
                e il monitoraggio dei prezzi.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={() => setOpen(false)}>
                Salva Preferenze
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
