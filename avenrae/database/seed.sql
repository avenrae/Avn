
-- Avenrae Platform - Sample Data (Seed)
-- Insert sample data for testing and development

-- ============================================================================
-- SAMPLE USERS - CLIENTS
-- ============================================================================

INSERT INTO users (email, password_hash, first_name, last_name, phone, bio, user_type, is_verified) VALUES
('thandi.molefe@example.com', '$2b$10$hash1', 'Thandi', 'Molefe', '0721234567', 'Seeking wellness and spiritual growth', 'client', TRUE),
('lerato.khumalo@example.com', '$2b$10$hash2', 'Lerato', 'Khumalo', '0731234567', 'Interested in holistic healing', 'client', TRUE),
('sipho.nkosi@example.com', '$2b$10$hash3', 'Sipho', 'Nkosi', '0741234567', 'Looking for guidance and insights', 'client', TRUE),
('zara.dlamini@example.com', '$2b$10$hash4', 'Zara', 'Dlamini', '0751234567', 'Spiritual development enthusiast', 'client', TRUE),
('james.okonkwo@example.com', '$2b$10$hash5', 'James', 'Okonkwo', '0761234567', 'New to healing journey', 'client', TRUE);

-- ============================================================================
-- SAMPLE USERS - HEALERS
-- ============================================================================

INSERT INTO users (email, password_hash, first_name, last_name, phone, bio, user_type, is_verified) VALUES
('dr.lerato.psychology@example.com', '$2b$10$hash6', 'Dr. Lerato', 'Mthembu', '0771234567', 'Professional psychologist with 15 years experience', 'healer', TRUE),
('dr.sipho.optometry@example.com', '$2b$10$hash7', 'Dr. Sipho', 'Mokoena', '0781234567', 'Certified optometrist offering holistic eye care', 'healer', TRUE),
('nandi.counsellor@example.com', '$2b$10$hash8', 'Nandi', 'Dlamini', '0791234567', 'Compassionate counsellor and life coach', 'healer', TRUE),
('thabo.spiritual@example.com', '$2b$10$hash9', 'Thabo', 'Nkosi', '0801234567', 'Spiritual healer and energy practitioner', 'healer', TRUE),
('amara.medium@example.com', '$2b$10$hash10', 'Amara', 'Adeyemi', '0811234567', 'Gifted medium with 20 years experience', 'healer', TRUE),
('prophet.david@example.com', '$2b$10$hash11', 'Prophet', 'David', '0821234567', 'Spiritual prophet and guide', 'healer', TRUE);

-- ============================================================================
-- CLIENT PROFILES
-- ============================================================================

INSERT INTO clients (user_id, date_of_birth, gender, preferences, is_newsletter_subscribed) VALUES
(1, '1990-05-15', 'female', 'Prefers online sessions, interested in energy healing', TRUE),
(2, '1985-08-22', 'male', 'Prefers evening sessions, traditional healing', TRUE),
(3, '1992-03-10', 'male', 'Open to all types of healing', TRUE),
(4, '1988-11-30', 'female', 'Interested in spiritual development', TRUE),
(5, '1995-07-17', 'male', 'New to wellness, flexible scheduling', TRUE);

-- ============================================================================
-- HEALER PROFILES
-- ============================================================================

INSERT INTO healers (user_id, specialization, healer_type, years_of_experience, qualifications, hourly_rate, availability_status, is_verified_healer, is_featured) VALUES
(6, 'Clinical Psychology & Trauma Healing', 'psychologist', 15, 'PhD in Clinical Psychology, Accredited Trauma Specialist', 450.00, 'available', TRUE, TRUE),
(7, 'Holistic Optometry & Vision Wellness', 'optometrist', 12, 'BSc Optometry, Naturopathic Vision Specialist', 300.00, 'available', TRUE, FALSE),
(8, 'Life Coaching & Emotional Counselling', 'counsellor', 8, 'Masters in Counselling Psychology, Certified Life Coach', 250.00, 'busy', TRUE, FALSE),
(9, 'Energy Healing & Spiritual Wellness', 'spiritual_healer', 20, 'Reiki Master, Crystal Therapy Certified, Chakra Alignment Specialist', 200.00, 'available', TRUE, TRUE),
(10, 'Mediumship & Spiritual Communication', 'medium', 20, 'Certified Medium, Spirit Guide Practitioner', 350.00, 'offline', TRUE, TRUE),
(11, 'Prophetic Guidance & Spiritual Counselling', 'prophet', 18, 'Ordained Spiritual Leader, Intuitive Development Specialist', 300.00, 'available', TRUE, FALSE);

