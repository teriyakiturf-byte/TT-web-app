"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Lock } from "lucide-react";
import UnlockModal from "@/components/ui/UnlockModal";
import { useUserState } from "@/hooks/useUserState";
import { useWeather } from "@/hooks/useWeather";
import { formatGrassType } from "@/lib/utils";

const KC_PREFIXES = [
  "640",
  "641",
  "660",
  "661",
  "662",
  "664",
  "665",
  "666",
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
    context: "Dandelions and clover are actively growing in KC clay right now.",
    badge: "Apply Before May 1",
    badgeColor: "#F4631E",
  },
  {
    name: "Spring Fertilizer Application",
    product: "Milorganite 6-4-0",
    dateRange: "May 1 – May 15",
    context:
      "Your tall fescue is hitting peak spring growth — feed it before summer heat stress arrives.",
    badge: "Slow Release ✓",
    badgeColor: "#52B788",
  },
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

const EYEBROW_STYLE: React.CSSProperties = {
  fontFamily: "DM Mono",
  fontSize: "11px",
  color: "#6B7B70",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  margin: "0 0 16px",
};

const HEADLINE_STYLE: React.CSSProperties = {
  fontFamily: "Bebas Neue",
  fontSize: "44px",
  color: "#1B4332",
  margin: "0 auto 16px",
  lineHeight: 1.05,
  letterSpacing: "0.02em",
  maxWidth: "520px",
};

const SUBHEAD_STYLE: React.CSSProperties = {
  fontFamily: "DM Sans",
  fontSize: "15px",
  color: "#6B7B70",
  margin: "0 auto 24px",
  maxWidth: "420px",
  lineHeight: 1.7,
};

const ZIP_INPUT_STYLE: React.CSSProperties = {
  display: "block",
  width: "100%",
  maxWidth: "280px",
  margin: "0 auto 8px",
  padding: "14px 16px",
  border: "2px solid #D6E8DC",
  borderRadius: "999px",
  fontFamily: "DM Mono",
  fontSize: "16px",
  textAlign: "center",
  outline: "none",
  background: "white",
  color: "#1B4332",
};

const ZIP_HELPER_STYLE: React.CSSProperties = {
  fontFamily: "DM Sans",
  fontSize: "12px",
  color: "#6B7B70",
  margin: 0,
};

const CHIP_ROW_STYLE: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "16px",
  opacity: 0,
  animation: "fadeIn 300ms ease-out forwards",
};

const CHIP_ROW_STATIC_STYLE: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "24px",
};

const CHIP_STYLE: React.CSSProperties = {
  background: "#D8F3DC",
  borderRadius: "999px",
  padding: "6px 14px",
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
};

const CHIP_LABEL_STYLE: React.CSSProperties = {
  fontFamily: "DM Mono",
  fontSize: "10px",
  color: "#6B7B70",
  textTransform: "uppercase",
};

const CHIP_VALUE_STYLE: React.CSSProperties = {
  fontFamily: "DM Mono",
  fontSize: "12px",
  color: "#1B4332",
  fontWeight: 500,
};

const READY_MESSAGE_STYLE: React.CSSProperties = {
  fontFamily: "DM Sans",
  fontSize: "15px",
  color: "#1B4332",
  fontWeight: 700,
  margin: "0 auto 24px",
  maxWidth: "420px",
  lineHeight: 1.6,
};

