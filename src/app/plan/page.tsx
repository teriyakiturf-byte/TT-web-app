"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Lock } from "lucide-react";
import Nav from "@/components/Nav";
import UnlockModal from "@/components/ui/UnlockModal";
import { useUserState } from "@/hooks/useUserState";
import { useWeather } from "@/hooks/useWeather";

const DIFFERENTIATORS = [
  {
    label: "SOIL TEMP TRIGGERS",
    description:
      "Pre-emergent goes down when KC soil hits 50°F — not when a national app says March 15.",
  },
  {
    label: "KC CLAY RATES",
    description:
      "Product amounts built for compacted clay — not the sandy loam most brands assume.",
  },
  {
    label: "ZONE 6A TIMING",
    description:
      "Every task timed to KC's actual seasons — not averaged national data.",
  },
];

const PREVIEW_TASKS = [
  {
    name: "Apply Pre-Emergent (Split App #1)",
    product: "Prodiamine 65 WDG",
    dateRange: "Mar 15 – Apr 1",
    context:
      "Soil temps in KC are crossing 55°F — your crabgrass pre-emergent window is closing.",
    badge: "Soil Temp Triggered",
    badgeColor: "#52B788",
  },
  {
    name: "Broadleaf Weed Spray",
    product: "Trimec Classic",
    dateRange: "Apr 15 – May 1",
    context:
      "Dandelions and clover are actively growing in KC clay right now.",
    badge: "Apply Before May 1",
    badgeColor: "#F4631E",
  },
  {
    name: "Spring Fertilizer Application",
    product: "Milorganite 6-4-0",
    dateRange: "May 1 – May 15",
    context:
      "Your tall fescue is hitting peak spring growth — feed it now before summer stress begins.",
    badge: "Slow Release ✓",
    badgeColor: "#52B788",
  },
];

const SAVINGS_FIGURES = [
  { value: "~$527", label: "TruGreen/yr", color: "#6B7B70" },
  { value: "~$154", label: "DIY w/ plan", color: "#52B788" },
  { value: "~$373", label: "You save/yr", color: "#F4631E" },
];

const PRIMARY_CTA_STYLE: React.CSSProperties = {
  padding: "16px 40px",
  background: "#F4631E",
  color: "white",
  border: "none",
  borderRadius: "999px",
  fontFamily: "Bebas Neue",
  fontSize: "20px",
  letterSpacing: "0.05em",
  cursor: "pointer",
  display: "block",
  margin: "0 auto 10px",
  width: "100%",
  maxWidth: "400px",
};

