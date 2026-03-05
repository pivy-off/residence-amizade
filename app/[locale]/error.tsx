'use client';

import { useEffect } from 'react';

function isChunkLoadError(error: Error): boolean {
  const msg = error?.message ? String(error.message) : '';
  return (
    error?.name === 'ChunkLoadError' ||
    msg.includes('Loading chunk') ||
    msg.includes('ChunkLoadError')
  );
}

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const chunkError = isChunkLoadError(error);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111', marginBottom: 8 }}>
          {chunkError ? 'Page non chargée' : 'Une erreur est survenue'}
        </h1>
        <p style={{ color: '#4b5563', marginBottom: 24 }}>
          {chunkError
            ? 'Le chargement de la page a échoué ou a expiré. Rechargez la page pour réessayer.'
            : "Cette page a rencontré un problème. Vous pouvez réessayer ou retourner à l'accueil."}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          {chunkError ? (
            <button
              type="button"
              onClick={handleReload}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              Recharger la page
            </button>
          ) : (
            <button
              type="button"
              onClick={reset}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 16,
              }}
            >
              Réessayer
            </button>
          )}
          <a
            href="/fr"
            style={{
              padding: '10px 20px',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              color: '#374151',
              textDecoration: 'none',
              fontSize: 16,
            }}
          >
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}
