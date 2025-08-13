"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/components/providers";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  drugId: string;
  initialIsFavorite?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showText?: boolean;
}

export function FavoriteButton({
  drugId,
  initialIsFavorite = false,
  variant = "ghost",
  size = "icon",
  className,
  showText = false,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { session } = useAuth();
  const router = useRouter();

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      router.push("/auth/login");
      return;
    }

    if (isLoading) return; // Prevent double clicks

    console.log("🔄 Toggling favorite:", { drugId, currentState: isFavorite });
    setIsLoading(true);
    const newState = !isFavorite;

    // Optimistic update
    setIsFavorite(newState);

    try {
      const method = isFavorite ? "DELETE" : "POST";
      console.log("📡 Making API call:", { method, drugId });

      const response = await fetch("/api/favorites", {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ drugId }),
      });

      console.log("📥 API response:", {
        status: response.status,
        ok: response.ok,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        // Revert on error
        setIsFavorite(!newState);
      } else {
        const data = await response.json();
        console.log("✅ API Success:", data);

        // Force page refresh if we're on favorites page
        if (window.location.pathname === "/dashboard/favorites") {
          window.location.reload();
        }
      }
    } catch (error) {
      console.error("💥 Network Error:", error);
      // Revert on error
      setIsFavorite(!newState);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={cn(
        "transition-colors",
        isFavorite
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500",
        className,
      )}
      title={isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
    >
      <Heart
        className={cn(
          "h-4 w-4",
          isFavorite && "fill-current",
          showText && "mr-2",
        )}
      />
      {showText && (
        <span className="text-sm">{isFavorite ? "Preferito" : "Aggiungi"}</span>
      )}
    </Button>
  );
}
