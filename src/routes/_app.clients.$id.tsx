import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone, MapPin, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import {
  clients, products, orders, dispatches, consigneeName,
} from "@/lib/mock-data";

export const Route = createFileRoute("/_app/clients/$id")({
  component: ClientDetail,
  loader: ({ params }) => {
    const client = clients.find(c => c.id === params.id);
    if (!client) throw notFound();
    return { client };
  },
  head: ({ loaderData }) => ({ meta: [{ title: `${loaderData?.client.name ?? "Client"} — CoreWarehousing WMS` }] }),
  notFoundComponent: () => <div className="p-6 text-sm text-muted-foreground">Client not found.</div>,
});

function ClientDetail() {
  const { client } = Route.useLoaderData();
  const owned = products.filter(p => p.clientId === client.id);
  const ownedIds = new Set(owned.map(p => p.id));
  const clientOrders = orders.filter(o => o.clientId === client.id);
  const clientDispatches = dispatches.filter(d => d.clientId === client.id);
  const totalUnits = owned.reduce((s, p) => s + p.stock, 0);

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2"><Link to="/clients"><ArrowLeft className="mr-1 h-4 w-4" /> Back to clients</Link></Button>
      <PageHeader title={client.name} description={`Client ID ${client.id.toUpperCase()}`} actions={<StatusBadge status={client.status} />} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader><CardTitle className="text-base">Company Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row icon={<FileText className="h-4 w-4" />} label="Contact" value={client.contactPerson} />
            <Row icon={<Mail className="h-4 w-4" />} label="Email" value={client.email} />
            <Row icon={<Phone className="h-4 w-4" />} label="Phone" value={client.phone} />
            <Row icon={<MapPin className="h-4 w-4" />} label="Address" value={client.address} />
            <Row icon={<FileText className="h-4 w-4" />} label="GST" value={client.gst} />
            {client.notes && <div className="rounded-md bg-muted/40 p-3 text-xs text-muted-foreground">{client.notes}</div>}
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Products Stored ({owned.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>SKU</TableHead><TableHead>Product</TableHead><TableHead>Category</TableHead><TableHead className="text-right">Stock</TableHead><TableHead>Location</TableHead></TableRow></TableHeader>
              <TableBody>
                {owned.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No products for this client.</TableCell></TableRow>}
                {owned.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.category}</TableCell>
                    <TableCell className="text-right font-medium">{p.stock}</TableCell>
                    <TableCell className="text-muted-foreground">{p.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-border/60 px-4 py-2 text-xs text-muted-foreground">Total inventory units: <span className="font-medium text-foreground">{totalUnits.toLocaleString()}</span></div>
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-3">
          <CardHeader><CardTitle className="text-base">Recent Orders</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Consignee</TableHead><TableHead>Items</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {clientOrders.length === 0 && <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No orders yet.</TableCell></TableRow>}
                {clientOrders.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{consigneeName(o.consigneeId)}</TableCell>
                    <TableCell>{o.items.reduce((s, i) => s + i.qty, 0)}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{o.createdAt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border/60 lg:col-span-3">
          <CardHeader><CardTitle className="text-base">Recent Dispatches</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Dispatch</TableHead><TableHead>Receiving Company</TableHead><TableHead>Vehicle</TableHead><TableHead>Driver</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {clientDispatches.length === 0 && <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">No dispatches yet.</TableCell></TableRow>}
                {clientDispatches.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.id}</TableCell>
                    <TableCell>{d.destinationCompany}</TableCell>
                    <TableCell className="font-mono text-xs">{d.vehicle}</TableCell>
                    <TableCell>{d.driver}</TableCell>
                    <TableCell>{d.date}</TableCell>
                    <TableCell><StatusBadge status={d.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <p className="sr-only">{ownedIds.size} products</p>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-border/60 pb-2 last:border-0 last:pb-0">
      <span className="mt-0.5 text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="text-sm font-medium break-words">{value}</div>
      </div>
    </div>
  );
}
