/*
  Warnings:

  - You are about to drop the column `tournamentSectionAspectRatio` on the `FrontendLayout` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentSectionName` on the `FrontendLayout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sectionName]` on the table `FrontendLayout` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "FrontendLayout_tournamentSectionName_key";

-- AlterTable
ALTER TABLE "FrontendLayout" DROP COLUMN "tournamentSectionAspectRatio",
DROP COLUMN "tournamentSectionName",
ADD COLUMN     "SectionAspectRatio" TEXT,
ADD COLUMN     "sectionName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "FrontendLayout_sectionName_key" ON "FrontendLayout"("sectionName");
