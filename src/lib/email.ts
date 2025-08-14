import { Resend } from 'resend';
import VerificationEmail from '~/components/emails/verification-email';
import PasswordResetEmail from '~/components/emails/password-reset-email';

// Inizializza il client Resend solo se la chiave API è configurata
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export interface SendVerificationEmailParams {
  to: string;
  userName: string;
  verificationUrl: string;
}

export interface SendPasswordResetEmailParams {
  to: string;
  userName: string;
  resetUrl: string;
}

/**
 * Invia un'email di verifica utilizzando Resend
 */
export async function sendVerificationEmail({
  to,
  userName,
  verificationUrl,
}: SendVerificationEmailParams) {
  if (!resend) {
    console.error('Resend non è configurato. Aggiungi RESEND_API_KEY alle variabili d\'ambiente.');
    throw new Error('Servizio email non configurato');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Farmix <noreply@farmix.com>',
      to: [to],
      subject: 'Verifica il tuo indirizzo email - Farmix',
      react: VerificationEmail({ 
        userName, 
        verificationUrl 
      }),
    });

    if (error) {
      console.error('Errore nell\'invio dell\'email di verifica:', error);
      throw new Error(`Impossibile inviare l'email di verifica: ${error.message}`);
    }

    console.log('Email di verifica inviata con successo:', data);
    return data;
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di verifica:', error);
    throw error;
  }
}

/**
 * Invia un'email per il reset della password utilizzando Resend
 */
export async function sendPasswordResetEmail({
  to,
  userName,
  resetUrl,
}: SendPasswordResetEmailParams) {
  if (!resend) {
    console.error('Resend non è configurato. Aggiungi RESEND_API_KEY alle variabili d\'ambiente.');
    throw new Error('Servizio email non configurato');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'Farmix <noreply@farmix.com>',
      to: [to],
      subject: 'Reset della password - Farmix',
      react: PasswordResetEmail({ 
        userName, 
        resetUrl 
      }),
    });

    if (error) {
      console.error('Errore nell\'invio dell\'email di reset password:', error);
      throw new Error(`Impossibile inviare l'email di reset password: ${error.message}`);
    }

    console.log('Email di reset password inviata con successo:', data);
    return data;
  } catch (error) {
    console.error('Errore nell\'invio dell\'email di reset password:', error);
    throw error;
  }
}
