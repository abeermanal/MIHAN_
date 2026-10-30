import Script from "next/script";
import { getAdSenseClientId } from "@/lib/ads";

export default function AdSenseScript() {
  const clientId = getAdSenseClientId();

  if (!clientId) return null;

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      strategy="afterInteractive"
      crossOrigin="anonymous"
      data-ad-client={clientId}
    />
  );
}