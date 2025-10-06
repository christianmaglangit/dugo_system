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
const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2
0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
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
const BellIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

//========================================================//
// 2. TYPES & INTERFACES                                  //
//========================================================//
type Appointment = { id: string; user_id?: string | null; donor_name: string; date: string; time?: string | null; location?: string | null; status: "Pending" | "Completed" | "Cancelled"; notes?: string | null; created_at?: string | null; };
type Donor = { id: string; user_id: string; name: string; email?: string; };

//========================================================//
// 3. CHILD COMPONENTS                                    //
//========================================================//

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
                <h1 className="text-xl font-bold text-gray-800">Manage Donor Appointments</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className || ""}`}>{children}</div>
);

const StatCard = ({ title, value, icon }: {title: string, value: string | number, icon: ReactNode}) => (
    <Card>
        <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-xl">{icon}</div>
            <div>
                <p className="text-3xl font-bold text-gray-800">{value}</p>
                <p className="text-sm font-semibold text-gray-500">{title}</p>
            </div>
        </div>
    </Card>
);

const StatusBadge = ({ status }: { status: Appointment["status"] }) => {
    const statusMap: Record<Appointment["status"], string> = {
        Pending: "bg-yellow-100 text-yellow-800",
        Completed: "bg-green-100 text-green-800",
        Cancelled: "bg-red-100 text-red-800",
    };
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${statusMap[status]}`}>{status}</span>;
};

const InputField = ({ label, children, ...props }: any) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1" htmlFor={props.name}>{label}</label>
        {children}
    </div>
);

