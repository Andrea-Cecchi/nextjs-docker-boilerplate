import { Eye, Info, Shield, TrendingUp } from "lucide-react"
import { motion } from "motion/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";

export const HomeInfo = () => {

    return (
        
      <section className="bg-white/80 backdrop-blur-sm py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Info className="h-8 w-8 text-[#0066cc]" />
            <h2 className="text-4xl font-bold text-gray-900">
              Cosa sono le Liste di Trasparenza AIFA?
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Scopri tutto sui dati ufficiali che utilizziamo per offrirti informazioni precise sui prezzi dei farmaci
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 hover:border-[#0066cc]/20 transition-colors">
              <CardHeader className="text-center">
                <Shield className="h-12 w-12 text-[#0066cc] mx-auto mb-4" />
                <CardTitle className="text-xl">Dati Ufficiali</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  I prezzi provengono direttamente dall'Agenzia Italiana del Farmaco (AIFA), 
                  garantendo massima affidabilità e aggiornamenti costanti.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 hover:border-[#0066cc]/20 transition-colors">
              <CardHeader className="text-center">
                <Eye className="h-12 w-12 text-[#0066cc] mx-auto mb-4" />
                <CardTitle className="text-xl">Trasparenza Totale</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Accesso libero e gratuito a tutte le informazioni sui prezzi dei farmaci, 
                  per promuovere scelte consapevoli e informate.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-2 hover:border-[#0066cc]/20 transition-colors">
              <CardHeader className="text-center">
                <TrendingUp className="h-12 w-12 text-[#0066cc] mx-auto mb-4" />
                <CardTitle className="text-xl">Monitoraggio Prezzi</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base">
                  Tracciamo l'evoluzione dei prezzi nel tempo per aiutarti a 
                  individuare le migliori opportunità di risparmio.
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2 border-[#0066cc]/10 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-900">
                Domande Frequenti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left font-semibold">
                    Cos'è esattamente AIFA?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    L'Agenzia Italiana del Farmaco (AIFA) è l'autorità nazionale competente per l'attività 
                    regolatoria dei farmaci in Italia. Pubblica regolarmente le liste di trasparenza con 
                    i prezzi ufficiali di tutti i farmaci autorizzati.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left font-semibold">
                    Quanto sono aggiornati i prezzi?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    I dati vengono aggiornati regolarmente seguendo le pubblicazioni ufficiali AIFA. 
                    Il nostro sistema sincronizza automaticamente le informazioni per garantire 
                    la massima precisione e tempestività.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left font-semibold">
                    Posso fidarmi di questi prezzi?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Assolutamente sì. Tutti i prezzi provengono direttamente dalle fonti ufficiali AIFA 
                    e vengono mostrati senza alcuna modifica. Utilizziamo solo dati pubblici e verificati 
                    per garantire la massima affidabilità.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left font-semibold">
                    Cosa significa "prezzo di riferimento SSN"?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Il prezzo di riferimento SSN è il prezzo massimo che il Servizio Sanitario Nazionale 
                    riconosce per un farmaco. Se il prezzo al pubblico è superiore, la differenza 
                    rimane a carico del paziente.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-left font-semibold">
                    Come leggere e interpretare i dati dei farmaci?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    <div className="space-y-3">
                      <p><strong>Principio Attivo:</strong> Il componente chimico che produce l'effetto terapeutico del farmaco.</p>
                      <p><strong>AIC (Codice):</strong> Autorizzazione all'Immissione in Commercio, identificativo unico del farmaco.</p>
                      <p><strong>Confezione:</strong> Formato e quantità del farmaco (es. 20 compresse da 500mg).</p>
                      <p><strong>Prezzo SSN:</strong> Prezzo rimborsato dal Servizio Sanitario Nazionale.</p>
                      <p><strong>Prezzo Pubblico:</strong> Prezzo di vendita al pubblico in farmacia.</p>
                      <p><strong>Differenza:</strong> Quanto paga effettivamente il paziente (Prezzo Pubblico - Prezzo SSN).</p>
                      <p><strong>Gruppo Equivalenza:</strong> Farmaci con stesso principio attivo e stessa efficacia.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
    )
}