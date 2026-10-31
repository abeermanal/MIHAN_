export const ADSENSE_SLOTS = {
  inArticle: "2582527695",
  blogTop: "",
  blogBottom: "",
} as const;

export type AdSenseSlotKey = keyof typeof ADSENSE_SLOTS;

export function getAdSenseClientId() {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5963533274767345";
}

export function isAdSenseEnabled() {
  return Boolean(getAdSenseClientId());
}