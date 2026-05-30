"use client";
import React, { useState } from "react";
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
  Settings2,
  MoreHorizontal,
} from "lucide-react";
import { Prisma } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { formatDate, formatDateSingle } from "@/utils/formatDate";

type MovimientoWithRelations = Prisma.MovimientoGetPayload<{
  include: {
    categoria: true;
    entrada: {
      include: {
        propietario: true;
      };
    };
    salida: {
      include: {
        propietario: true;
      };
    };
    nacimiento: {
      include: {
        propietario: true;
      };
    };
    mortandad: {
      include: {
        propietario: true;
      };
    };
  };
}>;

interface DataTableProps {
  data: MovimientoWithRelations[];
}

type DateRangeFilter = { from?: string; to?: string };

export function DataTableMovimientos({ data }: DataTableProps) {
  const [selectedTipo, setSelectedTipo] = useState("all");
  const [selectedCategoria, setSelectedCategoria] = useState("all");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isMonted, setIsMonted] = useState(false);
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
    setSelectedTipo("all");
    setSelectedCategoria("all");

    table.getColumn("tipo")?.setFilterValue(undefined);
    table.getColumn("categoria")?.setFilterValue(undefined);
  };

  const hasActiveFilters = selectedTipo !== "all" || selectedCategoria !== "all";

  // Obtener propietario dependiendo del tipo de movimiento
  const getPropietario = (row: MovimientoWithRelations): string => {
    switch (row.tipo) {
      case "ENTRADA":
        return row.entrada?.propietario?.nombre ?? "N/A";
      case "SALIDA":
        return row.salida?.propietario?.nombre ?? "N/A";
      case "NACIMIENTO":
        return row.nacimiento?.propietario?.nombre ?? "N/A";
      case "MORTANDAD":
        return row.mortandad?.propietario?.nombre ?? "N/A";
      default:
        return "N/A";
    }
  };

  const columns: ColumnDef<MovimientoWithRelations>[] = [
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
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
      accessorKey: "tipo",
      header: "Tipo Movimiento",
      cell: ({ cell }) => {
        const tipo = cell.getValue() as string;
        const colors: Record<string, string> = {
          ENTRADA: "bg-green-100 text-green-800",
          SALIDA: "bg-red-100 text-red-800",
          NACIMIENTO: "bg-blue-100 text-blue-800",
          MORTANDAD: "bg-gray-100 text-gray-800",
        };
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${
              colors[tipo] || "bg-gray-100 text-gray-800"
            }`}
          >
            {tipo}
          </span>
        );
      },
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue<string>(columnId);
        return value === filterValue;
      },
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      accessorFn: (row) => row.categoria?.nombre ?? "N/A",
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const value = row.getValue<string>(columnId);
        return value?.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      id: "propietario",
      header: "Propietario",
      cell: ({ row }) => getPropietario(row.original),
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const propietario = getPropietario(row.original);
        return propietario?.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "cantidad",
      header: "Cantidad",
      cell: ({ cell }) => cell.getValue() ?? "-",
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

  if (!isMonted) return null;

  return (
    <div className="p-4 bg-background shadow-md rounded-lg mt-4">
      <div className="w-full items-center justify-between">
        {/* Fila de filtros principal */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
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
                    Tipo Movimiento
                  </label>
                  <Select
                    value={selectedTipo}
                    onValueChange={(value) =>
                      handleFilterChange("tipo", value, setSelectedTipo)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <Separator />
                      <SelectItem value="ENTRADA">ENTRADA</SelectItem>
                      <SelectItem value="SALIDA">SALIDA</SelectItem>
                      <SelectItem value="NACIMIENTO">NACIMIENTO</SelectItem>
                      <SelectItem value="MORTANDAD">MORTANDAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">
                    Categoría
                  </label>
                  <Select
                    value={selectedCategoria}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "categoria",
                        value,
                        setSelectedCategoria
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
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
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
                    No hay movimientos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-end space-x-2 py-4">
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
