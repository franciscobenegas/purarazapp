import React from "react";
import Departamentos from "../../../data/departamento.json";
import { HeaderEstancia } from "./components/HeaderEstancia";

export default function EstanciaPage() {
  console.log("Departamento = ", Departamentos);

  return (
    <div>
      <HeaderEstancia />
    </div>
  );
}
