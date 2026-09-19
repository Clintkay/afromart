import { useEffect, useRef } from "react";

const SITE_KEY = import.meta.env["VITE_TURNSTILE_SITE_KEY"] as string | undefined;

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: Record<string, unknown>) => string;
      reset: (id?: string) => void;
    };
  }
}

export const humanCheckEnabled = Boolean(SITE_KEY);

/**
 * Cloudflare Turnstile widget. Renders nothing until a site key is configured,
 * so the sign-in screen keeps working before Cloudflare is connected.
 */
export function HumanCheck({ onToken }: { onToken: (token: string | null) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    const container = ref.current;

    const render = () => {
      if (!window.turnstile || widgetId.current || !container) return;
      widgetId.current = window.turnstile.render(container, {
        sitekey: SITE_KEY,
        theme: "auto",
        callback: (token: string) => onToken(token),
        "expired-callback": () => onToken(null),
        "error-callback": () => onToken(null),
      });
    };

    if (window.turnstile) {
      render();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = render;
    document.head.appendChild(script);
  }, [onToken]);

  if (!SITE_KEY) return null;
  return <div ref={ref} className="mt-4 flex justify-center" />;
}
