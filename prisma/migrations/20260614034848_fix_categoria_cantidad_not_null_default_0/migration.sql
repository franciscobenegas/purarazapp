/*
  Warnings:

  - Made the column `cantidad` on table `Categoria` required. This step will fail if there are existing NULL values in that column.

*/
-- Backfill nulls before making column required
UPDATE "Categoria" SET "cantidad" = 0 WHERE "cantidad" IS NULL;

-- AlterTable
ALTER TABLE "Categoria" ALTER COLUMN "cantidad" SET NOT NULL,
ALTER COLUMN "cantidad" SET DEFAULT 0;
