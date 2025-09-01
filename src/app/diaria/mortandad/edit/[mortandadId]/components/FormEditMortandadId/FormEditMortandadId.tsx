"use client";

import type React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  CalendarDays,
  Hash,
  ImagePlus,
  LoaderCircle,
  MapPin,
  Camera,
  X,
  User,
  Tag,
  AlertTriangle,
  TreePine,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Categoria,
  CausaMortandad,
  Potrero,
  Prisma,
  Propietario,
} from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MortandadSchema = z.object({
  fecha: z
    .string()
    .min(1, "La fecha es obligatoria.")
    .refine((v) => !Number.isNaN(Date.parse(v)), { message: "Fecha inválida." })
    .refine((v) => new Date(v).getTime() <= new Date().getTime(), {
      message: "La fecha no puede ser futura.",
    }),
  propietarioId: z.string().min(1, "El propietario es obligatorio."),
  numeroAnimal: z
    .string()
    .min(1, "El número de animal (caravana) es obligatorio.")
    .regex(/^[A-Za-z0-9-]{3,20}$/, {
      message:
        "Formato de caravana inválido. Usa 3-20 caracteres (letras, números o guiones).",
    })
    .transform((s) => s.trim().toUpperCase()),
  categoriaId: z.string().min(1, "La categoría es obligatoria."),
  causaId: z.string().min(1, "La causa de mortandad es obligatoria."),
  potreroId: z.string().min(1, "El potrero es obligatorio."),
  ubicacionGps: z
    .string()
    .trim()
    .min(1, "La ubicación GPS es obligatoria.")
    .regex(/^-?\d{1,2}\.\d+,-?\d{1,3}\.\d+$/, {
      message: 'Formato GPS inválido. Usa "lat,long" con decimales.',
    }),
  foto1: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
  foto2: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
  foto3: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
});

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
  listPropietario?: Propietario[];
  listCategoria: Categoria[];
  listCausaMortandad: CausaMortandad[];
  listPotrero: Potrero[];
}

