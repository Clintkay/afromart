import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { myStoreOptions } from "@/lib/queries";
import { StoreVerification } from "@/components/StoreVerification";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export function SellerVerificationEntry() {
  const { user } = useAuth();
  const store = useQuery({ ...myStoreOptions, enabled: Boolean(user) });
  return <section id="verify-business" className="border-y bg-background">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <ShieldCheck className="h-8 w-8 text-primary" />
      <h2 className="mt-3 font-heading text-3xl font-bold">Get your business verified</h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">Submit your business registration, government ID or proof of business address. Afromart reviews your credentials before adding a verified badge to your storefront.</p>
      {!user ? <Button asChild className="mt-5"><Link to="/auth" search={{ redirect: "/sell/start" }}>Sign in to verify your business</Link></Button>
        : store.isLoading ? <p className="mt-5" role="status">Loading your business…</p>
        : store.isError ? <p className="mt-5" role="alert">Could not load your store. <Button variant="outline" onClick={() => store.refetch()}>Try again</Button></p>
        : store.data ? <><StoreVerification storeId={store.data.id} verified={store.data.is_verified} /><Button asChild variant="outline"><Link to="/stores/$slug" params={{ slug: store.data.slug }}>View my storefront</Link></Button></>
        : <Button asChild className="mt-5"><Link to="/seller">Create your store to continue</Link></Button>}
    </div>
  </section>;
}