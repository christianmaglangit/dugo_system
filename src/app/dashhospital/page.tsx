'use client';

import { useEffect, useState, FC, ReactNode } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

//========================================================//
// 1. ICONS                                               //
//========================================================//
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>;
const InventoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const RequestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.5 10a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /><path d="M10 2a.75.75 0 00-7.465 5.222.75.75 0 001.478.204A6.5 6.5 0 0110 3.5a.75.75 0 000-1.5zM3.28 8.243a6.5 6.5 0 0111.41-3.662.75.75 0 101.246-.828A8 8 0 002.09 7.648a.75.75 0 101.19.595z" /></svg>;
const ScanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM2 10a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 012 10zm13.5 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /><path d="M4 5a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm1 3a1 1 0 000 2h8a1 1 0 100-2H5zm1 3a1 1 0 100 2h5a1 1 0 100-2H6z" /></svg>;
const NearbyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.69 18.23a2.25 2.25 0 003.62 0l4.5-6.75a.75.75 0 00-1.12-1.12L13 13.88V4.75a.75.75 0 00-1.5 0v9.13L8.33 10.36a.75.75 0 00-1.12 1.12l2.48 3.75z" clipRule="evenodd" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const ChevronDownIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm-1.558 4.078a.75.75 0 00-1.06 1.06 5.25 5.25 0 007.238 0 .75.75 0 00-1.06-1.06 3.75 3.75 0 01-5.117 0zM15.625 9a2.375 2.375 0 100-4.75 2.375 2.375 0 000 4.75zM12.5 10.75a.75.75 0 00-1.06 1.06 5.25 5.25 0 007.238 0 .75.75 0 00-1.06-1.06 3.75 3.75 0 01-5.117 0z" /></svg>;

//========================================================//
// 2. CHILD COMPONENTS                                    //
//========================================================//

function HospitalSidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();
  const sidelinks = [
    { name: "Dashboard", href: "/dashhospital", icon: <DashboardIcon /> },
    { name: "Scan Blood Bag", href: "/dashhospital/scan_blood_bag", icon: <ScanIcon /> },
    { name: "Blood Inventory", href: "/dashhospital/blood_inventory", icon: <InventoryIcon /> },
    { name: "Blood Request", href: "/dashhospital/blood_request", icon: <RequestIcon /> },
    { name: "Nearby Blood Record", href: "/dashhospital/near_blood_bag", icon: <NearbyIcon /> },
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
          {sidelinks.map((link) => (
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

function HospitalHeader({ name, onMenuClick }: { name: string, onMenuClick: () => void }) {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-b border-gray-200/80 flex items-center justify-between px-6 z-40 md:left-72">
        <div className="flex items-center gap-4">
            <button onClick={onMenuClick} className="md:hidden dark:text-gray-700 p-2 -ml-2 rounded-full hover:bg-gray-100"><MenuIcon /></button>
            <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
        </div>
      <div className="flex items-center gap-4 dark:text-gray-700">
        <div className="relative">
            <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
                <span className="font-semibold text-gray-700 text-sm hidden sm:inline">{name}</span>
                <ChevronDownIcon />
            </button>
            {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-xl z-50 border overflow-hidden">
                    <div className="p-3 border-b">
                        <p className="font-semibold text-sm">{name}</p>
                        <p className="text-xs text-gray-500">Hospital Staff</p>
                    </div>
                    <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
                </div>
            )}
        </div>
      </div>
    </header>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl shadow-lg p-6 bg-white text-black ${className || ""}`}>{children}</div>;
}

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

//========================================================//
// 3. MAIN DASHBOARD COMPONENT                            //
//========================================================//
export default function DashHospital() {
  const [user, setUser] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [bloodData, setBloodData] = useState<{ type: string; RBC: number; Plasma: number; Platelets: number; WBC: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

 useEffect(() => {
    const getUserAndData = async () => {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        console.error("User not found, middleware might have an issue.");
        setLoading(false);
        return; 
      }
      const { data: profile, error } = await supabase
        .from("users")
        .select("name, user_id") 
        .eq("id", authUser.id)
        .single();
      
      if (profile) {
        setUser(profile);
        const staffUserId = profile.user_id;
  
        const [invData, reqData, patData] = await Promise.all([
            supabase.from("blood_inventory").select("*").eq("added_by", staffUserId),
            supabase.from("blood_requests").select("*"),
            supabase.from("patients").select("*")
        ]);
  
        // ... a a g ubang code para sa data processing ...
      } else {
        console.error("Failed to fetch hospital profile:", error);
      }
      
      setLoading(false);
    };

    getUserAndData();
}, []); // Pwede na tanggalon ang 'router' sa dependency array
  
  const totalUnits = bloodData.reduce((acc, cur) => acc + (cur.RBC || 0) + (cur.Plasma || 0) + (cur.Platelets || 0) + (cur.WBC || 0), 0);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <HospitalSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="w-full transition-all duration-300 md:ml-72">
        {user && <HospitalHeader name={user.name} onMenuClick={() => setIsSidebarOpen(true)} />}
        <main className="mt-20 p-4 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total Units in Stock" value={totalUnits} icon={<InventoryIcon />} color="bg-red-500" />
                <StatCard title="Pending Requests" value={requests.filter(r => r.status === 'Pending').length} icon={<RequestIcon />} color="bg-yellow-500" />
                <StatCard title="Total Patients" value={patients.length} icon={<UsersIcon />} color="bg-blue-500" />
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Blood Inventory by Type</h2>
                        <div className="w-full h-96">
                        {loading ? <p className="text-center text-gray-500">Loading chart...</p> : (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bloodData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <XAxis dataKey="type" stroke="#6b7280" fontSize={12} />
                                <YAxis stroke="#6b7280" fontSize={12} />
                                <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "0.5rem" }} />
                                <Legend />
                                <Bar dataKey="RBC" name="RBC" stackId="a" fill="#ef4444" />
                                <Bar dataKey="Plasma" name="Plasma" stackId="a" fill="#3b82f6" />
                                <Bar dataKey="Platelets" name="Platelets" stackId="a" fill="#facc15" />
                                <Bar dataKey="WBC" name="WBC" stackId="a" fill="#10b981" />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2 space-y-6">
                     <Card>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="flex flex-col space-y-3">
                            <Link href="/dashhospital/blood_request" className="text-center w-full py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">Make a Blood Request</Link>
                            <Link href="/dashhospital/blood_inventory" className="text-center w-full py-2.5 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition">View Full Inventory</Link>
                        </div>
                    </Card>
                    <Card>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Requests Status</h2>
                        <div className="space-y-2">
                           {["Pending", "Approved", "Rejected"].map(status => (
                             <div key={status} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                               <span className="font-semibold text-gray-600">{status}</span>
                               <span className={`font-bold px-2 py-0.5 rounded-full text-xs ${
                                    status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                                    status === "Approved" ? "bg-green-100 text-green-800" :
                                    "bg-red-100 text-red-800"
                               }`}>{requests.filter(r => r.status === status).length}</span>
                             </div>
                           ))}
                        </div>
                    </Card>
                </div>
            </div>
        </main>
      </div>
    </div>
  )
}