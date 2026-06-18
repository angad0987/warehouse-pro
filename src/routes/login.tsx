import { useState } from "react";
import { createFileRoute, Link, useNavigate, Navigate } from "@tanstack/react-router";
import { Warehouse, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — CoreWarehousing WMS" }] }),
});

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("demo1234");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error("Enter email and password"); return; }
    setLoading(true);
    try {
      const u = await login(email, password, remember);
      toast.success(`Welcome back, ${u.name}`);
      navigate({ to: "/dashboard" });
    } finally { setLoading(false); }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white/15"><Warehouse className="h-5 w-5" /></div>
          <span className="text-lg font-semibold">CoreWarehousing</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight">Run your warehouse with precision.</h2>
          <p className="mt-3 max-w-md text-primary-foreground/80">
            Real-time inventory, order, and dispatch operations built for modern B2B logistics teams.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
            {[["99.9%", "Uptime"], ["1.2M+", "Units tracked"], ["500+", "Warehouses"]].map(([v, l]) => (
              <div key={l} className="rounded-lg bg-white/10 p-4">
                <div className="text-xl font-bold">{v}</div>
                <div className="text-primary-foreground/70">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} CoreWarehousing Inc.</div>
      </div>

      <div className="flex items-center justify-center bg-background p-6 sm:p-12">
        <Card className="w-full max-w-md border-border/60 shadow-sm">
          <CardContent className="p-8">
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Warehouse className="h-5 w-5" /></div>
              <span className="text-base font-semibold">CoreWarehousing</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">Use <span className="font-medium">admin@demo.com</span> for admin access, any other email for staff.</p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
                </div>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox checked={remember} onCheckedChange={v => setRemember(!!v)} />
                Remember me
              </label>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
