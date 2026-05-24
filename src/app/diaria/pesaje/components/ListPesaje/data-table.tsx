"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  ListFilterPlus,
  Logs,
  MoreHorizontal,
  Settings2,
  SquarePen,
  Trash,
  Trash2,
} from "lucide-react";
import { Pesaje, Prisma } from "@prisma/client";
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { formatDate, formatDateSingle } from "@/utils/formatDate";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";


type PesajeWithRelations = Prisma.PesajeGetPayload<{
  include: {
    propietario: true;
    motivo: true;
    categoria: true;
    potrero: true;
  };
}>;

interface DataTableProps {
  data: PesajeWithRelations[];
}

type DateRangeFilter = { from?: string; to?: string };

export function DataTablePesaje({ data }: DataTableProps) {
  const router = useRouter();

  const [selectedPropietario, setSelectedPropietario] = useState("all");
  const [selectedMotivo, setSelectedMotivo] = useState("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isMonted, setIsMonted] = useState(false);
  const [deletingPesaje, setDeletingPesaje] = useState<
    Pesaje | Pesaje[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  const handleFilterChange = (
    columnId: string,
    value: string,
    setFn: (v: string) => void
  ) => {
    setFn(value);
    table
      .getColumn(columnId)
      ?.setFilterValue(value === "all" ? undefined : value);
  };

  const clearFilters = () => {
    setSelectedPropietario("all");
    setSelectedMotivo("all");

    table.getColumn("propietario")?.setFilterValue(undefined);
    table.getColumn("motivo")?.setFilterValue(undefined);
  };

  const hasActiveFilters =
    selectedPropietario !== "all" || selectedMotivo !== "all";

  const handleDeleteConfirm = async () => {
    if (deletingPesaje) {
      setLoading(true);
      try {
        const ids = Array.isArray(deletingPesaje)
          ? deletingPesaje.map((item) => item.id)
          : [deletingPesaje?.id];

        await Promise.all(
          ids.map((id) =>
            fetch(`/api/pesaje/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            })
          )
        );

        toast.warning("Exito!!! 😃 ", {
          description: "Los datos fueron eliminados...",
        });
        setDeletingPesaje(null);
        router.refresh();
      } catch (error) {
        console.error(error);
        const message = error instanceof Error ? error.message : String(error);
        toast.error("Error !!!", {
          description: message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const columns: ColumnDef<PesajeWithRelations>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Seleccionar todos"
            className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center px-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Seleccionar fila"
            className="border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 50,
    },

    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ cell }) => formatDateSingle(cell.getValue() as Date),
      filterFn: (row, columnId, filterValue: DateRangeFilter) => {
        const value = row.getValue<Date>(columnId);
        if (!value) return false;

        const fecha = new Date(value);
        const from = filterValue?.from ? new Date(filterValue.from) : null;
        const to = filterValue?.to ? new Date(filterValue.to) : null;

        if (from && fecha < from) return false;
        if (to && fecha > to) return false;

        return true;
      },
    },

    {
      accessorKey: "numeroAnimal",
      header: "Nº Animal",
      cell: ({ cell }) => cell.getValue(),
    },

    {
      accessorKey: "peso",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Peso (kg) <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ cell }) => `${cell.getValue()} kg`,
    },

    {
      accessorKey: "propietario",
      header: "Propietario",
      accessorFn: (row) => row.propietario?.nombre ?? "",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue<string>(columnId);
        return value?.toLowerCase().includes(filterValue.toLowerCase());
      },
    },

    {
      accessorKey: "motivo",
      header: "Motivo",
      accessorFn: (row) => row.motivo?.nombre ?? "",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue<string>(columnId);
        return value?.toLowerCase().includes(filterValue.toLowerCase());
      },
    },

    {
      accessorKey: "usuario",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Usuario <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: "Fecha Modif.",
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
              <Link href={`/diaria/pesaje/edit/${row.original.id}`}>
                <DropdownMenuItem>
                  <SquarePen className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              </Link>
              <Link href={`/diaria/pesaje/view/${row.original.id}`}>
                <DropdownMenuItem>
                  <FileSearch className="mr-2 h-4 w-4" />
                  Detalle
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingPesaje(row.original)}
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

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  // Get unique propietarios y motivos
  const uniquePropietarios = [
    ...new Set(data.map((item) => item.propietario?.nombre)),
  ].filter(Boolean) as string[];
  const uniqueMotivos = [
    ...new Set(data.map((item) => item.motivo?.nombre)),
  ].filter(Boolean) as string[];

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-4 p-4"
    >
      {/* Header con filtros */}
      <div className="space-y-4">
        {/* Filtros principales */}
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[250px]">
            <Input
              placeholder="Buscar por número de animal..."
              value={
                (table
                  .getColumn("numeroAnimal")
                  ?.getFilterValue() as string) || ""
              }
              onChange={(event) =>
                table
                  .getColumn("numeroAnimal")
                  ?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
          </div>

          <Select
            value={selectedPropietario}
            onValueChange={(value) =>
              handleFilterChange(
                "propietario",
                value,
                setSelectedPropietario
              )
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar Propietario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Propietarios</SelectItem>
              {uniquePropietarios.map((prop) => (
                <SelectItem key={prop} value={prop}>
                  {prop}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedMotivo}
            onValueChange={(value) =>
              handleFilterChange("motivo", value, setSelectedMotivo)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar Motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los Motivos</SelectItem>
              {uniqueMotivos.map((motivo) => (
                <SelectItem key={motivo} value={motivo}>
                  {motivo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="gap-2"
            >
              <ListFilterPlus className="h-4 w-4" />
              Limpiar Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg">
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
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {selectedCount > 0 && `${selectedCount} fila(s) seleccionada(s).`}
        </div>
        <div className="flex gap-2">
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

      {/* Dialog de confirmación de eliminación */}
      <Dialog open={!!deletingPesaje} onOpenChange={() => setDeletingPesaje(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar{" "}
              {Array.isArray(deletingPesaje)
                ? `${deletingPesaje.length} pesaje(s)`
                : "este pesaje"}
              ? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={loading}
            >
              {loading ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
