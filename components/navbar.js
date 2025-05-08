import { useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import LoginModal from './LoginModal';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email);
        localStorage.setItem('userEmail', user.email); // Optional: for use in profile fetch
      } else {
        setUserName(null);
        localStorage.removeItem('userEmail');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserName(null);
      setDropdownOpen(false);
      localStorage.clear(); // Clear all local storage (or just specific keys)
      router.push('/'); // Redirect to homepage
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className="bg-blue-500 p-4 text-white flex justify-between">
        <Link href="/">Home</Link>
        {userName ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-100"
            >
              {userName}
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                <ul>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => router.push('/MyAccountPage')}>My Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => router.push('/add-details')}>Add Details</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => router.push('/appointment')}>See Appointment</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsLoginOpen(true)}
            className="bg-white text-blue-500 px-3 py-1 rounded hover:bg-gray-100"
          >
            Login
          </button>
        )}
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
}
