-- CreateTable
CREATE TABLE "TournamentLog" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "game" TEXT,
    "startDate" TIMESTAMP(3),
    "playerCount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "TournamentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TournamentLog_name_key" ON "TournamentLog"("name");
