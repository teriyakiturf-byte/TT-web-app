import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/plan", label: "The Plan" },
  { href: "/weather", label: "Weather" },
  { href: "/products", label: "Products" },
  { href: "/faq", label: "FAQ" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-forest text-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <Link href="/" className="font-display text-lg tracking-wider">
            Teriyaki Turf
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-6 text-xs text-white/50">
          Built for Kansas City lawns · Zone 6a · KC clay soil. One-time
          payment, no subscription ever.
        </p>
      </div>
    </footer>
  );
}
