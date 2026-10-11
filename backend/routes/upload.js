import express from 'express';
import { uploadProduct, uploadAvatar, cloudinary } from '../middleware/cloudinary.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// ─── POST /api/upload/product ── Upload single product image (Admin) ──────────
router.post('/product', protect, adminOnly, uploadProduct.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file provided.' });
    }
    res.json({
      success: true,
      url: req.file.path,       // Cloudinary URL
      publicId: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/upload/product/multiple ── Multiple product images (Admin) ─────
router.post('/product/multiple', protect, adminOnly, uploadProduct.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files provided.' });
    }
    const urls = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
    res.json({ success: true, images: urls });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── POST /api/upload/avatar ── Upload user avatar ────────────────────────────
router.post('/avatar', protect, uploadAvatar.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No avatar file provided.' });
    }
    res.json({ success: true, url: req.file.path, publicId: req.file.filename });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── DELETE /api/upload/:publicId ── Delete image from Cloudinary (Admin) ─────
router.delete('/:publicId', protect, adminOnly, async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.params.publicId);
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
