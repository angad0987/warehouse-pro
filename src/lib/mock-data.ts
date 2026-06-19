// Mock data layer for CoreWarehousing WMS (B2B 3PL)
export type Role = "admin" | "staff";

export type Client = {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gst: string;
  status: "Active" | "Inactive";
  notes?: string;
};

export type Consignee = {
  id: string;
  name: string;
  address: string;
  city: string;
};

export type Product = {
  id: string;
  sku: string;
  name: string;
  clientId: string;
  category: string;
  description: string;
  stock: number;
  reorderLevel: number;
  location: string;
  updatedAt: string;
};

export type OrderStatus = "Pending" | "Picking" | "Packed" | "Dispatched" | "Delivered";

export type Order = {
  id: string;
  clientId: string;
  consigneeId: string;
  deliveryAddress: string;
  items: { productId: string; qty: number }[];
  status: OrderStatus;
  createdAt: string;
  notes?: string;
};

export type DispatchStatus = "Scheduled" | "In Transit" | "Delivered";

export type Dispatch = {
  id: string;
  orderId: string;
  clientId: string;
  consigneeId: string;
  destinationCompany: string;
  vehicle: string;
  driver: string;
  destination: string;
  date: string;
  status: DispatchStatus;
  notes?: string;
};

export type Movement = {
  id: string;
  date: string;
  productId: string;
  clientId: string;
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

export const clients: Client[] = [
  { id: "c1", name: "Acme Corp", contactPerson: "Laura Beckett", email: "laura@acmecorp.io", phone: "+1 555-2010", address: "120 Industrial Pkwy, Newark, NJ", gst: "22AAAAA0000A1Z5", status: "Active" },
  { id: "c2", name: "Globex Retail", contactPerson: "Hiro Tanaka", email: "hiro@globex.com", phone: "+1 555-2011", address: "55 Market St, San Francisco, CA", gst: "27BBBBB1111B2Z6", status: "Active" },
  { id: "c3", name: "Initech Stores", contactPerson: "Nora Patel", email: "nora@initech.com", phone: "+1 555-2012", address: "900 Tech Blvd, Austin, TX", gst: "29CCCCC2222C3Z7", status: "Active" },
  { id: "c4", name: "Umbrella Co", contactPerson: "Marcus Reed", email: "marcus@umbrella.com", phone: "+1 555-2013", address: "12 Raccoon Ave, Chicago, IL", gst: "07DDDDD3333D4Z8", status: "Active" },
  { id: "c5", name: "Wayne Industries", contactPerson: "Selina Vance", email: "selina@wayne.com", phone: "+1 555-2014", address: "1 Wayne Tower, Gotham, NJ", gst: "33EEEEE4444E5Z9", status: "Active" },
  { id: "c6", name: "Stark Trading", contactPerson: "Pepper Hogan", email: "pepper@stark.com", phone: "+1 555-2015", address: "10880 Malibu Pt, Malibu, CA", gst: "06FFFFF5555F6Z0", status: "Inactive" },
];

export const consignees: Consignee[] = [
  { id: "k1", name: "XYZ Distributor", address: "200 Commerce Way", city: "Dallas, TX" },
  { id: "k2", name: "West Coast Hub", address: "44 Harbor Dr", city: "Los Angeles, CA" },
  { id: "k3", name: "Metro Wholesale", address: "808 5th Ave", city: "New York, NY" },
  { id: "k4", name: "Midwest Supply", address: "300 Lakeshore Dr", city: "Chicago, IL" },
  { id: "k5", name: "Southeast Retail", address: "75 Peachtree St", city: "Atlanta, GA" },
];

export const products: Product[] = [
  { id: "p1", sku: "ELC-001", name: "Wireless Headphones", clientId: "c6", category: "Electronics", description: "Noise-cancelling over-ear headphones.", stock: 248, reorderLevel: 50, location: "A-12-3", updatedAt: "2025-06-15" },
  { id: "p2", sku: "ELC-002", name: "USB-C Hub 7-in-1", clientId: "c6", category: "Electronics", description: "Multiport adapter for laptops.", stock: 18, reorderLevel: 40, location: "A-12-4", updatedAt: "2025-06-14" },
  { id: "p3", sku: "APP-101", name: "Cotton T-Shirt (M)", clientId: "c2", category: "Apparel", description: "100% cotton crew neck.", stock: 1240, reorderLevel: 200, location: "B-04-1", updatedAt: "2025-06-16" },
  { id: "p4", sku: "APP-102", name: "Denim Jeans (32)", clientId: "c2", category: "Apparel", description: "Slim fit denim jeans.", stock: 92, reorderLevel: 100, location: "B-04-2", updatedAt: "2025-06-13" },
  { id: "p5", sku: "FNB-201", name: "Organic Coffee 1kg", clientId: "c1", category: "Food & Beverage", description: "Arabica whole beans.", stock: 360, reorderLevel: 80, location: "C-02-1", updatedAt: "2025-06-17" },
  { id: "p6", sku: "FNB-202", name: "Green Tea 500g", clientId: "c1", category: "Food & Beverage", description: "Premium loose leaf.", stock: 12, reorderLevel: 30, location: "C-02-2", updatedAt: "2025-06-12" },
  { id: "p7", sku: "IND-301", name: "Steel Bearings Pack", clientId: "c3", category: "Industrial", description: "10x precision bearings.", stock: 540, reorderLevel: 120, location: "D-08-3", updatedAt: "2025-06-16" },
  { id: "p8", sku: "HMG-401", name: "Ceramic Mug Set", clientId: "c4", category: "Home Goods", description: "Set of 4 ceramic mugs.", stock: 28, reorderLevel: 60, location: "E-01-1", updatedAt: "2025-06-15" },
  { id: "p9", sku: "ELC-003", name: "Smart Charger 65W", clientId: "c5", category: "Electronics", description: "GaN fast charger.", stock: 500, reorderLevel: 100, location: "A-13-1", updatedAt: "2025-06-17" },
];

export const orders: Order[] = [
  { id: "ORD-1001", clientId: "c1", consigneeId: "k1", deliveryAddress: "200 Commerce Way, Dallas, TX", items: [{ productId: "p5", qty: 80 }], status: "Pending", createdAt: "2025-06-17" },
  { id: "ORD-1002", clientId: "c2", consigneeId: "k2", deliveryAddress: "44 Harbor Dr, Los Angeles, CA", items: [{ productId: "p3", qty: 200 }, { productId: "p4", qty: 25 }], status: "Picking", createdAt: "2025-06-17" },
  { id: "ORD-1003", clientId: "c3", consigneeId: "k4", deliveryAddress: "300 Lakeshore Dr, Chicago, IL", items: [{ productId: "p7", qty: 100 }], status: "Packed", createdAt: "2025-06-16" },
  { id: "ORD-1004", clientId: "c6", consigneeId: "k1", deliveryAddress: "200 Commerce Way, Dallas, TX", items: [{ productId: "p2", qty: 10 }], status: "Dispatched", createdAt: "2025-06-15" },
  { id: "ORD-1005", clientId: "c5", consigneeId: "k3", deliveryAddress: "808 5th Ave, New York, NY", items: [{ productId: "p9", qty: 500 }], status: "Delivered", createdAt: "2025-06-14" },
  { id: "ORD-1006", clientId: "c4", consigneeId: "k5", deliveryAddress: "75 Peachtree St, Atlanta, GA", items: [{ productId: "p8", qty: 12 }], status: "Pending", createdAt: "2025-06-18" },
];

export const dispatches: Dispatch[] = [
  { id: "DSP-501", orderId: "ORD-1004", clientId: "c6", consigneeId: "k1", destinationCompany: "XYZ Distributor", vehicle: "TX-44-AB-1234", driver: "John Carter", destination: "Dallas, TX", date: "2025-06-15", status: "Delivered" },
  { id: "DSP-502", orderId: "ORD-1003", clientId: "c3", consigneeId: "k4", destinationCompany: "Midwest Supply", vehicle: "CA-12-XY-9090", driver: "Maria Lopez", destination: "Chicago, IL", date: "2025-06-17", status: "In Transit" },
  { id: "DSP-503", orderId: "ORD-1002", clientId: "c2", consigneeId: "k2", destinationCompany: "West Coast Hub", vehicle: "NY-08-MN-3344", driver: "Ravi Shankar", destination: "Los Angeles, CA", date: "2025-06-18", status: "Scheduled" },
];

export const movements: Movement[] = [
  { id: "m1", date: "2025-06-17", productId: "p1", clientId: "c6", type: "IN", qty: 100, user: "Sarah Lin" },
  { id: "m2", date: "2025-06-17", productId: "p3", clientId: "c2", type: "OUT", qty: 50, user: "Mike Owens" },
  { id: "m3", date: "2025-06-16", productId: "p5", clientId: "c1", type: "IN", qty: 200, user: "Sarah Lin" },
  { id: "m4", date: "2025-06-16", productId: "p7", clientId: "c3", type: "OUT", qty: 100, user: "Mike Owens" },
  { id: "m5", date: "2025-06-15", productId: "p2", clientId: "c6", type: "OUT", qty: 10, user: "Sarah Lin" },
  { id: "m6", date: "2025-06-14", productId: "p4", clientId: "c2", type: "IN", qty: 50, user: "Priya Nair" },
  { id: "m7", date: "2025-06-14", productId: "p9", clientId: "c5", type: "IN", qty: 500, user: "Priya Nair" },
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
export function productById(id: string) {
  return products.find(p => p.id === id);
}
export function clientName(id: string) {
  return clients.find(c => c.id === id)?.name ?? id;
}
export function clientById(id: string) {
  return clients.find(c => c.id === id);
}
export function consigneeName(id: string) {
  return consignees.find(c => c.id === id)?.name ?? id;
}
export function consigneeById(id: string) {
  return consignees.find(c => c.id === id);
}
