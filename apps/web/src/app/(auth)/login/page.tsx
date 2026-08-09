'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.7 35 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.5 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.6 5.6C41.5 36.5 44 30.8 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  async function continueAsGuest() {
    setLoading(true);
    await fetch(`${apiUrl}/auth/guest`, { method: 'POST', credentials: 'include' });
    router.push('/tasks');
  }

  function loginWithGoogle() {
    window.location.href = `${apiUrl}/auth/google`;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center">
          <span className="text-white text-xs">▲</span>
        </div>
        <span className="font-semibold text-sm">Pyramid</span>
      </div>

      <div className="w-full max-w-sm border border-gray-200 rounded-2xl p-6">
        <h1 className="text-center font-semibold text-lg mb-1">Let&apos;s get back on track</h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Enter your email below to login to your account.
        </p>

        <Button
          onClick={continueAsGuest}
          disabled={loading}
          className="w-full rounded-full bg-black text-white hover:bg-gray-800 mb-2"
        >
          {loading ? 'Loading...' : 'Continue as Guest'}
        </Button>

        <Button
          onClick={loginWithGoogle}
          variant="outline"
          className="w-full rounded-full border-gray-200"
        >
          <GoogleIcon />
          <span className="ml-2">Login with Google</span>
        </Button>
      </div>

      <p className="text-center text-xs text-gray-400 mt-4 max-w-xs">
        By clicking continue, you agree to our{' '}
        <a href="#" className="underline">Terms of Service</a> and{' '}
        <a href="#" className="underline">Privacy Policy</a>
      </p>
    </div>
  );
}