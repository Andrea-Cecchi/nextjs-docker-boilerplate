"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Save, Camera } from "lucide-react";
import { updateProfile, updateAvatar } from "~/lib/actions/profile";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(user.image || null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage("");

    try {
      const result = await updateProfile(formData);
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore durante l'aggiornamento");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSubmit = async () => {
    if (!previewImage || previewImage === user.image) {
      setMessage("Seleziona una nuova immagine prima di salvare");
      return;
    }

    setIsUploadingAvatar(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.set("image", previewImage);
      const result = await updateAvatar(formData);
      setMessage(result.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Errore durante l'aggiornamento");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Immagine Profilo</CardTitle>
          <CardDescription>
            Carica una nuova immagine per il tuo profilo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={previewImage || undefined} alt="Avatar" />
              <AvatarFallback className="text-2xl">
                {user.name?.charAt(0)?.toUpperCase() || 
                 user.email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" type="button" asChild>
                  <span>
                    <Camera className="h-4 w-4 mr-2" />
                    Carica Nuova Immagine
                  </span>
                </Button>
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500">
                JPG, PNG o GIF (max 2MB)
              </p>
            </div>
            
            {previewImage && previewImage !== user.image && (
              <Button 
                onClick={handleAvatarSubmit}
                disabled={isUploadingAvatar}
                className="bg-[#0066cc] hover:bg-[#0066cc]/90"
              >
                <Save className="h-4 w-4 mr-2" />
                {isUploadingAvatar ? "Salvando..." : "Salva Immagine"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Informazioni Profilo</CardTitle>
          <CardDescription>
            Aggiorna le tue informazioni personali
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                placeholder="Il tuo nome"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email}
                placeholder="La tua email"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#0066cc] hover:bg-[#0066cc]/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Salvando..." : "Salva Modifiche"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Messages */}
      {message && (
        <div className={`text-sm p-3 rounded-md ${
          message.includes("successo") 
            ? "text-green-700 bg-green-50 border border-green-200" 
            : "text-red-700 bg-red-50 border border-red-200"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}
