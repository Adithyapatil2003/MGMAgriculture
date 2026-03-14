import mysql from "mysql2/promise";

let pool;

export async function getDB() {
  if (pool) return pool;

  pool = await mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "root",
    database: process.env.DB_NAME || "property_images",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 5,
  });

  // Create images table if not exists
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      mime_type VARCHAR(100),
      image_data LONGBLOB,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  return pool;
}
