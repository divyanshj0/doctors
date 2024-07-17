import { useState, useEffect } from "react";

const Form = () => {
  const [formData, setFormData] = useState({name: "", phone: "",date: "", timeSlot: "",appointmentTime: "",});
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availability, setAvailability] = useState({});

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Appointment booked successfully");
        setFormData({ name: "", phone: "", date: "", timeSlot: "", appointmentTime: "" });
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Error submitting form");
      }
    } catch (error) {
      alert("Error submitting form");
    }
  };
  useEffect(() => {
    if (formData.date && formData.timeSlot) {
      const fetchAvailability = async () => {
        try {
          const response = await fetch(
            `/api/checkAvailability?date=${formData.date}&timeSlot=${formData.timeSlot}`
          );
          const data = await response.json();
          setAvailability(data);
        } catch (error) {
          console.error("Error fetching availability");
        }
      };

      fetchAvailability();
    }
  }, [formData.date, formData.timeSlot]);

  useEffect(() => {
    const times = formData.timeSlot === "morning"
      ? ["8:00-9:00", "9:00-10:00"]
      : formData.timeSlot === "evening"
      ? ["16:00-17:00", "17:00-18:00"]
      : [];
    setAvailableTimes(times);
  }, [formData.timeSlot]);

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>  
        <input type="text" id="name" placeholder="Enter name here"  name="name" value={formData.name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
          Phone Number
        </label>
        <input type="tel" id="phone" placeholder="enter phone no" name="phone" value={formData.phone}onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
          Date
        </label>
        <input type="date" id="date" name="date" value={formData.date} onChange={handleChange}  min={today} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"/>
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
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Submit
        </button>
      </div>
    </form>
  );
};

export default Form;
