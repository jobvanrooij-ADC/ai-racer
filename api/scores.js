// In-memory leaderboard — persists as long as the serverless function instance lives.
// For a single meeting session this works great. For permanent storage, swap with a database.
let scores = [];

export default function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "GET") {
    // Return top 50, sorted by score descending
    const sorted = [...scores].sort((a, b) => b.score - a.score).slice(0, 50);
    return res.status(200).json(sorted);
  }

  if (req.method === "POST") {
    const { name, score, collected, year } = req.body || {};

    if (!name || typeof score !== "number") {
      return res.status(400).json({ error: "name and score required" });
    }

    scores.push({
      name: String(name).slice(0, 16),
      score: Math.round(score),
      collected: collected || 0,
      year: year || "?",
      ts: Date.now(),
    });

    // Keep max 200 entries
    if (scores.length > 200) {
      scores = scores.sort((a, b) => b.score - a.score).slice(0, 100);
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
