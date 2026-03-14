import { getDB } from "../../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { filename } = req.query;
    const db = await getDB();
    const [rows] = await db.execute(
      "SELECT mime_type, image_data FROM images WHERE filename = ?",
      [filename]
    );

    if (rows.length === 0 || !rows[0].image_data) {
      return res.status(404).json({ error: "Image not found." });
    }

    res.setHeader("Content-Type", rows[0].mime_type);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.send(rows[0].image_data);
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).json({ error: "Failed to serve image." });
  }
}
