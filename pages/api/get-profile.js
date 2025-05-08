import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email } = req.query;

  if (!email) {
    res.setHeader('Cache-Control', 'no-store');
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('doctors');
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      res.setHeader('Cache-Control', 'no-store');
      return res.status(404).json({ message: 'User not found' });
    }

    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.setHeader('Cache-Control', 'no-store');
    res.status(500).json({ message: 'Internal server error' });
  }
}
