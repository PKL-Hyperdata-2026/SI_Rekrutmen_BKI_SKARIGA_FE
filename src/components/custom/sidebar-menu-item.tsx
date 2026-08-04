import React, { type ElementType } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarCutout } from './sidebar-cutout';
import { SidebarIcon } from './sidebar-icon';

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
  return (
    <li className="relative w-full overflow-visible list-none group">
      <Link
        to={menu.link}
        className={cn(
          "flex items-center w-full h-11 relative transition-colors duration-200",
          "focus:outline-none focus-visible:outline-none select-none [-webkit-tap-highlight-color:transparent]",
          isActive ? "text-primary font-bold" : "text-white/80 hover:text-white"
        )}
      >
        <SidebarCutout isActive={isActive} isCollapsed={isCollapsed} />

        <SidebarIcon
          icon={menu.icon}
          isActive={isActive}
          isCollapsed={isCollapsed}
        />

        {!isCollapsed && (
          <div className="flex-1 h-full flex items-center pl-7 relative z-30 transition-opacity duration-200">
            <span className="text-[13px] font-semibold whitespace-nowrap">
              {menu.name}
            </span>
          </div>
        )}
      </Link>
    </li>
  );
};
