import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('doctors'); // use client.db('your_db_name') if needed

    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const appointments = await db
      .collection('appointments')
      .find({ userEmail: email })
      .sort({ date: -1 })
      .toArray();

    res.status(200).json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
