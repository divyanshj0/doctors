import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { useRouter } from 'next/router';

const Profile = () => {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

  useEffect(() => {
    if (!userEmail) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/get-profile?email=${userEmail}`);
        const data = await res.json();
        if (data.user) {
          setProfile(data.user);
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        router.push('/');
      }
    };

    fetchData();
  }, [userEmail]);

  const handleEditToggle = () => {
    setEditProfile(!editProfile);
    setEditedProfile(profile);
  };

  const handleInputChange = (e) => {
    setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async () => {
    try {
      const res = await fetch('/api/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editedProfile, email: userEmail }),
      });
      const result = await res.json();
      if (res.ok) {
        setProfile(editedProfile);
        setEditProfile(false);
      } else {
        console.error('Failed to update:', result);
      }
    } catch (err) {
      console.error('Save failed:', err);
    }
  };

  if (!profile) return null;

  return (
    <div className="border shadow p-6 mb-6 relative">
      <h2 className="text-xl font-semibold mb-4">MY PROFILE</h2>
      <button
        onClick={editProfile ? handleSaveProfile : handleEditToggle}
        className="absolute top-4 right-4 text-gray-600 hover:text-black"
      >
        {editProfile ? <FaSave /> : <FaEdit />}
      </button>

      <div className="space-y-2">
        <p>
          <strong>Name:</strong>{' '}
          {editProfile ? (
            <input type="text" name="name" className="border" value={editedProfile.name} onChange={handleInputChange} />
          ) : (
            profile.name
          )}
        </p>
        <p>
          <strong>Gender:</strong>{' '}
          {editProfile ? (
            <select name="gender" className="border-b" value={editedProfile.gender || ''} onChange={handleInputChange}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            profile.gender || 'N/A'
          )}
        </p>
        <p>
          <strong>Date Of Birth:</strong>{' '}
          {editProfile ? (
            <input type="date" name="dob" className="border-b" value={editedProfile.dob || ''} onChange={handleInputChange} />
          ) : (
            profile.dob || 'N/A'
          )}
        </p>
        <p>
          <strong>ISD-Mobile:</strong>{' '}
          {editProfile ? (
            <input type="text" name="phone" className="border-b" value={editedProfile.phone} onChange={handleInputChange} />
          ) : (
            profile.phone
          )}
        </p>
        <p>
          <strong>Country:</strong>{' '}
          {editProfile ? (
            <input type="text" name="country" className="border-b" value={editedProfile.country || ''} onChange={handleInputChange} />
          ) : (
            profile.country || 'N/A'
          )}
        </p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p>
          <strong>Residential Address:</strong>{' '}
          {editProfile ? (
            <input
              type="text"
              name="address"
              className="border-b w-full"
              value={editedProfile.address}
              onChange={handleInputChange}
            />
          ) : (
            profile.address
          )}
        </p>
      </div>
    </div>
  );
};

export default Profile;
