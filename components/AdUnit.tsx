"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface AdUnitProps {
  slot: string;
  layout?: string;
  format?: string;
  className?: string;
}

export default function AdUnit({
  slot,
  layout,
  format = "auto",
  className,
}: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block", textAlign: "center" }}
      data-ad-client="ca-pub-5963533274767345"
      data-ad-slot={slot}
      data-ad-layout={layout}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
