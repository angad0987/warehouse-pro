import type { Role } from "./mock-data";

export type Permission =
  | "dashboard.view"
  | "clients.view" | "clients.manage"
  | "products.view" | "products.manage" | "products.delete"
  | "inventory.view" | "inventory.stockIn" | "inventory.stockOut" | "inventory.manage"
  | "orders.view" | "orders.create" | "orders.edit" | "orders.delete" | "orders.updateStatus"
  | "dispatches.view" | "dispatches.create" | "dispatches.updateStatus" | "dispatches.manage"
  | "reports.view"
  | "staff.manage"
  | "settings.view" | "settings.manage";

const PERMS: Record<Role, Set<Permission | "*">> = {
  admin: new Set<Permission | "*">(["*"]),
  staff: new Set<Permission | "*">([
    "dashboard.view",
    "clients.view",
    "products.view",
    "inventory.view", "inventory.stockIn", "inventory.stockOut",
    "orders.view", "orders.create", "orders.updateStatus",
    "dispatches.view", "dispatches.create", "dispatches.updateStatus",
    "settings.view",
  ]),
};

export function can(role: Role | undefined, perm: Permission): boolean {
  if (!role) return false;
  const set = PERMS[role];
  return set.has("*") || set.has(perm);
}
