-- CreateTable
CREATE TABLE "Auditoria" (
    "id" TEXT NOT NULL,
    "tabla" TEXT NOT NULL,
    "registroId" TEXT NOT NULL,
    "accion" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "usuarioId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auditoria_pkey" PRIMARY KEY ("id")
);
