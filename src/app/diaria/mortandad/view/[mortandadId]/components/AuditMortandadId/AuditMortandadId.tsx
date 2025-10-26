"use client";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  User,
  Calendar,
  Edit,
  Plus,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

interface AuditValues {
  fecha?: string;
  numeroAnimal?: string | number;
  propietarioId?: string;
  categoriaId?: string;
  causaId?: string;
  potreroId?: string;
  ubicacionGps?: string;
  foto1?: string;
  foto2?: string;
  foto3?: string;
  usuario?: string;
  establesimiento?: string;
  [key: string]: unknown; // fallback
}

interface AuditRecord {
  id: string;
  tabla: string;
  registroId: string;
  accion: string;
  oldValues: AuditValues | null;
  newValues: AuditValues | null;
  usuarioId: string;
  createdAt: string;
}

interface AuditTabProps {
  recordId: string;
  tableName?: string;
}

export function AuditTab({ recordId }: AuditTabProps) {
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuditRecords = async () => {
      try {
        const response = await fetch(`/api/audit/record/${recordId}`);
        if (response.ok) {
          const data = await response.json();
          setAuditRecords(data);
        } else {
          toast.error("Error al cargar el historial de auditoría");
        }
      } catch (error) {
        console.error("Error fetching audit records:", error);
        toast.error("Error al cargar el historial de auditoría");
      } finally {
        setLoading(false);
      }
    };

    fetchAuditRecords();
  }, [recordId]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Plus className="h-4 w-4 text-green-600" />;
      case "UPDATE":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  const getActionBadge = (action: string) => {
    const variants = {
      CREATE: "default",
      UPDATE: "secondary",
      DELETE: "destructive",
    } as const;

    return (
      <Badge variant={variants[action as keyof typeof variants] || "outline"}>
        {action === "CREATE"
          ? "Creado"
          : action === "UPDATE"
          ? "Editado"
          : "Eliminado"}
      </Badge>
    );
  };

  const renderFieldChanges = (
    oldValues: Record<string, unknown> | null,
    newValues: Record<string, unknown> | null
  ) => {
    if (!oldValues || !newValues) return null;

    const changes: {
      field: string;
      oldValue: unknown;
      newValue: unknown;
    }[] = [];

    Object.keys({ ...oldValues, ...newValues }).forEach((key) => {
      const oldVal = formatFieldValue(oldValues[key]);
      const newVal = formatFieldValue(newValues[key]);

      if (oldVal !== newVal) {
        changes.push({
          field: key,
          oldValue: oldVal,
          newValue: newVal,
        });
      }
    });

    if (changes.length === 0) return null;

    return (
      <div className="mt-3 space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">
          Campos modificados:
        </h4>
        {changes.map((change, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm bg-muted/30 p-2 rounded"
          >
            <span className="font-medium min-w-0 flex-shrink-0">
              {getFieldLabel(change.field)}:
            </span>
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs truncate">
                {formatFieldValue(change.oldValue)}
              </span>
              <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs truncate">
                {formatFieldValue(change.newValue)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      fecha: "Fecha",
      numeroAnimal: "Número Animal",
      propietarioId: "Propietario",
      categoriaId: "Categoría",
      causaId: "Causa",
      potreroId: "Potrero",
      ubicacionGps: "Ubicación GPS",
      foto1: "Foto 1",
      foto2: "Foto 2",
      foto3: "Foto 3",
      usuario: "Usuario",
      establesimiento: "Establecimiento",
    };
    return labels[field] || field;
  };

  const formatFieldValue = (value: unknown): string => {
    if (value === null || value === undefined) return "Sin valor";
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (typeof value === "string" && value.includes("T")) {
      // Probablemente una fecha
      try {
        return new Date(value).toLocaleDateString("es-ES");
      } catch {
        return value;
      }
    }
    return String(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <History className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando historial...</p>
        </div>
      </div>
    );
  }

  if (auditRecords.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <History className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            No hay registros de auditoría disponibles
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center ">
      <ScrollArea className="h-[500px]  max-w-4xl pr-4 mb-5 ">
        <div className="space-y-4">
          {auditRecords.map((record) => (
            <Card
              key={record.id}
              className="border-l-4 border-l-primary/20 w-[92%]"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {getActionIcon(record.accion)}
                    {getActionBadge(record.accion)}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {formatDate(record.createdAt)}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-sm mb-3">
                  <User className="h-3 w-3" />
                  <span className="text-muted-foreground">Usuario:</span>
                  <span className="font-medium">{record.usuarioId}</span>
                </div>

                <Separator className="my-3" />

                {record.accion === "CREATE" && record.newValues && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Registro creado con los siguientes datos:
                    </h4>
                    <div className="bg-green-50 p-3 rounded text-sm">
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(record.newValues, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {record.accion === "UPDATE" &&
                  renderFieldChanges(record.oldValues, record.newValues)}

                {record.accion === "DELETE" && record.oldValues && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">
                      Registro eliminado:
                    </h4>
                    <div className="bg-red-50 p-3 rounded text-sm">
                      <pre className="whitespace-pre-wrap text-xs">
                        {JSON.stringify(record.oldValues, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
