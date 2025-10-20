'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FiEye, FiSlash } from 'react-icons/fi';

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (role: string) => void;
  onSwitchToSignup: () => void;
}

export default function LoginModal({ onClose, onLoginSuccess, onSwitchToSignup }: LoginModalProps) {
  const [view, setView] = useState<'login' | 'forgotPassword'>('login');
  
  // States para sa forms
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  
  // Shared state para sa messages
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setMessage(""); // Limpyohi ang daan nga message

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginForm.email,
      password: loginForm.password
    });

    if (error || !data.user) {
      setLoginLoading(false);
      // Gi-ilisan ang alert()
      setMessage(error?.message || "Invalid credentials. Please try again.");
      setMessageType('error');
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();
    
    setLoginLoading(false);

    if (profileError || !profile || !profile.role) {
      // Gi-ilisan ang alert()
      setMessage("User profile not found. Please contact support.");
      setMessageType('error');
      return;
    }
    const role = profile.role.toLowerCase();
    onLoginSuccess(role);
    onClose();
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setMessage("");

    const redirectTo = `${window.location.origin}`;

    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: redirectTo,
    });

    setForgotLoading(false);

    if (error) {
      setMessage(error.message);
      setMessageType('error');
    } else {
      setMessage("Password reset link sent! Check your email (and spam folder).");
      setMessageType('success');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col justify-center p-12 bg-red-600 text-white">
          <h2 className="text-3xl font-bold">Welcome Back!</h2>
          <p className="mt-4 text-red-100">Your next donation could be the one that saves a life. Thank you for your continued support.</p>
        </div>
        <div className="p-8 md:p-10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          {view === 'login' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Log In to Your Account</h2>
              <p className="text-gray-500 mb-6">Enter your credentials to continue.</p>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input 
                    id="email" 
                    type="email" 
                    name="email" 
                    placeholder="you@example.com" 
                    value={loginForm.email} 
                    onChange={handleLoginChange} 
                    required 
                    className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" 
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                  <div className="relative">
                    <input 
                      id="password" 
                      type={showPassword ? 'text' : 'password'} 
                      name="password" 
                      placeholder="••••••••" 
                      value={loginForm.password} 
                      onChange={handleLoginChange} 
                      required 
                      className="bg-gray-50 border border-gray-300 text-black pl-3 pr-10 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center justify-center h-full w-10 text-gray-600"
                      aria-label={showPassword ? 'Itago ang password' : 'Ipakita ang password'}
                    >
                      {showPassword ? <FiSlash className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div className="text-right -mt-3">
                  <button
                    type="button"
                    onClick={() => { setView('forgotPassword'); setMessage(''); }}
                    className="text-sm font-semibold text-red-600 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                
                {message && messageType === 'error' && (
                  <p className="text-sm text-center text-red-500">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className={`w-full py-3 mt-2 rounded-lg text-white font-semibold transition ${loginLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                >
                  {loginLoading ? "Logging in..." : "Login"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="font-semibold text-red-600 hover:underline"
                >
                  Sign Up
                </button>
              </p>
            </div>
          )}

          {view === 'forgotPassword' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h2>
              <p className="text-gray-500 mb-6">Enter your email and we'll send you a link to reset it.</p>
              <form onSubmit={handlePasswordReset} className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                  <input 
                    id="forgot-email" 
                    type="email" 
                    name="email" 
                    placeholder="you@example.com" 
                    value={forgotEmail} 
                    onChange={(e) => setForgotEmail(e.target.value)} 
                    required 
                    className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" 
                  />
                </div>
                
                {message && (
                  <p className={`text-sm text-center ${messageType === 'error' ? 'text-red-500' : 'text-green-600'}`}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={forgotLoading || (messageType === 'success' && message !== '')}
                  className={`w-full py-3 mt-2 rounded-lg text-white font-semibold transition ${forgotLoading || (messageType === 'success' && message !== '') ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
                >
                  {forgotLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>
              <p className="mt-6 text-center text-sm text-gray-600">
                Remembered your password?{" "}
                <button
                  type="button"
                  onClick={() => { setView('login'); setMessage(''); }}
                  className="font-semibold text-red-600 hover:underline"
                >
                  Back to Login
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}