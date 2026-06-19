import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Package, Boxes, ClipboardList, Truck,
  BarChart3, Users, Settings as SettingsIcon, Warehouse, Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { can, type Permission } from "@/lib/rbac";

const nav: { to: string; label: string; icon: typeof LayoutDashboard; perm: Permission }[] = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, perm: "dashboard.view" },
  { to: "/clients", label: "Clients", icon: Building2, perm: "clients.view" },
  { to: "/products", label: "Products", icon: Package, perm: "products.view" },
  { to: "/inventory", label: "Inventory", icon: Boxes, perm: "inventory.view" },
  { to: "/orders", label: "Orders", icon: ClipboardList, perm: "orders.view" },
  { to: "/dispatches", label: "Dispatches", icon: Truck, perm: "dispatches.view" },
  { to: "/reports", label: "Reports", icon: BarChart3, perm: "reports.view" },
  { to: "/staff", label: "Staff Management", icon: Users, perm: "staff.manage" },
  { to: "/settings", label: "Settings", icon: SettingsIcon, perm: "settings.view" },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const pathname = useRouterState({ select: s => s.location.pathname });
  const role = user?.role ?? "staff";

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Warehouse className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">CoreWarehousing</div>
          <div className="truncate text-xs text-muted-foreground">WMS Platform</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {nav.filter(i => can(role, i.perm)).map(item => {
            const active = pathname === item.to || pathname.startsWith(item.to + "/");
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-sidebar-border p-4 text-xs text-muted-foreground">
        v1.0 · {new Date().getFullYear()}
      </div>
    </div>
  );
}
