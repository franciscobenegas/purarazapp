"use client";

import * as React from "react";
import { ChevronUp } from "lucide-react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatoPrecio } from "@/utils/formatoPrecio";
import Image from "next/image";
import { Progress } from "@/components/ui/progress";

type TableIntegrationProps = {
  app: string;
  icon: string;
  type: "Francisco" | "Luis" | "Ariel";
  rate: number;
  profit: number;
};

const data: TableIntegrationProps[] = [
  {
    app: "Vaca",
    icon: "https://w7.pngwing.com/pngs/609/494/png-transparent-cattle-agriculture-live-animal-feed-computer-icons-cow-miscellaneous-food-animals.png",
    type: "Francisco",
    rate: 60,
    profit: 45000000,
  },
  {
    app: "Ternero",
    icon: "https://w7.pngwing.com/pngs/609/494/png-transparent-cattle-agriculture-live-animal-feed-computer-icons-cow-miscellaneous-food-animals.png",
    type: "Luis",
    rate: 20,
    profit: 30000000,
  },
  {
    app: "Vaca",
    icon: "https://w7.pngwing.com/pngs/609/494/png-transparent-cattle-agriculture-live-animal-feed-computer-icons-cow-miscellaneous-food-animals.png",
    type: "Ariel",
    rate: 80,
    profit: 15000000,
  },
];

export const columns: ColumnDef<TableIntegrationProps>[] = [
  {
    accessorKey: "icon",
    header: "LOGO",
    cell: ({ row }) => (
      <div className="capitalize">
        <Image src={row.getValue("icon")} alt="LOGO" width={30} height={30} />
      </div>
    ),
  },
  {
    accessorKey: "app",
    header: "Clasificaicon",
    cell: ({ row }) => <div className="capitalize">{row.getValue("app")}</div>,
  },
  {
    accessorKey: "type",
    header: () => <div>Propietario</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "rate",
    header: () => <div className="text-right">Ventas</div>,
    cell: ({ row }) => (
      <div className="text-right font-medium flex gap-1 items-center">
        <Progress value={row.getValue("rate")} className="h-2" />
      </div>
    ),
  },
  {
    accessorKey: "profit",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="float-end px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        GS.
        <ChevronUp className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("profit"));
      return (
        <div className="text-right font-medium">{formatoPrecio(amount)}</div>
      );
    },
  },
];

export function TablaIntegracion() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full mt-5">
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
