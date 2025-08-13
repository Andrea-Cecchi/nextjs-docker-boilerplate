"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./providers";
import { Pill } from "lucide-react";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { usePathname } from "next/navigation";

export function NavBar() {
  const { session, isLoading, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const posthog = usePostHog();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      // Traccia l'evento di logout prima di effettuarlo
      if (session?.user) {
        posthog.capture('user_logout', {
          user_id: session.user.id,
          user_email: session.user.email,
          logout_timestamp: new Date().toISOString()
        });
      }
      
      await signOut();
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  // Crea il callbackUrl per i link di autenticazione
  const createAuthUrl = (authType: 'login' | 'register') => {
    const currentPath = pathname;
    // Non includere callbackUrl se siamo già in una pagina di auth
    if (currentPath.startsWith('/auth/')) {
      return `/auth/${authType}`;
    }
    return `/auth/${authType}?callbackUrl=${encodeURIComponent(currentPath)}`;
  };

  if (isLoading) {
    return (
      <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-full border-b backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066cc]/10">
              <Pill className="h-5 w-5 text-[#0066cc]" />
            </div>
            Farmix
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-muted h-9 w-20 animate-pulse rounded-md"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 border-b shadow-sm backdrop-blur-xs"
          : "bg-transparent"
      }`}
    >
      <div className="flex h-16 w-full items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-bold transition-colors hover:text-[#0066cc]"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0066cc]/10">
            <Pill className="h-5 w-5 text-[#0066cc]" />
          </div>
          Farmix
        </Link>
        <div className="flex items-center gap-3">
          {/* Menu principale */}
          <div className="mr-4 hidden items-center gap-1 md:flex">
            <Link href="/drugs">
              <Button variant="ghost" size="sm">
                Cerca Farmaci
              </Button>
            </Link>
            {session && (
              <Link href="/dashboard/favorites">
                <Button variant="ghost" size="sm">
                  Preferiti
                </Button>
              </Link>
            )}
          </div>

          {!session ? (
            <>
              <Link href={createAuthUrl('login')}>
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href={createAuthUrl('register')}>
                <Button
                  size="sm"
                  className="bg-[#0066cc] hover:bg-[#0066cc]/90"
                >
                  Registrati
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="text-muted-foreground hidden text-sm sm:block">
                Benvenuto,{" "}
                <span className="text-foreground font-semibold">
                  {session.user?.name || session.user?.email}
                </span>
              </div>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
