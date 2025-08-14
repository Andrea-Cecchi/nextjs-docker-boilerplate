"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Lock } from "lucide-react";
import { authClient } from "~/lib/auth-client";

export function PasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage("Tutti i campi sono obbligatori");
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Le nuove password non coincidono");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setMessage("La nuova password deve essere di almeno 8 caratteri");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
      });

      if (error) {
        setMessage(error.message || "Errore durante il cambio password");
      } else {
        setMessage("Password cambiata con successo!");
        // Reset form
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      setMessage("Errore di connessione");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cambia Password</CardTitle>
        <CardDescription>
          Aggiorna la tua password per mantenere sicuro l'account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Password Attuale</Label>
            <Input
              id="current-password"
              name="currentPassword"
              type="password"
              placeholder="Inserisci la password attuale"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nuova Password</Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              placeholder="Inserisci la nuova password"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Conferma Password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Conferma la nuova password"
              required
            />
          </div>
          {message && (
            <div className={`text-sm ${message.includes("successo") ? "text-green-600" : "text-red-600"}`}>
              {message}
            </div>
          )}
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-[#0066cc] hover:bg-[#0066cc]/90"
          >
            <Lock className="h-4 w-4 mr-2" />
            {isLoading ? "Cambiando..." : "Cambia Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
