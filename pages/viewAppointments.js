// pages/viewAppointments.js
import { useState } from "react";
import { useRouter } from "next/router";
import jwt from "jsonwebtoken";

const ViewAppointments = () => {
  const [date, setDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  const handleChange = (e) => {
    setDate(e.target.value);
  };

  const fetchAppointments = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized. Please log in.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`/api/getAppointments?date=${date}&token=${token}`);
      const data = await response.json();

      if (response.ok) {
        setAppointments(data);
      } else {
        alert(data.error || "Error fetching appointments");
      }
    } catch (error) {
      alert("Error fetching appointments");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">View Appointments</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input type="date" id="date" name="date" value={date} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={fetchAppointments} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Fetch Appointments
        </button>
      </div>
      <div>
        {appointments.length > 0 ? (
          <table className="min-w-full bg-white border">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Age</th>
                <th className="py-2 px-4 border">Gender</th>
                <th className="py-2 px-4 border">Phone</th>
                <th className="py-2 px-4 border">Time Slot</th>
                <th className="py-2 px-4 border">Appointment Time</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={`${appointment.date}-${appointment.timeSlot}-${appointment.appointmentTime}`}>
                  <td className="py-2 px-4 border">{appointment.name}</td>
                  <td className="py-2 px-4 border">{appointment.age}</td>
                  <td className="py-2 px-4 border">{appointment.gender}</td>
                  <td className="py-2 px-4 border">{appointment.phone}</td>
                  <td className="py-2 px-4 border">{appointment.timeSlot}</td>
                  <td className="py-2 px-4 border">{appointment.appointmentTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No appointments found for the selected date.</p>
        )}
      </div>
    </div>
  );
};

export default ViewAppointments;
