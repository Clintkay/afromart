import { Link } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { ArrowRight, ShieldCheck, Store, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppScreen } from "@/components/AppScreen";
import { SellerVerificationEntry } from "@/components/SellerVerificationEntry";
import registrationScreen from "@/assets/app-screens/seller-registration.png.asset.json";
import businessScreen from "@/assets/app-screens/business-onboarding.png.asset.json";
import kycScreen from "@/assets/app-screens/kyc-upload.png.asset.json";
import approvalScreen from "@/assets/app-screens/approval-status.png.asset.json";

const steps = [
  { title: "Create your seller account", body: "Choose an individual or registered business account and enter your details.", image: registrationScreen.url },
  { title: "Tell us about your business", body: "Add your business type, location, address and operating areas.", image: businessScreen.url },
  { title: "Verify your identity", body: "Upload the documents needed to protect buyers and sellers on Afromart.", image: kycScreen.url },
  { title: "Track your approval", body: "See each verification check and know when your seller tools are ready.", image: approvalScreen.url },
];

export function SellerStartPage() {
  const { user } = useAuth();
  const startHref = user
    ? ({ to: "/seller" } as const)
    : ({ to: "/auth", search: { redirect: "/seller" } } as const);
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      <section className="brand-soft px-4 py-14 text-center sm:px-6">
        <span className="text-sm font-bold uppercase text-brand-green">Sell on Afromart</span>
        <h1 className="mx-auto mt-4 max-w-3xl font-heading text-4xl font-bold sm:text-6xl">Build a trusted Afromart storefront.</h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Create your account, verify your business and prepare your storefront from your phone.</p>
        <Link {...startHref} className="mt-8 inline-block"><Button size="lg"><UserRound className="h-4 w-4" /> Create seller account <ArrowRight className="h-4 w-4" /></Button></Link>
      </section>
      <SellerVerificationEntry />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <article key={step.title}>
              <AppScreen src={step.image} alt={`Afromart seller step ${index + 1}: ${step.title}`} className="w-full" />
              <div className="mt-6 flex items-center gap-3"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</span><h2 className="font-heading text-lg font-bold">{step.title}</h2></div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-y py-8 sm:flex-row"><div className="flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-brand-green" /><div><h2 className="font-heading text-xl font-bold">Ready to build your storefront?</h2><p className="text-sm text-muted-foreground">Start securely and continue inside Afromart.</p></div></div><Link {...startHref}><Button><Store className="h-4 w-4" /> Start selling</Button></Link></div>
      </section>
    </div>
  );
}