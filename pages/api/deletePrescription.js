import { MongoClient, ObjectId } from 'mongodb';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { appointmentId } = req.query;

  if (!appointmentId) {
    return res.status(400).json({ error: 'Appointment ID is required' });
  }

  try {
    await client.connect();
    const db = client.db('doctors');

    // Get current appointment with file URL
    const appointment = await db.collection('appointments').findOne({ _id: new ObjectId(appointmentId) });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const fileUrl = appointment.prescriptionFile;

    if (fileUrl) {
      // Extract ImageKit file path from the URL (after /prescriptions/)
      const match = fileUrl.match(/\/prescriptions\/(.+)$/);
      const filePath = match?.[1];

      if (filePath) {
        // Search for file on ImageKit to get its fileId
        const searchResult = await imagekit.listFiles({ searchQuery: `name="${filePath}"` });

        if (searchResult.length > 0) {
          const fileId = searchResult[0].fileId;
          await imagekit.deleteFile(fileId);
        }
      }
    }

    // Remove the prescriptionFile field from MongoDB
    await db.collection('appointments').updateOne(
      { _id: new ObjectId(appointmentId) },
      { $unset: { prescriptionFile: '' } }
    );

    return res.status(200).json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.close();
  }
}
