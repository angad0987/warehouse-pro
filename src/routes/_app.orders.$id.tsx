import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import { orders, products } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

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

const stages = ["Pending", "Picking", "Packed", "Dispatched", "Delivered"] as const;

function OrderDetail() {
  const { order } = Route.useLoaderData();
  const currentIdx = stages.indexOf(order.status);

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2"><Link to="/orders"><ArrowLeft className="mr-1 h-4 w-4" /> Back to orders</Link></Button>
      <PageHeader
        title={order.id}
        description={`Created ${order.createdAt}`}
        actions={<StatusBadge status={order.status} />}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Client Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="text-lg font-semibold">{order.client}</div>
            <div className="text-muted-foreground">B2B account</div>
            {order.notes && <div className="mt-3 rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">{order.notes}</div>}
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Ordered Products</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Product</TableHead><TableHead className="text-right">Qty</TableHead></TableRow></TableHeader>
              <TableBody>
                {order.items.map((i: { productId: string; qty: number }, idx: number) => {
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

        <Card className="border-border/60 lg:col-span-3">
          <CardHeader><CardTitle className="text-base">Order Timeline</CardTitle></CardHeader>
          <CardContent>
            <ol className="grid gap-3 sm:grid-cols-5">
              {stages.map((s, i) => {
                const done = i <= currentIdx;
                return (
                  <li key={s} className={cn("rounded-md border p-3 text-sm", done ? "border-primary/40 bg-primary/5" : "border-border bg-muted/20")}>
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
