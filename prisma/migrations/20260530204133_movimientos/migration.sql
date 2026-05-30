-- CreateTable
CREATE TABLE "Movimiento" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipo" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "cantidad" INTEGER,
    "entradaId" TEXT,
    "salidaId" TEXT,
    "nacimientoId" TEXT,
    "mortandadId" TEXT,
    "usuario" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movimiento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Movimiento_categoriaId_idx" ON "Movimiento"("categoriaId");

-- CreateIndex
CREATE INDEX "Movimiento_entradaId_idx" ON "Movimiento"("entradaId");

-- CreateIndex
CREATE INDEX "Movimiento_salidaId_idx" ON "Movimiento"("salidaId");

-- CreateIndex
CREATE INDEX "Movimiento_nacimientoId_idx" ON "Movimiento"("nacimientoId");

-- CreateIndex
CREATE INDEX "Movimiento_mortandadId_idx" ON "Movimiento"("mortandadId");

-- CreateIndex
CREATE INDEX "Movimiento_establesimiento_idx" ON "Movimiento"("establesimiento");

-- CreateIndex
CREATE INDEX "Movimiento_fecha_idx" ON "Movimiento"("fecha");

-- CreateIndex
CREATE INDEX "Movimiento_tipo_idx" ON "Movimiento"("tipo");
