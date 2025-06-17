"use client";

import { SplineScene } from "../ui/splite";
import { Card } from "../../../components/ui/card";
import { Spotlight } from "../ui/spotlight";
import { InteractiveHoverButton } from "./interactive-hover-button";
import Link from "next/link";

export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[600px] bg-black/[0.96] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      <div className="flex h-full">
        {/* Left content */}

        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className=" text-transparent text-4xl md:text-5xl font-bold bg-clip-text  bg-gradient-to-b from-neutral-50 to-neutral-400">
            Bienvenido a Pura Raza
          </h1>

          <p className="mt-4 text-neutral-300 max-w-lg">
            Tú Asistente Ganadero Digital ayuda a usted o su personal de campo a
            registrar de forma clara y sin inconvenientes algunos de los datos
            que actualmente se registran en partes diarias, la App al estar
            pensada y adaptada al personal de campo no tendrá necesidad de
            contratar personal capacitado para cargar los datos al sistema.
          </p>
          <p className="mt-4 text-neutral-300 max-w-lg">
            Donde podra ver el status onLine de su establesimiento en cualquier
            parte del mundo, con ayuda de reportes y estadisticas realizados en
            forma automatica por su asistente de IA.
          </p>

          <div className="relative justify-center mt-10">
            <Link href="/dashboard">
              <InteractiveHoverButton text="Ir al Dashborad" />
            </Link>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
