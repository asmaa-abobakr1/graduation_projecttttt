import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// ─── POST /api/orders ── Place a new order (any user or guest) ────────────────
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, address, items, promoCode, subtotal, discount, tax, shipping, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' });
    }

    // Verify stock and build order items
    const orderItems = [];
    for (const item of items) {
      let product = null;
      const pid = item.productId || item._id || item.id;
      if (pid && mongoose.Types.ObjectId.isValid(pid)) {
        product = await Product.findById(pid);
      }
      if (product) {
        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for "${product.name}".` });
        }
        product.stock -= item.quantity;
        product.soldCount = (product.soldCount || 0) + item.quantity;
        await product.save();
      }

      orderItems.push({
        product: product ? product._id : null,
        productName: item.productName || item.name || (product ? product.name : 'Device'),
        productImage: item.productImage || item.image || (product ? product.image : ''),
        price: item.price || (product ? product.price : 0),
        quantity: item.quantity,
      });
    }

    const order = await Order.create({
      customer: req.user?._id || null,
      customerName,
      customerEmail,
      address,
      items: orderItems,
      promoCode: promoCode || '',
      subtotal,
      discount: discount || 0,
      tax: tax || 0,
      shipping: shipping || 0,
      total,
    });

    res.status(201).json({
      success: true,
      data: order,
      message: '🎉 Order placed successfully!',
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/orders ── Admin: list all orders ───────────────────────────────
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('customer', 'name email avatar')
        .sort('-createdAt')
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/orders/my ── Current user's orders ─────────────────────────────
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id }).sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── GET /api/orders/:id ─────────────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customer', 'name email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── PUT /api/orders/:id/status ── Admin: update order status ─────────────────
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, data: order, message: `Order status updated to ${status}.` });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

export default router;
