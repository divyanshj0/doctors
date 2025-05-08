// pages/api/check-user.js
import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Invalid email address' });
    }

    const client = await clientPromise;
    const db = client.db('doctors'); // Replace with your actual DB name
    const users = db.collection('users');

    const user = await users.findOne({ email });

    return res.status(200).json({ exists: !!user });

  } catch (error) {
    console.error('Error checking user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
