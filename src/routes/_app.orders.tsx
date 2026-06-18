import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import { orders as seed, products, type Order } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "Orders — CoreWarehousing WMS" }] }),
});

function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(seed);
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState<number>(1);
  const [notes, setNotes] = useState("");

  const create = () => {
    if (!client || !productId || qty < 1) { toast.error("Fill all fields"); return; }
    const o: Order = {
      id: `ORD-${1000 + orders.length + 7}`,
      client, items: [{ productId, qty }],
      status: "Pending", createdAt: new Date().toISOString().slice(0, 10), notes,
    };
    setOrders([o, ...orders]);
    setOpen(false); setClient(""); setProductId(""); setQty(1); setNotes("");
    toast.success("Order created");
  };

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Manage B2B sales orders end-to-end."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Create Order</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create order</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2"><Label>Client name</Label><Input value={client} onChange={e => setClient(e.target.value)} placeholder="Acme Corp" /></div>
                <div className="grid gap-2">
                  <Label>Product</Label>
                  <Select value={productId} onValueChange={setProductId}>
                    <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>{products.map(p => <SelectItem key={p.id} value={p.id}>{p.sku} — {p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2"><Label>Quantity</Label><Input type="number" min={1} value={qty} onChange={e => setQty(Number(e.target.value))} /></div>
                <div className="grid gap-2"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={create}>Create order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead><TableHead>Client</TableHead><TableHead>Total Items</TableHead>
                  <TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map(o => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.client}</TableCell>
                    <TableCell>{o.items.reduce((s, i) => s + i.qty, 0)}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{o.createdAt}</TableCell>
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
