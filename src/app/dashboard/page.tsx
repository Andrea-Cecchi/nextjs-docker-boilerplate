import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { NavBar } from "~/components/navbar";
import { LegalFooter } from "~/components/legal-footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { User, Lock, Trash2 } from "lucide-react";
import { ProfileForm } from "~/components/profile/profile-form";
import { PasswordForm } from "~/components/profile/password-form";
import { DeleteAccountForm } from "~/components/profile/delete-account-form";
import { db } from "~/server/db";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/login");
  }

  // Verifica se l'utente ha un account con password (non social)
  const hasPasswordAccount = await db.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "credential", // o il provider che usi per email/password
      password: { not: null },
    },
  });

  const showPasswordTab = !!hasPasswordAccount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950 dark:via-pink-950 dark:to-blue-950">
      <NavBar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gestisci il tuo profilo e le impostazioni dell'account
            </p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className={`grid w-full ${showPasswordTab ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profilo
              </TabsTrigger>
              {showPasswordTab && (
                <TabsTrigger value="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </TabsTrigger>
              )}
              <TabsTrigger value="danger" className="flex items-center gap-2 text-red-600">
                <Trash2 className="h-4 w-4" />
                Account
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <ProfileForm 
                user={{
                  name: session.user.name || "",
                  email: session.user.email || "",
                  image: session.user.image,
                }}
              />
            </TabsContent>

            {showPasswordTab && (
              <TabsContent value="password">
                <PasswordForm />
              </TabsContent>
            )}

            <TabsContent value="danger">
              <DeleteAccountForm />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <LegalFooter />
    </div>
  );
}
