import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, ...updates } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Remove any _id if accidentally included
    if ('_id' in updates) {
      delete updates._id;
    }
    updates.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db('doctors');
    const users = db.collection('users');

    const result = await users.findOneAndUpdate(
      { email },
      { $set: updates },
      { returnDocument: 'after' }
    );
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Profile updated', user: result });

  } catch (err) {
    console.error('Error updating profile:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
