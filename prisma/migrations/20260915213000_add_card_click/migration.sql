-- Additive-only migration: creates one brand-new, fully isolated table for
-- the /connect digital business card's click analytics. Does not alter,
-- rename, or drop any existing table/column, and has no foreign keys into
-- any existing table, so it cannot affect existing data or queries.
CREATE TABLE "card_clicks" (
      "id" TEXT NOT NULL,
      "action" TEXT NOT NULL,
      "visitorId" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "card_clicks_pkey" PRIMARY KEY ("id")
  );

CREATE INDEX "card_clicks_action_idx" ON "card_clicks"("action");

CREATE INDEX "card_clicks_createdAt_idx" ON "card_clicks"("createdAt");
