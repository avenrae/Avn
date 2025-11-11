/**
 * Database Connection Module for Avenrae Platform
 * Provides connection pool for MySQL/MariaDB
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

/**
 * Initialize database connection pool
 * @returns {Promise<Pool>} MySQL connection pool
 */
async function initializePool() {
  if (pool) {
    return pool;
  }

  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'avenrae_db',
      waitForConnections: true,
      connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
      queueLimit: parseInt(process.env.DB_QUEUE_LIMIT) || 0,
      enableKeepAlive: process.env.DB_ENABLE_KEEP_ALIVE === 'true',
      keepAliveInitialDelayMs: 0,
      charset: 'utf8mb4',
      timezone: process.env.DB_TIMEZONE || '+00:00',
      multipleStatements: false,
    });

    console.log('✓ Database connection pool initialized');
    
    // Test connection
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log('✓ Database connection verified');

    return pool;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    throw error;
  }
}

/**
 * Get database connection
 * @returns {Promise<Connection>} Database connection
 */
async function getConnection() {
  if (!pool) {
    await initializePool();
  }
  return pool.getConnection();
}

/**
 * Execute query with parameters
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
async function query(sql, params = []) {
  const connection = await getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
}

/**
 * Execute single query with auto-logging
 * @param {string} sql - SQL query
 * @param {Array} params - Query parameters
 * @returns {Promise<Array>} Query results
 */
async function queryWithLogging(sql, params = []) {
  if (process.env.DB_LOG_QUERIES === 'true') {
    console.log('📋 Query:', sql, 'Params:', params);
  }

  const startTime = Date.now();
  const connection = await getConnection();
  
  try {
    const [rows] = await connection.execute(sql, params);
    
    const duration = Date.now() - startTime;
    if (duration > parseInt(process.env.DB_SLOW_QUERY_TIME) || 1000) {
      console.warn(`⚠ Slow query (${duration}ms):`, sql);
    }
    
    return rows;
  } finally {
    connection.release();
  }
}

/**
 * Begin transaction
 * @returns {Promise<Connection>} Connection with active transaction
 */
async function beginTransaction() {
  const connection = await getConnection();
  await connection.beginTransaction();
  return connection;
}

/**
 * Commit transaction
 * @param {Connection} connection - Active connection
 */
async function commit(connection) {
  try {
    await connection.commit();
  } finally {
    connection.release();
  }
}

/**
 * Rollback transaction
 * @param {Connection} connection - Active connection
 */
async function rollback(connection) {
  try {
    await connection.rollback();
  } finally {
    connection.release();
  }
}

/**
 * Close database connection pool
 */
async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
    console.log('✓ Database connection pool closed');
  }
}

module.exports = {
  initializePool,
  getConnection,
  query,
  queryWithLogging,
  beginTransaction,
  commit,
  rollback,
  closePool,
};
