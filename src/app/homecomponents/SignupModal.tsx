"use client";

import { useState, } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

interface SignupModalProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

// Helper function: Capitalize first letter of every word
function capitalizeWords(str: string) {
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

const InputField = ({ name, label, placeholder, value, onChange, type = "text", required = true, children }: any) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {children ? (
        <select id={name} name={name} value={value} onChange={onChange} required={required} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
          {children}
        </select>
      ) : (
        <input id={name} type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} className="bg-gray-50 border text-black border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
      )}
    </div>
);


export default function SignupModal({ onClose, onSwitchToLogin }: SignupModalProps) {
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    address: "",
    bloodType: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError || !data.user) {
      setLoading(false);
      return alert(signUpError?.message || "Signup failed");
    }

    // --- NEW RANDOM ID GENERATION LOGIC ---
    let newUserId = "";
    let isUnique = false;
    const year = new Date().getFullYear();

    // Loop until a unique ID is found to prevent duplicates
    while (!isUnique) {
      // Generate a random 5-digit number (from 10000 to 99999)
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const potentialId = `D-${year}-${randomNum}`;

      // Check if this ID already exists
      const { data: existingUser, error: checkError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", potentialId)
        .maybeSingle(); // Use maybeSingle to get one or null

      if (checkError) {
        setLoading(false);
        return alert("Error checking for unique user ID: " + checkError.message);
      }

      // If no user is found, the ID is unique
      if (!existingUser) {
        newUserId = potentialId;
        isUnique = true;
      }
      // If a user IS found, the loop will run again to get a new number
    }
    // --- END OF NEW LOGIC ---

    const defaultProfilePictureUrl = "https://hvozenqnulekdgxpphfb.supabase.co/storage/v1/object/public/profile_pictures/DefaultProfilePic.png";

    const { error: insertError } = await supabase.from("users").insert([{
      id: data.user.id,
      user_id: newUserId,
      role: "Donor",
      name: capitalizeWords(form.name),
      email: form.email,
      age: form.age ? parseInt(form.age) : null,
      gender: form.gender,
      contact: form.contact,
      address: capitalizeWords(form.address),
      blood_type: form.bloodType,
      profile_image_url: defaultProfilePictureUrl,
    }]);

    setLoading(false);
    if (insertError) return alert(insertError.message);
    
    onClose();
    router.push("/dashdonor");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Pane (Branding) */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-red-600 text-white">
            <h2 className="text-3xl font-bold">Become a Lifesaver</h2>
            <p className="mt-4 text-red-100">Join our community of heroes dedicated to saving lives. By creating an account, you&apos;re taking the first step in making a monumental impact.</p>
        </div>

        {/* Right Pane (Form) */}
        <div className="relative p-8 md:p-10 overflow-y-auto max-h-[90vh]">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Your Account</h2>
          <p className="text-gray-500 mb-6">Let&apos;s get you started on your donation journey.</p>
          
          <form onSubmit={handleSignup} className="text-black space-y-4">
           
            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
            <input name="name" placeholder="Juan Dela Cruz" value={form.name} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"  />
            
            <div className="grid grid-cols-2 gap-4">
                <InputField name="age" label="Age" type="number" placeholder="e.g., 25" value={form.age} onChange={handleChange} />
                <InputField name="gender" label="Gender" value={form.gender} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </InputField>
            </div>

            <InputField name="contact" label="Contact Number" placeholder="0917..." value={form.contact} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
            <InputField name="address" label="Address" placeholder="Iligan City, etc." value={form.address} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
            
            <InputField name="bloodType" label="Blood Type" value={form.bloodType} onChange={handleChange}>
                <option value="">Select Blood Type</option><option value="Unknown">Don&apos;t know yet</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
            </InputField>
            
            <div className="border-t pt-4 space-y-4">
                <InputField name="email" label="Email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
                <InputField name="password" label="Password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
                <InputField name="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-black px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>

            <button type="submit" disabled={loading} className={`w-full py-3 mt-4 rounded-lg text-white font-semibold transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </form>
          
          {onSwitchToLogin && (
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button onClick={onSwitchToLogin} className="font-semibold text-red-600 hover:underline">
                Log In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}