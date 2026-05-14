// backend/src/routes/inquiry.routes.js

const express         = require('express');
const router          = express.Router();
const controller      = require('../controllers/inquiry.controller');
const { requireAuth } = require('../middleware/auth.middleware');

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/next-id',                   controller.getNextId);          // GET  /api/inquiries/next-id
router.post('/',                         controller.submitInquiry);      // POST /api/inquiries
router.post('/track/:orderId',           controller.trackInquiry);       // POST /api/inquiries/track/:orderId

// ─── Admin — read ─────────────────────────────────────────────────────────────
router.get('/stats',                     requireAuth, controller.getStats);           // GET  /api/inquiries/stats
router.get('/',                          requireAuth, controller.getAllInquiries);     // GET  /api/inquiries?status=&archived=&search=&...
router.get('/:id',                       requireAuth, controller.getInquiryById);     // GET  /api/inquiries/:id  (full detail)

// ─── Admin — status & confirmation ───────────────────────────────────────────
router.patch('/:id/status',              requireAuth, controller.updateInquiryStatus); // PATCH /api/inquiries/:id/status
router.post('/:id/confirm',              requireAuth, controller.confirmInquiry);      // POST  /api/inquiries/:id/confirm

// ─── Admin — quotation & payment ─────────────────────────────────────────────
router.put('/:id/quotation',             requireAuth, controller.updateQuotation);     // PUT   /api/inquiries/:id/quotation
router.patch('/:id/payment',             requireAuth, controller.updatePayment);       // PATCH /api/inquiries/:id/payment

// ─── Admin — operational ─────────────────────────────────────────────────────
router.patch('/:id/priority',            requireAuth, controller.updatePriority);      // PATCH /api/inquiries/:id/priority
router.patch('/:id/delivery',            requireAuth, controller.updateDelivery);      // PATCH /api/inquiries/:id/delivery

// ─── Admin — notes & attachments ─────────────────────────────────────────────
router.post('/:id/notes',                requireAuth, controller.addNote);             // POST  /api/inquiries/:id/notes
router.post('/:id/attachments',          requireAuth, controller.addAttachment);       // POST  /api/inquiries/:id/attachments
router.delete('/:id/attachments/:attachId', requireAuth, controller.deleteAttachment); // DELETE /api/inquiries/:id/attachments/:attachId

module.exports = router;