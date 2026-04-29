"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Lock, CheckCircle } from "lucide-react";
import Nav from "@/components/Nav";
import { useUserState } from "@/hooks/useUserState";

/* ── Types ── */

type Season = "spring" | "summer" | "fall";
type CoverageType = "calculated" | "general";
type Category =
  | "pre-emergent"
  | "weed-control"
  | "fertilizer"
  | "soil-amendment"
  | "insect-control"
  | "fungicide";

interface WhereToBuy {
  store: string;
  url: string;
  primary: boolean;
}

interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory: string;
  description: string;
  labelRate: number | null;
  unit: string | null;
  coverageType: CoverageType;
  coverageNote?: string;
  badges: string[];
  season: Season;
  whereToBuy: WhereToBuy[];
  taskIds: string[];
  isAvailableToFree: boolean;
}

/* ── Product Catalog ── */

const PRODUCTS: Product[] = [
  // PRE-EMERGENT & WEED CONTROL
  {
    id: "prod_001",
    name: "Quali-Pro Prodiamine",
    category: "pre-emergent",
    subcategory: "Pre-Emergent Herbicide",
    description:
      "Professional-grade pre-emergent. The gold standard for KC crabgrass prevention. Split application in March and June.",
    labelRate: 4.3,
    unit: "lbs",
    coverageType: "calculated",
    badges: ["soil-temp-triggered"],
    season: "spring",
    whereToBuy: [
      {
        store: "Amazon",
        // TODO: Replace with affiliate link after Amazon Associates approval
        url: "https://www.amazon.com/dp/PLACEHOLDER",
        primary: true,
      },
      {
        store: "DoMyOwn",
        // TODO: Replace with affiliate link after DoMyOwn approval
        url: "https://www.domyown.com/PLACEHOLDER",
        primary: false,
      },
    ],
    taskIds: ["task_001", "task_006"],
    isAvailableToFree: true,
  },
  {
    id: "prod_002",
    name: "T-Zone Turf Herbicide",
    category: "weed-control",
    subcategory: "Selective Herbicide",
    description:
      "Highly effective broadleaf weed control for Tall Fescue. Targets clover, dandelion, and wild violet without harming grass.",
    labelRate: 1.0,
    unit: "oz",
    coverageType: "calculated",
    badges: ["apply-before-may"],
    season: "spring",
    whereToBuy: [
      {
        store: "Amazon",
        // TODO: Replace with affiliate link after Amazon Associates approval
        url: "https://www.amazon.com/dp/PLACEHOLDER",
        primary: true,
      },
      {
        store: "DoMyOwn",
        // TODO: Replace with affiliate link after DoMyOwn approval
        url: "https://www.domyown.com/PLACEHOLDER",
        primary: false,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },
  {
    id: "prod_003",
    name: "Roundup For Lawns -- Ready to Use",
    category: "weed-control",
    subcategory: "Spot Treatment",
    description:
      "Spot treatment for tough weeds in Tall Fescue. Safe for KC lawns when used as directed. 1 gallon covers targeted areas.",
    labelRate: null,
    unit: null,
    coverageType: "general",
    coverageNote: "1 gallon -- spot treatment use",
    badges: [],
    season: "spring",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/Roundup-For-Lawns1-1-Gallon-Ready-to-Use-Lawn-Weed-Killer/5014441257",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },

  // FERTILIZER -- GRANULAR
  {
    id: "prod_004",
    name: "Sta-Green Fast Acting with Iron",
    category: "fertilizer",
    subcategory: "Granular Fertilizer",
    description:
      "Fast-acting granular with iron for quick green-up. Improves KC clay soil structure. 15 lb covers 5,000 sq ft.",
    labelRate: 3.0,
    unit: "lbs",
    coverageType: "calculated",
    badges: [],
    season: "spring",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/Sta-Green-Fast-Acting-with-Iron-15-lb-5M/5013764393",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },
  {
    id: "prod_005",
    name: "Sta-Green Slow Release 16-0-10",
    category: "fertilizer",
    subcategory: "Granular Fertilizer",
    description:
      "Natural slow-release fertilizer. Low phosphorus formula safe for KC lawns. 20 lb bag covers 4,000 sq ft.",
    labelRate: 5.0,
    unit: "lbs",
    coverageType: "calculated",
    badges: ["slow-release-safe"],
    season: "spring",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/Sta-Green-Slow-Release-20-lb-4000-sq-ft-16-0-10-Natural-All-purpose-Fertilizer/5013683815",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },
  {
    id: "prod_006",
    name: "Sta-Green All Purpose 10-10-10",
    category: "fertilizer",
    subcategory: "Granular Fertilizer",
    description:
      "Balanced all-purpose fertilizer for KC lawns. 40 lb bag covers 5,000 sq ft. Good starter fertilizer after overseeding.",
    labelRate: 8.0,
    unit: "lbs",
    coverageType: "calculated",
    badges: [],
    season: "fall",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/Sta-Green-All-Season-40-lb-5000-sq-ft-10-10-10-All-purpose-Lawn-Starter-Fertilizer/5013291253",
        primary: true,
      },
    ],
    taskIds: ["task_010"],
    isAvailableToFree: true,
  },
  {
    id: "prod_007",
    name: "Sta-Green 29-0-5 Slow Release",
    category: "fertilizer",
    subcategory: "Granular Fertilizer",
    description:
      "High nitrogen slow-release for fall feeding. Builds root mass for winter survival. 11.2 lb covers 4,000 sq ft.",
    labelRate: 2.8,
    unit: "lbs",
    coverageType: "calculated",
    badges: ["fall-window"],
    season: "fall",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/Sta-Green-11-2-lb-4000-sq-ft-29-0-5-Fertilizer/5015305659",
        primary: true,
      },
    ],
    taskIds: ["task_011"],
    isAvailableToFree: true,
  },
  {
    id: "prod_008",
    name: "DARK MATTER 21-0-0 Ammonium Sulfate",
    category: "fertilizer",
    subcategory: "Granular Fertilizer",
    description:
      "Professional-grade ammonium sulfate. Fast green-up with sulfur to lower pH in KC alkaline soils. Small prill for even distribution.",
    labelRate: 4.0,
    unit: "lbs",
    coverageType: "calculated",
    badges: [],
    season: "spring",
    whereToBuy: [
      {
        store: "Amazon",
        // TODO: Replace with affiliate link after Amazon Associates approval
        url: "https://www.amazon.com/dp/PLACEHOLDER",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },
  {
    id: "prod_009",
    name: "7-0-20 Summer Stress Blend",
    category: "fertilizer",
    subcategory: "Granular Fertilizer",
    description:
      "Low nitrogen, high potash summer formula. Builds heat and drought tolerance in KC summers. 45 lb bag covers 15,000 sq ft. Safe for all lawns year-round.",
    labelRate: 3.0,
    unit: "lbs",
    coverageType: "calculated",
    badges: ["summer-window"],
    season: "summer",
    whereToBuy: [
      {
        store: "Amazon",
        // TODO: Replace with affiliate link after Amazon Associates approval
        url: "https://www.amazon.com/dp/PLACEHOLDER",
        primary: true,
      },
    ],
    taskIds: ["task_007"],
    isAvailableToFree: true,
  },

  // FERTILIZER -- LIQUID
  {
    id: "prod_010",
    name: "PetraMax Neighbor's Envy 7-in-1",
    category: "fertilizer",
    subcategory: "Liquid Fertilizer",
    description:
      "7-in-1 liquid concentrate with nitrogen, iron, humic acid, and sea kelp. Deep green results fast. 1 gallon covers up to 16,000 sq ft.",
    labelRate: null,
    unit: null,
    coverageType: "general",
    coverageNote: "1 gallon covers up to 16,000 sq ft",
    badges: [],
    season: "spring",
    whereToBuy: [
      {
        store: "Amazon",
        // TODO: Replace with affiliate link after Amazon Associates approval
        url: "https://www.amazon.com/dp/PLACEHOLDER",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },
  {
    id: "prod_011",
    name: "GS Plant Foods Liquid Humic Acid",
    category: "soil-amendment",
    subcategory: "Soil Amendment",
    description:
      "Organic humic acid to boost nutrient uptake and improve KC clay soil structure. Increases water retention and microbial activity.",
    labelRate: null,
    unit: null,
    coverageType: "general",
    coverageNote: "Follow label for dilution rate",
    badges: [],
    season: "spring",
    whereToBuy: [
      {
        store: "Amazon",
        // TODO: Replace with affiliate link after Amazon Associates approval
        url: "https://www.amazon.com/dp/PLACEHOLDER",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },
  {
    id: "prod_012",
    name: "GS Plant Foods Organic Kelp Fertilizer",
    category: "soil-amendment",
    subcategory: "Soil Amendment",
    description:
      "Natural kelp extract for stress resistance and root development. Works with humic acid to improve KC clay soil biology.",
    labelRate: null,
    unit: null,
    coverageType: "general",
    coverageNote: "Follow label for dilution rate",
    badges: [],
    season: "spring",
    whereToBuy: [
      {
        store: "Amazon",
        // TODO: Replace with affiliate link after Amazon Associates approval
        url: "https://www.amazon.com/dp/PLACEHOLDER",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },

  // INSECT & GRUB CONTROL
  {
    id: "prod_013",
    name: "Scotts GrubEx1 Season Long",
    category: "insect-control",
    subcategory: "Grub Control",
    description:
      "Season-long grub prevention. Apply May-June before Japanese beetles lay eggs. 14.35 lb covers 5,000 sq ft. Most effective preventative in KC.",
    labelRate: 2.87,
    unit: "lbs",
    coverageType: "calculated",
    badges: [],
    season: "spring",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/Scotts-GrubEx1-Season-Long-Grub-Killer-14-35-lb-Grub-Killer/5012921897",
        primary: true,
      },
    ],
    taskIds: ["task_005"],
    isAvailableToFree: true,
  },
  {
    id: "prod_014",
    name: "Spectracide Triazicide Granules",
    category: "insect-control",
    subcategory: "Insect Killer",
    description:
      "Kills 100+ insects including armyworms and billbugs. 10 lb granules for broadcast application. Good summer backup for surface insect pressure.",
    labelRate: 2.0,
    unit: "lbs",
    coverageType: "calculated",
    badges: [],
    season: "summer",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/Spectracide-Triazicide-For-Lawns-Granules-10-lb-Insect-Killer/50236519",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },
  {
    id: "prod_015",
    name: "Spectracide Triazicide Hose End",
    category: "insect-control",
    subcategory: "Insect Killer",
    description:
      "Liquid concentrate hose-end sprayer for fast knockdown of surface insects. 32 oz covers large areas quickly. Use when armyworm pressure is high.",
    labelRate: null,
    unit: null,
    coverageType: "general",
    coverageNote: "32 oz concentrate -- covers large areas",
    badges: [],
    season: "summer",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/Spectracide-Triazicide-For-Lawns-and-Landscapes-32-fl-oz-Concentrate-Insect-Killer/4736723",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },

  // FUNGICIDE
  {
    id: "prod_016",
    name: "Scotts DiseaseEx Lawn Fungicide",
    category: "fungicide",
    subcategory: "Fungicide",
    description:
      "Controls 26 lawn diseases including brown patch -- the #1 KC summer fungal threat. 10 lb covers 5,000 sq ft. Apply preventatively in July humidity.",
    labelRate: 2.0,
    unit: "lbs",
    coverageType: "calculated",
    badges: [],
    season: "summer",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/Scotts-DISEASEEx-Lawn-Fungicide-5-m-6/1000617387",
        primary: true,
      },
    ],
    taskIds: ["task_007"],
    isAvailableToFree: true,
  },
  {
    id: "prod_017",
    name: "BioAdvanced Fungus Control 32oz RTU",
    category: "fungicide",
    subcategory: "Fungicide",
    description:
      "Ready-to-use liquid fungicide for spot treatment of brown patch and dollar spot. No mixing required. 32 oz for targeted application.",
    labelRate: null,
    unit: null,
    coverageType: "general",
    coverageNote: "32 oz ready to use -- spot treatment",
    badges: [],
    season: "summer",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/BioAdvanced-Fungus-Control-for-Lawns-32-fl-oz-Fungicide/5014393327",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },
  {
    id: "prod_018",
    name: "BioAdvanced Lawn Fungus Control 10lb",
    category: "fungicide",
    subcategory: "Fungicide",
    description:
      "Granular systemic fungicide for season-long disease protection. 10 lb for broadcast application across the full lawn. Better for widespread pressure.",
    labelRate: 2.0,
    unit: "lbs",
    coverageType: "calculated",
    badges: [],
    season: "summer",
    whereToBuy: [
      {
        store: "Lowe's",
        url: "https://www.lowes.com/pd/BioAdvanced-Lawn-Fungus-Control-10-lb-Lawn-Fungus-Control/3027697",
        primary: true,
      },
    ],
    taskIds: [],
    isAvailableToFree: true,
  },
];

/* ── Filter Config ── */

const CATEGORY_TABS: { value: Category | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pre-emergent", label: "Pre-Emergent" },
  { value: "weed-control", label: "Weed Control" },
  { value: "fertilizer", label: "Fertilizer" },
  { value: "insect-control", label: "Insect Control" },
  { value: "fungicide", label: "Fungicide" },
  { value: "soil-amendment", label: "Soil Amendment" },
];

const SEASON_PILLS: { value: Season | "all"; label: string }[] = [
  { value: "all", label: "All Seasons" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
];

const SEASON_TAG_STYLES: Record<Season, string> = {
  spring: "bg-[#D8F3DC] text-[#1B4332]",
  summer: "bg-[#FEF9C3] text-[#854D0E]",
  fall: "bg-[#FFF0EB] text-[#9A3412]",
};

const CATEGORY_BADGE_STYLES: Record<Category, string> = {
  "pre-emergent": "bg-[#FFF0EB] text-[#F4631E]",
  "weed-control": "bg-[#FFF0EB] text-[#F4631E]",
  fertilizer: "bg-[#D8F3DC] text-[#1B4332]",
  "insect-control": "bg-[#FEF9C3] text-[#854D0E]",
  fungicide: "bg-[#EDE9FE] text-[#6D28D9]",
  "soil-amendment": "bg-[#F0FDF4] text-[#166534]",
};

const CATEGORY_BORDER: Record<Category, string> = {
  "pre-emergent": "border-l-[3px] border-l-[#F4631E]",
  "weed-control": "border-l-[3px] border-l-[#F4631E]",
  fertilizer: "border-l-[3px] border-l-[#52B788]",
  "insect-control": "border-l-[3px] border-l-[#D97706]",
  fungicide: "border-l-[3px] border-l-[#7C3AED]",
  "soil-amendment": "border-l-[3px] border-l-[#16A34A]",
};

/* ── Helpers ── */

function calcQty(lawnSqft: number, labelRate: number): number {
  return Math.round((lawnSqft / 1000) * labelRate * 10) / 10;
}

/* ── Component ── */

export default function ProductsPage() {
  const { isPaid, lawnSqft } = useUserState();
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [activeSeason, setActiveSeason] = useState<Season | "all">("all");

  const filtered = PRODUCTS.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (activeSeason !== "all" && p.season !== activeSeason) return false;
    return true;
  });

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="pb-5 mb-5 border-b-2 border-border">
          <h1 className="font-display text-hero text-forest text-center">
            KC Lawn Care Products
          </h1>
          <p className="text-sm text-muted text-center mt-2 max-w-lg mx-auto">
            Products tested for Zone 6a &middot; KC clay soil &middot; Quantities calculated for your lawn
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="mt-8 flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveCategory(tab.value)}
              className={`whitespace-nowrap rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                activeCategory === tab.value
                  ? "border-b-2 border-lime text-forest font-medium"
                  : "text-muted hover:text-charcoal"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Season filter pills */}
        <div className="mt-3 flex gap-2">
          {SEASON_PILLS.map((pill) => (
            <button
              key={pill.value}
              onClick={() => setActiveSeason(pill.value)}
              className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                activeSeason === pill.value
                  ? "bg-forest text-white"
                  : "bg-cream text-muted hover:bg-lime-light"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Upgrade nudge for guest/free */}
        {!isPaid && (
          <div className="mt-6 mb-6 rounded-xl border border-border border-l-4 border-l-orange bg-white px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Lock size={16} className="text-orange" />
              <span className="font-display text-xl text-forest uppercase">
                See Exact Quantities for Your Lawn
              </span>
            </div>
            <p className="text-[13px] text-muted">
              Unlock your plan to see product amounts calculated for your specific lawn size.
            </p>
            <Link
              href="/plan"
              className="mt-3 block w-full text-center rounded-xl bg-orange px-5 py-2.5 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
            >
              Unlock Full Plan -- $67 &rarr;
            </Link>
          </div>
        )}

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="font-display text-2xl text-forest">
              No Products in This Category
            </p>
            <p className="text-sm text-muted mt-2">
              Try selecting a different category or season.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {filtered.map((product) => (
              <div
                key={product.id}
                className={`rounded-xl border border-border bg-white p-5 flex flex-col transition-all duration-150 hover:shadow-[0_4px_16px_rgba(27,67,50,0.1)] hover:border-lime ${CATEGORY_BORDER[product.category]}`}
              >
                {/* Top row: subcategory badge + season tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${CATEGORY_BADGE_STYLES[product.category]}`}>
                    {product.subcategory}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${SEASON_TAG_STYLES[product.season]}`}>
                    {product.season}
                  </span>
                </div>

                {/* Product name */}
                <h3 className="font-display text-lg text-forest leading-tight mb-2">
                  {product.name}
                </h3>

                {/* Description */}
                <p className="text-[13px] text-muted leading-relaxed flex-1 mb-3">
                  {product.description}
                </p>

                {/* Task linkage */}
                {product.taskIds.length > 0 && (
                  <div className="flex items-center gap-1 mb-3">
                    <CheckCircle size={12} className="text-lime" />
                    <span className="font-mono text-[11px] text-lime">
                      In your task checklist
                    </span>
                  </div>
                )}

                {/* Quantity section */}
                {product.coverageType === "calculated" ? (
                  <div className="rounded-lg bg-cream border border-border px-3 py-2 flex items-center justify-between my-3">
                    {!isPaid ? (
                      <>
                        <span className="font-mono text-[10px] text-muted uppercase tracking-wide">
                          For your lawn
                        </span>
                        <span className="flex items-center gap-1 font-mono text-xs text-muted">
                          <Lock size={12} />
                          Unlock to calculate
                        </span>
                      </>
                    ) : lawnSqft ? (
                      <>
                        <span className="font-mono text-[10px] text-forest uppercase tracking-wide">
                          For your {lawnSqft.toLocaleString()} sq ft
                        </span>
                        <span className="font-display text-xl text-lime">
                          {calcQty(lawnSqft, product.labelRate!)} {product.unit}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-mono text-[10px] text-muted uppercase tracking-wide">
                          Quantity
                        </span>
                        <Link
                          href="/onboarding?step=3"
                          className="font-mono text-xs text-lime hover:text-forest transition-colors"
                        >
                          Add your lawn size &rarr;
                        </Link>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg bg-cream border border-border px-3 py-2 flex items-center justify-between my-3">
                    <span className="font-mono text-[10px] text-muted uppercase tracking-wide">
                      Coverage
                    </span>
                    <span className="font-mono text-xs text-forest">
                      {product.coverageNote}
                    </span>
                  </div>
                )}

                {/* Where to buy */}
                <div className="flex flex-wrap gap-2 mt-auto pt-1">
                  {product.whereToBuy.map((source) => (
                    <a
                      key={source.store}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-1 rounded-full text-xs transition-colors ${
                        source.primary
                          ? "bg-forest text-white hover:bg-forest/90 px-3.5 py-1.5"
                          : "bg-transparent text-muted border border-border hover:bg-cream px-3.5 py-1.5"
                      }`}
                    >
                      <ExternalLink size={10} />
                      {source.store}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Affiliate disclosure */}
        <p className="text-xs text-muted text-center mt-16 mb-8">
          Some links on this page are affiliate links. We only recommend products we&apos;d use on our own lawn.
        </p>
      </main>
    </>
  );
}
