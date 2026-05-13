// client/src/components/layout/ProtectedRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// ─── Loading Spinner ──────────────────────────────────────────────────────────
// Shown while the session check is in-flight (first paint only).

function AuthLoadingScreen() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FAF6F0',
        gap: '1rem',
      }}
    >
      {/* Pulsing floral mark */}
      <div
        style={{
          fontSize: '2rem',
          animation: 'floralPulse 1.4s ease-in-out infinite',
        }}
      >
        🌸
      </div>
      <p
        style={{
          fontSize: '0.8125rem',
          color: '#C4717A',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Verifying session…
      </p>

      <style>{`
        @keyframes floralPulse {
          0%, 100% { opacity: 1;   transform: scale(1);    }
          50%       { opacity: 0.5; transform: scale(0.88); }
        }
      `}</style>
    </div>
  );
}

// ─── Protected Route ──────────────────────────────────────────────────────────

const ProtectedRoute: React.FC = () => {
  const { status } = useAuth();

  if (status === 'loading')           return <AuthLoadingScreen />;
  if (status === 'unauthenticated')   return <Navigate to="/" replace />;

  return <Outlet />;
};

export default ProtectedRoute;