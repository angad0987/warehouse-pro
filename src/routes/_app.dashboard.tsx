import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package, Boxes, ClipboardList, Truck, Users, Building2, AlertTriangle,
  PackageCheck, PackageOpen, Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, Legend,
} from "recharts";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import { StatCard } from "@/components/stat-card";
import {
  products, orders, movements, staff, clients,
  inventoryMovementSeries, ordersStatusSeries,
  clientName, consigneeName, productName,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — CoreWarehousing WMS" }] }),
});

function Dashboard() {
  const { user } = useAuth();
  return user?.role === "staff" ? <StaffDashboard /> : <AdminDashboard />;
}

function AdminDashboard() {
  const totalUnits = products.reduce((s, p) => s + p.stock, 0);
  const pending = orders.filter(o => o.status === "Pending").length;
  const dispatched = orders.filter(o => o.status === "Dispatched" || o.status === "Delivered").length;
  const lowStock = products.filter(p => p.stock < p.reorderLevel);

  return (
    <div>
      <PageHeader title="Dashboard" description="Real-time overview of warehouse operations." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total Clients" value={clients.length} icon={Building2} tone="primary" />
        <StatCard label="Total Products" value={products.length} icon={Package} tone="info" />
        <StatCard label="Inventory Units" value={totalUnits.toLocaleString()} icon={Boxes} tone="info" />
        <StatCard label="Pending Orders" value={pending} icon={ClipboardList} tone="warning" />
        <StatCard label="Dispatched Orders" value={dispatched} icon={Truck} tone="success" />
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
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.slice(0, 5).map(o => (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.id}</TableCell>
                      <TableCell>{clientName(o.clientId)}</TableCell>
                      <TableCell>{consigneeName(o.consigneeId)}</TableCell>
                      <TableCell><StatusBadge status={o.status} /></TableCell>
                      <TableCell className="text-right">
                        <Button asChild variant="ghost" size="icon"><Link to="/orders/$id" params={{ id: o.id }}><Eye className="h-4 w-4" /></Link></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-4 w-4 text-destructive" /> Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lowStock.length === 0 && <div className="text-sm text-muted-foreground">All products above reorder level.</div>}
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/30 p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{clientName(p.clientId)} · {p.sku}</div>
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
          <CardHeader><CardTitle className="text-base">Recent Inventory Movements</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.slice(0, 6).map(m => (
                  <TableRow key={m.id}>
                    <TableCell>{clientName(m.clientId)}</TableCell>
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
          <CardHeader><CardTitle className="text-base">Top Clients By Inventory</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {clients
              .map(c => ({ c, units: products.filter(p => p.clientId === c.id).reduce((s, p) => s + p.stock, 0) }))
              .sort((a, b) => b.units - a.units)
              .slice(0, 5)
              .map(({ c, units }) => (
                <div key={c.id} className="flex items-center justify-between gap-3 rounded-md border border-border/60 p-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.contactPerson}</div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-semibold">{units.toLocaleString()}</div>
                    <div className="text-[10px] text-muted-foreground">units</div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StaffDashboard() {
  const pending = orders.filter(o => o.status === "Pending");
  const toPick = orders.filter(o => o.status === "Picking");
  const toPack = orders.filter(o => o.status === "Packed");
  const toDispatch = orders.filter(o => o.status === "Dispatched");
  const tasks = [...pending, ...toPick, ...toPack];

  return (
    <div>
      <PageHeader title="My Workspace" description="Today's operational tasks across the warehouse floor." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Pending Orders" value={pending.length} icon={ClipboardList} tone="warning" />
        <StatCard label="Orders To Pick" value={toPick.length} icon={PackageOpen} tone="info" />
        <StatCard label="Orders To Pack" value={toPack.length} icon={PackageCheck} tone="info" />
        <StatCard label="Orders To Dispatch" value={toDispatch.length} icon={Truck} tone="primary" />
      </div>

      <Card className="mt-6 border-border/60">
        <CardHeader><CardTitle className="text-base">My Tasks</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead className="text-right">Products</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Open</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No tasks. You're all caught up.</TableCell></TableRow>}
                {tasks.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{clientName(o.clientId)}</TableCell>
                    <TableCell>{consigneeName(o.consigneeId)}</TableCell>
                    <TableCell className="text-right">{o.items.reduce((s, i) => s + i.qty, 0)}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon"><Link to="/orders/$id" params={{ id: o.id }}><Eye className="h-4 w-4" /></Link></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
