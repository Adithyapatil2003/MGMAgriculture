const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mysql = require("mysql2/promise");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const authRoutes = require("./routes/auth");
const imageRoutes = require("./routes/images");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use("/api/uploads", express.static(uploadsDir));

// Database setup
let db;

async function initDatabase() {
  try {
    // Connect without specifying a database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "root",
      port: process.env.DB_PORT || 3306,
    });

    // Create database if it doesn't exist
    await connection.execute(
      `CREATE DATABASE IF NOT EXISTS \`${
        process.env.DB_NAME || "property_images"
      }\``
    );
    await connection.end();

    // Create connection pool with the database
    db = await mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "root",
      database: process.env.DB_NAME || "property_images",
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
    });

    // Create images table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_path VARCHAR(500) NOT NULL,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Connected to MySQL and database initialized.");

    // Seed existing images if table is empty
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM images");
    if (rows[0].count === 0) {
      await seedExistingImages();
    }

    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error.message);
    console.error("Make sure MySQL is running and credentials are correct.");
    process.exit(1);
  }
}

async function seedExistingImages() {
  console.log("🌱 Seeding existing images into database...");

  const existingImages = [
    "c23fb84a-1c4d-424e-9be9-f611df8af529.png",
    "58897bf2-e2c7-42b6-883f-beb2ad1624ba.png",
    "5b735977-0b2c-407d-967f-d881823d2ec8.png",
    "bea40f84-a004-4f23-b8fe-2e63b689f86b.png",
    "179067ab-025a-438a-90ce-90fcac031901.png",
    "4fb39deb-9615-495c-8be9-3430beb07cd6.png",
    "135d6072-056c-4ac2-9628-7d20aba50163.png",
    "01780aa3-ff69-4dac-9e6e-dd253d419e2c.png",
    "596771fc-9a47-4aaa-b7c1-fa8e031fe6a2.png",
    "d6e9ece8-5c25-43ed-b7ee-ec17593859b4.png",
    "ece37575-ccee-478c-8cba-8db9e133eda4.png",
    "bf1f0143-e143-40d0-a44e-a4a62c2dd600.png",
    "0b09419d-486e-498b-8051-e600b4a1f8db.png",
    "bf6693e2-e238-4fae-886b-74a3e6125ecd.png",
    "5c598329-e359-4cec-a690-5aca03c3d116.png",
    "1561e55f-e833-40cd-8e50-22bd67ddac90.png",
    "ea0be2bd-f74d-4e29-820a-9d7ba784c03a.png",
    "6df4ace9-c7b4-479a-ae0a-3163caa589b0.png",
    "263818a0-abf1-4142-9702-bd6283783b37.png",
    "3231cf4b-e544-4c17-a7c0-c7fe0d9975ae.png",
    "383bd408-e4a2-4387-84ad-2f48464d4a60.png",
    "7cc8736c-7a77-4093-8aeb-18b5536cb9e5.png",
    "7af551e0-637a-41cb-a322-992c62c0c03d.png",
    "e0ab70b9-5b12-48d5-b737-1656075cbf3b.png",
    "1b67c9a8-c6fe-4902-b3ba-8fa4075e48e0.png",
    "fd7cae1c-a932-46ca-8a69-0b84676cb7de.png",
    "96fd422a-dcb9-4dc7-921e-8b90418ae545.png",
    "b6686886-a8bc-437b-a614-d719dda7b250.png",
    "661f9528-c3c5-4d1d-8bd6-226cd8f6317f.png",
    "a5acc6da-2dc4-4dd7-b53e-94cbabddc9dc.png",
    "3a6dc2d7-3e73-41af-a601-b868e037d728.png",
    "1ed3ce05-3e41-4a5f-b230-fd53d6e59394.png",
    "4bd4ac96-1c1f-4b28-a8a7-d11b534b285c.png",
    "8b06a3dc-e1cd-4fee-ad49-bb27f8bce500.png",
    "76cc52fd-448a-406a-9baa-978084443292.png",
    "d4074998-23e4-43a0-bf9b-6092cfe2ab93.png",
    "ec258172-1a94-4364-b12b-96c84dd82762.png",
  ];

  for (const filename of existingImages) {
    const filePath = `/lovable-uploads/${filename}`;
    try {
      await db.execute(
        "INSERT INTO images (filename, original_name, file_path) VALUES (?, ?, ?)",
        [filename, filename, filePath]
      );
    } catch (err) {
      console.error(`Failed to seed image ${filename}:`, err.message);
    }
  }

  console.log(
    `✅ Seeded ${existingImages.length} existing images into database.`
  );
}

// Initialize and start
async function startServer() {
  const database = await initDatabase();

  // API Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/images", imageRoutes(database));

  // Serve static frontend files (React build)
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));

  // SPA catch-all: serve index.html for any non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
