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

import { Loader2, X } from "lucide-react";

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

  return (
    <Card className="z-50 max-w-md rounded-xl border border-white/20 bg-white/20 shadow-xl backdrop-blur-xs">
      <CardHeader>
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
                    
                    // Redirect manuale con supporto per callbackUrl
                    router.push(callbackUrl);
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
