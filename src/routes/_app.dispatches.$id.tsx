import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Building2, Truck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import {
  dispatches, orders, products, clientById, consigneeById, type DispatchStatus,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dispatches/$id")({
  component: DispatchDetail,
  loader: ({ params }) => {
    const dispatch = dispatches.find(d => d.id === params.id);
    if (!dispatch) throw notFound();
    return { dispatch };
  },
  notFoundComponent: () => <div className="p-6 text-sm text-muted-foreground">Dispatch not found.</div>,
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.dispatch.id ?? "Dispatch"} — CoreWarehousing WMS` }] }),
});

const stages: DispatchStatus[] = ["Scheduled", "In Transit", "Delivered"];

function DispatchDetail() {
  const { dispatch } = Route.useLoaderData();
  const { user } = useAuth();
  const canUpdate = can(user?.role, "dispatches.updateStatus");
  const [status, setStatus] = useState<DispatchStatus>(dispatch.status);

  const order = orders.find(o => o.id === dispatch.orderId);
  const client = clientById(dispatch.clientId);
  const consignee = consigneeById(dispatch.consigneeId);
  const currentIdx = stages.indexOf(status);

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2"><Link to="/dispatches"><ArrowLeft className="mr-1 h-4 w-4" /> Back to dispatches</Link></Button>
      <PageHeader
        title={dispatch.id}
        description={`Linked order ${dispatch.orderId} · ${dispatch.date}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusBadge status={status} />
            {canUpdate && (
              <Select value={status} onValueChange={v => { setStatus(v as DispatchStatus); toast.success(`Dispatch marked ${v}`); }}>
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
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Truck className="h-4 w-4" /> Receiving Company</CardTitle></CardHeader>
          <CardContent className="space-y-1 text-sm">
            <div className="text-lg font-semibold">{dispatch.destinationCompany}</div>
            <div className="text-muted-foreground">{consignee?.address}</div>
            <div className="text-muted-foreground">{consignee?.city}</div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Vehicle Details</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Vehicle Number" value={dispatch.vehicle} mono />
            <Row label="Driver" value={dispatch.driver} />
            <Row label="Dispatch Date" value={dispatch.date} />
            {dispatch.notes && <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">{dispatch.notes}</div>}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Products</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead></TableRow></TableHeader>
              <TableBody>
                {!order && <TableRow><TableCell colSpan={3} className="py-6 text-center text-muted-foreground">No linked order.</TableCell></TableRow>}
                {order?.items.map((i, idx) => {
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
          <CardHeader><CardTitle className="text-base">Dispatch Timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="grid gap-3 sm:grid-cols-3">
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", mono && "font-mono text-xs")}>{value}</span>
    </div>
  );
}
