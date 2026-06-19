import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Eye, Pencil, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import { clients as seed, products, type Client } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/clients")({
  component: ClientsPage,
  head: () => ({ meta: [{ title: "Clients — CoreWarehousing WMS" }] }),
});

function ClientsPage() {
  const { user } = useAuth();
  const canManage = can(user?.role, "clients.manage");
  const [items, setItems] = useState<Client[]>(seed);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const empty = { name: "", contactPerson: "", email: "", phone: "", address: "", gst: "", notes: "" };
  const [form, setForm] = useState(empty);

  const filtered = useMemo(
    () => items.filter(c => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.contactPerson.toLowerCase().includes(q.toLowerCase())),
    [items, q],
  );

  const stats = (clientId: string) => {
    const owned = products.filter(p => p.clientId === clientId);
    return { products: owned.length, units: owned.reduce((s, p) => s + p.stock, 0) };
  };

  const openCreate = () => { setEditing(null); setForm(empty); setOpen(true); };
  const openEdit = (c: Client) => { setEditing(c); setForm({ ...c, notes: c.notes ?? "" }); setOpen(true); };

  const save = () => {
    if (!form.name || !form.email) { toast.error("Company name and email required"); return; }
    if (editing) {
      setItems(items.map(c => c.id === editing.id ? { ...editing, ...form } : c));
      toast.success("Client updated");
    } else {
      setItems([{ id: `c${Date.now()}`, status: "Active", ...form }, ...items]);
      toast.success("Client added");
    }
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Clients"
        description="Companies that store products in your warehouse."
        actions={canManage && <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Client</Button>}
      />

      <Card className="border-border/60">
        <CardContent className="p-4 sm:p-6">
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search clients…" className="pl-9" />
          </div>

          {filtered.length === 0 ? (
            <div className="grid place-items-center rounded-md border border-dashed border-border py-16 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground"><Building2 className="h-6 w-6" /></div>
              <div className="mt-3 text-sm font-medium">No clients found</div>
              <div className="text-xs text-muted-foreground">Add your first client company.</div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border/60">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client ID</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Products</TableHead>
                    <TableHead className="text-right">Inventory</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(c => {
                    const s = stats(c.id);
                    return (
                      <TableRow key={c.id}>
                        <TableCell className="font-mono text-xs uppercase">{c.id}</TableCell>
                        <TableCell className="font-medium">{c.name}</TableCell>
                        <TableCell>{c.contactPerson}</TableCell>
                        <TableCell className="text-muted-foreground">{c.phone}</TableCell>
                        <TableCell className="text-muted-foreground">{c.email}</TableCell>
                        <TableCell><StatusBadge status={c.status} /></TableCell>
                        <TableCell className="text-right font-medium">{s.products}</TableCell>
                        <TableCell className="text-right font-medium">{s.units.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="ghost" size="icon"><Link to="/clients/$id" params={{ id: c.id }}><Eye className="h-4 w-4" /></Link></Button>
                          {canManage && <Button variant="ghost" size="icon" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit client" : "Add client"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            <div className="grid gap-2 sm:col-span-2"><Label>Company Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Contact Person</Label><Input value={form.contactPerson} onChange={e => setForm({ ...form, contactPerson: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="grid gap-2"><Label>GST Number</Label><Input value={form.gst} onChange={e => setForm({ ...form, gst: e.target.value })} /></div>
            <div className="grid gap-2 sm:col-span-2"><Label>Address</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div className="grid gap-2 sm:col-span-2"><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save changes" : "Add client"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
