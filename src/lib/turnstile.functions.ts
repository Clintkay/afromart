import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({ token: z.string().min(1) });

/**
 * Verifies a Cloudflare Turnstile ("confirm you are human") token server-side.
 * When Turnstile is not configured yet, verification is skipped so sign-in keeps working.
 */
export const verifyHumanCheck = createServerFn({ method: "POST" })
  .inputValidator((input: { token: string }) => schema.parse(input))
  .handler(async ({ data }) => {
    const secret = process.env["TURNSTILE_SECRET_KEY"];
    if (!secret) return { ok: true, configured: false };

    const body = new URLSearchParams({ secret, response: data.token });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const result = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    return { ok: result.success === true, configured: true, errors: result["error-codes"] ?? [] };
  });
