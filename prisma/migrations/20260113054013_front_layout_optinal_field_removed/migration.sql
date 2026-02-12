/*
  Warnings:

  - Made the column `tournamentSectionName` on table `FrontendLayout` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "FrontendLayout" ALTER COLUMN "tournamentSectionName" SET NOT NULL;
