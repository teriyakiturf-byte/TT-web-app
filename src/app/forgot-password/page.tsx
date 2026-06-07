"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import Nav from "@/components/Nav";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <Nav userState="guest" />
      <main className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl bg-cream border-t-4 border-forest p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-lime mx-auto mb-4" />
              <h1 className="font-display text-[28px] text-forest uppercase">
                Check Your Email
              </h1>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                We sent a password reset link to{" "}
                <strong className="text-charcoal">{email}</strong>. Check
                your inbox and spam folder.
              </p>
              <p className="text-sm text-muted mt-4">
                The link expires in 1 hour.
              </p>
              <Link
                href="/signin"
                className="inline-block mt-6 text-sm text-lime hover:text-forest underline"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-[32px] text-forest uppercase">
                Forgot Password
              </h1>
              <p className="text-sm text-muted mt-1">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Email address"
                  required
                  className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 focus:outline-none focus:border-lime transition-colors"
                />

                {error && <p className="text-sm text-orange">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    "Send Reset Link →"
                  )}
                </button>
              </form>

              <p className="text-xs text-muted mt-4 text-center">
                Remember your password?{" "}
                <Link
                  href="/signin"
                  className="text-lime hover:text-forest underline"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </>
  );
}
