"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import Nav from "@/components/Nav";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");

  if (!token) {
    return (
      <>
        <Nav userState="guest" />
        <main className="mx-auto max-w-md px-4 py-12">
          <div className="rounded-2xl bg-cream border-t-4 border-forest p-6 shadow-sm text-center">
            <h1 className="font-display text-[28px] text-forest uppercase">
              Invalid Reset Link
            </h1>
            <p className="text-sm text-muted mt-2">
              This password reset link is invalid or has expired.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block mt-4 text-sm text-lime hover:text-forest underline"
            >
              Request a new reset link
            </Link>
          </div>
        </main>
      </>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    if (password.length < 8) {
      setFieldError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setFieldError("Passwords do not match");
      return;
    }

    setError("");
    setFieldError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === "TOKEN_EXPIRED") {
          setError(
            "This reset link has expired. Please request a new one."
          );
        } else if (
          data.error === "TOKEN_USED" ||
          data.error === "INVALID_TOKEN"
        ) {
          setError(
            "This reset link has already been used or is invalid."
          );
        } else {
          setError("Something went wrong. Please try again.");
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
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
          {success ? (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-lime mx-auto mb-4" />
              <h1 className="font-display text-[28px] text-forest uppercase">
                Password Updated
              </h1>
              <p className="text-sm text-muted mt-2">
                Your password has been reset. You can now sign in with your
                new password.
              </p>
              <Link
                href="/signin"
                className="inline-block mt-6 rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors"
              >
                Sign In →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-[32px] text-forest uppercase">
                Set New Password
              </h1>
              <p className="text-sm text-muted mt-1">
                Enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldError("");
                  }}
                  placeholder="New password (8+ characters)"
                  required
                  minLength={8}
                  className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 focus:outline-none focus:border-lime transition-colors"
                />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldError("");
                  }}
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                  className="w-full rounded-xl border-2 border-border bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 focus:outline-none focus:border-lime transition-colors"
                />

                {fieldError && (
                  <p className="text-sm text-orange">{fieldError}</p>
                )}
                {error && (
                  <div className="rounded-lg bg-orange/10 border-l-4 border-orange px-4 py-3">
                    <p className="text-sm text-orange">
                      {error}{" "}
                      {(error.includes("expired") ||
                        error.includes("invalid")) && (
                        <Link
                          href="/forgot-password"
                          className="underline text-forest"
                        >
                          Request a new link
                        </Link>
                      )}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Updating...
                    </span>
                  ) : (
                    "Reset Password →"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <Loader2 size={32} className="text-lime animate-spin" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
