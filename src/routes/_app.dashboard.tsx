import { createFileRoute } from "@tanstack/react-router";
import {
  Package, Boxes, ClipboardList, Truck, AlertTriangle, Users, ArrowDownToLine, ArrowUpFromLine, PackagePlus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import { StatCard } from "@/components/stat-card";
import {
  products, orders, dispatches, movements, staff,
  inventoryMovementSeries, ordersStatusSeries, productName,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — CoreWarehousing WMS" }] }),
});

function Dashboard() {
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const pending = orders.filter(o => o.status === "Pending").length;
  const dispatched = orders.filter(o => o.status === "Dispatched" || o.status === "Delivered").length;
  const lowStock = products.filter(p => p.stock < p.reorderLevel);

  const activities = [
    ...movements.slice(0, 4).map(m => ({
      icon: m.type === "IN" ? ArrowDownToLine : ArrowUpFromLine,
      tone: m.type === "IN" ? "text-success" : "text-warning",
      label: `${m.type === "IN" ? "Stock in" : "Stock out"} — ${productName(m.productId)}`,
      meta: `${m.qty} units · ${m.user} · ${m.date}`,
    })),
    ...orders.slice(0, 2).map(o => ({
      icon: PackagePlus, tone: "text-primary",
      label: `Order ${o.id} created`, meta: `${o.client} · ${o.createdAt}`,
    })),
  ];

  return (
    <div>
      <PageHeader title="Dashboard" description="Real-time overview of your warehouse operations." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Products" value={products.length} icon={Package} tone="primary" />
        <StatCard label="Inventory Units" value={totalUnits.toLocaleString()} icon={Boxes} tone="info" />
        <StatCard label="Pending Orders" value={pending} icon={ClipboardList} tone="warning" />
        <StatCard label="Dispatched" value={dispatched} icon={Truck} tone="success" />
        <StatCard label="Low Stock" value={lowStock.length} icon={AlertTriangle} tone="destructive" />
        <StatCard label="Total Staff" value={staff.length} icon={Users} tone="primary" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Inventory Movement</CardTitle></CardHeader>
          <CardContent className="h-[300px] pl-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={inventoryMovementSeries}>
                <defs>
                  <linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Legend />
                <Area type="monotone" dataKey="stockIn" stroke="var(--color-chart-1)" fill="url(#gIn)" name="Stock In" />
                <Area type="monotone" dataKey="stockOut" stroke="var(--color-chart-4)" fill="url(#gOut)" name="Stock Out" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Orders by Status</CardTitle></CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ordersStatusSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} allowDecimals={false} />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="value" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Recent Orders</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 5).map(o => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.id}</TableCell>
                      <TableCell>{o.client}</TableCell>
                      <TableCell>{o.items.reduce((s, i) => s + i.qty, 0)}</TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                      <TableCell className="text-muted-foreground">{o.createdAt}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Low Stock Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {lowStock.length === 0 && <div className="text-sm text-muted-foreground">All products above reorder level.</div>}
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/30 p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.sku} · {p.location}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-semibold text-destructive">{p.stock}</div>
                  <div className="text-[10px] text-muted-foreground">min {p.reorderLevel}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Recent Stock Movements</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map(m => (
                  <TableRow key={m.id}>
                    <TableCell className="text-muted-foreground">{m.date}</TableCell>
                    <TableCell>{productName(m.productId)}</TableCell>
                    <TableCell><StatusBadge status={m.type === "IN" ? "Active" : "Pending"} /></TableCell>
                    <TableCell className="text-right font-medium">{m.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Recent Activities</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {activities.map((a, i) => {
              const Icon = a.icon;
              return (
                <div key={i} className="flex items-start gap-3 rounded-md p-2 hover:bg-accent/50">
                  <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted ${a.tone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{a.label}</div>
                    <div className="text-xs text-muted-foreground">{a.meta}</div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
