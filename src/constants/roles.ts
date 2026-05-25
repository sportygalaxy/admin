export const USER_ROLE = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",
  STAFF: "STAFF",
  USER: "USER",
} as const;

export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

export const SUPER_ADMIN_EMAIL = "erons.a.gberaese@gmail.com";

export const ADMIN_ACCESS_ROLES: UserRole[] = [
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.ADMIN,
  USER_ROLE.STAFF,
];

export const ROLE_MANAGEMENT_ACCESS_ROLES: UserRole[] = [
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.ADMIN,
];

export const TEAM_ROLES: UserRole[] = [
  USER_ROLE.SUPER_ADMIN,
  USER_ROLE.ADMIN,
  USER_ROLE.STAFF,
];

export const ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLE.SUPER_ADMIN]: "Developer",
  [USER_ROLE.ADMIN]: "Admin",
  [USER_ROLE.STAFF]: "Staff",
  [USER_ROLE.USER]: "User",
};

export const isAdminRole = (role?: string | null): role is UserRole =>
  !!role && ADMIN_ACCESS_ROLES.includes(role as UserRole);