-- ============================================================================
-- SERVICES
-- ============================================================================

INSERT INTO services (healer_id, service_name, service_description, service_category, duration_minutes, price, discount_percentage, is_active) VALUES
(1, 'Individual Therapy Session', 'One-on-one therapy session for mental health and wellbeing', 'consultation', 60, 450.00, 0.00, TRUE),
(1, 'Trauma Release Session', 'Specialized trauma processing and healing session', 'healing', 90, 600.00, 5.00, TRUE),
(1, 'Group Workshop - Mental Wellness', 'Interactive workshop for groups on mental health', 'workshop', 120, 150.00, 0.00, TRUE),
(2, 'Eye Health Consultation', 'Comprehensive eye examination and wellness advice', 'consultation', 45, 300.00, 0.00, TRUE),
(2, 'Vision Restoration Session', 'Holistic approach to improving vision naturally', 'healing', 60, 400.00, 10.00, TRUE),
(3, 'Life Coaching Session', 'Personal development and life direction coaching', 'coaching', 60, 250.00, 0.00, TRUE),
(3, 'Relationship Counselling', 'Couples or family counselling and mediation', 'consultation', 90, 300.00, 0.00, TRUE),
(4, 'Energy Healing Session', 'Full body energy balancing and chakra alignment', 'healing', 60, 200.00, 0.00, TRUE),
(4, 'Reiki Master Session', 'Traditional Reiki healing practice', 'healing', 45, 150.00, 0.00, TRUE),
(4, 'Crystal Therapy Workshop', 'Learn about crystals and their healing properties', 'workshop', 120, 120.00, 0.00, TRUE),
(5, 'Spirit Communication Reading', 'Connect with loved ones through mediumship', 'reading', 60, 350.00, 0.00, TRUE),
(5, 'Personal Guidance Session', 'Spiritual insights and guidance from the other side', 'consultation', 45, 300.00, 0.00, TRUE),
(6, 'Prophetic Reading', 'Receive spiritual prophecy and guidance', 'reading', 60, 300.00, 0.00, TRUE),
(6, 'Spiritual Direction Coaching', 'Guidance on your spiritual path and calling', 'coaching', 90, 350.00, 5.00, TRUE);

-- ============================================================================
-- PRODUCTS
-- ============================================================================

INSERT INTO products (product_name, product_description, product_category, product_type, price, cost_price, stock_quantity, sku, is_active) VALUES
('Clear Quartz Crystal Point', 'Natural clear quartz crystal for energy amplification', 'Crystals', 'crystal', 50.00, 20.00, 25, 'CQ-POINT-001', TRUE),
('Amethyst Geode', 'Beautiful amethyst geode for spiritual growth', 'Crystals', 'crystal', 120.00, 50.00, 15, 'AM-GEO-002', TRUE),
('Rose Quartz Heart', 'Rose quartz stone for love and compassion', 'Crystals', 'crystal', 45.00, 18.00, 30, 'RQ-HEART-003', TRUE),
('The Power of Now - Eckhart Tolle', 'Life-changing spiritual philosophy book', 'Books', 'book', 280.00, 100.00, 40, 'PON-TOLLE-001', TRUE),
('Chakras for Beginners - Diana Cooper', 'Comprehensive guide to chakra healing', 'Books', 'book', 250.00, 90.00, 35, 'CHK-COOPER-002', TRUE),
('Healing Crystals Guide', 'Complete reference for crystal properties', 'Books', 'book', 320.00, 120.00, 20, 'HCG-REF-003', TRUE),
('Tarot Divinity Deck', 'Beautiful 78-card tarot deck', 'Tools', 'tool', 350.00, 140.00, 12, 'TAR-DIV-001', TRUE),
('Oracle Guidance Cards', 'Spiritual guidance oracle cards set', 'Tools', 'tool', 280.00, 110.00, 18, 'ORA-GUID-002', TRUE),
('Crystal Singing Bowl', 'Quartz crystal singing bowl for meditation', 'Tools', 'tool', 800.00, 300.00, 5, 'SB-QUARTZ-003', TRUE),
('Healing Herbal Tea Blend', 'Organic blend for wellness and healing', 'Supplements', 'supplement', 85.00, 30.00, 50, 'HT-BLEND-001', TRUE),
('Chakra Balance Vitamins', 'Specialized supplement for energy balance', 'Supplements', 'supplement', 120.00, 45.00, 35, 'CH-VIT-002', TRUE),
('Organic Lavender Oil', 'Pure lavender essential oil for relaxation', 'Supplements', 'supplement', 95.00, 35.00, 40, 'LAV-OIL-003', TRUE),
('Meditation Cushion - Purple', 'Comfortable meditation/yoga cushion', 'Apparel', 'apparel', 180.00, 70.00, 25, 'MED-CUSH-PURPLE', TRUE),
('Healing Yoga Mat - Natural', 'Eco-friendly natural rubber yoga mat', 'Apparel', 'apparel', 450.00, 180.00, 15, 'YOGA-MAT-NATURAL', TRUE);

