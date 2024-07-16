import { stringify } from "postcss";
import clientPromise from "../../lib/mongodb";

const MAX_APPOINTMENTS_PER_HOUR = 2;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, phone, date, timeSlot, appointmentTime } = req.body;

    if (!name || !phone || !date || !timeSlot || !appointmentTime) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      const client = await clientPromise;
      const db = client.db("doctors");
      const collectionName = `${date.replace(/-/g, "_")}`;
      const collection = db.collection(collectionName);

      const appointmentCount = await collection.countDocuments({
        date,
        timeSlot,
        appointmentTime,
      });

      if (appointmentCount >= MAX_APPOINTMENTS_PER_HOUR) {
        return res.status(400).json({ error: "Appointment slot is full" });
      }

      await collection.insertOne({ name, phone, date, timeSlot, appointmentTime });

      res.status(201).json({ message: "Appointment booked successfully" });
    } catch (error) {
      res.status(500).json({ error: "Database connection error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
