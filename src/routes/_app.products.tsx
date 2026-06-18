import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Eye, Pencil, Trash2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import { products as seed, categories, type Product } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/products")({
  component: ProductsPage,
  head: () => ({ meta: [{ title: "Products — CoreWarehousing WMS" }] }),
});

const PAGE_SIZE = 6;

function ProductsPage() {
  const [items, setItems] = useState<Product[]>(seed);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", category: categories[0], description: "" });

  const filtered = useMemo(() => items.filter(p => {
    const matchQ = !q || p.name.toLowerCase().includes(q.toLowerCase()) || p.sku.toLowerCase().includes(q.toLowerCase());
    const matchC = cat === "all" || p.category === cat;
    return matchQ && matchC;
  }), [items, q, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const onAdd = () => {
    if (!form.name || !form.sku) { toast.error("Name and SKU required"); return; }
    const p: Product = {
      id: `p${Date.now()}`, name: form.name, sku: form.sku, category: form.category,
      description: form.description, stock: 0, reorderLevel: 20, location: "—",
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    setItems([p, ...items]);
    setOpen(false);
    setForm({ name: "", sku: "", category: categories[0], description: "" });
    toast.success("Product added");
  };

  const onDelete = (id: string) => {
    setItems(items.filter(p => p.id !== id));
    toast.success("Product deleted");
  };

  return (
    <div>
      <PageHeader
        title="Products"
        description="Manage your product catalog and SKUs."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add product</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2"><Label>Product Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="grid gap-2"><Label>SKU</Label><Input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></div>
                <div className="grid gap-2">
                  <Label>Category</Label>
                  <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2"><Label>Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={onAdd}>Add product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <Card className="border-border/60">
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={e => { setQ(e.target.value); setPage(1); }} placeholder="Search by name or SKU…" className="pl-9" />
            </div>
            <Select value={cat} onValueChange={v => { setCat(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {paged.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="overflow-x-auto rounded-md border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SKU</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map(p => {
                    const low = p.stock < p.reorderLevel;
                    return (
                      <TableRow key={p.id}>
                        <TableCell className="font-mono text-xs">{p.sku}</TableCell>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-muted-foreground">{p.category}</TableCell>
                        <TableCell className="text-right font-medium">{p.stock}</TableCell>
                        <TableCell><StatusBadge status={low ? "Pending" : "Active"} /></TableCell>
                        <TableCell className="text-right">
                          <div className="inline-flex gap-1">
                            <Button asChild variant="ghost" size="icon"><Link to="/products/$id" params={{ id: p.id }}><Eye className="h-4 w-4" /></Link></Button>
                            <Button variant="ghost" size="icon" onClick={() => toast("Edit coming soon")}><Pencil className="h-4 w-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete {p.name}?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => onDelete(p.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <div className="text-xs text-muted-foreground">
              Showing {paged.length} of {filtered.length} products
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
              <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="grid place-items-center rounded-md border border-dashed border-border py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground"><Package className="h-6 w-6" /></div>
      <div className="mt-3 text-sm font-medium">No products found</div>
      <div className="text-xs text-muted-foreground">Try adjusting filters or add a new product.</div>
    </div>
  );
}
