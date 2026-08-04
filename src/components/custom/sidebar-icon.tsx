import React, { type ElementType } from 'react';
import { cn } from '@/lib/utils';

interface SidebarIconProps {
  icon?: ElementType;
  isActive: boolean;
  isCollapsed: boolean;
}

export const SidebarIcon: React.FC<SidebarIconProps> = ({
  icon: Icon,
  isActive,
  isCollapsed,
}) => {
  return (
    <div className="w-14 h-full flex justify-center items-center shrink-0 relative z-30">
      {isActive && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-0.75 h-4 bg-white rounded-full shadow-sm" />
      )}

      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 transition-transform duration-200 relative z-30",
            isActive ? "text-white scale-110" : "text-white/80 group-hover:text-white"
          )}
        />)}

      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-lg pointer-events-none z-20",
          "transition-all duration-200 ease-in-out",
          isActive && isCollapsed ? "bg-white/20 opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      />
    </div>
  );
};
