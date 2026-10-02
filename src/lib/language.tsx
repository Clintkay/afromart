import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Site-wide translation is handled by the Google Website Translator, which
 * translates every page (public site, buyer and seller areas). The chosen
 * language is stored in localStorage and the `googtrans` cookie so it
 * persists across pages and visits.
 */
export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "fr", label: "Français" },
  { value: "ar", label: "العربية" },
  { value: "pt", label: "Português" },
  { value: "sw", label: "Kiswahili" },
  { value: "ha", label: "Hausa" },
  { value: "yo", label: "Yorùbá" },
  { value: "zu", label: "isiZulu" },
  { value: "am", label: "አማርኛ" },
  { value: "ig", label: "Igbo" },
] as const;

const STORAGE_KEY = "afromart-language";
const LanguageContext = createContext({ language: "en", setLanguage: (_: string) => {}, t: (text: string) => text });

function writeCookie(lang: string) {
  const host = window.location.hostname;
  const value = lang === "en" ? "" : `/en/${lang}`;
  const expires = lang === "en" ? "Thu, 01 Jan 1970 00:00:00 GMT" : "Fri, 31 Dec 2099 23:59:59 GMT";
  for (const domain of ["", host, `.${host.split(".").slice(-2).join(".")}`]) {
    document.cookie = `googtrans=${value}; expires=${expires}; path=/${domain ? `; domain=${domain}` : ""}`;
  }
}

function loadTranslator() {
  if (document.getElementById("google-translate-script")) return;
  const holder = document.createElement("div");
  holder.id = "google_translate_element";
  holder.style.display = "none";
  document.body.appendChild(holder);
  (window as unknown as { googleTranslateElementInit: () => void }).googleTranslateElementInit = () => {
    const g = (window as unknown as { google?: { translate?: { TranslateElement: new (o: object, id: string) => unknown } } }).google;
    if (g?.translate) new g.translate.TranslateElement({ pageLanguage: "en", autoDisplay: false }, "google_translate_element");
  };
  const script = document.createElement("script");
  script.id = "google-translate-script";
  script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  script.async = true;
  document.body.appendChild(script);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState("en");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES.some((l) => l.value === saved)) {
      setLanguageState(saved);
      writeCookie(saved);
    }
    loadTranslator();
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = (value: string) => {
    if (value === language) return;
    localStorage.setItem(STORAGE_KEY, value);
    writeCookie(value);
    setLanguageState(value);
    window.location.reload();
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t: (text) => text }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  return (
    <select aria-label="Language" translate="no" value={language} onChange={(e) => setLanguage(e.target.value)} className="notranslate h-9 max-w-40 rounded-md border border-input bg-background px-2 text-sm text-foreground">
      {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
    </select>
  );
}
