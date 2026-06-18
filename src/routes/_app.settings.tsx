import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/app-shell";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/settings")({
  component: SettingsPage,
  head: () => ({ meta: [{ title: "Settings — CoreWarehousing WMS" }] }),
});

function SettingsPage() {
  const { user } = useAuth();
  const save = () => toast.success("Settings saved");

  return (
    <div>
      <PageHeader title="Settings" description="Manage company, warehouse and personal preferences." />
      <Tabs defaultValue="company">
        <TabsList className="mb-4 flex flex-wrap">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="warehouse">Warehouse</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Company information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name" defaultValue="CoreWarehousing Inc." />
              <Field label="Tax ID" defaultValue="US-12-3456789" />
              <Field label="Billing email" defaultValue="billing@corewh.io" />
              <Field label="Phone" defaultValue="+1 555-0100" />
              <Field label="Address" defaultValue="1200 Logistics Way, Dallas TX" className="sm:col-span-2" />
              <div className="sm:col-span-2"><Button onClick={save}>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warehouse">
          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Warehouse information</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <Field label="Warehouse name" defaultValue="Dallas DC-01" />
              <Field label="Capacity (units)" defaultValue="120000" />
              <Field label="Timezone" defaultValue="America/Chicago" />
              <Field label="Address" defaultValue="1200 Logistics Way, Dallas TX" />
              <div className="sm:col-span-2"><Button onClick={save}>Save changes</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">User preferences</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <ToggleRow label="Email notifications" hint="Order, dispatch and low-stock alerts." defaultChecked />
              <ToggleRow label="Weekly summary" hint="Receive a weekly KPI digest every Monday." defaultChecked />
              <ToggleRow label="Auto-reorder suggestions" hint="Suggest reorder when stock drops below threshold." />
              <Field label="Display name" defaultValue={user?.name ?? ""} />
              <Field label="Email" defaultValue={user?.email ?? ""} />
              <Button onClick={save}>Save preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border-border/60">
            <CardHeader><CardTitle className="text-base">Security</CardTitle></CardHeader>
            <CardContent className="grid gap-4 sm:max-w-md">
              <Field label="Current password" type="password" defaultValue="" />
              <Field label="New password" type="password" defaultValue="" />
              <Field label="Confirm new password" type="password" defaultValue="" />
              <ToggleRow label="Two-factor authentication" hint="Require an authenticator code on sign in." />
              <Button onClick={save}>Update security</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, defaultValue, className, type = "text" }: { label: string; defaultValue?: string; className?: string; type?: string }) {
  return (
    <div className={`grid gap-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      <Input defaultValue={defaultValue} type={type} />
    </div>
  );
}

function ToggleRow({ label, hint, defaultChecked }: { label: string; hint?: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md border border-border/60 p-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
