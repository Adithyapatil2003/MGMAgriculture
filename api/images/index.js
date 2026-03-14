import { getDB } from "../_lib/db.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = await getDB();
    const [rows] = await db.execute(
      "SELECT id, filename, original_name, file_path, uploaded_at FROM images ORDER BY uploaded_at DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images." });
  }
}
