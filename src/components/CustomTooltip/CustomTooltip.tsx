import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type Props = {
  content: string;
};

export function CustomTooltip(props: Props) {
  const { content } = props;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Info strokeWidth={1} className="h-5 w-5" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
