// shared/group-permissions.ts
import { GroupRoleEnum } from "@/entities/Group";

export const GroupPermissions = {
  canRemoveMember: (
    role: GroupRoleEnum,
    targetRole: GroupRoleEnum,
  ): boolean => {
    if (role === "OWNER") return true;
    if (role === "ADMIN") return targetRole === "MEMBER"; // ADMIN no puede remover OWNER ni otro ADMIN
    return false;
  },

  canRenameGroup: (role: GroupRoleEnum): boolean => {
    return role === "OWNER";
  },

  canAddMember: (role: GroupRoleEnum): boolean => {
    return role === "OWNER" || role === "ADMIN";
  },

  canPromoteToAdmin: (role: GroupRoleEnum): boolean => {
    return role === "OWNER";
  },

  canDeleteGroup: (role: GroupRoleEnum): boolean => {
    return role === "OWNER";
  },
} as const;
