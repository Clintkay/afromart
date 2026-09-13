import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js";
import { Input } from "@/components/ui/input";

const names = new Intl.DisplayNames(["en"], { type: "region" });
const countries = getCountries().sort((a, b) => (names.of(a) ?? a).localeCompare(names.of(b) ?? b));

export function InternationalPhoneInput({ country, onCountryChange, value, onChange }: {
  country: CountryCode; onCountryChange: (value: CountryCode) => void;
  value: string; onChange: (value: string) => void;
}) {
  return <div className="mt-1.5 grid min-w-0 grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-2">
    <select aria-label="Phone country code" className="h-12 min-w-0 rounded-md border border-input bg-background px-2 text-sm" value={country} onChange={(event) => onCountryChange(event.target.value as CountryCode)}>
      {countries.map((code) => <option key={code} value={code}>{names.of(code)} (+{getCountryCallingCode(code)})</option>)}
    </select>
    <Input id="phone" type="tel" value={value} onChange={(event) => onChange(event.target.value)} required placeholder="Phone number" className="h-12 min-w-0" autoComplete="tel-national" />
  </div>;
}