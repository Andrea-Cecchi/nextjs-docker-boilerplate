import React from 'react';

interface VerificationEmailProps {
  userName: string;
  verificationUrl: string;
}

export default function VerificationEmail({ userName, verificationUrl }: VerificationEmailProps) {
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
          Grazie per esserti registrato su Farmix. Per completare la registrazione e iniziare a utilizzare 
          la nostra piattaforma per la ricerca di farmaci, devi verificare il tuo indirizzo email.
        </p>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <a 
            href={verificationUrl}
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '6px',
              display: 'inline-block',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Verifica Email
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
          {verificationUrl}
        </p>
        
        <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '30px' }}>
          Questo link scadrà tra 1 ora per motivi di sicurezza.
        </p>
      </div>
      
      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: '0' }}>
          Se non ti sei registrato su Farmix, puoi ignorare questa email.
        </p>
        <p style={{ color: '#6b7280', fontSize: '12px', margin: '10px 0 0 0' }}>
          © 2024 Farmix. Tutti i diritti riservati.
        </p>
      </div>
    </div>
  );
}
