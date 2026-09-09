import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, User } from "lucide-react";

export function AccountPage() {
  const { user, isLoading, signOut } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold">My account</h1>

      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
            <User className="h-7 w-7 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>{user?.email ?? "Account"}</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your profile and orders here.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-secondary/50 p-4 text-sm text-muted-foreground">
            Order history and saved addresses will appear here once checkout is connected.
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/products">
              <Button variant="outline">Continue shopping</Button>
            </Link>
            <Button
              variant="destructive"
              onClick={async () => {
                await signOut();
                navigate({ to: "/auth" });
              }}
            >
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
