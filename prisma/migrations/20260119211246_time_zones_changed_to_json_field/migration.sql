/*
  Warnings:

  - The `timeZones` column on the `TournamentLog` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TournamentLog" DROP COLUMN "timeZones",
ADD COLUMN     "timeZones" JSONB;
