import clientPromise from "@/lib/mongodb";
const MAX_APPOINTMENTS_PER_HOUR = 2;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { userEmail, familyMember, date, timeSlot, appointmentTime } = req.body;

  if (!userEmail || !familyMember || !date || !timeSlot || !appointmentTime) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("doctors");
    const collection = db.collection("appointments");

    // Optional: Check if this time slot is full
    const count = await collection.countDocuments({ date, timeSlot, appointmentTime });
    if (count >= MAX_APPOINTMENTS_PER_HOUR) {
      return res.status(400).json({ error: "Appointment slot is full" });
    }

    const appointment = {
      userEmail,
      familyMember, // includes name, age, gender, phone
      date,
      timeSlot,
      appointmentTime,
      createdAt: new Date(),
    };

    await collection.insertOne(appointment);

    res.status(201).json({ message: "Appointment booked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
}
