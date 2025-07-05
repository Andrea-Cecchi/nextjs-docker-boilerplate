"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { authClient } from "../../lib/auth-client";
import Link from "next/link";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const validateForm = () => {
    if (!name.trim()) {
      setError("Il nome è obbligatorio");
      return false;
    }
    if (!email.trim()) {
      setError("L'email è obbligatoria");
      return false;
    }
    if (password.length < 8) {
      setError("La password deve essere di almeno 8 caratteri");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Le password non coincidono");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
      }, {
        onError: (ctx) => {
          if (ctx.error.status === 409) {
            setError("Un account con questa email esiste già");
          } else if (ctx.error.status === 400) {
            setError("Dati non validi. Controlla i campi inseriti.");
          } else {
            setError(ctx.error.message || "Errore durante la registrazione");
          }
        },
        onSuccess: () => {
          setSuccess("Registrazione completata con successo!");
          // Reindirizzamento automatico gestito dal middleware
          setTimeout(() => {
            router.push("/dashboard");
            router.refresh();
          }, 1000);
        }
      });

      if (error) {
        setError(error.message || "Errore durante la registrazione");
      }
    } catch (err) {
      setError("Errore di connessione. Riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Registrati</CardTitle>
        <CardDescription>
          Crea un nuovo account per iniziare
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Il tuo nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@esempio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password (min 8 caratteri)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Conferma Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Conferma la password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}
          {success && (
            <div className="text-green-500 text-sm bg-green-50 p-2 rounded border border-green-200">
              {success}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registrazione in corso..." : "Registrati"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Hai già un account?{" "}
          <Link href="/auth/login" className="text-primary hover:underline">
            Accedi
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 