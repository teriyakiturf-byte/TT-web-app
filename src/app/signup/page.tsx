"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import Nav from "@/components/Nav";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const zipFromUrl = searchParams.get("zip") ?? "";
  const emailFromUrl = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!password || password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleGoogleSignUp() {
    if (googleLoading || loading) return;
    setGoogleLoading(true);

    if (zipFromUrl) localStorage.setItem("tt_zip", zipFromUrl);

    signIn("google", {
      callbackUrl: zipFromUrl
        ? `/onboarding?zip=${zipFromUrl}`
        : "/onboarding",
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || googleLoading) return;
    if (!validate()) return;

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          zipCode: zipFromUrl || null,
          entryPoint: "zip-hook",
        }),
      });

      if (res.status === 409) {
        setFieldErrors({
          email: "An account with this email already exists.",
        });
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      if (zipFromUrl) localStorage.setItem("tt_zip", zipFromUrl);

      const signInResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInResult?.error) {
        setError(
          "Account created but sign in failed. Please sign in manually."
        );
        router.push("/signin");
        return;
      }

      router.push(
        zipFromUrl ? `/onboarding?zip=${zipFromUrl}` : "/onboarding"
      );
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
          <h1 className="font-display text-[32px] text-forest uppercase">
            Create Your Free Account
          </h1>
          <p className="text-sm text-muted mt-1">
            No credit card. Takes 30 seconds.
          </p>

          {zipFromUrl && (
            <div className="mt-3 rounded-lg bg-lime-light px-3 py-2 flex items-center gap-2">
              <span className="font-mono text-xs text-forest">
                Zone data for {zipFromUrl} will be saved to your account
              </span>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg bg-orange/10 border-l-4 border-orange px-4 py-3">
              <p className="text-sm text-orange">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignUp}
            disabled={loading || googleLoading}
            className="mt-5 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-border bg-white px-4 py-3 text-sm font-medium text-charcoal hover:bg-white/80 transition-colors disabled:opacity-50"
          >
            {googleLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                  fill="#4285F4"
                />
                <path
                  d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.26c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
                  fill="#34A853"
                />
                <path
                  d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                  fill="#FBBC05"
                />
                <path
                  d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                  fill="#EA4335"
                />
              </svg>
            )}
            {googleLoading ? "Signing up..." : "Continue with Google"}
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="font-mono text-xs text-muted">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email)
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }}
                onBlur={() => {
                  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      email: "Please enter a valid email address",
                    }));
                  }
                }}
                placeholder="Email address"
                required
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 focus:outline-none transition-colors ${
                  fieldErrors.email
                    ? "border-orange focus:border-orange"
                    : "border-border focus:border-lime"
                }`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-orange mt-1">
                  {fieldErrors.email}
                  {fieldErrors.email.includes("already exists") && (
                    <Link
                      href="/signin"
                      className="text-lime hover:text-forest ml-1 underline"
                    >
                      Sign in
                    </Link>
                  )}
                </p>
              )}
            </div>
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password)
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: undefined,
                    }));
                }}
                onBlur={() => {
                  if (password && password.length < 8) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: "Password must be at least 8 characters",
                    }));
                  }
                }}
                placeholder="Password (8+ characters)"
                required
                minLength={8}
                className={`w-full rounded-xl border-2 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-muted/50 focus:outline-none transition-colors ${
                  fieldErrors.password
                    ? "border-orange focus:border-orange"
                    : "border-border focus:border-lime"
                }`}
              />
              {fieldErrors.password && (
                <p className="text-xs text-orange mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full rounded-xl bg-lime px-6 py-3 font-display text-lg text-white uppercase tracking-wider hover:bg-lime/90 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Free Account →"
              )}
            </button>
          </form>

          <p className="font-mono text-[10px] text-muted mt-3 text-center">
            You&apos;ll receive KC lawn care tips and seasonal alerts.
            Unsubscribe anytime.
          </p>

          <p className="text-xs text-muted mt-4 text-center">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-lime hover:text-forest underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center">
          <Loader2 size={32} className="text-lime animate-spin" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
