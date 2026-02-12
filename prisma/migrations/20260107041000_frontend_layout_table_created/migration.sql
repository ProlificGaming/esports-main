-- CreateTable
CREATE TABLE "FrontendLayout" (
    "id" TEXT NOT NULL,
    "tournamentSectionAspectRatio" TEXT DEFAULT '16:9',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FrontendLayout_pkey" PRIMARY KEY ("id")
);
