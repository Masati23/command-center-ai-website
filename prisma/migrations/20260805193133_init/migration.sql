-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('CORE', 'MODULE');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'RETIRED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID', 'PARTIALLY_PAID', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentPlanType" AS ENUM ('FULL', 'DEPOSIT', 'MONTHLY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "OnboardingTaskStatus" AS ENUM ('PENDING', 'COMPLETED');

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "businessName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'DRAFT',
    "businessProfile" JSONB,
    "customerFlow" JSONB,
    "salesFollowUp" JSONB,
    "appointmentsService" JSONB,
    "operationsAutomation" JSONB,
    "softwareIntegrations" JSONB,
    "goalsTimelineBudget" JSONB,
    "currentSection" INTEGER NOT NULL DEFAULT 1,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submittedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "leadResponseScore" INTEGER NOT NULL,
    "followUpScore" INTEGER NOT NULL,
    "appointmentAutomationScore" INTEGER NOT NULL,
    "customerServiceScore" INTEGER NOT NULL,
    "operationalEfficiencyScore" INTEGER NOT NULL,
    "integrationComplexityScore" INTEGER NOT NULL,
    "overallReadinessScore" INTEGER NOT NULL,
    "complexityTier" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "ProductCategory" NOT NULL,
    "basePrice" INTEGER NOT NULL,
    "monthlySupport" INTEGER NOT NULL,
    "buildTimeDays" INTEGER NOT NULL,
    "features" JSONB NOT NULL,
    "tags" JSONB NOT NULL,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "integrations" JSONB,
    "status" "ProductStatus" NOT NULL DEFAULT 'ACTIVE',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendations" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "priorityTier" TEXT NOT NULL,
    "weightScore" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT true,
    "adjusted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "recommendations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bundle_rules" (
    "id" TEXT NOT NULL,
    "minItems" INTEGER NOT NULL,
    "discountPct" INTEGER NOT NULL,
    "isCustomTier" BOOLEAN NOT NULL DEFAULT false,
    "editable" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "bundle_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pricing_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "label" TEXT NOT NULL,
    "group" TEXT NOT NULL,

    CONSTRAINT "pricing_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "customerId" TEXT,
    "recommendedProductsSnapshot" JSONB NOT NULL,
    "pricingSnapshot" JSONB NOT NULL,
    "path" TEXT NOT NULL,
    "pdfUrl" TEXT,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "proposalId" TEXT,
    "path" TEXT NOT NULL,
    "paymentPlanType" "PaymentPlanType" NOT NULL DEFAULT 'FULL',
    "amountTotal" INTEGER NOT NULL,
    "amountDue" INTEGER NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "stripeCheckoutSessionId" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "onboarding_tasks" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "assetType" TEXT,
    "status" "OnboardingTaskStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "onboarding_tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_tickets" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coupons" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountPct" INTEGER,
    "discountFlat" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_submissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "company" TEXT,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_conversations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "leadCaptured" BOOLEAN NOT NULL DEFAULT false,
    "customerEmail" TEXT,
    "serviceInterest" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chat_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "flaggedUnanswered" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_log" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "refId" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE INDEX "assessments_status_idx" ON "assessments"("status");

-- CreateIndex
CREATE INDEX "assessments_customerId_idx" ON "assessments"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "scores_assessmentId_key" ON "scores"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "recommendations_assessmentId_idx" ON "recommendations"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "pricing_config_key_key" ON "pricing_config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_assessmentId_key" ON "proposals"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_stripeCheckoutSessionId_key" ON "orders"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "orders_customerId_idx" ON "orders"("customerId");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeEventId_key" ON "payments"("stripeEventId");

-- CreateIndex
CREATE INDEX "payments_orderId_idx" ON "payments"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");

-- CreateIndex
CREATE INDEX "contact_submissions_createdAt_idx" ON "contact_submissions"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "chat_conversations_sessionId_key" ON "chat_conversations"("sessionId");

-- CreateIndex
CREATE INDEX "chat_messages_conversationId_idx" ON "chat_messages"("conversationId");

-- CreateIndex
CREATE INDEX "event_log_type_idx" ON "event_log"("type");

-- CreateIndex
CREATE INDEX "event_log_refId_idx" ON "event_log"("refId");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "proposals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "onboarding_tasks" ADD CONSTRAINT "onboarding_tasks_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "chat_conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
