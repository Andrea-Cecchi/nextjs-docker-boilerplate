import { NavBar } from "~/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Privacy Policy
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <div className="space-y-6">
              
              <section>
                <h2 className="text-lg font-semibold mb-3">1. Titolare del Trattamento</h2>
                <p>
                  Il titolare del trattamento dei dati personali è Farmix, con sede presso [inserire indirizzo].
                  Per contattarci in merito alla presente Privacy Policy: <a href="mailto:privacy@farmix.it" className="text-[#0066cc] hover:underline">privacy@farmix.it</a>
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">2. Dati Trattati</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Dati di Account:</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Email (per registrazione e accesso)</li>
                      <li>Password (crittografata)</li>
                      <li>Data di registrazione</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium">Dati di Utilizzo:</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Ricerche di farmaci effettuate</li>
                      <li>Farmaci salvati nei preferiti</li>
                      <li>Pagine visitate e tempo di permanenza</li>
                      <li>Dispositivo e browser utilizzato</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium">Dati Tecnici:</h3>
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      <li>Indirizzo IP</li>
                      <li>Log di accesso e errori</li>
                      <li>Cookie tecnici e di preferenze</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">3. Finalità e Base Giuridica</h2>
                <div className="space-y-3">
                  <div className="border-l-4 border-[#0066cc] pl-4 py-2">
                    <h3 className="font-medium">Erogazione del Servizio</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Finalità:</strong> Fornire accesso alla piattaforma, ricerca farmaci, gestione preferiti<br/>
                      <strong>Base giuridica:</strong> Esecuzione del contratto (Art. 6.1.b GDPR)
                    </p>
                  </div>
                  <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2">
                    <h3 className="font-medium">Miglioramento del Servizio</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Finalità:</strong> Analytics, ottimizzazione UX, correzione errori<br/>
                      <strong>Base giuridica:</strong> Legittimo interesse (Art. 6.1.f GDPR)
                    </p>
                  </div>
                  <div className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2">
                    <h3 className="font-medium">Marketing e Profilazione</h3>
                    <p className="text-sm text-muted-foreground">
                      <strong>Finalità:</strong> Contenuti personalizzati, comunicazioni promozionali<br/>
                      <strong>Base giuridica:</strong> Consenso (Art. 6.1.a GDPR)
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">4. Conservazione dei Dati</h2>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>Dati di account:</strong> Fino alla cancellazione dell'account</li>
                  <li><strong>Preferiti e ricerche:</strong> Fino alla cancellazione dell'account</li>
                  <li><strong>Log tecnici:</strong> Massimo 12 mesi</li>
                  <li><strong>Dati di analytics:</strong> 26 mesi (conformemente alle linee guida EDPB)</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">5. Condivisione con Terze Parti</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">PostHog (Analytics)</h3>
                    <p className="text-sm text-muted-foreground">
                      Utilizziamo PostHog per analytics e miglioramento del servizio. 
                      I dati sono processati in conformità al GDPR.
                      <br/>
                      <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#0066cc] hover:underline">
                        Privacy Policy PostHog
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Fornitori di Hosting</h3>
                    <p className="text-sm text-muted-foreground">
                      I dati sono ospitati su server sicuri di fornitori certificati ISO 27001 e conformi GDPR.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">6. I Tuoi Diritti</h2>
                <p className="text-sm mb-3">
                  Ai sensi del GDPR, hai diritto a:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  <li><strong>Accesso:</strong> Ottenere copia dei tuoi dati personali</li>
                  <li><strong>Rettifica:</strong> Correggere dati inesatti o incompleti</li>
                  <li><strong>Cancellazione:</strong> Richiedere la cancellazione dei tuoi dati</li>
                  <li><strong>Limitazione:</strong> Limitare il trattamento in determinate circostanze</li>
                  <li><strong>Portabilità:</strong> Ricevere i dati in formato strutturato</li>
                  <li><strong>Opposizione:</strong> Opporti al trattamento basato su legittimo interesse</li>
                  <li><strong>Revoca consenso:</strong> Revocare il consenso in qualsiasi momento</li>
                </ul>
                <p className="text-sm mt-3">
                  Per esercitare i tuoi diritti, contattaci a: <a href="mailto:privacy@farmix.it" className="text-[#0066cc] hover:underline">privacy@farmix.it</a>
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">7. Cookie</h2>
                <p className="text-sm mb-3">
                  Utilizziamo cookie tecnici (necessari) e di analytics (opzionali). 
                  Puoi gestire le tue preferenze tramite il banner cookie o il pulsante "Gestione Cookie" presente in ogni pagina.
                </p>
                <p className="text-sm">
                  Per maggiori dettagli, consulta la nostra <a href="/cookie-policy" className="text-[#0066cc] hover:underline">Cookie Policy</a>.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">8. Sicurezza</h2>
                <p className="text-sm">
                  Implementiamo misure tecniche e organizzative appropriate per proteggere i tuoi dati personali 
                  da accessi non autorizzati, alterazioni, divulgazioni o distruzioni, inclusi:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                  <li>Crittografia dei dati sensibili</li>
                  <li>Accesso limitato su base "need-to-know"</li>
                  <li>Monitoraggio continuo dei sistemi</li>
                  <li>Backup regolari e sicuri</li>
                </ul>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">9. Trasferimenti Internazionali</h2>
                <p className="text-sm">
                  I dati possono essere trasferiti verso paesi terzi solo se dotati di decisione di adeguatezza 
                  della Commissione Europea o mediante garanzie appropriate (Standard Contractual Clauses).
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">10. Minori</h2>
                <p className="text-sm">
                  Il servizio non è destinato a minori di 16 anni. Non raccogliamo consapevolmente 
                  dati personali da minori di 16 anni senza il consenso dei genitori.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">11. Modifiche alla Privacy Policy</h2>
                <p className="text-sm">
                  Ci riserviamo il diritto di modificare questa Privacy Policy. 
                  Le modifiche sostanziali saranno comunicate via email agli utenti registrati.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">12. Reclami</h2>
                <p className="text-sm">
                  Hai il diritto di presentare reclamo al Garante per la Protezione dei Dati Personali:
                  <br/>
                  <strong>Garante Privacy</strong> - Piazza Venezia, 11 - 00187 Roma
                  <br/>
                  Tel: +39 06 69677.1 | Email: garante@gpdp.it
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
  title: "Privacy Policy - Farmix",
  description: "Informativa sulla privacy e trattamento dati personali di Farmix",
};
