import { useMemo, useState } from "react";
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
import {
  dispatches as seed, orders, clientName, consigneeById, type Dispatch,
} from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/dispatches")({
  component: DispatchesPage,
  head: () => ({ meta: [{ title: "Dispatches — CoreWarehousing WMS" }] }),
});

const dispatchable = (s: string) => s === "Packed" || s === "Picking" || s === "Pending";

function DispatchesPage() {
  const [list, setList] = useState<Dispatch[]>(seed);
  const [open, setOpen] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const availableOrders = useMemo(() => orders.filter(o => dispatchable(o.status)), []);

  const create = () => {
    if (!orderId || !vehicle || !driver) { toast.error("Order, vehicle and driver required"); return; }
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    const consignee = consigneeById(order.consigneeId);
    const d: Dispatch = {
      id: `DSP-${500 + list.length + 4}`,
      orderId, clientId: order.clientId, consigneeId: order.consigneeId,
      destinationCompany: consignee?.name ?? "—",
      vehicle, driver,
      destination: consignee?.city ?? "—",
      date, status: "Scheduled", notes,
    };
    setList([d, ...list]);
    setOpen(false); setOrderId(""); setVehicle(""); setDriver(""); setNotes("");
    toast.success("Dispatch scheduled");
  };

  return (
    <div>
      <PageHeader
        title="Dispatches"
        description="Outbound shipments — product owner to receiving company."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> Create Dispatch</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create dispatch</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2">
                <div className="grid gap-2">
                  <Label>Order</Label>
                  <Select value={orderId} onValueChange={setOrderId}>
                    <SelectTrigger><SelectValue placeholder="Select order" /></SelectTrigger>
                    <SelectContent>{availableOrders.map(o => <SelectItem key={o.id} value={o.id}>{o.id} — {clientName(o.clientId)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2"><Label>Vehicle number</Label><Input value={vehicle} onChange={e => setVehicle(e.target.value)} placeholder="TX-44-AB-1234" /></div>
                <div className="grid gap-2"><Label>Driver name</Label><Input value={driver} onChange={e => setDriver(e.target.value)} /></div>
                <div className="grid gap-2"><Label>Dispatch date</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} /></div>
                <div className="grid gap-2"><Label>Notes</Label><Textarea value={notes} onChange={e => setNotes(e.target.value)} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={create}>Schedule dispatch</Button>
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
                  <TableHead>Dispatch ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Destination Company</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.map(d => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.id}</TableCell>
                    <TableCell>{clientName(d.clientId)}</TableCell>
                    <TableCell>{d.destinationCompany}</TableCell>
                    <TableCell className="font-mono text-xs">{d.vehicle}</TableCell>
                    <TableCell>{d.driver}</TableCell>
                    <TableCell>{d.date}</TableCell>
                    <TableCell><StatusBadge status={d.status} /></TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="ghost" size="icon"><Link to="/dispatches/$id" params={{ id: d.id }}><Eye className="h-4 w-4" /></Link></Button>
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
