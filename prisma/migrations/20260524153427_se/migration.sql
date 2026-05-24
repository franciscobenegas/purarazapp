-- CreateTable
CREATE TABLE "Salida" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "propietarioId" TEXT NOT NULL,
    "motivoId" TEXT NOT NULL,
    "NombreEstanciaSalida" TEXT,
    "usuario" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Salida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalidaItem" (
    "id" TEXT NOT NULL,
    "salidaId" TEXT NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalidaItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Salida_propietarioId_idx" ON "Salida"("propietarioId");

-- CreateIndex
CREATE INDEX "Salida_establesimiento_idx" ON "Salida"("establesimiento");

-- CreateIndex
CREATE INDEX "Salida_motivoId_idx" ON "Salida"("motivoId");

-- CreateIndex
CREATE INDEX "SalidaItem_salidaId_idx" ON "SalidaItem"("salidaId");

-- CreateIndex
CREATE INDEX "SalidaItem_categoriaId_idx" ON "SalidaItem"("categoriaId");

-- CreateIndex
CREATE UNIQUE INDEX "SalidaItem_salidaId_categoriaId_key" ON "SalidaItem"("salidaId", "categoriaId");
