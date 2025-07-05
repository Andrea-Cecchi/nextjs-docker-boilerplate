"use client";

import { authClient } from "../lib/auth-client";
import type { ReactNode } from "react";

// Esportiamo l'hook useAuth direttamente da Better Auth
export const useAuth = () => {
  const session = authClient.useSession();
  const signOut = authClient.signOut;
  
  return {
    session: session.data,
    isLoading: session.isPending,
    signOut,
  };
};

// Provider semplificato che usa Better Auth internamente
export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
    </>
  );
} 