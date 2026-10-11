/**
 * Seed Script — populates MongoDB Atlas with all dummy data
 * Run: npm run seed
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dns from 'dns';

// Fix for Windows / ISP DNS blocking MongoDB Atlas SRV lookups
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

dotenv.config();

// ── Inline Models (avoid import issues in standalone script) ──────────────────
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';

// ─── Seed Data ────────────────────────────────────────────────────────────────

const categories = [
  { name: 'Phones',      slug: 'phones',      icon: 'Smartphone', color: '#7C3AED', desc: 'Flagship & high-performance smartphones' },
  { name: 'Laptops',     slug: 'laptops',     icon: 'Laptop',     color: '#4F46E5', desc: 'Ultrabooks, workstations & MacBooks' },
  { name: 'Audio',       slug: 'audio',       icon: 'Headphones', color: '#0EA5E9', desc: 'Noise-canceling headphones & wireless earbuds' },
  { name: 'Tablets',     slug: 'tablets',     icon: 'Tablet',     color: '#10B981', desc: 'Pro tablets, iPads & versatile 2-in-1s' },
  { name: 'Gaming',      slug: 'gaming',      icon: 'Gamepad2',   color: '#EC4899', desc: 'High-refresh gaming laptops & gear' },
  { name: 'Wearables',   slug: 'wearables',   icon: 'Watch',      color: '#F59E0B', desc: 'Smartwatches, cellular & fitness trackers' },
  { name: 'Accessories', slug: 'accessories', icon: 'Sparkles',   color: '#6366F1', desc: 'Ergonomic mice, keyboards & smart docks' },
];

const products = [
  {
    name: 'MacBook Pro 16"', brand: 'Apple', category: 'Laptops',
    price: 2499.99, originalPrice: 2799.99, stock: 24, sku: 'APL-MBP16-001',
    status: 'Published', rating: 4.8, reviews: 342, tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop','https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=400&fit=crop'],
    description: 'The most powerful MacBook Pro ever. With the blazing-fast M3 Max chip, up to 128GB of unified memory.',
    specs: { Processor: 'Apple M3 Max', RAM: '36GB Unified', Storage: '1TB SSD', Display: '16.2" Liquid Retina XDR', Battery: 'Up to 22 hours', Weight: '2.14 kg', OS: 'macOS Sonoma', Graphics: '40-core GPU' },
    highlights: ['M3 Max chip', '36GB Unified Memory', '22-hour battery life'],
    pros: ['Exceptional performance', 'Stunning display', 'All-day battery'],
    cons: ['Premium price', 'Limited ports', 'Heavy'],
    soldCount: 142,
  },
  {
    name: 'iPhone 15 Pro Max', brand: 'Apple', category: 'Phones',
    price: 1199.99, originalPrice: null, stock: 56, sku: 'APL-IP15PM-002',
    status: 'Published', rating: 4.9, reviews: 1204, tags: ['New'],
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop'],
    description: 'iPhone 15 Pro Max. Forged in titanium with the groundbreaking A17 Pro chip.',
    specs: { Processor: 'A17 Pro Bionic', RAM: '8GB', Storage: '256GB', Display: '6.7" Super Retina XDR', Battery: 'Up to 29 hours video', Weight: '221 g', OS: 'iOS 17', Camera: '48MP Main + 12MP Ultra Wide' },
    highlights: ['A17 Pro chip', 'Titanium design', '48MP camera system'],
    pros: ['Best-in-class camera', 'Titanium build', 'USB-C'],
    cons: ['Expensive', 'Slow charging', 'No charger in box'],
    soldCount: 298,
  },
  {
    name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', category: 'Phones',
    price: 1299.99, originalPrice: 1419.99, stock: 38, sku: 'SAM-GS24U-003',
    status: 'Published', rating: 4.7, reviews: 876, tags: ['New', 'Best Seller'],
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop'],
    description: 'Galaxy AI is here. The Samsung Galaxy S24 Ultra with built-in Galaxy AI.',
    specs: { Processor: 'Snapdragon 8 Gen 3', RAM: '12GB', Storage: '512GB', Display: '6.8" Dynamic AMOLED 2X', Battery: '5000mAh', Weight: '232 g', OS: 'Android 14', Camera: '200MP Main + 50MP Periscope' },
    highlights: ['Galaxy AI', '200MP camera', 'S Pen included'],
    pros: ['Galaxy AI features', 'Incredible camera', 'S Pen built-in'],
    cons: ['Bulky', 'Expensive', 'Slow software updates'],
    soldCount: 187,
  },
  {
    name: 'Dell XPS 15', brand: 'Dell', category: 'Laptops',
    price: 1849.99, originalPrice: 2099.99, stock: 15, sku: 'DEL-XPS15-004',
    status: 'Published', rating: 4.6, reviews: 567, tags: [],
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=400&fit=crop'],
    description: 'The Dell XPS 15 combines powerful Intel 13th Gen performance with a stunning 3.5K OLED display.',
    specs: { Processor: 'Intel Core i9-13900H', RAM: '32GB DDR5', Storage: '1TB NVMe SSD', Display: '15.6" 3.5K OLED', Battery: 'Up to 13 hours', Weight: '1.86 kg', OS: 'Windows 11 Pro', Graphics: 'NVIDIA RTX 4060' },
    highlights: ['3.5K OLED display', 'Intel i9 13th Gen', 'RTX 4060'],
    pros: ['Gorgeous OLED display', 'Powerful specs', 'Premium build'],
    cons: ['Gets hot under load', 'Webcam placement', 'Expensive'],
    soldCount: 94,
  },
  {
    name: 'iPad Pro 12.9"', brand: 'Apple', category: 'Tablets',
    price: 1099.99, originalPrice: null, stock: 42, sku: 'APL-IPDP-005',
    status: 'Published', rating: 4.8, reviews: 723, tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=400&fit=crop'],
    description: 'iPad Pro with the M2 chip. Supercharged by M2, with a stunning Liquid Retina XDR display.',
    specs: { Processor: 'Apple M2', RAM: '16GB Unified', Storage: '256GB', Display: '12.9" Liquid Retina XDR', Battery: 'Up to 10 hours', Weight: '682 g', OS: 'iPadOS 17', Camera: '12MP Wide + 10MP Ultra Wide' },
    highlights: ['M2 chip', 'Liquid Retina XDR', 'Apple Pencil support'],
    pros: ['Incredible display', 'Desktop-class performance', 'Apple Pencil 2'],
    cons: ['iPadOS limitations', 'Accessories sold separately', 'Pricey'],
    soldCount: 156,
  },
  {
    name: 'Sony WH-1000XM5', brand: 'Sony', category: 'Audio',
    price: 349.99, originalPrice: 399.99, stock: 89, sku: 'SNY-WH5-006',
    status: 'Published', rating: 4.7, reviews: 2341, tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=400&fit=crop'],
    description: 'Industry-leading noise canceling headphones with Auto NC Optimizer and up to 30-hour battery life.',
    specs: { Driver: '30mm', 'Noise Canceling': 'Industry Leading ANC', Battery: 'Up to 30 hours', Weight: '250 g', Connectivity: 'Bluetooth 5.2, 3.5mm', Codec: 'LDAC, AAC, SBC' },
    highlights: ['Best-in-class ANC', '30-hour battery', 'Multi-point connection'],
    pros: ['Supreme noise canceling', 'Comfortable fit', 'Excellent sound'],
    cons: ['No aptX support', 'Touch controls can misfire', 'Not foldable'],
    soldCount: 423,
  },
  {
    name: 'Samsung Galaxy Tab S9+', brand: 'Samsung', category: 'Tablets',
    price: 999.99, originalPrice: null, stock: 31, sku: 'SAM-GTS9P-007',
    status: 'Published', rating: 4.5, reviews: 456, tags: ['New'],
    image: 'https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1632882765546-1ee75f53becb?w=600&h=400&fit=crop'],
    description: 'Galaxy Tab S9+ with Snapdragon 8 Gen 2 processor and IP68 water resistance.',
    specs: { Processor: 'Snapdragon 8 Gen 2', RAM: '12GB', Storage: '256GB', Display: '12.4" Dynamic AMOLED 2X', Battery: '10,090mAh', Weight: '586 g', OS: 'Android 13', Camera: '13MP + 8MP Ultra Wide' },
    highlights: ['IP68 water resistant', 'S Pen included', '12.4" display'],
    pros: ['Water resistant', 'Great display', 'S Pen included'],
    cons: ['No headphone jack', 'Keyboard sold separately', 'Samsung bloatware'],
    soldCount: 78,
  },
  {
    name: 'ASUS ROG Zephyrus G14', brand: 'ASUS', category: 'Gaming',
    price: 1599.99, originalPrice: 1799.99, stock: 8, sku: 'ASU-ROGG14-008',
    status: 'Published', rating: 4.6, reviews: 389, tags: ['Gaming', 'Sale'],
    image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=400&fit=crop'],
    description: 'ROG Zephyrus G14 packs desktop-class gaming performance into an ultra-slim 14-inch form factor.',
    specs: { Processor: 'AMD Ryzen 9 7940HS', RAM: '16GB DDR5', Storage: '1TB SSD', Display: '14" QHD+ 165Hz', Battery: 'Up to 10 hours', Weight: '1.72 kg', OS: 'Windows 11', Graphics: 'NVIDIA RTX 4060' },
    highlights: ['165Hz display', 'AMD Ryzen 9', 'Ultra-portable gaming'],
    pros: ['Compact gaming laptop', 'Great performance', 'Good battery'],
    cons: ['Fan noise under load', 'No webcam', 'Smallish display'],
    soldCount: 65,
  },
  {
    name: 'Google Pixel 8 Pro', brand: 'Google', category: 'Phones',
    price: 999.99, originalPrice: null, stock: 45, sku: 'GOO-PX8P-009',
    status: 'Published', rating: 4.5, reviews: 654, tags: ['New'],
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=400&fit=crop'],
    description: 'The best of Google AI in a phone. Pixel 8 Pro with Tensor G3 chip.',
    specs: { Processor: 'Google Tensor G3', RAM: '12GB', Storage: '128GB', Display: '6.7" LTPO OLED 120Hz', Battery: '5050mAh', Weight: '213 g', OS: 'Android 14', Camera: '50MP Main + 48MP Ultrawide + 48MP Telephoto' },
    highlights: ['Tensor G3 AI', '7 years of updates', 'Pro camera system'],
    pros: ['Best Android camera', 'Clean software', 'AI features'],
    cons: ['Average battery', 'No expandable storage', 'Tensor chip efficiency'],
    soldCount: 112,
  },
  {
    name: 'Apple AirPods Pro 2', brand: 'Apple', category: 'Audio',
    price: 249.99, originalPrice: null, stock: 120, sku: 'APL-APP2-010',
    status: 'Published', rating: 4.8, reviews: 3456, tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=600&h=400&fit=crop'],
    description: 'AirPods Pro 2nd generation with H2 chip and adaptive audio.',
    specs: { Driver: 'Apple-designed H2 chip', 'Noise Canceling': 'Active Noise Cancellation', Battery: 'Up to 6 hours (30 with case)', Weight: '5.3 g per bud', Connectivity: 'Bluetooth 5.3', 'Water Resistance': 'IPX4' },
    highlights: ['H2 chip', 'Adaptive Audio', 'USB-C charging case'],
    pros: ['Great ANC', 'Seamless Apple integration', 'Compact'],
    cons: ['iOS only features', 'Average call quality', 'Ear tips may not fit all'],
    soldCount: 534,
  },
  {
    name: 'ThinkPad X1 Carbon Gen 11', brand: 'Lenovo', category: 'Laptops',
    price: 1749.99, originalPrice: 1999.99, stock: 19, sku: 'LEN-X1C11-011',
    status: 'Published', rating: 4.7, reviews: 432, tags: [],
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=400&fit=crop'],
    description: 'The gold standard of business laptops. Ultra-light, ultra-durable.',
    specs: { Processor: 'Intel Core i7-1365U vPro', RAM: '32GB LPDDR5x', Storage: '512GB SSD', Display: '14" 2.8K OLED', Battery: 'Up to 15 hours', Weight: '1.12 kg', OS: 'Windows 11 Pro', Graphics: 'Intel Iris Xe' },
    highlights: ['1.12 kg ultralight', 'MIL-STD-810H', '2.8K OLED'],
    pros: ['Incredibly light', 'Legendary keyboard', 'All-day battery'],
    cons: ['Integrated graphics only', 'Limited gaming', 'Premium price'],
    soldCount: 89,
  },
  {
    name: 'Samsung Galaxy Watch 6', brand: 'Samsung', category: 'Wearables',
    price: 329.99, originalPrice: 379.99, stock: 67, sku: 'SAM-GW6-012',
    status: 'Published', rating: 4.4, reviews: 765, tags: ['New'],
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=400&fit=crop'],
    description: 'Galaxy Watch 6 Classic with rotating bezel and advanced health monitoring.',
    specs: { Processor: 'Exynos W930', RAM: '2GB', Storage: '16GB', Display: '1.47" Super AMOLED', Battery: '425mAh', Weight: '59 g', OS: 'Wear OS 4', Connectivity: 'Bluetooth 5.3, Wi-Fi, NFC' },
    highlights: ['Rotating bezel', 'BioActive sensor', 'Wear OS 4'],
    pros: ['Classic design', 'Comprehensive health tracking', 'Wear OS'],
    cons: ['Battery lasts 1-2 days', 'Samsung phone recommended', 'Thick'],
    soldCount: 143,
  },
  {
    name: 'OnePlus 12', brand: 'OnePlus', category: 'Phones',
    price: 799.99, originalPrice: null, stock: 52, sku: 'ONP-12-013',
    status: 'Published', rating: 4.5, reviews: 321, tags: ['New'],
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=400&fit=crop'],
    description: 'OnePlus 12 with Snapdragon 8 Gen 3 and 100W SUPERVOOC charging.',
    specs: { Processor: 'Snapdragon 8 Gen 3', RAM: '16GB LPDDR5X', Storage: '256GB UFS 4.0', Display: '6.82" 2K LTPO AMOLED', Battery: '5400mAh', Weight: '220 g', OS: 'Android 14', Camera: '50MP Main + 64MP Periscope + 48MP Ultrawide' },
    highlights: ['100W fast charging', 'Hasselblad camera', '5400mAh battery'],
    pros: ['Insanely fast charging', 'Great value flagship', 'Smooth display'],
    cons: ['No wireless charging on base', 'OxygenOS changes', 'Big phone'],
    soldCount: 67,
  },
  {
    name: 'Logitech MX Master 3S', brand: 'Logitech', category: 'Accessories',
    price: 99.99, originalPrice: null, stock: 156, sku: 'LOG-MXM3S-015',
    status: 'Published', rating: 4.8, reviews: 4521, tags: ['Best Seller'],
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=400&fit=crop'],
    description: 'MX Master 3S with quiet clicks, 8K DPI tracking, and MagSpeed electromagnetic scrolling.',
    specs: { Sensor: '8000 DPI Darkfield', Battery: 'Up to 70 days', Weight: '141 g', Connectivity: 'Bluetooth, USB-C, Logi Bolt', 'Scroll Wheel': 'MagSpeed Electromagnetic', Buttons: '7 programmable buttons' },
    highlights: ['Quiet clicks', '8K DPI', '70-day battery'],
    pros: ['Ergonomic design', 'Multi-device support', 'Premium scroll wheel'],
    cons: ['Pricey for a mouse', 'Right-hand only', 'Heavy'],
    soldCount: 612,
  },
  {
    name: 'Apple Watch Ultra 2', brand: 'Apple', category: 'Wearables',
    price: 799.99, originalPrice: null, stock: 35, sku: 'APL-AWU2-019',
    status: 'Published', rating: 4.7, reviews: 892, tags: ['New', 'Premium'],
    image: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=400&fit=crop'],
    description: 'Apple Watch Ultra 2 with the brightest Apple display ever and 72-hour battery life.',
    specs: { Processor: 'Apple S9 SiP', Display: '49mm Always-On Retina LTPO', Battery: 'Up to 72 hours', Weight: '61.4 g', 'Water Resistance': 'WR100, EN13319', Connectivity: 'Bluetooth 5.3, Wi-Fi 4, LTE' },
    highlights: ['72-hour battery', 'Titanium case', 'Precision GPS'],
    pros: ['Rugged titanium build', 'Longest battery Apple Watch', 'Bright display'],
    cons: ['Very expensive', 'Large for small wrists', 'iOS only'],
    soldCount: 198,
  },
  {
    name: 'Razer Blade 16', brand: 'Razer', category: 'Gaming',
    price: 2799.99, originalPrice: 3199.99, stock: 5, sku: 'RZR-BL16-020',
    status: 'Published', rating: 4.5, reviews: 156, tags: ['Gaming', 'Sale'],
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=400&fit=crop'],
    description: 'Razer Blade 16 with Intel i9-14900HX, RTX 4080, and dual-mode Mini LED display.',
    specs: { Processor: 'Intel Core i9-14900HX', RAM: '32GB DDR5', Storage: '1TB SSD', Display: '16" Mini LED 240Hz QHD+', Battery: 'Up to 6 hours', Weight: '2.45 kg', OS: 'Windows 11', Graphics: 'NVIDIA RTX 4080' },
    highlights: ['RTX 4080', '240Hz Mini LED', 'CNC aluminum unibody'],
    pros: ['Incredible gaming performance', 'Stunning display', 'Premium build'],
    cons: ['Very expensive', 'Short battery life', 'Runs hot'],
    soldCount: 34,
  },
];

const users = [
  { name: 'Maya Chen',     email: 'admin@volt.com',   password: 'admin123',  role: 'admin' },
  { name: 'John Cooper',   email: 'john@email.com',   password: 'user123',   role: 'customer' },
  { name: 'Sarah Johnson', email: 'sarah@email.com',  password: 'user123',   role: 'customer' },
  { name: 'Mike Chen',     email: 'mike@email.com',   password: 'user123',   role: 'customer' },
  { name: 'Emily Davis',   email: 'emily@email.com',  password: 'user123',   role: 'customer' },
];

// ─── Run Seed ─────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB Atlas');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log('🗑️  Cleared existing data');

    // Seed Categories
    await Category.insertMany(categories);
    console.log(`✅ Seeded ${categories.length} categories`);

    // Seed Products
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Seed Users (passwords will be hashed by the pre-save hook)
    for (const u of users) {
      await User.create(u);
    }
    console.log(`✅ Seeded ${users.length} users`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin login:    admin@volt.com  / admin123');
    console.log('Customer login: john@email.com  / user123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