export default function PlanPage() {
  const router = useRouter();
  const {
    loading: isLoading,
    isPaid,
    isGuest,
    isFree,
    lawnSqft,
    grassType,
    email,
  } = useUserState();
  const { weather } = useWeather();
  const soilTemp = weather?.soilTemp;
  const soilTempStatus = weather?.soilTempStatus;
  const showUrgency =
    typeof soilTemp === "number" &&
    (soilTempStatus === "closing" || soilTempStatus === "pre-emergent");
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [zip, setZip] = useState("");
  const [zoneData, setZoneData] = useState<null | {
    zone: string;
    soil: string;
    grass: string;
  }>(null);

  useEffect(() => {
    if (!isLoading && isPaid) router.replace("/dashboard");
  }, [isLoading, isPaid, router]);

  function handleZipChange(value: string) {
    setZip(value);
    if (value.length === 5 && /^\d{5}$/.test(value)) {
      if (KC_PREFIXES.some((p) => value.startsWith(p))) {
        setZoneData({
          zone: "Zone 6a — KC Metro",
          soil: "KC Heavy Clay",
          grass: "Tall Fescue",
        });
      }
    }
  }

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

  if (isLoading) return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F4E9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #D8F3DC',
        borderTop: '3px solid #52B788',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
    </div>
  );

  return (
    <>
      {isGuest && (
        <section
          style={{
            background: "#F8F4E9",
            padding: "56px 24px 48px",
            textAlign: "center",
            borderBottom: "1px solid #D6E8DC",
          }}
        >
          <p style={EYEBROW_STYLE}>Built For Your KC Lawn</p>

          <h1 className="plan-headline" style={HEADLINE_STYLE}>
            This Isn&rsquo;t A Generic Plan. It&rsquo;s Yours.
          </h1>

          <p style={SUBHEAD_STYLE}>
            Enter your ZIP and see exactly what your KC lawn needs — Zone 6a
            timing, KC clay soil rates, and the right products for your grass
            type.
          </p>

          {zoneData === null ? (
            <div style={{ marginBottom: "24px" }}>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="Enter your ZIP code"
                value={zip}
                onChange={(e) => handleZipChange(e.target.value)}
                style={ZIP_INPUT_STYLE}
              />
              <p style={ZIP_HELPER_STYLE}>
                We&rsquo;ll show your zone data instantly
              </p>
            </div>
          ) : (
            <>
              <div style={CHIP_ROW_STYLE}>
                <div style={CHIP_STYLE}>
                  <span style={CHIP_LABEL_STYLE}>ZONE</span>
                  <span style={CHIP_VALUE_STYLE}>{zoneData.zone}</span>
                </div>
                <div style={CHIP_STYLE}>
                  <span style={CHIP_LABEL_STYLE}>SOIL</span>
                  <span style={CHIP_VALUE_STYLE}>{zoneData.soil}</span>
                </div>
                <div style={CHIP_STYLE}>
                  <span style={CHIP_LABEL_STYLE}>GRASS</span>
                  <span style={CHIP_VALUE_STYLE}>{zoneData.grass}</span>
                </div>
                <div style={CHIP_STYLE}>
                  <span style={CHIP_LABEL_STYLE}>SIZE</span>
                  <span style={CHIP_VALUE_STYLE}>Add your size →</span>
                </div>
              </div>

              <p style={READY_MESSAGE_STYLE}>
                Your Zone 6a KC lawn plan is ready. 14 tasks. Exact quantities.
                Full year coverage.
              </p>
            </>
          )}

          <button
            onClick={() => setUnlockModalOpen(true)}
            style={PRIMARY_CTA_STYLE}
          >
            Unlock My KC Lawn Plan — $67 →
          </button>
          <p style={TRUST_LINE_STYLE}>
            One-time payment · Lifetime access · No subscription ever
          </p>
        </section>
      )}

      {isFree && (
        <section
          style={{
            background: "#F8F4E9",
            padding: "56px 24px 48px",
            textAlign: "center",
            borderBottom: "1px solid #D6E8DC",
          }}
        >
          <p style={EYEBROW_STYLE}>Built For Your KC Lawn</p>

          <h1 className="plan-headline" style={HEADLINE_STYLE}>
            This Isn&rsquo;t A Generic Plan. It&rsquo;s Yours.
          </h1>

          <p style={SUBHEAD_STYLE}>
            Your Zone 6a KC lawn plan is ready. 14 tasks. Exact product
            quantities. Full year coverage.
          </p>

          <div style={CHIP_ROW_STATIC_STYLE}>
            <div style={CHIP_STYLE}>
              <span style={CHIP_LABEL_STYLE}>ZONE</span>
              <span style={CHIP_VALUE_STYLE}>Zone 6a — KC Metro</span>
            </div>
            <div style={CHIP_STYLE}>
              <span style={CHIP_LABEL_STYLE}>SOIL</span>
              <span style={CHIP_VALUE_STYLE}>KC Heavy Clay</span>
            </div>
            <div style={CHIP_STYLE}>
              <span style={CHIP_LABEL_STYLE}>GRASS</span>
              <span style={CHIP_VALUE_STYLE}>{grassType ? formatGrassType(grassType) : "Tall Fescue"}</span>
            </div>
            <div style={CHIP_STYLE}>
              <span style={CHIP_LABEL_STYLE}>SIZE</span>
              <span style={CHIP_VALUE_STYLE}>
                {lawnSqft
                  ? `${lawnSqft.toLocaleString()} sq ft`
                  : "Add your size →"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setUnlockModalOpen(true)}
            style={PRIMARY_CTA_STYLE}
          >
            Unlock My KC Lawn Plan — $67 →
          </button>
          <p style={TRUST_LINE_STYLE}>
            One-time payment · Lifetime access · No subscription ever
          </p>
        </section>
      )}

      {(isGuest || isFree) && (
        <section
          style={{
            background: "white",
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
              style={{
                fontFamily: "Bebas Neue",
                fontSize: "32px",
                color: "#1B4332",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Here&rsquo;s What Your Plan Includes This Spring
            </h2>
          </div>

          <div style={{ maxWidth: "640px", margin: "0 auto" }}>
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
                  {soilTemp}°F soil temp in KC right now — pre-emergent window
                  closing fast
                </span>
              </div>
            )}

            {PREVIEW_TASKS.map((task) => (
              <div
                key={task.name}
                style={{
                  background: "#F8F4E9",
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
                    marginBottom: "4px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "DM Sans",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#1B4332",
                      margin: 0,
                    }}
                  >
                    {task.name}
                  </p>
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
                    fontFamily: "DM Mono",
                    fontSize: "12px",
                    color: "#52B788",
                    margin: "0 0 8px",
                  }}
                >
                  {task.product}
                </p>

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
                    <Lock size={10} color="#6B7B70" />
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
                lineHeight: 1.5,
              }}
            >
              + 11 more tasks through Summer, Fall and Winter — including fall
              overseeding, winterizer, and grub prevention.
            </p>
          </div>
        </section>
      )}

      {(isGuest || isFree) && (
        <section
          style={{
            background: "#F8F4E9",
            padding: "48px 24px",
            borderBottom: "1px solid #D6E8DC",
            textAlign: "center",
          }}
        >
          <p style={EYEBROW_STYLE}>The Math Is Simple</p>

          <h2
            style={{
              fontFamily: "Bebas Neue",
              fontSize: "40px",
              lineHeight: 1.05,
              margin: "0 0 16px",
            }}
          >
            <span style={{ color: "#1B4332" }}>$67 Once.</span>
            <br />
            <span style={{ color: "#F4631E" }}>~$373 Saved Every Year.</span>
          </h2>

          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "15px",
              color: "#6B7B70",
              margin: "0 auto 28px",
              maxWidth: "380px",
              lineHeight: 1.7,
            }}
          >
            TruGreen charges ~$527/yr for KC lawns. DIY with this plan costs
            ~$154/yr in products. The plan pays for itself in the first month.
          </p>

          <div
            className="plan-savings-row"
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              flexWrap: "wrap",
              marginBottom: "32px",
            }}
          >
            {[
              { value: "~$527", label: "TruGreen/yr", color: "#6B7B70" },
              { value: "~$154", label: "DIY w/ plan", color: "#52B788" },
              { value: "~$373", label: "You save/yr", color: "#F4631E" },
            ].map((item) => (
              <div key={item.label}>
                <p
                  className="plan-savings-value"
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

          <button
            onClick={() => setUnlockModalOpen(true)}
            style={PRIMARY_CTA_STYLE}
          >
            Unlock My KC Lawn Plan — $67 →
          </button>
          <p style={{ ...TRUST_LINE_STYLE, marginBottom: "24px" }}>
            One-time payment · Lifetime access · No subscription ever
          </p>

          <p
            style={{
              fontFamily: "DM Sans",
              fontSize: "13px",
              color: "#6B7B70",
              fontStyle: "italic",
              margin: "0 auto",
              maxWidth: "360px",
              lineHeight: 1.6,
            }}
          >
            Every week without it is a week of guessing. The pre-emergent
            window doesn&rsquo;t wait. Neither does crabgrass.
          </p>
        </section>
      )}

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

      <UnlockModal
        lawnSqft={lawnSqft ?? undefined}
        isOpen={unlockModalOpen}
        onClose={() => setUnlockModalOpen(false)}
        onStripeCheckout={handleStripeCheckout}
      />
    </>
  );
}
