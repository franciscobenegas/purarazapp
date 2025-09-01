import prisma from "@/libs/prisma";

type Accion = "CREATE" | "UPDATE" | "DELETE";

export async function auditar(
  tabla: string,
  accion: Accion,
  usuarioId: string,
  options: {
    registroId: string;
    oldValues?: unknown;
    newValues?: unknown;
  }
) {
  await prisma.auditoria.create({
    data: {
      tabla,
      registroId: options.registroId,
      accion,
      oldValues: options.oldValues
        ? JSON.stringify(options.oldValues)
        : undefined,
      newValues: options.newValues
        ? JSON.stringify(options.newValues)
        : undefined,
      usuarioId,
    },
  });
}

export async function auditCreate<T>(
  tabla: string,
  usuarioId: string,
  createFn: () => Promise<T & { id: string }>
): Promise<T> {
  const nuevo = await createFn();
  await auditar(tabla, "CREATE", usuarioId, {
    registroId: nuevo.id,
    newValues: nuevo,
  });
  return nuevo;
}

export async function auditUpdate<T>(
  tabla: string,
  usuarioId: string,
  id: string,
  getOldFn: () => Promise<T | null>,
  updateFn: () => Promise<T & { id: string }>
): Promise<T> {
  const oldRecord = await getOldFn();
  const updated = await updateFn();
  await auditar(tabla, "UPDATE", usuarioId, {
    registroId: id,
    oldValues: oldRecord,
    newValues: updated,
  });
  return updated;
}

export async function auditDelete<T>(
  tabla: string,
  usuarioId: string,
  id: string,
  getOldFn: () => Promise<T | null>,
  deleteFn: () => Promise<unknown>
): Promise<void> {
  const oldRecord = await getOldFn();
  await deleteFn();
  await auditar(tabla, "DELETE", usuarioId, {
    registroId: id,
    oldValues: oldRecord,
  });
}
