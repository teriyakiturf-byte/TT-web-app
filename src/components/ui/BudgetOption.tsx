import type { BudgetAlternative } from "@/lib/budgetAlternatives";

/**
 * Budget alternative block rendered below the premium product recommendation
 * inside a task detail view. Only shown when a mapping exists for the task's
 * premium product (see {@link getBudgetAlternative}).
 */
export default function BudgetOption({ alt }: { alt: BudgetAlternative }) {
  return (
    <div className="bg-[#F5F1E8] rounded-xl p-3 mt-2">
      <div className="flex items-center gap-2 mb-1">
        <span aria-hidden="true">💡</span>
        <span className="text-xs font-bold text-[#52B788] uppercase tracking-wide">
          Budget Option
        </span>
      </div>
      <p className="text-sm font-semibold text-[#1B4332]">{alt.budget}</p>
      <span className="inline-block bg-[#EAFAF1] text-[#1B4332] text-xs px-2 py-0.5 rounded-full mt-1">
        {alt.savings}
      </span>
      <p className="text-xs text-gray-500 mt-1">{alt.note}</p>
    </div>
  );
}
