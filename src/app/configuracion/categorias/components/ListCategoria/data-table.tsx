"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ColumnDef,
  SortingState,
  getCoreRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ArrowUpDown,
  ChevronDown,
  FileSearch,
  Logs,
  MoreHorizontal,
  Settings2,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Categoria } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ExportExcelButton from "./ExportExcelButton";
import Link from "next/link";
import { DialogClose } from "@radix-ui/react-dialog";
import { formatDate } from "@/utils/formatDate";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatoPrecio } from "@/utils/formatoPrecio";
import { Badge } from "@/components/ui/badge";

interface DataTableProps {
  data: Categoria[];
}

// const formatNumber = (value: unknown) => {
//   if (typeof value === "number") {
//     return new Intl.NumberFormat("es-ES", {
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     }).format(value);
//   }
//   return value;
// };

export function DataTableCategoria({ data }: DataTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isMonted, setIsMonted] = useState(false);
  const [deletingCategoria, setDeletingCategoria] = useState<Categoria | null>(
    null
  );
  const [loading, setLoading] = useState(false); // Estado para el botón de carga

  const handleDeleteConfirm = async () => {
    if (deletingCategoria) {
      setLoading(true); // Desactivar el botón
      try {
        const resp = await fetch(`/api/categoria/${deletingCategoria.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (resp.ok) {
          toast.warning("Exito!!! 😃 ", {
            description: "Los datos fueron eliminados...",
          });
          setDeletingCategoria(null);
          router.refresh();
        }
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : String(error);
        toast.error("Error !!!", {
          description: message,
        });
      } finally {
        setLoading(false); // Reactivar el botón
      }
    }
  };

  const columns: ColumnDef<Categoria>[] = [
    {
      accessorKey: "nombre",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "sexo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sexo <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "edad",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Edad <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ cell }) => {
        const edad = cell.getValue() as string;

        const colorMap: Record<string, string> = {
          RecienNacido: "bg-blue-100 text-blue-800",
          Joven: "bg-green-100 text-green-800",
          Adulto: "bg-yellow-100 text-yellow-800",
        };

        return (
          <div className="text-center">
            <Badge className={colorMap[edad] || "bg-gray-100 text-gray-800"}>
              {edad}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "promedioKilos",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Promedio Kg. <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ cell }) => (
        <div className="text-center">
          {String(formatoPrecio(cell.getValue() as number))}
        </div>
      ),
    },
    {
      accessorKey: "precioVentaCabeza",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Venta Cabeza <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ cell }) => (
        <div className="text-center">
          {String(formatoPrecio(cell.getValue() as number))}
        </div>
      ),
    },
    {
      accessorKey: "precioVentaKilo",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Venta Kg. <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ cell }) => (
        <div className="text-center">
          {String(formatoPrecio(cell.getValue() as number))}
        </div>
      ),
    },

    // Ver si entra estas dos columnas

    // {
    //   accessorKey: "precioCostoCabeza",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Costo Kg $. <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    // },

    // {
    //   accessorKey: "precioCostoKilo",
    //   header: ({ column }) => {
    //     return (
    //       <Button
    //         variant="ghost"
    //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    //       >
    //         Costo Kg $. <ArrowUpDown className="ml-2 h-4 w-4" />
    //       </Button>
    //     );
    //   },
    // },

    {
      accessorKey: "usuario",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Usuario <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha Modif.
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ cell }) => formatDate(cell.getValue() as Date),
    },

    {
      id: "actions",
      header: ({}) => {
        return <Logs className="text-primary" />;
      },
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 bg-zinc-50 hover:bg-white"
              >
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href={`/configuracion/categorias/edit/${row.original.id}`}>
                <DropdownMenuItem>
                  <SquarePen className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              </Link>
              <Link href={`/configuracion/categorias/view/${row.original.id}`}>
                <DropdownMenuItem>
                  <FileSearch className="mr-2 h-4 w-4" />
                  Detalle
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingCategoria(row.original)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  React.useEffect(() => {
    setIsMonted(true);
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  if (!isMonted) {
    return null;
  }

  return (
    <div className="p-4  bg-background shadow-md rounded-lg mt-4">
      <div className="w-full items-center justify-between">
        <div className="flex-row md:flex items-center mb-2 gap-8">
          <Input
            placeholder="Filtrar por Nombre..."
            value={
              (table.getColumn("nombre")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("nombre")?.setFilterValue(event.target.value)
            }
            className="mb-2 md:mb-0"
          />
          <div className="mb-2 md:mb-0">
            {/* Filtro por Sexo */}
            <Select
              onValueChange={(value) => {
                table
                  .getColumn("sexo")
                  ?.setFilterValue(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Filtrar por sexo</SelectItem>
                <SelectItem value="Macho">Macho</SelectItem>
                <SelectItem value="Hembra">Hembra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-2 md:mb-0">
            {/* Filtro por Edad */}
            <Select
              onValueChange={(value) => {
                table
                  .getColumn("edad")
                  ?.setFilterValue(value === "all" ? undefined : value);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por edad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Filtrar por edad</SelectItem>
                <SelectItem value="Adulto">Adulto </SelectItem>
                <SelectItem value="Joven">Joven</SelectItem>
                <SelectItem value="RecienNacido">Recien Nacido</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-row md:flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <Settings2 className="mr-2 size-4" />
                  Columnas <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    if (column.id !== "actions") {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id === "usuarioId"
                            ? "Usuario"
                            : column.id === "updatedAt"
                            ? "Fecha Modif."
                            : column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    }
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="p-2">
              <ExportExcelButton data={data} />
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No hay registros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Dialog para Eliminar */}
        <Dialog
          open={!!deletingCategoria}
          onOpenChange={() => setDeletingCategoria(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary">
                Eliminar Categoria 🗑️
              </DialogTitle>

              <DialogDescription>
                <p className="mt-2">
                  ¿Estás seguro de que deseas eliminar el registro de
                  <span className="font-bold italic">
                    {" " + deletingCategoria?.nombre + " "}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose>
                <Button
                  variant="outline"
                  onClick={() => setDeletingCategoria(null)}
                >
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Total de Datos: {data.length}
        </div>
      </div>
    </div>
  );
}
