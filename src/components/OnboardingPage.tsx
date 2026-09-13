import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { ChevronLeft } from "lucide-react";
import homeScreen from "@/assets/app-screens/home.png.asset.json";
import categoriesScreen from "@/assets/app-screens/categories.png.asset.json";
import servicesScreen from "@/assets/app-screens/services-home.png.asset.json";
import messagesScreen from "@/assets/app-screens/messages-list.png.asset.json";

const slides = [
  {
    image: homeScreen.url,
    alt: "Afromart home feed with featured African products",
    title: "Shop authentic African products",
    body: "Thousands of verified sellers across the continent, from groceries and beauty to fashion and crafts.",
  },
  {
    image: categoriesScreen.url,
    alt: "Afromart category browser",
    title: "Browse by category",
    body: "Jump straight to what you need, compare sellers and save the products you love.",
  },
  {
    image: servicesScreen.url,
    alt: "Afromart services marketplace",
    title: "Hire trusted professionals",
    body: "Designers, developers, photographers and more — book services the same way you shop.",
  },
  {
    image: messagesScreen.url,
    alt: "Afromart messages and order updates",
    title: "Stay updated end to end",
    body: "Chat with sellers, follow every delivery step and get order and support updates in the app.",
  },
] as const;

export function OnboardingPage() {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  const slide = slides[index]!;
  const isLast = index === slides.length - 1;

  const finish = () => navigate({ to: "/auth", search: { redirect: "/home", mode: "signup" } });

  return (
    <main className="flex min-h-dvh flex-col bg-card px-5 pb-6 pt-4 sm:px-10 lg:px-16">
      <div className="flex items-center justify-between">
        {index > 0 ? (
          <Button variant="ghost" size="icon" className="-ml-3 text-primary" onClick={() => setIndex(index - 1)} aria-label="Previous step">
            <ChevronLeft className="h-7 w-7" />
          </Button>
        ) : (
          <Logo variant="horizontal" className="h-7" />
        )}
        <Button variant="link" className="font-semibold text-muted-foreground" onClick={finish}>
          Skip
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center py-6 lg:max-w-lg">
        <div className="w-full overflow-hidden rounded-2xl border bg-secondary/40 p-4">
          <img src={slide.image} alt={slide.alt} className="mx-auto max-h-[46dvh] w-auto rounded-xl object-contain" />
        </div>
        <h1 className="mt-7 text-center font-heading text-2xl font-bold sm:text-3xl">{slide.title}</h1>
        <p className="mt-3 max-w-sm text-center text-sm leading-6 text-muted-foreground">{slide.body}</p>

        <div className="mt-6 flex items-center gap-2" aria-hidden="true">
          {slides.map((item, position) => (
            <span
              key={item.title}
              className={`h-2 rounded-full transition-all ${position === index ? "w-6 bg-primary" : "w-2 bg-border"}`}
            />
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <Button size="lg" className="h-13 w-full text-base font-bold" onClick={() => (isLast ? finish() : setIndex(index + 1))}>
          {isLast ? "Create your account" : "Continue"}
        </Button>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/auth" search={{ redirect: "/home", mode: "signin" }} className="font-bold text-primary">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
