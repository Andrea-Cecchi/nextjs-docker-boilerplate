"use client";

import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export function BackButton() {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Torna alla ricerca
    </Button>
  );
}
