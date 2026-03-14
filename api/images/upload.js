import { getDB } from "../_lib/db.js";
import { verifyToken } from "../_lib/auth.js";
import multiparty from "multiparty";
import fs from "fs";

// Disable Vercel's default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new multiparty.Form({ maxFilesSize: 10 * 1024 * 1024 });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = verifyToken(req);
  if (!admin) {
    return res.status(401).json({ error: "Access denied. No valid token." });
  }

  try {
    const { files } = await parseForm(req);

    if (!files.image || files.image.length === 0) {
      return res.status(400).json({ error: "No image file provided." });
    }

    const file = files.image[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.headers["content-type"])) {
      return res.status(400).json({ error: "Only JPEG, PNG, GIF, and WebP images are allowed." });
    }

    // Read file data as buffer
    const imageData = fs.readFileSync(file.path);
    const mimeType = file.headers["content-type"];
    const uniqueFilename = Date.now() + "-" + Math.round(Math.random() * 1e9) + "." + file.originalFilename.split(".").pop();

    const db = await getDB();

    // Store image as BLOB in MySQL
    const [result] = await db.execute(
      "INSERT INTO images (filename, original_name, file_path, mime_type, image_data) VALUES (?, ?, ?, ?, ?)",
      [uniqueFilename, file.originalFilename, `/api/images/serve/${uniqueFilename}`, mimeType, imageData]
    );

    // Clean up temp file
    fs.unlinkSync(file.path);

    res.status(201).json({
      message: "Image uploaded successfully",
      image: {
        id: result.insertId,
        filename: uniqueFilename,
        original_name: file.originalFilename,
        file_path: `/api/images/serve/${uniqueFilename}`,
        uploaded_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image." });
  }
}
