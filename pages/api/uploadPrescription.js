import formidable from 'formidable';
import fs from 'fs';
import { MongoClient, ObjectId } from 'mongodb';
import ImageKit from 'imagekit';

export const config = {
  api: {
    bodyParser: false,
  },
};

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ error: 'Form parsing failed' });
    }

    const file = files.file;
    const fileData = Array.isArray(file) ? file[0] : file;
    const filePath = fileData?.filepath;
    const fileName = fileData?.originalFilename;
    const mimetype = fileData?.mimetype;
    const fileSize = fileData?.size;

    const appointmentId = Array.isArray(fields.appointmentId)
      ? fields.appointmentId[0]
      : fields.appointmentId;

    if (!filePath || !fileName || !appointmentId) {
      return res.status(400).json({ error: 'Missing file or appointment ID' });
    }

    // Only allow PDF
    if (mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    // Limit size to 500KB
    if (fileSize > 500 * 1024) {
      return res.status(400).json({ error: 'File size exceeds 500KB limit' });
    }

    let db;
    try {
      const fileBuffer = fs.readFileSync(filePath);

      // Upload to ImageKit
      const uploadResponse = await imagekit.upload({
        file: fileBuffer,
        fileName: fileName,
        folder: '/prescriptions',
      });

      await client.connect();
      db = client.db('doctors');

      const result = await db.collection('appointments').updateOne(
        { _id: new ObjectId(appointmentId) },
        { $set: { prescriptionFile: uploadResponse.url } }
      );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ error: 'Appointment not found' });
      }

      return res.status(200).json({ prescriptionFile: uploadResponse.url });
    } catch (error) {
      console.error('Upload or DB error:', error);
      return res.status(500).json({ error: 'Upload or DB update failed' });
    } finally {
      await client.close();
    }
  });
}
