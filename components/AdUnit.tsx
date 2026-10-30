"use client";

import { useEffect, useRef } from "react";
import { getAdSenseClientId } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  className?: string;
}

export default function AdUnit({
  slot,
  format = "auto",
  className = "min-h-[100px]",
}: AdUnitProps) {
  const adRef = useRef<HTMLDivElement | null>(null);
  const clientId = getAdSenseClientId();

  useEffect(() => {
    if (!clientId || !slot) return;
    if (!adRef.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      return;
    }
  }, [clientId, slot]);

  if (!clientId || !slot) return null;

  return (
    <div ref={adRef} className={className}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}