-- ============================================================================
-- HEALER AVAILABILITY
-- ============================================================================

INSERT INTO healer_availability (healer_id, day_of_week, start_time, end_time, is_available, break_start, break_end) VALUES
-- Dr. Lerato Psychologist (Monday-Friday)
(1, 0, '09:00:00', '17:00:00', TRUE, '12:00:00', '13:00:00'),
(1, 1, '09:00:00', '17:00:00', TRUE, '12:00:00', '13:00:00'),
(1, 2, '09:00:00', '17:00:00', TRUE, '12:00:00', '13:00:00'),
(1, 3, '09:00:00', '17:00:00', TRUE, '12:00:00', '13:00:00'),
(1, 4, '09:00:00', '17:00:00', TRUE, '12:00:00', '13:00:00'),
-- Dr. Sipho Optometrist (Tuesday-Saturday)
(2, 1, '10:00:00', '18:00:00', TRUE, '13:00:00', '14:00:00'),
(2, 2, '10:00:00', '18:00:00', TRUE, '13:00:00', '14:00:00'),
(2, 3, '10:00:00', '18:00:00', TRUE, '13:00:00', '14:00:00'),
(2, 4, '10:00:00', '18:00:00', TRUE, '13:00:00', '14:00:00'),
(2, 5, '10:00:00', '16:00:00', TRUE, '13:00:00', '14:00:00'),
-- Nandi Counsellor (Flexible)
(3, 0, '14:00:00', '20:00:00', TRUE, NULL, NULL),
(3, 1, '09:00:00', '17:00:00', TRUE, '12:00:00', '13:00:00'),
(3, 2, '09:00:00', '17:00:00', TRUE, '12:00:00', '13:00:00'),
(3, 3, '14:00:00', '20:00:00', TRUE, NULL, NULL),
(3, 4, '09:00:00', '17:00:00', TRUE, '12:00:00', '13:00:00'),
(3, 5, '10:00:00', '16:00:00', TRUE, NULL, NULL),
(3, 6, '14:00:00', '20:00:00', TRUE, NULL, NULL),
-- Thabo Spiritual Healer (7 days)
(4, 0, '08:00:00', '20:00:00', TRUE, '12:00:00', '13:00:00'),
(4, 1, '08:00:00', '20:00:00', TRUE, '12:00:00', '13:00:00'),
(4, 2, '08:00:00', '20:00:00', TRUE, '12:00:00', '13:00:00'),
(4, 3, '08:00:00', '20:00:00', TRUE, '12:00:00', '13:00:00'),
(4, 4, '08:00:00', '20:00:00', TRUE, '12:00:00', '13:00:00'),
(4, 5, '08:00:00', '20:00:00', TRUE, '12:00:00', '13:00:00'),
(4, 6, '10:00:00', '18:00:00', TRUE, '14:00:00', '15:00:00'),
-- Amara Medium (Wednesday-Sunday)
(5, 2, '16:00:00', '22:00:00', TRUE, NULL, NULL),
(5, 3, '16:00:00', '22:00:00', TRUE, NULL, NULL),
(5, 4, '16:00:00', '22:00:00', TRUE, NULL, NULL),
(5, 5, '14:00:00', '20:00:00', TRUE, NULL, NULL),
(5, 6, '14:00:00', '20:00:00', TRUE, NULL, NULL);

