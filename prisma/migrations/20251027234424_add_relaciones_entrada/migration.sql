-- CreateTable
CREATE TABLE "Entrada" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "categoriaId" TEXT NOT NULL,
    "motivoId" TEXT NOT NULL,
    "propietarioId" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Entrada_categoriaId_idx" ON "Entrada"("categoriaId");

-- CreateIndex
CREATE INDEX "Entrada_motivoId_idx" ON "Entrada"("motivoId");

-- CreateIndex
CREATE INDEX "Entrada_propietarioId_idx" ON "Entrada"("propietarioId");
