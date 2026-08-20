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
  bodyClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
}

// 1. Size Preset Mapping
const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-[95vw] sm:max-w-[480px]",
  md: "max-w-[95vw] sm:max-w-[620px]",
  lg: "max-w-[95vw] lg:max-w-[960px]",
  xl: "max-w-[95vw] xl:max-w-[1180px]",
  full: "max-w-[96vw] max-h-[96vh]",
};

// 2. Role Gradient Mapping (Sync with src/index.css tokens)
const roleHeaderGradients: Record<ModalVariant, string> = {
  admin: "bg-gradient-to-r from-[#2A1063] via-[#552FB8] to-[#8B5CF6]",
  student: "bg-gradient-to-r from-[#062A4D] via-[#123C70] to-[#2F8CDB]",
  alumni: "bg-gradient-to-r from-[#062A4D] via-[#123C70] to-[#2F8CDB]",
  hrd: "bg-gradient-to-r from-[#3D0040] via-[#5A0C62] to-[#D46AD8]",
  auto: "bg-gradient-to-r from-[var(--sidebar-gradient-to)] via-[var(--sidebar-strip)] to-[var(--sidebar-gradient-from)]",
};

const roleConfirmButtonClasses: Record<ModalVariant, string> = {
  admin:
    "bg-gradient-to-r from-[#351477] to-[#7C3AED] hover:opacity-90 text-white shadow-sm",
  student:
    "bg-gradient-to-r from-[#123C70] to-[#287DCE] hover:opacity-90 text-white shadow-sm",
  alumni:
    "bg-gradient-to-r from-[#123C70] to-[#287DCE] hover:opacity-90 text-white shadow-sm",
  hrd: "bg-gradient-to-r from-[#5A0C62] to-[#8D1D96] hover:opacity-90 text-white shadow-sm",
  auto: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm",
};

const roleAccentTextClasses: Record<ModalVariant, string> = {
  admin: "text-[#552FB8]",
  student: "text-[#123C70]",
  alumni: "text-[#123C70]",
  hrd: "text-[#8D1D96]",
  auto: "text-primary",
};

// ==========================================
// Compound Building Blocks
// ==========================================

export interface ModalHeaderProps extends React.ComponentProps<"div"> {
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
        "relative px-6 py-5 flex items-start justify-between gap-4 select-none shrink-0",
        isGradientHeader
          ? cn("text-white shadow-sm", roleHeaderGradients[variant])
          : "bg-white border-b border-gray-100 text-gray-900",
        className,
      )}
      {...props}
    >
      {children ? (
        children
      ) : (
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {headerIcon && (
            <div
              className={cn(
                "mt-0.5 shrink-0 flex items-center justify-center",
                isGradientHeader
                  ? "text-white"
                  : roleAccentTextClasses[variant],
              )}
            >
              {headerIcon}
            </div>
          )}
          <div className="flex flex-col gap-1 min-w-0">
            {title ? (
              <DialogTitle
                className={cn(
                  "font-bold text-lg md:text-xl tracking-tight truncate",
                  isGradientHeader
                    ? "text-white"
                    : roleAccentTextClasses[variant],
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
                  "text-xs md:text-[13px] leading-snug",
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

      {/* Right Action & Non-force Close Button */}
      <div className="flex items-center gap-2 shrink-0 self-center">
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
            <X className="h-5 w-5" />
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
      className={cn("p-6 overflow-y-auto flex-1 text-foreground", className)}
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
        "px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-col-reverse sm:flex-row sm:justify-end sm:items-center gap-2.5 shrink-0 rounded-b-2xl",
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
              className="rounded-lg border-gray-200 hover:bg-gray-100 text-gray-700 font-medium px-5 cursor-pointer"
            >
              {cancelText}
            </Button>
          )}
          {!hideConfirmButton && (
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                "rounded-lg font-semibold px-5 transition-all flex items-center gap-2 cursor-pointer",
                roleConfirmButtonClasses[variant],
              )}
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
  bodyClassName,
  headerClassName,
  footerClassName,
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
          "p-0 flex flex-col max-h-[90vh] rounded-2xl",
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
            className={headerClassName}
          />
        ) : (
          /* A11y Fallback jika benar-benar tanpa header */
          <div className="sr-only">
            <DialogTitle>Dialog</DialogTitle>
            <DialogDescription>Dialog content</DialogDescription>
          </div>
        )}

        {/* Scrollable Body Content (Using ModalBody Compound Component) */}
        <ModalBody className={bodyClassName}>{children}</ModalBody>

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
            className={footerClassName}
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
