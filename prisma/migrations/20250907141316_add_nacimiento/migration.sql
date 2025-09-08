-- CreateEnum
CREATE TYPE "Pelaje" AS ENUM ('Negro', 'Colorado', 'Blanco', 'Bayo', 'Barcino', 'Overo', 'Hosco', 'Pampa');

-- CreateTable
CREATE TABLE "Nacimiento" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "numeroVaca" TEXT,
    "numeroTernero" TEXT,
    "propietarioId" TEXT NOT NULL,
    "potreroId" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "peso" INTEGER,
    "pelaje" "Pelaje" NOT NULL,
    "usuario" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Nacimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Nacimiento_propietarioId_idx" ON "Nacimiento"("propietarioId");

-- CreateIndex
CREATE INDEX "Nacimiento_potreroId_idx" ON "Nacimiento"("potreroId");
