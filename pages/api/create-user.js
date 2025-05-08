import clientPromise from '@/lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, age, phone, address } = req.body;

  // Basic validation
  if (!email || !name || !age || !phone || !address) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('doctors'); // optionally: client.db('your-db-name')
    const users = db.collection('users');

    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(200).json({ exists: true, user: existingUser });
    }

    const newUser = {
      name,
      email,
      age: parseInt(age),
      phone,
      address,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await users.insertOne(newUser);

    return res.status(201).json({ exists: false, user: newUser });
  } catch (err) {
    console.error('Error creating user:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
