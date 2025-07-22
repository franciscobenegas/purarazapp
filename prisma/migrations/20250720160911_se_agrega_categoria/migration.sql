-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('Macho', 'Hembra');

-- CreateEnum
CREATE TYPE "Edad" AS ENUM ('RecienNacido', 'Adulto', 'Joven');

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "edad" "Edad" NOT NULL,
    "promedioKilos" INTEGER NOT NULL,
    "precioVentaCabeza" INTEGER NOT NULL,
    "precioVentaKilo" INTEGER NOT NULL,
    "precioCostoCabeza" INTEGER NOT NULL,
    "precioCostoKilo" INTEGER NOT NULL,
    "usuario" TEXT NOT NULL,
    "establesimiento" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Categoria_establesimiento_idx" ON "Categoria"("establesimiento");
