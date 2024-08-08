-- AlterTable
ALTER TABLE "UserData" ADD COLUMN     "taskIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "UserData_email_idx" ON "UserData"("email");
