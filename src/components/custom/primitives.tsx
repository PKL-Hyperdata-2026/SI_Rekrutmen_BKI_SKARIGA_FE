import * as React from "react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

export type PrimitiveProps = React.HTMLAttributes<HTMLElement> & {
  asChild?: boolean;
};

export function createPrimitive(tag: string, slot: string = tag) {
  return function PrimitiveComponent({
    className,
    asChild = false,
    ...props
  }: PrimitiveProps) {
    if (asChild) {
      return (
        <Slot.Root
          data-slot={slot}
          className={cn(className)}
          {...props}
        />
      );
    }

    return React.createElement(tag, {
      "data-slot": slot,
      className: cn(className),
      ...props,
    });
  };
}

export const Box = createPrimitive("div", "box");
export type BoxProps = PrimitiveProps;

export const Paragraph = createPrimitive("p", "paragraph");
export type ParagraphProps = PrimitiveProps;

export const Span = createPrimitive("span", "span");
export type SpanProps = PrimitiveProps;

export const Primitives = {
  Box,
  Paragraph,
  Span,
  create: createPrimitive,
};