-- ============================================================================
-- EVENTS
-- ============================================================================

INSERT INTO events (event_name, event_description, event_type, organizer_healer_id, event_date, duration_hours, location_address, max_capacity, price, status) VALUES
('Breathwork & Reset Workshop', 'Learn powerful breathwork techniques for stress relief', 'workshop', 4, '2025-11-20 18:00:00', 2, 'Durban Wellness Center, Durban', 30, 150.00, 'scheduled'),
('Community Care Circle', 'Join our healing circle for collective energy work', 'circle', 4, '2025-11-25 19:00:00', 2, 'Avenrae Sanctuary, Online', 50, 100.00, 'scheduled'),
('Tarot & Divination Masterclass', 'Deep dive into tarot reading techniques', 'training', 5, '2025-12-03 18:00:00', 3, 'Online', 20, 200.00, 'scheduled'),
('Spiritual Awakening Retreat', '3-day transformative spiritual retreat', 'retreat', 6, '2025-12-10 09:00:00', 72, 'Mountain Sanctuary, Drakensberg', 15, 2000.00, 'scheduled'),
('Healing & Wellness Festival', 'Annual celebration of health and spirituality', 'celebration', NULL, '2025-12-15 10:00:00', 8, 'Durban Expo Center, Durban', 500, 50.00, 'scheduled'),
('Crystal Workshop for Beginners', 'Introduction to crystal healing', 'workshop', 4, '2025-12-08 19:00:00', 2, 'Online', 25, 120.00, 'scheduled');

-- ============================================================================
-- BOOKINGS (Sample - Past and Future)
-- ============================================================================

INSERT INTO bookings (client_id, healer_id, service_id, booking_date, duration_minutes, status, booking_type, meeting_link, price, total_price, payment_status, client_rating) VALUES
(1, 1, 1, '2025-11-10 14:00:00', 60, 'completed', 'online', 'https://zoom.us/meeting/123', 450.00, 450.00, 'paid', 5),
(2, 2, 4, '2025-11-12 15:30:00', 45, 'confirmed', 'in_person', NULL, 300.00, 300.00, 'paid', NULL),
(3, 4, 8, '2025-11-15 10:00:00', 60, 'pending', 'online', NULL, 200.00, 200.00, 'unpaid', NULL),
(4, 3, 6, '2025-11-18 17:00:00', 60, 'confirmed', 'online', 'https://zoom.us/meeting/456', 250.00, 250.00, 'paid', NULL),
(5, 9, 13, '2025-11-22 19:00:00', 60, 'pending', 'online', NULL, 300.00, 300.00, 'unpaid', NULL);

-- ============================================================================
-- EVENT REGISTRATIONS
-- ============================================================================

INSERT INTO event_registrations (event_id, client_id, attendance_status, price_paid, payment_status) VALUES
(1, 1, 'registered', 150.00, 'paid'),
(1, 2, 'registered', 150.00, 'paid'),
(1, 3, 'registered', 150.00, 'unpaid'),
(2, 4, 'registered', 100.00, 'paid'),
(2, 5, 'registered', 100.00, 'paid'),
(3, 1, 'registered', 200.00, 'paid'),
(4, 2, 'registered', 2000.00, 'paid');

-- ============================================================================
-- PRODUCTS ORDERS
-- ============================================================================

INSERT INTO orders (client_id, order_number, status, subtotal, tax_amount, shipping_cost, total_amount, payment_status, payment_method, shipping_address) VALUES
(1, 'ORD-001-2025', 'delivered', 500.00, 50.00, 30.00, 580.00, 'paid', 'credit_card', '123 Wellness Road, Durban, 4000'),
(2, 'ORD-002-2025', 'processing', 350.00, 35.00, 30.00, 415.00, 'paid', 'debit_card', '456 Healing Lane, Johannesburg, 2000'),
(3, 'ORD-003-2025', 'pending', 200.00, 20.00, 30.00, 250.00, 'unpaid', NULL, '789 Spirit Street, Cape Town, 8000'),
(4, 'ORD-004-2025', 'delivered', 800.00, 80.00, 0.00, 880.00, 'paid', 'paypal', '321 Energy Avenue, Pretoria, 0001'),
(5, 'ORD-005-2025', 'shipped', 450.00, 45.00, 30.00, 525.00, 'paid', 'credit_card', '654 Light Lane, Bloemfontein, 9000');

