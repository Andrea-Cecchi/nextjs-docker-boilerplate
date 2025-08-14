"use client";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { useState } from "react";

import Image from "next/image";

import { Loader2, X, CheckCircle, Mail, Pill } from "lucide-react";

import { signUp, authClient } from "@/lib/auth-client";

import { toast } from "sonner";

import { useRouter, useSearchParams } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");

  const [lastName, setLastName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const posthog = usePostHog();
  
  // Ottieni il callbackUrl dai parametri di ricerca
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  // Se l'email è stata inviata, mostra il messaggio di successo
  if (emailSent) {
    return (
        <Card className="z-50 max-w-md rounded-xl border-0 shadow-none md:border md:border-white/20 md:shadow-xl bg-white/50 backdrop-blur-xs">
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
            Email di verifica inviata
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Controlla la tua casella email per completare la registrazione
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
              <li>• Clicca sul link di verifica nell'email</li>
              <li>• Verrai reindirizzato automaticamente</li>
            </ul>
          </div>

          <div className="text-xs text-gray-500">
            Non hai ricevuto l'email? Controlla la cartella spam o{" "}
            <button 
              onClick={() => setEmailSent(false)}
              className="text-blue-600 hover:underline font-medium"
            >
              riprova la registrazione
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="z-50 max-w-md rounded-xl border-0 shadow-none md:border md:border-white/20 md:shadow-xl bg-white/20 backdrop-blur-xs">
      <CardHeader>
        <div className="flex flex-row justify-center text-center gap-4 items-center mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0066cc]/10">
            <Pill className="h-6 w-6 text-[#0066cc]" />
          </div>
          <h1 className="text-xl font-bold text-[#0066cc]">Farmix</h1>
        </div>
        <CardTitle className="text-lg md:text-xl">Registrati</CardTitle>

        <CardDescription className="text-xs md:text-sm">
          Inserisci i tuoi dati per creare un account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name">Nome</Label>

              <Input
                id="first-name"
                placeholder="Max"
                required
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                value={firstName}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="last-name">Cognome</Label>

              <Input
                id="last-name"
                placeholder="Robinson"
                required
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                value={lastName}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Indirizzo email</Label>

            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Inserisci una password</Label>

            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="Password"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Conferma la password</Label>

            <Input
              id="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
              placeholder="Conferma la password"
            />
          </div>
            

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            onClick={async () => {
              await signUp.email({
                email,

                password,

                name: `${firstName} ${lastName}`,

                image: image ? await convertImageToBase64(image) : "",

                // Better Auth gestirà automaticamente il redirect
                // callbackURL: "/dashboard",

                fetchOptions: {
                  onResponse: () => {
                    setLoading(false);
                  },

                  onRequest: () => {
                    setLoading(true);
                  },

                  onError: (ctx) => {
                    toast.error(ctx.error.message);
                  },

                  onSuccess: async () => {
                    // Traccia l'evento di registrazione
                    posthog.capture('user_registration', {
                      registration_method: 'email',
                      user_email: email,
                      user_name: `${firstName} ${lastName}`,
                      has_profile_image: !!image,
                      callback_url: callbackUrl,
                      timestamp: new Date().toISOString()
                    });
                    
                    // Mostra il messaggio di email inviata invece di fare redirect
                    setEmailSent(true);
                  },
                },
              });
            }}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Crea un account"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result as string);

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}
