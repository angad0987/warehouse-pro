// Mock data layer for CoreWarehousing WMS
export type Role = "admin" | "staff";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  stock: number;
  reorderLevel: number;
  location: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  client: string;
  items: { productId: string; qty: number }[];
  status: "Pending" | "Picking" | "Packed" | "Dispatched" | "Delivered";
  createdAt: string;
  notes?: string;
};

export type Dispatch = {
  id: string;
  orderId: string;
  vehicle: string;
  driver: string;
  destination: string;
  date: string;
  status: "Scheduled" | "In Transit" | "Delivered";
  notes?: string;
};

export type Movement = {
  id: string;
  date: string;
  productId: string;
  type: "IN" | "OUT";
  qty: number;
  user: string;
  notes?: string;
};

export type StaffMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: "Active" | "Inactive";
};

export const categories = ["Electronics", "Apparel", "Food & Beverage", "Industrial", "Home Goods"];

export const products: Product[] = [
  { id: "p1", sku: "ELC-001", name: "Wireless Headphones", category: "Electronics", description: "Noise-cancelling over-ear headphones.", stock: 248, reorderLevel: 50, location: "A-12-3", updatedAt: "2025-06-15" },
  { id: "p2", sku: "ELC-002", name: "USB-C Hub 7-in-1", category: "Electronics", description: "Multiport adapter for laptops.", stock: 18, reorderLevel: 40, location: "A-12-4", updatedAt: "2025-06-14" },
  { id: "p3", sku: "APP-101", name: "Cotton T-Shirt (M)", category: "Apparel", description: "100% cotton crew neck.", stock: 1240, reorderLevel: 200, location: "B-04-1", updatedAt: "2025-06-16" },
  { id: "p4", sku: "APP-102", name: "Denim Jeans (32)", category: "Apparel", description: "Slim fit denim jeans.", stock: 92, reorderLevel: 100, location: "B-04-2", updatedAt: "2025-06-13" },
  { id: "p5", sku: "FNB-201", name: "Organic Coffee 1kg", category: "Food & Beverage", description: "Arabica whole beans.", stock: 360, reorderLevel: 80, location: "C-02-1", updatedAt: "2025-06-17" },
  { id: "p6", sku: "FNB-202", name: "Green Tea 500g", category: "Food & Beverage", description: "Premium loose leaf.", stock: 12, reorderLevel: 30, location: "C-02-2", updatedAt: "2025-06-12" },
  { id: "p7", sku: "IND-301", name: "Steel Bearings Pack", category: "Industrial", description: "10x precision bearings.", stock: 540, reorderLevel: 120, location: "D-08-3", updatedAt: "2025-06-16" },
  { id: "p8", sku: "HMG-401", name: "Ceramic Mug Set", category: "Home Goods", description: "Set of 4 ceramic mugs.", stock: 28, reorderLevel: 60, location: "E-01-1", updatedAt: "2025-06-15" },
];

export const orders: Order[] = [
  { id: "ORD-1001", client: "Acme Corp", items: [{ productId: "p1", qty: 20 }, { productId: "p3", qty: 50 }], status: "Pending", createdAt: "2025-06-17" },
  { id: "ORD-1002", client: "Globex Retail", items: [{ productId: "p5", qty: 30 }], status: "Picking", createdAt: "2025-06-17" },
  { id: "ORD-1003", client: "Initech Stores", items: [{ productId: "p7", qty: 100 }], status: "Packed", createdAt: "2025-06-16" },
  { id: "ORD-1004", client: "Umbrella Co", items: [{ productId: "p2", qty: 10 }, { productId: "p8", qty: 12 }], status: "Dispatched", createdAt: "2025-06-15" },
  { id: "ORD-1005", client: "Wayne Industries", items: [{ productId: "p4", qty: 25 }], status: "Delivered", createdAt: "2025-06-14" },
  { id: "ORD-1006", client: "Stark Trading", items: [{ productId: "p1", qty: 15 }], status: "Pending", createdAt: "2025-06-18" },
];

export const dispatches: Dispatch[] = [
  { id: "DSP-501", orderId: "ORD-1004", vehicle: "TX-44-AB-1234", driver: "John Carter", destination: "Dallas, TX", date: "2025-06-15", status: "Delivered" },
  { id: "DSP-502", orderId: "ORD-1003", vehicle: "CA-12-XY-9090", driver: "Maria Lopez", destination: "Los Angeles, CA", date: "2025-06-17", status: "In Transit" },
  { id: "DSP-503", orderId: "ORD-1002", vehicle: "NY-08-MN-3344", driver: "Ravi Shankar", destination: "New York, NY", date: "2025-06-18", status: "Scheduled" },
];

export const movements: Movement[] = [
  { id: "m1", date: "2025-06-17", productId: "p1", type: "IN", qty: 100, user: "Sarah Lin" },
  { id: "m2", date: "2025-06-17", productId: "p3", type: "OUT", qty: 50, user: "Mike Owens" },
  { id: "m3", date: "2025-06-16", productId: "p5", type: "IN", qty: 200, user: "Sarah Lin" },
  { id: "m4", date: "2025-06-16", productId: "p7", type: "OUT", qty: 100, user: "Mike Owens" },
  { id: "m5", date: "2025-06-15", productId: "p2", type: "OUT", qty: 10, user: "Sarah Lin" },
  { id: "m6", date: "2025-06-14", productId: "p4", type: "IN", qty: 50, user: "Priya Nair" },
];

export const staff: StaffMember[] = [
  { id: "s1", name: "Sarah Lin", email: "sarah@corewh.io", phone: "+1 555-0101", role: "admin", status: "Active" },
  { id: "s2", name: "Mike Owens", email: "mike@corewh.io", phone: "+1 555-0102", role: "staff", status: "Active" },
  { id: "s3", name: "Priya Nair", email: "priya@corewh.io", phone: "+1 555-0103", role: "staff", status: "Active" },
  { id: "s4", name: "Daniel Kim", email: "daniel@corewh.io", phone: "+1 555-0104", role: "staff", status: "Inactive" },
];

export const inventoryMovementSeries = [
  { month: "Jan", stockIn: 1200, stockOut: 900 },
  { month: "Feb", stockIn: 980, stockOut: 1100 },
  { month: "Mar", stockIn: 1450, stockOut: 1300 },
  { month: "Apr", stockIn: 1600, stockOut: 1250 },
  { month: "May", stockIn: 1380, stockOut: 1480 },
  { month: "Jun", stockIn: 1720, stockOut: 1390 },
];

export const ordersStatusSeries = [
  { name: "Pending", value: orders.filter(o => o.status === "Pending").length },
  { name: "Picking", value: orders.filter(o => o.status === "Picking").length },
  { name: "Packed", value: orders.filter(o => o.status === "Packed").length },
  { name: "Dispatched", value: orders.filter(o => o.status === "Dispatched").length },
  { name: "Delivered", value: orders.filter(o => o.status === "Delivered").length },
];

export function productName(id: string) {
  return products.find(p => p.id === id)?.name ?? id;
}
