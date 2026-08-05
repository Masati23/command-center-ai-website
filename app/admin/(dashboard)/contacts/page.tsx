import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = searchParams.q?.trim();

  const submissions = await db.contactSubmission.findMany({
    where: q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contact Submissions</h1>
          <p className="mt-1.5 text-sm text-silver-500">Every "Free AI Consultation" form submission.</p>
        </div>
        <div className="flex gap-2">
          <form action="/admin/contacts" className="flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search name, email, company…"
              className="w-64 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-electric-500/50"
            />
          </form>
          <a
            href="/api/admin/export/contacts"
            className="whitespace-nowrap rounded-lg border border-white/10 px-3 py-2 text-sm text-silver-300 hover:text-white"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {submissions.map((s) => (
          <GlassCard key={s.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-white">
                {s.name} <span className="font-normal text-silver-500">— {s.email}</span>
              </p>
              <p className="text-xs text-silver-500">{s.createdAt.toLocaleString("en-US")}</p>
            </div>
            {(s.phone || s.company) && (
              <p className="mt-1 text-xs text-silver-500">
                {[s.phone, s.company].filter(Boolean).join(" · ")}
              </p>
            )}
            <p className="mt-3 text-sm text-silver-300">{s.message}</p>
          </GlassCard>
        ))}
        {submissions.length === 0 && (
          <p className="py-8 text-center text-sm text-silver-500">No contact submissions yet.</p>
        )}
      </div>
    </div>
  );
}
