"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./providers";
import { Pill, User, Settings, Heart, LogOut, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePostHog } from "posthog-js/react";
import { usePathname } from "next/navigation";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Highlighter } from "@/components/magicui/highlighter";

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
      //refreshing the page
      window.location.reload();
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
          <div className="hidden items-center gap-1 md:flex">
            <Link href="/drugs">
              <Button variant="ghost" size="sm">
                <Highlighter action='underline' color='#0066cc'>Esplora</Highlighter>
              </Button>
            </Link>
          </div>
          <Separator orientation="vertical" className="data-[orientation=vertical]:h-4" />
          {!session ? (
            <>
              <Link href={createAuthUrl('login')}>
                <Button className="border-1 border-black bg-transparent text-black dark:text-white hover:bg-white dark:hover:bg-transparent hover:text-black dark:hover:text-white transition-all duration-300" size="sm">
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-9 w-9 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={session.user?.image || ""} />
                    <AvatarFallback className="bg-[#0066cc]/10 text-[#0066cc] font-semibold">
                      {session.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : session.user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">
                    {session.user?.name || "Utente"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session.user?.email}
                  </p>
                </div>
                <Separator />
                <div className="p-1">
                  <Link href="/dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Link href="/dashboard/favorites">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Preferiti
                    </Button>
                  </Link>
                  <Separator className="my-1" />
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </nav>
  );
}
