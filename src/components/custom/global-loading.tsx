import { Box } from "@/components/custom/primitives";

export interface GlobalLoadingProps {
  show?: boolean;
  role?: string;
  className?: string;
  fullScreen?: boolean;
}

export function GlobalLoading({
  show = true,
  role,
  className,
  fullScreen = true,
}: GlobalLoadingProps) {
  const themeClass =
    role === "siswa" || role === "alumni"
      ? "theme-siswa"
      : role === "admin" || role === "superadmin"
        ? "theme-admin"
        : role === "hrd"
          ? "theme-hrd"
          : undefined;

  const transitionClasses = show
    ? "opacity-100 scale-100 visible"
    : "opacity-0 scale-105 pointer-events-none invisible";

  const containerClasses = fullScreen
    ? `fixed inset-0 z-[9999] flex flex-col items-center justify-center global-loader-backdrop transition-all duration-500 ease-in-out ${transitionClasses}`
    : "flex items-center justify-center p-8 bg-transparent";

  return (
    <Box
      className={`${containerClasses} ${themeClass ?? ""} ${className ?? ""}`}
    >
      <Box className="global-loader-container">
        <svg
          viewBox="0 0 100 100"
          className="global-loader-spinner"
          aria-label="Loading..."
        >
          <g className="global-loader-rotator">
            <circle
              cx="50"
              cy="50"
              r="38"
              className="global-loader-arc global-loader-arc-accent"
              transform="rotate(-90 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              className="global-loader-arc global-loader-arc-base"
              transform="rotate(30 50 50)"
            />
            <circle
              cx="50"
              cy="50"
              r="38"
              className="global-loader-arc global-loader-arc-base"
              transform="rotate(150 50 50)"
            />
          </g>
        </svg>
      </Box>
    </Box>
  );
}
