import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type AssistantTurn = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `You are Afromart Assistant, the in-app help agent for Afromart, a pan-African multi-vendor marketplace for products and services.
Answer questions about orders, delivery, refunds, payments, accounts, selling, and safety.
Rules:
- Be concise: 2-5 short sentences, plain language, no jargon.
- Point to real places in the app: Orders, Messages, Settings, Start selling, Support.
- Never invent order numbers, prices, dates, or policies you are not sure about.
- If the question needs account access, a refund decision, a dispute, a payout issue, or anything you cannot verify, say so and tell the user to send a support request from this page so a human agent takes over.
- End with "ESCALATE" on its own final line when a human agent is needed.`;

export const askSupportAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: { history: AssistantTurn[]; question: string }) =>
    z
      .object({
        history: z
          .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
          .max(12)
          .default([]),
        question: z.string().trim().min(2).max(1000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Assistant unavailable");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...data.history,
          { role: "user", content: data.question },
        ],
      }),
    });

    if (response.status === 429) throw new Error("The assistant is busy. Try again in a moment.");
    if (!response.ok) throw new Error("The assistant could not answer right now.");

    const payload = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    const raw = payload.choices?.[0]?.message?.content?.trim() ?? "";
    const escalate = /ESCALATE\s*$/i.test(raw);
    const answer = raw.replace(/ESCALATE\s*$/i, "").trim();

    return {
      answer: answer || "I could not find an answer. Please send a support request so an agent can help.",
      escalate: escalate || !answer,
    };
  });
