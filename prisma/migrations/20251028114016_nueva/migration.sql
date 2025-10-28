/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `Entrada` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Entrada_categoriaId_idx";

-- AlterTable
ALTER TABLE "Entrada" DROP COLUMN "categoriaId",
ADD COLUMN     "NombreEstanciaOrigen" TEXT;

-- CreateTable
CREATE TABLE "EntradaItem" (
    "id" TEXT NOT NULL,
    "entradaId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntradaItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EntradaItem_entradaId_idx" ON "EntradaItem"("entradaId");

-- CreateIndex
CREATE INDEX "EntradaItem_categoriaId_idx" ON "EntradaItem"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "EntradaItem_entradaId_categoriaId_key" ON "EntradaItem"("entradaId", "categoriaId");

-- CreateIndex
CREATE INDEX "Entrada_establesimiento_idx" ON "Entrada"("establesimiento");
