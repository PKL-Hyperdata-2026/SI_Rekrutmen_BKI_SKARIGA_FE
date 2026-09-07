import React from 'react';

interface SidebarCutoutProps {
  isActive: boolean;
  isCollapsed: boolean;
}

export const SidebarCutout: React.FC<SidebarCutoutProps> = ({ isActive, isCollapsed }) => {
  if (!isActive || isCollapsed) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none">
      {/* Badan Cutout Tengah */}
      <div
        className="absolute inset-y-0 right-0 left-17 bg-background rounded-l-2xl -mr-px"
      />

      {/* Sudut Lengkung Atas (Vector SVG) */}
      <svg
        viewBox="0 0 20 20"
        className="absolute bottom-full right-0 w-5 h-5 -mb-px -mr-px pointer-events-none"
        aria-hidden="true"
      >
        <path
          d="M20 0 A20 20 0 0 1 0 20 H20 V0 Z"
          fill="var(--background)"
        />
      </svg>

      {/* Sudut Lengkung Bawah (Vector SVG) */}
      <svg
        viewBox="0 0 20 20"
        className="absolute top-full right-0 w-5 h-5 -mt-px -mr-px pointer-events-none"
        aria-hidden="true"
      >
        <path
          d="M0 0 A20 20 0 0 1 20 20 H20 V0 Z"
          fill="var(--background)"
        />
      </svg>
    </div>
  );
};
