import React from 'react';

interface PasswordResetEmailProps {
  userName: string;
  resetUrl: string;
}

export default function PasswordResetEmail({ userName, resetUrl }: PasswordResetEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#2563eb', margin: '0' }}>Farmix</h1>
      </div>
      
      <div style={{ padding: '40px 20px', backgroundColor: '#ffffff' }}>
        <h2 style={{ color: '#1f2937', marginBottom: '20px' }}>
          Ciao {userName}!
        </h2>
        
        <p style={{ color: '#4b5563', fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          Hai richiesto il reset della tua password per Farmix. Clicca sul pulsante qui sotto per 
          impostare una nuova password e continuare ad utilizzare la nostra piattaforma.
        </p>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a 
            href={resetUrl}
            style={{
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              display: 'inline-block',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Reset Password
          </a>
        </div>
        
        <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.5' }}>
          Se il pulsante non funziona, puoi copiare e incollare il seguente link nel tuo browser:
        </p>
        
        <p style={{ 
          color: '#2563eb', 
          fontSize: '14px', 
          wordBreak: 'break-all',
          backgroundColor: '#f3f4f6',
          padding: '10px',
          borderRadius: '4px'
        }}>
          {resetUrl}
        </p>
        
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '30px' }}>
          Questo link scadrà tra 1 ora per motivi di sicurezza.
        </p>
        
        <div style={{ 
          backgroundColor: '#fef3c7', 
          border: '1px solid #f59e0b', 
          borderRadius: '6px',
          padding: '15px',
          marginTop: '30px'
        }}>
          <p style={{ color: '#92400e', fontSize: '14px', margin: '0', fontWeight: 'bold' }}>
            ⚠️ Importante per la sicurezza
          </p>
          <p style={{ color: '#92400e', fontSize: '14px', margin: '10px 0 0 0' }}>
            Se non hai richiesto il reset della password, ignora questa email. 
            La tua password rimarrà invariata.
          </p>
        </div>
      </div>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>
          Per domande o supporto, contatta il nostro team.
        </p>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: '10px 0 0 0' }}>
          © 2024 Farmix. Tutti i diritti riservati.
        </p>
      </div>
    </div>
  );
}
