// entities/Group.ts
export const GroupRole = ["OWNER", "ADMIN", "MEMBER"] as const;
export type GroupRoleEnum = (typeof GroupRole)[number];

export type Group = {
  id: string;
  owner: string;
  groupName: string;
  createdAt: string;
  updatedAt: string;
};

export type GroupMember = {
  group_id: string;
  member_id: string;
  role: GroupRoleEnum;
  createdAt: string;
  updatedAt: string;
  userName?: string | null;
  userEmail?: string | null;
};
