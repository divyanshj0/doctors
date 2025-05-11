import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';

const FamilyMember = () => {
    const [familyMembers, setFamilyMembers] = useState([]);
    const [editFamily, setEditFamily] = useState(false);
    const [editedFamily, setEditedFamily] = useState([]);
    const [newMembers, setNewMembers] = useState([]);
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/get-profile?email=${userEmail}`);
                const data = await res.json();
                if (data.user && data.user.family) {
                    setFamilyMembers(data.user.family);
                }
            } catch (err) {
                console.error('Failed to fetch family:', err);
            }
        };

        if (userEmail) fetchData();
    }, [userEmail]);

    const handleFamilyChange = (index, field, value) => {
        const updated = [...editedFamily];
        updated[index][field] = value;
        setEditedFamily(updated);
    };

    const handleNewMemberChange = (index, field, value) => {
        const updated = [...newMembers];
        updated[index][field] = value;
        setNewMembers(updated);
    };

    const handleSaveAll = async () => {
        const updatedFamily = [...familyMembers];

        if (editFamily) {
            editedFamily.forEach((m, i) => {
                updatedFamily[i] = m;
            });
        }

        if (newMembers.length > 0) {
            updatedFamily.push(...newMembers);
        }

        try {
            const res = await fetch('/api/update-profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail, family: updatedFamily }),
            });

            if (res.ok) {
                setFamilyMembers(updatedFamily);
                setEditedFamily([]);
                setNewMembers([]);
                setEditFamily(false);
            } else {
                console.error('Failed to save family');
            }
        } catch (err) {
            console.error('Save error:', err);
        }
    };

    return (
        <div className="border shadow p-6 mb-6 relative">
            <h2 className="text-xl font-semibold mb-4">Family Member</h2>
            <div className="absolute top-4 right-4 flex gap-3">
                <button onClick={() => setNewMembers((prev) => [...prev, { name: '', gender: '', age: '', phone: '' }])}
                    className="text-sm text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                >
                    <FaPlus />
                </button>
                <button onClick={() => {if (editFamily || newMembers.length > 0) {handleSaveAll  (); } 
                    else {
                            setEditedFamily([...familyMembers]);
                            setEditFamily(true);
                        }
                    }}
                    className="text-gray-600 hover:text-black"
                > {editFamily || newMembers.length > 0 ? <FaSave /> : <FaEdit />}
                </button>
            </div>
            <div className="space-y-2">
                <p>
                    <strong>Name:</strong>{' '}
                    {familyMembers ? (
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
