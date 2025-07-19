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
  KeySquare,
  Logs,
  MoreHorizontal,
  Settings2,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserX,
} from "lucide-react";
import { Usuario } from "@prisma/client";
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
  DialogClose,
} from "@/components/ui/dialog";
import ExportExcelButton from "./ExportExcelButton";
import Link from "next/link";
import { formatDate } from "@/utils/formatDate";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ChangePassword } from "../../[usuariosId]/components/ChangePassword";

interface DataTableProps {
  data: Usuario[];
}

export function DataTableUsuarios({ data }: DataTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [isMonted, setIsMonted] = useState(false);
  const [deletingUsuario, setDeletingUsuario] = useState<Usuario | null>(null);
  const [chkPsswUsuario, setChkPsswUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false); // Estado para el botón de carga

  const handleDeleteConfirm = async () => {
    if (deletingUsuario) {
      setLoading(true); // Desactivar el botón
      try {
        const resp = await fetch(`/api/usuarios/${deletingUsuario.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (resp.ok) {
          toast.warning("Exito!!! 😃 ", {
            description: "Los datos fueron eliminados...",
          });
          setDeletingUsuario(null);
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

  const toggleUsuarioActivo = async (id: string, activoActual: boolean) => {
    try {
      const response = await fetch(`/api/usuarios/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activo: !activoActual, // 🟢 Se invierte el estado
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el estado del usuario.");
      }
      toast.success("Exito!!! 😃 ", {
        description: "El Estado se actualizo...",
      });
      router.refresh();

      // Podés refrescar datos aquí si querés
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const columns: ColumnDef<Usuario>[] = [
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },

    {
      accessorKey: "username",
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
      accessorKey: "rol",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ROL <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "activo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Estado <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const value = row.getValue("activo") as boolean;
        return (
          <Badge variant={value ? "default" : "destructive"}>
            {value ? "Activo" : "Inactivo"}
          </Badge>
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
              <Link href={`/configuracion/usuarios/${row.original.id}`}>
                <DropdownMenuItem>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Cambiar de Rol
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() =>
                  toggleUsuarioActivo(row.original.id, row.original.activo)
                }
              >
                {row.original.activo ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Desactivar
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Activar
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setChkPsswUsuario(row.original)}>
                <KeySquare className="mr-2 h-4 w-4" />
                Cambiar Contaseña
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setDeletingUsuario(row.original)}
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
    <div className="p-4 bg-background shadow-md rounded-lg mt-4">
      <div className="w-full items-center justify-between">
        <div className="flex-row md:flex items-center mb-2 gap-5">
          <Input
            placeholder="Filtrar por Correo"
            value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("email")?.setFilterValue(event.target.value)
            }
            className="mb-2 md:mb-0"
          />

          <Input
            placeholder="Filtrar por Usuario"
            value={
              (table.getColumn("username")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("username")?.setFilterValue(event.target.value)
            }
            className="mb-2 md:mb-0"
          />

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
          open={!!deletingUsuario}
          onOpenChange={() => setDeletingUsuario(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-primary">
                Eliminar Usuario 🗑️
              </DialogTitle>

              <DialogDescription>
                <p className="mt-2">
                  ¿Estás seguro de que deseas eliminar el Usuario
                  <span className="font-bold italic">
                    {" " + deletingUsuario?.username + " "}
                  </span>
                  ? <br />
                  Esta acción no se puede deshacer.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose>
                <Button
                  variant="outline"
                  onClick={() => setDeletingUsuario(null)}
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

        {/* Dialog para Cambiar Contraseña */}
        <Dialog
          open={!!chkPsswUsuario}
          onOpenChange={() => setChkPsswUsuario(null)}
        >
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle className="text-primary"></DialogTitle>
            </DialogHeader>
            <ChangePassword
              usuarioId={chkPsswUsuario?.id}
              onClose={() => setChkPsswUsuario(null)}
            />
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
