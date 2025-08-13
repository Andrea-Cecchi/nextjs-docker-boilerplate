import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-8 px-4 py-16">
        <h1 className="text-3xl font-bold">
          Benvenuto, {session.user.name || session.user.email}!
        </h1>
        <p className="text-lg">Questa è la tua dashboard.</p>
      </div>
    </main>
  );
}
