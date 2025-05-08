import { useState } from 'react';

export default function GoogleUserDetailsForm({ email, onSuccess, nameFromGoogle = '' }) {
  const [name, setName] = useState(nameFromGoogle || '');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !age || !address || !phone) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, address, phone, email }),
      });

      if (res.ok) {
        onSuccess(); // Close modal or redirect
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to save user');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <input
        className="w-full p-2 rounded text-black"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full p-2 rounded text-black"
        placeholder="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
      />
      <input
        className="w-full p-2 rounded text-black"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <input
        className="w-full p-2 rounded text-black"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-white text-[#2c7075] w-full py-2 rounded font-semibold disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Save and Continue'}
      </button>
    </form>
  );
}
