/*
  Warnings:

  - A unique constraint covering the columns `[tournamentSectionName]` on the table `FrontendLayout` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "FrontendLayout" ALTER COLUMN "tournamentSectionName" DROP NOT NULL,
ALTER COLUMN "tournamentSectionName" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "FrontendLayout_tournamentSectionName_key" ON "FrontendLayout"("tournamentSectionName");
