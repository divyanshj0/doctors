import { useState } from 'react';
import { FaUser, FaLock, FaGoogle } from 'react-icons/fa';
import { auth, provider } from '../lib/firebase'
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import GoogleUserDetailsForm from './userform';

export default function LoginModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleUser, setGoogleUser] = useState(null);
  const [showExtraForm, setShowExtraForm] = useState(false);
  //google login 
  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const name = result.user.displayName;
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', user.email);
      const res = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.exists) {
        onClose();
      } else {
        setGoogleUser(user); // Save Google user
        setShowExtraForm(true); // Show additional details form
      }
    } catch (error) {
      alert(error.message);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-[#2c7075] rounded-lg p-8 w-96 text-white shadow-lg relative">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-white text-lg font-bold">✕</button>
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <FaUser className="text-[#2c7075] text-3xl" />
          </div>
        </div>
        {/* Email Input */}
        <div className="space-y-4">
          <div className="flex items-center border-b border-white py-2">
            <FaUser className="mr-3" />
            <input
              type="email"
              placeholder="Email ID"
              className="bg-transparent outline-none text-white w-full placeholder-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="flex items-center border-b border-white py-2">
            <FaLock className="mr-3" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none text-white w-full placeholder-white"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Login Button */}
          <button
            className="bg-white text-[#2c7075] w-full py-2 rounded font-semibold hover:bg-gray-200"
            onClick={() => onLogin({ email, password })}
          >
            LOGIN
          </button>
        </div>

        {/* Remember and Forgot */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-1" />
            Remember me
          </label>
          <button className="underline">Forgot your password?</button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-white" />
          <span className="mx-2 text-sm">OR</span>
          <hr className="flex-grow border-white" />
        </div>

        {/* Google Login */}
        <button
          onClick={loginWithGoogle}
          className="bg-white text-[#2c7075] w-full py-2 rounded font-semibold flex items-center justify-center gap-2 mb-2 hover:bg-gray-200"
        >
          <FaGoogle /> Sign in with Google
        </button>
        {showExtraForm && googleUser?.email && (
          <GoogleUserDetailsForm
            email={googleUser.email}
            nameFromGoogle={googleUser.displayName}
            onSuccess={() => onClose()}
          />

        )}

      </div>
    </div>
  );
}