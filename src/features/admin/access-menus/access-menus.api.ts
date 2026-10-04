import { api } from "@/api/axios";
import { unwrap, type ApiResponse } from "@/api/unwrap";

export interface MenuItemAccess {
  id: number;
  name: string;
  icon: string | null;
  link: string | null;
  section: number;
  is_active: boolean;
  granted_roles: string[];
}

export interface AccessMatrixData {
  roles: string[];
  matrix: MenuItemAccess[];
}

export const accessMenusApi = {
  getMatrix: async (): Promise<AccessMatrixData> => {
    const res = await api.get<ApiResponse<AccessMatrixData>>(
      "/admin/access-menus",
    );
    return unwrap(res);
  },

  updateRolePermissions: async (
    role: string,
    menuIds: number[],
  ): Promise<void> => {
    await api.post<ApiResponse<null>>("/admin/access-menus", {
      role,
      menu_ids: menuIds,
    });
  },
};
