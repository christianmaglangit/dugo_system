"use client";

import { useEffect, useState, FC, ReactNode } from "react";
import Swal from "sweetalert2";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';

//========================================================//
// 1. ICONS (No changes needed)
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
const SendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 00.183 1.25l7 3.5a1 1 0 001.624 0l7-3.5a1 1 0 00.183-1.25l-7-14z" /></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>;

//========================================================//
// 2. TYPES & INTERFACES (No changes needed)
//========================================================//
type Appointment = { id: string; user_id?: string | null; donor_name: string; date: string; time?: string | null; location?: string | null; status: "Pending" | "Completed" | "Cancelled"; notes?: string | null; created_at?: string | null; };
type Donor = { id: string; user_id: string; name: string; email?: string; };

//========================================================//
// 3. CHILD COMPONENTS (No changes needed)
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
                {toggleSidebar && <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 dark:text-black rounded-full hover:bg-gray-100"><MenuIcon /></button>}
                <h1 className="text-xl font-bold text-gray-800">Manage Donor Appointments</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className || ""}`}>{children}</div>
);

// --- UPDATED StatCard COMPONENT ---
const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: ReactNode, color: string }) => (
    <Card className="relative overflow-hidden">
        <div className={`absolute -top-4 -right-4 h-16 w-16 ${color} opacity-20 rounded-full`}></div>
        <div className="relative flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color} text-white`}>{icon}</div>
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
        // status is only included if it's a new appointment (default to Pending)
        const payload: Partial<Appointment> = { 
            user_id: donorId || undefined, 
            donor_name: donorName, 
            date, 
            time: time || null, 
            location: location || null, 
            notes: notes || null 
        };
        if (!isEdit) {
            payload.status = 'Pending';
        }

        await onSave(payload);
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
                    <h2 className="2xl font-bold text-gray-800 mb-6">{isEdit ? "Edit Details" : "Appointment Details"}</h2>
                    <div className="space-y-4">
                        <div className="relative">
                            <InputField label="Registered Donor" name="donor-search">
                                <input type="text" placeholder="Search by ID or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-gray-50 dark:text-gray-700 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
                            </InputField>
                            {search && (
                                <div className="absolute dark:text-gray-700 z-10 bg-white border mt-1 rounded w-full max-h-40 overflow-y-auto shadow-lg">
                                    {donors.filter(d => d.user_id?.toLowerCase().includes(search.toLowerCase()) || d.name.toLowerCase().includes(search.toLowerCase())).map(d => (
                                        <div key={d.user_id} className="px-3 py-2 dark:text-gray-700 hover:bg-red-50 cursor-pointer" onClick={() => { setDonorId(d.user_id); setDonorName(d.name); setSearch(`${d.user_id} - ${d.name}`); }}>
                                            {d.user_id}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <InputField label="Donor Name" name="donorName">
                            <input type="text" value={donorName} onChange={(e) => { setDonorName(e.target.value); setDonorId(""); setSearch(""); }} placeholder="Enter full name" className="bg-gray-50 dark:text-gray-700 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" />
                        </InputField>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Date" name="date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-gray-50 border dark:text-gray-700 border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" /></InputField>
                            <InputField label="Time" name="time"><input type="time" value={time ?? ""} onChange={(e) => setTime(e.target.value)} className="bg-gray-50 border dark:text-gray-700 border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" /></InputField>
                        </div>
                        <InputField label="Location" name="location"><input value={location ?? ""} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Red Cross Office" className="bg-gray-50 dark:text-gray-700 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500" /></InputField>
                        {isEdit && (
                            <input type="hidden" name="status" value={status} />
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                            <textarea name="notes" value={notes ?? ""} onChange={(e) => setNotes(e.target.value)} className="bg-gray-50 dark:text-gray-700 border border-gray-300 px-3 py-2 rounded-lg w-full h-24 focus:outline-none focus:ring-2 focus:ring-red-500" />
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
// 4. MAIN PAGE COMPONENT 
//========================================================//
export default function ManageDonorAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [donors, setDonors] = useState<Donor[]>([]);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState<string>("All");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Appointment | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from("appointments").select("*").order("date", { ascending: true }).order("time", { ascending: true });
            if (error) throw error;
            const normalized: Appointment[] = (data || []).map((r: any) => ({
                id: r.id,
                user_id: r.user_id ?? null,
                donor_name: r.donor_name || r.name || "Unknown",
                date: r.date ? r.date.slice(0, 10) : "",
                time: r.time ?? r.time_string ?? null,
                location: r.location ?? null,
                status: r.status ?? "Pending",
                notes: r.notes ?? null,
                created_at: r.created_at ?? null,
            }));
            setAppointments(normalized);
        } catch (err) {
            console.error("fetchAppointments error", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDonors = async () => {
        try {
            const { data, error } = await supabase.from("users").select("id, user_id, name, email").eq("role", "Donor");
            if (error) throw error;
            setDonors((data || []) as Donor[]);
        } catch (err) {
            console.error("fetchDonors", err);
        }
    };

    useEffect(() => {
        fetchAppointments();
        fetchDonors();
        const channel = supabase.channel('public:appointments').on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, fetchAppointments).subscribe();
        return () => { supabase.removeChannel(channel); };
    }, []);

    const openAdd = () => { setEditing(null); setShowForm(true); };

    const saveAppointment = async (payload: Partial<Appointment>) => {
        try {
            if (editing) {
                const { error } = await supabase.from("appointments").update({
                    date: payload.date,
                    time: payload.time,
                    location: payload.location,
                    notes: payload.notes
                }).eq("id", editing.id);
                if (error) throw error;
                Swal.fire({ icon: "success", title: "Updated", timer: 1500, showConfirmButton: false });
            } else {
                const { error } = await supabase.from("appointments").insert([{ ...payload, status: "Pending" }]);
                if (error) throw error;
                Swal.fire({ icon: "success", title: "Created", timer: 1500, showConfirmButton: false });
            }
            setShowForm(false);
            setEditing(null);
            fetchAppointments();
        } catch (err: any) {
            Swal.fire({ icon: "error", title: "Error", text: err.message || "Failed to save" });
        }
    };

    // --- NEW FUNCTION: Send notification to a specific user/donor ---
    const sendNotification = async (customUserId: string, appointmentId: string, message: string) => {
        if (!customUserId || !message) {
            console.error("Custom User ID or message is missing.");
            return;
        }
        try {
            // 1. Get the internal 'id' (UUID) from the 'users' table using the 'user_id' (custom ID)
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id')
                .eq('user_id', customUserId)
                .single();

            if (userError || !userData) {
                // Not an error if the user_id is null/not found, but important to log the warning
                console.warn(`Could not find a user with the ID: ${customUserId}. Skipping notification.`);
                return;
            }

            // 2. Insert the notification record, using appointment_id column (Requires DB fix from step 1)
            const { error: notificationError } = await supabase
                .from('notifications')
                .insert({ user_id: userData.id, message: message, appointment_id: appointmentId });

            if (notificationError) throw notificationError;
            console.log("Notification saved successfully to DB.");
        } catch (error: any) {
            console.error("Error sending notification:", error);
            // Re-throw to be caught by the caller for Swal error
            throw error;
        }
    };
    // --- END NEW FUNCTION ---

    // Unified function to handle notification and status updates
    const sendCustomNotification = async (appointment: Appointment, action: 'Notify' | 'Completed' | 'Cancelled') => {
    const donor = donors.find(d => d.user_id === appointment.user_id);
    const donorInfo = {
        id: appointment.user_id || 'N/A',
        email: donor?.email || 'Not Available'
    };

    let statusUpdate: Partial<Appointment> = {};
    let title = '';
    let confirmText = '';
    let initialMessage = '';
    let confirmColor = '#ef4444';
    
    // Determine the full date and time string for the message
    const dateTimeString = appointment.time 
        ? `${appointment.date} at ${appointment.time}` 
        : appointment.date;

    if (action === 'Completed') {
        title = `Confirm Completion for ${appointment.donor_name}`;
        confirmText = 'Mark as Completed & Notify';
        initialMessage = `Great news! Your donation appointment on ${dateTimeString} was successfully completed. Thank you for your life-saving contribution!`;
        statusUpdate.status = 'Completed';
        confirmColor = '#10b981';
    } else if (action === 'Cancelled') {
        title = `Cancel Appointment for ${appointment.donor_name}`;
        confirmText = 'Confirm Cancellation & Notify';
        initialMessage = `We regret to inform you that your appointment on ${dateTimeString} has been cancelled because...`;
        statusUpdate.status = 'Cancelled';
        confirmColor = '#ef4444';
    } else { // Notify (custom message only)
        title = `Send Custom Message to ${appointment.donor_name}`;
        confirmText = 'Send Message';
        // MODIFICATION HERE: Use the new dateTimeString variable
        initialMessage = `We wanted to inform you that your appointment on ${dateTimeString}, See you there.`;
        confirmColor = '#3b82f6';
    }

        const { value: message, isConfirmed } = await Swal.fire({
            title: title,
            html: `
            <p class="text-sm text-gray-600 mb-3 text-left">
            Donor ID: <b>${donorInfo.id}</b><br>
            Donor Email: <b>${donorInfo.email}</b>
            </p>
            <textarea id="swal-message" class="swal2-textarea" placeholder="Type your message here..." rows="5">${initialMessage}</textarea>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: confirmText,
            confirmButtonColor: confirmColor,
            preConfirm: () => (document.getElementById('swal-message') as HTMLTextAreaElement).value
        });

        if (!isConfirmed || !message) return;

        try {
            // 1. Send the Notification to the user (This is the crucial step now working after DB fix)
            if (appointment.user_id) {
                await sendNotification(appointment.user_id, appointment.id, message);
            } else {
                Swal.fire('Warning', 'Notification could not be sent. This appointment is not linked to a registered user ID.', 'warning');
            }

            // 2. Update the Appointment status and notes
            const newNote = `[${action} - ${new Date().toLocaleString()}] Sent: ${message}`;
            statusUpdate.notes = (appointment.notes ? appointment.notes + '\n' : '') + newNote;
            if (Object.keys(statusUpdate).length > 0) {
                const { error } = await supabase.from("appointments").update(statusUpdate).eq("id", appointment.id);
                if (error) throw error;
            }

            Swal.fire({
                icon: "success",
                title: action === 'Notify' ? "Message Sent" : `Status Updated to ${statusUpdate.status}`,
                text: `Status updated and notification sent to the donor.`,
                timer: 2000, showConfirmButton: false
            });
            fetchAppointments();

        } catch (err: any) {
            Swal.fire({ icon: "error", title: "Error", text: err.message || `Failed to perform ${action} action` });
        }
    };

    // Helper functions remain the same, now utilizing the correct logic
    const notifyDonor = (a: Appointment) => sendCustomNotification(a, 'Notify');
    const cancelAppointment = (a: Appointment) => sendCustomNotification(a, 'Cancelled');
    const completeAppointment = (a: Appointment) => sendCustomNotification(a, 'Completed');

    // ... (rest of the component logic for filtering, stats, and rendering) ...
    const handleExportPDF = async () => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const { value: formValues, isConfirmed } = await Swal.fire({
            title: 'Select Month and Year for Report',
            html: `
            <select id="swal-month" class="swal2-select">
            ${months.map((m, i) => `<option value="${i}" ${i === currentMonth ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
            <input id="swal-year" type="number" value="${currentYear}" class="swal2-input">
            `,
            focusConfirm: false,
            preConfirm: () => ({
                month: (document.getElementById('swal-month') as HTMLSelectElement).value,
                year: (document.getElementById('swal-year') as HTMLInputElement).value
            })
        });

        if (!isConfirmed || !formValues) return;

        const selectedMonth = parseInt(formValues.month, 10);
        const selectedYear = parseInt(formValues.year, 10);

        const filteredApps = appointments.filter(a => {
            const appDate = new Date(a.date);
            return appDate.getMonth() === selectedMonth && appDate.getFullYear() === selectedYear;
        });

        if (filteredApps.length === 0) {
            Swal.fire('No Data', `No appointments found for ${months[selectedMonth]} ${selectedYear}.`, 'info');
            return;
        }

        const stats = {
            total: filteredApps.length,
            pending: filteredApps.filter(a => a.status === 'Pending').length,
            completed: filteredApps.filter(a => a.status === 'Completed').length,
            cancelled: filteredApps.filter(a => a.status === 'Cancelled').length,
        };

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Monthly Appointment Report', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`${months[selectedMonth]} ${selectedYear}`, pageWidth / 2, 28, { align: 'center' });

        autoTable(doc, {
            startY: 40,
            head: [['Summary', 'Total']],
            body: [
                ['Total Appointments', stats.total],
                ['Pending', stats.pending],
                ['Completed', stats.completed],
                ['Cancelled', stats.cancelled],
            ],
            theme: 'grid',
            headStyles: { fillColor: [209, 36, 42] }
        });

        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 10,
            head: [['Donor Name', 'Date & Time', 'Status']],
            body: filteredApps.map(a => [
                a.donor_name,
                `${a.date} ${a.time || ''}`.trim(),
                a.status,
            ]),
            theme: 'striped',
            headStyles: { fillColor: [209, 36, 42] }
        });

        doc.save(`Appointment_Report_${months[selectedMonth]}_${selectedYear}.pdf`);
    };

    const filtered = appointments.filter((a) => {
        const q = search.trim().toLowerCase();
        const matchesSearch = !q || a.donor_name.toLowerCase().includes(q) || (a.user_id ?? "").toLowerCase().includes(q) || (a.location ?? "").toLowerCase().includes(q);
        const matchesStatus = filterStatus === "All" || a.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const todayCount = appointments.filter(a => a.date === new Date().toISOString().slice(0, 10) && a.status === "Pending").length;
    const upcomingCount = appointments.filter(a => a.date > new Date().toISOString().slice(0, 10) && a.status === "Pending").length;

    return (
        <div className="flex bg-gray-50 min-h-screen">
            <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="flex-1 w-full transition-all duration-300 md:ml-72">
                <Header toggleSidebar={toggleSidebar} />
                <main className="mt-20 p-4 md:p-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <StatCard title="Appointments Today" value={todayCount} icon={<AppointmentIcon />} color="bg-blue-500" />
                        <StatCard title="Upcoming Appointments" value={upcomingCount} icon={<ReportIcon />} color="bg-purple-500" />
                        <StatCard title="Total Pending" value={appointments.filter(a => a.status === 'Pending').length} icon={<UsersIcon />} color="bg-yellow-500" />
                    </div>

                    <Card>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                            <div className="relative w-full md:flex-grow">
                                <input 
                                    type="text" 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)} 
                                    placeholder="Search by name, ID, location..." 
                                    className="w-full dark:text-gray-700 pl-4 pr-4 py-2.5 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-400" 
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <select 
                                    value={filterStatus} 
                                    onChange={(e) => setFilterStatus(e.target.value)} 
                                    className="w-full dark:text-gray-700 md:w-auto border px-3 py-2.5 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 whitespace-nowrap"
                                >
                                    <option value="All">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                
                                <button 
                                    onClick={handleExportPDF} 
                                    className="w-full md:w-auto px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-sm transition whitespace-nowrap text-sm"
                                >
                                    Export
                                </button>
                                
                                <button 
                                    onClick={openAdd} 
                                    className="w-full md:w-auto px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm transition whitespace-nowrap text-sm"
                                >
                                    + New
                                </button>
                            </div>
                        </div>
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm min-w-[1000px]">
                                <thead className="bg-gray-50">
                                    <tr className="text-left text-gray-500 uppercase text-xs font-semibold">
                                        <th className="p-4">Donor</th>
                                        <th className="p-4">Date & Time</th>
                                        <th className="p-4">Location</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (<tr><td colSpan={5} className="text-center p-8 text-gray-500">Loading...</td></tr>) :
                                    filtered.length === 0 ? (<tr><td colSpan={5} className="text-center p-8 text-gray-500">No appointments found.</td></tr>) :
                                    (filtered.map((a) => (
                                        <tr key={a.id} className="hover:bg-gray-50">
                                            <td className="p-4"><div className="font-semibold text-gray-800">{a.donor_name}</div><div className="text-gray-500 font-mono">{a.user_id || 'N/A'}</div></td>
                                            <td className="p-4"><div className="font-semibold dark:text-gray-700">{a.date}</div><div className="text-gray-500">{a.time || 'N/A'}</div></td>
                                            <td className="p-4 text-gray-600">{a.location || 'N/A'}</td>
                                            <td className="p-4 text-center"><StatusBadge status={a.status} /></td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center items-center gap-1">
                                                    <button onClick={() => notifyDonor(a)} title="Notify Donor / Send Message" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"><SendIcon /></button>
                                                    {a.status === 'Pending' && <button onClick={() => completeAppointment(a)} title="Mark as Completed & Notify" className="p-1.5 text-green-600 hover:bg-green-100 rounded-md"><CheckIcon /></button>}
                                                    {a.status === 'Pending' && <button onClick={() => cancelAppointment(a)} title="Cancel Appointment & Notify" className="p-1.5 text-red-600 hover:bg-red-100 rounded-md"><CancelIcon /></button>}
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </div>

                        {/* 2. CARD VIEW for Mobile (hidden on desktop) */}
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {loading ? (<div className="text-center p-8 text-gray-500">Loading...</div>) :
                            filtered.length === 0 ? (<div className="text-center p-8 text-gray-500">No appointments found.</div>) :
                            (filtered.map((a) => (
                                <div key={a.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-semibold text-gray-800">{a.donor_name}</p>
                                            <p className="text-xs text-gray-500 font-mono">{a.user_id || 'N/A'}</p>
                                        </div>
                                        <StatusBadge status={a.status} />
                                    </div>
                                    <div className="text-sm text-gray-700 space-y-2">
                                        <div className="flex justify-between">
                                            <strong className="text-gray-500">Date & Time:</strong>
                                            <span>{a.date} at {a.time || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <strong className="text-gray-500">Location:</strong>
                                            <span className="text-right">{a.location || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="border-t mt-3 pt-3 flex justify-end items-center gap-2">
                                        <button onClick={() => notifyDonor(a)} title="Notify Donor / Send Message" className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md"><SendIcon /></button>
                                        {a.status === 'Pending' && <button onClick={() => completeAppointment(a)} title="Mark as Completed & Notify" className="p-1.5 text-green-600 hover:bg-green-100 rounded-md"><CheckIcon /></button>}
                                        {a.status === 'Pending' && <button onClick={() => cancelAppointment(a)} title="Cancel Appointment & Notify" className="p-1.5 text-red-600 hover:bg-red-100 rounded-md"><CancelIcon /></button>}
                                    </div>
                                </div>
                            )))}
                        </div>
                    </Card>
                    
                    {showForm && <AppointmentForm donors={donors} initial={editing} onClose={() => { setShowForm(false); setEditing(null); }} onSave={saveAppointment} />}
                </main>
            </div>
        </div>
    );
};