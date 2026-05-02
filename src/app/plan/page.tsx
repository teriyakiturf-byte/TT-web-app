"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
import Nav from "@/components/Nav";
import UnlockModal from "@/components/ui/UnlockModal";
import KCComplianceBadge from "@/components/ui/KCComplianceBadge";
import { useUserState } from "@/hooks/useUserState";
import { useWeather } from "@/hooks/useWeather";
import type { ComplianceBadgeType } from "@/types";

interface PlanTask {
  id: string;
  name: string;
  product: string;
  dateRange: string;
  whyContext: string;
  badges: ComplianceBadgeType[];
}

const TASKS: PlanTask[] = [
  {
    id: "task_001",
    name: "Apply Pre-Emergent (Split App #1)",
    product: "Prodiamine 65 WDG",
    dateRange: "Mar 15 – Apr 1",
    whyContext:
      "Soil temps in KC are crossing 55°F — your crabgrass pre-emergent window is closing. Prodiamine creates a chemical barrier that prevents crabgrass seeds from germinating.",
    badges: ["soil-temp-triggered"],
  },
  {
    id: "task_002",
    name: "First Mow — Set Height to 3.5″",
    product: "Mower blade sharpened",
    dateRange: "When grass hits 4″",
    whyContext:
      "First mow of the season sets the tone for the year. A sharp blade prevents tearing and disease entry points.",
    badges: [],
  },
  {
    id: "task_003",
    name: "Broadleaf Weed Spray",
    product: "Trimec Classic",
    dateRange: "Apr 15 – May 1",
    whyContext:
      "Dandelions and clover are actively growing now. Trimec works best on young, actively growing broadleaf weeds before they set seed.",
    badges: ["apply-before-may"],
  },
  {
    id: "task_004",
    name: "Spring Fertilizer Application",
    product: "Milorganite 6-4-0",
    dateRange: "May 1 – May 15",
    whyContext:
      "Your tall fescue is hitting peak spring growth. Milorganite's slow-release nitrogen feeds roots without burning blades or pushing top growth too fast.",
    badges: ["slow-release-safe"],
  },
  {
    id: "task_005",
    name: "Grub Preventative",
    product: "GrubEx (Chlorantraniliprole)",
    dateRange: "May 15 – Jun 1",
    whyContext:
      "Adult Japanese beetles are about to lay eggs. Apply now to disrupt the grub cycle before they damage roots in late summer.",
    badges: [],
  },
];

const PREVIEW_IDS = ["task_001", "task_003", "task_004"];

const HERO_STATS = [
  { value: "14", label: "Tasks" },
  { value: "8", label: "Products" },
  { value: "Full Year", label: "Coverage" },
  { value: "$67", label: "One-time" },
];

const VALUE_ITEMS = [
  "14 tasks — full year, every season",
  "Exact product quantities for your lawn size",
  "Week-by-week KC timing based on soil temps",
  "Task completion tracking",
  "Full year calendar view",
  "KC context on every task — why it matters now",
  "Milestone alerts — soil temp triggers and overseeding window",
  "~$187–$746/yr saved vs. hiring out",
  "Lifetime access — one-time payment",
];

const SAVINGS_FIGURES = [
  { label: "TruGreen/yr", value: "~$527", color: "#6B7B70", sub: "avg KC service" },
  { label: "DIY w/ plan/yr", value: "~$154", color: "#52B788", sub: "products only" },
  { label: "You save/yr", value: "~$373", color: "#F4631E", sub: "every year" },
];

