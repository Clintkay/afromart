import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  LifeBuoy,
  Mail,
  MessagesSquare,
  Package,
  PhoneCall,
  ShieldAlert,
  Store,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import supportHero from "@/assets/support-hero.jpg";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Afro Mart Support | Help & Contact" },
      {
        name: "description",
        content:
          "Get help with orders, deliveries, payments, sellers and your Afro Mart account. Browse common questions or send our team a message.",
      },
      { property: "og:title", content: "Afro Mart Support | Help & Contact" },
      {
        property: "og:description",
        content:
          "Get help with orders, deliveries, payments, sellers and your Afro Mart account. Browse common questions or send our team a message.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const topics = [
  {
    icon: Package,
    title: "Orders & delivery",
    body: "Track a parcel, change a delivery address or ask about a late order.",
    tone: "bg-brand-green/10 text-brand-green",
  },
  {
    icon: CreditCard,
    title: "Payments & refunds",
    body: "Card, bank transfer and mobile money questions, plus how refunds work.",
    tone: "bg-brand-gold/20 text-brand-gold",
  },
  {
    icon: Store,
    title: "Selling on Afro Mart",
    body: "Store set-up, verification, listings, payouts and promotions.",
    tone: "bg-brand-terracotta/15 text-brand-terracotta",
  },
  {
    icon: ShieldAlert,
    title: "Safety & disputes",
    body: "Report a listing, raise a dispute or flag a suspicious message.",
    tone: "bg-brand-coral/15 text-brand-coral",
  },
];

const faqs = [
  {
    q: "Do I need an account to look around?",
    a: "No. You can browse stores, products and services as a guest. An account only becomes useful when you want a wishlist, chat or order tracking.",
  },
  {
    q: "How do I track my order?",
    a: "Open your account and choose the order. You will see each step from confirmation to delivery, and you can message the store from the same screen.",
  },
  {
    q: "Which payment methods will be supported?",
    a: "Cards, bank transfer and mobile money, including local options such as Paystack, Ecobank Pay and MTN MoMo as they go live in each country.",
  },
  {
    q: "How do I become a seller?",
    a: "Open the Become a seller page, join the seller list and we will guide you through store creation and verification when sign-up opens.",
  },
  {
    q: "Can I chat with a store in my own language?",
    a: "Yes. Chat translates automatically across our ten launch languages, so you and the seller can each write in your own.",
  },
  {
    q: "Something went wrong with an order. What now?",
    a: "Report the issue from the order screen or send us a message below. Our team steps in and mediates between you and the store.",
  },
];

function SupportPage() {
  const [sent, setSent] = useState(false);

  return (
    <div>
      {/* Hero */}
      <section className="relative isolate overflow-hidden brand-soft">
        <div className="absolute inset-0 brand-pattern-light opacity-60" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand-green shadow-sm">
              <LifeBuoy className="h-3.5 w-3.5 text-brand-gold" />
              Support
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-brand-green sm:text-5xl">
              We are here, in your language
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground">
              Real people, seven days a week. Find a quick answer below or send us a message and we will come back to
              you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-foreground">
                <Mail className="h-4 w-4 text-brand-gold" /> help@afromart.app
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-foreground">
                <PhoneCall className="h-4 w-4 text-brand-gold" /> +234 800 000 0000
              </span>
              <span className="inline-flex items-center gap-2 rounded-xl border bg-card px-4 py-2 text-foreground">
                <MessagesSquare className="h-4 w-4 text-brand-gold" /> Live chat in the app
              </span>
            </div>
          </div>

          <img
            src={supportHero}
            alt="An Afro Mart support agent wearing a headset"
            width={1024}
            height={768}
            className="w-full rounded-3xl border object-cover shadow-lg"
          />
        </div>
      </section>

      {/* Topics */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-foreground">What do you need help with?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {topics.map((topic) => (
            <article key={topic.title} className="rounded-2xl border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1">
              <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${topic.tone}`}>
                <topic.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold text-foreground">{topic.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{topic.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ + contact */}
      <section className="bg-secondary/50">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">Common questions</span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground">Answers in a hurry</h2>
            <div className="mt-8 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.q} className="group rounded-2xl border bg-card p-5 shadow-sm">
                  <summary className="cursor-pointer list-none font-heading text-base font-semibold text-foreground marker:hidden">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-terracotta">Message us</span>
            <h2 className="mt-3 font-heading text-3xl font-bold text-foreground">Send us the details</h2>

            {sent ? (
              <div className="mt-8 flex items-start gap-3 rounded-2xl border border-brand-leaf/40 bg-brand-leaf/10 p-6">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-brand-green" />
                <div>
                  <p className="font-heading font-semibold text-foreground">Message received</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Our team replies within one working day. Meanwhile you can keep{" "}
                    <Link to="/products" className="font-semibold text-brand-green underline underline-offset-4">
                      exploring the marketplace
                    </Link>
                    .
                  </p>
                </div>
              </div>
            ) : (
              <form
                className="mt-8 space-y-4 rounded-2xl border bg-card p-6 shadow-sm"
                onSubmit={(event) => {
                  event.preventDefault();
                  setSent(true);
                  toast.success("Thanks — our support team will be in touch.");
                }}
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="support-name" className="text-sm font-medium text-foreground">
                      Your name
                    </label>
                    <Input id="support-name" required placeholder="Amina Bello" className="mt-1.5" />
                  </div>
                  <div>
                    <label htmlFor="support-email" className="text-sm font-medium text-foreground">
                      Email
                    </label>
                    <Input id="support-email" type="email" required placeholder="you@email.com" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <label htmlFor="support-subject" className="text-sm font-medium text-foreground">
                    Subject
                  </label>
                  <Input id="support-subject" required placeholder="Order, payment, selling…" className="mt-1.5" />
                </div>
                <div>
                  <label htmlFor="support-message" className="text-sm font-medium text-foreground">
                    How can we help?
                  </label>
                  <Textarea id="support-message" required rows={5} placeholder="Tell us what happened" className="mt-1.5" />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Send message
                </Button>
                <p className="text-xs text-muted-foreground">
                  We reply in English, French, Arabic, Portuguese, Swahili, Hausa, Yoruba, Zulu, Amharic and Igbo.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
