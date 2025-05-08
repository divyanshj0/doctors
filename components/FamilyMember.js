import React, { useEffect, useState } from 'react';
import { FaEdit, FaSave, FaPlus } from 'react-icons/fa';

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
      <h2 className="text-xl font-semibold mb-4">FAMILY MEMBERS</h2>

      <div className="absolute top-4 right-4 flex gap-3">
        <button
          onClick={() =>
            setNewMembers((prev) => [...prev, { name: '', relation: '', age: '' }])
          }
          className="text-sm text-blue-600 border border-blue-600 px-2 py-1 rounded hover:bg-blue-50"
        >
          <FaPlus />
        </button>

        <button
          onClick={() => {
            if (editFamily || newMembers.length > 0) {
              handleSaveAll();
            } else {
              setEditedFamily([...familyMembers]);
              setEditFamily(true);
            }
          }}
          className="text-gray-600 hover:text-black"
        >
          {editFamily || newMembers.length > 0 ? <FaSave /> : <FaEdit />}
        </button>
      </div>

      <ul className="space-y-4 mt-4">
        {familyMembers.map((member, idx) => (
          <li key={idx} className="space-y-1">
            {editFamily ? (
              <>
                <input
                  type="text"
                  className="border px-2 py-1 w-full"
                  value={editedFamily[idx]?.name || ''}
                  onChange={(e) => handleFamilyChange(idx, 'name', e.target.value)}
                />
                <input
                  type="text"
                  className="border px-2 py-1 w-full"
                  value={editedFamily[idx]?.relation || ''}
                  onChange={(e) => handleFamilyChange(idx, 'relation', e.target.value)}
                />
                <input
                  type="number"
                  className="border px-2 py-1 w-full"
                  value={editedFamily[idx]?.age || ''}
                  onChange={(e) => handleFamilyChange(idx, 'age', e.target.value)}
                />
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {member.name}</p>
                <p><strong>Relation:</strong> {member.relation}</p>
                <p><strong>Age:</strong> {member.age}</p>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* New members form */}
      {newMembers.length > 0 && (
        <ul className="space-y-4 mt-6 border-t pt-4">
          {newMembers.map((member, idx) => (
            <li key={idx} className="space-y-1">
              <input
                type="text"
                className="border px-2 py-1 w-full"
                placeholder="Name"
                value={member.name}
                onChange={(e) => handleNewMemberChange(idx, 'name', e.target.value)}
              />
              <input
                type="text"
                className="border px-2 py-1 w-full"
                placeholder="Relation"
                value={member.relation}
                onChange={(e) => handleNewMemberChange(idx, 'relation', e.target.value)}
              />
              <input
                type="number"
                className="border px-2 py-1 w-full"
                placeholder="Age"
                value={member.age}
                onChange={(e) => handleNewMemberChange(idx, 'age', e.target.value)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FamilyMember;
