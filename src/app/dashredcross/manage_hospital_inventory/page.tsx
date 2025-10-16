"use client";

import { useState, useEffect, FC, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

//========================================================//
// 1. ICONS                                               //
//========================================================//
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.558 4.078a.75.75 0 00-1.06 1.06 5.25 5.25 0 007.238 0 .75.75 0 00-1.06-1.06 3.75 3.75 0 01-5.117 0zM15.625 9a2.375 2.375 0 100-4.75 2.375 2.375 0 000 4.75zM12.5 10.75a.75.75 0 00-1.06 1.06 5.25 5.25 0 007.238 0 .75.75 0 00-1.06-1.06 3.75 3.75 0 01-5.117 0z" /></svg>;
const AppointmentIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;
const ReportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.25 2a.75.75 0 00-1.5 0v1.361A8.96 8.96 0 002.57 6.38a.75.75 0 001.362.614A7.46 7.46 0 0110 4.5c2.993 0 5.542 1.72 6.822 4.108a.75.75 0 001.362-.614A8.96 8.96 0 0011.25 3.361V2zM2.5 10a.75.75 0 01.75-.75h14a.75.75 0 010 1.5h-14a.75.75 0 01-.75-.75zm0 4.25a.75.75 0 001.362.614 7.46 7.46 0 0112.276 0 .75.75 0 101.362-.614A8.96 8.96 0 0010 12.5a8.96 8.96 0 00-7.43 3.138z" clipRule="evenodd" /></svg>;
const RequestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.5 10a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /><path d="M10 2a.75.75 0 00-7.465 5.222.75.75 0 001.478.204A6.5 6.5 0 0110 3.5a.75.75 0 000-1.5zM3.28 8.243a6.5 6.5 0 0111.41-3.662.75.75 0 101.246-.828A8 8 0 002.09 7.648a.75.75 0 101.19.595z" /></svg>;
const CampaignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M3.5 2.75a.75.75 0 00-1.5 0v14.5a.75.75 0 001.5 0V2.75z" /><path d="M18.25 3.5a.75.75 0 00-1.5 0v1.636a.25.25 0 01-.25.25H6.5a.75.75 0 000 1.5h10a1.75 1.75 0 001.75-1.75V3.5z" /></svg>;
const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zm13.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /><path d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 000 2h8a1 1 0 100-2H5zm1 3a1 1 0 100 2h5a1 1 0 100-2H6z" /></svg>;
const HospitalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.75 2.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" /><path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0zm8-7a7 7 0 100 14 7 7 0 000-14z" clipRule="evenodd" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" /></svg>;
const BuildingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v12a1 1 0 11-2 0V3a1 1 0 011-1zm3 1a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 11-2 0V4H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>;

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
            <p className="text-xs text-gray-600 font-medium">
              (Donor Utility for Giving and Organizing)
            </p>
          </div>
          <button onClick={onClose} className="md:hidden p-2 rounded-full hover:bg-gray-100">
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
                <h1 className="text-xl font-bold text-gray-800">Hospital Blood Inventory</h1>
            </div>
            <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">Logout</button>
        </header>
    );
}

const Card: FC<{ children: ReactNode; className?: string }> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-lg p-6 ${className || ""}`}>{children}</div>
);

// --- UPDATED StatCard Component ---
const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: ReactNode, color: string }) => (
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

//========================================================//
// 3. MAIN PAGE COMPONENT                                 //
//========================================================//
interface BloodInventory {
  id: string;
  type: string;
  component: string;
  units: number;
  volume_ml: number;
  expiration_date: string;
  status: string;
  date_received: string;
  blood_bag_id: string;
  added_by: string | null;
}

export default function HospitalBloodInventoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bloodData, setBloodData] = useState<BloodInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchBlood = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("blood_inventory").select("*").ilike("added_by", "H%").order("date_received", { ascending: false });
      if (error) { console.error("Error fetching blood inventory:", error); } 
      else { setBloodData(data || []); }
      setLoading(false);
    };
    fetchBlood();
  }, []);
  
  const filteredData = bloodData.filter((blood) => {
    const term = searchTerm.toLowerCase();
    return (
      blood.type.toLowerCase().includes(term) ||
      (blood.added_by && blood.added_by.toLowerCase().includes(term)) ||
      (blood.blood_bag_id && blood.blood_bag_id.toLowerCase().includes(term))
    );
  });
  
  // --- Calculate stats for cards ---
  const totalUnits = filteredData.reduce((sum, item) => sum + item.units, 0);
  const uniqueHospitals = [...new Set(filteredData.map(item => item.added_by))].length;
  const expiringSoon = filteredData.filter(item => {
      const expDate = new Date(item.expiration_date);
      const today = new Date();
      const sevenDaysFromNow = new Date(today);
      sevenDaysFromNow.setDate(today.getDate() + 7);
      return expDate > today && expDate <= sevenDaysFromNow && item.status !== 'Used';
  }).length;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <BloodbankSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 w-full transition-all duration-300 md:ml-72">
        <BloodbankHeader toggleSidebar={toggleSidebar} />
        <main className="mt-20 p-4 md:p-8">

            {/* --- Stat Cards --- UPDATED with color prop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Hospital Units" value={totalUnits} icon={<InventoryIcon />} color="bg-blue-500" />
                <StatCard title="Hospitals Reporting" value={uniqueHospitals} icon={<BuildingIcon />} color="bg-purple-500" />
                <StatCard title="Units Expiring in 7 Days" value={expiringSoon} icon={<ClockIcon />} color="bg-yellow-500" />
            </div>

            <Card>
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="w-full md:w-auto md:flex-grow">
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" /></svg></span>
                    <input type="text" placeholder="Search by type, hospital, or blood bag ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-red-400"/>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr className="text-left text-gray-500 uppercase text-xs font-semibold">
                      <th className="p-4">Blood Bag ID</th>
                      <th className="p-4">Hospital ID</th>
                      <th className="p-4 text-center">Type</th>
                      <th className="p-4">Component</th>
                      <th className="p-4 text-center">Units</th>
                      <th className="p-4">Date Received</th>
                      <th className="p-4">Expiration</th>
                      <th className="p-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {loading ? (<tr><td colSpan={8} className="text-center p-8 text-gray-500">Loading...</td></tr>) : 
                    filteredData.length === 0 ? (<tr><td colSpan={8} className="text-center p-8 text-gray-500">No records found.</td></tr>) : 
                    (
                        filteredData.map((blood) => (
                          <tr key={blood.id} className="hover:bg-gray-50">
                            <td className="p-4 font-mono text-gray-700">{blood.blood_bag_id}</td>
                            <td className="p-4 font-mono text-gray-700">{blood.added_by}</td>
                            <td className="p-4 text-center font-semibold text-red-600">{blood.type}</td>
                            <td className="p-4">{blood.component}</td>
                            <td className="p-4 text-center font-semibold">{blood.units}</td>
                            <td className="p-4 text-gray-600">{new Date(blood.date_received).toLocaleDateString()}</td>
                            <td className="p-4 text-gray-600">{new Date(blood.expiration_date).toLocaleDateString()}</td>
                            <td className="p-4 text-center"><StatusBadge status={blood.status} expiration_date={blood.expiration_date} /></td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
        </main>
      </div>
    </div>
  );
}