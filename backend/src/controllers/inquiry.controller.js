// backend/src/controllers/inquiry.controller.js

const db = require('../config/db');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const VALID_STATUSES = [
  'new_inquiry',
  'reviewing',
  'waiting_for_customer',
  'quotation_sent',
  'confirmed',
  'preparing',
  'ready',
  'completed',
  'cancelled',
];

const ARCHIVE_STATUSES = ['completed', 'cancelled'];

function _nextInquiryId() {
  const row = db.prepare(`SELECT id FROM inquiries ORDER BY rowid DESC LIMIT 1`).get();
  let next = 1;
  if (row) {
    const match = row.id.match(/BTB-INQ-(\d+)$/);
    if (match) next = parseInt(match[1], 10) + 1;
  }
  return `BTB-INQ-${String(next).padStart(4, '0')}`;
}

function _nextOrderNumber() {
  const row = db.prepare(`
    SELECT order_number FROM inquiries
    WHERE order_number IS NOT NULL
    ORDER BY rowid DESC LIMIT 1
  `).get();
  let next = 1;
  if (row) {
    const match = row.order_number.match(/BTB-ORD-(\d+)$/);
    if (match) next = parseInt(match[1], 10) + 1;
  }
  return `BTB-ORD-${String(next).padStart(4, '0')}`;
}

