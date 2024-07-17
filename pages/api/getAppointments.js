// pages/api/getAppointments.js
import jwt from "jsonwebtoken";
import clientPromise from "../../lib/mongodb";

const SECRET_KEY = "your-secret-key";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { date, token } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Date is required" });
    }

    try {
      // Verify the token
      jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const client = await clientPromise;
        const db = client.db("doctors");
        const collectionName = `appointments_${date.replace(/-/g, "_")}`;
        const collection = db.collection(collectionName);

        const appointments = await collection.find({}).toArray();

        res.status(200).json(appointments);
      });
    } catch (error) {
      res.status(500).json({ error: "Database connection error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
