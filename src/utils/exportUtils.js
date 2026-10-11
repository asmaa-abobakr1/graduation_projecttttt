// Helper utilities for CSV/JSON exports and synchronized localStorage state

export function exportToCSV(filename, data, columns) {
  if (!data || !data.length) {
    alert('No data to export.');
    return;
  }

  // columns: [{ key: 'id', label: 'Order ID' }, ...]
  const headers = columns.map(c => `"${c.label}"`).join(',');
  const rows = data.map(item => {
    return columns.map(c => {
      let val = item[c.key];
      if (val === undefined || val === null) val = '';
      if (typeof val === 'object') val = JSON.stringify(val);
      const strVal = String(val).replace(/"/g, '""');
      return `"${strVal}"`;
    }).join(',');
  });

  const csvContent = [headers, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToJSON(filename, data) {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify(data, null, 2)
  )}`;
  const link = document.createElement('a');
  link.setAttribute('href', jsonString);
  link.setAttribute('download', filename.endsWith('.json') ? filename : `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Initial Mock Orders
export const INITIAL_ORDERS = [
  { id: "#V-90482", customer: "Nina Park", email: "nina@example.com", date: "Sep 28, 2026", status: "Shipped", total: 1299, items: 2, address: "742 Evergreen Terrace, Springfield", payment: "Mastercard •••• 4242", trackingNumber: "FX-8849201" },
  { id: "#V-90481", customer: "Omar Ruiz", email: "omar@example.com", date: "Sep 28, 2026", status: "Processing", total: 2499, items: 1, address: "100 Market St, San Francisco, CA", payment: "Visa •••• 1082", trackingNumber: "Pending" },
  { id: "#V-90480", customer: "Maya Chen", email: "maya@example.com", date: "Sep 27, 2026", status: "Completed", total: 349, items: 3, address: "55 Broadway, New York, NY", payment: "Apple Pay", trackingNumber: "UPS-9920182" },
  { id: "#V-90479", customer: "Alex Turner", email: "alex@example.com", date: "Sep 27, 2026", status: "Completed", total: 799, items: 1, address: "12 King St, London, UK", payment: "PayPal", trackingNumber: "DHL-4402819" },
  { id: "#V-90478", customer: "Sara Ali", email: "sara@example.com", date: "Sep 26, 2026", status: "Returns", total: 1899, items: 2, address: "88 Palm Jumeirah, Dubai, UAE", payment: "Visa •••• 9920", trackingNumber: "RET-11827" },
  { id: "#V-90477", customer: "James Wu", email: "james@example.com", date: "Sep 26, 2026", status: "Shipped", total: 549, items: 1, address: "404 Silicon Ave, Austin, TX", payment: "Amex •••• 3004", trackingNumber: "FX-9920188" },
  { id: "#V-90476", customer: "Priya Sharma", email: "priya@example.com", date: "Sep 25, 2026", status: "Completed", total: 3299, items: 2, address: "15 Marine Drive, Mumbai, IN", payment: "Mastercard •••• 6612", trackingNumber: "FX-7718290" },
  { id: "#V-90475", customer: "Liam Scott", email: "liam@example.com", date: "Sep 25, 2026", status: "Processing", total: 999, items: 1, address: "220 Queen St, Toronto, ON", payment: "Visa •••• 7711", trackingNumber: "Pending" },
];

export function getStoredOrders() {
  try {
    const raw = localStorage.getItem('volt_orders');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read volt_orders:', e);
  }
  return INITIAL_ORDERS;
}

export function saveStoredOrders(orders) {
  try {
    localStorage.setItem('volt_orders', JSON.stringify(orders));
  } catch (e) {
    console.error('Failed to save volt_orders:', e);
  }
}

export function addStoredOrder(order) {
  const current = getStoredOrders();
  const updated = [order, ...current];
  saveStoredOrders(updated);
  return updated;
}

// Initial Mock Customers
export const INITIAL_CUSTOMERS = [
  { id: "C-001", name: "Nina Park", email: "nina@example.com", joined: "Jan 12, 2026", orders: 8, spent: 4290, status: "Active", phone: "+1 (555) 234-5678", location: "Springfield, IL" },
  { id: "C-002", name: "Omar Ruiz", email: "omar@example.com", joined: "Feb 3, 2026", orders: 5, spent: 7830, status: "Active", phone: "+1 (555) 876-5432", location: "San Francisco, CA" },
  { id: "C-003", name: "Maya Chen", email: "maya@example.com", joined: "Mar 19, 2026", orders: 12, spent: 2150, status: "Active", phone: "+1 (555) 345-6789", location: "New York, NY" },
  { id: "C-004", name: "Alex Turner", email: "alex@example.com", joined: "Apr 7, 2026", orders: 2, spent: 1599, status: "Active", phone: "+44 20 7946 0912", location: "London, UK" },
  { id: "C-005", name: "Sara Ali", email: "sara@example.com", joined: "May 22, 2026", orders: 6, spent: 3210, status: "Inactive", phone: "+971 4 391 0000", location: "Dubai, UAE" },
  { id: "C-006", name: "James Wu", email: "james@example.com", joined: "Jun 14, 2026", orders: 3, spent: 949, status: "Active", phone: "+1 (555) 456-7890", location: "Austin, TX" },
  { id: "C-007", name: "Priya Sharma", email: "priya@example.com", joined: "Jul 1, 2026", orders: 9, spent: 12400, status: "Active", phone: "+91 22 2654 3210", location: "Mumbai, IN" },
  { id: "C-008", name: "Liam Scott", email: "liam@example.com", joined: "Aug 30, 2026", orders: 1, spent: 999, status: "Active", phone: "+1 (416) 555-0199", location: "Toronto, ON" },
];

export function getStoredCustomers() {
  try {
    const raw = localStorage.getItem('volt_customers');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read volt_customers:', e);
  }
  return INITIAL_CUSTOMERS;
}

export function saveStoredCustomers(customers) {
  try {
    localStorage.setItem('volt_customers', JSON.stringify(customers));
  } catch (e) {
    console.error('Failed to save volt_customers:', e);
  }
}
