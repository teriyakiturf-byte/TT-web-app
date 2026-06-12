"use client";

import { useEffect, useState } from "react";

// Live KC user count (F1). Fetches /api/user-count (cached server-side for 60s)
// and renders below the ZIP input.
export default function UserCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/user-count")
      .then((r) => r.json())
      .then((d) => {
        if (active && typeof d?.count === "number") setCount(d.count);
      })
      .catch(() => {
        /* fail silently — counter is non-critical */
      });
    return () => {
      active = false;
    };
  }, []);

  if (count === null) return null;

  return (
    <p className="text-sm text-[#52B788] font-medium text-center mt-2">
      <span className="animate-pulse inline-block w-2 h-2 rounded-full bg-[#52B788] mr-2" />
      {count.toLocaleString()} Johnson County homeowners are already on the
      system.
    </p>
  );
}
