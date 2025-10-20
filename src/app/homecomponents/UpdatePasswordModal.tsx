// app/homecomponents/UpdatePasswordModal.tsx

'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { FiEye, FiSlash } from 'react-icons/fi';

interface UpdatePasswordModalProps {
  onClose: () => void;
}

export default function UpdatePasswordModal({ onClose }: UpdatePasswordModalProps) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      setMessageType('error');
      return;
    }
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      setMessageType('error');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      setMessageType('error');
    } else {
      setMessage('Password updated successfully! You can now login.');
      setMessageType('success');
      setTimeout(() => {
        onClose(); // Itago ang modal
      }, 3000);
    }
  };

  return (
    // Gigamit nato ang exact same wrapper sa LoginModal
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        {/* LEFT PANEL (Exact copy gikan sa LoginModal) */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-red-600 text-white">
          <h2 className="text-3xl font-bold">Secure Your Account</h2>
          <p className="mt-4 text-red-100">Create a new, strong password to keep your account safe.</p>
        </div>

        {/* RIGHT PANEL (Update Password Form) */}
        <div className="p-8 md:p-10 relative">
          
          {/* Close button para sa modal */}
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Create New Password
          </h2>
          <p className="text-gray-500 mb-6">
            Enter your new password below.
          </p>
          
          <form onSubmit={handleUpdatePassword} className="space-y-5">
            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-gray-50 border border-gray-300 text-black pl-3 pr-10 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-600"
                >
                  {showPassword ? <FiSlash className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-gray-50 border border-gray-300 text-black pl-3 pr-10 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-600"
                >
                  {showConfirmPassword ? <FiSlash className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {message && (
              <p className={`text-sm ${messageType === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 rounded-lg text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
        
      </div>
    </div>
  );
}