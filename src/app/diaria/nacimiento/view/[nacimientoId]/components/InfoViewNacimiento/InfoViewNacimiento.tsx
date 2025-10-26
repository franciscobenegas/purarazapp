import { Separator } from '@/components/ui/separator';
import { Prisma } from '@prisma/client';
import React from 'react'
import { FormViewNacimientoId } from '../FormViewNacimientoId';


type NacimientoWithRelations = Prisma.NacimientoGetPayload<{
  include: {
    propietario: true;
    potrero: true;
  };
}>;

interface NacimientoProps {
  nacimiento: NacimientoWithRelations;
}


export  function InfoViewNacimiento(props: NacimientoProps) {
    const { nacimiento } = props;
    console.log('nacimiento', nacimiento);
    

  return (
    <div className="grid grid-cols-1 ">
      <div className="rounded-lg bg-background shadow-md hover:shadow-lg p-4">
        <div>
          <p className="py-5 font-bold">Datos registro de Nacimiento</p>
          <Separator />
          <FormViewNacimientoId nacimiento={nacimiento} />
        </div>
      </div>
    </div>
  );
}
