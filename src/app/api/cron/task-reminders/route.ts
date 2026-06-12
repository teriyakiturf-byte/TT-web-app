import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTaskReminderEmail } from "@/lib/email";
import { findUpcomingTasks } from "@/lib/planTasks";
import { getCityFromZip } from "@/lib/utils";
import { calculateQuantity } from "@/types";

// Cron jobs must always run fresh and never be statically optimized.
export const dynamic = "force-dynamic";

// How far ahead a task window may open to qualify for this week's reminder.
const WINDOW_DAYS = 7;

// KC metro coordinates — the app is Kansas City-only (Zone 6a), matching the
// hardcoded location used by /api/weather.
const KC_LAT = 38.9717;
const KC_LNG = -94.6672;

/** Fetch the current KC soil temperature (°F) from Open-Meteo, or null. */
async function fetchSoilTemp(): Promise<number | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", KC_LAT.toString());
    url.searchParams.set("longitude", KC_LNG.toString());
    url.searchParams.set("hourly", "soil_temperature_6cm");
    url.searchParams.set("temperature_unit", "fahrenheit");
    url.searchParams.set("timezone", "America/Chicago");
    url.searchParams.set("forecast_days", "1");

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) return null;

    const data = await res.json();
    const hourly = data?.hourly?.soil_temperature_6cm;
    if (!Array.isArray(hourly) || hourly.length === 0) return null;

    const reading = hourly[new Date().getHours()] ?? hourly[0];
    return typeof reading === "number" ? Math.round(reading) : null;
  } catch (err) {
    console.error("Soil temp fetch failed:", err);
    return null;
  }
}

/** Derive a friendly first name from the user's name, falling back to email. */
function firstNameFor(name: string | null, email: string): string {
  const fromName = name?.trim().split(/\s+/)[0];
  if (fromName) return fromName;
  const local = email.split("@")[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

/** Format a Date as "Mon D" (e.g. "Jun 15") in Central Time. */
function formatWindowDate(d: Date): string {
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/Chicago",
  });
}

/**
 * Weekly task-reminder cron (Mondays 8am CT via Vercel Cron).
 *
 * Notifies paid, opted-in users when a plan task window opens in the next 7
 * days. Authorized by CRON_SECRET, sent via Resend with the live KC soil temp.
 *
 * Note: task completion is tracked client-side (localStorage), so the cron
 * cannot filter per-user incomplete tasks server-side. All paid users share
 * the same KC plan, so a window opening this week applies to everyone — the
 * reminder is inherently window-driven rather than completion-driven.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("CRON_SECRET is not configured");
    return NextResponse.json({ error: "NOT_CONFIGURED" }, { status: 500 });
  }

  // Accept Vercel's `Authorization: Bearer <secret>` or an `x-cron-secret` header.
  const authHeader = req.headers.get("authorization");
  const cronHeader = req.headers.get("x-cron-secret");
  const authorized =
    authHeader === `Bearer ${secret}` || cronHeader === secret;
  if (!authorized) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  // Which task window opens this week? Pick the soonest.
  const upcoming = findUpcomingTasks(new Date(), WINDOW_DAYS)[0];
  if (!upcoming) {
    return NextResponse.json({ sent: 0, errors: 0, reason: "no-task-window" });
  }
  const { task, window } = upcoming;

  // Paid users who haven't opted out of reminders.
  const users = await prisma.user.findMany({
    where: { planPurchased: true, emailReminders: true },
    select: { email: true, name: true, zip: true, lawnSqft: true },
  });

  if (users.length === 0) {
    return NextResponse.json({ sent: 0, errors: 0, reason: "no-recipients" });
  }

  const soilTemp = await fetchSoilTemp();
  const windowOpenDate = formatWindowDate(window.open);
  const windowCloseDate = formatWindowDate(window.close);

  let sent = 0;
  let errors = 0;

  for (const user of users) {
    try {
      const quantity =
        task.labelRate > 0 && user.lawnSqft
          ? `${calculateQuantity(user.lawnSqft, task.labelRate)} lbs`
          : null;

      await sendTaskReminderEmail({
        to: user.email,
        firstName: firstNameFor(user.name, user.email),
        userCity: getCityFromZip(user.zip ?? ""),
        taskName: task.name,
        taskPlainDescription: task.plainDescription ?? "",
        windowOpenDate,
        windowCloseDate,
        productName: task.productName,
        quantity,
        soilTemp,
      });
      sent++;
    } catch (err) {
      console.error(`Task reminder failed for ${user.email}:`, err);
      errors++;
    }
  }

  return NextResponse.json({ sent, errors });
}
