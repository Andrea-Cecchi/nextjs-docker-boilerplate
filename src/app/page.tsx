import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { NavBar } from "~/components/navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <NavBar />
      <main className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Next.js Docker Boilerplate
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Un boilerplate moderno e pronto all'uso con Next.js, Docker, Prisma, e Better Auth. 
            Tutto quello che ti serve per iniziare il tuo prossimo progetto.
          </p>
          <Button size="lg" className="mr-4">
            Inizia Subito
          </Button>
          <Button variant="outline" size="lg">
            Documentazione
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  ⚡
                </div>
                Next.js 15
              </CardTitle>
              <CardDescription>
                Framework React con App Router, Server Components e tutte le ultime funzionalità
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  🐳
                </div>
                Docker Ready
              </CardTitle>
              <CardDescription>
                Configurazione Docker completa per sviluppo e produzione con Docker Compose
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  🔐
                </div>
                Better Auth
              </CardTitle>
              <CardDescription>
                Sistema di autenticazione moderno con supporto per OAuth e gestione sessioni
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  🗃️
                </div>
                Prisma ORM
              </CardTitle>
              <CardDescription>
                Database ORM type-safe con migrazioni automatiche e Prisma Studio
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  🎨
                </div>
                Shadcn/UI
              </CardTitle>
              <CardDescription>
                Componenti UI moderni e accessibili con Tailwind CSS e Radix UI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  ⚙️
                </div>
                TypeScript
              </CardTitle>
              <CardDescription>
                Type safety completa con ESLint, Prettier e configurazione ottimizzata
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Pronto per iniziare?</CardTitle>
              <CardDescription>
                Clona il repository e avvia il tuo progetto in pochi minuti
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg font-mono text-sm mb-4">
                <span className="text-muted-foreground">git clone</span> https://github.com/your-repo/nextjs-docker-boilerplate
              </div>
              <Button className="w-full">
                Inizia il tuo progetto
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
