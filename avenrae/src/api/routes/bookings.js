/**
 * Bookings API Routes
 * RESTful endpoints for booking management
 */

const { query, beginTransaction, commit, rollback } = require('../database/db');

/**
 * Create new booking
 * POST /api/bookings
 * Body: { client_id, healer_id, service_id, booking_date, booking_type }
 */
async function createBooking(req, res) {
  const connection = await beginTransaction();

  try {
    const { client_id, healer_id, service_id, booking_date, booking_type = 'online', notes } = req.body;

    // Validate required fields
    if (!client_id || !healer_id || !service_id || !booking_date) {
      await rollback(connection);
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    // Get service details
    const serviceSql = `SELECT * FROM services WHERE id = ? AND healer_id = ?`;
    const services = await connection.execute(serviceSql, [service_id, healer_id]);
    
    if (services[0].length === 0) {
      await rollback(connection);
      return res.status(404).json({ success: false, error: 'Service not found' });
    }

    const service = services[0][0];

    // Calculate price with discount
    const discountAmount = (service.price * service.discount_percentage) / 100;
    const totalPrice = service.price - discountAmount;

    // Insert booking
    const insertSql = `
      INSERT INTO bookings 
      (client_id, healer_id, service_id, booking_date, duration_minutes, 
       booking_type, price, discount_applied, total_price, status, payment_status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid', ?)
    `;

    const [result] = await connection.execute(insertSql, [
      client_id,
      healer_id,
      service_id,
      booking_date,
      service.duration_minutes,
      booking_type,
      service.price,
      discountAmount,
      totalPrice,
      notes || null,
    ]);

    // Create notification
    const notifySql = `
      INSERT INTO notifications 
      (user_id, notification_type, title, message, related_booking_id)
      VALUES (?, 'booking_confirmed', ?, ?, ?)
    `;

    await connection.execute(notifySql, [
      healer_id,
      'New Booking Received',
      `A new booking has been received for ${service.service_name}`,
      result.insertId,
    ]);

    await commit(connection);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { bookingId: result.insertId, totalPrice },
    });
  } catch (error) {
    await rollback(connection);
    console.error('Error creating booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get client bookings
 * GET /api/bookings/client/:client_id
 */
async function getClientBookings(req, res) {
  try {
    const { client_id } = req.params;

    const sql = `
      SELECT b.*, 
             s.service_name, s.duration_minutes,
             h.user_id as healer_user_id,
             u.first_name, u.last_name, u.profile_image_url
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN healers h ON b.healer_id = h.id
      JOIN users u ON h.user_id = u.id
      WHERE b.client_id = ?
      ORDER BY b.booking_date DESC
    `;

    const bookings = await query(sql, [client_id]);

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get healer bookings (schedule)
 * GET /api/bookings/healer/:healer_id
 */
async function getHealerBookings(req, res) {
  try {
    const { healer_id } = req.params;
    const { from_date, to_date } = req.query;

    let sql = `
      SELECT b.*, 
             s.service_name, s.duration_minutes,
             c.user_id as client_user_id,
             u.first_name, u.last_name, u.phone
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN clients c ON b.client_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE b.healer_id = ?
    `;

    const params = [healer_id];

    if (from_date && to_date) {
      sql += ' AND DATE(b.booking_date) BETWEEN ? AND ?';
      params.push(from_date, to_date);
    }

    sql += ' ORDER BY b.booking_date ASC';

    const bookings = await query(sql, params);

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching healer bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Update booking status
 * PUT /api/bookings/:id
 */
async function updateBooking(req, res) {
  try {
    const { id } = req.params;
    const { status, payment_status, client_rating, client_feedback } = req.body;

    let sql = 'UPDATE bookings SET ';
    const updates = [];
    const params = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }
    if (payment_status) {
      updates.push('payment_status = ?');
      params.push(payment_status);
    }
    if (client_rating) {
      updates.push('client_rating = ?');
      params.push(client_rating);
    }
    if (client_feedback) {
      updates.push('client_feedback = ?');
      params.push(client_feedback);
    }

    updates.push('updated_at = NOW()');

    sql += updates.join(', ') + ' WHERE id = ?';
    params.push(id);

    const result = await query(sql, params);

    res.json({
      success: true,
      message: 'Booking updated successfully',
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Cancel booking
 * DELETE /api/bookings/:id
 */
async function cancelBooking(req, res) {
  const connection = await beginTransaction();

  try {
    const { id } = req.params;

    // Update booking status
    const updateSql = 'UPDATE bookings SET status = ?, updated_at = NOW() WHERE id = ?';
    await connection.execute(updateSql, ['cancelled', id]);

    // If paid, create refund transaction
    const bookingSql = 'SELECT * FROM bookings WHERE id = ?';
    const [bookings] = await connection.execute(bookingSql, [id]);

    if (bookings[0]?.payment_status === 'paid') {
      const refundSql = `
        INSERT INTO transactions 
        (transaction_type, user_id, related_booking_id, amount, transaction_status)
        VALUES ('refund', ?, ?, ?, 'completed')
      `;
      await connection.execute(refundSql, [
        bookings[0].client_id,
        id,
        bookings[0].total_price,
      ]);
    }

    await commit(connection);

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    await rollback(connection);
    console.error('Error cancelling booking:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  createBooking,
  getClientBookings,
  getHealerBookings,
  updateBooking,
  cancelBooking,
};
