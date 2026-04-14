"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

interface NavProps {
  userState?: "guest" | "free" | "paid";
}

export default function Nav({ userState: userStateProp }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Session takes priority over prop
  const isLoggedIn = !!session?.user;
  const isPaid = isLoggedIn && !!(session.user as any).planPurchased;

  const userState = isLoggedIn
    ? isPaid
      ? "paid"
      : "free"
    : userStateProp ?? "guest";

  return (
    <nav className="sticky top-0 z-40 bg-forest text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-xl tracking-wider">
          Teriyaki Turf
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          {userState === "paid" && (
            <>
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/checklist", label: "Checklist" },
                { href: "/calendar", label: "Calendar" },
                { href: "/milestones", label: "Milestones" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    pathname === link.href
                      ? "text-lime border-b-2 border-lime pb-0.5"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
          <Link
            href="/faq"
            className={`text-sm transition-colors ${
              pathname === "/faq"
                ? "text-lime border-b-2 border-lime pb-0.5"
                : "text-white/80 hover:text-white"
            }`}
          >
            FAQ
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/products"
                className={`text-sm transition-colors ${
                  pathname === "/products"
                    ? "text-lime border-b-2 border-lime pb-0.5"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Teriyaki T Approved
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Sign Out
              </button>
              <Link
                href="/plan"
                className="rounded-full bg-orange px-4 py-1.5 text-sm font-display uppercase tracking-wider hover:bg-orange/90 transition-colors"
              >
                {isPaid ? "My Plan" : "Unlock Plan"}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/plan"
                className="rounded-full bg-orange px-4 py-1.5 text-sm font-display uppercase tracking-wider hover:bg-orange/90 transition-colors"
              >
                Get My Plan
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 px-4 pb-4 space-y-2">
          {userState === "paid" && (
            <>
              {[
                { href: "/dashboard", label: "Dashboard" },
                { href: "/checklist", label: "Checklist" },
                { href: "/calendar", label: "Calendar" },
                { href: "/milestones", label: "Milestones" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block py-2 text-sm ${
                    pathname === link.href ? "text-lime" : "text-white/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </>
          )}
          <Link
            href="/faq"
            className={`block py-2 text-sm ${
              pathname === "/faq" ? "text-lime" : "text-white/80"
            }`}
          >
            FAQ
          </Link>
          {isLoggedIn ? (
            <>
              <Link
                href="/products"
                className={`block py-2 text-sm ${
                  pathname === "/products" ? "text-lime" : "text-white/80"
                }`}
              >
                Teriyaki T Approved
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="block py-2 text-sm text-white/80 text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link href="/signin" className="block py-2 text-sm text-white/80">
              Sign In
            </Link>
          )}
          <Link
            href="/plan"
            className="block w-full text-center rounded-full bg-orange px-4 py-2 text-sm font-display uppercase tracking-wider mt-2"
          >
            {!isLoggedIn
              ? "Get My Plan"
              : isPaid
              ? "My Plan"
              : "Unlock Plan"}
          </Link>
        </div>
      )}
    </nav>
  );
}
