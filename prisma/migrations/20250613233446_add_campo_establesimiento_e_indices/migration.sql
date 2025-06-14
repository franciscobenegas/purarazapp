/*
  Warnings:

  - Added the required column `establesimiento` to the `Estancia` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Estancia" ADD COLUMN     "establesimiento" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Estancia_establesimiento_idx" ON "Estancia"("establesimiento");

-- CreateIndex
CREATE INDEX "Estancia_departamento_idx" ON "Estancia"("departamento");
