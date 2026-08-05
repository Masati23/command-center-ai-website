import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { toCsv, csvResponse } from "@/lib/csv";
import { formatCents } from "@/lib/pricing";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await db.order.findMany({
    include: { customer: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = orders.map((o) => ({
    customer: o.customer.name,
    email: o.customer.email,
    plan: o.paymentPlanType,
    amountDue: formatCents(o.amountDue),
    amountTotal: formatCents(o.amountTotal),
    status: o.status,
    createdAt: o.createdAt.toISOString(),
  }));

  return csvResponse(toCsv(rows), "orders.csv");
}
