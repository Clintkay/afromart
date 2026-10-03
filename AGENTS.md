<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Messages owns seller-chat and system-notification tabs; legacy notification URLs redirect there to keep communication unified.
- AppShell maps related marketplace pages to stable navigation sections so detail pages retain an active destination.
- Signed-in carts persist through authenticated server functions with RLS ownership; remount cart state per identity and keep guest storage separate to prevent cross-account leakage.
