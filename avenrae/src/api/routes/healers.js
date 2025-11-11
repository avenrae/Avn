/**
 * Healers API Routes
 * RESTful endpoints for healer management
 */

const { query } = require('../database/db');

/**
 * Get all healers with filters
 * GET /api/healers?type=psychologist&sort=rating&limit=10
 */
async function getHealers(req, res) {
  try {
    const { healer_type, sort = 'rating', limit = 20, offset = 0 } = req.query;

    let sql = `
      SELECT h.id, u.first_name, u.last_name, u.phone, u.profile_image_url,
             h.healer_type, h.specialization, h.hourly_rate, h.rating, h.total_reviews,
             h.years_of_experience, h.availability_status
      FROM healers h
      JOIN users u ON h.user_id = u.id
      WHERE h.is_verified_healer = TRUE
    `;

    const params = [];

    if (healer_type) {
      sql += ' AND h.healer_type = ?';
      params.push(healer_type);
    }

    sql += ` ORDER BY h.${sort} DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const healers = await query(sql, params);

    res.json({
      success: true,
      data: healers,
      pagination: { limit: parseInt(limit), offset: parseInt(offset) },
    });
  } catch (error) {
    console.error('Error fetching healers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get healer details by ID
 * GET /api/healers/:id
 */
async function getHealerById(req, res) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT h.*, u.first_name, u.last_name, u.email, u.phone, u.profile_image_url, u.bio
      FROM healers h
      JOIN users u ON h.user_id = u.id
      WHERE h.id = ?
    `;

    const healers = await query(sql, [id]);

    if (healers.length === 0) {
      return res.status(404).json({ success: false, error: 'Healer not found' });
    }

    const healer = healers[0];

    // Get services
    const servicesSql = `SELECT * FROM services WHERE healer_id = ? AND is_active = TRUE`;
    const services = await query(servicesSql, [id]);

    // Get reviews
    const reviewsSql = `
      SELECT r.*, c_user.first_name, c_user.last_name
      FROM reviews r
      JOIN clients c ON r.reviewer_client_id = c.id
      JOIN users c_user ON c.user_id = c_user.id
      WHERE r.healer_id = ?
      ORDER BY r.created_at DESC
      LIMIT 10
    `;
    const reviews = await query(reviewsSql, [id]);

    res.json({
      success: true,
      data: {
        healer,
        services,
        reviews,
      },
    });
  } catch (error) {
    console.error('Error fetching healer details:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get healer availability
 * GET /api/healers/:id/availability
 */
async function getHealerAvailability(req, res) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT * FROM healer_availability
      WHERE healer_id = ?
      ORDER BY day_of_week
    `;

    const availability = await query(sql, [id]);

    res.json({ success: true, data: availability });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Get healer's booked slots
 * GET /api/healers/:id/bookings?date=2025-11-15
 */
async function getHealerBookings(req, res) {
  try {
    const { id } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, error: 'Date parameter required' });
    }

    const sql = `
      SELECT b.booking_date, s.duration_minutes
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.healer_id = ?
        AND DATE(b.booking_date) = ?
        AND b.status IN ('confirmed', 'pending')
      ORDER BY b.booking_date
    `;

    const bookings = await query(sql, [id, date]);

    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

module.exports = {
  getHealers,
  getHealerById,
  getHealerAvailability,
  getHealerBookings,
};
