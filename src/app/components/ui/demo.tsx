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

      <div className="flex h-full flex-col md:flex-row">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-transparent text-4xl md:text-5xl font-bold bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400">
            Bienvenido a Pura Raza
          </h1>

          <p className="mt-10 text-neutral-300 max-w-lg">
            Tú Asistente Ganadero Digital ayuda a usted y a su personal de campo
            a ver el status onLine de su establecimiento en cualquier parte del
            mundo, con ayuda de reportes y estadísticas realizados en forma
            automática por su asistente de Inteligencia Artifical.
          </p>
          <div className="flex flex-col md:flex-row justify-between">
            <div className="relative justify-center mt-12">
              <Link href="/dashboard">
                <InteractiveHoverButton text="Ir al Dashboard" />
              </Link>
            </div>
            <div className="relative justify-center mt-12">
              <Link href="/chat">
                <InteractiveHoverButton text="Chat con VAKI" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right content: oculto en móvil */}
        <div className="hidden md:block flex-1 relative">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
