"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import GrassCardImage from "@/components/ui/GrassCardImage";
import ToastNotification from "@/components/ui/ToastNotification";
import {
  GRASS_QUIZ,
  SIZE_OPTIONS,
  resolveGrassType,
  savedGrassToChoice,
  sqftToSize,
  type GrassChoice,
  type LawnSize,
} from "@/lib/lawnProfileOptions";
import { updateUserProfile } from "@/app/settings/actions";
import type { ToastType } from "@/types";

interface SettingsFormProps {
  email: string;
  zip: string;
  lawnSqft: number | null;
  grassType: string | null;
  planPurchased: boolean;
}

export default function SettingsForm({
  email,
  zip: initialZip,
  lawnSqft: initialSqft,
  grassType: initialGrass,
  planPurchased,
}: SettingsFormProps) {
  const [zip, setZip] = useState(initialZip);
  const [selectedSize, setSelectedSize] = useState<LawnSize | null>(
    initialSqft && initialSqft > 0 ? sqftToSize(initialSqft) : null
  );
  const [grassChoice, setGrassChoice] = useState<GrassChoice | null>(
    initialGrass ? savedGrassToChoice(initialGrass) : null
  );
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const zipValid = /^\d{5}$/.test(zip);
  const canSave = zipValid && !!selectedSize && !!grassChoice && !isPending;

  function handleSave() {
    if (!selectedSize || !grassChoice) return;
    const sizeOpt = SIZE_OPTIONS.find((o) => o.value === selectedSize);
    if (!sizeOpt) return;

    startTransition(async () => {
      const result = await updateUserProfile({
        zip,
        lawnSqft: sizeOpt.sqft,
        grassType: resolveGrassType(grassChoice),
      });

      if (result.ok) {
        setToast({
          type: "success",
          message: "Your lawn profile has been updated.",
        });
      } else {
        setToast({ type: "error", message: result.error });
      }
    });
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-[#1B4332] mb-6">Settings</h1>

      {/* ─── Section 1: Lawn Profile ─── */}
      <section>
        <h2 className="text-lg font-semibold text-[#2C3E50] mb-3">
          Lawn Profile
        </h2>

        {/* ZIP Code */}
        <div className="mb-5">
          <label
            htmlFor="settings-zip"
            className="block text-sm font-medium text-[#1B4332] mb-1"
          >
            Your ZIP Code
          </label>
          <input
            id="settings-zip"
            type="text"
            inputMode="numeric"
            maxLength={5}
            pattern="[0-9]{5}"
            value={zip}
            onChange={(e) =>
              setZip(e.target.value.replace(/\D/g, "").slice(0, 5))
            }
            placeholder="e.g. 66062"
            className="w-full rounded-lg border-2 border-gray-200 bg-white px-4 py-2 font-mono text-lg focus:border-[#52B788] focus:outline-none transition-colors"
          />
          <p className="text-xs text-gray-500 mt-1">
            Used to personalize your plan for local soil temps and timing.
          </p>
        </div>

        {/* Lawn Size */}
        <div className="mb-5">
          <p className="block text-sm font-medium text-[#1B4332] mb-2">
            Lawn Size
          </p>
          <div
            role="radiogroup"
            aria-label="Lawn size"
            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {SIZE_OPTIONS.map((opt) => {
              const isSelected = selectedSize === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedSize(opt.value)}
                  className={`w-full text-left rounded-xl p-4 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-2 border-[#F4631E] bg-[#FFF3EC]"
                      : "border-2 border-gray-200 bg-white hover:bg-cream"
                  }`}
                >
                  <p className="font-bold text-base text-[#1B4332]">
                    {opt.label}
                  </p>
                  <p className="text-sm text-gray-600">{opt.range}</p>
                  <p className="text-xs text-gray-400 italic mt-0.5">
                    {opt.hint}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grass Type */}
        <div className="mb-5">
          <p className="block text-sm font-medium text-[#1B4332] mb-2">
            Grass Type
          </p>
          <div
            role="radiogroup"
            aria-label="Grass type"
            className="grid grid-cols-2 gap-3 md:gap-4"
          >
            {GRASS_QUIZ.map((opt) => {
              const isSelected = grassChoice === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setGrassChoice(opt.value)}
                  className={`relative rounded-xl overflow-hidden text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-2 border-[#F4631E] ring-2 ring-[#F4631E] ring-offset-1"
                      : "border-2 border-gray-200"
                  }`}
                >
                  <GrassCardImage
                    src={opt.image}
                    alt={opt.label}
                    bg={opt.placeholderBg}
                    showQuestion={opt.isPlaceholderQuestion}
                  />

                  {isSelected && (
                    <span className="absolute top-2 right-2 rounded-full bg-[#F4631E] text-white w-5 h-5 flex items-center justify-center text-xs font-bold">
                      ✓
                    </span>
                  )}

                  <p className="font-bold text-sm text-[#1B4332] px-3 pt-2">
                    {opt.label}
                  </p>
                  <p
                    className={`text-xs text-gray-500 px-3 ${
                      opt.subNote ? "" : "pb-2"
                    }`}
                  >
                    {opt.desc}
                  </p>
                  {opt.subNote && (
                    <p className="text-[11px] font-semibold text-[#2D6A4F] px-3 pt-1 pb-2">
                      {opt.subNote}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Changing your grass type will regenerate your plan.
          </p>
        </div>

        {/* Save */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className={`bg-[#F4631E] text-white font-bold rounded-xl px-6 py-3 w-full transition-opacity ${
            canSave ? "hover:opacity-90 cursor-pointer" : "opacity-50 cursor-not-allowed"
          }`}
        >
          {isPending ? "Saving…" : "Save Lawn Profile"}
        </button>
      </section>

      {/* ─── Section 2: Account ─── */}
      <div className="border-t border-gray-100 mt-6" />
      <section>
        <h2 className="text-lg font-semibold text-[#2C3E50] mb-3 mt-6">
          Account
        </h2>

        <div className="mb-4">
          <p className="block text-sm font-medium text-[#1B4332] mb-1">
            Email Address
          </p>
          <p className="text-gray-700">{email}</p>
        </div>

        <div className="mb-2">
          <p className="block text-sm font-medium text-[#1B4332] mb-1">
            Plan Status
          </p>
          {planPurchased ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D8F3DC] text-[#1B4332] text-sm font-semibold px-3 py-1">
              <CheckCircle2 size={16} className="text-[#52B788]" />
              Full Access — Unlocked
            </span>
          ) : (
            <>
              <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-600 text-sm font-semibold px-3 py-1">
                Free Plan
              </span>
              <div className="mt-3">
                <Link
                  href="/plan"
                  className="inline-block font-bold text-[#F4631E] hover:underline"
                >
                  Unlock My Full Plan — $67 →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ─── Section 3: Notifications (placeholder) ─── */}
      <div className="border-t border-gray-100 mt-6" />
      <section>
        <h2 className="text-lg font-semibold text-[#2C3E50] mb-3 mt-6">
          Notifications
        </h2>

        <div className="flex items-start justify-between gap-4 opacity-60">
          <div>
            <p className="text-sm font-medium text-gray-500">
              Soil temperature alerts
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              Coming soon — we will notify you when your application windows open.
            </p>
          </div>
          {/* Disabled toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={false}
            aria-disabled={true}
            disabled
            className="relative inline-flex h-6 w-11 shrink-0 cursor-not-allowed items-center rounded-full bg-gray-200"
          >
            <span className="inline-block h-5 w-5 translate-x-0.5 transform rounded-full bg-white shadow" />
          </button>
        </div>
      </section>

      {toast && (
        <ToastNotification
          type={toast.type}
          message={toast.message}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
