export const orders = [
  { id: 'ORD-001', customer: 'Sarah Johnson', email: 'sarah@email.com', product: 'MacBook Pro 16"', productId: 1, quantity: 1, total: 2499.99, date: '2024-03-15', status: 'Completed', address: '123 Tech St, San Francisco, CA' },
  { id: 'ORD-002', customer: 'Mike Chen', email: 'mike@email.com', product: 'iPhone 15 Pro Max', productId: 2, quantity: 2, total: 2399.98, date: '2024-03-15', status: 'Shipped', address: '456 Digital Ave, New York, NY' },
  { id: 'ORD-003', customer: 'Emily Davis', email: 'emily@email.com', product: 'Sony WH-1000XM5', productId: 6, quantity: 1, total: 349.99, date: '2024-03-14', status: 'Pending', address: '789 Gadget Blvd, Austin, TX' },
  { id: 'ORD-004', customer: 'Alex Rivera', email: 'alex@email.com', product: 'Samsung Galaxy S24 Ultra', productId: 3, quantity: 1, total: 1299.99, date: '2024-03-14', status: 'Completed', address: '321 Silicon Rd, Seattle, WA' },
  { id: 'ORD-005', customer: 'Jessica Lee', email: 'jessica@email.com', product: 'iPad Pro 12.9"', productId: 5, quantity: 1, total: 1099.99, date: '2024-03-14', status: 'Shipped', address: '654 Chip Ln, Boston, MA' },
  { id: 'ORD-006', customer: 'David Kim', email: 'david@email.com', product: 'Dell XPS 15', productId: 4, quantity: 1, total: 1849.99, date: '2024-03-13', status: 'Completed', address: '987 Byte Dr, Chicago, IL' },
  { id: 'ORD-007', customer: 'Lauren Park', email: 'lauren@email.com', product: 'AirPods Pro 2', productId: 10, quantity: 3, total: 749.97, date: '2024-03-13', status: 'Pending', address: '147 Pixel St, Portland, OR' },
  { id: 'ORD-008', customer: 'Chris Taylor', email: 'chris@email.com', product: 'ASUS ROG Zephyrus G14', productId: 8, quantity: 1, total: 1599.99, date: '2024-03-13', status: 'Completed', address: '258 Router Ave, Denver, CO' },
  { id: 'ORD-009', customer: 'Amanda White', email: 'amanda@email.com', product: 'Google Pixel 8 Pro', productId: 9, quantity: 1, total: 999.99, date: '2024-03-12', status: 'Shipped', address: '369 Cache Blvd, Miami, FL' },
  { id: 'ORD-010', customer: 'Ryan Martinez', email: 'ryan@email.com', product: 'Logitech MX Master 3S', productId: 15, quantity: 2, total: 199.98, date: '2024-03-12', status: 'Completed', address: '741 Debug Ct, Atlanta, GA' },
  { id: 'ORD-011', customer: 'Olivia Brown', email: 'olivia@email.com', product: 'MacBook Pro 16"', productId: 1, quantity: 1, total: 2499.99, date: '2024-03-12', status: 'Pending', address: '852 Kernel Way, Houston, TX' },
  { id: 'ORD-012', customer: 'Nathan Wilson', email: 'nathan@email.com', product: 'Samsung Galaxy Tab S9+', productId: 7, quantity: 1, total: 999.99, date: '2024-03-11', status: 'Completed', address: '963 Binary St, Phoenix, AZ' },
  { id: 'ORD-013', customer: 'Sophie Adams', email: 'sophie@email.com', product: 'ThinkPad X1 Carbon', productId: 11, quantity: 1, total: 1749.99, date: '2024-03-11', status: 'Shipped', address: '159 Stack Rd, San Diego, CA' },
  { id: 'ORD-014', customer: 'James Hall', email: 'james@email.com', product: 'OnePlus 12', productId: 13, quantity: 1, total: 799.99, date: '2024-03-11', status: 'Completed', address: '357 Queue Ln, Dallas, TX' },
  { id: 'ORD-015', customer: 'Emma Garcia', email: 'emma@email.com', product: 'Razer Blade 16', productId: 20, quantity: 1, total: 2799.99, date: '2024-03-10', status: 'Pending', address: '246 Node Ave, Las Vegas, NV' },
];

export const recentActivity = [
  { id: 1, action: 'New order placed', detail: 'ORD-001 by Sarah Johnson', time: '2 min ago', type: 'order' },
  { id: 2, action: 'Product updated', detail: 'MacBook Pro 16" price changed', time: '15 min ago', type: 'product' },
  { id: 3, action: 'Stock alert', detail: 'Razer Blade 16 low stock (5 units)', time: '1 hour ago', type: 'alert' },
  { id: 4, action: 'Order shipped', detail: 'ORD-002 shipped to Mike Chen', time: '2 hours ago', type: 'order' },
  { id: 5, action: 'New customer', detail: 'Emily Davis registered', time: '3 hours ago', type: 'user' },
  { id: 6, action: 'Product added', detail: 'Samsung Galaxy Buds3 Pro added', time: '5 hours ago', type: 'product' },
  { id: 7, action: 'Stock alert', detail: 'ASUS ROG Zephyrus G14 low stock (8 units)', time: '6 hours ago', type: 'alert' },
  { id: 8, action: 'Order completed', detail: 'ORD-006 delivered to David Kim', time: '8 hours ago', type: 'order' },
];
