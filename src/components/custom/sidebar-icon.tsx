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
      <div
        className={cn(
          "absolute left-1 top-1/2 -translate-y-1/2 w-0.75 h-3.5 bg-white rounded-full shadow-sm",
          "transition-all duration-300 ease-in-out",
          isActive && !isCollapsed ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50 pointer-events-none"
        )}
      />

      {Icon && (
        <Icon
          className={cn(
            "h-4 w-4 transition-transform duration-300 ease-in-out relative z-30",
            isActive ? "text-white scale-110" : "text-white/80 group-hover/item:text-white"
          )}
        />
      )}

      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-lg pointer-events-none z-20",
          "transition-all duration-300 ease-in-out",
          isActive && isCollapsed ? "bg-white/20 opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      />
    </div>
  );
};
