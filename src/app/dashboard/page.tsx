import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NavBar } from "~/components/navbar";
import { LegalFooter } from "~/components/legal-footer";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <NavBar />
      <main className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
          <h1 className="text-3xl font-bold">
            Benvenuto, {session.user.name || session.user.email}!
          </h1>
          <p className="text-lg text-muted-foreground">Questa è la tua dashboard.</p>
        </div>
      </main>
      
      <LegalFooter />
    </div>
  );
}
