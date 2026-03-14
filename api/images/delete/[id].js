import { getDB } from "../../_lib/db.js";
import { verifyToken } from "../../_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const admin = verifyToken(req);
  if (!admin) {
    return res.status(401).json({ error: "Access denied. No valid token." });
  }

  try {
    const { id } = req.query;
    const db = await getDB();

    const [rows] = await db.execute("SELECT * FROM images WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Image not found." });
    }

    await db.execute("DELETE FROM images WHERE id = ?", [id]);

    res.json({ message: "Image deleted successfully." });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: "Failed to delete image." });
  }
}
