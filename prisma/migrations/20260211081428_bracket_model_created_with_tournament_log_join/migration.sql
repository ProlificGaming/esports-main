-- CreateTable
CREATE TABLE "Bracket" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "matchNumber" INTEGER NOT NULL,
    "player1" TEXT,
    "player2" TEXT,
    "winner" TEXT,

    CONSTRAINT "Bracket_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bracket" ADD CONSTRAINT "Bracket_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "TournamentLog"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
