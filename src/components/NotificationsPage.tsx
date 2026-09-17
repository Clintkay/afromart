import { useEffect } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Bell, LifeBuoy, Package, ShieldCheck, Sparkles } from "lucide-react";
import { notificationsOptions } from "@/lib/queries";
import { ensureWelcomeNotification, markNotificationsRead } from "@/lib/notifications.functions";

const icons: Record<string, typeof Bell> = {
  welcome: Sparkles,
  order: Package,
  support: LifeBuoy,
  security: ShieldCheck,
};

export function NotificationsPage() {
  const { data: notifications } = useSuspenseQuery(notificationsOptions);
  const queryClient = useQueryClient();
  const ensureWelcome = useServerFn(ensureWelcomeNotification);
  const markRead = useServerFn(markNotificationsRead);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await ensureWelcome({});
        await markRead({});
        if (cancelled) return;
        if (result?.created) await queryClient.invalidateQueries({ queryKey: notificationsOptions.queryKey });
      } catch {
        /* notifications are non-critical */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [ensureWelcome, markRead, queryClient]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-7 sm:px-6 sm:py-10">
      <header>
        <p className="text-xs font-bold uppercase text-primary">Inbox</p>
        <h1 className="mt-2 font-heading text-3xl font-bold">Messages from Afromart</h1>
        <p className="mt-2 text-sm text-muted-foreground">Order updates, support replies and account alerts.</p>
      </header>

      {notifications.length === 0 ? (
        <div className="mt-8 rounded-xl border bg-card p-8 text-center">
          <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-heading text-lg font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">We will let you know as soon as something happens.</p>
        </div>
      ) : (
        <ul className="mt-7 space-y-3">
          {notifications.map((item) => {
            const Icon = icons[item.kind] ?? Bell;
            return (
              <li key={item.id} className={`flex gap-3 rounded-xl border bg-card p-4 ${item.is_read ? "" : "border-primary/40 bg-primary/5"}`}>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-heading font-bold">{item.title}</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
