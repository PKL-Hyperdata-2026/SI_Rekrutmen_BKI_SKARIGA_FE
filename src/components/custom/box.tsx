import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

export interface BoxProps extends React.ComponentProps<"div"> {
  asChild?: boolean
}

export function Box({ className, asChild = false, ...props }: BoxProps) {
  const Comp = asChild ? Slot.Root : "div"

  return <Comp data-slot="box" className={cn(className)} {...props} />
}

export const Div = Box
