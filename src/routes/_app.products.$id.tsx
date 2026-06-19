import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import {
  products, movements, orders, clientById, consigneeName,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/products/$id")({
  component: ProductDetail,
  loader: ({ params }) => {
    const product = products.find(p => p.id === params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.product.name ?? "Product"} — CoreWarehousing WMS` }] }),
  notFoundComponent: () => <div className="p-6 text-sm text-muted-foreground">Product not found.</div>,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();
  const client = clientById(product.clientId);
  const history = movements.filter(m => m.productId === product.id);
  const related = orders.filter(o => o.items.some(i => i.productId === product.id));

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2"><Link to="/products"><ArrowLeft className="mr-1 h-4 w-4" /> Back to products</Link></Button>
      <PageHeader title={product.name} description={`SKU ${product.sku} · ${product.category}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Product Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="SKU" value={product.sku} />
            <Row label="Category" value={product.category} />
            <Row label="Stock" value={product.stock.toString()} />
            <Row label="Reorder level" value={product.reorderLevel.toString()} />
            <Row label="Location" value={product.location} />
            <Row label="Last updated" value={product.updatedAt} />
            <div>
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Description</div>
              <div className="mt-1">{product.description}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Client (Owner)</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {client ? (
              <>
                <div className="text-lg font-semibold">{client.name}</div>
                <div className="text-muted-foreground">{client.contactPerson}</div>
                <div className="text-muted-foreground">{client.email}</div>
                <div className="text-muted-foreground">{client.phone}</div>
                <Button asChild variant="outline" size="sm" className="mt-3">
                  <Link to="/clients/$id" params={{ id: client.id }}>View client</Link>
                </Button>
              </>
            ) : <div className="text-muted-foreground">No client assigned.</div>}
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Inventory History</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Date</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Qty</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {history.length === 0 && <TableRow><TableCell colSpan={3} className="py-8 text-center text-muted-foreground">No movements yet.</TableCell></TableRow>}
                {history.map(m => (
                  <TableRow key={m.id}>
                    <TableCell>{m.date}</TableCell>
                    <TableCell><StatusBadge status={m.type === "IN" ? "Active" : "Pending"} /></TableCell>
                    <TableCell className="text-right font-medium">{m.qty}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-3">
          <CardHeader><CardTitle className="text-base">Orders Related To This Product</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow><TableHead>Order</TableHead><TableHead>Consignee</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Qty</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {related.length === 0 && <TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No related orders.</TableCell></TableRow>}
                {related.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{consigneeName(o.consigneeId)}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell className="text-right">{o.items.find(i => i.productId === product.id)?.qty ?? 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
