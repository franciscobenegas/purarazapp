import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
  icon: LucideIcon;
}

export function CustomIcon(props: Props) {
  const { icon: Icon } = props;
  return (
    <div className="p-2 bg-slate-400/2  rounded-lg">
      <Icon strokeWidth={1} className="w-4 h-4" />
    </div>
  );
}
