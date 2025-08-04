-- CreateTable
CREATE TABLE "Potrero" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,
    "usuario" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Potrero_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Potrero_establesimiento_idx" ON "Potrero"("establesimiento");
