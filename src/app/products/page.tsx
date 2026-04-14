"use client";

import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import Nav from "@/components/Nav";
import { useUserState } from "@/hooks/useUserState";

/* ── Product data ── */

interface Product {
  name: string;
  description: string;
  retailer: string;
  link: string;
  badge?: "KC Clay Approved" | "Zone 6a Pick";
}

interface Section {
  title: string;
  products: Product[];
}

const SECTIONS: Section[] = [
  {
    title: "Spring Essentials",
    products: [
      {
        name: "Scotts Turf Builder Pre-Emergent",
        description:
          "Applied before soil hits 55\u00B0F, this is your first defense against crabgrass in KC clay.",
        retailer: "DoMyOwn",
        link: "#",
        badge: "KC Clay Approved",
      },
      {
        name: "Starter Fertilizer 12-12-12",
        description:
          "High phosphorus formula jumpstarts root development in compacted Johnson County soil.",
        retailer: "Amazon",
        link: "#",
        badge: "Zone 6a Pick",
      },
      {
        name: "Scotts Elite Spreader",
        description:
          "EdgeGuard tech prevents fertilizer drift onto driveways \u2014 essential for smaller KC lots.",
        retailer: "Home Depot",
        link: "#",
      },
    ],
  },
  {
    title: "Renovation Tools",
    products: [
      {
        name: "Luster Leaf Soil Test Kit",
        description:
          "Test your KC clay before you spend a dollar on amendments \u2014 know your pH first.",
        retailer: "Amazon",
        link: "#",
        badge: "KC Clay Approved",
      },
      {
        name: "Yard Butler Plug Aerator",
        description:
          "Core aeration breaks up compacted clay and lets water and nutrients actually reach the roots.",
        retailer: "Amazon",
        link: "#",
        badge: "KC Clay Approved",
      },
      {
        name: "Jonathan Green Black Beauty Tall Fescue",
        description:
          "The gold standard cool-season seed blend for Zone 6a renovation. Germinates well in KC fall temps.",
        retailer: "DoMyOwn",
        link: "#",
        badge: "Zone 6a Pick",
      },
    ],
  },
  {
    title: "Fall Must-Haves",
    products: [
      {
        name: "Pennington Smart Seed Tall Fescue",
        description:
          "Fall is the best time to overseed in Zone 6a \u2014 this blend handles KC\u2019s freeze-thaw cycles.",
        retailer: "Amazon",
        link: "#",
        badge: "Zone 6a Pick",
      },
      {
        name: "Milorganite 32-lb Bag",
        description:
          "Slow-release organic nitrogen won\u2019t burn your lawn going into dormancy. A KC fall staple.",
        retailer: "Home Depot",
        link: "#",
      },
      {
        name: "Sun Joe Electric Dethatcher",
        description:
          "Remove thatch buildup before overseeding so seed makes soil contact. Critical step most KC homeowners skip.",
        retailer: "Home Depot",
        link: "#",
      },
    ],
  },
];

/* ── Component ── */

export default function ProductsPage() {
  const router = useRouter();
  const { isGuest, loading } = useUserState();

  // Route protection: guests → sign in, free + paid → allowed
  if (!loading && isGuest && typeof window !== "undefined") {
    router.push("/signin");
  }

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <h1 className="font-display text-hero text-forest text-center">
          Products We Trust on KC Clay
        </h1>
        <p className="text-sm text-muted text-center mt-2 max-w-lg mx-auto">
          Every product here is something we use on our own Zone 6a lawn. Curated for KC soil, KC temps, KC results.
        </p>

        {/* Sections */}
        {SECTIONS.map((section) => (
          <section key={section.title} className="mt-12">
            <h2 className="font-display text-2xl text-forest mb-4">
              {section.title}
            </h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.products.map((product) => (
                <div
                  key={product.name}
                  className="rounded-xl border border-forest bg-cream p-5 flex flex-col"
                >
                  {/* Badge */}
                  {product.badge && (
                    <span className="inline-block self-start rounded-full bg-lime px-3 py-0.5 font-mono text-[10px] text-white uppercase tracking-wider mb-3">
                      {product.badge}
                    </span>
                  )}

                  {/* Name */}
                  <h3 className="font-display text-lg text-forest leading-tight">
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted mt-2 leading-relaxed flex-1">
                    {product.description}
                  </p>

                  {/* CTA */}
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-orange px-4 py-2.5 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
                  >
                    View on {product.retailer}
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Affiliate disclosure */}
        <p className="text-xs text-muted text-center mt-16 mb-8">
          Some links on this page are affiliate links. We only recommend products we&apos;d use on our own lawn.
        </p>
      </main>
    </>
  );
}
