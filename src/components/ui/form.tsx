import * as React from "react";
import { Form as FormPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

function Form({
  className,
  ...props
}: React.ComponentProps<typeof FormPrimitive.Root>) {
  return (
    <FormPrimitive.Root
      data-slot="form"
      className={cn("space-y-4", className)}
      {...props}
    />
  );
}

export { Form };
