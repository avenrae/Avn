-- Avenrae Platform Database Schema
-- Comprehensive database for managing healers, clients, bookings, events, and e-commerce

-- Create database
-- CREATE DATABASE avenrae_db;
-- USE avenrae_db;

-- ============================================================================
-- USERS MANAGEMENT
-- ============================================================================

-- Users table (base for both clients and healers)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20),
  profile_image_url VARCHAR(500),
  bio TEXT,
  user_type ENUM('client', 'healer', 'admin') NOT NULL DEFAULT 'client',
  is_active BOOLEAN DEFAULT TRUE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_user_type (user_type),
  INDEX idx_created_at (created_at)
);

-- Healers profile (extended information for healers)
CREATE TABLE healers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  specialization VARCHAR(150) NOT NULL,
  healer_type ENUM('psychologist', 'optometrist', 'counsellor', 'spiritual_healer', 'medium', 'prophet', 'other') NOT NULL,
  bio_detailed TEXT,
  years_of_experience INT,
  qualifications TEXT,
  certifications TEXT,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  total_reviews INT DEFAULT 0,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  availability_status ENUM('available', 'busy', 'offline') DEFAULT 'offline',
  is_verified_healer BOOLEAN DEFAULT FALSE,
  verification_date DATETIME,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_healer_type (healer_type),
  INDEX idx_rating (rating),
  INDEX idx_availability (availability_status)
);

-- Client profile (extended information for clients)
CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),
  preferences TEXT,
  emergency_contact_name VARCHAR(100),
  emergency_contact_phone VARCHAR(20),
  is_newsletter_subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_client_user (user_id)
);

-- ============================================================================
-- SERVICES & PRODUCTS
-- ============================================================================

-- Services offered by healers
CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  healer_id INT NOT NULL,
  service_name VARCHAR(150) NOT NULL,
  service_description TEXT,
  service_category ENUM('healing', 'consultation', 'reading', 'workshop', 'coaching', 'other') NOT NULL,
  duration_minutes INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_percentage DECIMAL(5, 2) DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  max_clients_per_session INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (healer_id) REFERENCES healers(id) ON DELETE CASCADE,
  INDEX idx_healer_id (healer_id),
  INDEX idx_service_category (service_category),
  INDEX idx_price (price)
);

-- Products in the store
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  product_description TEXT,
  product_category VARCHAR(100) NOT NULL,
  product_type ENUM('crystal', 'book', 'tool', 'supplement', 'apparel', 'other') NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  cost_price DECIMAL(10, 2),
  stock_quantity INT NOT NULL DEFAULT 0,
  sku VARCHAR(50) UNIQUE,
  image_url VARCHAR(500),
  supplier_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_product_category (product_category),
  INDEX idx_product_type (product_type),
  INDEX idx_price (price),
  INDEX idx_stock (stock_quantity)
);

-- ============================================================================
-- BOOKINGS & APPOINTMENTS
-- ============================================================================

-- Service bookings/appointments
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  healer_id INT NOT NULL,
  service_id INT NOT NULL,
  booking_date DATETIME NOT NULL,
  duration_minutes INT NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show') NOT NULL DEFAULT 'pending',
  booking_type ENUM('in_person', 'online', 'phone') NOT NULL DEFAULT 'online',
  location_address VARCHAR(255),
  meeting_link VARCHAR(500),
  notes TEXT,
  price DECIMAL(10, 2) NOT NULL,
  discount_applied DECIMAL(10, 2) DEFAULT 0.00,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('unpaid', 'paid', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'unpaid',
  payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash', 'other'),
  transaction_id VARCHAR(100),
  client_feedback TEXT,
  client_rating INT,
  healer_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (healer_id) REFERENCES healers(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  INDEX idx_client_id (client_id),
  INDEX idx_healer_id (healer_id),
  INDEX idx_booking_date (booking_date),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status)
);

-- ============================================================================
-- EVENTS MANAGEMENT
-- ============================================================================

