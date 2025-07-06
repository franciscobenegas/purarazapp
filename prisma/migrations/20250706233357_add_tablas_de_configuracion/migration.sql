-- CreateTable
CREATE TABLE "CausaMortandad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CausaMortandad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotivoPesaje" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotivoPesaje_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotivoEntrada" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotivoEntrada_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotivoSalida" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotivoSalida_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CausaMortandad_establesimiento_idx" ON "CausaMortandad"("establesimiento");

-- CreateIndex
CREATE INDEX "MotivoPesaje_establesimiento_idx" ON "MotivoPesaje"("establesimiento");

-- CreateIndex
CREATE INDEX "MotivoEntrada_establesimiento_idx" ON "MotivoEntrada"("establesimiento");

-- CreateIndex
CREATE INDEX "MotivoSalida_establesimiento_idx" ON "MotivoSalida"("establesimiento");
