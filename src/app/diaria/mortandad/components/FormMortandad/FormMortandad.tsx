"use client";

import type React from "react";
import {
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
  useRef,
} from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Categoria,
  CausaMortandad,
  Potrero,
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
    .any()
    .refine(
      (file) =>
        file === undefined || file instanceof File || typeof file === "string",
      {
        message: "Debe ser un archivo válido",
      }
    )
    .optional(),
  foto2: z
    .any()
    .refine(
      (file) =>
        file === undefined || file instanceof File || typeof file === "string",
      {
        message: "Debe ser un archivo válido",
      }
    )
    .optional(),
  foto3: z
    .any()
    .refine(
      (file) =>
        file === undefined || file instanceof File || typeof file === "string",
      {
        message: "Debe ser un archivo válido",
      }
    )
    .optional(),
});

interface FormProps {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  listPropietario?: Propietario[];
  listCategoria: Categoria[];
  listCausaMortandad: CausaMortandad[];
  listPotrero: Potrero[];
}

export function FormMortandad({
  setOpenModal,
  listPropietario,
  listCategoria,
  listCausaMortandad,
  listPotrero,
}: FormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{
    foto1?: string;
    foto2?: string;
    foto3?: string;
  }>({});

  const [cameraOpen, setCameraOpen] = useState(false);
  const [currentFotoKey, setCurrentFotoKey] = useState<
    "foto1" | "foto2" | "foto3"
  >("foto1");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isCameraSupported, setIsCameraSupported] = useState(true);

  const hoy = useMemo(() => new Date().toISOString().slice(0, 10), []);
  type MortandadFormValues = z.infer<typeof MortandadSchema>;

  const form = useForm<MortandadFormValues>({
    resolver: zodResolver(MortandadSchema),
    defaultValues: {
      fecha: hoy,
      propietarioId: listPropietario?.[0]?.id ?? "",
      numeroAnimal: "",
      categoriaId: listCategoria[0]?.id ?? "",
      causaId: listCausaMortandad[0]?.id ?? "",
      potreroId: listPotrero[0]?.id ?? "",
      ubicacionGps: "",
      foto1: undefined,
      foto2: undefined,
      foto3: undefined,
    },
  });

  const onSubmit = async (values: MortandadFormValues) => {
    try {
      setLoading(true);

      const formData = new FormData();

      // Agregar todos los valores al FormData
      for (const [key, value] of Object.entries(values)) {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      }

      const resp = await fetch("/api/mortandad", {
        method: "POST",
        body: formData,
      });

      if (resp.ok) {
        toast.success("Éxito 😃", {
          description: "Los datos fueron guardados",
        });
        router.refresh();
        setOpenModal(false);
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

    // Guardar el archivo real en react-hook-form
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

  // Función para abrir la cámara
  const openCamera = async (key: "foto1" | "foto2" | "foto3") => {
    setCurrentFotoKey(key);

    try {
      // Verificar si el navegador soporta getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsCameraSupported(false);
        toast.error("Tu navegador no soporta el acceso a la cámara");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }, // Preferir cámara trasera en móviles
      });

      streamRef.current = stream;
      setCameraOpen(true);

      // Esperar a que el diálogo se abra y el video esté disponible
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

  // Función para cerrar la cámara
  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  // Función para capturar foto desde la cámara
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

        // Crear un archivo a partir del blob
        const file = new File([blob], `foto-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        // Crear URL para la vista previa
        const url = URL.createObjectURL(blob);
        setPreview((p) => ({ ...p, [currentFotoKey]: url }));

        // Guardar el archivo en react-hook-form
        form.setValue(currentFotoKey, file as never, {
          shouldValidate: true,
          shouldDirty: true,
        });

        // Cerrar la cámara
        closeCamera();
      },
      "image/jpeg",
      0.8
    );
  };

  // Función para eliminar foto
  const removePhoto = (key: "foto1" | "foto2" | "foto3") => {
    setPreview((p) => ({ ...p, [key]: undefined }));
    form.setValue(key, undefined as never, {
      shouldValidate: false,
      shouldDirty: true,
    });

    // Si es un input de archivo, resetear su valor
    const input = document.getElementById(key) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  return (
    <main className="flex items-start justify-center p-4 md:p-8 bg-muted/20 min-h-[100dvh]">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <CardTitle className="text-primary">Alta de Mortandad</CardTitle>
          <CardDescription>
            Completa los datos y carga las fotos en la pestaña correspondiente.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <Tabs defaultValue="datos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="datos">Datos</TabsTrigger>
                  <TabsTrigger value="fotos">Fotos</TabsTrigger>
                </TabsList>

                <TabsContent value="datos" className="mt-6">
                  <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ... (el resto de los campos del formulario se mantienen igual) ... */}
                    <FormField
                      control={form.control}
                      name="fecha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" /> Fecha
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
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
                          <FormLabel>Propietario</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger aria-label="Propietario">
                                <SelectValue placeholder="Selecciona propietario" />
                              </SelectTrigger>
                              <SelectContent>
                                {listPropietario?.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.nombre}
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
                          <FormLabel className="flex items-center gap-2">
                            <Hash className="h-4 w-4" /> Número de Animal
                            (Caravana)
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: AR-123456" {...field} />
                          </FormControl>
                          <FormDescription>
                            {"Se convierte a MAYÚSCULAS automáticamente."}
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
                          <FormLabel>Categoría</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger aria-label="Categoría">
                                <SelectValue placeholder="Selecciona categoría" />
                              </SelectTrigger>
                              <SelectContent>
                                {listCategoria.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.nombre}
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
                      name="causaId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Causa de Mortandad</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger aria-label="Causa de mortandad">
                                <SelectValue placeholder="Selecciona causa" />
                              </SelectTrigger>
                              <SelectContent>
                                {listCausaMortandad.map((c) => (
                                  <SelectItem key={c.id} value={c.id}>
                                    {c.nombre}
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
                          <FormLabel>Potrero</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger aria-label="Potrero">
                                <SelectValue placeholder="Selecciona potrero" />
                              </SelectTrigger>
                              <SelectContent>
                                {listPotrero.map((p) => (
                                  <SelectItem key={p.id} value={p.id}>
                                    {p.nombre}
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
                      name="ubicacionGps"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Ubicación GPS
                          </FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input
                                placeholder="Ej: -27.123456,-55.654321"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleGetGPS}
                            >
                              Obtener GPS
                            </Button>
                          </div>
                          <FormDescription>
                            {'Formato: "lat,long" con decimales (obligatorio).'}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </section>
                </TabsContent>

                <TabsContent value="fotos" className="mt-6">
                  <section className="space-y-4">
                    <h3 className="font-medium">Fotos (opcional)</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="foto1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <ImagePlus className="h-4 w-4" /> Foto 1
                            </FormLabel>
                            <div className="flex gap-2 mb-2">
                              <FormControl>
                                <Input
                                  id="foto1"
                                  type="file"
                                  accept="image/*"
                                  capture="environment" // Esto habilita la cámara en móviles
                                  onChange={(e) => {
                                    handleFile(e, "foto1");
                                    field.onChange(e.target.files?.[0]);
                                  }}
                                  onBlur={field.onBlur}
                                  ref={field.ref}
                                  className="flex-1"
                                />
                              </FormControl>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={() => openCamera("foto1")}
                              >
                                <Camera className="h-4 w-4" />
                              </Button>
                            </div>
                            {preview.foto1 ? (
                              <div className="relative w-full h-40 rounded-md border overflow-hidden group">
                                <Image
                                  src={preview.foto1}
                                  alt="Vista previa foto 1"
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removePhoto("foto1")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="w-full h-40 border rounded-md grid place-items-center text-sm text-muted-foreground">
                                {"Sin imagen"}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="foto2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <ImagePlus className="h-4 w-4" /> Foto 2
                            </FormLabel>
                            <div className="flex gap-2 mb-2">
                              <FormControl>
                                <Input
                                  id="foto2"
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) => {
                                    handleFile(e, "foto2");
                                    field.onChange(e.target.files?.[0]);
                                  }}
                                  onBlur={field.onBlur}
                                  ref={field.ref}
                                  className="flex-1"
                                />
                              </FormControl>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={() => openCamera("foto2")}
                              >
                                <Camera className="h-4 w-4" />
                              </Button>
                            </div>
                            {preview.foto2 ? (
                              <div className="relative w-full h-40 rounded-md border overflow-hidden group">
                                <Image
                                  src={preview.foto2}
                                  alt="Vista previa foto 2"
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removePhoto("foto2")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="w-full h-40 border rounded-md grid place-items-center text-sm text-muted-foreground">
                                {"Sin imagen"}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="foto3"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <ImagePlus className="h-4 w-4" /> Foto 3
                            </FormLabel>
                            <div className="flex gap-2 mb-2">
                              <FormControl>
                                <Input
                                  id="foto3"
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={(e) => {
                                    handleFile(e, "foto3");
                                    field.onChange(e.target.files?.[0]);
                                  }}
                                  onBlur={field.onBlur}
                                  ref={field.ref}
                                  className="flex-1"
                                />
                              </FormControl>
                              <Button
                                type="button"
                                size="icon"
                                variant="outline"
                                onClick={() => openCamera("foto3")}
                              >
                                <Camera className="h-4 w-4" />
                              </Button>
                            </div>
                            {preview.foto3 ? (
                              <div className="relative w-full h-40 rounded-md border overflow-hidden group">
                                <Image
                                  src={preview.foto3}
                                  alt="Vista previa foto 3"
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="destructive"
                                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removePhoto("foto3")}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="w-full h-40 border rounded-md grid place-items-center text-sm text-muted-foreground">
                                {"Sin imagen"}
                              </div>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </section>
                </TabsContent>
              </Tabs>

              <Separator />
            </CardContent>

            <CardFooter className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setOpenModal(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                    Guardando
                  </>
                ) : (
                  "Guardar"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Diálogo para la cámara */}
      <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tomar foto</DialogTitle>
            <DialogDescription>
              {!isCameraSupported &&
                "Tu navegador no soporta el acceso a la cámara"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-full h-64 bg-black rounded-md overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex w-full justify-center space-x-4">
              <Button type="button" variant="outline" onClick={closeCamera}>
                Cancelar
              </Button>
              <Button type="button" onClick={capturePhoto}>
                Capturar foto
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
