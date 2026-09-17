import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="pagination"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
  asChild?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"button">;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  asChild = false,
  type = "button",
  ...props
}: PaginationLinkProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="pagination-link"
      data-active={isActive}
      aria-current={isActive ? "page" : undefined}
      type={asChild ? undefined : type}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "ghost",
          size,
        }),
        "rounded-lg transition-all cursor-pointer select-none",
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  text = "Sebelumnya",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1.5 px-3 font-medium", className)}
      {...props}
    >
      <ChevronLeftIcon className="size-4" />
      <span className="hidden sm:inline-block text-xs font-semibold">{text}</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  text = "Berikutnya",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1.5 px-3 font-medium", className)}
      {...props}
    >
      <span className="hidden sm:inline-block text-xs font-semibold">{text}</span>
      <ChevronRightIcon className="size-4" />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-8 items-center justify-center text-slate-400", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">Halaman lainnya</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
