import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false,
    default: null,
  },
  productName: { type: String, required: true }, // snapshot at order time
  productImage: { type: String, default: '' },
  price: { type: Number, required: true },       // price at order time
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    // Auto-generated readable order ID: ORD-XXXXXX
    orderId: {
      type: String,
      unique: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // null = guest checkout
    },
    customerName:  { type: String, required: true },
    customerEmail: { type: String, required: true },
    items: [orderItemSchema],
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled', 'Refunded'],
      default: 'Pending',
    },
    subtotal: { type: Number, required: true },
    discount:  { type: Number, default: 0 },
    tax:       { type: Number, default: 0 },
    shipping:  { type: Number, default: 0 },
    total:     { type: Number, required: true },
    promoCode: { type: String, default: '' },
    notes:     { type: String, default: '' },
  },
  { timestamps: true }
);

// ─── Auto-generate orderId before saving ────────────────────────────────────
orderSchema.pre('save', async function (next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD-${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

// ─── Indexes ────────────────────────────────────────────────────────────────
orderSchema.index({ customer: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);
export default Order;
