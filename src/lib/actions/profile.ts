"use server";

import { auth } from "@/lib/auth";
import { db } from "~/server/db";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Non autorizzato");
  }

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  if (!name || !email) {
    throw new Error("Nome e email sono obbligatori");
  }

  try {
    // Verifica se l'email è già in uso da un altro utente
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser && existingUser.id !== session.user.id) {
      throw new Error("Email già in uso");
    }

    // Aggiorna l'utente
    await db.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Profilo aggiornato con successo" };
  } catch (error) {
    console.error("Errore aggiornamento profilo:", error);
    throw error;
  }
}

export async function updateAvatar(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Non autorizzato");
  }

  const image = formData.get("image") as string;

  if (!image) {
    throw new Error("Immagine obbligatoria");
  }

  try {
    // Aggiorna solo l'immagine dell'utente
    await db.user.update({
      where: { id: session.user.id },
      data: {
        image,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard");
    return { success: true, message: "Immagine profilo aggiornata con successo" };
  } catch (error) {
    console.error("Errore aggiornamento immagine:", error);
    throw error;
  }
}

export async function deleteAccount() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Non autorizzato");
  }

  try {
    // Elimina tutti i dati correlati all'utente in una transazione
    await db.$transaction(async (tx) => {
      // Elimina i preferiti dell'utente
      await tx.favorite.deleteMany({
        where: { userId: session.user.id },
      });

      // Elimina le sessioni dell'utente
      await tx.session.deleteMany({
        where: { userId: session.user.id },
      });

      // Elimina gli account dell'utente
      await tx.account.deleteMany({
        where: { userId: session.user.id },
      });

      // Infine, elimina l'utente
      await tx.user.delete({
        where: { id: session.user.id },
      });
    });

    // Invalida la sessione corrente
    try {
      await auth.api.signOut({
        headers: await headers(),
      });
    } catch (signOutError) {
      console.error("Errore durante il logout:", signOutError);
      // Continua comunque, l'account è già stato eliminato
    }

    redirect("/");
  } catch (error) {
    console.error("Errore eliminazione account:", error);
    throw error;
  }
}
