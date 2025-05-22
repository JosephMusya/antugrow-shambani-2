import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ToolTipProps {
  description: string
}

export default function ToolTip({ description }: ToolTipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="ml-2 cursor-pointer">
          <Info className="text-green-500" size={14} />
        </span>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={5}
        className="relative bg-gray-50 border border-gray-200 text-gray-700 text-xs p-2 rounded shadow-sm max-w-[28rem] text-start"
      >
        <p>
            {description}
        </p>

        {/* Arrow */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gray-50 border-l border-t border-gray-200 z-[-1]" />
      </TooltipContent>
    </Tooltip>
  )
}
