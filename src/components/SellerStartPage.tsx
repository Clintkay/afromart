import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, BriefcaseBusiness, Check, Eye, EyeOff, Mail, Store, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

type Role = "seller" | "service";

export function SellerStartPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("seller");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/60 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-lg lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="bg-primary p-8 text-primary-foreground sm:p-10">
          <Logo variant="horizontal" className="h-11 rounded-md bg-card p-1" />
          <p className="mt-12 text-sm font-semibold text-primary-foreground/70">START SELLING</p>
          <h1 className="mt-3 font-heading text-3xl font-bold">Build your place in Africa&apos;s marketplace.</h1>
          <ol className="mt-10 space-y-6">
            {["Choose your role", "Create your account", "Set up your store", "Add your first listing"].map((item, index) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <span className={`grid h-8 w-8 place-items-center rounded-full border ${index < step ? "bg-accent text-accent-foreground" : "border-primary-foreground/30"}`}>
                  {index < step - 1 ? <Check className="h-4 w-4" /> : index + 1}
                </span>
                <span className={index < step ? "font-semibold" : "text-primary-foreground/60"}>{item}</span>
              </li>
            ))}
          </ol>
        </aside>

        <section className="p-7 sm:p-12">
          <p className="text-sm font-semibold text-brand-terracotta">Step {step} of 4</p>
          {step === 1 ? (
            <>
              <h2 className="mt-3 font-heading text-3xl font-bold">How will you use Afro Mart?</h2>
              <p className="mt-2 text-muted-foreground">Choose the path that best describes what you offer.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { id: "seller" as const, icon: Store, title: "Sell products", body: "Food, fashion, beauty, craft and everyday goods." },
                  { id: "service" as const, icon: BriefcaseBusiness, title: "Offer services", body: "Tailoring, catering, repairs, creative work and more." },
                ].map((option) => (
                  <button
                    type="button"
                    key={option.id}
                    onClick={() => setRole(option.id)}
                    className={`min-h-44 rounded-xl border-2 p-5 text-left transition-colors ${role === option.id ? "border-brand-green bg-brand-green/5" : "border-border bg-card"}`}
                  >
                    <option.icon className="h-7 w-7 text-brand-green" />
                    <span className="mt-5 block font-heading text-lg font-bold">{option.title}</span>
                    <span className="mt-2 block text-sm text-muted-foreground">{option.body}</span>
                  </button>
                ))}
              </div>
              <Button size="lg" className="mt-8 w-full" onClick={() => setStep(2)}>
                Continue <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <h2 className="mt-3 font-heading text-3xl font-bold">Create your seller account</h2>
              <p className="mt-2 text-muted-foreground">You chose to {role === "seller" ? "sell products" : "offer services"}. You can add the other later.</p>
              <form className="mt-8 space-y-5" onSubmit={(event) => event.preventDefault()}>
                <div><Label htmlFor="seller-name">Full name</Label><Input id="seller-name" className="mt-2" placeholder="Your full name" /></div>
                <div><Label htmlFor="seller-email">Email address</Label><div className="relative mt-2"><Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input id="seller-email" type="email" className="pl-9" placeholder="you@email.com" /></div></div>
                <div><Label htmlFor="seller-password">Password</Label><div className="relative mt-2"><Input id="seller-password" type={showPassword ? "text" : "password"} className="pr-10" placeholder="At least 8 characters" /><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button></div></div>
                <Link to="/auth" search={{ redirect: "/account" }} className="block"><Button size="lg" className="w-full"><UserRound className="h-4 w-4" /> Continue to verification</Button></Link>
              </form>
              <Button variant="ghost" className="mt-4 w-full" onClick={() => setStep(1)}>Back</Button>
            </>
          )}
        </section>
      </div>
    </div>
  );
}