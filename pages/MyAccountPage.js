import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Profile from '@/components/Profile';
import FamilyMember from '@/components/FamilyMember';

export default function MyAccountPage() {
  const router = useRouter();
  const userEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

  useEffect(() => {
    if (!userEmail) router.push('/');
  }, [userEmail]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">UPDATE PROFILE</h1>
      <Profile />
      <div className="border shadow p-6 mb-6 relative">
        <h2 className="text-xl font-semibold mb-4">PASSWORDS</h2>
        <p>Change Login Password</p>
      </div>
      <FamilyMember />
    </div>
  );
}
