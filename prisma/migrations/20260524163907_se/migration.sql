-- CreateTable
CREATE TABLE "Pesaje" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "numeroAnimal" TEXT NOT NULL,
    "peso" DOUBLE PRECISION NOT NULL,
    "propietarioId" TEXT NOT NULL,
    "categoriaId" TEXT,
    "motivoId" TEXT NOT NULL,
    "potreroId" TEXT,
    "observacion" TEXT,
    "usuario" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pesaje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pesaje_numeroAnimal_idx" ON "Pesaje"("numeroAnimal");

-- CreateIndex
CREATE INDEX "Pesaje_fecha_idx" ON "Pesaje"("fecha");

-- CreateIndex
CREATE INDEX "Pesaje_propietarioId_idx" ON "Pesaje"("propietarioId");

-- CreateIndex
CREATE INDEX "Pesaje_motivoId_idx" ON "Pesaje"("motivoId");

-- CreateIndex
CREATE INDEX "Pesaje_categoriaId_idx" ON "Pesaje"("categoriaId");

-- CreateIndex
CREATE INDEX "Pesaje_potreroId_idx" ON "Pesaje"("potreroId");

-- CreateIndex
CREATE INDEX "Pesaje_establesimiento_idx" ON "Pesaje"("establesimiento");
