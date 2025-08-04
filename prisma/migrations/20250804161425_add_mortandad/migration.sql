-- CreateTable
CREATE TABLE "Mortandad" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "propietarioId" TEXT NOT NULL,
    "numeroAnimal" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "causaId" TEXT NOT NULL,
    "potreroId" TEXT NOT NULL,
    "ubicacionGps" TEXT NOT NULL,
    "foto1" TEXT,
    "foto2" TEXT,
    "foto3" TEXT,
    "usuario" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mortandad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mortandad_establesimiento_idx" ON "Mortandad"("establesimiento");

-- CreateIndex
CREATE INDEX "Mortandad_fecha_idx" ON "Mortandad"("fecha");

-- CreateIndex
CREATE INDEX "Mortandad_propietarioId_idx" ON "Mortandad"("propietarioId");

-- CreateIndex
CREATE INDEX "Mortandad_categoriaId_idx" ON "Mortandad"("categoriaId");

-- CreateIndex
CREATE INDEX "Mortandad_causaId_idx" ON "Mortandad"("causaId");

-- CreateIndex
CREATE INDEX "Mortandad_potreroId_idx" ON "Mortandad"("potreroId");
