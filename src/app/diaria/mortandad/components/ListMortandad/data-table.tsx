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
import { DialogClose } from "@radix-ui/react-dialog";
import { formatDate, formatDateSingle } from "@/utils/formatDate";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  console.log("data", data);

  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isMonted, setIsMonted] = useState(false);
  const [deletingMortandad, setDeletingMortandad] = useState<Mortandad | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    if (deletingMortandad) {
      setLoading(true);
      try {
        const resp = await fetch(`/api/mortandad/${deletingMortandad.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (resp.ok) {
          toast.warning("Exito!!! 😃 ", {
            description: "Los datos fueron eliminados...",
          });
          setDeletingMortandad(null);
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
    }
  };

  const columns: ColumnDef<MortandadWithRelations>[] = [
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
    },
  });
  if (!isMonted) {
    return null;
  }

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
                  onValueChange={(value) =>
                    table
                      .getColumn("categoria")
                      ?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
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
                  onValueChange={(value) =>
                    table
                      .getColumn("causa")
                      ?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
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
                  onValueChange={(value) =>
                    table
                      .getColumn("propietario")
                      ?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
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
                  onValueChange={(value) =>
                    table
                      .getColumn("potrero")
                      ?.setFilterValue(value === "all" ? undefined : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
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
          onOpenChange={() => setDeletingMortandad(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary">
                Eliminar Mortandad 🗑️
              </DialogTitle>

              <DialogDescription>
                <p className="mt-2">
                  ¿Estás seguro de que deseas eliminar el registro de
                  <span className="font-bold italic">
                    {" " + deletingMortandad?.numeroAnimal + " "}
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose>
                <Button
                  variant="outline"
                  onClick={() => setDeletingMortandad(null)}
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
          Total de registros: {data.length}
        </div>
      </div>
    </div>
  );
}
