import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import { products as seedProducts, movements as seedMovements, productName, type Movement, type Product } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/inventory")({
  component: InventoryPage,
  head: () => ({ meta: [{ title: "Inventory — CoreWarehousing WMS" }] }),
});

function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [movements, setMovements] = useState<Movement[]>(seedMovements);

  const move = (type: "IN" | "OUT", productId: string, qty: number, notes?: string) => {
    if (!productId || qty <= 0) { toast.error("Pick a product and positive qty"); return false; }
    setProducts(prev => prev.map(p => p.id === productId
      ? { ...p, stock: type === "IN" ? p.stock + qty : Math.max(0, p.stock - qty), updatedAt: new Date().toISOString().slice(0, 10) }
      : p));
    setMovements(prev => [{
      id: `m${Date.now()}`, date: new Date().toISOString().slice(0, 10),
      productId, type, qty, user: "You", notes,
    }, ...prev]);
    toast.success(`Stock ${type === "IN" ? "in" : "out"} recorded`);
    return true;
  };

  return (
    <div>
      <PageHeader title="Inventory" description="Track on-hand stock and movement history." />
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="in">Stock In</TabsTrigger>
          <TabsTrigger value="out">Stock Out</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Available</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map(p => {
                      const low = p.stock < p.reorderLevel;
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell className={`text-right font-semibold ${low ? "text-destructive" : ""}`}>{p.stock}</TableCell>
                          <TableCell className="text-muted-foreground">{p.location}</TableCell>
                          <TableCell className="text-muted-foreground">{p.updatedAt}</TableCell>
                          <TableCell><StatusBadge status={low ? "Pending" : "Active"} /></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="in"><MovementForm type="IN" products={products} onSubmit={move} /></TabsContent>
        <TabsContent value="out"><MovementForm type="OUT" products={products} onSubmit={move} /></TabsContent>

        <TabsContent value="history">
          <Card className="border-border/60">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead><TableHead>Product</TableHead><TableHead>Type</TableHead>
                    <TableHead className="text-right">Qty</TableHead><TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.map(m => (
                    <TableRow key={m.id}>
                      <TableCell className="text-muted-foreground">{m.date}</TableCell>
                      <TableCell>{productName(m.productId)}</TableCell>
                      <TableCell><StatusBadge status={m.type === "IN" ? "Active" : "Pending"} /></TableCell>
                      <TableCell className="text-right font-medium">{m.qty}</TableCell>
                      <TableCell className="text-muted-foreground">{m.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MovementForm({
  type, products, onSubmit,
}: {
  type: "IN" | "OUT";
  products: Product[];
  onSubmit: (t: "IN" | "OUT", productId: string, qty: number, notes?: string) => boolean;
}) {
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState<number>(0);
  const [notes, setNotes] = useState("");

  const submit = () => {
    if (onSubmit(type, productId, Number(qty), notes)) {
      setProductId(""); setQty(0); setNotes("");
    }
  };

  const Icon = type === "IN" ? ArrowDownToLine : ArrowUpFromLine;
  return (
    <Card className="max-w-xl border-border/60">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4" /> {type === "IN" ? "Receive stock" : "Issue stock"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label>Product</Label>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
            <SelectContent>
              {products.map(p => <SelectItem key={p.id} value={p.id}>{p.sku} — {p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2"><Label>Quantity</Label><Input type="number" min={1} value={qty || ""} onChange={e => setQty(Number(e.target.value))} /></div>
        <div className="grid gap-2"><Label>Notes (optional)</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Reference, supplier or reason…" /></div>
        <Button onClick={submit}>{type === "IN" ? "Record stock in" : "Record stock out"}</Button>
      </CardContent>
    </Card>
  );
}
