import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X, Send, Loader2 } from "lucide-react";

export type ModalVariant = "admin" | "student" | "alumni" | "hrd" | "auto";
export type ModalHeaderStyle = "gradient" | "white";
export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  // State control
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Header & Presentation
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ModalVariant;
  headerStyle?: ModalHeaderStyle;
  headerIcon?: React.ReactNode;
  headerAction?: React.ReactNode;
  hideCloseButton?: boolean;
  // Size Preset
  size?: ModalSize;
  // Body content
  children: React.ReactNode;
  // Smart Footer
  footer?: React.ReactNode | null;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  confirmIcon?: React.ReactNode;
  hideCancelButton?: boolean;
  hideConfirmButton?: boolean;
  // Custom CSS Classes
  className?: string;
}

// 1. Size Preset Mapping
const sizeClasses: Record<ModalSize, string> = {
  sm: "w-[calc(100vw-1.5rem)] sm:max-w-[480px]",
  md: "w-[calc(100vw-1.5rem)] sm:max-w-[560px] md:max-w-[620px]",
  lg: "w-[calc(100vw-1.5rem)] lg:max-w-[960px]",
  xl: "w-[calc(100vw-1.5rem)] xl:max-w-[1180px]",
  full: "w-[calc(100vw-1.5rem)] sm:max-w-[96vw] max-h-[96vh]",
};

const roleThemeClasses: Record<ModalVariant, string> = {
  admin: "theme-admin",
  student: "theme-siswa",
  alumni: "theme-siswa",
  hrd: "theme-hrd",
  auto: "",
};
// ==========================================
// Compound Building Blocks
// ==========================================
export interface ModalHeaderProps extends Omit<React.ComponentProps<"div">, "title"> {
  variant?: ModalVariant;
  headerStyle?: ModalHeaderStyle;
  headerIcon?: React.ReactNode;
  headerAction?: React.ReactNode;
  hideCloseButton?: boolean;
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
}

