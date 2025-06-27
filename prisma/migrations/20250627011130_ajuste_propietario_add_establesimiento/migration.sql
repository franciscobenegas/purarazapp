/*
  Warnings:

  - Added the required column `establesimiento` to the `Propietario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propietario" ADD COLUMN     "establesimiento" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Propietario_establesimiento_idx" ON "Propietario"("establesimiento");
