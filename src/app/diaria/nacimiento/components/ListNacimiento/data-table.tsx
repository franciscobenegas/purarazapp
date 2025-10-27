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
import { Nacimiento, Prisma } from "@prisma/client";
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
import ExportExcelButton from "./ExportExcelButton";
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
import { Badge } from "@/components/ui/badge";

type NacimientoWithRelations = Prisma.NacimientoGetPayload<{
  include: {
    propietario: true;
    potrero: true;
  };
}>;

interface DataTableProps {
  data: NacimientoWithRelations[];
}

type DateRangeFilter = { from?: string; to?: string };

export function DataTableNacimiento({ data }: DataTableProps) {
  const router = useRouter();

  // Estados para mantener los filtros seleccionados

  const [selectedPropietario, setSelectedPropietario] = useState("all");
  const [selectedPotrero, setSelectedPotrero] = useState("all");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isMonted, setIsMonted] = useState(false);
  const [deletingNacimiento, setDeletingNacimiento] = useState<
    Nacimiento | Nacimiento[] | null
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
    setSelectedPotrero("all");

    table.getColumn("categoria")?.setFilterValue(undefined);
    table.getColumn("causa")?.setFilterValue(undefined);
    table.getColumn("propietario")?.setFilterValue(undefined);
    table.getColumn("potrero")?.setFilterValue(undefined);
  };

  const hasActiveFilters =
    selectedPropietario !== "all" || selectedPotrero !== "all";

  const handleDeleteConfirm = async () => {
    if (deletingNacimiento) {
      setLoading(true);
      try {
        const ids = Array.isArray(deletingNacimiento)
          ? deletingNacimiento.map((item) => item.id)
          : [deletingNacimiento?.id];

        await Promise.all(
          ids.map((id) =>
            fetch(`/api/nacimiento/${id}`, {
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
        setDeletingNacimiento(null);
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

  const columns: ColumnDef<NacimientoWithRelations>[] = [
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
      accessorKey: "numeroTernero",
      header: "# Ternero",
      cell: ({ cell }) => cell.getValue(),
    },

    {
      accessorKey: "numeroVaca",
      header: "# Madre",
      cell: ({ cell }) => cell.getValue(),
    },

    {
      accessorKey: "sexo",
      header: "Sexo",
      cell: ({ cell }) => {
        const sexo = cell.getValue() as string;
        const isMacho = sexo === "Macho";

        return (
          <Badge
            variant="secondary"
            className={
              isMacho
                ? "bg-blue-100 text-blue-800 border-0"
                : "bg-pink-100 text-pink-800 border-0"
            }
          >
            {sexo}
          </Badge>
        );
      },
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
      accessorKey: "potrero",
      header: "Potrero",
      accessorFn: (row) => row.potrero?.nombre ?? "",
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
              <Link href={`/diaria/nacimiento/edit/${row.original.id}`}>
                <DropdownMenuItem>
                  <SquarePen className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              </Link>
              <Link href={`/diaria/nacimiento/view/${row.original.id}`}>
                <DropdownMenuItem>
                  <FileSearch className="mr-2 h-4 w-4" />
                  Detalle
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingNacimiento(row.original)}
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
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  if (!isMonted) return null;

  return (
    <div className="p-4 bg-background shadow-md rounded-lg mt-4">
      <div className="w-full items-center justify-between">
        {/* Fila de filtros principal */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          {/* Filtro de Nro Carabana */}
          <div className="flex-1 md:w-auto">
            <Input
              placeholder="Nro Carabana..."
              value={
                (table.getColumn("numeroAnimal")?.getFilterValue() as string) ??
                ""
              }
              onChange={(event) =>
                table
                  .getColumn("numeroAnimal")
                  ?.setFilterValue(event.target.value)
              }
              className="w-full"
            />
          </div>

          {/* Filtros de fecha */}
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Fecha desde
              </label>
              <Input
                type="date"
                onChange={(e) =>
                  table
                    .getColumn("fecha")
                    ?.setFilterValue((old: DateRangeFilter) => ({
                      ...old,
                      from: e.target.value,
                    }))
                }
                className="w-full"
              />
            </div>

            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Fecha hasta
              </label>
              <Input
                type="date"
                onChange={(e) =>
                  table
                    .getColumn("fecha")
                    ?.setFilterValue((old: DateRangeFilter) => ({
                      ...old,
                      to: e.target.value,
                    }))
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Botones de acciones */}
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            {/* Dropdown de filtros */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-44 justify-between"
                >
                  <ListFilterPlus className="h-4 w-4 mr-2" />
                  Filtros
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 w-60">
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Propietario
                  </label>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <Separator />
                      {[
                        ...new Set(
                          data.map((d) => d.propietario?.nombre).filter(Boolean)
                        ),
                      ].map((propietario) => (
                        <SelectItem key={propietario} value={propietario}>
                          {propietario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Potrero
                  </label>
                  <Select
                    value={selectedPotrero}
                    onValueChange={(value) =>
                      handleFilterChange("potrero", value, setSelectedPotrero)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <Separator />
                      {[
                        ...new Set(
                          data.map((d) => d.potrero?.nombre).filter(Boolean)
                        ),
                      ].map((potrero) => (
                        <SelectItem key={potrero} value={potrero}>
                          {potrero}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <div className="mt-4 flex justify-end">
                    <Button size="sm" onClick={clearFilters}>
                      Limpiar filtros
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Dropdown de columnas */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full md:w-auto justify-between"
                >
                  <Settings2 className="mr-2 h-4 w-4" />
                  Columnas
                  <ChevronDown className="ml-2 h-4 w-4" />
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

            {/* Botón de exportación */}
            <div className="w-full md:w-auto ">
              <ExportExcelButton data={data} />
            </div>

            {/* Botón de eliminar seleccionados */}
            {selectedRows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full md:w-auto"
              >
                <Button
                  variant="destructive"
                  onClick={() => setDeletingNacimiento(selectedRows)}
                  size="sm"
                  className="w-full md:w-auto"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Eliminar Seleccionados ({selectedRows.length})
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
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
          open={!!deletingNacimiento}
          onOpenChange={(open) => {
            if (!open) setDeletingNacimiento(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Confirmar Eliminación
              </DialogTitle>
            </DialogHeader>

            <DialogDescription>
              {Array.isArray(deletingNacimiento) ? (
                <p className="mt-2">
                  ¿Estás seguro de que deseas eliminar los{" "}
                  <span className="font-bold">{deletingNacimiento.length}</span>{" "}
                  registros seleccionados? Esta acción no se puede deshacer.
                </p>
              ) : (
                <p className="mt-2">
                  ¿Estás seguro de que deseas eliminar el registro de
                  <span className="font-bold italic">
                    {" " + deletingNacimiento?.numeroTernero + " "}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              )}
            </DialogDescription>

            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose>
                <Button
                  size="lg"
                  className="mr-5"
                  variant="outline"
                  onClick={() => setDeletingNacimiento(null)}
                >
                  Cancelar
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleDeleteConfirm}
                  disabled={loading}
                >
                  {loading ? "Eliminando..." : "Confirmar"}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Total de registros: {data.length}
        </div>

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
    </div>
  );
}
