"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { authClient } from "../../lib/auth-client";
import Link from "next/link";
import { Loader2, Eye, EyeOff, Mail, Lock, AlertCircle, Send, Pill } from "lucide-react";
import { cn } from "~/lib/utils";
import { usePostHog } from "posthog-js/react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const posthog = usePostHog();
  
  // Ottieni il callbackUrl dai parametri di ricerca
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setEmailNotVerified(false);

    try {
      const { data, error } = await authClient.signIn.email(
        {
          email,
          password,
        },
        {
          onError: (ctx) => {
            if (ctx.error.status === 403) {
              setEmailNotVerified(true);
              setError("Email non verificata. Devi verificare il tuo indirizzo email prima di accedere.");
            } else if (ctx.error.status === 401) {
              setError("Credenziali non valide. Controlla email e password.");
            } else {
              setError(ctx.error.message || "Errore durante il login");
            }
          },
          onSuccess: () => {
            // Traccia l'evento di login con l'email
            posthog.capture('user_login', {
              login_method: 'email',
              user_email: email,
              callback_url: callbackUrl,
              timestamp: new Date().toISOString()
            });
            
            // Redirect manuale con supporto per callbackUrl
            router.push(callbackUrl);
            router.refresh();
          },
        },
      );

      if (error) {
        setError(error.message || "Errore durante il login");
      }
    } catch (err) {
      setError("Errore di connessione. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      setError("Inserisci il tuo indirizzo email per rinviare l'email di verifica.");
      return;
    }

    setResendingEmail(true);
    try {
      await authClient.sendVerificationEmail({
        email,
        callbackURL: callbackUrl,
      });
      
      setError("");
      setEmailNotVerified(false);
      // Mostra un messaggio di successo
      setError("✅ Email di verifica inviata! Controlla la tua casella di posta e la cartella spam.");
    } catch (error) {
      setError("Errore nell'invio dell'email di verifica. Riprova più tardi.");
    } finally {
      setResendingEmail(false);
    }
  };

  const signInWithGoogle = async () => {
    console.log("signInWithGoogle");
    try {
      const data = await authClient.signIn.social({
        provider: "google",
      });
      
      // Traccia l'evento di login con Google
      posthog.capture('user_login', {
        login_method: 'google',
        user_email: email, // Potrebbe essere vuoto, ma lo includiamo per consistenza
        callback_url: callbackUrl,
        timestamp: new Date().toISOString()
      });
      
      // Redirect manuale con supporto per callbackUrl
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error("Errore durante il login con Google:", error);
      setError("Errore durante il login con Google. Riprova più tardi.");
    }
  };

  return (
    <Card className="w-full border-0 shadow-none md:border md:shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex flex-row justify-center text-center gap-4 items-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0066cc]/10">
            <Pill className="h-6 w-6 text-[#0066cc]" />
          </div>
          <h1 className="text-xl font-bold text-[#0066cc]">Farmix</h1>
        </div>
        <CardTitle className="text-center text-2xl font-semibold">
          Accedi al tuo account
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Inserisci le tue credenziali per accedere
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="nome@esempio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 border-gray-200 pl-10 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 border-gray-200 pr-10 pl-10 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-11 px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              Password dimenticata?
            </Link>
          </div>

          {error && (
            <div className={cn(
              "rounded-lg border p-3 text-sm",
              error.startsWith("✅") 
                ? "border-gray-200 bg-gray-50 text-gray-600"
                : "border-red-200 bg-red-50 text-red-600"
            )}>
              <div className="flex items-start gap-2">
                {error.startsWith("✅") ? (
                  <div className="h-2 w-2 mt-2 rounded-full bg-gray-500"></div>
                ) : (
                  <AlertCircle className="h-4 w-4 mt-0.5 text-red-500" />
                )}
                <div className="flex-1">
                  {error}
                  {emailNotVerified && (
                    <div className="mt-3">
                      <button
                        onClick={resendVerificationEmail}
                        disabled={resendingEmail}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        {resendingEmail ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                        {resendingEmail ? "Invio in corso..." : "Rinvia email di verifica"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className={cn(
              "h-11 w-full bg-blue-600 font-medium text-white hover:bg-blue-700",
              "transform transition-all duration-200 hover:scale-[1.02]",
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Accesso in corso...
              </>
            ) : (
              "Accedi"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Oppure</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-11 w-full border-gray-200 hover:bg-gray-50"
            disabled={isLoading}
            onClick={signInWithGoogle}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Accedi con Google
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Non hai un account?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            Registrati
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
