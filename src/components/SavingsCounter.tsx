// Static savings counter (#2). Hardcoded competitor pricing — no personalized
// ZIP data. Lives above the fold, directly above the ZIP input on mobile.
export default function SavingsCounter() {
  return (
    <div className="bg-[#F5F1E8] rounded-xl p-4 border border-[#95D5B2] mb-4 text-left">
      <div className="flex justify-between text-sm text-gray-500 py-0.5">
        <span>TruGreen annual program</span>
        <span>$847/yr</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500 py-0.5">
        <span>Ryan Lawn &amp; Tree</span>
        <span>$780/yr</span>
      </div>
      <div className="flex justify-between text-sm text-gray-500 py-0.5">
        <span>Weed Man Kansas City</span>
        <span>$612/yr</span>
      </div>

      <hr className="my-2 border-t border-[#95D5B2]" />

      <div className="flex justify-between text-base font-bold text-[#F4631E] py-1">
        <span>Your Teriyaki Turf plan</span>
        <span>$67 once. Forever.</span>
      </div>

      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1 mt-2">
        The bottom line
      </p>
      <div className="flex justify-between text-lg font-bold text-[#52B788] pt-2">
        <span>Your first-year savings:</span>
        <span>$713</span>
      </div>
    </div>
  );
}
