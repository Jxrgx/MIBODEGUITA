import React, { useState } from 'react';
import { useAuth } from '../context/auth.jsx';

function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
            <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 38.2 44 33 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
    );
}

export function LoginModal() {
    const { loginWithGoogle } = useAuth();
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setError(null);
        setIsLoading(true);
        try {
            await loginWithGoogle();
        } catch {
            setError("No pudimos iniciar sesión con Google. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="fixed inset-0 z-[3000] flex flex-col items-center justify-center overflow-y-auto bg-primary p-8 font-sans text-center text-white">
            <img
                src="/logo.png"
                alt="Abarrotes Alex"
                width="120"
                height="120"
                className="mb-8 size-30 rounded-pill bg-black object-contain p-0.5 shadow-lg"
            />

            <h1 className="mb-2 text-3xl font-extrabold">¡Bienvenido!</h1>
            <p className="mb-8 max-w-xs text-white/85">
                Haz tu despensa en línea y recibe tu pedido por WhatsApp.
            </p>

            {error && (
                <p role="alert" className="mb-4 max-w-xs rounded-md bg-white/15 px-4 py-2 text-sm">
                    {error}
                </p>
            )}

            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                aria-busy={isLoading}
                className="inline-flex min-h-13 w-full max-w-xs cursor-pointer items-center justify-center gap-3 rounded-pill border-0 bg-white px-6 font-sans font-semibold text-ink shadow-lg transition-transform active:scale-[0.98] disabled:cursor-wait disabled:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
                <GoogleIcon />
                {isLoading ? 'Conectando…' : 'Continuar con Google'}
            </button>
        </main>
    );
}
