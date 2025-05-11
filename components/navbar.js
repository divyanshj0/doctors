import { useEffect, useState, useRef } from 'react';
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
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email);
        localStorage.setItem('userEmail', user.email);
      } else {
        setUserName(null);
        localStorage.removeItem('userEmail');
      }
    });

    return () => unsubscribe();
  }, []);

  // 👇 Detect click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserName(null);
      setDropdownOpen(false);
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className="bg-blue-500 p-4 text-white flex justify-between">
        <Link href="/">Home</Link>
        {userName ? (
          <div className="relative" ref={dropdownRef}> {/* 👈 Attach ref here */}
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
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => router.push('/appointments')}>See Appointment</li>
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
