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
  type: "Finance" | "CRM" | "MarketPlace";
  rate: number;
  profit: number;
};

const data: TableIntegrationProps[] = [
  {
    app: "Stripe",
    icon: "data:image/png;base64,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",
    type: "Finance",
    rate: 60,
    profit: 450,
  },
  {
    app: "Slack",
    icon: "https://a.slack-edge.com/fd21de4/marketing/img/nav/logo.svg",
    type: "CRM",
    rate: 20,
    profit: 120.5,
  },
  {
    app: "Shopify",
    icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6zpvhC0euHbpxlVe45p1ZaKZgX2GEyOe-WyrmsdyMe9MNvgDJdqsFnZ3LDeQ_9W8aD48&usqp=CAU",
    type: "MarketPlace",
    rate: 80,
    profit: 963,
  },
];

export const columns: ColumnDef<TableIntegrationProps>[] = [
  {
    accessorKey: "icon",
    header: "LOGO",
    cell: ({ row }) => (
      <div className="capitalize">
        <Image src={row.getValue("icon")} alt="LOGO" width={20} height={20} />
      </div>
    ),
  },
  {
    accessorKey: "app",
    header: "Aplicaciones",
    cell: ({ row }) => <div className="capitalize">{row.getValue("app")}</div>,
  },
  {
    accessorKey: "type",
    header: () => <div>TYPE</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("type")}</div>,
  },
  {
    accessorKey: "rate",
    header: () => <div className="text-right">RATE</div>,
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
        PROFIT
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