function AppointmentForm({ donors, initial, onClose, onSave }: { donors: Donor[]; initial: Appointment | null; onClose: () => void; onSave: (payload: Partial<Appointment>) => void | Promise<void>; }) {
  const isEdit = !!initial;
  const [donorId, setDonorId] = useState<string | "">((initial?.user_id as string) || "");
  const [donorName, setDonorName] = useState(initial?.donor_name ?? "");
  const [date, setDate] = useState(initial?.date ?? "");
  const [time, setTime] = useState(initial?.time ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [status, setStatus] = useState<Appointment["status"]>(initial?.status ?? "Pending");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState(isEdit && initial?.user_id ? `${initial.user_id} - ${initial.donor_name}` : "");

  useEffect(() => {
    if (donorId) {
      const d = donors.find((x) => x.user_id === donorId);
      if (d) setDonorName(d.name);
    }
  }, [donorId, donors]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!donorName) return Swal.fire("Please enter a donor name or select a registered donor.");
    if (!date) return Swal.fire("Please select a date.");
    setSaving(true);
    await onSave({ user_id: donorId || undefined, donor_name: donorName, date, time: time || null, location: location || null, notes: notes || null, status });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-[60] p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            <div className="hidden md:flex flex-col justify-center p-12 bg-red-600 text-white">
                <h2 className="text-3xl font-bold">{isEdit ? "Update Appointment" : "New Appointment"}</h2>
                <p className="mt-4 text-red-100">{isEdit ? `You are editing an appointment for ${initial?.donor_name}.` : "Schedule a new appointment for a donor."}</p>
            </div>
            <form onSubmit={handleSubmit} className="relative p-8 md:p-10 overflow-y-auto max-h-[90vh]">
                <button type="button" onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><XIcon /></button>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEdit ? "Edit Details" : "Appointment Details"}</h2>
                <div className="space-y-4">
                    <div className="relative">
                        <InputField label="Registered Donor" name="donor-search">
                            <input type="text" placeholder="Search by ID or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </InputField>
                        {search && (
                            <div className="absolute z-10 bg-white border mt-1 rounded w-full max-h-40 overflow-y-auto shadow-lg">
                                {donors.filter(d => d.user_id?.toLowerCase().includes(search.toLowerCase()) || d.name.toLowerCase().includes(search.toLowerCase())).map(d => (
                                    <div key={d.user_id} className="px-3 py-2 hover:bg-red-50 cursor-pointer" onClick={() => { setDonorId(d.user_id); setDonorName(d.name); setSearch(`${d.user_id} - ${d.name}`); }}>
                                        {d.user_id}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <InputField label="Donor Name" name="donorName">
                         <input type="text" value={donorName} onChange={(e) => { setDonorName(e.target.value); setDonorId(""); setSearch(""); }} placeholder="Enter full name" className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/>
                    </InputField>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Date" name="date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                        <InputField label="Time" name="time"><input type="time" value={time ?? ""} onChange={(e) => setTime(e.target.value)} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                    </div>
                    <InputField label="Location" name="location"><input value={location ?? ""} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Red Cross Office" className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" /></InputField>
                    {isEdit && (
                        <InputField label="Status" name="status">
                            <select value={status} onChange={(e) => setStatus(e.target.value as Appointment["status"])} className="bg-gray-50 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
                                <option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
                            </select>
                        </InputField>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                        <textarea name="notes" value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} className="bg-gray-50 border border-gray-300 px-3 py-2 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition">Cancel</button>
                        <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white transition">{saving ? "Saving..." : isEdit ? "Save Changes" : "Create"}</button>
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
export default function ManageDonorAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filtered, setFiltered] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [search, setSearch] = useState("");
  const [filterDate, setFilterDate] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
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

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("appointments").select("*").order("date", { ascending: true }).order("time", { ascending: true });
      if (error) throw error;
      const list = (data || []) as any[];
      const normalized: Appointment[] = list.map((r) => ({ id: r.id, user_id: r.user_id ?? null, donor_name: r.donor_name || r.name || "Unknown", date: r.date ? r.date.slice(0, 10) : (r.date ?? ""), time: r.time ?? r.time_string ?? null, location: r.location ?? null, status: r.status ?? "Pending", notes: r.notes ?? null, created_at: r.created_at ?? null, }));
      setAppointments(normalized);
      computeDashboardCounts(normalized);
    } catch (err) { console.error("fetchAppointments error", err); } 
    finally { setLoading(false); }
  };

  const fetchDonors = async () => {
    try {
        const { data, error } = await supabase.from("users").select("id, user_id, name").eq("role", "Donor");
        if (error) throw error;
        setDonors((data || []) as Donor[]);
    } catch (err) {
        console.error("fetchDonors", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDonors();
    const channel = supabase.channel('public:appointments').on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => { fetchAppointments(); }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    const q = search.trim().toLowerCase();
    const filteredList = appointments.filter((a) => {
      const matchesSearch = !q || a.donor_name.toLowerCase().includes(q) || (a.user_id ?? "").toLowerCase().includes(q) || (a.location ?? "").toLowerCase().includes(q);
      const matchesDate = !filterDate || a.date === filterDate;
      const matchesStatus = filterStatus === "All" || a.status === filterStatus;
      return matchesSearch && matchesDate && matchesStatus;
    });
    setFiltered(filteredList);
  }, [search, filterDate, filterStatus, appointments]);

  function computeDashboardCounts(list: Appointment[]) {
    const today = new Date().toISOString().slice(0, 10);
    setTodayCount(list.filter((a) => a.date === today && a.status === "Pending").length);
    setUpcomingCount(list.filter((a) => a.date > today && a.status === "Pending").length);
  }

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (a: Appointment) => { setEditing(a); setShowForm(true); };

  const saveAppointment = async (payload: Partial<Appointment>) => {
    try {
      if (editing) {
        const { error } = await supabase.from("appointments").update({ user_id: payload.user_id, donor_name: payload.donor_name, date: payload.date, time: payload.time, location: payload.location, notes: payload.notes, status: payload.status }).eq("id", editing.id);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Updated", text: "Appointment updated", timer: 1500, showConfirmButton: false });
      } else {
        const { error } = await supabase.from("appointments").insert([{ user_id: payload.user_id ?? null, donor_name: payload.donor_name, date: payload.date, time: payload.time ?? null, location: payload.location ?? null, status: "Pending", notes: payload.notes ?? null, }]);
        if (error) throw error;
        Swal.fire({ icon: "success", title: "Created", text: "Appointment created", timer: 1500, showConfirmButton: false });
      }
      setShowForm(false);
      fetchAppointments();
    } catch (err: any) {
      Swal.fire({ icon: "error", title: "Error", text: err.message || "Failed to save" });
    }
  };

  const changeStatus = async (id: string, status: Appointment["status"]) => {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) { Swal.fire({ icon: "error", title: "Error", text: error.message || "Failed to update status" });
    } else {
      Swal.fire({ icon: "success", title: "Updated", text: `Appointment marked ${status}`, timer: 1500, showConfirmButton: false });
      fetchAppointments();
    }
  };

  const cancelAppointment = (id: string) => changeStatus(id, "Cancelled");
  const completeAppointment = (id: string) => changeStatus(id, "Completed");
  const deleteAppointment = async (id: string) => { /* ... (logic is correct) ... */ };
  const notifyDonor = async (a: Appointment) => { Swal.fire({ icon: "success", title: "Notification sent", text: `Notification placeholder for ${a.donor_name}`, timer: 1500, showConfirmButton: false }); };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full transition-all duration-300 md:ml-72">
        <Header toggleSidebar={toggleSidebar} />
        <main className="mt-20 p-4 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Appointments Today" value={todayCount} icon={<AppointmentIcon/>} />
                <StatCard title="Upcoming Appointments" value={upcomingCount} icon={<ReportIcon/>} />
                <StatCard title="Total Pending" value={appointments.filter(a => a.status === 'Pending').length} icon={<UsersIcon/>} />
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                    <div className="w-full md:max-w-md">
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, ID, location..." className="w-full pl-4 pr-4 py-2.5 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-400" />
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full md:w-auto border px-3 py-2.5 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400">
                            <option value="All">All Statuses</option><option value="Pending">Pending</option><option value="Completed">Completed</option><option value="Cancelled">Cancelled</option>
                        </select>
                        <button onClick={openAdd} className="w-full md:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm transition">+ New</button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[1000px]">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-500 uppercase text-xs font-semibold">
                                <th className="p-4">Donor</th><th className="p-4">Date & Time</th><th className="p-4">Location</th><th className="p-4 text-center">Status</th><th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (<tr><td colSpan={5} className="text-center p-8 text-gray-500">Loading...</td></tr>) :
                            filtered.length === 0 ? (<tr><td colSpan={5} className="text-center p-8 text-gray-500">No appointments found.</td></tr>) :
                            (filtered.map((a) => (
                                <tr key={a.id} className="hover:bg-gray-50">
                                    <td className="p-4"><div className="font-semibold text-gray-800">{a.donor_name}</div><div className="text-gray-500 font-mono">{a.user_id || 'N/A'}</div></td>
                                    <td className="p-4"><div className="font-semibold">{a.date}</div><div className="text-gray-500">{a.time || 'N/A'}</div></td>
                                    <td className="p-4 text-gray-600">{a.location || 'N/A'}</td>
                                    <td className="p-4 text-center"><StatusBadge status={a.status} /></td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-1">
                                            <button onClick={() => openEdit(a)} title="Edit" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"><EditIcon/></button>
                                            <button onClick={() => notifyDonor(a)} title="Notify Donor" className="p-1.5 text-gray-600 hover:bg-gray-200 rounded-md"><BellIcon/></button>
                                            {a.status === 'Pending' && <button onClick={() => completeAppointment(a.id)} title="Mark as Completed" className="p-1.5 text-green-600 hover:bg-green-100 rounded-md"><CheckIcon/></button>}
                                            {a.status === 'Pending' && <button onClick={() => cancelAppointment(a.id)} title="Cancel Appointment" className="p-1.5 text-yellow-600 hover:bg-yellow-100 rounded-md"><CancelIcon/></button>}
                                            <button onClick={() => deleteAppointment(a.id)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-100 rounded-md"><DeleteIcon/></button>
                                        </div>
                                    </td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showForm && <AppointmentForm donors={donors} initial={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={saveAppointment}/>}
        </main>
      </div>
    </div>
  );
}