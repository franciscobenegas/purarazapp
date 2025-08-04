import { Separator } from "@/components/ui/separator";
import { Potrero } from "@prisma/client";
import React from "react";
import { FormPotreroId } from "../FormPotreroId";

interface PotreroProps {
  potrero: Potrero;
}

export function InfoPotrero(props: PotreroProps) {
  const { potrero } = props;

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos Potrero</p>
          <Separator />
          <FormPotreroId potrero={potrero} />
        </div>
      </div>
    </div>
  );
}
