import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Form = () => {
  const [formData, setFormData] = useState({
    name: "", age: "", gender: "", phone: "",
    date: "", timeSlot: "", appointmentTime: ""
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [availability, setAvailability] = useState({});
  const [today, setToday] = useState("");
  const [user] = useAuthState(auth);

  useEffect(() => {
    setToday(new Date().toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    const times = formData.timeSlot === "morning"
      ? ["8:00-9:00", "9:00-10:00"]
      : formData.timeSlot === "evening"
        ? ["16:00-17:00", "17:00-18:00"]
        : [];
    setAvailableTimes(times);
  }, [formData.timeSlot]);

  useEffect(() => {
    if (formData.date && formData.timeSlot) {
      const fetchAvailability = async () => {
        const response = await fetch(`/api/checkAvailability?date=${formData.date}&timeSlot=${formData.timeSlot}`);
        const data = await response.json();
        setAvailability(data);
      };
      fetchAvailability();
    }
  }, [formData.date, formData.timeSlot]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return alert("Please login to book an appointment");

    const payload = {
      userEmail: user.email,
      familyMember: {
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        phone: formData.phone
      },
      date: formData.date,
      timeSlot: formData.timeSlot,
      appointmentTime: formData.appointmentTime
    };

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (response.ok) {
        alert("Appointment booked successfully");
        setFormData({ name: "", age: "", gender: "", phone: "", date: "", timeSlot: "", appointmentTime: "" });
      } else {
        alert(data.error || "Error submitting form");
      }
    } catch {
      alert("Error submitting form");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input type="text" id="name" placeholder="Enter name here" name="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
          Age
        </label>
        <input type="number" id="age" placeholder="Enter age here" name="age" value={formData.age} onChange={handleChange} min={0} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
          Gender
        </label>
        <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone Number
        </label>
        <input type="tel" id="phone" placeholder="enter phone no" name="phone" value={formData.phone} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} min={today} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="timeSlot">
          Time Slot
        </label>
        <select id="timeSlot" name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
          <option value="">Select a time slot</option>
          <option value="morning">Morning</option>
          <option value="evening">Evening</option>
        </select>
      </div>
      {formData.timeSlot && formData.date && (
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="appointmentTime">
            Appointment Time
          </label>
          <select id="appointmentTime" name="appointmentTime" value={formData.appointmentTime} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="">Select an appointment time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time} disabled={!availability[time]}>
                {time} {availability[time] ? "" : "(Full)"}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="flex items-center justify-between">
        <button
          type="submit"
          disabled={!user}
          className={`${user ? "bg-blue-500 hover:bg-blue-700" : "bg-gray-400 cursor-not-allowed"
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
