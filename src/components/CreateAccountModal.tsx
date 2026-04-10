"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: (email: string) => void;
}

export default function CreateAccountModal({
  isOpen,
  onClose,
  onAccountCreated,
}: CreateAccountModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // TODO: Wire up real auth
    await new Promise((r) => setTimeout(r, 800));
    onAccountCreated(email);
    setLoading(false);
  }

  async function handleGoogleAuth() {
    // TODO: Wire up Google OAuth
    onAccountCreated("google-user@gmail.com");
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 px-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-charcoal"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <h2 className="font-display text-3xl text-forest uppercase">
          Save Your Lawn Data
        </h2>
        <p className="text-sm text-muted mt-1">
          Free account. No credit card. Takes 30 seconds.
        </p>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleAuth}
          className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-border bg-white px-4 py-3 text-sm font-medium text-charcoal hover:bg-cream transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Email/Password form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            required
            className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 focus:border-lime focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            minLength={8}
            className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 focus:border-lime focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Account…" : "Create Free Account →"}
          </button>
        </form>

        <p className="font-mono text-[10px] text-muted mt-3">
          You&apos;ll receive KC lawn care tips and seasonal alerts. Unsubscribe
          anytime.
        </p>

        <p className="text-xs text-muted mt-4 text-center">
          Already have an account?{" "}
          <button className="text-lime hover:text-forest underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
