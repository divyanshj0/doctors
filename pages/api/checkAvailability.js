import clientPromise from "../../lib/mongodb";

const MAX_APPOINTMENTS_PER_HOUR = 2;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { date, timeSlot } = req.query;

    if (!date || !timeSlot) {
      return res.status(400).json({ error: "Date and time slot are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("doctors");
      const collectionName = `appointments_${date.replace(/-/g, "_")}`;
      const collection = db.collection(collectionName);

      const timeSlots = ["8:00-9:00", "9:00-10:00", "16:00-17:00", "17:00-18:00"];
      const availability = {};

      for (const appointmentTime of timeSlots) {
        const count = await collection.countDocuments({
          date,
          timeSlot,
          appointmentTime,
        });
        availability[appointmentTime] = count < MAX_APPOINTMENTS_PER_HOUR;
      }
      res.status(200).json(availability);
    } catch (error) {
      res.status(500).json({ error: "Database connection error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