export default function PlanPage() {
  const router = useRouter();
  const { loading, isPaid, isFree, lawnSqft, email } = useUserState();
  const { weather } = useWeather();
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (!loading && isPaid) router.replace("/dashboard");
  }, [loading, isPaid, router]);

  async function handleStripeCheckout() {
    if (checkoutLoading) return;
    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email || undefined,
          lawnSqft: lawnSqft || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.error === "STRIPE_NOT_CONFIGURED") {
          alert("Stripe is not configured yet. Payment will be available soon.");
        }
        setCheckoutLoading(false);
        return;
      }

      const { checkoutUrl } = await res.json();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch {
      alert("Something went wrong. Please try again.");
      setCheckoutLoading(false);
    }
  }

  if (loading || isPaid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <Loader2 size={32} className="animate-spin text-forest" />
      </div>
    );
  }

  const navState = isFree ? "free" : "guest";
  const previewTasks = PREVIEW_IDS.map((id) => TASKS.find((t) => t.id === id)).filter(
    (t): t is PlanTask => Boolean(t)
  );
  const showUrgency =
    weather?.soilTempStatus === "pre-emergent" || weather?.soilTempStatus === "closing";

  const chipStyle: React.CSSProperties = {
    background: "#D8F3DC",
    color: "#1B4332",
    fontFamily: "DM Mono",
    fontSize: "12px",
    padding: "4px 12px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
  };

  return (
    <>
      <Nav userState={navState} />

      <main>
        {/* SECTION 1 — HERO */}
        <section
          style={{
            background: "#1B4332",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "20px",
            }}
          >
            <span style={chipStyle}>Zone 6a — KC Metro</span>
            <span style={chipStyle}>KC Heavy Clay Soil</span>
            <span style={chipStyle}>Tall Fescue</span>
            {lawnSqft ? (
              <span style={chipStyle}>{lawnSqft.toLocaleString()} sq ft</span>
            ) : (
              <a href="/measure" style={{ ...chipStyle, textDecoration: "none" }}>
                Add your size →
              </a>
            )}
          </div>

          <h1
            className="text-[36px] sm:text-[48px]"
            style={{
              fontFamily: "Bebas Neue",
              color: "white",
              margin: "0 0 12px",
              lineHeight: 1.1,
              letterSpacing: "0.02em",
            }}
          >
            YOUR KC LAWN PLAN
            <br />
            IS READY
          </h1>

          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "16px",
              color: "rgba(255,255,255,0.75)",
              margin: "0 auto 32px",
              maxWidth: "480px",
              lineHeight: 1.6,
            }}
          >
            14 tasks. Exact product quantities. Week-by-week timing built for Zone 6a clay
            soil. Everything your KC lawn needs — all year.
          </p>

          <div
            className="grid grid-cols-2 sm:flex"
            style={{
              justifyContent: "center",
              gap: "32px",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label} style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontFamily: "Bebas Neue",
                    fontSize: "36px",
                    color: "#52B788",
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.5)",
                    margin: "4px 0 0",
                    textTransform: "uppercase",
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setUnlockModalOpen(true)}
            className="w-full sm:w-auto"
            style={{
              padding: "16px 48px",
              background: "#F4631E",
              color: "white",
              border: "none",
              borderRadius: "999px",
              fontFamily: "Bebas Neue",
              fontSize: "22px",
              letterSpacing: "0.05em",
              cursor: "pointer",
              marginBottom: "12px",
            }}
          >
            Unlock My KC Lawn Plan — $67 →
          </button>

          <p
            style={{
              fontFamily: "DM Mono",
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}
          >
            One-time payment · Lifetime access · No subscription ever
          </p>
        </section>

        {/* SECTION 2 — URGENCY ALERT */}
        {showUrgency && weather?.soilTempAlert && (
          <div
            style={{
              background: "#FFF0EB",
              borderLeft: "4px solid #F4631E",
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <AlertTriangle size={16} color="#F4631E" />
            <span
              style={{
                fontFamily: "DM Sans",
                fontSize: "14px",
                color: "#1B4332",
                fontWeight: 500,
              }}
            >
              {weather.soilTempAlert}
            </span>
          </div>
        )}

        {/* SECTION 3 — TASK PREVIEW */}
        <div style={{ padding: "32px 24px 16px" }}>
          <p
            style={{
              fontFamily: "DM Mono",
              fontSize: "11px",
              color: "#6B7B70",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 4px",
            }}
          >
            WHAT&rsquo;S IN YOUR PLAN RIGHT NOW
          </p>
          <h2
            style={{
              fontFamily: "Bebas Neue",
              fontSize: "28px",
              color: "#1B4332",
              margin: 0,
            }}
          >
            SPRING TASKS — ZONE 6A
          </h2>
        </div>

        <div style={{ padding: "0 24px" }}>
          {previewTasks.map((task) => (
            <div
              key={task.id}
              style={{
                background: "white",
                border: "1px solid #D6E8DC",
                borderRadius: "12px",
                padding: "16px 20px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "6px",
                  gap: "12px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#1B4332",
                      margin: "0 0 2px",
                    }}
                  >
                    {task.name}
                  </p>
                  <p
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: "12px",
                      color: "#52B788",
                      margin: 0,
                    }}
                  >
                    {task.product}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: "11px",
                    color: "#6B7B70",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {task.dateRange}
                </span>
              </div>

              <p
                style={{
                  fontFamily: "DM Sans",
                  fontSize: "13px",
                  color: "#6B7B70",
                  margin: "0 0 10px",
                  lineHeight: 1.5,
                }}
              >
                {task.whyContext.split(".")[0] + "."}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {task.badges.map((badge) => (
                    <KCComplianceBadge key={badge} type={badge} />
                  ))}
                </div>

                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontFamily: "DM Mono",
                    fontSize: "12px",
                    color: "#6B7B70",
                    background: "#F8F4E9",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    border: "1px solid #D6E8DC",
                  }}
                >
                  <Lock size={11} />
                  Unlock quantity
                </span>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "16px",
            color: "#6B7B70",
            fontFamily: "DM Sans",
            fontSize: "13px",
          }}
        >
          + 11 more tasks across Summer, Fall and Winter →
        </div>

        {/* SECTION 4 — WHAT YOU GET */}
        <section
          style={{
            background: "#F8F4E9",
            padding: "32px 24px",
            borderTop: "1px solid #D6E8DC",
            borderBottom: "1px solid #D6E8DC",
          }}
        >
          <h2
            style={{
              fontFamily: "Bebas Neue",
              fontSize: "28px",
              color: "#1B4332",
              margin: "0 0 20px",
              textAlign: "center",
            }}
          >
            EVERYTHING IN YOUR $67 PLAN
          </h2>

          <div style={{ maxWidth: "480px", margin: "0 auto" }}>
            {VALUE_ITEMS.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    color: "#52B788",
                    fontSize: "16px",
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: "DM Sans",
                    fontSize: "14px",
                    color: "#1B4332",
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5 — SAVINGS COMPARISON */}
        <section style={{ padding: "32px 24px", textAlign: "center" }}>
          <p
            style={{
              fontFamily: "DM Mono",
              fontSize: "11px",
              color: "#6B7B70",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: "0 0 16px",
            }}
          >
            WHAT KC HOMEOWNERS PAY VS. DIY
          </p>

          <div
            className="flex flex-col sm:flex-row"
            style={{
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "16px",
              alignItems: "center",
            }}
          >
            {SAVINGS_FIGURES.map((item) => (
              <div key={item.label} style={{ textAlign: "center", minWidth: "100px" }}>
                <p
                  style={{
                    fontFamily: "Bebas Neue",
                    fontSize: "36px",
                    color: item.color,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </p>
                <p
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: "10px",
                    color: "#6B7B70",
                    margin: "4px 0 0",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans",
                    fontSize: "11px",
                    color: "#6B7B70",
                    margin: "2px 0 0",
                  }}
                >
                  {item.sub}
                </p>
              </div>
            ))}
          </div>

          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "13px",
              color: "#6B7B70",
              margin: "0 0 24px",
            }}
          >
            The plan pays for itself in the first month.
          </p>
        </section>

        {/* SECTION 6 — FINAL CTA */}
        <section
          style={{
            background: "#1B4332",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "Bebas Neue",
              fontSize: "36px",
              color: "white",
              margin: "0 0 8px",
              lineHeight: 1.1,
            }}
          >
            YOUR KC LAWN PLAN IS WAITING.
          </h2>
          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "15px",
              color: "rgba(255,255,255,0.7)",
              margin: "0 0 28px",
              lineHeight: 1.6,
            }}
          >
            14 tasks. Exact quantities. Full year. $67 once. Yours forever.
          </p>

          <button
            onClick={() => setUnlockModalOpen(true)}
            className="w-full sm:w-auto"
            style={{
              padding: "16px 48px",
              background: "#F4631E",
              color: "white",
              border: "none",
              borderRadius: "999px",
              fontFamily: "Bebas Neue",
              fontSize: "22px",
              letterSpacing: "0.05em",
              cursor: "pointer",
              display: "block",
              margin: "0 auto 12px",
            }}
          >
            Unlock My KC Lawn Plan — $67 →
          </button>

          <p
            style={{
              fontFamily: "DM Mono",
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              margin: 0,
            }}
          >
            One-time payment · Lifetime access · No subscription ever
          </p>
        </section>

        {/* Sticky bottom bar */}
        <div
          id="sticky-unlock-bar"
          className="fixed bottom-0 left-0 right-0 z-30 bg-forest/95 backdrop-blur-sm border-t border-white/10 px-4 py-3"
        >
          <div className="mx-auto max-w-3xl flex items-center justify-between">
            <div>
              <p className="font-display text-lg text-white">Unlock Your Full Plan</p>
              <p className="font-mono text-xs text-white/60">
                $67 one-time · Lifetime access
              </p>
            </div>
            <button
              onClick={() => setUnlockModalOpen(true)}
              className="rounded-xl bg-orange px-5 py-2.5 font-display text-sm text-white uppercase tracking-wider hover:bg-orange/90 transition-colors"
            >
              Unlock — $67 →
            </button>
          </div>
        </div>
        <div className="h-20" />
      </main>

      <UnlockModal
        lawnSqft={lawnSqft ?? undefined}
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onStripeCheckout={handleStripeCheckout}
      />
    </>
  );
}
