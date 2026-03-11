const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/auth");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, GIF, and WebP images are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = (db) => {
  // GET /api/images — public, returns all images
  router.get("/", async (req, res) => {
    try {
      const [rows] = await db.execute(
        "SELECT id, filename, original_name, file_path, uploaded_at FROM images ORDER BY uploaded_at DESC"
      );
      res.json(rows);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ error: "Failed to fetch images." });
    }
  });

  // POST /api/images/upload — protected, upload new image
  router.post(
    "/upload",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ error: "No image file provided." });
        }

        const { filename, originalname } = req.file;
        const filePath = `/api/uploads/${filename}`;

        const [result] = await db.execute(
          "INSERT INTO images (filename, original_name, file_path) VALUES (?, ?, ?)",
          [filename, originalname, filePath]
        );

        res.status(201).json({
          message: "Image uploaded successfully",
          image: {
            id: result.insertId,
            filename,
            original_name: originalname,
            file_path: filePath,
            uploaded_at: new Date().toISOString(),
          },
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Failed to upload image." });
      }
    }
  );

  // DELETE /api/images/:id — protected, delete image
  router.delete("/:id", authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;

      // Get image info before deleting
      const [rows] = await db.execute("SELECT * FROM images WHERE id = ?", [
        id,
      ]);

      if (rows.length === 0) {
        return res.status(404).json({ error: "Image not found." });
      }

      const image = rows[0];

      // Delete from database
      await db.execute("DELETE FROM images WHERE id = ?", [id]);

      // Delete file from filesystem (only if it's in uploads directory)
      if (image.filename && !image.file_path.startsWith("/lovable-uploads")) {
        const filePath = path.join(__dirname, "..", "uploads", image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      res.json({ message: "Image deleted successfully." });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Failed to delete image." });
    }
  });

  return router;
};
