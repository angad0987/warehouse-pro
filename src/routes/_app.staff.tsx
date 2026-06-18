import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Pencil, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { PageHeader, StatusBadge } from "@/components/layout/app-shell";
import { staff as seed, type StaffMember, type Role } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/staff")({
  component: StaffPage,
  head: () => ({ meta: [{ title: "Staff — CoreWarehousing WMS" }] }),
});

function StaffPage() {
  const [list, setList] = useState<StaffMember[]>(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "staff" as Role });

  const openCreate = () => { setEditing(null); setForm({ name: "", email: "", phone: "", role: "staff" }); setOpen(true); };
  const openEdit = (s: StaffMember) => { setEditing(s); setForm({ name: s.name, email: s.email, phone: s.phone, role: s.role }); setOpen(true); };

  const save = () => {
    if (!form.name || !form.email) { toast.error("Name and email required"); return; }
    if (editing) {
      setList(list.map(s => s.id === editing.id ? { ...s, ...form } : s));
      toast.success("Staff updated");
    } else {
      setList([{ id: `s${Date.now()}`, ...form, status: "Active" }, ...list]);
      toast.success("Staff added");
    }
    setOpen(false);
  };

  const toggle = (id: string) => setList(list.map(s => s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s));

  return (
    <div>
      <PageHeader
        title="Staff Management"
        description="Invite warehouse staff and manage roles."
        actions={<Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Staff</Button>}
      />
      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="text-muted-foreground">{s.email}</TableCell>
                    <TableCell>{s.phone}</TableCell>
                    <TableCell className="capitalize">{s.role}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(s)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => toggle(s.id)} className={s.status === "Active" ? "text-destructive" : "text-success"}>
                        <Power className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit staff" : "Add staff"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="grid gap-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={v => setForm({ ...form, role: v as Role })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Warehouse Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save changes" : "Add staff"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
