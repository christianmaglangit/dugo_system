"use client";

import { useEffect, useState, FC, ReactNode } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
const LinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;
const NoteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V6.414A2 2 0 0017.414 5L14 1.586A2 2 0 0012.586 1H6a2 2 0 00-2 2zm6 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>;


//========================================================//
// 2. TYPES & CHILD COMPONENTS                            //
//========================================================//
type BloodRequest = { id: string; user_id?: string; hospital_name: string; blood_type: string; blood_component: string; units: number; status: "Pending" | "Approved" | "Rejected" | "Fulfilled"; requested_at?: string | null; updated_at?: string | null; notes?: string | null; request_form_file?: string | null; indigency_file?: string | null; senior_id_file?: string | null; referral_note_file?: string | null; proof_url?: string | null; };

function BloodbankSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();
    const links = [
      { name: "Dashboard", href: "/dashredcross", icon: <DashboardIcon /> },
      { name: "Manage Inventory", href: "/dashredcross/manage_inventory", icon: <InventoryIcon /> },
      { name: "Manage Accounts", href: "/dashredcross/manage_users_account", icon: <UsersIcon /> },
      { name: "Manage Appointments", href: "/dashredcross/manage_donor_appointment", icon: <AppointmentIcon /> },
      { name: "Predictive Reports", href: "/dashredcross/manage_predictive_reports", icon: <ReportIcon /> },
      { name: "Blood Requests", href: "/dashredcross/manage_blood_request", icon: <RequestIcon /> },
      { name: "Blood Campaigns", href: "/dashredcross/manage_blood_campaign", icon: <CampaignIcon /> },
      { name: "Scan Blood Bags", href: "/dashredcross/manage_scan_blood_bag", icon: <ScanIcon /> },
      { name: "Hospital Inventory", href: "/dashredcross/manage_hospital_inventory", icon: <HospitalIcon /> },
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

function Header({ toggleSidebar }: { toggleSidebar?: () => void }) {
    const router = useRouter();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 z-40 md:left-72">
            <div className="flex items-center gap-4">
                {toggleSidebar && <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100"><MenuIcon /></button>}
                <h1 className="text-xl font-bold text-gray-800">Blood Request Management</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className || ""}`}>{children}</div>
);

const StatCard = ({ title, value, icon, color }: {title: string, value: string | number, icon: ReactNode, color: string}) => (
    <Card className={`relative overflow-hidden`}>
        <div className={`absolute -top-4 -right-4 h-16 w-16 ${color} opacity-20 rounded-full`}></div>
        <div className="relative flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color} text-white`}>{icon}</div>
            <div>
                <p className="text-3xl font-extrabold text-gray-800">{value}</p>
                <p className="text-sm text-gray-500 font-semibold">{title}</p>
            </div>
        </div>
    </Card>
);

