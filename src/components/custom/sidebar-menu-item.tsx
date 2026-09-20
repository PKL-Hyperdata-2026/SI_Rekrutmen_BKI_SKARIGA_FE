import React, { type ElementType } from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { SidebarIcon } from './sidebar-icon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface MenuItemData {
  link: string;
  name: string;
  icon?: ElementType;
}

interface SidebarMenuItemProps {
  menu: MenuItemData;
  isActive: boolean;
  isCollapsed: boolean;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  menu,
  isActive,
  isCollapsed,
}) => {
  const { isMobile } = useSidebar();

  const linkElement = (
    <Link
      to={menu.link}
      data-sidebar-active={isActive ? "true" : undefined}
      className={cn(
        "flex items-center w-full h-10 relative transition-colors duration-300 ease-in-out",
        "focus:outline-none focus-visible:outline-none select-none [-webkit-tap-highlight-color:transparent]",
        isActive ? "text-primary font-bold" : "text-white/80 group-hover/item:text-white"
      )}
    >
      <SidebarIcon
        icon={menu.icon}
        isActive={isActive}
        isCollapsed={isCollapsed}
      />

      <div
        className={cn(
          "flex-1 h-full flex items-center pl-6 relative z-30 overflow-hidden whitespace-nowrap",
          "transition-all duration-300 ease-in-out",
          isMobile && isActive ? "bg-white/10 rounded-lg mr-2" : "",
          isCollapsed
            ? "opacity-0 max-w-0 pointer-events-none -translate-x-3"
            : "opacity-100 max-w-48 translate-x-0"
        )}
      >
        <span
          className={cn(
            "text-xs whitespace-nowrap transition-all duration-200",
            isActive
              ? isMobile
                ? "font-bold text-white"
                : "font-bold text-primary"
              : "font-medium text-white/80 group-hover/item:text-white"
          )}
        >
          {menu.name}
        </span>
      </div>
    </Link>
  );

  return (
    <li className="relative w-full overflow-visible list-none group/item">
      {isCollapsed && !isMobile ? (
        <Tooltip>
          <TooltipTrigger asChild>{linkElement}</TooltipTrigger>
          <TooltipContent
            side="right"
            sideOffset={14}
            className="text-xs font-semibold text-white bg-slate-900/95 border-slate-800 shadow-md py-1.5 px-3 rounded-lg"
          >
            {menu.name}
          </TooltipContent>
        </Tooltip>
      ) : (
        linkElement
      )}
    </li>
  );
};
