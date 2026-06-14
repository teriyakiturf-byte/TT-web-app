import type { CSSProperties } from "react";

/**
 * MetricsBar — persistent "Field Console" header for the paid dashboard (P2).
 *
 * Display-only. Every value is derived from props that already live on the
 * dashboard page (lawn size, soil temp, grass type, user name). No data
 * fetching, no effects — pass-through presentation.
 */
export interface MetricsBarProps {
  soilTemp: number | null;
  sqFt: number | null;
  grassType: string | null;
  userName: string | null;
}

// Shared inline style for the gradient-clipped pill values. `bg-clip-text`
// needs the gradient painted onto the text box, which a couple of older
// WebKit targets only honour via the vendor-prefixed property.
const CLIP_TEXT: CSSProperties = {
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
};

export default function MetricsBar({
  soilTemp,
  sqFt,
  userName,
}: MetricsBarProps) {
  // Savings range derived purely from lawn size — no API call.
  const lo = sqFt ? Math.round((sqFt * 0.14) / 10) * 10 : null;
  const hi = sqFt ? Math.round((sqFt * 0.19) / 10) * 10 : null;
  const savingsLabel =
    lo && hi ? `$${lo.toLocaleString()}–$${hi.toLocaleString()}` : "unlock";

  const sizePending = sqFt === null;

  return (
    <div className="bg-gradient-to-br from-[#1e4a35] to-[var(--forest-mid)] border-b border-[var(--border-dark)] px-5 pt-3 pb-4">
      {/* Top row: greeting + console title on the left, PRO badge on the right */}
      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0">
          <p className="text-[11px] font-dm text-[var(--lime-soft)] truncate">
            Good morning
            {userName ? (
              <>
                , <span className="font-montserrat font-bold text-white">{userName}</span>
              </>
            ) : null}
          </p>
          <p className="font-montserrat font-black text-[18px] text-white leading-tight">
            Your Field Console
          </p>
        </div>

        <span className="shrink-0 bg-lime text-forest-deep font-montserrat font-extrabold text-[10px] px-3 py-1 rounded-full">
          ⚡ PRO
        </span>
      </div>

      {/* Pills row */}
      <div className="grid grid-cols-3 gap-2">
        {/* Soil temp */}
        <div className="bg-black/20 border border-[var(--border-dark)] rounded-[11px] px-[10px] py-[9px] text-center">
          {soilTemp !== null ? (
            <span
              className="pv font-bebas text-[22px] leading-none mb-[3px] block bg-gradient-to-r from-lime to-lime-soft text-transparent"
              style={CLIP_TEXT}
            >
              {soilTemp}°F
            </span>
          ) : (
            <span className="text-[11px] font-dm text-[var(--text-muted)] leading-none mb-[3px] block">
              —°F
            </span>
          )}
          <span className="text-[9px] font-montserrat font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Soil temp
          </span>
        </div>

        {/* Square footage */}
        <div
          className={`bg-black/20 rounded-[11px] px-[10px] py-[9px] text-center ${
            sizePending
              ? "border border-dashed border-[var(--border-dark)] opacity-65"
              : "border border-[var(--border-dark)]"
          }`}
        >
          {sizePending ? (
            <span className="text-[11px] font-dm text-[var(--text-muted)] leading-none mb-[3px] block">
              —&nbsp;&nbsp;sq ft
            </span>
          ) : (
            <span
              className="pv font-bebas text-[22px] leading-none mb-[3px] block bg-gradient-to-r from-lime to-lime-soft text-transparent"
              style={CLIP_TEXT}
            >
              {sqFt!.toLocaleString()}
            </span>
          )}
          <span className="text-[9px] font-montserrat font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Sq ft
          </span>
        </div>

        {/* Estimated savings */}
        <div
          className={`bg-black/20 rounded-[11px] px-[10px] py-[9px] text-center ${
            sizePending
              ? "border border-dashed border-orange-tt/30 opacity-65"
              : "border border-[var(--border-dark)]"
          }`}
        >
          {sizePending ? (
            <span className="text-[11px] font-dm text-[var(--text-muted)] leading-none mb-[3px] block">
              {savingsLabel}
            </span>
          ) : (
            <span
              className="pv font-bebas text-[16px] leading-none mb-[3px] block bg-gradient-to-r from-orange-tt to-[#ff9a6c] text-transparent"
              style={CLIP_TEXT}
            >
              {savingsLabel}
            </span>
          )}
          <span className="text-[9px] font-montserrat font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Est. savings
          </span>
        </div>
      </div>
    </div>
  );
}
