"use client";

import { useState, useEffect, FC, ReactNode } from "react";
import Swal from "sweetalert2";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

//========================================================//
// 1. ICONS                                               //
//========================================================//
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.558 4.078a.75.75 0 00-1.06 1.06 5.25 5.25 0 007.238 0 .75.75 0 00-1.06-1.06 3.75 3.75 0 01-5.117 0zM15.625 9a2.375 2.375 0 100-4.75 2.375 2.375 0 000 4.75zM12.5 10.75a.75.75 0 00-1.06 1.06 5.25 5.25 0 007.238 0 .75.75 0 00-1.06-1.06 3.75 3.75 0 01-5.117 0z" /></svg>;
const AppointmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.25 2a.75.75 0 00-1.5 0v1.361A8.96 8.96 0 002.57 6.38a.75.75 0 001.362.614A7.46 7.46 0 0110 4.5c2.993 0 5.542 1.72 6.822 4.108a.75.75 0 001.362-.614A8.96 8.96 0 0011.25 3.361V2zM2.5 10a.75.75 0 01.75-.75h14a.75.75 0 010 1.5h-14a.75.75 0 01-.75-.75zm0 4.25a.75.75 0 001.362.614 7.46 7.46 0 0112.276 0 .75.75 0 101.362-.614A8.96 8.96 0 0010 12.5a8.96 8.96 0 00-7.43 3.138z" clipRule="evenodd" /></svg>;
const RequestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.5 10a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /><path d="M10 2a.75.75 0 00-7.465 5.222.75.75 0 001.478.204A6.5 6.5 0 0110 3.5a.75.75 0 000-1.5zM3.28 8.243a6.5 6.5 0 0111.41-3.662.75.75 0 101.246-.828A8 8 0 002.09 7.648a.75.75 0 101.19.595z" /></svg>;
const CampaignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0V2.75z" /><path d="M18.25 3.5a.75.75 0 00-1.5 0v1.636a.25.25 0 01-.25.25H6.5a.75.75 0 000 1.5h10a1.75 1.75 0 001.75-1.75V3.5z" /></svg>;
const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zm13.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /><path d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 000 2h8a1 1 0 100-2H5zm1 3a1 1 0 100 2h5a1 1 0 100-2H6z" /></svg>;
const HospitalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" /><path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-7a7 7 0 100 14 7 7 0 000-14z" clipRule="evenodd" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;

//========================================================//
// 2. TYPE DEFINITIONS                                    //
//========================================================//
interface UserAccount {
  id: string;
  user_id?: string;
  name: string;
  email?: string;
  role: string;
  age?: number;
  gender?: string;
  contact?: string;
  address?: string;
  blood_type?: string;
  donation_count?: number;
}

interface UserModalProps {
  user: UserAccount | null;
  onClose: () => void;
  onSave: (user: UserAccount) => void;
}

//========================================================//
// 3. CHILD COMPONENTS                                    //
//========================================================//

function BloodbankSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const links = [
    { name: "Dashboard", href: "/dashredcross", icon: <DashboardIcon/> },
    { name: "Manage Inventory", href: "/dashredcross/manage_inventory", icon: <InventoryIcon/> },
    { name: "Manage Accounts", href: "/dashredcross/manage_users_account", icon: <UsersIcon/> },
    { name: "Manage Appointments", href: "/dashredcross/manage_donor_appointment", icon: <AppointmentIcon/> },
    { name: "Predictive Reports", href: "/dashredcross/manage_predictive_reports", icon: <ReportIcon/> },
    { name: "Blood Requests", href: "/dashredcross/manage_blood_request", icon: <RequestIcon/> },
    { name: "Blood Campaigns", href: "/dashredcross/manage_blood_campaign", icon: <CampaignIcon/> },
    { name: "Scan Blood Bags", href: "/dashredcross/manage_scan_blood_bag", icon: <ScanIcon/> },
    { name: "Hospital Inventory", href: "/dashredcross/manage_hospital_inventory", icon: <HospitalIcon/> },
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/30 z-40 md:hidden" onClick={onClose}></div>}
      <aside className={`w-72 min-h-screen fixed left-0 top-0 bg-white shadow-lg p-6 flex-col z-50 transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:flex`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-red-600">DUGO</h2>
            <p className="text-xs text-gray-600 font-medium">
              (Donor Utility for Giving and Organizing)
            </p>
          </div>

          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-full hover:bg-gray-100"
          >
            <XIcon />
          </button>
        </div>
        <nav className="flex flex-col space-y-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-semibold ${pathname === link.href ? "bg-red-600 text-white shadow-md" : "text-gray-600 hover:bg-red-50 hover:text-red-600"}`}>
              {link.icon}
              <span>{link.name}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

function BloodbankHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
    const router = useRouter();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 z-40 md:left-72">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"><MenuIcon /></button>
                <h1 className="text-xl font-bold text-gray-800">Manage User Account</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const InputField = ({ name, label, value, onChange, type = "text", required = true, children, ...props }: any) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        {children ? (
            <select id={name} name={name} value={value} onChange={onChange} required={required} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" {...props}>
                {children}
            </select>
        ) : (
            <input id={name} type={type} name={name} value={value} onChange={onChange} required={required} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" {...props} />
        )}
    </div>
);

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const isEditing = !!user;
  const [formData, setFormData] = useState<UserAccount & { password?: string; confirmPassword?: string; }>({
    id: user?.id || "", name: user?.name || "", email: user?.email || "", role: user?.role || "", password: "", confirmPassword: "", age: user?.age || undefined, gender: user?.gender || "", contact: user?.contact || "", address: user?.address || "", blood_type: user?.blood_type || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        if (formData.role === "Donor") {
          const { error } = await supabase.from("users").update({ blood_type: formData.blood_type }).eq("id", formData.id);
          if (error) throw error;
        } else if (formData.role === "Hospital") {
          const { error } = await supabase.from("users").update({ contact: formData.contact, address: formData.address }).eq("id", formData.id);
          if (error) throw error;
        }
        Swal.fire({ icon: "success", title: "Success", text: "User updated!", timer: 2000, showConfirmButton: false });
        onSave(formData);
        onClose();
        return;
      }

      if (!formData.role) return alert("Please select a role!");
      if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");

      const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email!, password: formData.password || "DefaultPass123!" });
      if (authError || !authData.user) throw authError || new Error("Signup failed");

      let userId: string | null = null;
      const year = new Date().getFullYear();
      if (formData.role === "Donor" || formData.role === "Hospital") {
        const prefix = formData.role === "Donor" ? "D" : "H";
        const { count } = await supabase.from("users").select("id", { count: "exact", head: true }).eq("role", formData.role);
        userId = `${prefix}-${year}-${String((count || 0) + 1).padStart(5, "0")}`;
      }

      const { error: insertError } = await supabase.from("users").insert([{
        id: authData.user.id, user_id: userId, name: formData.name, email: formData.email, role: formData.role, age: formData.age || null, gender: formData.gender || null, contact: formData.contact || null, address: formData.address || null, blood_type: formData.role === "Donor" ? formData.blood_type : null,
      }]);
      if (insertError) throw insertError;

      Swal.fire({ icon: "success", title: "User Added", text: `${formData.name} has been successfully added!`, timer: 2000, showConfirmButton: false });
      onClose();
      onSave(formData);

    } catch (error: any) {
      Swal.fire({ icon: "error", title: "Error", text: error.message || "Something went wrong!" });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60] p-4">
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="hidden md:flex flex-col justify-center p-12 bg-red-600 text-white">
            <h2 className="text-3xl font-bold">{isEditing ? "Editing User" : "Add New User"}</h2>
            <p className="mt-4 text-red-100">{isEditing ? `You are currently editing the details for ${user?.name}.` : "Create a new donor or hospital account by filling out the form."}</p>
        </div>
        <div className="relative p-8 md:p-10 overflow-y-auto max-h-[90vh]">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><XIcon/></button>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? "Edit User Details" : "Create New User"}</h2>
          
          <div className="space-y-4">
              {!isEditing && (
                  <>
                      <InputField name="name" label="Full Name" placeholder="Juan Dela Cruz" value={formData.name} onChange={handleChange} />
                      <InputField name="email" label="Email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                      <InputField name="role" label="Role" value={formData.role} onChange={handleChange}>
                          <option value="">Select Role</option>
                          <option value="Donor">Donor</option>
                          <option value="Hospital">Hospital</option>
                      </InputField>
                  </>
              )}

              {formData.role === "Donor" && (
                  <div className="space-y-4 border-t pt-4">
                      {!isEditing && (
                          <div className="grid grid-cols-2 gap-4">
                              <InputField name="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                              <InputField name="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                          </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                         <InputField name="age" label="Age" type="number" placeholder="25" value={formData.age} onChange={handleChange} />
                          <InputField name="gender" label="Gender" value={formData.gender} onChange={handleChange}>
                              <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option>
                          </InputField>
                      </div>
                      <InputField name="contact" label="Contact" placeholder="09xx..." value={formData.contact} onChange={handleChange} />
                      <InputField name="address" label="Address" placeholder="City, etc." value={formData.address} onChange={handleChange} />
                      <InputField name="blood_type" label="Blood Type" value={formData.blood_type} onChange={handleChange}>
                          <option value="">Select...</option><option value="A+">A+</option><option value="A-">A-</option>
                          <option value="B+">B+</option><option value="B-">B-</option><option value="O+">O+</option><option value="O-">O-</option>
                          <option value="AB+">AB+</option><option value="AB-">AB-</option>
                      </InputField>
                  </div>
              )}

              {formData.role === "Hospital" && (
                  <div className="space-y-4 border-t pt-4">
                      {!isEditing && (
                           <div className="grid grid-cols-2 gap-4">
                                <InputField name="password" label="Password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                                <InputField name="confirmPassword" label="Confirm Password" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
                            </div>
                      )}
                      <InputField name="contact" label="Contact" placeholder="09xx..." value={formData.contact} onChange={handleChange} />
                      <InputField name="address" label="Address" placeholder="City, etc." value={formData.address} onChange={handleChange} />
                  </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                  <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition">Cancel</button>
                  <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white transition">Save Changes</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

//========================================================//
// 4. MAIN PAGE COMPONENT                                 //
//========================================================//
export default function ManageUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserAccount[]>([]);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [addingUser, setAddingUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState(""); // Add state for userName
  const router = useRouter();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  // Fetch user name for header
  useEffect(() => {
    const fetchUserName = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            const { data: profile } = await supabase.from("users").select("name").eq("id", user.id).single();
            if (profile) setUserName(profile.name);
        }
    };
    fetchUserName();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data: usersData, error } = await supabase.from("users").select("*");
    if (error) { console.error(error); setLoading(false); return; }

    const filtered = usersData.filter((u) => u.role?.trim().toLowerCase() !== "redcross");
    const usersWithDonations = await Promise.all(
      filtered.map(async (user) => {
        if (user.role === "Donor" && user.user_id) {
          const { count, error } = await supabase.from("blood_inventory").select("*", { count: "exact", head: true }).eq("user_id", user.user_id);
          return { ...user, donation_count: error ? 0 : count ?? 0 };
        }
        return { ...user, donation_count: null };
      })
    );
    setUsers(usersWithDonations as UserAccount[]);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    setFilteredUsers(users.filter(u => u.name.toLowerCase().includes(lower) || (u.email?.toLowerCase().includes(lower))));
  }, [searchQuery, users]);

  const handleDelete = async (id: string, userId: string, role: string) => {
    const result = await Swal.fire({ title: "Are you sure?", text: "This user will be deleted permanently!", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc2626", cancelButtonColor: "#6b7280", confirmButtonText: "Yes, delete it!", });
    if (result.isConfirmed) {
      try {
        if (role === "Donor" && userId) {
          const { count, error: countError } = await supabase.from("blood_inventory").select("*", { count: "exact", head: true }).eq("user_id", userId);
          if (countError) throw countError;
          if (count && count > 0) {
            Swal.fire("Cannot Delete", "This donor has donation records and cannot be deleted.", "warning");
            return;
          }
        }
        const { error } = await supabase.from("users").delete().eq("id", id);
        if (error) throw error;
        Swal.fire({ title: "Deleted!", text: "User has been deleted.", icon: "success", timer: 3000, showConfirmButton: false });
        fetchUsers();
      } catch (err: any) { Swal.fire("Error", err.message, "error"); }
    }
  };

  const handleSaveEdit = () => {
    fetchUsers();
    setEditingUser(null);
    setAddingUser(false);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full transition-all duration-300 md:ml-72">
        <BloodbankHeader toggleSidebar={toggleSidebar} />        <main className="mt-20 p-4 md:p-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="w-full md:max-w-md">
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" /></svg></span>
                  <input type="text" placeholder="Search by Name or Email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                </div>
              </div>
              <button onClick={() => setAddingUser(true)} className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold shadow-sm transition">+ New User</button>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-4 overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-gray-500 uppercase text-xs font-semibold">
                  <th className="p-4">User ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 text-center">Blood Type</th>
                  <th className="p-4 text-center">Total Donations</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                    <tr><td colSpan={7} className="text-center p-8 text-gray-500">Loading user data...</td></tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id || user.user_id} className="hover:bg-gray-50">
                      <td className="p-4 font-mono text-gray-700">{user.user_id || "-"}</td>
                      <td className="p-4 font-semibold text-gray-800">{user.name}</td>
                      <td className="p-4 text-gray-600">{user.email || "-"}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.role === 'Donor' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>{user.role}</span>
                      </td>
                      <td className="p-4 text-center font-semibold text-red-600">{user.blood_type || "-"}</td>
                      <td className="p-4 text-center font-semibold">{user.role === "Donor" ? user.donation_count : "-"}</td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => setEditingUser(user)} className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded text-white text-xs font-semibold transition"><EditIcon/> Edit</button>
                        <button onClick={() => handleDelete(user.id, user.user_id!, user.role)} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-white text-xs font-semibold transition"><DeleteIcon/> Delete</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={7} className="text-center p-8 text-gray-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {editingUser && <UserModal user={editingUser} onClose={() => setEditingUser(null)} onSave={handleSaveEdit} />}
          {addingUser && <UserModal user={null} onClose={() => setAddingUser(false)} onSave={handleSaveEdit} />}
        </main>
      </div>
    </div>
 );
}