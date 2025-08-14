"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft, Pill } from "lucide-react";
import { cn } from "~/lib/utils";

export default function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setError("Token di reset mancante o non valido. Richiedi un nuovo link di reset.");
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams]);

  const validatePasswords = () => {
    if (!newPassword) {
      setError("Inserisci la nuova password");
      return false;
    }
    
    if (newPassword.length < 8) {
      setError("La password deve contenere almeno 8 caratteri");
      return false;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Le password non coincidono");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError("Token non valido. Richiedi un nuovo link di reset.");
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await authClient.resetPassword({
        newPassword,
        token,
      });
      
      setSuccess(true);
      
      // Redirect al login dopo 3 secondi
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (err: any) {
      console.error("Errore durante il reset password:", err);
      
      if (err.message?.includes("token")) {
        setError("Token scaduto o non valido. Richiedi un nuovo link di reset password.");
      } else {
        setError(err.message || "Errore durante il reset della password. Riprova più tardi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Se il reset è andato a buon fine
  if (success) {
    return (
      <Card className="w-full border-0 shadow-none md:border md:shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex flex-row justify-center text-center gap-4 items-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0066cc]/10">
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
            Password aggiornata con successo
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Ora puoi accedere con la tua nuova password
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
            <p className="text-gray-800">
              La tua password è stata aggiornata correttamente. 
              Verrai reindirizzato alla pagina di login tra pochi secondi.
            </p>
          </div>

          <Link href="/auth/login" className="block">
            <Button className="w-full">
              Vai al Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  // Se non c'è un token valido
  if (!token && error.includes("Token")) {
    return (
      <Card className="w-full border-0 shadow-none md:border md:shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="flex flex-row justify-center text-center gap-4 items-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0066cc]/10">
              <Pill className="h-6 w-6 text-[#0066cc]" />
            </div>
            <h1 className="text-xl font-bold text-[#0066cc]">Farmix</h1>
          </div>
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full">
              <AlertCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>
          <CardTitle className="text-lg md:text-xl">
            Link non valido
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Il link di reset password non è valido o è scaduto
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
            <p className="text-gray-800">
              Il link di reset password potrebbe essere scaduto o non valido. 
              Richiedi un nuovo link di reset.
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/auth/forgot-password" className="block">
              <Button className="w-full">
                Richiedi nuovo link di reset
              </Button>
            </Link>
            
            <Link href="/auth/login" className="block">
              <Button variant="outline" className="w-full">
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
        <div className="flex flex-row justify-center text-center gap-4 items-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0066cc]/10">
            <Pill className="h-6 w-6 text-[#0066cc]" />
          </div>
          <h1 className="text-xl font-bold text-[#0066cc]">Farmix</h1>
        </div>
        <CardTitle className="text-center text-2xl font-semibold">
          Imposta Nuova Password
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Inserisci la tua nuova password per completare il reset
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700"
            >
              Nuova Password
            </Label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Inserisci la nuova password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
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

          <div className="space-y-2">
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700"
            >
              Conferma Password
            </Label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Conferma la nuova password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                className="h-11 border-gray-200 pr-10 pl-10 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute top-0 right-0 h-11 px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>

          <div className="text-xs text-gray-500">
            La password deve contenere almeno 8 caratteri
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
                Aggiornamento in corso...
              </>
            ) : (
              "Aggiorna Password"
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
