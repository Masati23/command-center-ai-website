-- AlterTable
ALTER TABLE "admin_users" ADD COLUMN     "lastSeenAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "chat_messages" ADD COLUMN     "recommendedServiceSlug" TEXT;

-- AlterTable
ALTER TABLE "contact_submissions" ADD COLUMN     "budget" TEXT,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "ownerNotes" TEXT,
ADD COLUMN     "preferredContactMethod" TEXT,
ADD COLUMN     "preferredContactTime" TEXT,
ADD COLUMN     "referralSource" TEXT,
ADD COLUMN     "serviceInterest" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'new';

-- AlterTable
ALTER TABLE "event_log" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE INDEX "contact_submissions_status_idx" ON "contact_submissions"("status");

-- CreateIndex
CREATE INDEX "event_log_email_idx" ON "event_log"("email");