export function ModalHeader({
  className,
  variant = "auto",
  headerStyle = "gradient",
  headerIcon,
  headerAction,
  hideCloseButton = false,
  onClose,
  title,
  description,
  children,
  ...props
}: ModalHeaderProps) {
  const isGradientHeader = headerStyle === "gradient";

  return (
    <div
      className={cn(
        "relative px-4 py-3.5 sm:px-6 sm:py-5 flex items-start justify-between gap-3 sm:gap-4 select-none shrink-0",
        roleThemeClasses[variant],
        isGradientHeader
          ? "bg-linear-to-r from-sidebar-gradient-to via-sidebar-strip to-sidebar-gradient-from text-white shadow-sm"
          : "bg-white border-b border-gray-100 text-gray-900",
        className,
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <div className="flex items-start gap-2.5 sm:gap-3 flex-1 min-w-0 pr-8 sm:pr-10">
          {headerIcon && (
            <div
              className={cn(
                "mt-0.5 shrink-0 flex items-center justify-center",
                isGradientHeader ? "text-white" : "text-accent",
              )}
            >
              {headerIcon}
            </div>
          )}
          <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
            {title ? (
              <DialogTitle
                className={cn(
                  "font-bold text-base sm:text-lg md:text-xl tracking-tight leading-snug wrap-break-word",
                  isGradientHeader ? "text-white" : "text-accent",
                )}
              >
                {title}
              </DialogTitle>
            ) : (
              /* A11y Fallback jika title tidak diberikan */
              <DialogTitle className="sr-only">Dialog</DialogTitle>
            )}

            {description ? (
              <DialogDescription
                className={cn(
                  "text-xs md:text-[13px] leading-snug w-full max-w-xs sm:max-w-md wrap-break-word",
                  isGradientHeader ? "text-white/80" : "text-gray-500",
                )}
              >
                {description}
              </DialogDescription>
            ) : (
              /* A11y Fallback jika description tidak diberikan */
              <DialogDescription className="sr-only">
                Dialog content
              </DialogDescription>
            )}
          </div>
        </div>
      )}

      {/* Right Action & Close Button */}
      <div className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 flex items-center gap-1.5 sm:gap-2 shrink-0">
        {headerAction}
        {!hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup Dialog"
            className={cn(
              "rounded-full p-1.5 transition-all outline-none cursor-pointer border-none bg-transparent",
              isGradientHeader
                ? "text-white/80 hover:text-white hover:bg-white/15"
                : "text-gray-400 hover:text-gray-700 hover:bg-gray-100",
            )}
          >
            <X className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            <span className="sr-only">Tutup</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function ModalBody({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "px-4 pt-3 pb-8 sm:px-6 sm:pt-4 sm:pb-6 overflow-y-auto overscroll-contain flex-1 text-foreground",
        "[-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden sm:scrollbar-thin sm:[&::-webkit-scrollbar]:block sm:custom-scrollbar",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ModalFooterProps extends React.ComponentProps<"div"> {
  variant?: ModalVariant;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  confirmIcon?: React.ReactNode;
  hideCancelButton?: boolean;
  hideConfirmButton?: boolean;
}

export function ModalFooter({
  className,
  variant = "auto",
  confirmText = "Simpan Data",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmIcon = <Send className="h-4 w-4" />,
  hideCancelButton = false,
  hideConfirmButton = false,
  children,
  ...props
}: ModalFooterProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 sm:px-6 sm:py-3.5 border-t border-gray-100 bg-gray-50/50 flex flex-row items-center justify-end gap-2 sm:gap-2.5 shrink-0 rounded-b-2xl",
        roleThemeClasses[variant],
        className,
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <>
          {!hideCancelButton && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="h-10 flex-1 sm:flex-initial rounded-xl border-gray-200 hover:bg-gray-100 text-gray-700 font-medium px-4 sm:px-5 cursor-pointer justify-center"
            >
              {cancelText}
            </Button>
          )}
          {!hideConfirmButton && (
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="h-10 flex-1 sm:flex-initial rounded-xl font-semibold px-4 sm:px-5 transition-all flex items-center justify-center gap-2 cursor-pointer bg-linear-to-r from-sidebar-strip to-primary hover:opacity-90 text-white shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>{confirmText}</span>
                  {confirmIcon}
                </>
              )}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
// ==========================================
// High-Level Convenient <Modal /> Component
// ==========================================
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  variant = "auto",
  headerStyle = "gradient",
  headerIcon,
  headerAction,
  hideCloseButton = false,
  size = "md",
  children,
  footer,
  confirmText = "Simpan Data",
  cancelText = "Batal",
  onConfirm,
  onCancel,
  isLoading = false,
  confirmIcon = <Send className="h-4 w-4" />,
  hideCancelButton = false,
  hideConfirmButton = false,
  className,
}: ModalProps) {
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 flex flex-col max-h-[92vh] sm:max-h-[90vh] rounded-2xl",
          roleThemeClasses[variant],
          sizeClasses[size],
          className,
        )}
      >
        {/* Header Section (Using ModalHeader Compound Component) */}
        {title || description || !hideCloseButton ? (
          <ModalHeader
            variant={variant}
            headerStyle={headerStyle}
            headerIcon={headerIcon}
            headerAction={headerAction}
            hideCloseButton={hideCloseButton}
            onClose={handleCancel}
            title={title}
            description={description}
          />
        ) : (
          /* A11y Fallback jika benar-benar tanpa header */
          <div className="sr-only">
            <DialogTitle>Dialog</DialogTitle>
            <DialogDescription>Dialog content</DialogDescription>
          </div>
        )}
        {/* Scrollable Body Content (Using ModalBody Compound Component) */}
        <ModalBody>{children}</ModalBody>

        {/* Footer Section (Using ModalFooter Compound Component) */}
        {footer !== null && (
          <ModalFooter
            variant={variant}
            confirmText={confirmText}
            cancelText={cancelText}
            onConfirm={onConfirm}
            onCancel={handleCancel}
            isLoading={isLoading}
            confirmIcon={confirmIcon}
            hideCancelButton={hideCancelButton}
            hideConfirmButton={hideConfirmButton}
          >
            {footer}
          </ModalFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Subcomponent Compound Exports
Modal.Root = Dialog;
Modal.Content = DialogContent;
Modal.Header = ModalHeader;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
Modal.Title = DialogTitle;
Modal.Description = DialogDescription;

export {
  DialogContent as ModalContent,
  DialogTitle as ModalTitle,
  DialogDescription as ModalDescription,
};