-- Events hosted by healers or platform
CREATE TABLE events (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_name VARCHAR(200) NOT NULL,
  event_description TEXT,
  event_type ENUM('workshop', 'gathering', 'circle', 'celebration', 'training', 'retreat', 'other') NOT NULL,
  organizer_healer_id INT,
  event_date DATETIME NOT NULL,
  duration_hours INT,
  location_address VARCHAR(255),
  online_link VARCHAR(500),
  max_capacity INT,
  current_attendees INT DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  image_url VARCHAR(500),
  status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_healer_id) REFERENCES healers(id) ON DELETE SET NULL,
  INDEX idx_event_date (event_date),
  INDEX idx_event_type (event_type),
  INDEX idx_status (status)
);

-- Event registrations
CREATE TABLE event_registrations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  event_id INT NOT NULL,
  client_id INT NOT NULL,
  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  attendance_status ENUM('registered', 'attended', 'no_show', 'cancelled') NOT NULL DEFAULT 'registered',
  price_paid DECIMAL(10, 2),
  payment_status ENUM('unpaid', 'paid', 'refunded') NOT NULL DEFAULT 'unpaid',
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_event_client (event_id, client_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_event_id (event_id),
  INDEX idx_client_id (client_id),
  INDEX idx_attendance_status (attendance_status)
);

-- ============================================================================
-- ORDERS & E-COMMERCE
-- ============================================================================

-- Shopping cart
CREATE TABLE shopping_carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_client_cart (client_id),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Cart items
CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES shopping_carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_product (cart_id, product_id)
);

-- Orders
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned') NOT NULL DEFAULT 'pending',
  subtotal DECIMAL(10, 2) NOT NULL,
  tax_amount DECIMAL(10, 2) DEFAULT 0.00,
  shipping_cost DECIMAL(10, 2) DEFAULT 0.00,
  discount_amount DECIMAL(10, 2) DEFAULT 0.00,
  total_amount DECIMAL(10, 2) NOT NULL,
  payment_status ENUM('unpaid', 'paid', 'refunded', 'failed') NOT NULL DEFAULT 'unpaid',
  payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'crypto', 'other'),
  transaction_id VARCHAR(100),
  shipping_address VARCHAR(500),
  shipping_method VARCHAR(100),
  tracking_number VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  INDEX idx_client_id (client_id),
  INDEX idx_order_number (order_number),
  INDEX idx_order_date (order_date),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status)
);

-- Order items
CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  line_total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id)
);

-- ============================================================================
-- REVIEWS & RATINGS
-- ============================================================================

-- Reviews for healers and services
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  reviewer_client_id INT NOT NULL,
  healer_id INT,
  service_id INT,
  booking_id INT,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  review_text TEXT,
  review_type ENUM('healer', 'service', 'booking') NOT NULL,
  is_verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reviewer_client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (healer_id) REFERENCES healers(id) ON DELETE CASCADE,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  INDEX idx_healer_id (healer_id),
  INDEX idx_rating (rating),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- SUPPORT & COMMUNICATION
-- ============================================================================

-- Support tickets
CREATE TABLE support_tickets (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  healer_id INT,
  ticket_number VARCHAR(50) UNIQUE NOT NULL,
  subject VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category ENUM('technical', 'billing', 'service_quality', 'complaint', 'inquiry', 'other') NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  status ENUM('open', 'in_progress', 'waiting_client', 'resolved', 'closed') NOT NULL DEFAULT 'open',
  assigned_admin_id INT,
  resolution_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (healer_id) REFERENCES healers(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_admin_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_client_id (client_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority)
);

-- Messages/conversations
CREATE TABLE conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  participant_one_id INT NOT NULL,
  participant_two_id INT NOT NULL,
  last_message_id INT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (participant_one_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (participant_two_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_participants (participant_one_id, participant_two_id)
);

-- Messages
CREATE TABLE messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  message_text TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  read_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation_id (conversation_id),
  INDEX idx_is_read (is_read)
);

-- ============================================================================
-- PAYMENTS & TRANSACTIONS
-- ============================================================================

-- Transactions log
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_type ENUM('booking_payment', 'event_registration', 'product_order', 'refund', 'adjustment', 'other') NOT NULL,
  user_id INT NOT NULL,
  related_booking_id INT,
  related_order_id INT,
  related_event_id INT,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'ZAR',
  payment_method ENUM('credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash', 'crypto', 'other'),
  payment_gateway VARCHAR(100),
  transaction_status ENUM('pending', 'completed', 'failed', 'refunded') NOT NULL DEFAULT 'pending',
  external_transaction_id VARCHAR(200),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  FOREIGN KEY (related_order_id) REFERENCES orders(id) ON DELETE SET NULL,
  FOREIGN KEY (related_event_id) REFERENCES events(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_transaction_type (transaction_type),
  INDEX idx_transaction_status (transaction_status),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- FAVORITES & WISHLIST
-- ============================================================================

-- Favorite healers (clients can favorite healers)
CREATE TABLE favorite_healers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  healer_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_favorite (client_id, healer_id),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (healer_id) REFERENCES healers(id) ON DELETE CASCADE,
  INDEX idx_client_id (client_id)
);

-- Wishlist for products
CREATE TABLE wishlist_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_id INT NOT NULL,
  product_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_wishlist (client_id, product_id),
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_client_id (client_id)
);

