"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "./providers";

export function NavBar() {
  const { session, isLoading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Errore durante il logout:", error);
    }
  };

  if (isLoading) {
    return (
      <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="font-bold text-2xl">
            Boilerplate
          </div>
          <div className="flex gap-4 items-center">
            <div className="w-20 h-9 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-bold text-2xl hover:text-primary transition-colors">
          Boilerplate
        </Link>
        <div className="flex gap-3 items-center">
          {!session ? (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm">
                  Registrati
                </Button>
              </Link>
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">
                Benvenuto, <span className="font-semibold text-foreground">{session.user?.name || session.user?.email}</span>
              </div>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                size="sm"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 