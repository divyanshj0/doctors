import formidable from 'formidable';
import { MongoClient, ObjectId } from 'mongodb';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Form parsing failed' });

    const file = files.file;
    const filePath = Array.isArray(file) ? file[0].filepath : file?.filepath;
    const appointmentId = fields.appointmentId?.[0] || fields.appointmentId;

    if (!filePath || !appointmentId) {
      return res.status(400).json({ error: 'Missing file or appointment ID' });
    }

    try {
      // Upload to Cloudinary
      const result = await cloudinary.v2.uploader.upload(filePath, {
        folder: 'prescriptions',
        resource_type: 'auto',
        access_mode:"public"
      });

      // Connect to DB and update appointment
      await client.connect();
      const db = client.db('doctors'); // Defaults to the database in your MONGODB_URI
      const collection = db.collection('appointments');

      await collection.updateOne(
        { _id: new ObjectId(appointmentId) },
        { $set: { prescriptionFile: result.secure_url } }
      );

      res.status(200).json({ prescriptionFile: result.secure_url });
    } catch (error) {
      console.error('Upload or DB error:', error);
      res.status(500).json({ error: 'Upload or DB update failed' });
    } finally {
      await client.close();
    }
  });
}
