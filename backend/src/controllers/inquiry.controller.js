// backend/src/controllers/inquiry.controller.js

const db = require('../config/db');

// ─── GET /api/inquiries/next-id (public) ──────────────────────────────────────
function getNextId(req, res) {
  try {
    const row = db.prepare(`
      SELECT id FROM inquiries ORDER BY rowid DESC LIMIT 1
    `).get();

    let next = 1;
    if (row) {
      // Extract the number from BTB-INQ-XXXX
      const match = row.id.match(/BTB-INQ-(\d+)$/);
      if (match) next = parseInt(match[1], 10) + 1;
    }

    const nextId = `BTB-INQ-${String(next).padStart(4, '0')}`;
    return res.json({ nextId });
  } catch (err) {
    console.error('getNextId error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── POST /api/inquiries ──────────────────────────────────────────────────────
function submitInquiry(req, res) {
  try {
    const {
      id,
      occasion, bouquetType, bouquetName,
      targetDate, targetTime,
      fulfillment, pickupLocation,
      deliveryAddress, deliveryLandmark, deliveryBooker,
      receiverName, receiverContact,
      customerName, customerContact, customerSocial,
      details, addOns, preferredBudget,
    } = req.body;

    if (!id || !customerName || !customerContact || !bouquetType) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }

    const phone4 = String(customerContact).replace(/\D/g, '').slice(-4);
    if (phone4.length < 4) {
      return res.status(400).json({ error: 'Contact number must have at least 4 digits.' });
    }

    const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id);
    if (existing) {
      return res.status(409).json({ error: 'Inquiry reference already exists.' });
    }

    const stmt = db.prepare(`
      INSERT INTO inquiries (
        id, name, contact, phone4, social,
        occasion, bouquet_type, bouquet_name,
        event_date, target_time,
        fulfillment, pickup_location,
        delivery_address, delivery_landmark, delivery_booker,
        receiver_name, receiver_contact,
        details, add_ons, preferred_budget
      ) VALUES (
        @id, @name, @contact, @phone4, @social,
        @occasion, @bouquetType, @bouquetName,
        @eventDate, @targetTime,
        @fulfillment, @pickupLocation,
        @deliveryAddress, @deliveryLandmark, @deliveryBooker,
        @receiverName, @receiverContact,
        @details, @addOns, @preferredBudget
      )
    `);

    stmt.run({
      id,
      name:             customerName,
      contact:          customerContact,
      phone4,
      social:           customerSocial   || null,
      occasion,
      bouquetType,
      bouquetName:      bouquetName      || null,
      eventDate:        targetDate       || null,
      targetTime:       targetTime       || null,
      fulfillment:      fulfillment      || null,
      pickupLocation:   pickupLocation   || null,
      deliveryAddress:  deliveryAddress  || null,
      deliveryLandmark: deliveryLandmark || null,
      deliveryBooker:   deliveryBooker   || null,
      receiverName:     receiverName     || null,
      receiverContact:  receiverContact  || null,
      details:          details          || null,
      addOns:           Array.isArray(addOns) ? addOns.join(', ') : (addOns || null),
      preferredBudget:  preferredBudget  || null,
    });

    return res.status(201).json({
      success: true,
      orderId: id,
      message: 'Inquiry submitted successfully.',
    });
  } catch (err) {
    console.error('submitInquiry error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}

// ─── POST /api/inquiries/track/:orderId ───────────────────────────────────────
function trackInquiry(req, res) {
  try {
    const { orderId } = req.params;
    const { phone4 }  = req.body;

    if (!orderId || !phone4) {
      return res.status(400).json({ error: 'Order ID and phone digits required.' });
    }

    const row = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(orderId.toUpperCase());

    if (!row) return res.status(404).json({ error: 'Order not found.' });

    if (row.phone4 !== String(phone4).trim()) {
      return res.status(401).json({ error: 'Phone digits do not match.' });
    }

    return res.json({
      id:               row.id,
      name:             row.name,
      service:          row.bouquet_type,
      status:           row.status,
      created_at:       row.created_at,
      event_date:       row.event_date,
      target_time:      row.target_time,
      fulfillment:      row.fulfillment,
      pickup_location:  row.pickup_location,
      message:          row.details       ?? '',
      bouquet_name:     row.bouquet_name,
      add_ons:          row.add_ons,
      preferred_budget: row.preferred_budget,
    });
  } catch (err) {
    console.error('trackInquiry error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}

// ─── GET /api/inquiries (admin) ───────────────────────────────────────────────
function getAllInquiries(req, res) {
  try {
    const rows = db.prepare(`
      SELECT id, name, contact, occasion, bouquet_name, bouquet_type,
             event_date, target_time, fulfillment, status, created_at
      FROM inquiries
      ORDER BY created_at DESC
    `).all();
    return res.json(rows);
  } catch (err) {
    console.error('getAllInquiries error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── GET /api/inquiries/:id (admin) ──────────────────────────────────────────
function getInquiryById(req, res) {
  try {
    const row = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(req.params.id.toUpperCase());
    if (!row) return res.status(404).json({ error: 'Not found.' });
    return res.json(row);
  } catch (err) {
    console.error('getInquiryById error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── PATCH /api/inquiries/:id/status (admin) ─────────────────────────────────
function updateInquiryStatus(req, res) {
  try {
    const { status, admin_notes } = req.body;
    const validStatuses = ['pending','confirmed','in_progress','ready','out_for_delivery','completed','cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const result = db.prepare(`
      UPDATE inquiries SET status = ?, admin_notes = ? WHERE id = ?
    `).run(status, admin_notes ?? null, req.params.id.toUpperCase());

    if (result.changes === 0) return res.status(404).json({ error: 'Not found.' });

    return res.json({ success: true });
  } catch (err) {
    console.error('updateInquiryStatus error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = {
  getNextId,
  submitInquiry,
  trackInquiry,
  getAllInquiries,
  getInquiryById,
  updateInquiryStatus,
};