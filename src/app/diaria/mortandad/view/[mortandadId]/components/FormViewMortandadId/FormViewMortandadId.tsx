"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Prisma } from "@prisma/client";
import {
  AlertTriangle,
  Calendar,
  Camera,
  Edit,
  MapPin,
  Tag,
  Trash2,
  TreePine,
  User,
  ExternalLink,
  FileText,
  Shield,
} from "lucide-react";

import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AuditTab } from "../AuditMortandadId";

type MortandadWithRelations = Prisma.MortandadGetPayload<{
  include: {
    propietario: true;
    categoria: true;
    causa: true;
    potrero: true;
  };
}>;

interface FormMortandadProps {
  mortandad: MortandadWithRelations;
}

export function FormViewMortandadId({ mortandad }: FormMortandadProps) {
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
      const resp = await fetch(`/api/mortandad/${mortandad.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (resp.ok) {
        toast.warning("Exito!!! 😃 ", {
          description: "Los datos fueron eliminados...",
        });
        router.push("/diaria/mortandad");
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

  const photos = [mortandad.foto1, mortandad.foto2, mortandad.foto3].filter(
    Boolean
  );

  const openGoogleMaps = () => {
    const isLikelyCoordinates =
      /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/.test(
        mortandad.ubicacionGps
      );

    if (isLikelyCoordinates) {
      window.open(
        `https://www.google.com/maps?q=${mortandad.ubicacionGps}`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          mortandad.ubicacionGps
        )}`,
        "_blank"
      );
    }
  };

  return (
    <div>
      <Card className="w-[85%]  mx-auto shadow-md rounded-xl border mt-5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Detalle de Mortandad
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 ">
          <Tabs defaultValue="mortandad" className="w-[95%]">
            <TabsList className="grid w-full grid-cols-2 mx-4 mb-4">
              <TabsTrigger
                value="mortandad"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Vista de Mortandad
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
              value="mortandad"
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
                    {formatDateOnly(mortandad.fecha)}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    Causa
                  </div>
                  <Badge variant="destructive" className="text-xs px-2 py-0.5">
                    {mortandad.causa.nombre}
                  </Badge>
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
                    #{mortandad.numeroAnimal}
                  </p>
                  <div>
                    <span className="text-xs text-muted-foreground">
                      Categoría:
                    </span>{" "}
                    {mortandad.categoria.nombre}
                    <div className="flex gap-1 mt-1">
                      <Badge className="text-xs">
                        {mortandad.categoria.sexo}
                      </Badge>
                      <Badge className="text-xs">
                        {mortandad.categoria.edad}
                      </Badge>
                    </div>
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
                    {mortandad.propietario.nombre}
                  </p>
                  <p>
                    <span className="text-xs text-muted-foreground">
                      Email:
                    </span>{" "}
                    {mortandad.propietario.email}
                  </p>
                  <p>
                    <span className="text-xs text-muted-foreground">
                      Teléfono:
                    </span>{" "}
                    {mortandad.propietario.telefono}
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
                    {mortandad.potrero.nombre}
                  </p>
                  <p
                    className="font-mono cursor-pointer text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    onClick={openGoogleMaps}
                  >
                    {mortandad.ubicacionGps}
                    <ExternalLink className="h-3 w-3" />
                  </p>
                </div>
              </div>

              {/* Fotos */}
              {photos.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                      <Camera className="h-4 w-4" />
                      Fotos ({photos.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {photos.map((photo, i) => (
                        <div
                          key={i}
                          className="aspect-square bg-muted rounded-md overflow-hidden relative"
                        >
                          <Image
                            src={photo ?? "/placeholder.svg"}
                            alt={`Foto ${i + 1}`}
                            fill
                            className="object-cover cursor-pointer"
                            onClick={() => window.open(photo ?? "", "_blank")}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Sistema */}
              <div>
                <h3 className="font-medium mb-2 text-sm">Sistema</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <p>Creado: {formatDate(mortandad.createdAt)}</p>
                  <p>Actualizado: {formatDate(mortandad.updatedAt)}</p>
                  <p>Usuario: {mortandad.usuario}</p>
                  <p>Establecimiento: {mortandad.establesimiento}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="auditoria" className="px-4 pb-4">
              <AuditTab recordId={mortandad.id} tableName="Mortandad" />
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
              router.push(`/diaria/mortandad/edit/${mortandad.id}`)
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
              Eliminar Mortandad 🗑️
            </DialogTitle>
            <DialogDescription>
              <p className="mt-2">
                ¿Estás seguro de que deseas eliminar el registro de
                <span className="font-bold italic">
                  {" " + mortandad.numeroAnimal + " "}
                </span>
                ? Esta acción no se puede deshacer.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose>
              <Button variant="outline" onClick={() => setopenModal(false)}>
                Cancelar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
