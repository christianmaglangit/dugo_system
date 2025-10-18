"use client";

import { useState, useEffect,} from "react";
import Swal from "sweetalert2";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";

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
const QrCodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;

//========================================================//
// 2. CHILD COMPONENTS                                    //
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

function BloodbankHeader({ toggleSidebar }: { toggleSidebar: () => void }) {
    const router = useRouter();
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.replace("/");
    };
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 z-40 md:left-72">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="md:hidden p-2 -ml-2 rounded-full hover:bg-gray-100 dark:text-black"><MenuIcon /></button>
                <h1 className="text-xl font-bold text-gray-800">Manage Inventory</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const StatusBadge = ({ status, expiration_date }: { status: string, expiration_date: string }) => {
    const isExpired = new Date(expiration_date) < new Date();
    let effectiveStatus = isExpired ? "Expired" : status;
    
    const statusMap: Record<string, string> = {
        Available: "bg-green-100 text-green-800",
        Expired: "bg-red-100 text-red-800",
        Used: "bg-gray-100 text-gray-800",
    };
    const color = statusMap[effectiveStatus] || "bg-gray-100 text-gray-800";
    return <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${color}`}>{effectiveStatus}</span>;
};

const InputField = ({ label, children, ...props }: any) => (
    <div>
        <label htmlFor={props.name} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        {children}
    </div>
);

function AddInventoryModal({ isOpen, onClose, onSave, form, setForm, donors, campaigns, search, setSearch }: any) { // Add 'campaigns' here
    if (!isOpen) return null;
    const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
    const components = ["Red Blood Cells (RBCs)", "Plasma", "Platelets", "White Blood Cells (WBCs)"];
    
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
                <div className="hidden md:flex flex-col justify-center p-12 bg-red-600 text-white">
                    <h2 className="text-3xl font-bold">Add New Blood Stock</h2>
                    <p className="mt-4 text-red-100">Ensure all details are accurate to maintain a reliable inventory for life-saving transfusions.</p>
                </div>
                <div className="relative p-8 md:p-10 overflow-y-auto max-h-[90vh]">
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"><XIcon/></button>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Stock Details</h2>
                    <div className="space-y-4">
                        <div className="relative">
                           <InputField label="Donor" name="donor-search">
                                <input type="text" placeholder="Search donor by ID or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-gray-50 border dark:text-gray-700 border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/>
                           </InputField>
                            {search && (
                                <div className="absolute z-10 dark:text-gray-700 bg-white border mt-1 rounded w-full max-h-40 overflow-y-auto shadow-lg">
                                    {donors.filter((d: any) => d.user_id?.toLowerCase().includes(search.toLowerCase()) || d.name.toLowerCase().includes(search.toLowerCase())).map((d: any) => (
                                        <div key={d.user_id} className="px-3 py-2 dark:text-gray-700 hover:bg-red-50 cursor-pointer" onClick={() => { setForm({ ...form, user_id: d.user_id }); setSearch(`${d.user_id} - ${d.name}`); }}>
                                            {d.user_id} 
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                            <InputField label="Source Campaign (Optional)" name="campaign_id">
                                <select 
                                    value={form.campaign_id || ""} 
                                    onChange={(e) => setForm({ ...form, campaign_id: e.target.value })} 
                                    className="bg-gray-50 border dark:text-gray-700 border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
                                    <option value="">Walk-in / Not from a campaign</option>
                                    {campaigns.map((c: any) => (
                                        <option key={c.id} value={c.id}>{c.title}</option>
                                    ))}
                                </select>
                            </InputField>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Blood Type" name="type">
                                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="bg-gray-50 border dark:text-gray-700 border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
                                    <option value="">Select...</option>
                                    {bloodTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </InputField>
                            <InputField label="Component" name="component">
                                <select value={form.component} onChange={(e) => setForm({ ...form, component: e.target.value })} className="bg-gray-50 dark:text-gray-700 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500">
                                    <option value="">Select...</option>
                                    {components.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </InputField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Units" name="units"><input type="number" placeholder="0" value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} className="bg-gray-50 border dark:text-gray-700 border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                            <InputField label="Volume (mL)" name="volume_ml"><input type="number" placeholder="0" value={form.volume_ml} onChange={(e) => setForm({ ...form, volume_ml: e.target.value })} className="bg-gray-50 border dark:text-gray-700 border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="Date Received" name="date_received"><input type="date" value={form.date_received} onChange={(e) => setForm({ ...form, date_received: e.target.value })} className="bg-gray-50 dark:text-gray-700 border border-gray-300 px-3 h-11 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500"/></InputField>
                            <InputField label="Date Expired" name="date_expired">
                                <input 
                                    type="date" 
                                    value={form.date_expired} 
                                    readOnly 
                                    disabled 
                                    className="bg-gray-200 border dark:text-gray-700 border-gray-300 px-3 h-11 rounded-lg w-full cursor-not-allowed"
                                />
                            </InputField>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition">Cancel</button>
                            <button onClick={onSave} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 font-semibold text-white transition">Add Stock</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QrModal({ qrData, onClose, onPrint }: { qrData: string, onClose: () => void, onPrint: () => void }) {
    if (!qrData) return null;
    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60]">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm w-full">
                <h2 className="text-xl font-bold mb-2 text-gray-800">Donation Added Successfully</h2>
                <p className="text-sm text-gray-500 mb-6">Print the QR code and attach it to the blood bag.</p>
                <div id="qr-code-to-print">
                    <QRCodeCanvas value={qrData} size={220} id="qr-code-canvas" className="mx-auto border-4 p-2 rounded-lg" />
                    <div className="mt-6 text-sm text-gray-800 space-y-2 text-left bg-gray-50 p-4 rounded-lg">
                        <p><span className="font-semibold">Blood Bag ID:</span> {qrData?.match(/Blood Bag ID: (.*)/)?.[1]}</p>
                        <p><span className="font-semibold">Donor ID:</span> {qrData?.match(/Donor ID: (.*)/)?.[1]}</p>
                    </div>
                </div>
                <div className="mt-6 flex gap-3 justify-center">
                    <button onClick={onClose} className="w-full px-4 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition">Close</button>
                    <button onClick={onPrint} className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-lg transition">Print QR Code</button>
                </div>
            </div>
        </div>
    );
}

//========================================================//
// 4. MAIN PAGE COMPONENT                                 //
//========================================================//
export default function ManageInventory() {
  const [bloodStocks, setBloodStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ user_id: "", type: "", component: "", units: "", volume_ml: "", date_received: "", date_expired: "" , campaign_id: ""});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [selectedQr, setSelectedQr] = useState<string>("");
  const [donors, setDonors] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchInventory = async (currentUser: any) => {
    setLoading(true);
    if (!currentUser) { setLoading(false); return; }
    const { data: profile } = await supabase.from("users").select("user_id").eq("email", currentUser.email).single();
    if (!profile) { setLoading(false); return; }
    const staffUserId = profile.user_id;
    const { data, error } = await supabase.from("blood_inventory").select("*").eq("added_by", staffUserId).order("inserted_at", { ascending: false });
    if (error) { console.error(error); } else { setBloodStocks(data || []); }
    setLoading(false);
  };

  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user) {
        fetchInventory(user);
      } else {
        setLoading(false);
      }
    };
    fetchUserAndData();
  }, []);

  const addInventory = async () => {
    if (!form.user_id || !form.type || !form.component || !form.units || !form.volume_ml || !form.date_received || !form.date_expired) {
        Swal.fire("Error", "Please fill in all fields including donor.", "error"); return;
    }
    const bloodBagId = generateBloodBagId();
    let addedByUserId = null;
    if (currentUser) {
        const { data: profile } = await supabase.from("users").select("user_id").eq("email", currentUser.email).single();
        if (!profile) { Swal.fire("Error", "Current user not found.", "error"); return; }
        addedByUserId = profile.user_id;
    }
    const qrPayload = `Blood Bag ID: ${bloodBagId}\nDonor ID: ${form.user_id}\nBlood Type: ${form.type}\nComponent: ${form.component}\nUnits: ${form.units}\nVolume: ${form.volume_ml}ml\nDate Received: ${form.date_received}\nExpiration: ${form.date_expired}\nLocation: Red Cross`;
    const { data: newStock, error: stockError } = await supabase.from("blood_inventory").insert([{ blood_bag_id: bloodBagId, user_id: form.user_id, type: form.type, component: form.component, units: parseInt(form.units), volume_ml: parseInt(form.volume_ml), date_received: form.date_received, expiration_date: form.date_expired, qr_data: qrPayload, added_by: addedByUserId, status: "Available", campaign_id: form.campaign_id || null }]).select().single();
    if (stockError) { Swal.fire("Error", stockError.message, "error"); return; }
    await supabase.from("blood_journey").insert([{ user_id: form.user_id, donation_id: newStock.id, stage: 1, location: "Red Cross" }]);
    setSelectedQr(qrPayload);
    setQrModalOpen(true);
    setForm({ user_id: "",campaign_id: "", type: "", component: "", units: "", volume_ml: "", date_received: "", date_expired: "" });
    setSearch("");
    setAddModalOpen(false);
    fetchInventory(currentUser);
  };

  const generateBloodBagId = () => Math.floor(1000000000 + Math.random() * 9000000000).toString();
  
  const deleteInventory = async (id: string) => {
    const result = await Swal.fire({ title: "Are you sure?", text: "This record will be permanently deleted.", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Yes, delete it!" });
    if (result.isConfirmed) {
        const { error } = await supabase.from("blood_inventory").delete().eq("id", id);
        if (error) { Swal.fire("Error", error.message, "error"); }
        else { Swal.fire("Deleted!", "The record has been deleted.", "success"); fetchInventory(currentUser); }
    }
  };

  const exportPDF = async () => {
        if (bloodStocks.length === 0) {
            Swal.fire('No Data', 'There is no inventory data to export.', 'info');
            return;
        }
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const today = new Date();
        const currentMonthName = today.toLocaleString('default', { month: 'long' });
        const currentYear = today.getFullYear();
        const totalUnits = bloodStocks.reduce((sum, stock) => sum + stock.units, 0);
        const unitsByType = bloodTypes.map(type => {
            const total = bloodStocks
                .filter(stock => stock.type === type)
                .reduce((sum, stock) => sum + stock.units, 0);
            return { type, total };
        });
        const unitsByComponent = components.map(comp => {
            const total = bloodStocks
                .filter(stock => stock.component === comp)
                .reduce((sum, stock) => sum + stock.units, 0);
            return { component: comp, total };
        });
        const donationsThisMonth = bloodStocks.filter(stock => {
            const receivedDate = new Date(stock.date_received);
            return receivedDate.getMonth() === today.getMonth() && receivedDate.getFullYear() === today.getFullYear();
        }).length;
        let mostDonated = { type: 'N/A', total: 0 };
        let leastDonated = { type: 'N/A', total: Infinity };

        unitsByType.forEach(item => {
            if (item.total > mostDonated.total) {
                mostDonated = item;
            }
            if (item.total < leastDonated.total) {
                leastDonated = item;
            }
        });


        // --- 2. GENERATE THE PDF DOCUMENT ---
        
        // Header
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Blood Inventory Report', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${today.toLocaleDateString()}`, pageWidth / 2, 28, { align: 'center' });

        // General Summary Table
        autoTable(doc, {
            startY: 40,
            head: [['Overall Summary', 'Value']],
            body: [
                ['Total Blood Units Available', totalUnits],
                [`Donations This Month (${currentMonthName})`, donationsThisMonth],
                ['Most Common Blood Type', `${mostDonated.type} (${mostDonated.total} units)`],
                ['Least Common Blood Type', `${leastDonated.type} (${leastDonated.total} units)`],
            ],
            theme: 'grid',
            headStyles: { fillColor: [209, 36, 42] }
        });

        // Units by Blood Type Table
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 10,
            head: [['Blood Type', 'Total Units']],
            body: unitsByType.map(item => [item.type, item.total]),
            theme: 'striped',
            headStyles: { fillColor: [209, 36, 42] }
        });

        // Units by Component Table
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 10,
            head: [['Blood Component', 'Total Units']],
            body: unitsByComponent.map(item => [item.component, item.total]),
            theme: 'striped',
            headStyles: { fillColor: [209, 36, 42] }
        });
        doc.save(`Inventory_Report_${currentMonthName}_${currentYear}.pdf`);
    };

  useEffect(() => {
    const fetchDonors = async () => {
      const { data, error } = await supabase.from("users").select("user_id, name, email").eq("role", "Donor");
      if (error) { console.error(error); } else { setDonors(data || []); }
    };
    fetchDonors();
  }, []);

  useEffect(() => {
    if (form.component && form.date_received) {
        const startDate = new Date(form.date_received);
        const expirationDate = new Date(startDate);
        switch (form.component) {
            case 'RBC':
                expirationDate.setDate(startDate.getDate() + 42);
                break;
            case 'Plasma':
                expirationDate.setFullYear(startDate.getFullYear() + 1);
                break;
            case 'Platelets':
                expirationDate.setDate(startDate.getDate() + 7);
                break;
            case 'WBCs':
                expirationDate.setDate(startDate.getDate() + 1);
                break;
            default:
                return; // Do nothing if component is not recognized
        }

        // Format the date to "YYYY-MM-DD" for the input field
        const formattedDate = expirationDate.toISOString().split('T')[0];

        // Update the form state with the new expiration date
        setForm((prevForm: any) => ({
            ...prevForm,
            date_expired: formattedDate
        }));
    }
}, [form.component, form.date_received, setForm]); // This effect runs when these values change

