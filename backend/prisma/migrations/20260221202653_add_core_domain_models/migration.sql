-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "targetValue" INTEGER,
    "currentValue" INTEGER NOT NULL DEFAULT 0,
    "deadline" TIMESTAMP(3),
    "status" "GoalStatus" NOT NULL DEFAULT 'ACTIVE',
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "numericProgress" INTEGER,
    "notes" TEXT,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "goalId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Goal_userId_idx" ON "Goal"("userId");

-- CreateIndex
CREATE INDEX "Goal_categoryId_idx" ON "Goal"("categoryId");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "ActivityLog_categoryId_idx" ON "ActivityLog"("categoryId");

-- CreateIndex
CREATE INDEX "ActivityLog_goalId_idx" ON "ActivityLog"("goalId");

-- CreateIndex
CREATE INDEX "ActivityLog_date_idx" ON "ActivityLog"("date");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_date_idx" ON "ActivityLog"("userId", "date");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_categoryId_idx" ON "ActivityLog"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;
