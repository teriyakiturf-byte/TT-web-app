"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Canonical grass-type values accepted from the client (mirrors src/types
// GrassType and the /api/user/profile route).
const GRASS_TYPES = new Set([
  "tall-fescue",
  "kentucky-bluegrass",
  "zoysia",
  "buffalo-grass",
  "mixed-unsure",
]);

export interface UpdateUserProfileInput {
  zip: string;
  lawnSqft: number;
  grassType: string;
}

export type UpdateUserProfileResult =
  | { ok: true; needsPlanRegen: boolean }
  | { ok: false; error: string };

/**
 * Persist edits made on the Settings page (lawn profile section).
 *
 * 1. Requires an authenticated session.
 * 2. Validates ZIP is exactly 5 digits.
 * 3. Updates zip, lawnSqft and grassType on the user record.
 * 4. If grassType changed, flags needsPlanRegen so the plan is regenerated.
 */
export async function updateUserProfile(
  data: UpdateUserProfileInput
): Promise<UpdateUserProfileResult> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return { ok: false, error: "You must be signed in to update your profile." };
  }

  const { zip, lawnSqft, grassType } = data ?? {};

  // ── Validate ZIP ──
  if (typeof zip !== "string" || !/^\d{5}$/.test(zip)) {
    return { ok: false, error: "Please enter a valid 5-digit ZIP code." };
  }

  // ── Validate grass type ──
  if (typeof grassType !== "string" || !GRASS_TYPES.has(grassType)) {
    return { ok: false, error: "Please choose a valid grass type." };
  }

  // ── Validate lawn size (sqft) ──
  const sqft = Number(lawnSqft);
  if (!Number.isFinite(sqft) || sqft < 100 || sqft > 100000) {
    return { ok: false, error: "Please choose a valid lawn size." };
  }

  try {
    const current = await prisma.user.findUnique({
      where: { id: userId },
      select: { grassType: true },
    });

    const grassTypeChanged = current?.grassType !== grassType;

    await prisma.user.update({
      where: { id: userId },
      data: {
        zip,
        lawnSqft: Math.round(sqft),
        grassType,
        // Changing grass type invalidates the existing plan — flag it so the
        // plan logic regenerates on next load.
        ...(grassTypeChanged ? { needsPlanRegen: true } : {}),
      },
    });

    // Refresh any server-rendered views that read the profile.
    revalidatePath("/settings");
    revalidatePath("/plan");
    revalidatePath("/dashboard");

    return { ok: true, needsPlanRegen: grassTypeChanged };
  } catch (err) {
    console.error("updateUserProfile error:", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export type UpdateEmailRemindersResult =
  | { ok: true; emailReminders: boolean }
  | { ok: false; error: string };

/**
 * Toggle the weekly task-reminder emails opt-out flag for the signed-in user.
 * When off, the reminder cron skips this user.
 */
export async function updateEmailReminders(
  enabled: boolean
): Promise<UpdateEmailRemindersResult> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return { ok: false, error: "You must be signed in to update notifications." };
  }

  if (typeof enabled !== "boolean") {
    return { ok: false, error: "Invalid notification setting." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { emailReminders: enabled },
    });

    revalidatePath("/settings");
    return { ok: true, emailReminders: enabled };
  } catch (err) {
    console.error("updateEmailReminders error:", err);
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