const [campaigns, setCampaigns] = useState<any[]>([]); // Add this line

useEffect(() => {
    const fetchDonorsAndCampaigns = async () => {
      // This part for donors already exists
      const { data: donorData, error: donorError } = await supabase.from("users").select("user_id, name, email").eq("role", "Donor");
      if (donorError) { console.error(donorError); } else { setDonors(donorData || []); }
      const { data: campaignData, error: campaignError } = await supabase.from("blood_campaigns").select("id, title").order('date', { ascending: false });
      if (campaignError) { console.error(campaignError); } else { setCampaigns(campaignData || []); }
    };
    fetchDonorsAndCampaigns();
}, []);

  const bloodTypes = ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"];
  const components = ["RBC", "Plasma", "Platelets", "WBCs"];
  const summaryData = bloodTypes.map((type) => ({ type, totalUnits: bloodStocks.filter((b) => b.type === type).reduce((sum, b) => sum + b.units, 0) }));
  const chartData = bloodTypes.map((type) => {
    const data: any = { type };
    components.forEach((comp) => { 
        const cleanComp = comp.endsWith('s') ? comp.slice(0, -1) : comp;
        data[comp] = bloodStocks.filter((b) => b.type === type && b.component === cleanComp).reduce((sum, b) => sum + b.units, 0);
    });
    return data;
  });
  
  const openQrModal = (stock: any) => { setSelectedQr(stock.qr_data); setQrModalOpen(true); };
  const closeQrModal = () => { setQrModalOpen(false); setSelectedQr(""); };
  const printQr = () => {
    const qrElement = document.getElementById("qr-code-to-print");
    if (!qrElement) return;

    html2canvas(qrElement).then(canvas => {
        const qrDataUrl = canvas.toDataURL("image/png");
        const printWindow = window.open("", "_blank");
        if (printWindow) {
            printWindow.document.write(`<html><head><title>Print QR Code</title></head><body style="text-align:center; margin-top: 20px;"><img src="${qrDataUrl}" style="width:200px;"/><script>window.onload=function(){window.print();window.close();}</script></body></html>`);
            printWindow.document.close();
        }
    });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full transition-all duration-300 md:ml-72">
        <BloodbankHeader toggleSidebar={toggleSidebar} />
        <main className="mt-20 p-4 md:p-8">
          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
              
                 <button onClick={exportPDF} className="w-full md:w-auto px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-sm transition">Inventory Report</button>
                 <button onClick={() => setAddModalOpen(true)} className="w-full md:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm transition">+ New Stock</button>
              
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8" id="inventory-summary">
            {summaryData.map((s) => (<div key={s.type} className="bg-white border-2 border-red-100 text-red-800 rounded-xl p-4 text-center shadow-sm"><div className="text-2xl font-bold">{s.totalUnits}</div><div className="text-sm font-semibold text-red-600">{s.type}</div></div>))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-6" id="inventory-table">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">All Blood Stocks</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[1000px]">
                      <thead className="bg-gray-50"><tr className="text-left text-gray-500 uppercase text-xs font-semibold"><th className="p-4">Bag ID</th><th className="p-4">Donor ID</th><th className="p-4 text-center">Type</th><th className="p-4">Component</th><th className="p-4 text-center">Units</th><th className="p-4">Expiration</th><th className="p-4 text-center">Status</th><th className="p-4 text-center">Actions</th></tr></thead>
                      <tbody className="divide-y divide-gray-200">
                        {loading ? (<tr><td colSpan={8} className="text-center p-8 text-gray-500">Loading...</td></tr>) : 
                        bloodStocks.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="p-4 font-mono text-gray-700">{b.blood_bag_id}</td><td className="p-4 font-mono text-gray-700">{b.user_id}</td><td className="p-4 text-center font-semibold text-red-600">{b.type}</td><td className="p-4 dark:text-gray-700">{b.component}</td><td className="p-4 dark:text-gray-700 text-center font-semibold">{b.units}</td><td className="p-4 text-gray-600">{b.expiration_date}</td><td className="p-4 text-center"><StatusBadge status={b.status} expiration_date={b.expiration_date} /></td>
                            <td className="p-4 flex justify-center gap-2">
                                <button onClick={() => openQrModal(b)} className="flex items-center gap-1 bg-gray-600 hover:bg-gray-700 px-3 py-1.5 rounded text-white text-xs font-semibold transition"><QrCodeIcon/> QR</button>
                                <button onClick={() => deleteInventory(b.id)} title="Delete" className="p-1.5 text-red-600 hover:bg-red-100 rounded-md"><DeleteIcon /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              </div>
          </div>
        </main>
      </div>
      {qrModalOpen && <QrModal qrData={selectedQr} onClose={closeQrModal} onPrint={printQr} />}
      {addModalOpen && <AddInventoryModal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}  onSave={addInventory} form={form} setForm={setForm} donors={donors} search={search} setSearch={setSearch} campaigns={campaigns}/>}
    </div>
  );
}