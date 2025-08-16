import { NavBar } from "~/components/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <NavBar />
      
      <main className="container mx-auto px-4 py-8">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Termini e Condizioni d'Uso
            </CardTitle>
            <p className="text-center text-muted-foreground">
              Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none dark:prose-invert">
            <div className="space-y-6">
              
              {/* Disclaimer Medico Prominente */}
              <div className="bg-gray-50 dark:bg-gray-900/50 border-2 border-[#0066cc] p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-[#0066cc] mt-0.5 flex-shrink-0" />
                  <div>
                    <h2 className="text-lg font-bold mb-2">
                      IMPORTANTE - Disclaimer Medico
                    </h2>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p><strong>Le informazioni fornite da Farmix hanno finalità esclusivamente informative e non sostituiscono in alcun modo il parere, la diagnosi o la prescrizione del medico o del farmacista.</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Non utilizzare queste informazioni per autodiagnosi o automedicazione</li>
                        <li>Consulta sempre il tuo medico prima di iniziare, modificare o interrompere qualsiasi terapia</li>
                        <li>I prezzi e le informazioni sui farmaci possono variare e non essere sempre aggiornati</li>
                        <li>In caso di emergenza medica, contatta immediatamente il 112 o recati al pronto soccorso</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <section>
                <h2 className="text-lg font-semibold mb-3">1. Accettazione dei Termini</h2>
                <p className="text-sm">
                  Utilizzando Farmix, accetti integralmente i presenti Termini e Condizioni d'Uso. 
                  Se non accetti questi termini, non utilizzare il servizio.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">2. Descrizione del Servizio</h2>
                <div className="space-y-3">
                  <p className="text-sm">
                    Farmix è una piattaforma informativa che fornisce:
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Ricerca di farmaci presenti nelle Liste di Trasparenza AIFA</li>
                    <li>Visualizzazione di prezzi e informazioni sui farmaci</li>
                    <li>Storico prezzi e andamenti nel tempo</li>
                    <li>Funzionalità di salvataggio preferiti (per utenti registrati)</li>
                    <li>Informazioni su principi attivi, confezioni e titolari AIC</li>
                  </ul>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded mt-3">
                    <h3 className="font-medium mb-1">Fonte dei Dati</h3>
                    <p className="text-sm text-muted-foreground">
                      I dati sui farmaci provengono dalle Liste di Trasparenza dell'Agenzia Italiana del Farmaco (AIFA). 
                      Farmix non è affiliato con AIFA e non rappresenta ufficialmente l'ente.
                      <br/>
                      <strong>Attribuzione:</strong> Fonte dati - Agenzia Italiana del Farmaco (AIFA), 
                      elaborati e visualizzati da Farmix. Licenza: dati pubblici italiani.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">3. Limitazioni di Responsabilità</h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded">
                    <h3 className="font-medium mb-2">Esclusioni di Responsabilità</h3>
                    <p className="text-sm text-muted-foreground">
                      Farmix non è responsabile per:
                    </p>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-2">
                      <li>Decisioni mediche basate sulle informazioni del sito</li>
                      <li>Inesattezze nei dati AIFA o ritardi negli aggiornamenti</li>
                      <li>Danni derivanti dall'uso improprio delle informazioni</li>
                      <li>Interruzioni temporanee del servizio</li>
                      <li>Variazioni di prezzo non aggiornate</li>
                    </ul>
                  </div>
                  
                  <p className="text-sm">
                    <strong>Il servizio è fornito "così com'è" senza garanzie esplicite o implicite.</strong> 
                    L'utilizzo è a tuo rischio e pericolo.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">4. Uso Consentito</h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded">
                    <h3 className="font-medium mb-2">Usi Consentiti</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Consultazione informativa sui farmaci</li>
                      <li>Ricerca di prezzi e confronti</li>
                      <li>Salvataggio di farmaci nei preferiti</li>
                      <li>Consultazione dello storico prezzi</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded">
                    <h3 className="font-medium mb-2">Usi Vietati</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Scraping automatizzato o estrazione massiva di dati</li>
                      <li>Uso commerciale senza autorizzazione</li>
                      <li>Attività illegali o dannose</li>
                      <li>Violazione dei diritti di terzi</li>
                      <li>Diffusione di malware o contenuti dannosi</li>
                      <li>Tentativo di compromissione della sicurezza</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">5. Account Utente</h2>
                <div className="space-y-3">
                  <p className="text-sm">
                    Per utilizzare alcune funzionalità (preferiti), devi creare un account fornendo:
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Indirizzo email valido</li>
                    <li>Password sicura</li>
                  </ul>
                  
                  <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 p-3 rounded">
                    <h3 className="font-medium mb-1">Le tue responsabilità:</h3>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                      <li>Mantenere riservate le credenziali di accesso</li>
                      <li>Notificarci immediatamente accessi non autorizzati</li>
                      <li>Fornire informazioni accurate e aggiornate</li>
                      <li>Non condividere l'account con terzi</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">6. Proprietà Intellettuale</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">Contenuti Farmix:</h3>
                    <p className="text-sm">
                      Il design, la struttura, il codice e l'interfaccia di Farmix sono protetti da copyright. 
                      È vietata la riproduzione senza autorizzazione scritta.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Dati AIFA:</h3>
                    <p className="text-sm">
                      I dati sui farmaci appartengono ad AIFA e sono utilizzati in conformità alle condizioni 
                      di riutilizzo dei dati pubblici (D.Lgs. 36/2006). 
                      L'elaborazione e la presentazione dei dati è opera di Farmix.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">7. Privacy e Dati Personali</h2>
                <p className="text-sm">
                  Il trattamento dei tuoi dati personali è disciplinato dalla nostra 
                  <a href="/privacy" className="text-[#0066cc] hover:underline"> Privacy Policy</a>, 
                  che costituisce parte integrante di questi Termini.
                </p>
                <p className="text-sm mt-2">
                  Per informazioni sui cookie, consulta la nostra 
                  <a href="/cookie-policy" className="text-[#0066cc] hover:underline"> Cookie Policy</a>.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">8. Disponibilità del Servizio</h2>
                <p className="text-sm">
                  Ci impegniamo a mantenere il servizio disponibile, ma non garantiamo:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                  <li>Funzionamento ininterrotto 24/7</li>
                  <li>Assenza di errori o malfunzionamenti</li>
                  <li>Compatibilità con tutti i dispositivi</li>
                  <li>Aggiornamento immediato dei dati AIFA</li>
                </ul>
                <p className="text-sm mt-3">
                  Ci riserviamo il diritto di sospendere il servizio per manutenzione, 
                  aggiornamenti o per motivi tecnici, con preavviso quando possibile.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">9. Modifiche ai Termini</h2>
                <p className="text-sm">
                  Ci riserviamo il diritto di modificare questi Termini in qualsiasi momento. 
                  Le modifiche sostanziali saranno comunicate tramite:
                </p>
                <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                  <li>Notifica nella piattaforma</li>
                  <li>Email agli utenti registrati</li>
                  <li>Aggiornamento della data in cima alla pagina</li>
                </ul>
                <p className="text-sm mt-3">
                  L'uso continuato del servizio dopo le modifiche costituisce accettazione dei nuovi termini.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">10. Sospensione e Terminazione</h2>
                <div className="space-y-3">
                  <p className="text-sm">
                    Possiamo sospendere o terminare il tuo accesso in caso di:
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Violazione di questi Termini</li>
                    <li>Uso improprio del servizio</li>
                    <li>Attività sospette o dannose</li>
                    <li>Richiesta da parte delle autorità</li>
                  </ul>
                  
                  <p className="text-sm">
                    Puoi cancellare il tuo account in qualsiasi momento dalle impostazioni del profilo 
                    o contattandoci a <a href="mailto:support@farmix.info" className="text-[#0066cc] hover:underline">support@farmix.info</a>.
                  </p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">11. Legge Applicabile e Foro Competente</h2>
                <p className="text-sm">
                  Questi Termini sono disciplinati dalla legge italiana. 
                  Per qualsiasi controversia è competente il Foro di [inserire città], 
                  salvo diversa competenza inderogabile prevista dalla legge.
                </p>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">12. Contatti</h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Supporto tecnico:</strong> <a href="mailto:support@farmix.info" className="text-[#0066cc] hover:underline">support@farmix.info</a></p>
                  <p><strong>Privacy e dati:</strong> <a href="mailto:privacy@farmix.info" className="text-[#0066cc] hover:underline">privacy@farmix.info</a></p>
                  <p><strong>Questioni legali:</strong> <a href="mailto:legal@farmix.info" className="text-[#0066cc] hover:underline">legal@farmix.info</a></p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-lg font-semibold mb-3">13. Salvaguardia</h2>
                <p className="text-sm">
                  Se una disposizione di questi Termini dovesse essere dichiarata invalida o inapplicabile, 
                  le restanti disposizioni rimarranno in vigore. La disposizione invalida sarà sostituita 
                  con una disposizione valida di significato simile.
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
  title: "Termini e Condizioni - Farmix",
  description: "Termini e condizioni d'uso della piattaforma Farmix per la ricerca di farmaci AIFA",
};