-- ============================================================================
-- ORDER ITEMS
-- ============================================================================

INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES
(1, 1, 2, 50.00, 100.00),
(1, 4, 1, 280.00, 280.00),
(1, 9, 1, 120.00, 120.00),
(2, 2, 1, 120.00, 120.00),
(2, 6, 1, 250.00, 250.00),
(3, 3, 1, 45.00, 45.00),
(3, 10, 1, 85.00, 85.00),
(3, 12, 1, 95.00, 95.00),
(4, 7, 1, 350.00, 350.00),
(4, 8, 1, 280.00, 280.00),
(4, 11, 1, 120.00, 120.00),
(5, 5, 1, 250.00, 250.00),
(5, 13, 1, 180.00, 180.00),
(5, 14, 1, 450.00, 450.00);

-- ============================================================================
-- REVIEWS
-- ============================================================================

INSERT INTO reviews (reviewer_client_id, healer_id, booking_id, rating, title, review_text, review_type, is_verified_purchase) VALUES
(1, 1, 1, 5, 'Life-changing experience!', 'Dr. Lerato is an exceptional therapist. Her insight and compassion were transformative. I felt heard and supported throughout my session.', 'healer', TRUE),
(2, 2, 2, 4, 'Very professional', 'Great eye care consultation. Dr. Sipho explained everything clearly. Will definitely return.', 'healer', TRUE),
(4, 3, 4, 5, 'Amazing coach', 'Nandi helped me gain clarity on my life path. Her guidance is invaluable. Highly recommended!', 'healer', TRUE);

-- ============================================================================
-- FAVORITE HEALERS
-- ============================================================================

INSERT INTO favorite_healers (client_id, healer_id) VALUES
(1, 1),
(1, 4),
(2, 2),
(3, 4),
(3, 9),
(4, 3),
(4, 4),
(5, 4);

-- ============================================================================
-- WISHLIST ITEMS
-- ============================================================================

INSERT INTO wishlist_items (client_id, product_id) VALUES
(1, 2),
(1, 7),
(2, 5),
(2, 9),
(3, 1),
(3, 10),
(4, 6),
(4, 14),
(5, 8);

-- ============================================================================
-- COUPONS
-- ============================================================================

INSERT INTO coupons (coupon_code, description, discount_type, discount_value, max_uses, valid_from, valid_until, minimum_purchase_amount, applicable_to, is_active) VALUES
('WELCOME20', 'Welcome discount for new users', 'percentage', 20.00, 1000, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 0.00, 'all', TRUE),
('HEALING50', 'R50 off healing services', 'fixed', 50.00, 500, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 0.00, 'services', TRUE),
('STORE15', '15% off store items', 'percentage', 15.00, 300, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 100.00, 'products', TRUE),
('EVENT100', 'R100 off event registrations', 'fixed', 100.00, 200, '2025-01-01 00:00:00', '2025-12-31 23:59:59', 200.00, 'events', TRUE);

-- ============================================================================
-- PLATFORM SETTINGS
-- ============================================================================

INSERT INTO platform_settings (setting_key, setting_value, setting_type, description) VALUES
('platform_name', 'Avenrae', 'string', 'Name of the platform'),
('support_email', 'support@avenrae.com', 'string', 'Support email address'),
('phone_number', '+27 (0)31 2345678', 'string', 'Platform phone number'),
('tax_rate', '10', 'number', 'Default tax percentage'),
('currency', 'ZAR', 'string', 'Platform currency'),
('booking_confirmation_enabled', 'true', 'boolean', 'Send booking confirmations'),
('auto_reminder_hours', '24', 'number', 'Hours before booking to send reminder'),
('max_healer_sessions_per_day', '8', 'number', 'Maximum sessions per healer per day'),
('booking_cancellation_hours', '24', 'number', 'Hours required to cancel without penalty');
