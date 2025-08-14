"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Loader2, Mail, CheckCircle, ArrowLeft, AlertCircle, Pill } from "lucide-react";
import { cn } from "~/lib/utils";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Inserisci il tuo indirizzo email");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authClient.forgetPassword({
        email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      setEmailSent(true);
    } catch (err: any) {
      console.error("Errore durante la richiesta di reset password:", err);
      setError(
        err.message || "Errore durante l'invio dell'email. Riprova più tardi."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Se l'email è stata inviata, mostra il messaggio di successo
  if (emailSent) {
    return (
      <Card className="w-full border-0 shadow-none md:border md:shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex flex-row justify-center text-center gap-4 items-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center *:rounded-lg bg-[#0066cc]/10">
              <Pill className="h-6 w-6 text-[#0066cc]" />
            </div>
            <h1 className="text-xl font-bold text-[#0066cc]">Farmix</h1>
          </div>
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <CardTitle className="text-lg md:text-xl">
            Email di reset inviata
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Controlla la tua casella email per continuare
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span>Email inviata a: <strong>{email}</strong></span>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
            <p className="text-gray-800 font-medium mb-2">Cosa fare ora:</p>
            <ul className="text-gray-700 text-left space-y-1">
              <li>• Controlla la tua casella email</li>
              <li>• <strong>Controlla anche la cartella spam</strong></li>
              <li>• Clicca sul link nell'email per impostare una nuova password</li>
              <li>• Il link scadrà tra 1 ora</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setEmailSent(false)}
              variant="outline"
              className="w-full"
            >
              Invia a un altro indirizzo email
            </Button>
            
            <Link href="/auth/login" className="block">
              <Button variant="ghost" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Torna al login
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-0 shadow-none md:border md:shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <div className="flex flex-col items-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0066cc]/10 mb-2">
            <Pill className="h-6 w-6 text-[#0066cc]" />
          </div>
          <h1 className="text-xl font-bold text-[#0066cc]">Farmix</h1>
        </div>
        <CardTitle className="text-center text-2xl font-semibold">
          Reimposta Password
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Inserisci il tuo indirizzo email e ti invieremo un link per reimpostare la password
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Indirizzo Email
            </Label>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="mario.rossi@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 border-gray-200 pl-10 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mt-0.5 text-red-500" />
              <div className="flex-1">{error}</div>
            </div>
          )}

          <Button
            type="submit"
            className={cn(
              "h-11 w-full bg-blue-600 font-medium text-white hover:bg-blue-700",
              "transform transition-all duration-200 hover:scale-[1.02]",
              "focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Invio in corso...
              </>
            ) : (
              "Invia email di reset"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/auth/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Torna al login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
