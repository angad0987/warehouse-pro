import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Building2, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import {
  orders, products, clientById, consigneeById, type OrderStatus,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/orders/$id")({
  component: OrderDetail,
  loader: ({ params }) => {
    const order = orders.find(o => o.id === params.id);
    if (!order) throw notFound();
    return { order };
  },
  notFoundComponent: () => <div className="p-6 text-sm text-muted-foreground">Order not found.</div>,
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.order.id ?? "Order"} — CoreWarehousing WMS` }] }),
});

const stages: OrderStatus[] = ["Pending", "Picking", "Packed", "Dispatched", "Delivered"];

function OrderDetail() {
  const { order: initial } = Route.useLoaderData();
  const { user } = useAuth();
  const canUpdate = can(user?.role, "orders.updateStatus");
  const [status, setStatus] = useState<OrderStatus>(initial.status);
  const client = clientById(initial.clientId);
  const consignee = consigneeById(initial.consigneeId);
  const currentIdx = stages.indexOf(status);

  const updateStatus = (v: string) => {
    setStatus(v as OrderStatus);
    toast.success(`Order marked ${v}`);
  };

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2"><Link to="/orders"><ArrowLeft className="mr-1 h-4 w-4" /> Back to orders</Link></Button>
      <PageHeader
        title={initial.id}
        description={`Created ${initial.createdAt}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            {canUpdate && (
              <Select value={status} onValueChange={updateStatus}>
                <SelectTrigger className="h-9 w-40"><SelectValue /></SelectTrigger>
                <SelectContent>{stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
            )}
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4" /> Client (Product Owner)</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="text-lg font-semibold">{client?.name}</div>
            <div className="text-muted-foreground">{client?.contactPerson} · {client?.phone}</div>
            <div className="text-muted-foreground">{client?.address}</div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Truck className="h-4 w-4" /> Destination (Consignee)</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="text-lg font-semibold">{consignee?.name}</div>
            <div className="text-muted-foreground">{initial.deliveryAddress}</div>
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Ordered Products</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead></TableRow></TableHeader>
              <TableBody>
                {initial.items.map((i, idx) => {
                  const p = products.find(x => x.id === i.productId);
                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-mono text-xs">{p?.sku}</TableCell>
                      <TableCell>{p?.name}</TableCell>
                      <TableCell className="text-right font-medium">{i.qty}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Order Timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="grid gap-3 sm:grid-cols-5">
              {stages.map((s, i) => {
                const done = i <= currentIdx;
                const active = i === currentIdx;
                return (
                  <li key={s} className={cn(
                    "rounded-md border p-3 text-sm",
                    done ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20",
                    active && "ring-2 ring-primary/40",
                  )}>
                    <div className="flex items-center gap-2">
                      <div className={cn("grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold", done ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                        {done ? <Check className="h-3 w-3" /> : i + 1}
                      </div>
                      <span className={cn("font-medium", done ? "text-primary" : "text-muted-foreground")}>{s}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
            {initial.notes && <div className="mt-4 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">{initial.notes}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
