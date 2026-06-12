"use client";

import { useState } from "react";
import Image from "next/image";

// Card image: Next.js Image with a colored placeholder box behind it. If the
// photo doesn't exist yet (404), onError reveals the colored box. Shared by the
// onboarding grass quiz and the Settings page.
export default function GrassCardImage({
  src,
  alt,
  bg,
  showQuestion,
}: {
  src: string;
  alt: string;
  bg: string;
  showQuestion?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="relative aspect-square w-full"
      style={{ backgroundColor: bg }}
    >
      {!failed ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 45vw, 220px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        showQuestion && (
          <span className="absolute inset-0 flex items-center justify-center text-white/80 text-3xl font-bold">
            ?
          </span>
        )
      )}
    </div>
  );
}
