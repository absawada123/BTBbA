// backend/src/routes/inquiry.routes.js

const express         = require('express');
const router          = express.Router();
const controller      = require('../controllers/inquiry.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/next-id',           controller.getNextId);         // GET  /api/inquiries/next-id
router.post('/',                 controller.submitInquiry);     // POST /api/inquiries
router.post('/track/:orderId',   controller.trackInquiry);      // POST /api/inquiries/track/:orderId

// ─── Admin (protected) ────────────────────────────────────────────────────────
router.get('/',                  requireAuth, controller.getAllInquiries);
router.get('/:id',               requireAuth, controller.getInquiryById);
router.patch('/:id/status',      requireAuth, controller.updateInquiryStatus);

module.exports = router;