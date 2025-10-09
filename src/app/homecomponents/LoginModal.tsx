'use client';

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess: (role: string) => void;
  onSwitchToSignup: () => void;
}

// 1. Move InputField outside the main component
const InputField = ({ name, label, placeholder, value, onChange, type = "text" }: any) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"
    />
  </div>
);


export default function LoginModal({ onClose, onLoginSuccess, onSwitchToSignup }: LoginModalProps) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    if (error || !data.user) {
      setLoading(false);
      return alert(error?.message || "Invalid login");
    }

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setLoading(false);

    if (profileError || !profile || !profile.role) {
      return alert("User profile not found.");
    }

    const role = profile.role.toLowerCase();
    onLoginSuccess(role);
    onClose();
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Pane (Branding) */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-red-600 text-white">
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
            <p className="mt-4 text-red-100">Your next donation could be the one that saves a life. Thank you for your continued support.</p>
        </div>

        {/* Right Pane (Form) */}
        <div className="p-8 md:p-10 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Log In to Your Account</h2>
          <p className="text-gray-500 mb-6">Enter your credentials to continue.</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
           
            <div>
              <div className="flex justify-between items-baseline">
                <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              </div>
              <input 
                id="email" 
                type="email" 
                name="email" 
                placeholder="you@example.com" 
                value={form.email} 
                onChange={handleChange} 
                required 
                className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" 
              />
            </div>
            <div>
              <div className="flex justify-between items-baseline">
                <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              </div>
              <input 
                id="password" 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={handleChange} 
                required 
                className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" 
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 mt-2 rounded-lg text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            >
              {loading ? "Logging in..." : "Login"}
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
      </div>
    </div>
  );
}