'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'system-ui, sans-serif', background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111', marginBottom: 8 }}>Erreur</h1>
          <p style={{ color: '#4b5563', marginBottom: 24 }}>Une erreur s&apos;est produite. Veuillez réessayer.</p>
          <button
            type="button"
            onClick={() => reset()}
            style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}
          >
            Réessayer
          </button>
          <p style={{ marginTop: 24 }}>
            <a href="/fr" style={{ color: '#2563eb', textDecoration: 'underline' }}>Retour à l&apos;accueil</a>
          </p>
        </div>
      </body>
    </html>
  );
}
