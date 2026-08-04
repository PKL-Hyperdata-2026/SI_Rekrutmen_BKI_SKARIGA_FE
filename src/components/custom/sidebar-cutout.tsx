import React from 'react';

interface SidebarCutoutProps {
  isActive: boolean;
  isCollapsed: boolean;
}

export const SidebarCutout: React.FC<SidebarCutoutProps> = ({ isActive, isCollapsed }) => {
  if (!isActive || isCollapsed) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 select-none">
      <div
        className="absolute inset-y-0 right-0 left-17 bg-background rounded-l-2xl -mr-px"
        style={{ transform: 'translateZ(0)' }}
      />

      <div
        className="absolute -top-4.25 -right-0.5 w-5 h-5"
        style={{
          background: 'var(--background)',
          maskImage: 'radial-gradient(circle at 0 0, transparent 20px, black 20px)',
          WebkitMaskImage: 'radial-gradient(circle at 0 0, transparent 20px, black 20px)',
          transform: 'translateZ(0)',
        }}
      />

      <div
        className="absolute -bottom-4.25 -right-0.5 w-5 h-5"
        style={{
          background: 'var(--background)',
          maskImage: 'radial-gradient(circle at 0 100%, transparent 20px, black 20px)',
          WebkitMaskImage: 'radial-gradient(circle at 0 100%, transparent 20px, black 20px)',
          transform: 'translateZ(0)',
        }}
      />
    </div>
  );
};