-- ============================================================================
-- AVAILABILITY & SCHEDULING
-- ============================================================================

-- Healer availability (working hours and time slots)
CREATE TABLE healer_availability (
  id INT PRIMARY KEY AUTO_INCREMENT,
  healer_id INT NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (healer_id) REFERENCES healers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_healer_day (healer_id, day_of_week)
);

-- Blocked dates/unavailable dates
CREATE TABLE blocked_dates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  healer_id INT NOT NULL,
  blocked_date DATE NOT NULL,
  reason VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (healer_id) REFERENCES healers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_blocked_date (healer_id, blocked_date)
);

-- ============================================================================
-- ADMIN & PLATFORM MANAGEMENT
-- ============================================================================

-- Platform settings
CREATE TABLE platform_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type ENUM('string', 'number', 'boolean', 'json') NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit logs
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_entity (entity_type, entity_id),
  INDEX idx_created_at (created_at)
);

-- System logs
CREATE TABLE system_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  log_level ENUM('DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL') NOT NULL,
  message TEXT NOT NULL,
  context JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_log_level (log_level),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- COUPONS & DISCOUNTS
-- ============================================================================

-- Coupons/promo codes
CREATE TABLE coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  coupon_code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type ENUM('fixed', 'percentage') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INT,
  current_uses INT DEFAULT 0,
  valid_from DATETIME NOT NULL,
  valid_until DATETIME,
  minimum_purchase_amount DECIMAL(10, 2),
  applicable_to ENUM('services', 'products', 'events', 'all') NOT NULL DEFAULT 'all',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_coupon_code (coupon_code),
  INDEX idx_is_active (is_active),
  INDEX idx_valid_until (valid_until)
);

-- Coupon usage
CREATE TABLE coupon_usage (
  id INT PRIMARY KEY AUTO_INCREMENT,
  coupon_id INT NOT NULL,
  user_id INT NOT NULL,
  transaction_id INT NOT NULL,
  discount_applied DECIMAL(10, 2),
  used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE
);

-- ============================================================================
-- NOTIFICATIONS
-- ============================================================================

-- Notifications
CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  notification_type ENUM('booking_confirmed', 'booking_reminder', 'event_reminder', 'payment_received', 'review_received', 'message', 'system', 'other') NOT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  related_booking_id INT,
  related_order_id INT,
  related_event_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (related_booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  FOREIGN KEY (related_order_id) REFERENCES orders(id) ON DELETE SET NULL,
  FOREIGN KEY (related_event_id) REFERENCES events(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Additional composite indexes for common queries
CREATE INDEX idx_healers_type_rating ON healers(healer_type, rating);
CREATE INDEX idx_bookings_client_date ON bookings(client_id, booking_date);
CREATE INDEX idx_bookings_healer_date ON bookings(healer_id, booking_date);
CREATE INDEX idx_orders_client_date ON orders(client_id, order_date);
CREATE INDEX idx_products_category_active ON products(product_category, is_active);
