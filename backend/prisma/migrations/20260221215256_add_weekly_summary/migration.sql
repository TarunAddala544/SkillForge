-- CreateTable
CREATE TABLE "WeeklySummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "totalMinutes" INTEGER NOT NULL DEFAULT 0,
    "totalProgress" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklySummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeeklySummary_userId_idx" ON "WeeklySummary"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WeeklySummary_userId_weekStart_key" ON "WeeklySummary"("userId", "weekStart");

-- AddForeignKey
ALTER TABLE "WeeklySummary" ADD CONSTRAINT "WeeklySummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
