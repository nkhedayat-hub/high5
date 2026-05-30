export const permissions = [
  "members.read", "members.create", "members.update", "members.delete",
  "plans.read", "plans.create", "plans.update", "payments.read", "payments.create",
  "attendance.read", "attendance.create", "reports.read", "trainers.read", "trainers.update",
  "products.read", "products.create", "inventory.read", "inventory.update", "website.manage",
  "loyalty.manage", "users.manage", "settings.manage"
] as const;
export type Permission = typeof permissions[number];
export const rolePermissionMap: Record<string, Permission[]> = {
  SUPER_ADMIN: [...permissions],
  ADMIN_MANAGER: permissions.filter((p) => !["members.delete"].includes(p)),
  RECEPTION_SALES: ["members.read", "members.create", "members.update", "plans.read", "payments.read", "payments.create", "attendance.read", "attendance.create", "reports.read"],
  TRAINER: ["attendance.read", "trainers.read", "reports.read", "members.read"],
  MEMBER_CUSTOMER: []
};
export function hasPermission(roleName?: string, permission?: Permission) {
  if (!roleName || !permission) return false;
  return rolePermissionMap[roleName]?.includes(permission) ?? false;
}
export function isAdminRole(roleName?: string) {
  return ["SUPER_ADMIN", "ADMIN_MANAGER", "RECEPTION_SALES"].includes(roleName ?? "");
}
