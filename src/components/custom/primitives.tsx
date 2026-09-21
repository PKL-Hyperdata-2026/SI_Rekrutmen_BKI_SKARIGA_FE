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

export const Heading1 = createPrimitive("h1", "heading-1");
export type Heading1Props = PrimitiveProps;

export const Heading2 = createPrimitive("h2", "heading-2");
export type Heading2Props = PrimitiveProps;

export const Heading3 = createPrimitive("h3", "heading-3");
export type Heading3Props = PrimitiveProps;

export const Heading4 = createPrimitive("h4", "heading-4");
export type Heading4Props = PrimitiveProps;

export const Heading5 = createPrimitive("h5", "heading-5");
export type Heading5Props = PrimitiveProps;

export const Heading6 = createPrimitive("h6", "heading-6");
export type Heading6Props = PrimitiveProps;

export const Primitives = {
  Box,
  Paragraph,
  Span,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  create: createPrimitive,
};
