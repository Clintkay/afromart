import { getCountries } from "libphonenumber-js";

const names = new Intl.DisplayNames(["en"], { type: "region" });

/** All countries buyers can ship to, sorted by English name. */
export const countryOptions = getCountries()
  .map((code) => ({ code, name: names.of(code) ?? code }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const countryNameOf = (code: string) => names.of(code) ?? code;

const AFRICA = new Set([
  "NG","GH","KE","ZA","EG","TZ","UG","RW","SN","CI","CM","ET","MA","DZ","TN","ZM","ZW","BW","NA","MZ","AO","BJ","BF","ML","NE","TG","SL","LR","GM","GN","CD","CG","GA","MW","MU","RW","SO","SD","SS","LY","MR","CV","ST","GQ","BI","DJ","ER","LS","SZ","MG","SC","TD","CF",
]);

export type DeliveryQuote = { cost: number; label: string; eta: string };

/** Shipping cost (in kobo-free naira units used across the app) for a destination country. */
export function deliveryQuote(countryCode: string, subtotal: number): DeliveryQuote {
  if (countryCode === "NG") {
    return subtotal > 5000
      ? { cost: 0, label: "Free local delivery", eta: "2–4 business days" }
      : { cost: 500, label: "Local delivery", eta: "2–4 business days" };
  }
  if (AFRICA.has(countryCode)) {
    return { cost: 1500, label: "Regional Africa delivery", eta: "5–9 business days" };
  }
  return { cost: 3500, label: "International delivery", eta: "8–16 business days" };
}
