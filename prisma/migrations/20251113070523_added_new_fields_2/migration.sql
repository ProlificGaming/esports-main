/*
  Warnings:

  - A unique constraint covering the columns `[activationToken]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_activationToken_key" ON "Admin"("activationToken");
