import { useEffect, useState } from 'react';
import { FaDownload, FaTrash } from 'react-icons/fa';

export default function AppointmentPage() {
  const [appointments, setAppointments] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const email = localStorage.getItem('userEmail');
        const res = await fetch(`/api/appointments?email=${email}`);
        const result = await res.json();

        const appointments = result.appointments || [];
        const today = new Date().toISOString().split('T')[0];

        setUpcoming(appointments.filter(appt => appt.date >= today));
        setPast(appointments.filter(appt => appt.date < today));
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleFileUpload = async (e, appointmentId) => {
    const file = e.target.files[0];

    if (!file) return;
    if (file.size > 500 * 1024) {
      alert('File size exceeds 500KB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('appointmentId', appointmentId);

    try {
      setUploading(appointmentId);
      const res = await fetch('/api/uploadPrescription', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        alert('Prescription uploaded successfully.');
        const updated = past.map(appt =>
          appt._id === appointmentId ? { ...appt, prescriptionFile: result.prescriptionFile } : appt
        );
        setPast(updated);
      } else {
        alert(result.error || 'Upload failed.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Something went wrong.');
    } finally {
      setUploading(null);
    }
  };
  //Handle delete option
  const handleDeletePrescription = async (appointmentId) => {
    if (!confirm('Are you sure you want to delete this prescription?')) return;

    try {
      const res = await fetch(`/api/deletePrescription?appointmentId=${appointmentId}`, {
        method: 'DELETE',
      });
      const result = await res.json();

      if (res.ok) {
        alert('Prescription deleted.');
        const updated = past.map(appt =>
          appt._id === appointmentId ? { ...appt, prescriptionFile: null } : appt
        );
        setPast(updated);
      } else {
        alert(result.error || 'Deletion failed.');
      }
    } catch (err) {
      console.error('Deletion error:', err);
      alert('Something went wrong.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Appointments</h1>

      {/* Upcoming Appointments */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Upcoming Appointments</h2>
        {upcoming.length > 0 ? (
          <ul className="space-y-2">
            {upcoming.map((appt) => (
              <li key={appt._id} className="border p-3 rounded">
                <div><strong>Date:</strong> {appt.date}</div>
                <div><strong>Time:</strong> {appt.appointmentTime} ({appt.timeSlot})</div>
                <div><strong>For:</strong> {appt.familyMember?.name}</div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming appointments.</p>
        )}
      </section>

      {/* Past Appointments */}
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Past Appointments</h2>
        {past.length > 0 ? (
          <ul className="space-y-2">
            {past.map((appt) => (
              <li key={appt._id} className="border p-3 rounded">
                <div><strong>Date:</strong> {appt.date}</div>
                <div><strong>Time:</strong> {appt.appointmentTime} ({appt.timeSlot})</div>
                <div><strong>For:</strong> {appt.familyMember?.name}</div>

                {appt.prescriptionFile ? (
                  <div className="mt-2 flex items-center justify-between border p-2 rounded bg-gray-50">
                    <div>
                    <a href={appt.prescriptionFile} download target="_blank" rel="noopener noreferrer"
                      className="font-medium  border rounded hover:underline transition"
                    >{decodeURIComponent(appt.prescriptionFile.split('/').pop())}
                    </a>
                      <p className="text-sm text-gray-600">
                        Type: {appt.prescriptionFile.endsWith('.pdf') ? 'PDF' : 'Image'} | Size: ~500KB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={appt.prescriptionFile}
                        download
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <FaDownload/>
                      </a>
                      <button
                        onClick={() => handleDeletePrescription(appt._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        <FaTrash/>
                      </button>
                    </div>
                  </div>
                ) : (

                  <div className="mt-2">
                    <label className="block mb-1 font-medium">Upload Prescription (max 500KB):</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, appt._id)}
                      disabled={uploading === appt._id}
                    />
                    {uploading === appt._id && <p className="text-sm text-gray-500">Uploading...</p>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No past appointments.</p>
        )}
      </section>
    </div>
  );
}
