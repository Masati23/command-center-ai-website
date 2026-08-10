import { db } from "@/lib/db";
import { GlassCard } from "@/components/ui";

export const dynamic = "force-dynamic";

const SOURCE_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
  google: "Google / Search",
  direct: "Direct",
  other: "Other",
};

function deviceLabel(device: string): string {
  if (device === "mobile") return "📱 Mobile";
  if (device === "tablet") return "📱 Tablet";
  return "🖥️ Desktop";
}

export default async function AdminTrafficPage() {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalVisitors, uniqueVisitorsToday, liveVisitors, totalPageViews, pageViewsToday, sourceBucketGroups, recentVisitors] =
    await Promise.all([
      db.visitor.count(),
      db.visitor.count({ where: { lastSeenAt: { gte: startOfToday } } }),
      db.visitor.count({ where: { lastSeenAt: { gte: fiveMinutesAgo } } }),
      db.pageView.count(),
      db.pageView.count({ where: { createdAt: { gte: startOfToday } } }),
      db.visitor.groupBy({ by: ["sourceBucket"], _count: true }),
      db.visitor.findMany({
        orderBy: { lastSeenAt: "desc" },
        take: 100,
        include: {
          pageViews: { orderBy: { createdAt: "desc" }, take: 1 },
          _count: { select: { pageViews: true } },
        },
      }),
    ]);

  const sourceBucketCounts = Object.fromEntries(sourceBucketGroups.map((g) => [g.sourceBucket, g._count as number]));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Traffic &amp; Visitors</h1>
      <p className="mt-1.5 text-sm text-silver-500">
        Real, persisted visitor and page-view data — recorded server-side on every non-admin page load, survives
        refreshes and deployments.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Live Now</p>
          <p className="mt-2 text-2xl font-semibold text-white">{liveVisitors}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Unique Today</p>
          <p className="mt-2 text-2xl font-semibold text-white">{uniqueVisitorsToday}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Total Visitors</p>
          <p className="mt-2 text-2xl font-semibold text-white">{totalVisitors}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Page Views Today</p>
          <p className="mt-2 text-2xl font-semibold text-white">{pageViewsToday}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs uppercase tracking-wide text-silver-500">Total Page Views</p>
          <p className="mt-2 text-2xl font-semibold text-white">{totalPageViews}</p>
        </GlassCard>
      </div>

      <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-silver-500">Traffic Sources</p>
      <GlassCard className="mt-3 p-0">
        <div className="divide-y divide-white/5">
          {Object.entries(SOURCE_LABELS).map(([bucket, label]) => (
            <div key={bucket} className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
              <span className="text-silver-300">{label}</span>
              <span className="font-semibold text-white">{sourceBucketCounts[bucket] ?? 0}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <p className="mt-10 text-xs font-semibold uppercase tracking-wide text-silver-500">Recent Visitors</p>
      <GlassCard className="mt-3 overflow-x-auto p-0">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wide text-silver-500">
              <th className="px-5 py-3 font-medium">Last Seen</th>
              <th className="px-5 py-3 font-medium">Landing Page</th>
              <th className="px-5 py-3 font-medium">Current Page</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">UTM Campaign</th>
              <th className="px-5 py-3 font-medium">Device</th>
              <th className="px-5 py-3 font-medium">Page Views</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {recentVisitors.map((v) => {
              const isLive = v.lastSeenAt >= fiveMinutesAgo;
              return (
                <tr key={v.id}>
                  <td className="whitespace-nowrap px-5 py-3 text-silver-300">{v.lastSeenAt.toLocaleString("en-US")}</td>
                  <td className="px-5 py-3 text-silver-300">{v.landingPage}</td>
                  <td className="px-5 py-3 text-silver-300">{v.pageViews[0]?.path ?? v.landingPage}</td>
                  <td className="px-5 py-3 text-silver-300">{SOURCE_LABELS[v.sourceBucket] ?? v.sourceBucket}</td>
                  <td className="px-5 py-3 text-silver-300">{v.utmCampaign ?? "—"}</td>
                  <td className="px-5 py-3 text-silver-300">{deviceLabel(v.device)}</td>
                  <td className="px-5 py-3 text-silver-300">{v._count.pageViews}</td>
                  <td className="px-5 py-3">
                    {isLive ? (
                      <span className="rounded-full bg-green-500/15 px-2.5 py-1 text-xs font-medium text-green-400">● Live</span>
                    ) : (
                      <span className="text-xs text-silver-500">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
            {recentVisitors.length === 0 && (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-sm text-silver-500">
                  No visitors recorded yet. This fills in as soon as a real, non-admin visit hits the site.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
