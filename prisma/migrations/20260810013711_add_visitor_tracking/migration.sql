-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "firstSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL,
    "landingPage" TEXT NOT NULL,
    "referrer" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "sourceBucket" TEXT NOT NULL DEFAULT 'direct',
    "device" TEXT NOT NULL DEFAULT 'desktop',

    CONSTRAINT "visitors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "page_views" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "visitors_visitorId_key" ON "visitors"("visitorId");

-- CreateIndex
CREATE INDEX "visitors_firstSeenAt_idx" ON "visitors"("firstSeenAt");

-- CreateIndex
CREATE INDEX "visitors_lastSeenAt_idx" ON "visitors"("lastSeenAt");

-- CreateIndex
CREATE INDEX "visitors_sourceBucket_idx" ON "visitors"("sourceBucket");

-- CreateIndex
CREATE INDEX "page_views_createdAt_idx" ON "page_views"("createdAt");

-- CreateIndex
CREATE INDEX "page_views_visitorId_idx" ON "page_views"("visitorId");

-- AddForeignKey
ALTER TABLE "page_views" ADD CONSTRAINT "page_views_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors"("visitorId") ON DELETE CASCADE ON UPDATE CASCADE;
