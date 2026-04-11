import type { Metadata } from "next";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teriyaki Turf | Kansas City Lawn Care Tools & Zone 6a Calendar",
  description:
    "Free lawn care tools built for Kansas City homeowners. Zone 6a seasonal calendar, KC clay soil guides, Johnson County fertilizer blackout dates, and product calculators.",
  openGraph: {
    title: "Teriyaki Turf – KC Lawn Care Intelligence",
    description:
      "Free tools for Kansas City lawns. Zone 6a calendar, clay soil guides, Johnson County fertilizer laws. Real advice from a real KC homeowner.",
    url: "https://teriyakiturf.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Teriyaki Turf – KC Lawn Care Intelligence",
    description:
      "Hyperlocal lawn care for Kansas City homeowners. Zone 6a. Clay soil. Real talk.",
  },
  metadataBase: new URL("https://teriyakiturf.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-cream text-charcoal">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
