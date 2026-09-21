import * as React from "react"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"

export interface ParagraphProps extends React.ComponentProps<"p"> {
  asChild?: boolean
}

export function Paragraph({ className, asChild = false, ...props }: ParagraphProps) {
  const Comp = asChild ? Slot.Root : "p"

  return <Comp data-slot="paragraph" className={cn(className)} {...props} />
}

export const P = Paragraph

