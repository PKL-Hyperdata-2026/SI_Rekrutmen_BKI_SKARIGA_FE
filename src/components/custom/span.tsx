import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

export interface SpanProps extends React.ComponentProps<"span"> {
  asChild?: boolean
}

export function Span({ className, asChild = false, ...props }: SpanProps) {
  const Comp = asChild ? Slot.Root : "span"

  return <Comp data-slot="span" className={cn(className)} {...props} />
}
