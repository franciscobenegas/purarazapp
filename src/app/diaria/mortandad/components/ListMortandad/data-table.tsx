"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  ListFilterPlus,
  Logs,
  MoreHorizontal,
  Pencil,
  Settings2,
  Trash,
} from "lucide-react";
import { Mortandad, Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
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

type MortandadWithRelations = Prisma.MortandadGetPayload<{
  include: {
    propietario: true;
    categoria: true;
    causa: true;
    potrero: true;
  };
}>;

interface DataTableProps {
  data: MortandadWithRelations[];
}

type DateRangeFilter = { from?: string; to?: string }; // 👈 Tipo para el filtro de fecha

export function DataTableMortandad({ data }: DataTableProps) {
  const router = useRouter();

  // Estados para mantener los filtros seleccionados
  const [selectedCategoria, setSelectedCategoria] = useState("all");
  const [selectedCausa, setSelectedCausa] = useState("all");
  const [selectedPropietario, setSelectedPropietario] = useState("all");
  const [selectedPotrero, setSelectedPotrero] = useState("all");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isMonted, setIsMonted] = useState(false);
  const [deletingMortandad, setDeletingMortandad] = useState<
    Mortandad | Mortandad[] | null
  >(null);
  const [loading, setLoading] = useState(false);
  const [rowSelection, setRowSelection] = useState({});

  // 🚀 cuando cambia el filtro, actualizo tanto el estado como la tabla
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

  // 👇 Nueva función para limpiar filtros
  const clearFilters = () => {
    setSelectedCategoria("all");
    setSelectedCausa("all");
    setSelectedPropietario("all");
    setSelectedPotrero("all");

    table.getColumn("categoria")?.setFilterValue(undefined);
    table.getColumn("causa")?.setFilterValue(undefined);
    table.getColumn("propietario")?.setFilterValue(undefined);
    table.getColumn("potrero")?.setFilterValue(undefined);
  };

  // 👇 Variable para saber si hay filtros activos
  const hasActiveFilters =
    selectedCategoria !== "all" ||
    selectedCausa !== "all" ||
    selectedPropietario !== "all" ||
    selectedPotrero !== "all";

  const handleDeleteConfirm = async () => {
    console.log(" deletingMortandad ", deletingMortandad);

    if (deletingMortandad) {
      setLoading(true);
      try {
        const ids = Array.isArray(deletingMortandad)
          ? deletingMortandad.map((item) => item.id)
          : [deletingMortandad?.id];

        await Promise.all(
          ids.map((id) =>
            fetch(`/api/mortandad/${id}`, {
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
        setDeletingMortandad(null);
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

  const columns: ColumnDef<MortandadWithRelations>[] = [
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
      size: 50, // Tamaño fijo para la columna
    },
    {
      accessorKey: "foto1",
      header: "Foto",
      cell: ({ cell }) => {
        const url = cell.getValue() as string;
        return url ? (
          <Image
            src={url}
            alt="Foto 1"
            width={64}
            height={64}
            className="object-cover rounded"
          />
        ) : null;
      },
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
      accessorKey: "numeroAnimal",
      header: "# Carabana",
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      accessorFn: (row) => row.categoria?.nombre ?? "",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue<string>(columnId);
        return value?.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "causa",
      header: "Causa Mortandad",
      accessorFn: (row) => row.causa?.nombre ?? "",
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
    // {
    //   accessorKey: "ubicacionGps",
    //   header: "Ubicación GPS",
    // },
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
      header: () => <Logs className="text-primary" />,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" className="w-8 h-4 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/configuracion/mortandad/${row.original.id}`}>
              <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              onClick={() => setDeletingMortandad(row.original)}
            >
              <Trash className="w-4 h-4 mr-2 text-red-500" />
              <p className="text-red-500">Eliminar</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
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
      rowSelection, // 👈 agregado
    },
    onRowSelectionChange: setRowSelection, // 👈 agregado
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  if (!isMonted) return null;

  return (
    <div className="p-4 bg-background shadow-md rounded-lg mt-4">
      <div className="w-full items-center justify-between">
        <div className="flex-row md:flex items-center mb-2 gap-5">
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
            className="mb-2 md:mb-0"
          />

          {/* Filtro por fecha */}
          <div className="flex items-center gap-2">
            {/* Filtro por fecha */}
            <div className="flex items-center gap-4">
              <div className="flex flex-col">
                <label className="text-xs font-medium text-muted-foreground mb-1">
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
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-medium text-muted-foreground mb-1">
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
                />
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-44 flex items-center justify-between"
              >
                <ListFilterPlus className="ml-2 h-8 w-8" />{" "}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-2 w-60">
              {/* Filtro Categoría */}
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Categoría
                </label>
                <Select
                  value={selectedCategoria}
                  onValueChange={(value) =>
                    handleFilterChange("categoria", value, setSelectedCategoria)
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
                        data.map((d) => d.categoria?.nombre).filter(Boolean)
                      ),
                    ].map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Causa */}
              <div className="mb-2">
                <label className="block text-sm font-medium mb-1">
                  Causa Mortandad
                </label>
                <Select
                  value={selectedCausa}
                  onValueChange={(value) =>
                    handleFilterChange("causa", value, setSelectedCausa)
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
                        data.map((d) => d.causa?.nombre).filter(Boolean)
                      ),
                    ].map((causa) => (
                      <SelectItem key={causa} value={causa}>
                        {causa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro Propietario */}
              <div>
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

              {/* Filtro Propietario */}
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
              {/* 👇 Botón solo si hay filtros activos */}
              {hasActiveFilters && (
                <div className="mt-4 flex justify-end">
                  <Button size="sm" onClick={clearFilters}>
                    Limpiar filtros
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

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
            <div className="flex-row md:flex items-center mt-4">
              {selectedRows.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={() => setDeletingMortandad(selectedRows)}
                  className="mb-4"
                  size="sm"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Eliminar seleccionados ({selectedRows.length})
                </Button>
              )}
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
          open={!!deletingMortandad}
          onOpenChange={(open) => {
            if (!open) setDeletingMortandad(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Confirmar Eliminación
              </DialogTitle>
            </DialogHeader>

            <DialogDescription>
              {Array.isArray(deletingMortandad) ? (
                <p className="mt-2">
                  ¿Estás seguro de que deseas eliminar los{" "}
                  <span className="font-bold">{deletingMortandad.length}</span>{" "}
                  registros seleccionados? Esta acción no se puede deshacer.
                </p>
              ) : (
                <p className="mt-2">
                  ¿Estás seguro de que deseas eliminar el registro de
                  <span className="font-bold italic">
                    {" " + deletingMortandad?.numeroAnimal + " "}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              )}
            </DialogDescription>

            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setDeletingMortandad(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={loading}
              >
                {loading ? "Eliminando..." : "Confirmar"}
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
          Total de registros: {data.length}
        </div>
      </div>
    </div>
  );
}
