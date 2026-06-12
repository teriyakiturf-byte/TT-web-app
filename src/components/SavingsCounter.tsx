import type { LawnSize } from "@/lib/lawnProfileOptions";
import { calculateSavings, sizeLabels } from "@/lib/savings";

// Personalized savings counter (#29). Calculates the average / most-expensive
// KC competitor cost for the selected lawn size and contrasts it with the
// one-time $67 plan. Defaults to Medium so the landing page renders meaningful
// numbers before the user has picked a size; onboarding and the plan preview
// pass the user's actual size to update the figures live.
export default function SavingsCounter({
  size = "medium",
}: {
  size?: LawnSize;
}) {
  const { avgAnnual, maxAnnual, savings, sqFt } = calculateSavings(size);

  return (
    <div className="bg-[#F5F1E8] rounded-xl p-4 border border-[#95D5B2] mb-4 text-left">
      <div className="flex justify-between text-sm text-gray-500 py-0.5">
        <span>Average KC lawn service (your size)</span>
        <span>${avgAnnual}/yr</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500 py-0.5">
        <span>Most expensive option</span>
        <span>${maxAnnual}/yr</span>
      </div>

      <hr className="my-2 border-t border-[#95D5B2]" />

      <div className="flex justify-between text-base font-bold text-[#F4631E] py-1">
        <span>Your Teriyaki Turf plan</span>
        <span>$67 once. Forever.</span>
      </div>

      <div className="flex justify-between text-lg font-bold text-[#52B788] pt-2">
        <span>Your first-year savings:</span>
        <span>${savings}</span>
      </div>

      <p className="text-xs text-gray-400 italic mt-1">
        Based on a {sizeLabels[size]} lawn (~{sqFt.toLocaleString()} sq ft) in
        the KC metro.
      </p>
    </div>
  );
}
