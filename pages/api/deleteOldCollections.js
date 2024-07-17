import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function deleteOldCollections() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db('doctors');

    const collections = await db.listCollections().toArray();
    const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '_');

    const oldCollections = collections.filter(collection => {
      const dateMatch = collection.name.match(/^appointments_(\d{4}_\d{2}_\d{2})$/);
      if (dateMatch) {
        const collectionDate = dateMatch[1];
        return collectionDate < currentDate;
      }
      return false;
    });

    for (const collection of oldCollections) {
      console.log(`Deleting collection: ${collection.name}`);
      await db.collection(collection.name).drop();
    }

    console.log('Old collections deleted successfully.');
  } catch (error) {
    console.error('Error deleting old collections:', error);
  } finally {
    await client.close();
  }
}

export default async function handler(req, res) {
  await deleteOldCollections();
  res.status(200).json({ message: 'Old collections deleted successfully.' });
}