function _logTimeline(inquiryId, adminId, eventType, { fromStatus, toStatus, description } = {}) {
  db.prepare(`
    INSERT INTO inquiry_timeline (inquiry_id, admin_id, event_type, from_status, to_status, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    inquiryId,
    adminId ?? null,
    eventType,
    fromStatus ?? null,
    toStatus ?? null,
    description ?? null,
  );
}

function _syncTotal(inquiryId) {
  const result = db.prepare(`
    SELECT COALESCE(SUM(total_price), 0) AS total FROM inquiry_items WHERE inquiry_id = ?
  `).get(inquiryId);
  db.prepare(`UPDATE inquiries SET total_amount = ? WHERE id = ?`).run(result.total, inquiryId);
}

// ─── GET /api/inquiries/next-id ───────────────────────────────────────────────
function getNextId(req, res) {
  try {
    return res.json({ nextId: _nextInquiryId() });
  } catch (err) {
    console.error('getNextId error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── POST /api/inquiries ──────────────────────────────────────────────────────
function submitInquiry(req, res) {
  try {
    const {
      id, occasion, bouquetType, bouquetName,
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

    db.prepare(`
      INSERT INTO inquiries (
        id, name, contact, phone4, social,
        occasion, bouquet_type, bouquet_name,
        event_date, target_time,
        fulfillment, pickup_location,
        delivery_address, delivery_landmark, delivery_booker,
        receiver_name, receiver_contact,
        details, add_ons, preferred_budget,
        status
      ) VALUES (
        @id, @name, @contact, @phone4, @social,
        @occasion, @bouquetType, @bouquetName,
        @eventDate, @targetTime,
        @fulfillment, @pickupLocation,
        @deliveryAddress, @deliveryLandmark, @deliveryBooker,
        @receiverName, @receiverContact,
        @details, @addOns, @preferredBudget,
        'new_inquiry'
      )
    `).run({
      id,
      name:             customerName,
      contact:          customerContact,
      phone4,
      social:           customerSocial   ?? null,
      occasion:         occasion         ?? null,
      bouquetType,
      bouquetName:      bouquetName      ?? null,
      eventDate:        targetDate       ?? null,
      targetTime:       targetTime       ?? null,
      fulfillment:      fulfillment      ?? null,
      pickupLocation:   pickupLocation   ?? null,
      deliveryAddress:  deliveryAddress  ?? null,
      deliveryLandmark: deliveryLandmark ?? null,
      deliveryBooker:   deliveryBooker   ?? null,
      receiverName:     receiverName     ?? null,
      receiverContact:  receiverContact  ?? null,
      details:          details          ?? null,
      addOns:           Array.isArray(addOns) ? addOns.join(', ') : (addOns ?? null),
      preferredBudget:  preferredBudget  ?? null,
    });

    _logTimeline(id, null, 'status_change', {
      toStatus:    'new_inquiry',
      description: 'Inquiry submitted by customer.',
    });

    return res.status(201).json({ success: true, orderId: id, message: 'Inquiry submitted successfully.' });
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
    if (row.phone4 !== String(phone4).trim()) return res.status(401).json({ error: 'Phone digits do not match.' });

    return res.json({
      id:               row.id,
      order_number:     row.order_number,
      name:             row.name,
      service:          row.bouquet_type,
      status:           row.status,
      payment_status:   row.payment_status,
      total_amount:     row.total_amount,
      amount_paid:      row.amount_paid,
      balance:          (row.total_amount ?? 0) - (row.amount_paid ?? 0),
      created_at:       row.created_at,
      event_date:       row.event_date,
      target_time:      row.target_time,
      fulfillment:      row.fulfillment,
      pickup_location:  row.pickup_location,
      delivery_tracking: row.delivery_tracking,
      message:          row.details ?? '',
      bouquet_name:     row.bouquet_name,
      add_ons:          row.add_ons,
      preferred_budget: row.preferred_budget,
    });
  } catch (err) {
    console.error('trackInquiry error:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again.' });
  }
}

// ─── GET /api/inquiries ───────────────────────────────────────────────────────
// ⚠ FIX: compute balance inline — STORED generated columns can fail in some
//         SQLite builds when referenced by alias in WHERE/SELECT outside the table def.
function getAllInquiries(req, res) {
  try {
    const {
      status, payment_status, fulfillment,
      archived, search, from, to,
      priority, sort = 'created_at', order = 'DESC',
    } = req.query;

    const conditions = [];
    const params     = [];

    if (archived === '1') {
      conditions.push(`is_archived = 1`);
    } else {
      conditions.push(`is_archived = 0`);
    }

    if (status)         { conditions.push(`status = ?`);         params.push(status); }
    if (payment_status) { conditions.push(`payment_status = ?`); params.push(payment_status); }
    if (fulfillment)    { conditions.push(`fulfillment = ?`);     params.push(fulfillment); }
    if (from)           { conditions.push(`event_date >= ?`);     params.push(from); }
    if (to)             { conditions.push(`event_date <= ?`);     params.push(to); }

    if (priority) {
      conditions.push(`priority_tags LIKE ?`);
      params.push(`%${priority}%`);
    }

    if (search) {
      conditions.push(`(name LIKE ? OR id LIKE ? OR order_number LIKE ? OR contact LIKE ?)`);
      const q = `%${search}%`;
      params.push(q, q, q, q);
    }

    const allowedSorts  = ['created_at', 'event_date', 'name', 'total_amount', 'status'];
    const allowedOrders = ['ASC', 'DESC'];
    const safeSort  = allowedSorts.includes(sort)                    ? sort                    : 'created_at';
    const safeOrder = allowedOrders.includes(order.toUpperCase())    ? order.toUpperCase()     : 'DESC';

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const rows = db.prepare(`
      SELECT
        id, order_number, name, contact, social,
        occasion, bouquet_type, bouquet_name,
        event_date, target_time, fulfillment,
        status, is_archived, priority_tags,
        total_amount, amount_paid,
        (COALESCE(total_amount, 0) - COALESCE(amount_paid, 0)) AS balance,
        payment_status,
        created_at, updated_at
      FROM inquiries
      ${where}
      ORDER BY ${safeSort} ${safeOrder}
    `).all(...params);

    return res.json(rows);
  } catch (err) {
    console.error('getAllInquiries error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── GET /api/inquiries/:id ───────────────────────────────────────────────────
function getInquiryById(req, res) {
  try {
    const id  = req.params.id.toUpperCase();

    const row = db.prepare(`
      SELECT *,
        (COALESCE(total_amount, 0) - COALESCE(amount_paid, 0)) AS balance
      FROM inquiries WHERE id = ?
    `).get(id);

    if (!row) return res.status(404).json({ error: 'Not found.' });

    const items       = db.prepare(`SELECT * FROM inquiry_items       WHERE inquiry_id = ? ORDER BY sort_order ASC, id ASC`).all(id);
    const notes       = db.prepare(`SELECT * FROM inquiry_notes       WHERE inquiry_id = ? ORDER BY created_at DESC`).all(id);
    const attachments = db.prepare(`SELECT * FROM inquiry_attachments WHERE inquiry_id = ? ORDER BY created_at DESC`).all(id);
    const timeline    = db.prepare(`SELECT * FROM inquiry_timeline    WHERE inquiry_id = ? ORDER BY created_at ASC`).all(id);

    return res.json({ ...row, items, notes, attachments, timeline });
  } catch (err) {
    console.error('getInquiryById error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── PATCH /api/inquiries/:id/status ─────────────────────────────────────────
function updateInquiryStatus(req, res) {
  try {
    const id               = req.params.id.toUpperCase();
    const { status, note } = req.body;
    const adminId          = req.admin?.id ?? null;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ error: 'Invalid status.' });
    }

    const existing = db.prepare('SELECT status FROM inquiries WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Not found.' });

    const isArchived = ARCHIVE_STATUSES.includes(status) ? 1 : 0;

    db.prepare(`UPDATE inquiries SET status = ?, is_archived = ? WHERE id = ?`).run(status, isArchived, id);

    _logTimeline(id, adminId, 'status_change', {
      fromStatus:  existing.status,
      toStatus:    status,
      description: note ?? null,
    });

    return res.json({ success: true, status, is_archived: isArchived });
  } catch (err) {
    console.error('updateInquiryStatus error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── POST /api/inquiries/:id/confirm ─────────────────────────────────────────
function confirmInquiry(req, res) {
  try {
    const id      = req.params.id.toUpperCase();
    const adminId = req.admin?.id ?? null;

    const existing = db.prepare('SELECT status, order_number FROM inquiries WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Not found.' });

    if (existing.order_number) {
      return res.status(409).json({ error: 'Inquiry already confirmed.', order_number: existing.order_number });
    }

    const orderNumber = _nextOrderNumber();

    db.prepare(`UPDATE inquiries SET status = 'confirmed', order_number = ?, is_archived = 0 WHERE id = ?`).run(orderNumber, id);

    _logTimeline(id, adminId, 'confirmed', {
      fromStatus:  existing.status,
      toStatus:    'confirmed',
      description: `Order number ${orderNumber} assigned.`,
    });

    return res.json({ success: true, order_number: orderNumber });
  } catch (err) {
    console.error('confirmInquiry error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── PUT /api/inquiries/:id/quotation ────────────────────────────────────────
function updateQuotation(req, res) {
  try {
    const id      = req.params.id.toUpperCase();
    const adminId = req.admin?.id ?? null;
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ error: 'items must be an array.' });
    }

    const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Not found.' });

    const validTypes = ['bouquet', 'addon', 'delivery', 'adjustment'];

    const insertItem = db.prepare(`
      INSERT INTO inquiry_items (inquiry_id, item_type, name, description, quantity, unit_price, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const replaceAll = db.transaction(() => {
      db.prepare('DELETE FROM inquiry_items WHERE inquiry_id = ?').run(id);
      items.forEach((item, idx) => {
        const type = validTypes.includes(item.item_type) ? item.item_type : 'bouquet';
        insertItem.run(
          id, type,
          String(item.name ?? '').trim() || 'Unnamed item',
          item.description ?? null,
          Math.max(1, parseInt(item.quantity, 10) || 1),
          parseFloat(item.unit_price) || 0,
          item.sort_order ?? idx,
        );
      });
      _syncTotal(id);
    });

    replaceAll();

    _logTimeline(id, adminId, 'payment_update', {
      description: `Quotation updated with ${items.length} item(s).`,
    });

    const updated    = db.prepare(`
      SELECT total_amount, (COALESCE(total_amount,0)-COALESCE(amount_paid,0)) AS balance
      FROM inquiries WHERE id = ?
    `).get(id);
    const savedItems = db.prepare('SELECT * FROM inquiry_items WHERE inquiry_id = ? ORDER BY sort_order ASC').all(id);

    return res.json({ success: true, total_amount: updated.total_amount, balance: updated.balance, items: savedItems });
  } catch (err) {
    console.error('updateQuotation error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── PATCH /api/inquiries/:id/payment ────────────────────────────────────────
function updatePayment(req, res) {
  try {
    const id      = req.params.id.toUpperCase();
    const adminId = req.admin?.id ?? null;
    const { amount_paid, payment_status, downpayment } = req.body;

    const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Not found.' });

    const validPayStatuses = ['unpaid', 'downpayment_paid', 'fully_paid', 'refunded'];
    if (payment_status && !validPayStatuses.includes(payment_status)) {
      return res.status(400).json({ error: 'Invalid payment_status.' });
    }

    const fields = [];
    const values = [];

    if (amount_paid    !== undefined) { fields.push('amount_paid = ?');    values.push(parseFloat(amount_paid) || 0); }
    if (downpayment    !== undefined) { fields.push('downpayment = ?');    values.push(parseFloat(downpayment) || 0); }
    if (payment_status !== undefined) { fields.push('payment_status = ?'); values.push(payment_status); }

    if (!fields.length) return res.status(400).json({ error: 'No payment fields provided.' });

    values.push(id);
    db.prepare(`UPDATE inquiries SET ${fields.join(', ')} WHERE id = ?`).run(...values);

    _logTimeline(id, adminId, 'payment_update', {
      description: `Payment updated: ${fields.join(', ')}.`,
    });

    const updated = db.prepare(`
      SELECT amount_paid, downpayment, payment_status,
             (COALESCE(total_amount,0) - COALESCE(amount_paid,0)) AS balance
      FROM inquiries WHERE id = ?
    `).get(id);

    return res.json({ success: true, ...updated });
  } catch (err) {
    console.error('updatePayment error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── PATCH /api/inquiries/:id/priority ───────────────────────────────────────
function updatePriority(req, res) {
  try {
    const id      = req.params.id.toUpperCase();
    const { tags } = req.body;

    const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Not found.' });

    const validTags = ['rush', 'vip', 'high_value', 'scheduled'];
    const cleanTags = Array.isArray(tags) ? tags.filter(t => validTags.includes(t)) : [];

    db.prepare('UPDATE inquiries SET priority_tags = ? WHERE id = ?').run(JSON.stringify(cleanTags), id);

    return res.json({ success: true, priority_tags: cleanTags });
  } catch (err) {
    console.error('updatePriority error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── PATCH /api/inquiries/:id/delivery ───────────────────────────────────────
function updateDelivery(req, res) {
  try {
    const id = req.params.id.toUpperCase();
    const { delivery_tracking, delivery_booker } = req.body;

    const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Not found.' });

    db.prepare(`UPDATE inquiries SET delivery_tracking = ?, delivery_booker = ? WHERE id = ?`)
      .run(delivery_tracking ?? null, delivery_booker ?? null, id);

    return res.json({ success: true });
  } catch (err) {
    console.error('updateDelivery error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── POST /api/inquiries/:id/notes ───────────────────────────────────────────
function addNote(req, res) {
  try {
    const id      = req.params.id.toUpperCase();
    const adminId = req.admin?.id ?? null;
    const { note } = req.body;

    if (!note?.trim()) return res.status(400).json({ error: 'Note cannot be empty.' });

    const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Not found.' });

    const result = db.prepare(`INSERT INTO inquiry_notes (inquiry_id, admin_id, note) VALUES (?, ?, ?)`)
      .run(id, adminId, note.trim());

    _logTimeline(id, adminId, 'note_added', { description: 'Internal note added.' });

    const saved = db.prepare('SELECT * FROM inquiry_notes WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, note: saved });
  } catch (err) {
    console.error('addNote error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── POST /api/inquiries/:id/attachments ─────────────────────────────────────
function addAttachment(req, res) {
  try {
    const id      = req.params.id.toUpperCase();
    const adminId = req.admin?.id ?? null;
    const { attach_type, label, url, is_external = 0, uploaded_by = 'admin' } = req.body;

    if (!url?.trim()) return res.status(400).json({ error: 'URL or path is required.' });

    const existing = db.prepare('SELECT id FROM inquiries WHERE id = ?').get(id);
    if (!existing) return res.status(404).json({ error: 'Not found.' });

    const validTypes     = ['peg_image', 'receipt', 'screenshot', 'external_link', 'other'];
    const validUploaders = ['customer', 'admin'];
    const safeType       = validTypes.includes(attach_type)     ? attach_type : 'other';
    const safeUploader   = validUploaders.includes(uploaded_by) ? uploaded_by : 'admin';

    const result = db.prepare(`
      INSERT INTO inquiry_attachments (inquiry_id, attach_type, label, url, is_external, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, safeType, label ?? null, url.trim(), is_external ? 1 : 0, safeUploader);

    _logTimeline(id, adminId, 'attachment_added', { description: `Attachment added: ${safeType}.` });

    const saved = db.prepare('SELECT * FROM inquiry_attachments WHERE id = ?').get(result.lastInsertRowid);
    return res.status(201).json({ success: true, attachment: saved });
  } catch (err) {
    console.error('addAttachment error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── DELETE /api/inquiries/:id/attachments/:attachId ─────────────────────────
function deleteAttachment(req, res) {
  try {
    const id       = req.params.id.toUpperCase();
    const attachId = parseInt(req.params.attachId, 10);

    const result = db.prepare(`DELETE FROM inquiry_attachments WHERE id = ? AND inquiry_id = ?`)
      .run(attachId, id);

    if (result.changes === 0) return res.status(404).json({ error: 'Attachment not found.' });
    return res.json({ success: true });
  } catch (err) {
    console.error('deleteAttachment error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

// ─── GET /api/inquiries/stats ─────────────────────────────────────────────────
// ⚠ FIX: compute balance inline to avoid STORED column reference issues
function getStats(req, res) {
  try {
    const statusCounts = db.prepare(`
      SELECT status, COUNT(*) AS count
      FROM inquiries
      WHERE is_archived = 0
      GROUP BY status
    `).all();

    const paymentSummary = db.prepare(`
      SELECT
        COUNT(*) AS total_active,
        SUM(total_amount) AS total_value,
        SUM(amount_paid)  AS total_collected,
        SUM(COALESCE(total_amount, 0) - COALESCE(amount_paid, 0)) AS total_outstanding
      FROM inquiries
      WHERE is_archived = 0
    `).get();

    const archiveCount = db.prepare(`SELECT COUNT(*) AS count FROM inquiries WHERE is_archived = 1`).get();

    return res.json({ statusCounts, paymentSummary, archiveCount: archiveCount.count });
  } catch (err) {
    console.error('getStats error:', err.message);
    return res.status(500).json({ error: 'Server error.' });
  }
}

module.exports = {
  getNextId,
  submitInquiry,
  trackInquiry,
  getAllInquiries,
  getInquiryById,
  getStats,
  updateInquiryStatus,
  confirmInquiry,
  updateQuotation,
  updatePayment,
  updatePriority,
  updateDelivery,
  addNote,
  addAttachment,
  deleteAttachment,
};