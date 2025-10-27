"use client";
import { AuditTab } from "@/app/components/AuditTab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prisma } from "@prisma/client";
import {
  Calendar,
  Edit,
  FileText,
  MapPin,
  MilkIcon,
  Shield,
  Tag,
  Trash2,
  TreePine,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type NacimientoWithRelations = Prisma.NacimientoGetPayload<{
  include: {
    propietario: true;
    potrero: true;
  };
}>;

interface NacimientoProps {
  nacimiento: NacimientoWithRelations;
}

export function FormViewNacimientoId({ nacimiento }: NacimientoProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openModal, setopenModal] = useState(false);

  const formatDate = (date: Date | string) =>
    new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/nacimiento/${nacimiento.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.ok) {
        toast.warning("Exito!!! 😃 ", {
          description: "Los datos fueron eliminados...",
        });
        router.push("/diaria/nacimiento");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : String(error);
      toast.error("Error !!!", {
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDateOnly = (date: Date | string) =>
    new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div>
      <Card className="w-[85%]  mx-auto shadow-md rounded-xl border mt-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <MilkIcon className="h-5 w-5 text-primary" />
            {/* <AlertTriangle className="h-5 w-5 text-destructive" /> */}
            Detalle Nacimiento
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 ">
          <Tabs defaultValue="nacimiento" className="w-[95%]">
            <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
              <TabsTrigger
                value="nacimiento"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Vistas Nacimiento
              </TabsTrigger>
              <TabsTrigger
                value="auditoria"
                className="flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Auditoría
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="nacimiento"
              className="px-10 pb-4 space-y-4 text-sm  w-[70%] mx-auto"
            >
              {/* Información Principal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    Fecha
                  </div>
                  <p className="text-base font-semibold text-primary">
                    {formatDateOnly(nacimiento.fecha)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Animal */}
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                  <Tag className="h-4 w-4" />
                  Animal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p>
                    <span className="text-xs text-muted-foreground">
                      Número:
                    </span>{" "}
                    #{nacimiento.numeroTernero}
                  </p>

                  <div>
                    <span className="text-xs text-muted-foreground mr-2">
                      Sexo:
                    </span>
                    <Badge className="text-xs">{nacimiento.sexo}</Badge>
                  </div>

                  <p>
                    <span className="text-xs text-muted-foreground">
                      Nro Madre:
                    </span>{" "}
                    #{nacimiento.numeroVaca}
                  </p>

                  {/* ✅ Nuevo campo: Peso del Ternero */}
                  <p>
                    <span className="text-xs text-muted-foreground">
                      Peso del Ternero (Kg.):
                    </span>{" "}
                    {nacimiento.peso
                      ? `${nacimiento.peso} Kg`
                      : "No registrado"}
                  </p>

                  {/* ✅ Nuevo campo: Pelaje */}
                  <div>
                    <span className="text-xs text-muted-foreground mr-2">
                      Pelaje:
                    </span>
                    <Badge className="text-xs">{nacimiento.pelaje}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Propietario */}
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  Propietario
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p>
                    <span className="text-xs text-muted-foreground">
                      Nombre:
                    </span>{" "}
                    {nacimiento.propietario.nombre}
                  </p>
                  <p>
                    <span className="text-xs text-muted-foreground">
                      Email:
                    </span>{" "}
                    {nacimiento.propietario.email}
                  </p>
                  <p>
                    <span className="text-xs text-muted-foreground">
                      Teléfono:
                    </span>{" "}
                    {nacimiento.propietario.telefono}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Ubicación */}
              <div>
                <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <p>
                    <TreePine className="inline h-3 w-3 mr-1" />
                    {nacimiento.potrero.nombre}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Sistema */}
              <div>
                <h3 className="font-medium mb-2 text-sm">Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <p>Creado: {formatDate(nacimiento.createdAt)}</p>
                  <p>Actualizado: {formatDate(nacimiento.updatedAt)}</p>
                  <p>Usuario: {nacimiento.usuario}</p>
                  <p>Establecimiento: {nacimiento.establesimiento}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="auditoria" className="px-4 pb-4">
              <AuditTab recordId={nacimiento.id} tableName="Nacimiento" />
            </TabsContent>
          </Tabs>
        </CardContent>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t px-4 py-3 bg-muted/30 rounded-b-xl">
          <Button
            variant="outline"
            size="lg"
            className="gap-1 bg-transparent"
            onClick={() =>
              router.push(`/diaria/nacimiento/edit/${nacimiento.id}`)
            }
          >
            <Edit className="h-3 w-3" /> Editar
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="gap-1"
            onClick={() => setopenModal(true)}
          >
            <Trash2 className="h-3 w-3" /> Eliminar
          </Button>
        </div>
      </Card>

      {/* Dialog para Eliminar */}
      <Dialog open={!!openModal} onOpenChange={() => setopenModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">
              Eliminar Nacimiento 🗑️
            </DialogTitle>
            <DialogDescription>
              <p className="mt-2">
                ¿Estás seguro de que deseas eliminar el registro de
                <span className="font-bold italic">
                  {" " + nacimiento.numeroTernero + " "}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose>
              <Button
                className="mr-5"
                variant="outline"
                onClick={() => setopenModal(false)}
                size="lg"
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={loading}
                size="lg"
              >
                Eliminar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
