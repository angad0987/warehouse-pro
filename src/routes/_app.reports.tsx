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
import { products, movements, orders, dispatches, productName } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsPage,
  head: () => ({ meta: [{ title: "Reports — CoreWarehousing WMS" }] }),
});

function ReportsPage() {
  const [from, setFrom] = useState("2025-06-01");
  const [to, setTo] = useState("2025-06-30");
  const [product, setProduct] = useState("all");
  const [status, setStatus] = useState("all");

  const exportAs = (format: "PDF" | "Excel" | "CSV") => toast.success(`Exported as ${format}`);

  return (
    <div>
      <PageHeader title="Reports" description="Generate and export operational reports." />

      <Card className="mb-4 border-border/60">
        <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="grid gap-2"><Label>From</Label><Input type="date" value={from} onChange={e => setFrom(e.target.value)} /></div>
          <div className="grid gap-2"><Label>To</Label><Input type="date" value={to} onChange={e => setTo(e.target.value)} /></div>
          <div className="grid gap-2">
            <Label>Product</Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All products</SelectItem>
                {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {["Pending", "Dispatched", "Delivered"].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
          <ReportCard title="Inventory Report" rows={products.map(p => [p.sku, p.name, p.category, p.stock, p.location])} headers={["SKU", "Product", "Category", "Stock", "Location"]} />
        </TabsContent>
        <TabsContent value="movement">
          <ReportCard title="Stock Movement Report" rows={movements.map(m => [m.date, productName(m.productId), m.type, m.qty, m.user])} headers={["Date", "Product", "Type", "Qty", "User"]} />
        </TabsContent>
        <TabsContent value="orders">
          <ReportCard title="Orders Report" rows={orders.map(o => [o.id, o.client, o.items.reduce((s, i) => s + i.qty, 0), o.status, o.createdAt])} headers={["Order", "Client", "Items", "Status", "Created"]} />
        </TabsContent>
        <TabsContent value="dispatch">
          <ReportCard title="Dispatch Report" rows={dispatches.map(d => [d.id, d.orderId, d.vehicle, d.driver, d.date, d.status])} headers={["Dispatch", "Order", "Vehicle", "Driver", "Date", "Status"]} />
        </TabsContent>
      </Tabs>
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