export function FormEditMortandadId({
  mortandad,
  listCategoria,
  listCausaMortandad,
  listPotrero,
  listPropietario,
}: FormMortandadProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{
    foto1?: string;
    foto2?: string;
    foto3?: string;
  }>({
    foto1: typeof mortandad.foto1 === "string" ? mortandad.foto1 : undefined,
    foto2: typeof mortandad.foto2 === "string" ? mortandad.foto2 : undefined,
    foto3: typeof mortandad.foto3 === "string" ? mortandad.foto3 : undefined,
  });

  // Estado para rastrear qué fotos fueron eliminadas
  const [removedPhotos, setRemovedPhotos] = useState<{
    foto1: boolean;
    foto2: boolean;
    foto3: boolean;
  }>({
    foto1: false,
    foto2: false,
    foto3: false,
  });

  const [cameraOpen, setCameraOpen] = useState(false);
  const [currentFotoKey, setCurrentFotoKey] = useState<
    "foto1" | "foto2" | "foto3"
  >("foto1");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState(true);

  type MortandadFormValues = z.infer<typeof MortandadSchema>;

  const form = useForm<MortandadFormValues>({
    resolver: zodResolver(MortandadSchema),
    defaultValues: {
      fecha: mortandad.fecha
        ? new Date(mortandad.fecha).toISOString().split("T")[0]
        : "",
      propietarioId: mortandad.propietarioId,
      numeroAnimal: mortandad.numeroAnimal,
      categoriaId: mortandad.categoriaId,
      causaId: mortandad.causaId,
      potreroId: mortandad.potreroId,
      ubicacionGps: mortandad.ubicacionGps,
      foto1: mortandad.foto1,
      foto2: mortandad.foto2,
      foto3: mortandad.foto3,
    },
  });

  const onSubmit = async (values: MortandadFormValues) => {
    try {
      setLoading(true);

      const formData = new FormData();
      console.log("formData ", formData);

      for (const [key, value] of Object.entries(values)) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }

      // Agregamos información sobre qué fotos eliminar
      if (removedPhotos.foto1) {
        formData.append("removePhoto1", "true");
      }
      if (removedPhotos.foto2) {
        formData.append("removePhoto2", "true");
      }
      if (removedPhotos.foto3) {
        formData.append("removePhoto3", "true");
      }

      const resp = await fetch(`/api/mortandad/${mortandad.id}`, {
        method: "PUT",
        body: formData, // ✅ sin headers, el navegador se encarga
      });

      if (resp.ok) {
        toast.success("Éxito 😃", {
          description: "Los datos fueron guardados",
        });
        router.push("/diaria/mortandad");
        router.refresh();
      } else {
        const text = await resp.text();
        throw new Error(text || "Error inesperado al guardar");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("error en FormMortandad", message);
      toast.error("Error", { description: message });
    } finally {
      setLoading(false);
    }
  };

  function handleFile(
    e: React.ChangeEvent<HTMLInputElement>,
    key: "foto1" | "foto2" | "foto3"
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview((p) => ({ ...p, [key]: url }));

    // Si agregamos una nueva foto, ya no está eliminada
    setRemovedPhotos((prev) => ({ ...prev, [key]: false }));

    form.setValue(key, file as never, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  function handleGetGPS() {
    if (!("geolocation" in navigator)) {
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(
          6
        )},${pos.coords.longitude.toFixed(6)}`;
        form.setValue("ubicacionGps", coords, {
          shouldValidate: true,
          shouldDirty: true,
        });
      },
      (err) => {
        console.log(err);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  const openCamera = async (key: "foto1" | "foto2" | "foto3") => {
    setCurrentFotoKey(key);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsCameraSupported(false);
        toast.error("Tu navegador no soporta el acceso a la cámara");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      setIsCameraSupported(false);
      toast.error("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const file = new File([blob], `foto-${Date.now()}.jpg`, {
          //const file = new File([blob], "/images/photocapture.jpg", {
          type: "image/jpeg",
        });

        console.log("FILE:", file);

        const url = URL.createObjectURL(blob);
        setPreview((p) => ({ ...p, [currentFotoKey]: url }));

        // Si capturamos una nueva foto, ya no está eliminada
        setRemovedPhotos((prev) => ({ ...prev, [currentFotoKey]: false }));

        form.setValue(currentFotoKey, file as never, {
          shouldValidate: true,
          shouldDirty: true,
        });

        closeCamera();
      },
      "image/jpeg",
      0.8
    );
  };

  const removePhoto = (key: "foto1" | "foto2" | "foto3") => {
    setPreview((p) => ({ ...p, [key]: undefined }));

    // Marcamos la foto como eliminada
    setRemovedPhotos((prev) => ({ ...prev, [key]: true }));

    form.setValue(key, undefined as never, {
      shouldValidate: false,
      shouldDirty: true,
    });

    const input = document.getElementById(key) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br  p-2 md:p-2">
      <div className="mx-auto max-w-4xl">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className=" bg-primary  text-white rounded-t-lg">
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Información del Animal
            </CardTitle>
            <CardDescription className="text-blue-100">
              Completa todos los campos requeridos para actualizar el registro
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
              <CardContent className="p-8 space-y-8">
                <section className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    Datos Básicos
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="fecha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                            <CalendarDays className="h-4 w-4 text-blue-600" />
                            Fecha de Mortandad
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="propietarioId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                            <User className="h-4 w-4 text-blue-600" />
                            Propietario
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                                <SelectValue placeholder="Selecciona propietario" />
                              </SelectTrigger>
                              <SelectContent>
                                {listPropietario?.map((propietario) => (
                                  <SelectItem
                                    key={propietario.id}
                                    value={propietario.id}
                                  >
                                    {propietario.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="numeroAnimal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                            <Hash className="h-4 w-4 text-blue-600" />
                            Número de Animal (Caravana)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ej: AR-123456"
                              {...field}
                              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 font-mono"
                            />
                          </FormControl>
                          <FormDescription className="text-slate-500">
                            Se convierte a MAYÚSCULAS automáticamente
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="categoriaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                            <Tag className="h-4 w-4 text-blue-600" />
                            Categoría
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                                <SelectValue placeholder="Selecciona categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                {listCategoria?.map((categoria) => (
                                  <SelectItem
                                    key={categoria.id}
                                    value={categoria.id}
                                  >
                                    {categoria.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </section>

                <Separator className="bg-slate-200" />

                <section className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                    Detalles de la Mortandad
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="causaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            Causa de Mortandad
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                                <SelectValue placeholder="Selecciona causa" />
                              </SelectTrigger>
                              <SelectContent>
                                {listCausaMortandad?.map((listMortandad) => (
                                  <SelectItem
                                    key={listMortandad.id}
                                    value={listMortandad.id}
                                  >
                                    {listMortandad.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="potreroId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                            <TreePine className="h-4 w-4 text-green-600" />
                            Potrero
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                                <SelectValue placeholder="Selecciona potrero" />
                              </SelectTrigger>
                              <SelectContent>
                                {listPotrero?.map((potrero) => (
                                  <SelectItem
                                    key={potrero.id}
                                    value={potrero.id}
                                  >
                                    {potrero.nombre}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ubicacionGps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-slate-700 font-medium">
                          <MapPin className="h-4 w-4 text-blue-600" />
                          Ubicación GPS
                        </FormLabel>
                        <div className="flex gap-3">
                          <FormControl>
                            <Input
                              placeholder="Ej: -27.123456,-55.654321"
                              {...field}
                              className="border-slate-300 focus:border-blue-500 focus:ring-blue-500/20 font-mono"
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleGetGPS}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50 whitespace-nowrap bg-transparent"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Obtener GPS
                          </Button>
                        </div>
                        <FormDescription className="text-slate-500">
                          Formato: lat,long con decimales (obligatorio)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </section>

                <Separator className="bg-slate-200" />

                <section className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <ImagePlus className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        Fotografías del Animal
                      </h3>
                      <p className="text-sm text-slate-600">
                        Adjunta hasta 3 fotografías para documentar el caso
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {(["foto1", "foto2", "foto3"] as const).map(
                      (fotoKey, index) => (
                        <FormField
                          key={fotoKey}
                          control={form.control}
                          name={fotoKey}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700 font-medium">
                                Foto {index + 1}
                              </FormLabel>

                              <div className="space-y-3">
                                <FormControl>
                                  <Input
                                    id={fotoKey}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={(e) => {
                                      handleFile(e, fotoKey);
                                      field.onChange(e.target.files?.[0]);
                                    }}
                                    onBlur={field.onBlur}
                                    ref={field.ref}
                                    className="border-slate-300 focus:border-blue-500"
                                  />
                                </FormControl>

                                {preview[fotoKey] ? (
                                  <div className="relative w-full h-40 rounded-lg border-2 border-slate-200 overflow-hidden group bg-white shadow-sm">
                                    <Image
                                      src={
                                        preview[fotoKey]! ||
                                        "/images/Placeholder.jpg"
                                      }
                                      alt={`Vista previa foto ${index + 1}`}
                                      fill
                                      className="object-cover transition-transform group-hover:scale-105"
                                      unoptimized
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant="destructive"
                                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                      onClick={() => removePhoto(fotoKey)}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="w-full h-40 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <ImagePlus className="h-8 w-8 mb-2 text-slate-400" />
                                    <span className="text-sm font-medium">
                                      Sin imagen
                                    </span>
                                  </div>
                                )}

                                <Button
                                  type="button"
                                  variant="outline"
                                  className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 bg-transparent"
                                  onClick={() => openCamera(fotoKey)}
                                >
                                  <Camera className="h-4 w-4 mr-2" />
                                  Tomar foto
                                </Button>
                              </div>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )
                    )}
                  </div>
                </section>
              </CardContent>

              <CardFooter className="bg-slate-50 border-t border-slate-200 px-8 py-6 rounded-b-lg">
                <div className="flex gap-4 justify-end w-full">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    className="px-6 border-slate-300 text-slate-700 hover:bg-slate-100 bg-transparent"
                    onClick={() => router.push("/diaria/mortandad")}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                        Modificando...
                      </>
                    ) : (
                      "Modificar Registro"
                    )}
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-blue-600" />
              Capturar Fotografía
            </DialogTitle>
            <DialogDescription>
              {!isCameraSupported
                ? "Tu navegador no soporta el acceso a la cámara"
                : "Posiciona el animal en el centro de la imagen y presiona capturar"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full h-64 bg-slate-900 rounded-lg overflow-hidden shadow-inner">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex w-full justify-center space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeCamera}
                className="px-6 bg-transparent"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={capturePhoto}
                className="px-6 bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capturar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
