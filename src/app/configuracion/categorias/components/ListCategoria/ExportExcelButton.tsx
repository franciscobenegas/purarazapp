"use client";
import { Button } from "@/components/ui/button"; // Asegúrate de tener el botón de ShadCN configurado
import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Categoria } from "@prisma/client";
import { Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExportExcelButtonProps {
  data: Categoria[]; // El array de objetos que se exportarán
  fileName?: string; // Nombre opcional para el archivo de Excel
}

export default function ExportExcelButton({
  data,
  fileName = "Categoria_data",
}: ExportExcelButtonProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const exportToExcel = () => {
    setLoading(true);
    try {
      // Crear el libro y la hoja de trabajo de Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");

      // Obtener la fecha y hora actual
      const now = new Date();
      const dateString = now
        .toLocaleString("sv-SE", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
        .replace(/[:\s]/g, "-"); // Formatear para el nombre del archivo

      // Generar archivo Excel en buffer
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      // Crear archivo Blob para descarga
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, `${fileName}_${dateString}.xlsx`);

      setLoading(false);
    } catch (error) {
      console.error("Error al exportar a Excel:", error);
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={exportToExcel}
            disabled={loading}
            // className="bg-blue-500 hover:bg-blue-700 text-white"
            variant="outline"
          >
            {/* {loading ? "Exportando..." : "Exportar a Excel"} */}
            {/* <Sheet /> */}
            <Download className="mr-2 size-4" aria-hidden="true" />
            XLS
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Exportar a Excel</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
