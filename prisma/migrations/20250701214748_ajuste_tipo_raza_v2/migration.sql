/*
  Warnings:

  - You are about to drop the column `estanciaId` on the `TipoRaza` table. All the data in the column will be lost.
  - Added the required column `establesimiento` to the `TipoRaza` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuario` to the `TipoRaza` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TipoRaza" DROP COLUMN "estanciaId",
ADD COLUMN     "establesimiento" TEXT NOT NULL,
ADD COLUMN     "usuario" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "TipoRaza_establesimiento_idx" ON "TipoRaza"("establesimiento");
