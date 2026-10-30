export const ADSENSE_SLOTS = {
  inArticle: "",
  blogTop: "",
  blogBottom: "",
} as const;

export type AdSenseSlotKey = keyof typeof ADSENSE_SLOTS;

export function getAdSenseClientId() {
  return process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "";
}

export function isAdSenseEnabled() {
  return Boolean(getAdSenseClientId());
}