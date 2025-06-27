/*
  Warnings:

  - You are about to drop the column `telfono` on the `Propietario` table. All the data in the column will be lost.
  - Added the required column `telefono` to the `Propietario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Propietario" DROP COLUMN "telfono",
ADD COLUMN     "telefono" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TipoRaza" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "estanciaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TipoRaza_pkey" PRIMARY KEY ("id")
);
