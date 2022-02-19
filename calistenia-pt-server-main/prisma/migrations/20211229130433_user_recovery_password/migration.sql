-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordRecoveryCode" INTEGER;
ALTER TABLE "User" ADD COLUMN "passwordRecoveryExpiry" DATETIME;