const StatusBadge = ({ status }: { status: BloodRequest["status"] }) => {
    const statusMap: Record<BloodRequest["status"], string> = {
        Pending: "bg-yellow-100 text-yellow-800",
        Approved: "bg-blue-100 text-blue-800",
        Fulfilled: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800",
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusMap[status]}`}>{status}</span>;
};

const InputField = ({ label, children, ...props }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor={props.name}>{label}</label>
        {children}
    </div>
);

function AddRequestForm({ onClose, onSave, }: { onClose: () => void; onSave: (payload: any) => void; }) {
    const [users, setUsers] = useState<{ user_id: string }[]>([]);
    const [form, setForm] = useState({
        user_id: "", hospital_name: "", blood_type: "", blood_component: "", units: 1,
        request_form_file: null as File | null, indigency_file: null as File | null,
        senior_id_file: null as File | null, referral_note_file: null as File | null,
    });

    useEffect(() => {
        const fetchUsers = async () => {
            const { data, error } = await supabase.from("users").select("user_id").eq("role", "Donor");
            if (error) console.error(error); else setUsers(data || []);
        };
        fetchUsers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.user_id || !form.hospital_name || !form.blood_type || !form.blood_component || !form.request_form_file) {
            Swal.fire("Error", "All required fields must be filled!", "error"); return;
        }

        try {
            const uploadFile = async (file: File | null) => {
                if(!file) return null;
                const filePath = `public/${Date.now()}_${file.name}`;
                const { error } = await supabase.storage.from("blood_requests").upload(filePath, file);
                if (error) throw error;
                return supabase.storage.from("blood_requests").getPublicUrl(filePath).data.publicUrl;
            }

            const [requestFormUrl, indigencyUrl, seniorIdUrl, referralNoteUrl] = await Promise.all([
                uploadFile(form.request_form_file),
                uploadFile(form.indigency_file),
                uploadFile(form.senior_id_file),
                uploadFile(form.referral_note_file),
            ]);

            const payload = { ...form, request_form_file: requestFormUrl, indigency_file: indigencyUrl, senior_id_file: seniorIdUrl, referral_note_file: referralNoteUrl };
            onSave(payload);
        } catch (err: any) {
            Swal.fire("Error", err.message, "error");
        }
    };
  
    return (
       <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
              <div className="hidden md:flex flex-col justify-center p-12 bg-red-600 text-white">
                  <h2 className="text-3xl font-bold">New Blood Request</h2>
                  <p className="mt-4 text-red-100">Fill out the form to request blood units from the blood bank. Please provide accurate information.</p>
              </div>
              <form onSubmit={handleSubmit} className="relative p-8 md:p-10 overflow-y-auto max-h-[90vh]">
                  <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><XIcon /></button>
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Request Details</h2>
                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <InputField label="User ID" name="user_id">
                              <select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
                                  <option value="">Select Donor</option>
                                  {users.map(u => <option key={u.user_id} value={u.user_id}>{u.user_id}</option>)}
                              </select>
                          </InputField>
                          <InputField label="Hospital Name" name="hospital_name">
                              <input type="text" value={form.hospital_name} onChange={(e) => setForm({ ...form, hospital_name: e.target.value })} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/>
                          </InputField>
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                          <InputField label="Blood Type" name="blood_type">
                              <select value={form.blood_type} onChange={(e) => setForm({ ...form, blood_type: e.target.value })} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
                                  <option value="">Select...</option><option value="A+">A+</option><option value="A-">A-</option><option value="B+">B+</option><option value="B-">B-</option><option value="AB+">AB+</option><option value="AB-">AB-</option><option value="O+">O+</option><option value="O-">O-</option>
                              </select>
                          </InputField>
                          <InputField label="Component" name="blood_component">
                              <select value={form.blood_component} onChange={(e) => setForm({ ...form, blood_component: e.target.value })} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
                                  <option value="">Select...</option><option value="Whole Blood">Whole Blood</option><option value="Plasma">Plasma</option><option value="Platelets">Platelets</option>
                              </select>
                          </InputField>
                      </div>
                      <InputField label="Units" name="units"><input type="number" min={1} value={form.units} onChange={(e) => setForm({ ...form, units: Number(e.target.value) })}  className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                      <InputField label="Request Form (Required)" name="request_form_file"><input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setForm({ ...form, request_form_file: e.target.files?.[0] || null })} className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                      <div className="border-t pt-4 space-y-4">
                           <label htmlFor="">For Indigency (Optional)</label>
                           <InputField label="Indigency Certificate" name="indigency_file"><input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setForm({ ...form, indigency_file: e.target.files?.[0] || null })} className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                           <InputField label="Senior Citizen ID" name="senior_id_file"><input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setForm({ ...form, senior_id_file: e.target.files?.[0] || null })} className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                           <InputField label="Referral Note" name="referral_note_file"><input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setForm({ ...form, referral_note_file: e.target.files?.[0] || null })} className="bg-gray-50 border border-gray-300 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                      </div>

                      <div className="flex justify-end gap-3 pt-4">
                          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition">Cancel</button>
                          <button type="submit" className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white transition">Add Request</button>
                      </div>
                  </div>
              </form>
          </div>
      </div>
    );
}

//========================================================//
// 4. MAIN PAGE COMPONENT                                 //
//========================================================//
export default function BloodRequestsPage() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("blood_requests").select("*").order("requested_at", { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load blood requests", "error");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchRequests();
    const channel = supabase.channel('public:blood_requests').on('postgres_changes', { event: '*', schema: 'public', table: 'blood_requests' }, () => fetchRequests()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const updateStatus = async (id: string, status: BloodRequest["status"], file?: File) => {
    try {
      let proof_url: string | null = null;
      if (status === "Fulfilled" && file) {
        const filePath = `public/${id}-${Date.now()}.${file.name.split(".").pop()}`;
        const { error: uploadError } = await supabase.storage.from("blood_requests").upload(filePath, file);
        if (uploadError) throw uploadError;
        proof_url = supabase.storage.from("blood_requests").getPublicUrl(filePath).data.publicUrl;
      }
      const { error } = await supabase.from("blood_requests").update({ status, proof_url }).eq("id", id);
      if (error) throw error;
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status, proof_url: proof_url || r.proof_url } : r));
      Swal.fire("Success", `Request ${status}`, "success");
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const addRequest = async (payload: any) => {
    try {
      const { data, error } = await supabase.from("blood_requests").insert([{ ...payload, status: "Pending", requested_at: new Date().toISOString() }]).select();
      if (error) throw error;
      Swal.fire("Success", "Request added", "success");
      setRequests(prev => [data![0], ...prev]);
      setShowForm(false);
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const handleFulfill = (id: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg,.jpeg,.png,.pdf";
    input.onchange = () => { if(input.files?.[0]) updateStatus(id, "Fulfilled", input.files[0]); };
    input.click();
  };

  const deleteRequest = async (id: string) => {
    const result = await Swal.fire({title: "Are you sure?", text: "This will permanently delete the request.", icon: "warning", showCancelButton: true, confirmButtonText: "Yes, delete it!"});
    if(!result.isConfirmed) return;
    try {
      const { error } = await supabase.from("blood_requests").delete().eq("id", id);
      if (error) throw error;
      Swal.fire("Deleted!", "Blood request has been deleted.", "success");
      setRequests(prev => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      Swal.fire("Error", err.message, "error");
    }
  };

  const filteredRequests = requests.filter((r) =>
    (r.user_id?.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
     r.hospital_name?.toLowerCase().includes(searchQuery.toLowerCase().trim()))
  );

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full transition-all duration-300 md:ml-72">
        <Header toggleSidebar={toggleSidebar} />
        <main className="mt-20 p-4 md:p-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Pending Requests" value={requests.filter(r => r.status === 'Pending').length} icon={<RequestIcon/>} color="bg-yellow-500" />
                <StatCard title="Approved Requests" value={requests.filter(r => r.status === 'Approved').length} icon={<CheckIcon/>} color="bg-blue-500" />
                <StatCard title="Fulfilled Today" value={requests.filter(r => r.status === 'Fulfilled' && new Date(r.updated_at!).toDateString() === new Date().toDateString()).length} icon={<InventoryIcon/>} color="bg-green-500" />
                <StatCard title="Total Requests" value={requests.length} icon={<UsersIcon/>} color="bg-gray-500" />
            </div>

            <Card>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <h2 className="text-xl font-bold text-gray-800 self-start md:self-center">Blood Requests</h2>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-auto">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" /></svg></span>
                            <input type="text" placeholder="Search Hospital or User ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                        </div>
                        <button onClick={() => setShowForm(true)} className="w-full md:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm transition">+ New Request</button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[1200px]">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-500 uppercase text-xs font-semibold">
                                <th className="p-4">Hospital</th><th className="p-4">Blood Needed</th><th className="p-4 text-center">Units</th><th className="p-4">Requested At</th><th className="p-4 text-center">Status</th><th className="p-4 text-center">Files</th><th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (<tr><td colSpan={7} className="text-center p-8 text-gray-500">Loading...</td></tr>) :
                            filteredRequests.length === 0 ? (<tr><td colSpan={7} className="text-center p-8 text-gray-500">No requests found.</td></tr>) :
                            (filteredRequests.map((r) => (
                                <tr key={r.id} className="hover:bg-gray-50">
                                    <td className="p-4"><div className="font-semibold text-gray-800">{r.hospital_name}</div><div className="text-gray-500 font-mono text-xs">{r.user_id || 'N/A'}</div></td>
                                    <td className="p-4"><div className="font-bold text-red-600">{r.blood_type}</div><div className="text-gray-500 text-xs">{r.blood_component}</div></td>
                                    <td className="p-4 text-center font-semibold">{r.units}</td>
                                    <td className="p-4 text-gray-600">{new Date(r.requested_at!).toLocaleString()}</td>
                                    <td className="p-4 text-center"><StatusBadge status={r.status} /></td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            {r.request_form_file && <a href={r.request_form_file} target="_blank" rel="noopener noreferrer" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md" title="Request Form"><LinkIcon /></a>}
                                            {r.proof_url && <a href={r.proof_url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-green-600 hover:bg-green-100 rounded-md" title="Proof of Fulfillment"><LinkIcon /></a>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            {r.status === "Pending" && <button onClick={() => updateStatus(r.id, "Approved")} title="Approve" className="p-1.5 text-green-600 hover:bg-green-100 rounded-md"><CheckIcon /></button>}
                                            {r.status === "Pending" && <button onClick={() => updateStatus(r.id, "Rejected")} title="Reject" className="p-1.5 text-red-600 hover:bg-red-100 rounded-md"><CancelIcon /></button>}
                                            {r.status === "Approved" && <button onClick={() => handleFulfill(r.id)} title="Mark as Fulfilled" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"><InventoryIcon /></button>}
                                            <button onClick={() => deleteRequest(r.id)} title="Delete" className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-md"><DeleteIcon /></button>
                                        </div>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {showForm && <AddRequestForm onClose={() => setShowForm(false)} onSave={addRequest}/>}
        </main>
      </div>
    </div>
  );
}