const TRUST_LINE_STYLE: React.CSSProperties = {
  fontFamily: "DM Mono",
  fontSize: "11px",
  color: "#6B7B70",
  margin: 0,
};

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
  const soilTemp = weather?.soilTemp;
  const soilTempStatus = weather?.soilTempStatus;
  const showUrgency =
    (soilTempStatus === "closing" || soilTempStatus === "pre-emergent") &&
    typeof soilTemp === "number";

  return (
    <>
      <Nav userState={navState} />

      <main>
        {/* SECTION B1 — THE PROBLEM */}
        <section
          style={{
            background: "#F8F4E9",
            padding: "48px 24px 40px",
            textAlign: "center",
            borderBottom: "1px solid #D6E8DC",
          }}
        >
          <p
            style={{
              fontFamily: "DM Mono",
              fontSize: "11px",
              color: "#6B7B70",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 16px",
            }}
          >
            For KC Homeowners Who Care About Their Lawn
          </p>

          <h1
            className="text-[34px] sm:text-[44px]"
            style={{
              fontFamily: "Bebas Neue",
              color: "#1B4332",
              margin: "0 auto 16px",
              lineHeight: 1.05,
              letterSpacing: "0.02em",
              maxWidth: "520px",
            }}
          >
            KC Lawns Are Harder Than The Bag Instructions Say.
          </h1>

          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "16px",
              color: "#6B7B70",
              margin: "0 auto 24px",
              maxWidth: "480px",
              lineHeight: 1.7,
            }}
          >
            You&rsquo;re not doing it wrong. You just need KC-specific timing. Heavy
            clay soil, Zone 6a temperature swings, and a pre-emergent window that
            opens and closes in weeks — not months.
          </p>

          <div
            style={{
              display: "inline-block",
              background: "white",
              border: "1px solid #D6E8DC",
              borderLeft: "4px solid #52B788",
              borderRadius: "8px",
              padding: "14px 20px",
              maxWidth: "480px",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontFamily: "DM Sans",
                fontSize: "14px",
                color: "#1B4332",
                margin: 0,
                lineHeight: 1.6,
                fontStyle: "italic",
              }}
            >
              &ldquo;Most lawn care advice is written for Atlanta or Dallas. We
              built Teriyaki Turf for Kansas City — because KC clay, Zone 6a
              timing, and our weather are a different game entirely.&rdquo;
            </p>
            <p
              style={{
                fontFamily: "DM Mono",
                fontSize: "11px",
                color: "#6B7B70",
                margin: "8px 0 0",
              }}
            >
              — Teriyaki T, KC homeowner
            </p>
          </div>
        </section>

        {/* SECTION B2 — THE SOLUTION EXISTS */}
        <section
          style={{
            background: "white",
            padding: "48px 24px",
            borderBottom: "1px solid #D6E8DC",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "DM Mono",
              fontSize: "11px",
              color: "#6B7B70",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 12px",
            }}
          >
            The KC Difference
          </p>

          <h2
            className="text-[28px] sm:text-[36px]"
            style={{
              fontFamily: "Bebas Neue",
              color: "#1B4332",
              margin: "0 0 16px",
              lineHeight: 1.1,
            }}
          >
            There&rsquo;s A Right Order Of Operations For KC Lawns.
          </h2>

          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "15px",
              color: "#6B7B70",
              margin: "0 auto 32px",
              maxWidth: "460px",
              lineHeight: 1.7,
            }}
          >
            Soil temp triggers — not calendar dates. Clay soil product rates — not
            bag instructions. Zone 6a timing — not national averages. When you
            get the sequence right, KC lawns respond fast.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            {DIFFERENTIATORS.map((item) => (
              <div
                key={item.label}
                style={{
                  background: "#F8F4E9",
                  borderRadius: "12px",
                  padding: "20px",
                  textAlign: "left",
                }}
              >
                <p
                  style={{
                    fontFamily: "Bebas Neue",
                    fontSize: "16px",
                    color: "#1B4332",
                    margin: "0 0 8px",
                    letterSpacing: "0.05em",
                  }}
                >
                  {item.label}
                </p>
                <p
                  style={{
                    fontFamily: "DM Sans",
                    fontSize: "13px",
                    color: "#6B7B70",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION B3 — THIS SOLUTION WORKS */}
        <section
          style={{
            background: "#F8F4E9",
            padding: "48px 24px",
            borderBottom: "1px solid #D6E8DC",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <p
              style={{
                fontFamily: "DM Mono",
                fontSize: "11px",
                color: "#6B7B70",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 8px",
              }}
            >
              Real Tasks. Right Now. For KC.
            </p>
            <h2
              className="text-[26px] sm:text-[32px]"
              style={{
                fontFamily: "Bebas Neue",
                color: "#1B4332",
                margin: 0,
              }}
            >
              Here&rsquo;s What Your Plan Says To Do This Spring
            </h2>
          </div>

          {showUrgency && (
            <div
              style={{
                background: "#FFF0EB",
                borderLeft: "4px solid #F4631E",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                maxWidth: "640px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <AlertTriangle size={15} color="#F4631E" />
              <span
                style={{
                  fontFamily: "DM Sans",
                  fontSize: "13px",
                  color: "#1B4332",
                  fontWeight: 500,
                }}
              >
                {soilTemp}°F soil temp in KC right now
                {soilTempStatus === "closing" &&
                  " — pre-emergent window closing fast"}
                {soilTempStatus === "pre-emergent" &&
                  " — pre-emergent window is open now"}
              </span>
            </div>
          )}

          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
            {PREVIEW_TASKS.map((task) => (
              <div
                key={task.name}
                style={{
                  background: "white",
                  border: "1px solid #D6E8DC",
                  borderRadius: "12px",
                  padding: "16px 20px",
                  marginBottom: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                    marginBottom: "6px",
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
                  {task.context}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: "11px",
                      color: task.badgeColor,
                      background: task.badgeColor + "18",
                      padding: "3px 8px",
                      borderRadius: "999px",
                    }}
                  >
                    {task.badge}
                  </span>
                  <span
                    style={{
                      fontFamily: "DM Mono",
                      fontSize: "11px",
                      color: "#6B7B70",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Lock size={10} />
                    Unlock quantity
                  </span>
                </div>
              </div>
            ))}

            <p
              style={{
                fontFamily: "DM Sans",
                fontSize: "13px",
                color: "#6B7B70",
                textAlign: "center",
                margin: "16px 0 0",
              }}
            >
              + 11 more tasks through Summer, Fall and Winter — including the
              fall overseeding window, winterizer, and grub prevention.
            </p>
          </div>
        </section>

        {/* SECTION B4 — IT WORKS FOR ME */}
        <section
          style={{
            background: "white",
            padding: "48px 24px",
            borderBottom: "1px solid #D6E8DC",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "DM Mono",
              fontSize: "11px",
              color: "#6B7B70",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 12px",
            }}
          >
            Built For Your Specific Lawn
          </p>

          <h2
            className="text-[26px] sm:text-[32px]"
            style={{
              fontFamily: "Bebas Neue",
              color: "#1B4332",
              margin: "0 0 8px",
              lineHeight: 1.1,
            }}
          >
            This Isn&rsquo;t A Generic Plan. It&rsquo;s Yours.
          </h2>

          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "15px",
              color: "#6B7B70",
              margin: "0 auto 24px",
              maxWidth: "400px",
              lineHeight: 1.7,
            }}
          >
            Every task, every quantity, every timing window calculated for your
            exact lawn profile.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "24px",
            }}
          >
            {[
              { label: "ZONE", value: "Zone 6a — KC Metro" },
              { label: "SOIL", value: "KC Heavy Clay" },
              { label: "GRASS", value: "Tall Fescue" },
              {
                label: "SIZE",
                value: lawnSqft
                  ? `${lawnSqft.toLocaleString()} sq ft`
                  : "Add your size →",
              },
            ].map((chip) => (
              <div
                key={chip.label}
                style={{
                  background: "#D8F3DC",
                  borderRadius: "999px",
                  padding: "6px 14px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: "10px",
                    color: "#6B7B70",
                    textTransform: "uppercase",
                  }}
                >
                  {chip.label}
                </span>
                <span
                  style={{
                    fontFamily: "DM Mono",
                    fontSize: "12px",
                    color: "#1B4332",
                    fontWeight: 500,
                  }}
                >
                  {chip.value}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#F8F4E9",
              borderRadius: "12px",
              padding: "20px",
              maxWidth: "420px",
              margin: "0 auto",
              textAlign: "left",
            }}
          >
            <p
              style={{
                fontFamily: "Bebas Neue",
                fontSize: "16px",
                color: "#1B4332",
                margin: "0 0 12px",
                letterSpacing: "0.03em",
              }}
            >
              YOUR PLAN INCLUDES
            </p>
            {[
              `Product quantities calculated for ${
                lawnSqft
                  ? `your ${lawnSqft.toLocaleString()} sq ft`
                  : "your exact lawn size"
              }`,
              "Timing based on KC Zone 6a soil temperatures",
              "Clay soil application rates — not generic bag instructions",
              "Full year — Spring through Winter",
              "Task tracking + milestone alerts",
            ].map((item, i, arr) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  marginBottom: i < arr.length - 1 ? "10px" : 0,
                }}
              >
                <span
                  style={{ color: "#52B788", flexShrink: 0, marginTop: "2px" }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: "DM Sans",
                    fontSize: "13px",
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

        {/* SECTION B5 — ACT NOW */}
        <section
          style={{
            background: "#F8F4E9",
            padding: "48px 24px",
            borderBottom: "1px solid #D6E8DC",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "DM Mono",
              fontSize: "11px",
              color: "#6B7B70",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              margin: "0 0 12px",
            }}
          >
            The Math Is Simple
          </p>

          <h2
            className="text-[26px] sm:text-[32px]"
            style={{
              fontFamily: "Bebas Neue",
              color: "#1B4332",
              margin: "0 0 8px",
              lineHeight: 1.1,
            }}
          >
            $67 Once.
            <br />
            ~$373 Saved Every Year.
          </h2>

          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "15px",
              color: "#6B7B70",
              margin: "0 auto 28px",
              maxWidth: "400px",
              lineHeight: 1.7,
            }}
          >
            TruGreen charges ~$527/yr for KC lawns our size. DIY with this plan
            costs ~$154/yr in products. The plan pays for itself in the first
            month.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            {SAVINGS_FIGURES.map((item) => (
              <div key={item.label}>
                <p
                  style={{
                    fontFamily: "Bebas Neue",
                    fontSize: "42px",
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
                    fontSize: "11px",
                    color: "#6B7B70",
                    margin: "4px 0 0",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <button onClick={() => setUnlockModalOpen(true)} style={PRIMARY_CTA_STYLE}>
            Unlock My KC Lawn Plan — $67 →
          </button>
          <p style={TRUST_LINE_STYLE}>
            One-time payment · Lifetime access · No subscription ever
          </p>
        </section>

        {/* FINAL CLOSE */}
        <section
          style={{
            background: "white",
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <h2
            className="text-[28px] sm:text-[36px]"
            style={{
              fontFamily: "Bebas Neue",
              color: "#1B4332",
              margin: "0 0 12px",
              lineHeight: 1.1,
            }}
          >
            Your KC Lawn Is Waiting For The Right Plan.
          </h2>

          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "15px",
              color: "#6B7B70",
              margin: "0 auto 28px",
              maxWidth: "400px",
              lineHeight: 1.7,
            }}
          >
            Every week without it is a week of guessing. The pre-emergent window
            doesn&rsquo;t wait. Neither does crabgrass.
          </p>

          <button onClick={() => setUnlockModalOpen(true)} style={PRIMARY_CTA_STYLE}>
            Unlock My KC Lawn Plan — $67 →
          </button>
          <p style={TRUST_LINE_STYLE}>
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
