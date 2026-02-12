-- AlterTable
ALTER TABLE "FrontendLayout" ADD COLUMN     "tournamentSectionName" TEXT DEFAULT 'homepageTournamentSection',
ALTER COLUMN "tournamentSectionAspectRatio" DROP DEFAULT;
