import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/app-shell";
import {
  products, movements, orders, dispatches, clients,
  productName, clientName, consigneeName,
} from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Reports — CoreWarehousing WMS" }] }),
});

function ReportsPage() {
  const [from, setFrom] = useState("2025-06-01");
  const [to, setTo] = useState("2025-06-30");
  const [clientFilter, setClientFilter] = useState("all");
  const [status, setStatus] = useState("all");

  const exportAs = (format: "PDF" | "Excel" | "CSV") => toast.success(`Exported as ${format}`);

  const filtProd = clientFilter === "all" ? products : products.filter(p => p.clientId === clientFilter);
  const filtMov = clientFilter === "all" ? movements : movements.filter(m => m.clientId === clientFilter);
  const filtOrd = (clientFilter === "all" ? orders : orders.filter(o => o.clientId === clientFilter))
    .filter(o => status === "all" || o.status === status);
  const filtDsp = clientFilter === "all" ? dispatches : dispatches.filter(d => d.clientId === clientFilter);

  return (
    <div>
      <PageHeader title="Reports" description="Generate and export operational reports." />

      <Card className="mb-4 border-border/60">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="grid gap-2"><Label>From</Label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
          <div className="grid gap-2"><Label>To</Label><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
          <div className="grid gap-2">
            <Label>Client</Label>
            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All clients</SelectItem>
                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Order Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {["Pending", "Picking", "Packed", "Dispatched", "Delivered"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end gap-2">
            <Button variant="outline" className="flex-1" onClick={() => exportAs("PDF")}><Download className="mr-2 h-4 w-4" />PDF</Button>
            <Button variant="outline" className="flex-1" onClick={() => exportAs("Excel")}>Excel</Button>
            <Button variant="outline" className="flex-1" onClick={() => exportAs("CSV")}>CSV</Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="inventory">
        <TabsList className="mb-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="movement">Stock Movement</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory">
          <ReportCard title="Inventory Report" headers={["SKU", "Product", "Client", "Category", "Stock", "Location"]}
            rows={filtProd.map(p => [p.sku, p.name, clientName(p.clientId), p.category, p.stock, p.location])} />
        </TabsContent>
        <TabsContent value="movement">
          <ReportCard title="Stock Movement Report" headers={["Date", "Client", "Product", "Type", "Qty", "User"]}
            rows={filtMov.map(m => [m.date, clientName(m.clientId), productName(m.productId), m.type, m.qty, m.user])} />
        </TabsContent>
        <TabsContent value="orders">
          <ReportCard title="Orders Report" headers={["Order", "Client", "Consignee", "Items", "Status", "Created"]}
            rows={filtOrd.map(o => [o.id, clientName(o.clientId), consigneeName(o.consigneeId), o.items.reduce((s, i) => s + i.qty, 0), o.status, o.createdAt])} />
        </TabsContent>
        <TabsContent value="dispatch">
          <ReportCard title="Dispatch Report" headers={["Dispatch", "Client", "Destination", "Vehicle", "Driver", "Date", "Status"]}
            rows={filtDsp.map(d => [d.id, clientName(d.clientId), d.destinationCompany, d.vehicle, d.driver, d.date, d.status])} />
        </TabsContent>
      </Tabs>
      <p className="sr-only">Range {from} to {to}</p>
    </div>
  );
}

function ReportCard({ title, headers, rows }: { title: string; headers: string[]; rows: (string | number)[][] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4" /> {title}</CardTitle>
        <span className="text-xs text-muted-foreground">{rows.length} rows</span>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>{headers.map(h => <th key={h} className="px-4 py-2 text-left font-medium text-muted-foreground">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t border-border/60">
                {r.map((c, j) => <td key={j} className="px-4 py-2">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
