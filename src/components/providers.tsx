"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";
import { authClient } from "../lib/auth-client";
import { getCookieConsent } from "./cookie-banner";
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

// Hook per identificare l'utente in PostHog quando la sessione è disponibile
export const usePostHogIdentify = () => {
  const session = authClient.useSession();
  
  useEffect(() => {
    if (session.data?.user && !session.isPending) {
      posthog.identify(session.data.user.id, {
        email: session.data.user.email,
        name: session.data.user.name,
        login_timestamp: new Date().toISOString()
      });
    }
  }, [session.data, session.isPending]);
};

// Componente per identificare l'utente in PostHog
export function PostHogIdentifier() {
  usePostHogIdentify();
  return null;
}

// Provider che inizializza e fornisce PostHog al client
export function PostHogProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Determina la modalità di persistenza basata sul consenso dell'utente
    const consent = getCookieConsent();
    const persistence = consent === 'yes' ? 'localStorage+cookie' : 'memory';
    
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: "/ingest",
      ui_host: "https://eu.posthog.com",
      defaults: "2025-05-24",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
      persistence, // Configura la persistenza basata sul consenso
      // Se è solo 'essential', disabilita l'autocapture
      autocapture: consent === 'essential' ? false : undefined,
    });
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

// Provider semplificato che usa Better Auth internamente e PostHog
export function Providers({ children }: { children: ReactNode }) {
  return (
    <PostHogProvider>
      <PostHogIdentifier />
      {children}
    </PostHogProvider>
  );
}
