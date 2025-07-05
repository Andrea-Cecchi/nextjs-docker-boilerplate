"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { authClient } from "../../lib/auth-client";
import Link from "next/link";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      }, {
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            setError("Email non verificata. Controlla la tua casella di posta.");
          } else if (ctx.error.status === 401) {
            setError("Credenziali non valide. Controlla email e password.");
          } else {
            setError(ctx.error.message || "Errore durante il login");
          }
        },
        onSuccess: () => {
          router.push("/dashboard");
          router.refresh();
        }
      });

      if (error) {
        setError(error.message || "Errore durante il login");
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
        <CardTitle className="text-2xl font-bold">Login</CardTitle>
        <CardDescription>
          Inserisci le tue credenziali per accedere
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Accesso in corso..." : "Accedi"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Non hai un account?{" "}
          <Link href="/auth/register" className="text-primary hover:underline">
            Registrati
          </Link>
        </div>
      </CardContent>
    </Card>
  );
} 