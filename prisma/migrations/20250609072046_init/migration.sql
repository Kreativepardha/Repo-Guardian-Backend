-- CreateEnum
CREATE TYPE "ScanStatus" AS ENUM ('PENDING', 'CLONING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Scan" (
    "id" SERIAL NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "status" "ScanStatus" NOT NULL,
    "results" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ToolRun" (
    "id" SERIAL NOT NULL,
    "scanId" INTEGER NOT NULL,
    "toolName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "output" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolRun_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ToolRun" ADD CONSTRAINT "ToolRun_scanId_fkey" FOREIGN KEY ("scanId") REFERENCES "Scan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
