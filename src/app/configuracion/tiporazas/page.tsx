import React from "react";
import { HeaderTipoRazas } from "./components/HeaderTipoRazas";
import { ListTipoRazas } from "./components/ListTipoRazas";

export default function TipoRazaPage() {
  return (
    <div>
      <HeaderTipoRazas />
      <ListTipoRazas />
    </div>
  );
}
