"use client";
import { AuditTab } from "@/app/components/AuditTab";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Prisma } from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import {
  Calendar,
  Edit,
  FileText,
  MapPin,
  PlusCircle,
  Shield,
  Trash2,
  User,
  Weight,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

type PesajeWithRelations = Prisma.PesajeGetPayload<{
  include: {
    propietario: true;
    motivo: true;
    categoria: true;
    potrero: true;
  };
}>;

interface PesajeProps {
  pesaje: PesajeWithRelations;
}

export function FormViewPesajeId(props: PesajeProps) {
  const { pesaje } = props;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [openModal, setopenModal] = useState(false);

  const handleDeleteConfirm = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/pesaje/${pesaje.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.ok) {
        toast.warning("Exito!!! 😃 ", {
          description: "Los datos fueron eliminados...",
        });
        router.push("/diaria/pesaje");
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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      <Card className="w-[85%]  mx-auto shadow-md rounded-xl border mt-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <PlusCircle className="h-5 w-5 text-primary" />
            Detalle Pesaje
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 ">
          <Tabs defaultValue="pesaje" className="w-[95%]">
            <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
              <TabsTrigger value="pesaje" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Vistas Pesaje
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
              value="pesaje"
              className="px-10 pb-4 space-y-4 text-sm  w-[70%] mx-auto"
            >
              <div className="w-full max-w-4xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      Detalles de Pesaje
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Información General */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Fecha de Pesaje
                        </label>
                        <div className="text-base font-medium bg-muted p-3 rounded-md">
                          {formatDate(pesaje.fecha)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Número de Animal
                        </label>
                        <div className="text-base font-medium bg-muted p-3 rounded-md">
                          {pesaje.numeroAnimal}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <Weight className="h-4 w-4" />
                          Peso
                        </label>
                        <div className="text-base font-medium bg-muted p-3 rounded-md">
                          {pesaje.peso} kg
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Motivo
                        </label>
                        <div className="text-base font-medium bg-muted p-3 rounded-md">
                          {pesaje.motivo.nombre}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Propietario
                        </label>
                        <div className="text-base font-medium bg-muted p-3 rounded-md">
                          {pesaje.propietario.nombre}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Categoría
                        </label>
                        <div className="text-base font-medium bg-muted p-3 rounded-md">
                          {pesaje.categoria?.nombre || "No especificado"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Potrero
                        </label>
                        <div className="text-base font-medium bg-muted p-3 rounded-md">
                          {pesaje.potrero?.nombre || "No especificado"}
                        </div>
                      </div>
                    </div>

                    {pesaje.observacion && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">
                            Observación
                          </label>
                          <div className="text-base bg-muted p-3 rounded-md">
                            {pesaje.observacion}
                          </div>
                        </div>
                      </>
                    )}

                    <Separator />

                    {/* Información de Auditoría */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Creado:</span>{" "}
                        {formatDate(pesaje.createdAt)}
                      </div>
                      <div>
                        <span className="font-medium">Actualizado:</span>{" "}
                        {formatDate(pesaje.updatedAt)}
                      </div>
                      <div>
                        <span className="font-medium">Usuario:</span>{" "}
                        {pesaje.usuario}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Botones de Acción */}
                <div className="flex justify-end gap-2 border-t px-4 py-3 bg-muted/30 rounded-b-xl">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-1 bg-transparent"
                    onClick={() =>
                      router.push(`/diaria/pesaje/edit/${pesaje.id}`)
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
              </div>
            </TabsContent>

            <TabsContent value="auditoria" className="px-4 pb-4">
              <AuditTab recordId={pesaje.id} tableName="Pesaje" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Dialog para Eliminar */}
      <Dialog open={!!openModal} onOpenChange={() => setopenModal(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary">
              Eliminar Pesaje 🗑️
            </DialogTitle>
            <DialogDescription>
              <p className="mt-2">
                ¿Estás seguro de que deseas eliminar el registro de pesaje de
                <span className="font-bold italic">
                  {" " + pesaje.numeroAnimal + " "}
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
