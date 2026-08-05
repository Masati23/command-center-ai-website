import AdminShell from "@/components/admin/AdminShell";

// A route group (parens don't affect the URL) so /admin/login stays outside
// this shell — the login page shouldn't show a nav for pages you can't
// reach yet. Everything else under /admin gets the shared header/nav here,
// and the actual access control happens in middleware.ts, not this layout.
export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
