import { NavBar } from "~/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Cookie Policy
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <div className="space-y-6">
              
              <section>
                <h2 className="text-lg font-semibold mb-3">1. Cosa sono i Cookie</h2>
                <p className="text-sm">
                  I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web. 
                  Ci aiutano a fornire un servizio migliore, ricordare le tue preferenze e comprendere come utilizzi Farmix.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">2. Tipologie di Cookie Utilizzati</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-[#0066cc] pl-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-r">
                    <h3 className="font-medium">Cookie Tecnici Necessari</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Sempre attivi</strong> - Necessari per il funzionamento del sito
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">cookie_consent</code> - Memorizza le tue preferenze sui cookie</li>
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">session</code> - Mantiene la sessione di login attiva</li>
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">csrf_token</code> - Protezione contro attacchi CSRF</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Base giuridica:</strong> Legittimo interesse (Art. 6.1.f GDPR)<br/>
                      <strong>Durata:</strong> Sessione o fino alla scadenza impostata
                    </p>
                  </div>

                  <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 bg-gray-50 dark:bg-gray-900/50 p-3 rounded-r">
                    <h3 className="font-medium">Cookie di Analytics</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      <strong>Richiedono consenso</strong> - Ci aiutano a migliorare il servizio
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground mt-2 space-y-1">
                      <li><code className="bg-gray-100 dark:bg-gray-800 px-1 rounded text-xs">ph_*</code> - PostHog analytics per comprendere l'uso del sito</li>
                      <li>Tracciamento delle ricerche di farmaci più popolari</li>
                      <li>Monitoraggio delle performance delle funzionalità</li>
                      <li>Identificazione di errori e problemi tecnici</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      <strong>Base giuridica:</strong> Consenso (Art. 6.1.a GDPR)<br/>
                      <strong>Durata:</strong> Massimo 26 mesi<br/>
                      <strong>Fornitore:</strong> PostHog Inc. (USA) - <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] hover:underline">Privacy Policy</a>
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">3. Gestione delle Preferenze</h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-4 rounded">
                    <h3 className="font-medium mb-2">Come Modificare le Preferenze</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li><strong>Banner Cookie:</strong> Apparirà alla prima visita o dopo la cancellazione dei dati del browser</li>
                      <li><strong>Pulsante "Gestione Cookie":</strong> Sempre disponibile in basso a sinistra in ogni pagina</li>
                      <li><strong>Impostazioni Browser:</strong> Puoi bloccare o cancellare i cookie dalle impostazioni del browser</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Opzioni Disponibili:</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li><strong>Accetta tutti:</strong> Consenti cookie tecnici e di analytics</li>
                      <li><strong>Solo essenziali:</strong> Solo cookie tecnici necessari</li>
                      <li><strong>Rifiuta tutti:</strong> Solo cookie tecnici strettamente necessari</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">4. Cosa Tracciamo (con il tuo consenso)</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Ricerche e Navigazione:</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Termini di ricerca di farmaci (anonimizzati)</li>
                      <li>Pagine visitate e tempo di permanenza</li>
                      <li>Farmaci aggiunti/rimossi dai preferiti</li>
                      <li>Errori e problemi tecnici riscontrati</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium">Informazioni Tecniche:</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Tipo di dispositivo e browser</li>
                      <li>Risoluzione schermo e sistema operativo</li>
                      <li>Paese di provenienza (basato su IP anonimizzato)</li>
                      <li>Referrer (sito da cui arrivi)</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded mt-3">
                  <p className="text-xs text-muted-foreground">
                    <strong>Importante:</strong> Non tracciamo mai informazioni mediche personali, 
                    diagnosi o dati sanitari sensibili. I dati di ricerca sono aggregati e anonimizzati.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">5. Cookie di Terze Parti</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">PostHog Analytics</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li><strong>Finalità:</strong> Analytics e miglioramento UX</li>
                      <li><strong>Dati processati:</strong> USA con Standard Contractual Clauses</li>
                      <li><strong>Conformità GDPR:</strong> Sì, con garanzie appropriate</li>
                      <li><strong>Opt-out:</strong> Possibile tramite le nostre impostazioni cookie</li>
                    </ul>
                    <p className="text-xs text-muted-foreground mt-2">
                      Privacy Policy completa: <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] hover:underline">https://posthog.com/privacy</a>
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">6. Disabilitazione tramite Browser</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border p-3 rounded">
                      <h3 className="font-medium text-sm">Chrome</h3>
                      <p className="text-xs text-muted-foreground">
                        Impostazioni → Privacy e sicurezza → Cookie e altri dati dei siti
                      </p>
                    </div>
                    <div className="border p-3 rounded">
                      <h3 className="font-medium text-sm">Firefox</h3>
                      <p className="text-xs text-muted-foreground">
                        Opzioni → Privacy e sicurezza → Cookie e dati dei siti web
                      </p>
                    </div>
                    <div className="border p-3 rounded">
                      <h3 className="font-medium text-sm">Safari</h3>
                      <p className="text-xs text-muted-foreground">
                        Preferenze → Privacy → Gestisci dati siti web
                      </p>
                    </div>
                    <div className="border p-3 rounded">
                      <h3 className="font-medium text-sm">Edge</h3>
                      <p className="text-xs text-muted-foreground">
                        Impostazioni → Privacy e servizi → Cookie e autorizzazioni sito
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded">
                    <p className="text-sm text-muted-foreground">
                      <strong>Attenzione:</strong> Disabilitando tutti i cookie, alcune funzionalità del sito 
                      potrebbero non funzionare correttamente (login, preferenze, ricerche salvate).
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">7. Aggiornamenti della Policy</h2>
                <p className="text-sm">
                  Questa Cookie Policy può essere aggiornata per riflettere cambiamenti nelle nostre pratiche 
                  o per motivi operativi, legali o normativi. Ti informeremo di eventuali modifiche sostanziali 
                  tramite il banner cookie o via email.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">8. Contatti</h2>
                <p className="text-sm">
                  Per domande su questa Cookie Policy o per esercitare i tuoi diritti:
                  <br/>
                  Email: <a href="mailto:privacy@farmix.info" className="text-[#0066cc] hover:underline">privacy@farmix.info</a>
                  <br/>
                  Per maggiori informazioni sui tuoi diritti, consulta la nostra <a href="/privacy" className="text-[#0066cc] hover:underline">Privacy Policy</a>.
                </p>
              </section>

            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export const metadata = {
  title: "Cookie Policy - Farmix",
  description: "Informazioni sui cookie utilizzati da Farmix e come gestire le preferenze",
};
